import { verifierJournal } from './journal.ts'
import type { Registre } from './registre.ts'
import { MANIFESTATIONS_PHYSIQUES, type Anomalie, type Realite, type TypePreuve, type TypeRelation } from './types.ts'

/**
 * Le système ne conclut jamais « erreur ». Il signale une anomalie et demande
 * une vérification : c'est à l'humain de trancher.
 */
const VERIFIER = 'Anomalie détectée — vérification nécessaire.'

export interface RegleRelation {
  nom: string
  concerne: (r: Realite) => boolean
  relation: TypeRelation
  /** Genre attendu au bout de la relation. */
  cible?: string
  suggestion: string
}

export interface ReglePreuve {
  nom: string
  concerne: (r: Realite) => boolean
  preuve: TypePreuve
  suggestion: string
}

const estFacture = (r: Realite) => r.sousType?.startsWith('facture') ?? false
const aEteDansEtat = (r: Realite, etat: string) => r.historiqueEtats.some(c => c.vers === etat)

export const REGLES_RELATIONS: RegleRelation[] = [
  {
    nom: 'facture payée → paiement',
    concerne: r => estFacture(r) && aEteDansEtat(r, 'paye'),
    relation: 'paye-par',
    cible: 'paiement',
    suggestion: 'Relier la facture au paiement correspondant (relation « paye-par »).',
  },
]

export const REGLES_PREUVES: ReglePreuve[] = [
  {
    nom: 'paiement → justificatif bancaire',
    concerne: r => r.genre === 'paiement',
    preuve: 'transaction-bancaire',
    suggestion: 'Associer la ligne du relevé bancaire qui justifie ce paiement.',
  },
  {
    nom: 'document vérifié → validation humaine',
    concerne: r => r.genre === 'document' && aEteDansEtat(r, 'verifie'),
    preuve: 'validation-humaine',
    suggestion: 'Indiquer qui a vérifié le document et quand.',
  },
]

/** « 1 250,00 € » → 1250 ; renvoie la chaîne normalisée si ce n'est pas un nombre. */
export function normaliserValeur(v: string | number | boolean): string | number {
  if (typeof v === 'number') return v
  if (typeof v === 'boolean') return String(v)
  const brut = v.replace(/[\s  €$£]/g, '')
  const chiffre = /^-?\d+([.,]\d+)?$/.test(brut) ? Number(brut.replace(',', '.')) : NaN
  return Number.isNaN(chiffre) ? v.trim().toLowerCase() : chiffre
}

const nom = (r: Realite) => {
  const ref = r.referencesExternes[0]
  return ref ? `${r.id} (${ref.valeur})` : r.id
}

function incoherences(r: Realite): Anomalie[] {
  const sources: { qui: string; confiance: number; donnees: Realite['attributs'] }[] = [
    ...r.manifestations.map(m => ({ qui: `${m.type} ${m.id}`, confiance: m.confiance, donnees: m.donnees })),
  ]
  if (Object.keys(r.attributs).length > 0) sources.push({ qui: 'attributs saisis', confiance: 0.7, donnees: r.attributs })

  const cles = new Set(sources.flatMap(s => Object.keys(s.donnees)))
  const anomalies: Anomalie[] = []
  for (const cle of cles) {
    const lectures = sources
      .filter(s => s.donnees[cle] !== undefined)
      .map(s => ({ ...s, valeur: normaliserValeur(s.donnees[cle]) }))
    const distinctes = new Set(lectures.map(l => String(l.valeur)))
    if (distinctes.size < 2) continue
    const fiable = [...lectures].sort((a, b) => b.confiance - a.confiance)[0]
    anomalies.push({
      code: 'incoherence-valeur',
      gravite: 'critique',
      realiteIds: [r.id],
      message:
        `${nom(r)} : « ${cle} » diffère selon les manifestations — ` +
        lectures.map(l => `${l.valeur} (${l.qui}, confiance ${l.confiance})`).join(' / ') +
        `. ${VERIFIER}`,
      suggestion: `Contrôler sur la source la plus fiable (${fiable.qui}) puis corriger la manifestation erronée.`,
    })
  }
  return anomalies
}

function doublons(realites: readonly Realite[]): Anomalie[] {
  const anomalies: Anomalie[] = []
  const groupes = new Map<string, Realite[]>()
  for (const r of realites) {
    for (const ref of r.referencesExternes) {
      const cle = [r.genre, r.sousType ?? '', ref.cle, ref.valeur.trim().toLowerCase(), (ref.emetteur ?? '').toLowerCase()].join('|')
      groupes.set(cle, [...(groupes.get(cle) ?? []), r])
    }
  }
  for (const [cle, groupe] of groupes) {
    if (groupe.length < 2) continue
    const [, , refCle, valeur] = cle.split('|')
    anomalies.push({
      code: 'doublon-potentiel',
      gravite: 'attention',
      realiteIds: groupe.map(r => r.id),
      message: `${groupe.map(r => r.id).join(' et ')} portent la même référence ${refCle} « ${valeur} ». ${VERIFIER}`,
      suggestion: 'Comparer les originaux : copie, nouvelle version, ou vrai doublon à fusionner ?',
    })
  }

  for (const r of realites) {
    const originaux = r.manifestations.filter(m => m.type === 'physique-original')
    if (originaux.length > 1) {
      anomalies.push({
        code: 'doublon-potentiel',
        gravite: 'attention',
        realiteIds: [r.id],
        message: `${originaux.length} documents physiques originaux sont rattachés à ${nom(r)}. ${VERIFIER}`,
        suggestion: 'Un seul original peut exister : requalifier les autres en copies ou en réalités distinctes.',
      })
    }
  }

  const parFichier = new Map<string, Set<string>>()
  for (const r of realites) {
    for (const m of r.manifestations) {
      if (m.empreinteFichier) parFichier.set(m.empreinteFichier, (parFichier.get(m.empreinteFichier) ?? new Set()).add(r.id))
    }
  }
  for (const ids of parFichier.values()) {
    if (ids.size < 2) continue
    anomalies.push({
      code: 'doublon-potentiel',
      gravite: 'attention',
      realiteIds: [...ids],
      message: `Le même fichier (même empreinte SHA-256) est rattaché à ${[...ids].join(' et ')}. ${VERIFIER}`,
      suggestion: 'Rattacher le fichier à la seule réalité qu’il représente.',
    })
  }
  return anomalies
}

function tracabilite(r: Realite): Anomalie[] {
  const anomalies: Anomalie[] = []
  const physiques = r.manifestations.filter(m => MANIFESTATIONS_PHYSIQUES.includes(m.type))
  const original = r.manifestations.some(m => m.type === 'physique-original')
  const numeriques = r.manifestations.filter(m => !MANIFESTATIONS_PHYSIQUES.includes(m.type))

  if (r.emplacement?.introuvable) {
    anomalies.push({
      code: 'rupture-tracabilite',
      gravite: 'critique',
      realiteIds: [r.id],
      message: `${nom(r)} : l'original est introuvable à son emplacement (${r.emplacement.rangement.join(' → ') || 'non défini'}). ${VERIFIER}`,
      suggestion: 'Rechercher dans les emplacements voisins et l’historique des déplacements, puis mettre à jour l’emplacement.',
    })
  } else if (original && !r.emplacement) {
    anomalies.push({
      code: 'rupture-tracabilite',
      gravite: 'attention',
      realiteIds: [r.id],
      message: `${nom(r)} : l'original physique existe mais aucun emplacement n'est enregistré. ${VERIFIER}`,
      suggestion: 'Ranger l’original et enregistrer son emplacement (voir « proposer emplacement »).',
    })
  }
  if (r.physiqueAttendu && physiques.length === 0 && numeriques.length > 0) {
    anomalies.push({
      code: 'rupture-tracabilite',
      gravite: 'attention',
      realiteIds: [r.id],
      message: `${nom(r)} est enregistrée numériquement mais aucun document physique n'a été constaté. ${VERIFIER}`,
      suggestion: 'Retrouver l’original et le déclarer, ou indiquer qu’il n’existe pas sous forme physique.',
    })
  }
  if (physiques.length > 0 && numeriques.length === 0) {
    anomalies.push({
      code: 'realite-non-integree',
      gravite: 'info',
      realiteIds: [r.id],
      message: `${nom(r)} existe physiquement mais n'a encore aucune représentation numérique : nouvelle réalité à intégrer.`,
      suggestion: 'Photographier ou scanner l’original, puis saisir ou extraire (OCR) ses données.',
    })
  }
  if (original && r.marquages.length === 0) {
    anomalies.push({
      code: 'marquage-absent',
      gravite: 'info',
      realiteIds: [r.id],
      message: `${nom(r)} : rien n'est inscrit sur l'original pour le relier au système.`,
      suggestion: `Inscrire ${r.id} ou coller son QR code sur l’original (voir « proposer marquage »).`,
    })
  }
  for (const c of r.historiqueEtats.filter(c => c.force)) {
    anomalies.push({
      code: 'transition-forcee',
      gravite: 'attention',
      realiteIds: [r.id],
      message: `${nom(r)} : passage inhabituel ${c.de} → ${c.vers} le ${c.le.slice(0, 10)}${c.par ? ` par ${c.par}` : ''}. ${VERIFIER}`,
      suggestion: 'Confirmer que ce changement reflète bien la réalité.',
    })
  }
  return anomalies
}

function reglesManquantes(registre: Registre, r: Realite, rr: RegleRelation[], rp: ReglePreuve[]): Anomalie[] {
  const anomalies: Anomalie[] = []
  for (const regle of rr.filter(x => x.concerne(r))) {
    const ok = registre.relations.some(
      rel => rel.de === r.id && rel.type === regle.relation && (!regle.cible || registre.chercher(rel.vers)?.genre === regle.cible),
    )
    if (!ok) {
      anomalies.push({
        code: 'relation-manquante',
        gravite: 'attention',
        realiteIds: [r.id],
        message: `${nom(r)} : relation « ${regle.relation} » attendue (${regle.nom}) mais absente. ${VERIFIER}`,
        suggestion: regle.suggestion,
      })
    }
  }
  for (const regle of rp.filter(x => x.concerne(r))) {
    if (!r.preuves.some(p => p.type === regle.preuve)) {
      const montant = r.attributs.montant !== undefined ? ` de ${r.attributs.montant}` : ''
      anomalies.push({
        code: 'preuve-manquante',
        gravite: 'attention',
        realiteIds: [r.id],
        message: `${nom(r)}${montant} : aucune preuve « ${regle.preuve} » associée (${regle.nom}). ${VERIFIER}`,
        suggestion: regle.suggestion,
      })
    }
  }
  return anomalies
}

const ORDRE = { critique: 0, attention: 1, info: 2 } as const

export function detecterAnomalies(
  registre: Registre,
  o: { reglesRelations?: RegleRelation[]; reglesPreuves?: ReglePreuve[] } = {},
): Anomalie[] {
  const rr = o.reglesRelations ?? REGLES_RELATIONS
  const rp = o.reglesPreuves ?? REGLES_PREUVES
  const anomalies: Anomalie[] = [...doublons(registre.realites)]
  for (const r of registre.realites) {
    anomalies.push(...incoherences(r), ...tracabilite(r), ...reglesManquantes(registre, r, rr, rp))
  }
  const altere = verifierJournal([...registre.journal])
  if (altere !== null) {
    anomalies.push({
      code: 'journal-altere',
      gravite: 'critique',
      realiteIds: [],
      message: `Le journal a été modifié hors du système à partir de l'événement n° ${altere}. ${VERIFIER}`,
      suggestion: 'Restaurer une sauvegarde du registre et comparer.',
    })
  }
  return anomalies.sort((a, b) => ORDRE[a.gravite] - ORDRE[b.gravite])
}

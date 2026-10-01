import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import {
  analyserLacunes,
  comparerStrategies,
  detecterAnomalies,
  extrairePassages,
  idDepuisQr,
  proposerEmplacement,
  proposerMarquages,
  transitionsPossibles,
  type Anomalie,
  type Lacunes,
  type MethodeMarquage,
  type Realite,
  type Registre,
  type TypeManifestation,
  type TypePreuve,
} from '@empreinte/core'
import { etiquetteSvg } from './etiquette.ts'

export const AIDE = `empreinte — relier le réel à son empreinte numérique

Réalités
  integrer <genre> --titre T [--sous-type S] [--ref cle=valeur[@emetteur]]… [--attr cle=valeur]… [--annee A]
  manifester <id> <type> [--fichier F] [--donnee cle=valeur]… [--confiance 0-1] [--description D]
      types : physique-original, physique-copie, photo, scan, ocr, donnees-structurees, fichier-numerique, impression
  corriger <id-manifestation> --donnee cle=valeur… [--par P] [--note N]
  placer <id> (--auto | --dossier A/B/C --rangement X/Y/Z) [--detenteur P]
  introuvable <id> [--note N]
  etat <id> <nouvel-etat> [--par P] [--note N] [--forcer]
  preuve <id> <type> [--description D] [--par P]
  relier <de> <type-relation> <vers>
  passages <id> <texte contenant des références bibliques>

Lien physique ↔ numérique
  proposer-marquage <id> [--patrimonial] [--sans-imprimante] [--nfc] [--volume N]
  marquer <id> <methode> [contenu]
  etiquette <id> [--sortie fichier.svg]
  scan <contenu-qr>

Consulter
  liste | chercher <texte> | voir <id>
  verifier                      anomalies du registre
  lacunes [id]                  ce qui manque, est en double, automatisable, reste humain…
  organiser --nombre N --recherches N --domaines N --projets N [--partage] [--confidentiel] [--espace-limite] [--conservation ANS] [--hors-ligne]

  demo                          scénario complet de la facture F-47 (registre temporaire)

Registre : .empreinte/registre.json (ou variable EMPREINTE_REGISTRE).`

export interface Resultat {
  sortie: string
  modifie: boolean
}

function paires(valeurs: string[] | undefined): Record<string, string | number | boolean> {
  const res: Record<string, string | number | boolean> = {}
  for (const v of valeurs ?? []) {
    const i = v.indexOf('=')
    if (i < 1) throw new Error(`Attendu cle=valeur : « ${v} »`)
    const brut = v.slice(i + 1)
    res[v.slice(0, i)] = brut === 'true' ? true : brut === 'false' ? false : /^-?\d+(\.\d+)?$/.test(brut) ? Number(brut) : brut
  }
  return res
}

function references(valeurs: string[] | undefined) {
  return (valeurs ?? []).map(v => {
    const m = /^([^=]+)=([^@]+)(?:@(.+))?$/.exec(v)
    if (!m) throw new Error(`Référence attendue sous la forme cle=valeur[@emetteur] : « ${v} »`)
    return { cle: m[1], valeur: m[2], emetteur: m[3] }
  })
}

const ICONES = { critique: '✖', attention: '⚠', info: 'ℹ' } as const

export function formaterAnomalies(anomalies: Anomalie[]): string {
  if (anomalies.length === 0) return '✔ Aucune anomalie détectée.'
  return anomalies.map(a => `${ICONES[a.gravite]} [${a.code}] ${a.message}\n    → ${a.suggestion}`).join('\n')
}

function formaterLacunes(l: Lacunes): string {
  const sections: [string, string[]][] = [
    ['Ce qui manque', l.manque],
    ['En double', l.enDouble],
    ['Non relié', l.nonRelie],
    ['Mal identifié', l.malIdentifie],
    ['Risque de perte', l.risquePerte],
    ['Automatisable', l.automatisable],
    ['Doit rester humain', l.resteHumain],
    ['Doit rester physique', l.resteePhysique],
    ['Rôle du numérique', l.numerique],
  ]
  return [
    `── ${l.realiteId}`,
    ...sections.filter(([, v]) => v.length > 0).map(([t, v]) => `  ${t} :\n${v.map(x => `    • ${x}`).join('\n')}`),
  ].join('\n')
}

function ligne(r: Realite): string {
  const ref = r.referencesExternes.map(x => x.valeur).join(', ')
  const ou = r.emplacement ? (r.emplacement.introuvable ? 'INTROUVABLE' : r.emplacement.rangement.join(' → ')) : '—'
  return `${r.id.padEnd(15)} ${r.etat.padEnd(12)} ${r.titre}${ref ? ` [${ref}]` : ''}  @ ${ou}`
}

export function voir(registre: Registre, r: Realite): string {
  const out = [
    `${r.id} — ${r.titre}`,
    `  genre : ${r.genre}${r.sousType ? ` / ${r.sousType}` : ''}    état : ${r.etat}    possibles : ${(transitionsPossibles(r) ?? ['libre']).join(', ') || 'aucun'}`,
  ]
  if (r.referencesExternes.length)
    out.push(`  références : ${r.referencesExternes.map(x => `${x.cle}=${x.valeur}${x.emetteur ? ` (${x.emetteur})` : ''}`).join(', ')}`)
  if (Object.keys(r.attributs).length) out.push(`  attributs : ${JSON.stringify(r.attributs)}`)
  if (r.emplacement)
    out.push(
      `  dossier : ${r.emplacement.dossier.join(' → ')}`,
      `  emplacement : ${r.emplacement.rangement.join(' → ')}${r.emplacement.detenteur ? ` (détenu par ${r.emplacement.detenteur})` : ''}${r.emplacement.introuvable ? '  ✖ INTROUVABLE' : ''}`,
    )
  out.push('  manifestations :')
  for (const m of r.manifestations)
    out.push(`    ${m.id}  ${m.type} (confiance ${m.confiance})${m.fichier ? ` ${m.fichier}` : ''}${Object.keys(m.donnees).length ? ` ${JSON.stringify(m.donnees)}` : ''}`)
  if (r.manifestations.length === 0) out.push('    (aucune)')
  if (r.preuves.length) out.push(`  preuves : ${r.preuves.map(p => `${p.type}${p.par ? ` par ${p.par}` : ''}`).join(', ')}`)
  if (r.marquages.length) out.push(`  marquages : ${r.marquages.map(m => `${m.methode} « ${m.contenu} »`).join(', ')}`)
  if (r.passages.length) out.push(`  passages : ${r.passages.join(', ')}`)
  const rel = registre.relationsDe(r.id)
  if (rel.length) out.push(`  relations :\n${rel.map(x => `    ${x.de} —${x.type}→ ${x.vers}`).join('\n')}`)
  out.push(`  historique :\n${registre.historique(r.id).map(e => `    #${e.seq} ${e.le.slice(0, 16).replace('T', ' ')} ${e.type}`).join('\n')}`)
  return out.join('\n')
}

export async function executer(argv: string[], registre: Registre): Promise<Resultat> {
  const { values: o, positionals: p } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      titre: { type: 'string' },
      'sous-type': { type: 'string' },
      ref: { type: 'string', multiple: true },
      attr: { type: 'string', multiple: true },
      annee: { type: 'string' },
      fichier: { type: 'string' },
      donnee: { type: 'string', multiple: true },
      confiance: { type: 'string' },
      description: { type: 'string' },
      auto: { type: 'boolean' },
      dossier: { type: 'string' },
      rangement: { type: 'string' },
      detenteur: { type: 'string' },
      par: { type: 'string' },
      note: { type: 'string' },
      forcer: { type: 'boolean' },
      patrimonial: { type: 'boolean' },
      'sans-imprimante': { type: 'boolean' },
      nfc: { type: 'boolean' },
      volume: { type: 'string' },
      sortie: { type: 'string' },
      nombre: { type: 'string' },
      recherches: { type: 'string' },
      domaines: { type: 'string' },
      projets: { type: 'string' },
      partage: { type: 'boolean' },
      confidentiel: { type: 'boolean' },
      'espace-limite': { type: 'boolean' },
      conservation: { type: 'string' },
      'hors-ligne': { type: 'boolean' },
    },
  })
  const [commande, ...args] = p
  const lu = (s: string | undefined) => (s === undefined ? undefined : Number(s))
  const ok = (sortie: string): Resultat => ({ sortie, modifie: true })
  const vu = (sortie: string): Resultat => ({ sortie, modifie: false })

  switch (commande) {
    case 'integrer': {
      if (!args[0] || !o.titre) throw new Error('Usage : integrer <genre> --titre T …')
      const r = registre.integrer({
        genre: args[0],
        sousType: o['sous-type'],
        titre: o.titre,
        references: references(o.ref),
        attributs: paires(o.attr),
        annee: lu(o.annee),
      })
      return ok(`✔ ${r.id} intégré (${r.titre}). À inscrire sur l'original : ${r.id}`)
    }
    case 'manifester': {
      const [id, type] = args
      if (!id || !type) throw new Error('Usage : manifester <id> <type> …')
      let empreinteFichier: string | undefined
      if (o.fichier && existsSync(o.fichier)) empreinteFichier = createHash('sha256').update(readFileSync(o.fichier)).digest('hex')
      const m = registre.ajouterManifestation(id, {
        type: type as TypeManifestation,
        fichier: o.fichier,
        empreinteFichier,
        donnees: paires(o.donnee),
        confiance: lu(o.confiance),
        description: o.description,
      })
      return ok(`✔ ${m.id} : ${m.type} (confiance ${m.confiance})${empreinteFichier ? ` sha256 ${empreinteFichier.slice(0, 12)}…` : ''}`)
    }
    case 'corriger': {
      const m = registre.corrigerManifestation(args[0], paires(o.donnee), { par: o.par, note: o.note })
      return ok(`✔ ${m.id} corrigé : ${JSON.stringify(m.donnees)} (ancienne valeur conservée dans le journal)`)
    }
    case 'placer': {
      const r = registre.obtenir(args[0])
      const e = o.auto
        ? proposerEmplacement(registre.realites, r)
        : { dossier: o.dossier?.split('/'), rangement: o.rangement?.split('/') }
      const res = registre.placer(r.id, { ...e, detenteur: o.detenteur })
      return ok(`✔ ${r.id}\n  dossier : ${res.dossier.join(' → ')}\n  emplacement : ${res.rangement.join(' → ')}`)
    }
    case 'introuvable':
      registre.signalerIntrouvable(args[0], o.note)
      return ok(`⚠ ${args[0]} signalé introuvable.`)
    case 'etat':
      registre.changerEtat(args[0], args[1], { par: o.par, note: o.note, forcer: o.forcer })
      return ok(`✔ ${args[0]} → ${args[1]}`)
    case 'preuve': {
      const pr = registre.ajouterPreuve(args[0], { type: args[1] as TypePreuve, description: o.description, par: o.par })
      return ok(`✔ ${pr.id} : ${pr.type}`)
    }
    case 'relier': {
      const [de, type, vers] = args
      registre.relier(de, vers, type)
      return ok(`✔ ${de} —${type}→ ${vers}`)
    }
    case 'passages': {
      const [id, ...mots] = args
      const passages = extrairePassages(mots.join(' '))
      registre.lierPassages(id, passages)
      return ok(passages.length ? `✔ ${id} relié à ${passages.join(', ')}` : 'Aucune référence biblique reconnue.')
    }
    case 'proposer-marquage': {
      const r = registre.obtenir(args[0])
      const reco = proposerMarquages(r, {
        patrimonial: o.patrimonial,
        imprimante: !o['sans-imprimante'],
        nfc: o.nfc,
        volume: lu(o.volume) ?? registre.realites.filter(x => x.genre === r.genre).length,
      })
      const fmt = (x: typeof reco.principal) => `${x.methode} « ${x.contenu} » (score ${x.score}/10)\n${x.raisons.map(y => `      · ${y}`).join('\n')}`
      return vu(
        [
          `Marquage proposé pour ${r.id} :`,
          `  ► principal : ${fmt(reco.principal)}`,
          ...reco.complements.map(c => `  + complément : ${fmt(c)}`),
          `  Autres options : ${reco.toutes.filter(x => x !== reco.principal && !reco.complements.some(c => c.methode === x.methode)).map(x => `${x.methode} (${x.score})`).join(', ')}`,
        ].join('\n'),
      )
    }
    case 'marquer': {
      const r = registre.obtenir(args[0])
      const m = registre.marquer(r.id, args[1] as MethodeMarquage, args[2] ?? r.id)
      return ok(`✔ ${r.id} marqué : ${m.methode} « ${m.contenu} »`)
    }
    case 'etiquette': {
      const r = registre.obtenir(args[0])
      const svg = await etiquetteSvg(r)
      const fichier = o.sortie ?? `${r.id}.svg`
      writeFileSync(fichier, svg)
      return vu(`✔ Étiquette ${r.id} écrite dans ${fichier}`)
    }
    case 'scan': {
      const id = idDepuisQr(args.join(' ')) ?? args[0]
      const r = registre.chercher(id)
      return vu(r ? voir(registre, r) : `Aucune réalité ${id} : document physique sans enregistrement numérique → à intégrer.`)
    }
    case 'liste':
      return vu(registre.realites.map(ligne).join('\n') || '(registre vide)')
    case 'chercher':
      return vu(registre.rechercher(args.join(' ')).map(ligne).join('\n') || 'Aucun résultat.')
    case 'voir':
      return vu(voir(registre, registre.obtenir(args[0])))
    case 'verifier':
      return vu(formaterAnomalies(detecterAnomalies(registre)))
    case 'lacunes': {
      const anomalies = detecterAnomalies(registre)
      const cibles = args[0] ? [registre.obtenir(args[0])] : registre.realites
      return vu(cibles.map(r => formaterLacunes(analyserLacunes(registre, r, anomalies))).join('\n\n'))
    }
    case 'organiser': {
      const evals = comparerStrategies({
        nombre: lu(o.nombre) ?? registre.realites.length,
        recherchesParSemaine: lu(o.recherches) ?? 5,
        domaines: lu(o.domaines) ?? 3,
        projets: lu(o.projets) ?? 0,
        partage: o.partage,
        confidentialite: o.confidentiel,
        espaceLimite: o['espace-limite'],
        dureeConservationAns: lu(o.conservation),
        synchronisationNumerique: !o['hors-ligne'],
      })
      return vu(
        evals
          .map((e, i) => `${i === 0 ? '► ' : '  '}${e.libelle}\n    score ${e.score}/5\n${e.pourquoi.map(x => `    · ${x}`).join('\n')}`)
          .join('\n'),
      )
    }
    case undefined:
    case 'aide':
    case 'help':
      return vu(AIDE)
    default:
      throw new Error(`Commande inconnue : ${commande}\n\n${AIDE}`)
  }
}

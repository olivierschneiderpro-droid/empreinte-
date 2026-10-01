import { etatInitial, transitionValide, transitionsPossibles } from './etats.ts'
import { numeroDepuisReference, prefixePour, proposerIdentifiant } from './identifiants.ts'
import { ajouterEvenement } from './journal.ts'
import {
  CONFIANCE_PAR_DEFAUT,
  type Emplacement,
  type EtatRegistre,
  type Evenement,
  type Genre,
  type Manifestation,
  type Marquage,
  type MethodeMarquage,
  type Preuve,
  type ReferenceExterne,
  type Realite,
  type Relation,
  type TypeManifestation,
  type TypePreuve,
  type TypeRelation,
} from './types.ts'

export interface NouvelleRealite {
  genre: Genre
  sousType?: string
  titre: string
  references?: ReferenceExterne[]
  attributs?: Record<string, string | number | boolean>
  /** Année de l'identifiant ; par défaut l'année courante. */
  annee?: number
  /** Par défaut : vrai pour tout sauf les paiements et les projets. */
  physiqueAttendu?: boolean
  /** Impose un identifiant précis (reprise d'un existant). */
  id?: string
}

export interface NouvelleManifestation {
  type: TypeManifestation
  description?: string
  fichier?: string
  empreinteFichier?: string
  donnees?: Record<string, string | number | boolean>
  confiance?: number
  source?: string
}

export class Registre {
  private readonly etat: EtatRegistre
  private readonly horloge: () => Date

  constructor(etat?: EtatRegistre, horloge: () => Date = () => new Date()) {
    this.etat = etat ?? { version: 1, realites: [], relations: [], journal: [] }
    this.horloge = horloge
  }

  get realites(): readonly Realite[] {
    return this.etat.realites
  }

  get relations(): readonly Relation[] {
    return this.etat.relations
  }

  get journal(): readonly Evenement[] {
    return this.etat.journal
  }

  exporter(): EtatRegistre {
    return structuredClone(this.etat)
  }

  private maintenant(): string {
    return this.horloge().toISOString()
  }

  private tracer(type: string, realiteId: string | undefined, details: Record<string, unknown>) {
    ajouterEvenement(this.etat.journal, this.maintenant(), type, realiteId, details)
  }

  private idLocal(prefixe: string, liste: { id: string }[]): string {
    return `${prefixe}${liste.length + 1}`
  }

  obtenir(id: string): Realite {
    const r = this.etat.realites.find(x => x.id === id)
    if (!r) throw new Error(`Réalité inconnue : ${id}`)
    return r
  }

  chercher(id: string): Realite | undefined {
    return this.etat.realites.find(x => x.id === id)
  }

  /** Retrouve les réalités qui portent une référence externe (ex. numéro de facture 47). */
  parReference(cle: string, valeur: string, emetteur?: string): Realite[] {
    const norm = (v: string) => v.trim().toLowerCase()
    return this.etat.realites.filter(r =>
      r.referencesExternes.some(
        ref =>
          ref.cle === cle &&
          norm(ref.valeur) === norm(valeur) &&
          (emetteur === undefined || ref.emetteur === undefined || norm(ref.emetteur) === norm(emetteur)),
      ),
    )
  }

  /** Recherche libre dans les identifiants, titres, références et emplacements. */
  rechercher(texte: string): Realite[] {
    const t = texte.trim().toLowerCase()
    return this.etat.realites.filter(r =>
      [
        r.id,
        r.titre,
        r.sousType ?? '',
        ...r.referencesExternes.flatMap(x => [x.valeur, x.emetteur ?? '']),
        ...(r.emplacement ? [...r.emplacement.dossier, ...r.emplacement.rangement] : []),
      ].some(champ => champ.toLowerCase().includes(t)),
    )
  }

  /** Donne une identité système à une réalité (physique ou numérique). */
  integrer(n: NouvelleRealite): Realite {
    const annee = n.annee ?? this.horloge().getFullYear()
    const prefixe = prefixePour(n.genre, n.sousType)
    const numero = n.references?.map(r => numeroDepuisReference(r.valeur)).find(x => x !== undefined)
    const id = n.id ?? proposerIdentifiant(this.etat.realites.map(r => r.id), prefixe, annee, numero)
    if (this.chercher(id)) throw new Error(`Identifiant déjà attribué : ${id}`)

    const le = this.maintenant()
    const etat = etatInitial(n.genre)
    const realite: Realite = {
      id,
      genre: n.genre,
      sousType: n.sousType,
      titre: n.titre,
      referencesExternes: n.references ?? [],
      attributs: n.attributs ?? {},
      manifestations: [],
      etat,
      historiqueEtats: [{ de: null, vers: etat, le }],
      preuves: [],
      marquages: [],
      passages: [],
      physiqueAttendu: n.physiqueAttendu ?? !['paiement', 'projet'].includes(n.genre),
      creeLe: le,
    }
    this.etat.realites.push(realite)
    this.tracer('integration', id, { genre: n.genre, sousType: n.sousType, titre: n.titre, references: realite.referencesExternes })
    return realite
  }

  ajouterManifestation(id: string, m: NouvelleManifestation): Manifestation {
    const r = this.obtenir(id)
    const manifestation: Manifestation = {
      id: `${id}/${this.idLocal('M', r.manifestations)}`,
      type: m.type,
      description: m.description,
      fichier: m.fichier,
      empreinteFichier: m.empreinteFichier,
      donnees: m.donnees ?? {},
      confiance: m.confiance ?? CONFIANCE_PAR_DEFAUT[m.type],
      source: m.source,
      creeLe: this.maintenant(),
    }
    r.manifestations.push(manifestation)
    this.tracer('manifestation', id, { manifestation: manifestation.id, type: m.type, donnees: manifestation.donnees })
    return manifestation
  }

  /** Corrige les données d'une manifestation ; l'ancienne valeur reste dans le journal. */
  corrigerManifestation(manifestationId: string, donnees: Record<string, string | number | boolean>, o: { par?: string; note?: string } = {}): Manifestation {
    const id = manifestationId.split('/')[0]
    const m = this.obtenir(id).manifestations.find(x => x.id === manifestationId)
    if (!m) throw new Error(`Manifestation inconnue : ${manifestationId}`)
    const avant = Object.fromEntries(Object.keys(donnees).map(k => [k, m.donnees[k] ?? null]))
    Object.assign(m.donnees, donnees)
    this.tracer('correction', id, { manifestation: manifestationId, avant, apres: donnees, par: o.par, note: o.note })
    return m
  }

  placer(id: string, e: Partial<Omit<Emplacement, 'depuis'>>): Emplacement {
    const r = this.obtenir(id)
    const avant = r.emplacement
    r.emplacement = {
      dossier: e.dossier ?? avant?.dossier ?? [],
      rangement: e.rangement ?? avant?.rangement ?? [],
      detenteur: e.detenteur ?? avant?.detenteur,
      depuis: this.maintenant(),
      introuvable: e.introuvable ?? false,
    }
    this.tracer('emplacement', id, { avant: avant ?? null, apres: r.emplacement })
    return r.emplacement
  }

  /** L'original n'est plus là où le système croit qu'il est. */
  signalerIntrouvable(id: string, note?: string): void {
    const r = this.obtenir(id)
    r.emplacement = {
      ...(r.emplacement ?? { dossier: [], rangement: [], depuis: this.maintenant() }),
      introuvable: true,
    }
    this.tracer('introuvable', id, { note })
  }

  changerEtat(id: string, vers: string, o: { par?: string; note?: string; forcer?: boolean } = {}): void {
    const r = this.obtenir(id)
    const valide = transitionValide(r, vers)
    if (!valide && !o.forcer) {
      const possibles = transitionsPossibles(r) ?? []
      throw new Error(
        `Transition inhabituelle ${r.etat} → ${vers} pour ${id}. ` +
          `Possibles : ${possibles.join(', ') || 'aucune'}. Utiliser « forcer » si le réel l'impose.`,
      )
    }
    const changement = { de: r.etat, vers, le: this.maintenant(), par: o.par, note: o.note, force: !valide || undefined }
    r.historiqueEtats.push(changement)
    r.etat = vers
    this.tracer('etat', id, changement)
  }

  ajouterPreuve(id: string, p: { type: TypePreuve; description?: string; manifestationId?: string; par?: string }): Preuve {
    const r = this.obtenir(id)
    const preuve: Preuve = { id: `${id}/${this.idLocal('P', r.preuves)}`, ...p, le: this.maintenant() }
    r.preuves.push(preuve)
    this.tracer('preuve', id, { ...preuve })
    return preuve
  }

  /** Enregistre ce qui a réellement été inscrit ou collé sur l'objet physique. */
  marquer(id: string, methode: MethodeMarquage, contenu: string): Marquage {
    const r = this.obtenir(id)
    const marquage: Marquage = { methode, contenu, appliqueLe: this.maintenant() }
    r.marquages.push(marquage)
    this.tracer('marquage', id, { ...marquage })
    return marquage
  }

  relier(de: string, vers: string, type: TypeRelation, note?: string): Relation {
    this.obtenir(de)
    this.obtenir(vers)
    const existante = this.etat.relations.find(x => x.de === de && x.vers === vers && x.type === type)
    if (existante) return existante
    const relation: Relation = { id: this.idLocal('REL-', this.etat.relations), de, vers, type, note, creeLe: this.maintenant() }
    this.etat.relations.push(relation)
    this.tracer('relation', de, { vers, type, note })
    return relation
  }

  relationsDe(id: string): Relation[] {
    return this.etat.relations.filter(x => x.de === id || x.vers === id)
  }

  lierPassages(id: string, passages: string[]): void {
    const r = this.obtenir(id)
    const nouveaux = passages.filter(p => !r.passages.includes(p))
    if (nouveaux.length === 0) return
    r.passages.push(...nouveaux)
    this.tracer('passages', id, { passages: nouveaux })
  }

  historique(id: string): Evenement[] {
    return this.etat.journal.filter(e => e.realiteId === id || e.details.vers === id)
  }
}

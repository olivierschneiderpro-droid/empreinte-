import type { Realite } from './types.ts'

/**
 * Le numérique ne fait pas qu'enregistrer le monde physique : il aide à l'organiser.
 * Ce module compare des architectures de classement et attribue des emplacements.
 */

export type Strategie = 'chronologique' | 'domaine' | 'projet' | 'hybride'

export const STRATEGIES: Record<Strategie, string> = {
  chronologique: 'A — classement chronologique (année → mois)',
  domaine: 'B — classement par domaine (domaine → année)',
  projet: 'C — classement par projet (projet → année)',
  hybride: 'D — hybride + identifiant unique (domaine → année → catégorie, retrouvé par son numéro)',
}

export interface ProfilOrganisation {
  /** Nombre d'éléments physiques à organiser. */
  nombre: number
  recherchesParSemaine: number
  domaines: number
  projets: number
  partage?: boolean
  confidentialite?: boolean
  espaceLimite?: boolean
  dureeConservationAns?: number
  /** Le système numérique est-il disponible au moment de chercher ? */
  synchronisationNumerique?: boolean
}

export type Critere =
  | 'tempsRecherche'
  | 'frequence'
  | 'volume'
  | 'risquePerte'
  | 'cout'
  | 'espace'
  | 'acces'
  | 'confidentialite'
  | 'durabilite'
  | 'partage'
  | 'synchronisation'

/** Qualités intrinsèques de chaque stratégie (1 = faible, 5 = excellent). */
const QUALITES: Record<Strategie, Record<Exclude<Critere, 'tempsRecherche' | 'frequence' | 'volume'>, number>> = {
  chronologique: { risquePerte: 3, cout: 5, espace: 5, acces: 3, confidentialite: 2, durabilite: 5, partage: 3, synchronisation: 3 },
  domaine: { risquePerte: 3, cout: 4, espace: 3, acces: 4, confidentialite: 4, durabilite: 4, partage: 4, synchronisation: 3 },
  projet: { risquePerte: 2, cout: 4, espace: 3, acces: 4, confidentialite: 4, durabilite: 2, partage: 5, synchronisation: 3 },
  hybride: { risquePerte: 5, cout: 3, espace: 4, acces: 4, confidentialite: 4, durabilite: 4, partage: 4, synchronisation: 5 },
}

/**
 * Temps moyen estimé (secondes) pour retrouver un élément.
 * Hypothèse : ~2 s par élément feuilleté, on parcourt la moitié du sous-ensemble ciblé.
 */
export function tempsRechercheEstime(s: Strategie, p: ProfilOrganisation): number {
  const feuilleter = (n: number) => 15 + Math.max(1, n) * 2 * 0.5
  const annees = Math.max(1, p.dureeConservationAns ?? 3)
  switch (s) {
    case 'chronologique':
      // Rapide si l'on connaît la date, sinon on balaie plusieurs mois.
      return feuilleter((p.nombre / (annees * 12)) * (p.domaines > 3 ? 4 : 2))
    case 'domaine':
      return feuilleter(p.nombre / (Math.max(1, p.domaines) * annees))
    case 'projet':
      return feuilleter(p.nombre / (Math.max(1, p.projets) * annees)) + (p.projets === 0 ? 60 : 0)
    case 'hybride':
      // L'identifiant donne l'emplacement exact : on va droit à la pochette.
      return p.synchronisationNumerique === false ? feuilleter(p.nombre / (Math.max(1, p.domaines) * annees * 3)) : 20
  }
}

function poids(p: ProfilOrganisation): Record<Critere, number> {
  return {
    tempsRecherche: 2 + Math.min(3, p.recherchesParSemaine / 5),
    frequence: 0,
    volume: 0,
    risquePerte: p.nombre > 300 ? 3 : 2,
    cout: 1,
    espace: p.espaceLimite ? 3 : 1,
    acces: 1 + Math.min(2, p.recherchesParSemaine / 10),
    confidentialite: p.confidentialite ? 3 : 1,
    durabilite: (p.dureeConservationAns ?? 3) >= 10 ? 3 : 1,
    partage: p.partage ? 3 : 1,
    synchronisation: p.synchronisationNumerique === false ? 0 : 2,
  }
}

export interface EvaluationStrategie {
  strategie: Strategie
  libelle: string
  score: number
  tempsRechercheSecondes: number
  pourquoi: string[]
}

export function comparerStrategies(p: ProfilOrganisation): EvaluationStrategie[] {
  const w = poids(p)
  const temps = Object.fromEntries(
    (Object.keys(STRATEGIES) as Strategie[]).map(s => [s, tempsRechercheEstime(s, p)]),
  ) as Record<Strategie, number>
  const meilleurTemps = Math.min(...Object.values(temps))

  return (Object.keys(STRATEGIES) as Strategie[])
    .map(s => {
      const q = QUALITES[s]
      const noteTemps = 5 * (meilleurTemps / temps[s])
      let total = w.tempsRecherche * noteTemps
      let somme = w.tempsRecherche
      for (const [critere, note] of Object.entries(q) as [keyof typeof q, number][]) {
        total += w[critere] * note
        somme += w[critere]
      }
      const pourquoi = [`Temps de recherche estimé : ~${Math.round(temps[s])} s.`]
      if (s === 'hybride' && p.synchronisationNumerique !== false)
        pourquoi.push('Le numéro inscrit sur l’original donne directement son emplacement exact.')
      if (s === 'projet' && p.projets === 0) pourquoi.push('Aucun projet déclaré : beaucoup d’éléments resteraient « sans projet ».')
      if (s === 'chronologique') pourquoi.push('Simple et durable, mais lent quand on ne connaît pas la date.')
      if (s === 'domaine' && p.confidentialite) pourquoi.push('Isole facilement les domaines confidentiels.')
      if (p.partage && q.partage >= 4) pourquoi.push('Facilite le partage d’un sous-ensemble.')
      return { strategie: s, libelle: STRATEGIES[s], score: Math.round((total / somme) * 20) / 20, tempsRechercheSecondes: Math.round(temps[s]), pourquoi }
    })
    .sort((a, b) => b.score - a.score)
}

// --- Attribution d'emplacements -------------------------------------------------

export interface PlanClassement {
  strategie: Strategie
  /** Nombre de documents par pochette. */
  capacitePochette: number
  sectionsParClasseur: number
}

export const PLAN_PAR_DEFAUT: PlanClassement = { strategie: 'hybride', capacitePochette: 10, sectionsParClasseur: 6 }

const MOIS = ['01-janvier', '02-février', '03-mars', '04-avril', '05-mai', '06-juin', '07-juillet', '08-août', '09-septembre', '10-octobre', '11-novembre', '12-décembre']

function texte(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

function domaineDe(r: Realite): string {
  const explicite = texte(r.attributs.domaine)
  if (explicite) return explicite
  if (r.sousType?.startsWith('facture')) return r.attributs.sens === 'vente' ? 'Clients' : 'Fournisseurs'
  const genres: Record<string, string> = { livre: 'Bibliothèque', bible: 'Bibliothèque', equipement: 'Équipements', mission: 'Missions', projet: 'Projets', stock: 'Stock' }
  return genres[r.genre] ?? 'Documents'
}

function categorieDe(r: Realite): string {
  const explicite = texte(r.attributs.categorie)
  if (explicite) return explicite
  if (r.sousType?.startsWith('facture')) return r.attributs.sens === 'vente' ? 'Ventes' : 'Achats'
  return r.sousType ?? r.genre
}

function anneeDe(r: Realite): string {
  const date = texte(r.attributs.date)
  return date?.slice(0, 4) ?? r.id.split('-')[1] ?? r.creeLe.slice(0, 4)
}

/** Chemin logique de classement selon la stratégie. */
export function dossierPour(r: Realite, s: Strategie): string[] {
  const annee = anneeDe(r)
  switch (s) {
    case 'chronologique': {
      const mois = Number((texte(r.attributs.date) ?? r.creeLe).slice(5, 7))
      return [annee, MOIS[mois - 1] ?? 'sans-date']
    }
    case 'domaine':
      return [domaineDe(r), annee]
    case 'projet':
      return [texte(r.attributs.projet) ?? 'Sans projet', annee]
    case 'hybride':
      return [domaineDe(r), annee, categorieDe(r)]
  }
}

const deux = (n: number) => String(n).padStart(2, '0')

/**
 * Attribue un rangement physique : chaque dossier logique reçoit sa section
 * (Classeur 02 → Section B), et les documents remplissent les pochettes dans l'ordre.
 */
export function proposerEmplacement(
  realites: readonly Realite[],
  r: Realite,
  plan: PlanClassement = PLAN_PAR_DEFAUT,
): { dossier: string[]; rangement: string[] } {
  const dossier = dossierPour(r, plan.strategie)
  const cle = dossier.join('/')
  const sections: string[] = []
  let occupes = 0
  let derniereSection: string[] | undefined
  for (const autre of realites) {
    if (autre.id === r.id || !autre.emplacement || autre.emplacement.dossier.length === 0) continue
    const k = autre.emplacement.dossier.join('/')
    if (!sections.includes(k)) sections.push(k)
    if (k === cle) {
      occupes++
      derniereSection = autre.emplacement.rangement.slice(0, 2)
    }
  }
  let index = sections.indexOf(cle)
  if (index === -1) index = sections.length
  const [classeur, section] =
    derniereSection && derniereSection.length === 2
      ? derniereSection
      : [`Classeur ${deux(Math.floor(index / plan.sectionsParClasseur) + 1)}`, `Section ${String.fromCharCode(65 + (index % plan.sectionsParClasseur))}`]
  const pochette = `Pochette ${deux(Math.floor(occupes / plan.capacitePochette) + 1)}`
  return { dossier, rangement: [classeur, section, pochette] }
}

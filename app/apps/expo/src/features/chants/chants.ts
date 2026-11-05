import { useQuery } from '@tanstack/react-query'
import { adresseLivres } from '~features/livres/livres'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'

/**
 * Empreinte · Chants. Le catalogue (cantiques du domaine public, paroles libres) est choisi à
 * la main ; le serveur Empreinte cherche les enregistrements libres de chacun sur Wikimedia
 * Commons et Internet Archive, en vérifiant leur licence (scripts/chants-empreinte.mjs).
 */
export type ThemeChant =
  | 'louange'
  | 'confiance'
  | 'priere'
  | 'noel'
  | 'paques'
  | 'enfants'
  | 'meditation'

export type FicheChant = {
  id: string
  titre: string
  langue: 'fr' | 'en' | 'tous'
  theme: ThemeChant
  auteur: string
  annee: string
  recherche: string
  paroles?: string[][]
  refrain?: string[]
  /** Les passages qui ont inspiré le chant (numéro de livre, chapitre, verset). */
  versets?: { livre: number; chapitre: number; verset?: number }[]
  /** L'histoire du chant, en quelques lignes. */
  histoire?: string
  /** Le même chant dans l'autre langue. */
  traduction?: string
}

/** Un passage du chant tel qu'on le chante : une strophe, puis le refrain, et ainsi de suite. */
export type PartieChant = { type: 'strophe' | 'refrain'; numero: number; lignes: string[] }

export type Enregistrement = {
  titre: string
  album?: string
  auteur?: string
  licence: string
  url: string
  page?: string
  source: string
}

export const THEMES_CHANTS: ThemeChant[] = [
  'louange',
  'confiance',
  'priere',
  'paques',
  'noel',
  'enfants',
  'meditation',
]

/** Les couleurs d'un thème : un dégradé pour ses cartes (pas de photo à répéter). */
export const COULEURS_THEME: Record<ThemeChant, [string, string]> = {
  louange: ['#8A5A14', '#D69A36'],
  confiance: ['#12355B', '#3474B0'],
  priere: ['#3B1F4A', '#7A4F99'],
  paques: ['#6B2D2D', '#C76A4C'],
  noel: ['#0F3D2E', '#2F8462'],
  enfants: ['#1F5E63', '#3FA7A0'],
  meditation: ['#1F2937', '#52657E'],
}

export const degradeTheme = (theme: ThemeChant) =>
  `linear-gradient(135deg, ${COULEURS_THEME[theme][0]} 0%, ${COULEURS_THEME[theme][1]} 100%)`

export const catalogueChants = (require('./catalogue.json') as { chants: FicheChant[] }).chants

export const ficheChant = (id: string) => catalogueChants.find(chant => chant.id === id)

export const langueChantsAtom = atomWithAsyncStorage<'tous' | 'fr' | 'en'>(
  'empreinte.chants.langue',
  'tous'
)

/** Les paroles dans l'ordre où on les chante : chaque strophe suivie du refrain. */
export const partiesChantees = (chant: FicheChant): PartieChant[] =>
  (chant.paroles ?? []).flatMap((lignes, index) => [
    { type: 'strophe' as const, numero: index + 1, lignes },
    ...(chant.refrain
      ? [{ type: 'refrain' as const, numero: index + 1, lignes: chant.refrain }]
      : []),
  ])

const sansAccents = (texte: string) =>
  texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

/** Les chants qui répondent à une recherche (titre, auteur ou paroles). */
export const chercherChants = (recherche: string) => {
  const mots = sansAccents(recherche).split(/\s+/).filter(Boolean)
  if (!mots.length) return []
  return catalogueChants
    .map(chant => {
      const titre = sansAccents(`${chant.titre} ${chant.auteur}`)
      const paroles = sansAccents(
        [...(chant.paroles ?? []).flat(), ...(chant.refrain ?? [])].join(' ')
      )
      const score = mots.reduce(
        (total, mot) => total + (titre.includes(mot) ? 3 : paroles.includes(mot) ? 1 : -10),
        0
      )
      return { chant, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ chant }) => chant)
}

/** Mes chants : les favoris et les listes (culte, veillée…), gardés avec le compte. */
export type ListeChants = { id: string; nom: string; chants: string[] }
export type MesChants = { favoris: string[]; listes: ListeChants[] }

export const mesChantsAtom = atomWithAsyncStorage<MesChants>('empreinte.chants.miens', {
  favoris: [],
  listes: [],
})

export const basculerFavori = (mes: MesChants, id: string): MesChants => ({
  ...mes,
  favoris: mes.favoris.includes(id) ? mes.favoris.filter(f => f !== id) : [id, ...mes.favoris],
})

export const ajouterALaListe = (mes: MesChants, listeId: string, id: string): MesChants => ({
  ...mes,
  listes: mes.listes.map(liste =>
    liste.id === listeId && !liste.chants.includes(id)
      ? { ...liste, chants: [...liste.chants, id] }
      : liste
  ),
})

export const retirerDeLaListe = (mes: MesChants, listeId: string, id: string): MesChants => ({
  ...mes,
  listes: mes.listes.map(liste =>
    liste.id === listeId ? { ...liste, chants: liste.chants.filter(c => c !== id) } : liste
  ),
})

export const creerListe = (mes: MesChants, nom: string, premier?: string): MesChants => ({
  ...mes,
  listes: [
    ...mes.listes,
    { id: `liste-${Date.now().toString(36)}`, nom: nom.trim(), chants: premier ? [premier] : [] },
  ],
})

export const supprimerListe = (mes: MesChants, listeId: string): MesChants => ({
  ...mes,
  listes: mes.listes.filter(liste => liste.id !== listeId),
})

/** Le chant du jour : un chant avec paroles, différent chaque jour. */
export const chantDuJour = (date = new Date()) => {
  const avecParoles = catalogueChants.filter(chant => chant.paroles?.length)
  const jour = Math.floor(date.getTime() / 86_400_000)
  return avecParoles[jour % avecParoles.length]!
}

const lire = async <T>(chemin: string): Promise<T> => {
  const base = adresseLivres()
  if (!base) throw new Error('serveur Empreinte absent')
  const reponse = await fetch(`${base}/chants/api/${chemin}`)
  if (!reponse.ok) throw new Error(String(reponse.status))
  return reponse.json() as Promise<T>
}

export const useEnregistrements = (id: string) =>
  useQuery({
    queryKey: ['chant', id],
    queryFn: () => lire<{ enregistrements: Enregistrement[] }>(`chant/${id}`),
    enabled: Boolean(id && adresseLivres()),
    staleTime: 3_600_000,
    retry: 1,
  })

export const useDecouvertes = () =>
  useQuery({
    queryKey: ['chants-decouvrir'],
    queryFn: () => lire<{ enregistrements: Enregistrement[] }>('decouvrir'),
    enabled: Boolean(adresseLivres()),
    staleTime: 3_600_000,
    retry: 1,
  })

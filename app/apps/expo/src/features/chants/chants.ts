import { useQuery } from '@tanstack/react-query'
import { adresseLivres } from '~features/livres/livres'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'

/**
 * Empreinte · Chants. Le catalogue (cantiques du domaine public, paroles libres) est choisi à
 * la main ; le serveur Empreinte cherche les enregistrements libres de chacun sur Wikimedia
 * Commons et Internet Archive, en vérifiant leur licence (scripts/chants-empreinte.mjs).
 */
export type ThemeChant = 'louange' | 'confiance' | 'priere' | 'noel' | 'paques' | 'meditation'

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
}

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
  'meditation',
]

/** Les couleurs d'un thème : un dégradé pour ses cartes (pas de photo à répéter). */
export const COULEURS_THEME: Record<ThemeChant, [string, string]> = {
  louange: ['#8A5A14', '#D69A36'],
  confiance: ['#12355B', '#3474B0'],
  priere: ['#3B1F4A', '#7A4F99'],
  paques: ['#6B2D2D', '#C76A4C'],
  noel: ['#0F3D2E', '#2F8462'],
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

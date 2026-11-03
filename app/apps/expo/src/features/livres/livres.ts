import { useQuery } from '@tanstack/react-query'
import { Platform } from 'react-native'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'

/**
 * Empreinte · Livres chrétiens du domaine public. Le catalogue est choisi à la main (aucune
 * œuvre qui représente Jésus) ; le serveur Empreinte va chercher le texte sur le Projet
 * Gutenberg et la voix sur LibriVox, puis les garde en cache (scripts/livres-empreinte.mjs).
 */
export type FicheLivre = {
  id: string
  titre: string
  auteur: string
  annee: number
  langue: 'fr' | 'en'
  theme: string
  resume: string
}

export type PisteLivre = {
  titre: string
  url: string
  duree: number
  lecteur: string
  page: string
}

export type Livre = {
  id: string
  chapitres: { titre: string }[]
  audio: PisteLivre[]
  audioEnCours?: boolean
  source: { gutenberg: number; url: string; titre: string; auteurs: string[] }
}

export type Chapitre = { titre: string; paragraphes: string[] }

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const catalogueLivres = (require('./catalogue.json') as { livres: FicheLivre[] }).livres

export const THEMES = [
  'vie-interieure',
  'priere',
  'evangile',
  'temoignage',
  'recit',
  'apologetique',
]

export const ficheLivre = (id: string) => catalogueLivres.find(livre => livre.id === id)

/** Le serveur Empreinte (le même relais que les ressources bibliques). */
export const adresseLivres = () =>
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? (window as { __EMPREINTE_RELAIS__?: string }).__EMPREINTE_RELAIS__
    : undefined

const lire = async <T>(chemin: string): Promise<T> => {
  const base = adresseLivres()
  if (!base) throw new Error('serveur Empreinte absent')
  const reponse = await fetch(`${base}/livres/api/livre/${chemin}`)
  if (!reponse.ok) throw new Error(String(reponse.status))
  return reponse.json() as Promise<T>
}

export const useLivre = (id: string) =>
  useQuery({
    queryKey: ['livre', id],
    queryFn: () => lire<Livre>(id),
    enabled: Boolean(id && adresseLivres()),
    staleTime: Infinity,
    retry: 1,
    // La voix (LibriVox) arrive après le texte : on redemande tant qu'elle est cherchée.
    refetchInterval: query => (query.state.data?.audioEnCours ? 8000 : false),
  })

export const useChapitre = (id: string, numero: number) =>
  useQuery({
    queryKey: ['livre', id, numero],
    queryFn: () => lire<Chapitre>(`${id}/${numero}`),
    enabled: Boolean(id && adresseLivres()),
    staleTime: Infinity,
    retry: 1,
  })

/** Où chacun en est dans chaque livre (gardé dans la sauvegarde du compte). */
export const progressionLivresAtom = atomWithAsyncStorage<Record<string, { chapitre: number }>>(
  'empreinte.livres',
  {}
)

export const langueLivresAtom = atomWithAsyncStorage<'fr' | 'en' | 'tous'>(
  'empreinte.langueLivres',
  'tous'
)

/** Le titre affiché d'un chapitre : le sien, sinon « Partie n ». */
export const titreChapitre = (titre: string, numero: number, partie: string) =>
  titre || `${partie} ${numero + 1}`

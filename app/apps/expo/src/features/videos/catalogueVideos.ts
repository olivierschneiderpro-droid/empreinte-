import { useAtom } from 'jotai'
import type { ActiveLanguage } from '~helpers/languageUtils'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'
import {
  getAllPassageMedia,
  type PassageMediaCategory,
  type ResolvedPassageMediaCatalogItem,
} from '~features/bible/passageMedia'
import useLanguage from '~helpers/useLanguage'

export type Video = ResolvedPassageMediaCatalogItem

/** L'ordre des rangées sur la page Vidéos. */
export const RANGEES: PassageMediaCategory[] = [
  'how-to-read',
  'book-overview',
  'theme',
  'word-study',
  'visual-commentary',
  'book-collection',
  'short',
  'podcast',
  'classroom',
  'long-form',
]

/** Empreinte : la langue des vidéos se choisit sur la page, indépendamment de l'app. */
const langueVideosAtom = atomWithAsyncStorage<ActiveLanguage | 'app'>(
  'empreinte.langueVideos',
  'app'
)

export const useLangueVideos = () => {
  const langueApp = useLanguage()
  const [choix, choisir] = useAtom(langueVideosAtom)
  return [choix === 'app' ? langueApp : choix, choisir] as const
}

export const videosParRangee = (langue: ActiveLanguage) => {
  const toutes = getAllPassageMedia(langue)
  return RANGEES.map(categorie => ({
    categorie,
    videos: toutes.filter(video => video.categories.includes(categorie)),
  })).filter(rangee => rangee.videos.length)
}

export const trouverVideo = (langue: ActiveLanguage, id: string) =>
  getAllPassageMedia(langue).find(video => video.workId === id)

const normaliser = (texte: string) => texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export const chercherVideos = (langue: ActiveLanguage, recherche: string) => {
  const mots = normaliser(recherche).split(/\s+/).filter(Boolean)
  return getAllPassageMedia(langue).filter(video => {
    const texte = normaliser(`${video.title} ${video.reference}`)
    return mots.every(mot => texte.includes(mot))
  })
}

/** Les vidéos à suivre : même livre d'abord, puis même catégorie. */
export const videosLiees = (langue: ActiveLanguage, video: Video, nombre = 14) => {
  const autres = getAllPassageMedia(langue).filter(autre => autre.workId !== video.workId)
  const score = (autre: Video) =>
    (autre.books.some(livre => video.books.includes(livre)) ? 2 : 0) +
    (autre.categories.some(categorie => video.categories.includes(categorie)) ? 1 : 0)
  return autres
    .map(autre => ({ autre, score: score(autre) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, nombre)
    .map(({ autre }) => autre)
}

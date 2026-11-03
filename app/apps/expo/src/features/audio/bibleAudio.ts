import { atom } from 'jotai'
import { getDefaultStore } from 'jotai/vanilla'
import books, { sections } from '~assets/bible_versions/books-desc'
import { versions } from '~helpers/bibleVersions'
import { joursDeLectureAtom, noterLecture } from '~features/empreinte/SymboleCompte'

/**
 * Empreinte Audio : la Bible écoutée dans l'app. Une seule lecture pour toute l'app ; elle
 * continue quand on change de page (mini-lecteur), et passe seule au chapitre suivant.
 */
export type PisteBible = { version: string; book: number; chapter: number }

/** Une piste hors Bible (un chapitre de livre lu par LibriVox…), dans une liste. */
export type PisteLibre = { titre: string; sousTitre: string; url: string; retour: string }

export type EtatAudio = {
  piste: PisteBible | null
  libre: { pistes: PisteLibre[]; index: number } | null
  enLecture: boolean
  position: number
  duree: number
  vitesse: number
  erreur: boolean
}

export const etatAudioAtom = atom<EtatAudio>({
  piste: null,
  libre: null,
  enLecture: false,
  position: 0,
  duree: 0,
  vitesse: 1,
  erreur: false,
})

const magasin = getDefaultStore()
const mettreAJour = (partiel: Partial<EtatAudio>) =>
  magasin.set(etatAudioAtom, { ...magasin.get(etatAudioAtom), ...partiel })

/** Les versions qui ont une Bible lue (voix enregistrée). */
export const versionsAudio = Object.values(versions).filter(
  version => version.hasAudio && version.getAudioUrl
)

export const livre = (numero: number) => books.find(book => book.Numero === numero)

/** La « famille » du livre (Loi, Prophètes, Évangiles…), pour la description. */
export const familleDuLivre = (numero: number) =>
  sections.find(section => section.data.some(book => book.Numero === numero))?.title ?? ''

export const urlAudio = ({ version, book, chapter }: PisteBible) =>
  versions[version]?.getAudioUrl?.(book, chapter) ?? ''

let element: HTMLAudioElement | null = null

const audio = () => {
  if (element || typeof window === 'undefined' || typeof Audio === 'undefined') return element
  element = new Audio()
  element.preload = 'auto'
  element.addEventListener('timeupdate', () =>
    mettreAJour({ position: element?.currentTime ?? 0, duree: element?.duration || 0 })
  )
  element.addEventListener('play', () => mettreAJour({ enLecture: true, erreur: false }))
  element.addEventListener('pause', () => mettreAJour({ enLecture: false }))
  element.addEventListener('error', () => mettreAJour({ enLecture: false, erreur: true }))
  element.addEventListener('ended', () => suivant())
  return element
}

export const jouer = (piste: PisteBible) => {
  const lecteur = audio()
  if (!lecteur) return
  lecteur.src = urlAudio(piste)
  lecteur.playbackRate = magasin.get(etatAudioAtom).vitesse
  mettreAJour({ piste, libre: null, position: 0, duree: 0, erreur: false })
  magasin.set(joursDeLectureAtom, noterLecture(magasin.get(joursDeLectureAtom)))
  void lecteur.play().catch(() => mettreAJour({ enLecture: false }))
}

/** Lit une piste d'une liste (livre écouté) ; la suivante s'enchaîne seule. */
export const jouerLibre = (pistes: PisteLibre[], index: number) => {
  const lecteur = audio()
  const piste = pistes[index]
  if (!lecteur || !piste) return
  lecteur.src = piste.url
  lecteur.playbackRate = magasin.get(etatAudioAtom).vitesse
  mettreAJour({ piste: null, libre: { pistes, index }, position: 0, duree: 0, erreur: false })
  void lecteur.play().catch(() => mettreAJour({ enLecture: false }))
}

export const basculer = () => {
  const lecteur = audio()
  const { piste, libre } = magasin.get(etatAudioAtom)
  if (!lecteur || (!piste && !libre)) return
  if (lecteur.paused) void lecteur.play().catch(() => {})
  else lecteur.pause()
}

export const arreter = () => {
  element?.pause()
  if (element) element.removeAttribute('src')
  mettreAJour({ piste: null, libre: null, enLecture: false, position: 0, duree: 0 })
}

export const chercher = (secondes: number) => {
  if (element) element.currentTime = secondes
}

export const changerVitesse = (vitesse: number) => {
  if (element) element.playbackRate = vitesse
  mettreAJour({ vitesse })
}

const voisin = (piste: PisteBible, sens: 1 | -1): PisteBible | null => {
  const actuel = livre(piste.book)
  if (!actuel) return null
  const chapitre = piste.chapter + sens
  if (chapitre >= 1 && chapitre <= actuel.Chapitres) return { ...piste, chapter: chapitre }
  const autre = livre(piste.book + sens)
  if (!autre || autre.Numero > 66) return null
  return { ...piste, book: autre.Numero, chapter: sens === 1 ? 1 : autre.Chapitres }
}

export const suivant = () => {
  const { piste, libre } = magasin.get(etatAudioAtom)
  if (libre) {
    if (libre.index + 1 < libre.pistes.length) jouerLibre(libre.pistes, libre.index + 1)
    else arreter()
    return
  }
  const prochaine = piste && voisin(piste, 1)
  if (prochaine) jouer(prochaine)
  else arreter()
}

export const precedent = () => {
  const { piste, libre } = magasin.get(etatAudioAtom)
  if (libre) {
    if (libre.index > 0) jouerLibre(libre.pistes, libre.index - 1)
    return
  }
  const avant = piste && voisin(piste, -1)
  if (avant) jouer(avant)
}

export const formatTemps = (secondes: number) => {
  if (!Number.isFinite(secondes) || secondes <= 0) return '0:00'
  const minutes = Math.floor(secondes / 60)
  return `${minutes}:${String(Math.floor(secondes % 60)).padStart(2, '0')}`
}

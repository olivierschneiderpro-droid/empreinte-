import { atom } from 'jotai'

/**
 * Empreinte · Espace d'étude : ce qui s'ouvre à côté de la Bible, sans la remplacer.
 * - une deuxième lecture indépendante (sa propre barre : livre, chapitre, version) ;
 * - une vidéo, qui se regarde tranquillement à côté du texte.
 */
export type Compagnon =
  | { type: 'bible'; book: number; chapter: number; version: string }
  | { type: 'video'; id: string }

export const compagnonAtom = atom<Compagnon | null>(null)

/**
 * Empreinte · Plan ↔ Bible : quand une étape de plan ouvre un passage dans la Bible, la Bible
 * garde le chemin du retour pour proposer « Suite du plan ».
 */
export const parcoursEnCoursAtom = atom<{ retour: string } | null>(null)

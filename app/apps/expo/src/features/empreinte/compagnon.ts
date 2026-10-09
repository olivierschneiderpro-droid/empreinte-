import { atom, type Getter } from 'jotai'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'
import { activeTabIndexAtom, tabGroupsAtom, tabsAtom } from '~state/tabs'
import { indexOngletBible } from './ouvrirDansLaBible'

/**
 * Empreinte · Espace d'étude : ce qui s'ouvre à côté de la Bible, sans la remplacer.
 * - une deuxième lecture indépendante (sa propre barre : livre, chapitre, version) ;
 * - une vidéo, qui se regarde tranquillement à côté du texte ;
 * - « Autour du passage » : ce qui accompagne le chapitre lu (vidéos, écoute, plans).
 */
export type Compagnon =
  | { type: 'bible'; book: number; chapter: number; version: string }
  | { type: 'video'; id: string }
  | { type: 'autour' }

/**
 * Chaque onglet Bible garde son propre compagnon : un onglet « Romains + Galates », un autre
 * « Marc + vidéo »… On passe d'un duo à l'autre en changeant d'onglet, et le duo reste au
 * retour dans l'app.
 */
const compagnonsParOngletAtom = atomWithAsyncStorage<Record<string, Compagnon>>(
  'empreinte.compagnons',
  {}
)

const idOngletActif = (get: Getter) => get(tabsAtom)[get(activeTabIndexAtom)]?.id

export const compagnonAtom = atom(
  get => {
    const id = idOngletActif(get)
    return (id && get(compagnonsParOngletAtom)[id]) || null
  },
  (get, set, valeur: Compagnon | null) => {
    const onglets = get(tabsAtom)
    // Le compagnon va à l'onglet Bible qui s'affichera (l'actif s'il est une Bible).
    const id = onglets[indexOngletBible()]?.id ?? idOngletActif(get)
    if (!id) return
    const existants = new Set(
      get(tabGroupsAtom).flatMap(groupe => groupe.tabs.map(onglet => onglet.id))
    )
    const suivants = Object.fromEntries(
      Object.entries(get(compagnonsParOngletAtom)).filter(
        ([cle]) => cle !== id && existants.has(cle)
      )
    )
    if (valeur) suivants[id] = valeur
    set(compagnonsParOngletAtom, suivants)
  }
)

/**
 * Empreinte · Plan ↔ Bible : quand une étape de plan ouvre un passage dans la Bible, la Bible
 * garde le chemin du retour pour proposer « Suite du plan ».
 */
export const parcoursEnCoursAtom = atom<{ retour: string } | null>(null)

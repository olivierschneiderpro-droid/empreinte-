import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { produce } from 'immer'
import { getDefaultStore } from 'jotai/vanilla'
import books from '~assets/bible_versions/books-desc'
import {
  activeTabIndexAtom,
  appSwitcherModeAtom,
  getDefaultBibleTab,
  tabsAtom,
  tabsAtomsAtom,
  type BibleTab,
  type VersionCode,
} from '~state/tabs'
import { versions } from '~helpers/bibleVersions'
import { selectBibleTabVersion } from '~helpers/bibleTabVersionSelection'
import { useWorkspaceRoutePanel } from '~navigation/useWorkspaceRoutePanel'

export type PassageBible = { book: number; chapter: number; verse?: number; version?: string }

/** Lit une référence « v=livre-chapitre-versets » (liens des ressources d'étude). */
export const passageDepuisLien = (valeur: string): PassageBible | undefined => {
  const [livre, chapitre, versets] = valeur.split('-')
  const book = Number(livre)
  const chapter = Number(chapitre)
  const verse = Number(versets?.split(',')[0])
  if (!books[book - 1] || !(chapter >= 1)) return undefined
  return { book, chapter, verse: verse >= 1 ? verse : undefined }
}

/**
 * Empreinte : l'onglet Bible du groupe actif — l'onglet actif s'il est une Bible, sinon la
 * première Bible du groupe, sinon une nouvelle Bible ajoutée au groupe. La Bible s'ouvre
 * ainsi toujours dans le lecteur normal, jamais dans une page de partage.
 */
export const indexOngletBible = () => {
  const store = getDefaultStore()
  const onglets = store.get(tabsAtomsAtom)
  const actif = store.get(activeTabIndexAtom)
  if (onglets[actif] && store.get(onglets[actif]).type === 'bible') return actif
  const trouve = onglets.findIndex(onglet => store.get(onglet).type === 'bible')
  if (trouve >= 0) return trouve
  store.set(tabsAtom, precedents => [...precedents, getDefaultBibleTab()])
  return store.get(tabsAtomsAtom).length - 1
}

/** Afficher la Bible (bouton « Bible », « Lire la Bible ») : le lecteur normal, en grand. */
export const useAllerALaBible = () => {
  const router = useRouter()
  return useCallback(() => {
    const store = getDefaultStore()
    const index = indexOngletBible()
    if (index !== store.get(activeTabIndexAtom)) store.set(activeTabIndexAtom, index)
    store.set(appSwitcherModeAtom, 'view')
    router.navigate('/')
  }, [router])
}

/**
 * Empreinte : depuis une page d'étude (Nave, dictionnaire, plan…), revenir à la Bible
 * principale, ouverte au bon passage. La page d'étude reste à portée : elle s'affiche à
 * côté de la Bible quand elle y était déjà, sinon le retour du navigateur y ramène.
 */
export const useOuvrirDansLaBible = () => {
  const router = useRouter()
  const { showsStudy } = useWorkspaceRoutePanel()

  return useCallback(
    ({ book, chapter, verse = 1, version }: PassageBible) => {
      const store = getDefaultStore()
      const livre = books[book - 1]
      if (!livre) return
      const index = indexOngletBible()
      const actif = store.get(activeTabIndexAtom)
      const onglets = store.get(tabsAtomsAtom)
      store.set(
        onglets[index],
        produce(brouillon => {
          if (brouillon.type !== 'bible') return
          if (version && version in versions)
            (brouillon as BibleTab).data = selectBibleTabVersion(
              (brouillon as BibleTab).data,
              version as VersionCode
            )
          const donnees = (brouillon as BibleTab).data
          donnees.selectedBook = livre
          donnees.selectedChapter = chapter
          donnees.selectedVerse = verse
          donnees.temp = { selectedBook: livre, selectedChapter: chapter, selectedVerse: verse }
          donnees.focusVerses = undefined
        })
      )
      if (index !== actif) store.set(activeTabIndexAtom, index)
      store.set(appSwitcherModeAtom, 'view')
      if (!showsStudy) router.navigate('/')
    },
    [router, showsStudy]
  )
}

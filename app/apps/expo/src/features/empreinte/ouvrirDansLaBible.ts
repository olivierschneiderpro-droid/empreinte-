import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { produce } from 'immer'
import { getDefaultStore } from 'jotai/vanilla'
import books from '~assets/bible_versions/books-desc'
import { activeTabIndexAtom, tabsAtomsAtom, type BibleTab, type VersionCode } from '~state/tabs'
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
      const onglets = store.get(tabsAtomsAtom)
      const actif = store.get(activeTabIndexAtom)
      const index =
        onglets[actif] && store.get(onglets[actif]).type === 'bible'
          ? actif
          : onglets.findIndex(onglet => store.get(onglet).type === 'bible')
      const livre = books[book - 1]
      if (index < 0 || !livre) {
        router.push({
          pathname: '/bible-view',
          params: { book: String(book), chapter: String(chapter), verse: String(verse) },
        })
        return
      }
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
      if (!showsStudy) router.navigate('/')
    },
    [router, showsStudy]
  )
}

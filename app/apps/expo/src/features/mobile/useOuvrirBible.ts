import { useAtomValue, useSetAtom } from 'jotai/react'
import { useSelector } from 'react-redux'
import { useTabAnimations } from '~features/app-switcher/utils/useTabAnimations'
import { compactWorkspaceDrawerAtom } from '~features/app-switcher/workspaceViewTracking'
import type { RootState } from '~redux/modules/reducer'
import { activeTabIndexAtom, getDefaultBibleTab, tabsAtom } from '../../state/tabs'
import { getDefaultBibleVersionFromState } from '../../state/useDefaultBibleVersion'

/**
 * Interface mobile + tablette : ouvre l'onglet Bible (le premier existant, sinon un nouveau)
 * et referme la page pleine posée au-dessus des onglets.
 */
export function useOuvrirBible() {
  const tabs = useAtomValue(tabsAtom)
  const setTabs = useSetAtom(tabsAtom)
  const setActiveTabIndex = useSetAtom(activeTabIndexAtom)
  const setPage = useSetAtom(compactWorkspaceDrawerAtom)
  const defaultVersion = useSelector((state: RootState) => getDefaultBibleVersionFromState(state))
  const { slideToIndex } = useTabAnimations()

  return () => {
    setPage(null)
    const bibleIndex = tabs.findIndex(tab => tab.type === 'bible')
    if (bibleIndex !== -1) {
      slideToIndex(bibleIndex)
      return
    }
    setTabs(prev => [...prev, getDefaultBibleTab(defaultVersion)])
    setActiveTabIndex(tabs.length)
    slideToIndex(tabs.length)
  }
}

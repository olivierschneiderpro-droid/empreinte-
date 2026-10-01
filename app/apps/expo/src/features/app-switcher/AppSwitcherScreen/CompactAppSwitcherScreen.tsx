import { compactWorkspaceDrawerAtom } from '../workspaceViewTracking'
import { useAtom, useAtomValue } from 'jotai/react'
import React, { useEffect, useRef } from 'react'
import Box from '~common/ui/Box'
import BottomTabBar from '~features/app-switcher/BottomTabBar/BottomTabBar'
import RealitesScreen from '~features/empreinte/RealitesScreen'
import { Home } from '~features/home/HomeScreen'
import { More } from '~features/settings/MoreScreen'
import { subscribeToHardwareBackPress } from '~helpers/hardwareBackPress'
import { tabsCountAtom } from '../../../state/tabs'
import SharedBibleDOM from '~features/bible/SharedBibleDOM'
import CachedTabScreens from '../CachedTabScreens'
import { TabContextProvider } from '../context/TabContext'
import TabPreviewCarousel from '../TabPreviewCarousel/TabPreviewCarousel'
import TabGroupPager from './TabGroupPager'

export const TAB_PREVIEW_SCALE = 0.6

/**
 * Espace de travail sur téléphone.
 *
 * Empreinte : Accueil, Plus et Réalités ne s'ouvrent plus en tiroir sur le côté.
 * Ce sont des pages pleines posées sur les onglets, et la barre flottante du bas
 * reste toujours visible pour passer d'une page à l'autre, sans croix ni retour.
 */
const AppSwitcherScreenWrapper = () => {
  const [page, setPage] = useAtom(compactWorkspaceDrawerAtom)
  const tabsCount = useAtomValue(tabsCountAtom)
  const pageRef = useRef(page)
  pageRef.current = page

  const fermer = () => setPage(null)

  useEffect(() => () => setPage(null), [setPage])

  // Ouvrir un nouvel onglet ramène sur les onglets.
  useEffect(() => {
    setPage(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabsCount])

  useEffect(
    () =>
      subscribeToHardwareBackPress(() => {
        if (!pageRef.current) return false
        setPage(null)
        return true
      }),
    [setPage]
  )

  return (
    <TabContextProvider>
      <Box nativeID="compact-workspace" className="flex-1 bg-light-grey overflow-hidden">
        <TabGroupPager />
        <CachedTabScreens />
        <SharedBibleDOM />
        <TabPreviewCarousel />
        {page ? (
          <Box className="absolute inset-0 bg-light-grey" testID={`compact-page-${page}`}>
            {page === 'home' && <Home closeHome={fermer} inWorkspace />}
            {page === 'menu' && <More closeMenu={fermer} inWorkspace={false} pageTab />}
            {page === 'realites' && <RealitesScreen />}
          </Box>
        ) : null}
        <BottomTabBar
          openMenu={() => setPage('menu')}
          openHome={() => setPage('home')}
          page={page}
          onPage={setPage}
        />
      </Box>
    </TabContextProvider>
  )
}

export default AppSwitcherScreenWrapper

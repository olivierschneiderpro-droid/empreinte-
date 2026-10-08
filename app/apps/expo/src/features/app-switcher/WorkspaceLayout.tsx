import WorkspaceKeyboardShortcuts from './WorkspaceKeyboardShortcuts'
import GlobalCommandPalette from './commandPalette/GlobalCommandPalette'
import { finishPageTransition, navigateWithPageTransition } from '~navigation/pageTransition'
import { usePathname, useRouter } from 'expo-router'
import type { ReactNode } from 'react'
import type { PublicShellMode } from '~features/app/publicShellPolicy'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import {
  useWorkspaceRoutePanel,
  workspaceSidebarDockedAtom,
  workspaceSidebarHiddenAtom,
  rouvrirBarreLateraleAtom,
} from '~navigation/useWorkspaceRoutePanel'
import Box, { HStack, TouchableBox } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import SharedBibleDOM from '~features/bible/SharedBibleDOM'
import CachedTabScreens from './CachedTabScreens'
import WorkspaceSidebar from './WorkspaceSidebar'
import { styleVerre, useVerre } from '~features/empreinte/lumiere'
import { TabContextProvider } from './context/TabContext'
import { useResponsiveWorkspace, WORKSPACE_SIDEBAR_WIDTH } from './utils/useResponsiveWorkspace'
import { getWorkspacePageForPath, workspacePagePath } from './workspaceRoutes'
import PorteDeConnexion from '~features/empreinte/PorteDeConnexion'
import { PAGES_SANS_COQUE } from '~features/empreinte/compte'

// Pages de lecture : Sommaire (péricopes) et journée de plan, comme le lecteur Bible.
const PAGES_EN_PANNEAU = [
  '/pericope',
  '/plan',
  '/plan-slice',
  // Empreinte : les listes d'étude et de bibliothèque reposent dans le même panneau que la
  // Bible, avec la même marge de 16 px de chaque côté, en haut comme en bas.
  '/history',
  '/lexique',
  '/dictionnaire',
  '/nave',
  '/commentary-library',
  '/studies',
  '/bible-verse-notes',
  '/bookmarks',
  '/highlights',
  '/tags',
]

export default function WorkspaceLayout({
  children,
  mode = 'workspace',
}: {
  children: ReactNode
  mode?: PublicShellMode
}) {
  const workspaceActive = mode === 'workspace'
  const verre = useVerre()
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  useLayoutEffect(() => {
    finishPageTransition()
  }, [pathname])
  const wideViewport = useResponsiveWorkspace()
  const isWide = workspaceActive && wideViewport
  // Empreinte : la connexion et l'inscription s'affichent seules, sans barre latérale.
  const sansCoque = PAGES_SANS_COQUE.includes(pathname)
  const panel = useWorkspaceRoutePanel()
  const showsStudy = workspaceActive && panel.showsStudy
  const [sidebarHidden, setSidebarHidden] = useAtom(workspaceSidebarHiddenAtom)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const setSidebarDocked = useSetAtom(workspaceSidebarDockedAtom)
  const overlayMode = Platform.OS === 'web' && !panel.sidebarDocked
  useLayoutEffect(() => {
    if (Platform.OS === 'web') setSidebarDocked(panel.sidebarDocked)
  }, [panel.sidebarDocked, setSidebarDocked])
  const sidebarVisible = isWide && !sansCoque && (overlayMode ? overlayOpen : !sidebarHidden)
  const setRouvrir = useSetAtom(rouvrirBarreLateraleAtom)
  useEffect(() => {
    setRouvrir(
      isWide && !sidebarVisible
        ? { rouvrir: () => (overlayMode ? setOverlayOpen(true) : setSidebarHidden(false)) }
        : null
    )
  }, [isWide, sidebarVisible, overlayMode, setRouvrir, setSidebarHidden])
  useEffect(() => {
    setOverlayOpen(false)
  }, [overlayMode, isWide, pathname])
  // Web sheets render through a body portal, outside the workspace DOM tree.
  useEffect(() => {
    if (Platform.OS !== 'web') return
    document.documentElement.style.setProperty(
      '--workspace-restore-inset',
      // Empreinte : barre fermée, le bouton de réouverture est en haut à gauche des pages ;
      // dans la Bible, il est intégré à l'en-tête, avant le bouton du livre.
      isWide && !sansCoque && !sidebarVisible && pathname !== '/' && !panel.showsStudy
        ? '52px'
        : '0px'
    )
    document.documentElement.style.setProperty(
      '--workspace-content-left',
      `${isWide && !sansCoque && !overlayMode && !sidebarHidden ? WORKSPACE_SIDEBAR_WIDTH : 0}px`
    )
    return () => {
      document.documentElement.style.removeProperty('--workspace-content-left')
      document.documentElement.style.removeProperty('--workspace-restore-inset')
    }
  }, [isWide, sansCoque, overlayMode, sidebarHidden, sidebarVisible, pathname, panel.showsStudy])

  const isWorkspace = pathname === '/'
  // Empreinte : les pages de lecture reposent dans un panneau arrondi, comme la Bible ;
  // les autres pages restent sur le fond uniforme, avec leurs propres éléments arrondis.
  const enPanneau = isWide && PAGES_EN_PANNEAU.includes(pathname)
  const visitPage = (page: 'home' | 'settings') => {
    setOverlayOpen(false)
    if (pathname !== workspacePagePath[page])
      navigateWithPageTransition(workspacePagePath[page], () =>
        router.push(workspacePagePath[page])
      )
  }

  return (
    // Keep the route slot at the same React position through auth resolution and
    // legacy URL redirects. Replacing the shell would remount Expo Router's Stack.
    <HStack
      className={
        workspaceActive
          ? 'flex-1 bg-light-grey overflow-hidden'
          : 'flex-1 bg-reverse overflow-hidden'
      }
      style={{ display: mode === 'pending' ? 'none' : 'flex' }}
    >
      {workspaceActive && <GlobalCommandPalette />}
      {workspaceActive && <PorteDeConnexion />}
      {workspaceActive && (
        <WorkspaceKeyboardShortcuts
          toggleSidebar={() => {
            if (isWide) {
              if (overlayMode) setOverlayOpen(value => !value)
              else setSidebarHidden(value => !value)
            }
          }}
        />
      )}
      {isWide && !sansCoque && (
        <Box
          testID="workspace-sidebar-motion"
          pointerEvents={sidebarVisible ? 'auto' : 'none'}
          aria-hidden={!sidebarVisible}
          style={{
            width: overlayMode || sidebarVisible ? WORKSPACE_SIDEBAR_WIDTH : 0,
            overflow: 'hidden',
            alignSelf: 'stretch',
            ...(overlayMode
              ? {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  zIndex: 30,
                  transform: [{ translateX: sidebarVisible ? 0 : -WORKSPACE_SIDEBAR_WIDTH }],
                }
              : {}),
          }}
        >
          <Box
            testID="workspace-sidebar-inner"
            style={{
              width: WORKSPACE_SIDEBAR_WIDTH,
              flex: 1,
              transform: [
                { translateX: !overlayMode && !sidebarVisible ? -WORKSPACE_SIDEBAR_WIDTH : 0 },
              ],
            }}
          >
            <WorkspaceSidebar
              onCollapse={() => (overlayMode ? setOverlayOpen(false) : setSidebarHidden(true))}
              openHome={() => visitPage('home')}
              openMenu={() => visitPage('settings')}
              activePage={getWorkspacePageForPath(pathname)}
              isContentActive={isWorkspace || showsStudy}
              onSelectContent={() => {
                setOverlayOpen(false)
                if (!isWorkspace) router.push('/')
              }}
            />
          </Box>
        </Box>
      )}
      {isWide && overlayMode && !sansCoque && (
        <TouchableBox
          testID="workspace-sidebar-backdrop"
          pointerEvents={sidebarVisible ? 'auto' : 'none'}
          aria-hidden={!sidebarVisible}
          style={{ opacity: sidebarVisible ? 1 : 0 }}
          className="absolute inset-0 z-20 bg-black/20"
          accessibilityRole="button"
          accessibilityLabel={t('Fermer')}
          onPress={() => setOverlayOpen(false)}
        />
      )}
      <Box testID="workspace-main-surface" className="flex-1 min-w-0">
        {isWide && !sansCoque && !sidebarVisible && !isWorkspace && !showsStudy ? (
          // Empreinte : barre fermée, le bouton pour la rouvrir est en haut à gauche des pages.
          <Box className="absolute left-[16px] top-[10px] bg-transparent" style={{ zIndex: 1000 }}>
            <TouchableBox
              className="items-center justify-center w-[44px] h-[44px]"
              style={styleVerre(verre, 22)}
              onPress={() => (overlayMode ? setOverlayOpen(true) : setSidebarHidden(false))}
              accessibilityRole="button"
              accessibilityLabel={t('workspace.showSidebar')}
            >
              <FeatherIcon name="sidebar" size={18} />
            </TouchableBox>
          </Box>
        ) : null}
        <Box className="flex-1 min-h-0">
          {isWide && (
            <Box
              testID="workspace-reader-motion"
              dataSet={Platform.OS === 'web' ? { assistantSurface: 'reader' } : undefined}
              className="absolute inset-0 overflow-hidden"
              style={[
                // Empreinte : le lecteur repose dans un grand panneau de verre (maquette bureau).
                styleVerre(verre, 28),
                {
                  display: isWorkspace || showsStudy ? 'flex' : 'none',
                  top: 16,
                  bottom: 16,
                  left: 16,
                  right: (panel.open ? panel.reservedWidth : 0) + 16,
                },
              ]}
            >
              <TabContextProvider>
                <CachedTabScreens />
                <SharedBibleDOM />
              </TabContextProvider>
            </Box>
          )}
          <Box
            testID={showsStudy ? 'workspace-panel-slot' : undefined}
            dataSet={
              Platform.OS === 'web'
                ? { assistantSurface: showsStudy ? 'panel' : 'reader' }
                : undefined
            }
            className="flex-1 overflow-hidden"
            style={[
              enPanneau || showsStudy ? styleVerre(verre, 28) : null,
              {
                display: isWide && isWorkspace ? 'none' : 'flex',
                ...(showsStudy
                  ? {
                      // Empreinte : le panneau d'étude est une page de lecture, arrondi comme
                      // le lecteur, avec le même écart de 16 px.
                      position: 'absolute',
                      top: 16,
                      bottom: 16,
                      right: 16,
                      width: panel.reservedWidth - 16,
                    }
                  : enPanneau
                    ? { position: 'absolute', top: 16, bottom: 16, left: 16, right: 16 }
                    : undefined),
              },
            ]}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </HStack>
  )
}

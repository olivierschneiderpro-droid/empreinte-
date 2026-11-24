import { useAtomValue, useSetAtom } from 'jotai/react'
import { useRouter } from 'expo-router'
import { Pressable, View, useWindowDimensions } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isFullScreenBibleAtom } from 'src/state/app'
import { AnimatedBox, TouchableBox } from '~common/ui/Box'
import Text from '~common/ui/Text'
import { Icone, type NomIcone } from '~features/empreinte/icones'
import { POLICES, police, styleVerre, useVerre } from '~features/empreinte/lumiere'
import { RootState } from '~redux/modules/reducer'
import { useTheme } from '~themes/ThemeProvider'
import {
  activeTabIndexAtom,
  getDefaultBibleTab,
  tabsAtom,
  tabsCountAtom,
} from '../../../state/tabs'
import { getDefaultBibleVersionFromState } from '../../../state/useDefaultBibleVersion'
import { FLOATING_BAR_BOTTOM, FLOATING_BAR_HEIGHT } from '../utils/constants'
import { useTabAnimations } from '../utils/useTabAnimations'
import type { CompactWorkspacePage } from '../workspaceViewTracking'
import AddTabButton from './Buttons/AddTabButton'
import useTabButtonPress from './Buttons/useTabButtonPress'
import GroupTitleButton from './GroupTitleButton'
import useBottomTabBar from './useBottomTabBar'
import useTabBarSwipeGesture from './useTabBarSwipeGesture'

type BottomTabBarProps = {
  openMenu: () => void
  openHome: () => void
  /** Page pleine affichée (Accueil, Plus, Réalités) ; null = les onglets. */
  page?: CompactWorkspacePage | null
  onPage?: (page: CompactWorkspacePage | null) => void
}

/** Un élément de la barre : icône de la maquette + libellé, fond doux quand actif. */
function Element({
  icone,
  libelle,
  actif = false,
  onPress,
  accessibilityLabel,
  pastille,
}: {
  icone: NomIcone
  libelle: string
  actif?: boolean
  onPress: () => void
  accessibilityLabel?: string
  pastille?: number
}) {
  const theme = useTheme()
  const v = useVerre()
  const couleur = actif ? theme.colors.default : theme.colors.grey
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? libelle}
      accessibilityState={{ selected: actif }}
      style={{
        flex: 1,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        backgroundColor: actif ? v.actif : 'transparent',
      }}
    >
      <View>
        <Icone nom={icone} taille={21} couleur={couleur} />
        {pastille !== undefined ? (
          <View
            style={{
              position: 'absolute',
              top: -5,
              right: -10,
              minWidth: 16,
              height: 16,
              paddingHorizontal: 4,
              borderRadius: 8,
              backgroundColor: theme.colors.default,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: police(POLICES.monoMoyen),
                fontSize: 9,
                color: theme.colors.reverse,
              }}
            >
              {pastille > 99 ? '99' : pastille}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        style={{ fontFamily: police(POLICES.titre), fontSize: 10, color: couleur }}
      >
        {libelle}
      </Text>
    </Pressable>
  )
}

const BottomTabBar = ({ openMenu, openHome, page = null, onPage }: BottomTabBarProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const v = useVerre()
  const router = useRouter()
  const { onPress, isViewMode, listStyles, viewStyles } = useBottomTabBar()
  const { panGesture } = useTabBarSwipeGesture()
  const insets = useSafeAreaInsets()
  const isFullScreenBible = useAtomValue(isFullScreenBibleAtom)

  // Interface mobile + tablette. Espace Bible : Accueil · Bible · Chants · Plus.
  // La recherche et le menu des espaces sont en haut de l’accueil ; Réalités a sa propre barre.
  const tabs = useAtomValue(tabsAtom)
  const tabsCount = useAtomValue(tabsCountAtom)
  const activeTabIndex = useAtomValue(activeTabIndexAtom)
  const setTabs = useSetAtom(tabsAtom)
  const setActiveTabIndex = useSetAtom(activeTabIndexAtom)
  const defaultVersion = useSelector((state: RootState) => getDefaultBibleVersionFromState(state))
  const { slideToIndex } = useTabAnimations()
  const { onPress: ouvrirOnglets } = useTabButtonPress()
  const typeActif = page ? undefined : tabs[activeTabIndex]?.type
  const espaceRealites = page === 'realites'
  const versOnglets = (action: () => void) => () => {
    onPage?.(null)
    action()
  }

  const ouvrirBible = () => {
    const bibleIndex = tabs.findIndex(tab => tab.type === 'bible')
    if (bibleIndex !== -1) {
      slideToIndex(bibleIndex)
    } else {
      setTabs(prev => [...prev, getDefaultBibleTab(defaultVersion)])
      setActiveTabIndex(tabs.length)
      slideToIndex(tabs.length)
    }
  }

  // Bible : un toucher ouvre la lecture ; un second toucher, déjà dans la Bible, montre les onglets.
  const toucherBible = () => {
    if (!page && typeActif === 'bible') {
      ouvrirOnglets()
      return
    }
    versOnglets(ouvrirBible)()
  }

  // Sur tablette, la barre garde une largeur de téléphone, centrée.
  const { width: largeur } = useWindowDimensions()
  const marge = Math.max(16, (largeur - 560) / 2)
  const bas = FLOATING_BAR_BOTTOM + insets.bottom
  const masque = FLOATING_BAR_HEIGHT + bas + 20

  return (
    <AnimatedBox
      className="absolute left-[0px] right-[0px] bottom-[0px]"
      pointerEvents="box-none"
      style={{
        height: FLOATING_BAR_HEIGHT + bas,
        transform: [{ translateY: isFullScreenBible ? masque : 0 }],
        transitionProperty: 'transform',
        transitionDuration: 300,
      }}
    >
      <GestureDetector gesture={panGesture}>
        <AnimatedBox
          className="absolute left-[16px] right-[16px] flex-row items-center"
          style={[
            { bottom: bas, height: FLOATING_BAR_HEIGHT, gap: 10, left: marge, right: marge },
            viewStyles,
          ]}
          accessibilityElementsHidden={!isViewMode}
          importantForAccessibility={isViewMode ? 'auto' : 'no-hide-descendants'}
          key="view"
        >
          <View
            accessibilityRole="tablist"
            style={[
              styleVerre(v, 31),
              {
                flex: 1,
                height: FLOATING_BAR_HEIGHT,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 6,
              },
            ]}
          >
            {espaceRealites ? (
              <>
                <Element
                  icone="book"
                  libelle={t('tabs.bible')}
                  accessibilityLabel="Revenir à la Bible"
                  onPress={() => onPage?.('home')}
                />
                <Element icone="layers" libelle="Réalités" actif onPress={() => {}} />
                <Element
                  icone="check"
                  libelle="Vérifier"
                  onPress={() => router.push('/empreinte/verifier')}
                />
              </>
            ) : (
              <>
                <Element
                  icone="home"
                  libelle={t('Accueil')}
                  actif={page === 'home'}
                  onPress={openHome}
                />
                <Element
                  icone="book"
                  libelle={t('tabs.bible')}
                  accessibilityLabel={
                    tabsCount > 1
                      ? `${t('tabs.bible')}, ${t('accessibility.tabs', { count: tabsCount })}`
                      : undefined
                  }
                  actif={typeActif !== undefined}
                  pastille={tabsCount > 1 ? tabsCount : undefined}
                  onPress={toucherBible}
                />
                <Element
                  icone="music"
                  libelle="Chants"
                  actif={page === 'chants'}
                  onPress={() => onPage?.('chants')}
                />
                <Element
                  icone="more"
                  libelle="Plus"
                  accessibilityLabel={t('accessibility.mainMenu')}
                  actif={page === 'menu'}
                  onPress={openMenu}
                />
              </>
            )}
          </View>
          {espaceRealites ? (
            <Pressable
              onPress={() => router.push('/empreinte/capturer')}
              accessibilityRole="button"
              accessibilityLabel="Capturer une réalité"
              style={{
                width: FLOATING_BAR_HEIGHT,
                height: FLOATING_BAR_HEIGHT,
                borderRadius: FLOATING_BAR_HEIGHT / 2,
                backgroundColor: theme.colors.default,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#111113',
                shadowOpacity: 0.28,
                shadowRadius: 26,
                shadowOffset: { width: 0, height: 12 },
              }}
            >
              <Icone nom="scan" taille={26} couleur={theme.colors.reverse} trait={2} />
            </Pressable>
          ) : null}
        </AnimatedBox>
      </GestureDetector>
      <AnimatedBox
        className="absolute left-[16px] right-[16px] flex-row items-center px-[10px]"
        style={[
          styleVerre(v, 31),
          { bottom: bas, height: FLOATING_BAR_HEIGHT, left: marge, right: marge },
          listStyles,
        ]}
        accessibilityElementsHidden={isViewMode}
        importantForAccessibility={isViewMode ? 'no-hide-descendants' : 'auto'}
        key="list"
      >
        <AddTabButton />
        <GroupTitleButton />
        <TouchableBox
          className="items-center justify-center"
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.openSelectedTab')}
          style={{
            width: 48,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.default,
          }}
        >
          <Text
            style={{
              fontFamily: police(POLICES.titre),
              fontSize: 14,
              color: theme.colors.reverse,
            }}
          >
            OK
          </Text>
        </TouchableBox>
      </AnimatedBox>
    </AnimatedBox>
  )
}

export default BottomTabBar

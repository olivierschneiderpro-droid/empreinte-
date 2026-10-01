import { useAtomValue, useSetAtom } from 'jotai/react'
import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'
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
import AddTabButton from './Buttons/AddTabButton'
import useSearchButtonPress from './Buttons/useSearchButton'
import useTabButtonPress from './Buttons/useTabButtonPress'
import GroupTitleButton from './GroupTitleButton'
import useBottomTabBar from './useBottomTabBar'
import useTabBarSwipeGesture from './useTabBarSwipeGesture'

type BottomTabBarProps = {
  openMenu: () => void
  openHome: () => void
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

const BottomTabBar = ({ openMenu, openHome }: BottomTabBarProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const v = useVerre()
  const router = useRouter()
  const { onPress, isViewMode, listStyles, viewStyles } = useBottomTabBar()
  const { panGesture } = useTabBarSwipeGesture()
  const insets = useSafeAreaInsets()
  const isFullScreenBible = useAtomValue(isFullScreenBibleAtom)

  // Mêmes actions que les boutons de Bible Strong (Accueil, Recherche, Bible, Onglets, Menu).
  const tabs = useAtomValue(tabsAtom)
  const tabsCount = useAtomValue(tabsCountAtom)
  const activeTabIndex = useAtomValue(activeTabIndexAtom)
  const setTabs = useSetAtom(tabsAtom)
  const setActiveTabIndex = useSetAtom(activeTabIndexAtom)
  const defaultVersion = useSelector((state: RootState) => getDefaultBibleVersionFromState(state))
  const { slideToIndex } = useTabAnimations()
  const { onPress: ouvrirRecherche } = useSearchButtonPress()
  const { onPress: ouvrirOnglets } = useTabButtonPress()
  const typeActif = tabs[activeTabIndex]?.type

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
          style={[{ bottom: bas, height: FLOATING_BAR_HEIGHT, gap: 10 }, viewStyles]}
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
            <Element icone="home" libelle={t('Accueil')} onPress={openHome} />
            <Element
              icone="book"
              libelle={t('tabs.bible')}
              actif={typeActif === 'bible'}
              onPress={ouvrirBible}
            />
            <Element
              icone="search"
              libelle="Chercher"
              accessibilityLabel={t('tabs.search')}
              actif={typeActif === 'search'}
              onPress={ouvrirRecherche}
            />
            <Element
              icone="tabs"
              libelle="Onglets"
              accessibilityLabel={t('accessibility.tabs', { count: tabsCount })}
              pastille={tabsCount}
              onPress={ouvrirOnglets}
            />
            <Element icone="layers" libelle="Réalités" onPress={() => router.push('/empreinte')} />
            <Element
              icone="more"
              libelle="Plus"
              accessibilityLabel={t('accessibility.mainMenu')}
              onPress={openMenu}
            />
          </View>
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
        </AnimatedBox>
      </GestureDetector>
      <AnimatedBox
        className="absolute left-[16px] right-[16px] flex-row items-center px-[10px]"
        style={[styleVerre(v, 31), { bottom: bas, height: FLOATING_BAR_HEIGHT }, listStyles]}
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

import ResourceDiscovery from './ResourceDiscovery'
import { Image } from 'expo-image'
import { useFonts } from 'expo-font'
import AnimatedVerseHeight from './AnimatedVerseHeight.web'
import { useSetAtom } from 'jotai/react'
import {
  commandPaletteOpenAtom,
  commandPaletteReturnFocusAtom,
} from '~features/app-switcher/commandPalette/state'
import React, { useState } from 'react'
import './desktop-home.css'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { LinkBox, type LinkProps } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import ProfileStats from '~features/profile/components/ProfileStats'
import type { MainStackProps } from '~navigation/type'
import { useTheme } from '~themes/ThemeProvider'
import { resolveFontFamily } from '~themes/styleValues'
import { usePushRouteOnce } from '~navigation/usePushRouteOnce'
import { Events } from './Events'
import OfflineNotice from './OfflineNotice'
import PlanHome from './PlanHome'
import MeditationsHome from './MeditationsHome'
import ResumeBookmark from './ResumeBookmark'
import VerseOfTheDay from './VerseOfTheDay'
import {
  CarteAVerifier,
  CartesMissionPlan,
  BasculeAccueil,
  FilDuJour,
  OuSontLesOriginaux,
  PileRealites,
  TeteAccueil,
} from '~features/empreinte/AccueilLumiere'
import { Aurore } from '~features/empreinte/lumiere'
import { VISIBLE_VERSE_OF_THE_DAY_OFFSETS } from './verseOfTheDayPolicy'

const illustrations = {
  audio: require('~assets/images/home/illustrations/audibible-reader.png'),
  parcours: require('~assets/images/new-tab/library-reader.webp'),
}

function SectionTitle({ children }: React.PropsWithChildren) {
  const theme = useTheme()
  return (
    <Text
      accessibilityRole="header"
      className="text-[22px] mb-[16px]"
      style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
    >
      {children}
    </Text>
  )
}

/** Empreinte : Soutenir, FAQ, Suivre, Télécharger deviennent de vrais blocs. */
function BlocLien({
  icone,
  couleur,
  titre,
  description,
  ...props
}: {
  icone: React.ComponentProps<typeof FeatherIcon>['name']
  couleur: string
  titre: string
  description: string
} & LinkProps<keyof MainStackProps>) {
  return (
    <LinkBox
      {...props}
      accessibilityLabel={titre}
      className="bg-reverse/60 border border-reverse/90 shadow-[0_8px_24px_rgba(17,17,19,0.06)] rounded-[24px] p-[18px] gap-[12px]"
    >
      <Box
        className="w-[44px] h-[44px] rounded-[14px] items-center justify-center"
        style={{ backgroundColor: `${couleur}1A` }}
      >
        <FeatherIcon name={icone} size={22} color={couleur} />
      </Box>
      <Box className="gap-[4px]">
        <Text className="font-bold text-[15px]">{titre}</Text>
        <Text className="text-grey text-[13px]">{description}</Text>
      </Box>
    </LinkBox>
  )
}

/** Empreinte Audio vit dans l'app : la Bible lue à voix haute, sans passer par un store. */
function BlocAudio() {
  const { t } = useTranslation()
  const pushRoute = usePushRouteOnce()
  return (
    <LinkBox
      onPress={() => pushRoute({ pathname: '/audio' })}
      accessibilityLabel={t('home.audio.title')}
      className="bs-home-audio rounded-[28px] overflow-hidden p-[28px] gap-[16px]"
      style={{ backgroundColor: '#112A4D' }}
    >
      <HStack className="items-center gap-[12px]">
        <Box
          className="w-[52px] h-[52px] rounded-full items-center justify-center"
          style={{ backgroundColor: '#24447A' }}
        >
          <FeatherIcon name="headphones" size={26} color="white" />
        </Box>
        <Box
          className="rounded-full px-[10px] py-[4px]"
          style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
        >
          <Text className="text-[white] text-[11px] font-bold uppercase tracking-[1px]">
            {t('home.audio.badge')}
          </Text>
        </Box>
      </HStack>
      <Box className="gap-[10px]">
        <Text className="text-[white] font-bold text-[26px]">{t('home.audio.title')}</Text>
        <Text className="text-[white] text-[15px] leading-[23px] opacity-[0.85]">
          {t('home.audio.description')}
        </Text>
      </Box>
      <Box className="gap-[8px]">
        {(['home.audio.point1', 'home.audio.point2', 'home.audio.point3'] as const).map(cle => (
          <HStack key={cle} className="items-center gap-[10px]">
            <FeatherIcon name="check" size={16} color="#8FB4F0" />
            <Text className="text-[white] text-[14px] opacity-[0.9]">{t(cle)}</Text>
          </HStack>
        ))}
      </Box>
      <HStack
        className="self-start items-center gap-[10px] rounded-full px-[18px] py-[12px] mt-[4px]"
        style={{ backgroundColor: 'white' }}
      >
        <FeatherIcon name="play" size={16} color="#122B4B" />
        <Text className="font-bold text-[14px]" style={{ color: '#122B4B' }}>
          {t('home.audio.action')}
        </Text>
      </HStack>
      <div className="bs-home-audio-image">
        <Image
          source={illustrations.audio}
          contentFit="contain"
          contentPosition="bottom"
          style={{ width: '100%', height: '100%' }}
          accessible={false}
        />
      </div>
    </LinkBox>
  )
}

function DailyVerse() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [index, setIndex] = useState(VISIBLE_VERSE_OF_THE_DAY_OFFSETS.length - 1)
  const lastIndex = VISIBLE_VERSE_OF_THE_DAY_OFFSETS.length - 1
  const navigation = (
    <HStack className="items-center gap-[6px]">
      <LinkBox
        accessibilityLabel={t('home.desktop.previousVerse')}
        disabled={index === 0}
        accessibilityState={{ disabled: index === 0 }}
        onPress={() => setIndex(i => Math.max(0, i - 1))}
        className="items-center justify-center w-[32px] h-[32px] rounded-full"
        style={{ opacity: index === 0 ? 0.25 : 1 }}
      >
        <FeatherIcon name="chevron-left" size={18} color="grey" />
      </LinkBox>
      {VISIBLE_VERSE_OF_THE_DAY_OFFSETS.map((offset, i) => (
        <LinkBox
          key={offset}
          accessibilityLabel={
            offset === 0 ? t("Aujourd'hui") : t('home.desktop.daysAgo', { count: -offset })
          }
          accessibilityState={{ selected: index === i }}
          onPress={() => setIndex(i)}
          className="items-center justify-center w-[24px] h-[32px]"
        >
          <Box
            className="h-[6px] rounded-full"
            style={{
              width: index === i ? 16 : 6,
              backgroundColor: index === i ? theme.colors.primary : theme.colors.border,
            }}
          />
        </LinkBox>
      ))}
      <LinkBox
        accessibilityLabel={t('home.desktop.nextVerse')}
        disabled={index === lastIndex}
        accessibilityState={{ disabled: index === lastIndex }}
        onPress={() => setIndex(i => Math.min(lastIndex, i + 1))}
        className="items-center justify-center w-[32px] h-[32px] rounded-full"
        style={{ opacity: index === lastIndex ? 0.25 : 1 }}
      >
        <FeatherIcon name="chevron-right" size={18} color="grey" />
      </LinkBox>
    </HStack>
  )

  // Empreinte : un seul bloc, pleine largeur. Le verset (avec son contexte), les deux accès
  // « Reprendre ma lecture » et « Méditation », puis ce qu'on a marqué dans la Parole.
  return (
    <section className="bs-home-verset" aria-label={t('dailyReading.title')}>
      <AnimatedVerseHeight>
        <HStack className="overflow-hidden">
          <VerseOfTheDay
            addDay={VISIBLE_VERSE_OF_THE_DAY_OFFSETS[index]}
            desktop
            navigation={navigation}
            footer={<BoutonsDuVerset />}
            style={{ minWidth: 0 }}
          />
        </HStack>
      </AnimatedVerseHeight>
      <div className="bs-home-verset-stats">
        <ProfileStats desktop />
      </div>
    </section>
  )
}

function BoutonsDuVerset() {
  const { t } = useTranslation()
  const pushRoute = usePushRouteOnce()
  return (
    <HStack className="flex-wrap items-center gap-[10px] ml-auto">
      <ResumeBookmark />
      <LinkBox
        onPress={() => pushRoute({ pathname: '/daily-reading' })}
        accessibilityLabel={t('home.meditations.title')}
        accessibilityHint={t('home.meditations.description')}
        className="flex-row items-center gap-[10px] rounded-[12px] px-[18px] py-[13px] bg-light-primary"
      >
        <FeatherIcon name="sunrise" size={18} color="primary" />
        <Text className="text-primary font-bold text-[13px]">{t('home.desktop.meditation')}</Text>
      </LinkBox>
    </HStack>
  )
}

export default function DesktopHome() {
  const [vue, setVue] = useState<'parole' | 'realites'>('parole')
  useFonts({ 'Literata Book': require('~assets/fonts/LiterataBook-Regular.otf') })
  const { t } = useTranslation()
  const openCommandPalette = useSetAtom(commandPaletteOpenAtom)
  const setCommandReturnFocus = useSetAtom(commandPaletteReturnFocusAtom)

  return (
    <div className="bs-home-container">
      <Aurore />
      <ScrollView testID="desktop-home" className="flex-1 bg-transparent">
        <div className="bs-home-content">
          <Events />
          <OfflineNotice />
          {/* Empreinte : la date et la recherche sur une même ligne, en tête de page. */}
          <div className="bs-home-entete">
            <TeteAccueil compact avecTraces={vue === 'realites'} />
            <div className="bs-home-recherche">
              <LinkBox
                onPress={event => {
                  if (event?.currentTarget instanceof HTMLElement)
                    setCommandReturnFocus(event.currentTarget)
                  openCommandPalette(true)
                }}
                accessibilityLabel={t('commandPalette.label')}
                className="flex-row items-center gap-[12px] bg-reverse/60 border border-reverse/90 shadow-[0_8px_24px_rgba(17,17,19,0.06)] rounded-[20px] px-[20px] h-[56px]"
              >
                <FeatherIcon name="search" size={20} color="grey" />
                <Text className="text-grey text-[15px] flex-1 min-w-0" numberOfLines={1}>
                  {t('home.dashboard.search')}
                </Text>
                <kbd className="bs-home-shortcut">
                  {typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
                    ? '⌘ K'
                    : 'Ctrl K'}
                </kbd>
              </LinkBox>
            </div>
          </div>
          {/* Empreinte : l'accueil reste centré sur la Parole ; les réalités (factures,
              missions, vérifications) ont leur propre vue, selon le profil. Placée au-dessus de
              la grille, la bascule laisse les deux colonnes commencer à la même hauteur. */}
          <BasculeAccueil vue={vue} onChange={setVue} />
          {vue === 'parole' ? (
            <>
              <DailyVerse />
              <ResourceDiscovery />
              <div className="bs-home-colonnes">
                <section className="bs-home-parcours" aria-label={t('home.parcours.title')}>
                  <Box className="gap-[6px]">
                    <SectionTitle>{t('home.parcours.title')}</SectionTitle>
                    <Text className="text-grey text-[14px] -mt-[10px]">
                      {t('home.parcours.description')}
                    </Text>
                  </Box>
                  <PlanHome compact />
                  <Image
                    source={illustrations.parcours}
                    contentFit="contain"
                    contentPosition="bottom"
                    style={{ width: '100%', height: 190, marginTop: 'auto' }}
                    accessible={false}
                  />
                </section>
                <BlocAudio />
              </div>
              <div className="bs-home-liens">
                <BlocLien
                  icone="heart"
                  couleur="#BE123C"
                  titre={t('home.desktop.support')}
                  description={t('home.liens.support')}
                  route="Support"
                />
                <BlocLien
                  icone="help-circle"
                  couleur="#1D4ED8"
                  titre={t('FAQ')}
                  description={t('home.liens.faq')}
                  route="FAQ"
                />
                <BlocLien
                  icone="rss"
                  couleur="#A16207"
                  titre={t('Suivre')}
                  description={t('home.liens.suivre')}
                  href="/"
                />
                <BlocLien
                  icone="smartphone"
                  couleur="#0F766E"
                  titre={t('home.desktop.downloadApp')}
                  description={t('home.liens.telecharger')}
                  href="/"
                />
              </div>
            </>
          ) : (
            <div className="bs-home-grid">
              <div className="bs-home-main">
                <PileRealites />
                <CartesMissionPlan />
              </div>
              <div className="bs-home-aside">
                <CarteAVerifier />
                <FilDuJour />
                <OuSontLesOriginaux />
                <ResumeBookmark card />
                <MeditationsHome />
              </div>
            </div>
          )}
          {/* Empreinte : la version en ligne, pour vérifier d'un coup d'œil que le serveur est à jour. */}
          {process.env.EXPO_PUBLIC_EMPREINTE_VERSION ? (
            <Text className="text-grey text-[12px] self-end">
              {`Version du ${process.env.EXPO_PUBLIC_EMPREINTE_VERSION}`}
            </Text>
          ) : null}
        </div>
      </ScrollView>
    </div>
  )
}

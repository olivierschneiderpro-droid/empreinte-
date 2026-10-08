import ResourceIcon from '~common/icons/ResourceIcon'
import { Image, type ImageSource } from 'expo-image'
import type React from 'react'
import { LinkBox, type LinkProps } from '~common/Link'
import { useComputedPlanItems } from '~features/plans/plan.hooks'
import useLanguage from '~helpers/useLanguage'
import type { MainStackProps } from '~navigation/type'
import { useFonts } from 'expo-font'
import { useTranslation } from 'react-i18next'
import Box from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import { MenuView } from '~common/ui/MenuView.web'
import Text from '~common/ui/Text'
import { usePushRouteOnce } from '~navigation/usePushRouteOnce'
import { useTheme } from '~themes/ThemeProvider'
import { resolveFontFamily } from '~themes/styleValues'
import StrongOfTheDay from './StrongOfTheDay'
import NaveOfTheDay from './NaveOfTheDay'
import WordOfTheDay from './WordOfTheDay'
import { WidgetWidthContext } from './widget'

/** Empreinte : chaque bloc garde sa couleur, qu'il serve à apprendre ou à creuser un mot. */
const couleurs = {
  courses: '#C2410C',
  hebrew: '#1D4ED8',
  plan: '#0F766E',
  greek: '#7C3AED',
  timeline: '#A16207',
  nave: '#BE123C',
  dictionary: '#15803D',
  commentary: '#334155',
} as const

const teinte = (couleur: string, alpha: string) => `${couleur}${alpha}`

function Etiquette({ couleur, children }: React.PropsWithChildren<{ couleur: string }>) {
  return (
    <Box
      className="self-start rounded-full px-[10px] py-[4px]"
      style={{ backgroundColor: teinte(couleur, '1A') }}
    >
      <Text className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: couleur }}>
        {children}
      </Text>
    </Box>
  )
}

/** Un bloc « Apprendre » : une image qui dit ce qu'on va trouver, un titre, une phrase. */
function BlocApprendre({
  titre,
  description,
  etiquette,
  couleur,
  source,
  ...lien
}: {
  titre: string
  description: string
  etiquette: string
  couleur: string
  source: ImageSource
} & LinkProps<keyof MainStackProps>) {
  return (
    <div className="bs-home-bloc" style={{ borderColor: teinte(couleur, '33') }}>
      <LinkBox {...lien} accessibilityLabel={titre} className="flex-1">
        <div className="bs-home-bloc-image">
          <Image
            source={source}
            contentFit="cover"
            style={{ width: '100%', height: '100%' }}
            accessible={false}
          />
        </div>
        <Box className="flex-1 p-[16px] gap-[6px]">
          <Etiquette couleur={couleur}>{etiquette}</Etiquette>
          <Text className="font-bold text-[16px]" numberOfLines={1}>
            {titre}
          </Text>
          <Text className="text-grey text-[13px]" numberOfLines={2}>
            {description}
          </Text>
        </Box>
      </LinkBox>
    </div>
  )
}

/** Un bloc « Bibliothèque » : le mot du jour de la ressource, sur sa couleur. */
function BlocBibliotheque({
  titre,
  kind,
  couleur,
  etiquette,
  children,
}: React.PropsWithChildren<{
  titre: string
  kind: 'strong' | 'nave' | 'dictionary' | 'commentary'
  couleur: string
  etiquette: string
}>) {
  return (
    <div className="bs-home-bloc" style={{ borderColor: teinte(couleur, '33') }}>
      <Box className="p-[16px] gap-[12px]" style={{ backgroundColor: teinte(couleur, '12') }}>
        <Box className="flex-row items-center justify-between gap-[10px]">
          <Etiquette couleur={couleur}>{etiquette}</Etiquette>
          <ResourceIcon kind={kind} size={28} color={couleur} />
        </Box>
        <Text className="font-bold text-[18px]" style={{ color: couleur }} numberOfLines={1}>
          {titre}
        </Text>
      </Box>
      <div className="bs-home-bloc-entree">{children}</div>
    </div>
  )
}

export default function ResourceDiscovery() {
  useFonts({ 'Literata Book': require('~assets/fonts/LiterataBook-Regular.otf') })
  const { t } = useTranslation()
  const theme = useTheme()
  const pushRoute = usePushRouteOnce()
  const lang = useLanguage()
  const plans = useComputedPlanItems()
  const bibleProjectPlan = plans.find(
    plan => plan.id === (lang === 'fr' ? 'bible-project-plan' : 'bible-project-plan-en')
  )
  const apprendre = t('Apprendre')
  const bibliotheque = t('newTab.library')
  // Empreinte : apprendre et bibliothèque s'entrecroisent, chaque bloc éclaire le suivant.
  const blocs = [
    <BlocApprendre
      key="courses"
      titre={t('passageMediaLibrary.title')}
      description={t('home.learn.coursesDescription')}
      etiquette={apprendre}
      couleur={couleurs.courses}
      source={require('~assets/images/home/courses-videos.jpg')}
      onPress={() => pushRoute({ pathname: '/(library)/passage-media' })}
    />,
    <BlocBibliotheque
      key="hebrew"
      titre={t('Hébreu')}
      kind="strong"
      couleur={couleurs.hebrew}
      etiquette={bibliotheque}
    >
      <StrongOfTheDay type="hebreu" discovery />
    </BlocBibliotheque>,
    <BlocApprendre
      key="plan"
      titre={t('home.learning.bibleProjectPlan')}
      description={t('home.learn.planDescription')}
      etiquette={apprendre}
      couleur={couleurs.plan}
      source={require('~assets/images/home/bible-project-plan.jpg')}
      route={bibleProjectPlan ? 'Plan' : 'Plans'}
      params={
        bibleProjectPlan ? { planId: bibleProjectPlan.id, plan: bibleProjectPlan } : undefined
      }
    />,
    <BlocBibliotheque
      key="greek"
      titre={t('Grec')}
      kind="strong"
      couleur={couleurs.greek}
      etiquette={bibliotheque}
    >
      <StrongOfTheDay type="grec" discovery />
    </BlocBibliotheque>,
    <BlocBibliotheque
      key="nave"
      titre={t('tabs.nave')}
      kind="nave"
      couleur={couleurs.nave}
      etiquette={bibliotheque}
    >
      <NaveOfTheDay discovery />
    </BlocBibliotheque>,
    <BlocApprendre
      key="timeline"
      titre={t('home.desktop.timeline')}
      description={t('home.learn.timelineDescription')}
      etiquette={apprendre}
      couleur={couleurs.timeline}
      source={require('~assets/images/home/bible-timeline.jpg')}
      route="TimelineHome"
    />,
    <BlocBibliotheque
      key="dictionary"
      titre={t('tabs.dictionary')}
      kind="dictionary"
      couleur={couleurs.dictionary}
      etiquette={bibliotheque}
    >
      <WordOfTheDay discovery />
    </BlocBibliotheque>,
    <BlocBibliotheque
      key="commentary"
      titre={t('tabs.commentary')}
      kind="commentary"
      couleur={couleurs.commentary}
      etiquette={bibliotheque}
    >
      <LinkBox
        onPress={() => pushRoute({ pathname: '/commentary-library' })}
        accessibilityLabel={t('tabs.commentary')}
        className="flex-1 justify-between gap-[12px]"
      >
        <Text className="text-[15px] leading-[22px]">{t('home.learn.commentaryDescription')}</Text>
        <Box className="flex-row items-center gap-[6px]">
          <Text className="text-[13px] font-bold" style={{ color: couleurs.commentary }}>
            {t('home.learn.open')}
          </Text>
          <FeatherIcon name="arrow-right" size={15} color={couleurs.commentary} />
        </Box>
      </LinkBox>
    </BlocBibliotheque>,
  ]
  return (
    <section aria-label={t('home.learn.title')}>
      <div className="bs-home-discovery-heading">
        <Box className="gap-[8px] flex-1 min-w-[260px]">
          <Text
            accessibilityRole="header"
            className="text-[24px]"
            style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
          >
            {t('home.learn.title')}
          </Text>
          <Text className="text-[15px] italic" style={{ fontFamily: 'Literata Book' }}>
            {t('home.learn.definition')}
          </Text>
          <Text className="text-grey text-[14px] leading-[21px]">
            {t('home.learn.description')}
          </Text>
        </Box>
        <MenuView
          accessibilityLabel={t('home.discovery.allResources')}
          renderActionIcon={action => {
            const kinds = {
              lexique: 'strong',
              nave: 'nave',
              dictionnaire: 'dictionary',
              'commentary-library': 'commentary',
            } as const
            const kind = kinds[action.id as keyof typeof kinds]
            return kind ? <ResourceIcon kind={kind} size={20} /> : null
          }}
          actions={[
            { id: 'lexique', title: t('Lexique'), image: 'textformat' },
            { id: 'nave', title: t('tabs.nave'), image: 'square.stack.3d.up' },
            { id: 'dictionnaire', title: t('tabs.dictionary'), image: 'book' },
            {
              id: 'commentary-library',
              title: t('tabs.commentary'),
              image: 'bubble.left.and.bubble.right',
            },
          ]}
          onPressAction={({ nativeEvent }) => {
            const routes = {
              lexique: '/(library)/lexique',
              nave: '/(library)/nave',
              dictionnaire: '/(library)/dictionnaire',
              'commentary-library': '/commentary-library',
            } as const
            const route = routes[nativeEvent.event as keyof typeof routes]
            if (route) pushRoute({ pathname: route })
          }}
        >
          <Box className="flex-row items-center justify-center gap-[10px] px-[16px] min-h-[44px] rounded-[12px] bg-reverse/60 border border-reverse/90 shadow-[0_8px_24px_rgba(17,17,19,0.06)]">
            <Text className="text-[14px] font-medium">{t('home.discovery.allResources')}</Text>
            <FeatherIcon name="chevron-down" size={16} color="grey" />
          </Box>
        </MenuView>
      </div>
      <WidgetWidthContext.Provider value="100%">
        <div className="bs-home-blocs">{blocs}</div>
      </WidgetWidthContext.Provider>
    </section>
  )
}

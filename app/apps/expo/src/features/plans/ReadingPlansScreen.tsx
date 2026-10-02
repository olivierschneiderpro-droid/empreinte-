import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, useWindowDimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Link from '~common/Link'
import type { OnlinePlan, Section } from '~common/types'
import Box from '~common/ui/Box'
import Button from '~common/ui/Button'
import Text from '~common/ui/Text'
import { FeatherIcon } from '~common/ui/Icon'
import { pageContentStyle } from '~common/ui/PageContent'
import { fetchPlans } from '~redux/modules/plan'
import type { RootState } from '~redux/modules/reducer'
import type { AppDispatch } from '~redux/store'
import { useFireStorage } from './plan.hooks'
import { getEditorialKind } from './readingCalendar'
import { hasPlanParticipation, getPlanResumeDay } from './planProgress'
import { filterReadingPlans, type ReadingPlanFilters } from './readingPlanFilters'
import { chargerCatalogueLocal } from './catalogueLocal'
import { DOMAINES, FORMATS, domaineDuPlan, formatsDuPlan, type FormatPlan } from './domainesPlans'
import { Icone } from '~features/empreinte/icones'
import { useTheme } from '~themes/ThemeProvider'
import { POLICES, police, styleVerre, useVerre } from '~features/empreinte/lumiere'

const ReadingPlanCard = ({ plan, active }: { plan: OnlinePlan; active: boolean }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const image = useFireStorage(plan.image)
  const cached = useSelector((state: RootState) =>
    state.plan.myPlans.find(item => item.id === plan.id)
  )
  const progress = useSelector((state: RootState) =>
    state.plan.ongoingPlans.find(item => item.id === plan.id)
  )
  const total = cached?.sections.flatMap(section => section.readingSlices).length ?? plan.duration
  const resumeDay = getPlanResumeDay(
    cached?.sections.flatMap(section => section.readingSlices) ?? [],
    progress?.readingSlices
  )
  const completed =
    cached?.sections
      .flatMap(section => section.readingSlices)
      .filter(reading => progress?.readingSlices[reading.id] === 'Completed').length ?? 0
  const open = () => router.push({ pathname: '/plan', params: { planId: plan.id } })
  return (
    <Box className="bg-reverse rounded-[20px] p-[16px] mb-[12px]">
      <Link
        onPress={open}
        accessibilityLabel={plan.title}
        className="flex-row gap-[16px] items-center"
      >
        <Box className="rounded-[14px] bg-light-grey overflow-hidden w-[96px] h-[64px]">
          {image ? (
            <Image
              source={{ uri: image }}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Box className="flex-1 items-center justify-center">
              <FeatherIcon name="book-open" size={28} color="primary" />
            </Box>
          )}
        </Box>
        <Box className="flex-1 gap-[8px]">
          <Text className="text-default font-bold text-[16px]">{plan.title}</Text>
          <Box className="flex-row flex-wrap items-center gap-[8px]">
            {active && !!total && (
              <Box className="w-[50px] h-[6px] bg-light-grey rounded-full overflow-hidden">
                <Box
                  className="h-full bg-primary"
                  style={{ width: `${(completed / total) * 100}%` }}
                />
              </Box>
            )}
            <Text className="text-grey text-[13px]">
              {total
                ? t(
                    active
                      ? completed === total
                        ? 'readingPlans.finished'
                        : 'readingPlans.dayOfTotal'
                      : 'readingPlans.duration',
                    {
                      day: resumeDay,
                      count: active ? completed : total,
                      total,
                    }
                  )
                : t('readingPlans.journey')}
            </Text>
          </Box>
          <Text className="text-primary font-bold text-[13px]">
            {t(
              active
                ? total && completed === total
                  ? 'readingPlans.reread'
                  : 'readingPlans.continue'
                : 'readingPlans.discover'
            )}
          </Text>
        </Box>
        <FeatherIcon name="chevron-right" color="primary" size={20} />
      </Link>
    </Box>
  )
}

/** Empreinte : carte illustrée d'un plan (couverture, durée, formats). */
const CartePlan = ({
  plan,
  formats,
  largeur,
}: {
  plan: OnlinePlan
  formats: FormatPlan[]
  largeur: number
}) => {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const image = useFireStorage(plan.image)
  const verre = useVerre()
  const en = i18n.language.startsWith('en')
  return (
    <Link
      onPress={() => router.push({ pathname: '/plan', params: { planId: plan.id } })}
      accessibilityLabel={plan.title}
      style={{ width: largeur }}
    >
      <Box style={[styleVerre(verre, 22), { overflow: 'hidden' }]}>
        <Box style={{ width: '100%', aspectRatio: 16 / 9 }} className="bg-light-grey">
          {image ? (
            <Image
              source={{ uri: image }}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Box className="flex-1 items-center justify-center">
              <Icone nom="book" taille={28} />
            </Box>
          )}
        </Box>
        <Box className="p-[14px] gap-[6px]">
          <Text numberOfLines={2} style={{ fontFamily: police(POLICES.titre), fontSize: 15 }}>
            {plan.title}
          </Text>
          <Text className="text-grey text-[12.5px]">
            {plan.duration
              ? t('readingPlans.duration', { count: plan.duration })
              : t('readingPlans.journey')}
          </Text>
          {!!formats.length && (
            <Box className="flex-row flex-wrap gap-[6px] mt-[2px]">
              {FORMATS.filter(format => formats.includes(format.id)).map(format => (
                <Box
                  key={format.id}
                  className="flex-row items-center gap-[4px] px-[8px] h-[24px] rounded-[12px]"
                  style={{ backgroundColor: verre.doux }}
                >
                  <Icone nom={format.icone} taille={12} />
                  <Text style={{ fontSize: 11.5, fontFamily: police(POLICES.moyen) }}>
                    {en ? format.en : format.fr}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Link>
  )
}

const ReadingPlansScreen = ({ filters }: { filters: ReadingPlanFilters }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const online = useSelector((state: RootState) => state.plan.onlinePlans)
  const local = useSelector((state: RootState) => state.plan.myPlans)
  const ongoing = useSelector((state: RootState) => state.plan.ongoingPlans)
  const status = useSelector((state: RootState) => state.plan.onlineStatus)
  const plans = [
    ...online,
    ...local.filter(plan => !online.some(item => item.id === plan.id)),
  ].filter(plan => getEditorialKind(plan) === 'reading-plan')
  const isActive = (id: string) => hasPlanParticipation(ongoing.find(item => item.id === id))
  const active = plans.filter(plan => isActive(plan.id))
  const discoverable = filterReadingPlans(plans, filters)
  useEffect(() => {
    dispatch(fetchPlans())
  }, [dispatch])
  const { i18n } = useTranslation()
  const en = i18n.language.startsWith('en')
  const [format, setFormat] = useState<FormatPlan | null>(null)
  const [sectionsLocales, setSectionsLocales] = useState<Record<string, Section[]>>({})
  useEffect(() => {
    void chargerCatalogueLocal().then(catalogue => setSectionsLocales(catalogue.sections))
  }, [])
  const formatsDe = (plan: OnlinePlan) =>
    formatsDuPlan(local.find(item => item.id === plan.id)?.sections ?? sectionsLocales[plan.id])
  const { width } = useWindowDimensions()
  const largeurCarte = width >= 1100 ? 260 : width >= 700 ? 230 : 220
  const verre = useVerre()
  const theme = useTheme()
  return (
    <ScrollView
      contentContainerStyle={[pageContentStyle, { maxWidth: 1180, padding: 24, paddingBottom: 48 }]}
    >
      {!!active.length && (
        <Text className="text-default font-bold text-[18px] mb-[16px]">
          {t('readingPlans.yours')}
        </Text>
      )}
      {active.map(plan => (
        <ReadingPlanCard key={plan.id} plan={plan} active />
      ))}
      <Text className="text-default font-bold text-[18px] mt-[12px] mb-[16px]">
        {t('readingPlans.explore')}
      </Text>
      {status === 'Pending' && !plans.length && (
        <ActivityIndicator accessibilityLabel={t('Chargement...')} />
      )}
      {status === 'Rejected' && (
        <Box className="gap-[12px] mb-[16px]">
          <Text className="text-grey">{t('dailyReading.catalogError')}</Text>
          <Button reverse onPress={() => dispatch(fetchPlans())}>
            {t('dailyReading.retry')}
          </Button>
        </Box>
      )}
      {status === 'Resolved' && !discoverable.length && (
        <Text className="text-grey">
          {t(plans.length ? 'readingPlans.noMatchingPlans' : 'readingPlans.noAvailablePlans')}
        </Text>
      )}
      {/* Empreinte : formats (les étapes restent séparées, tout peut se combiner). */}
      {!!discoverable.length && (
        <Box className="flex-row flex-wrap gap-[8px] mb-[22px]">
          {[null, ...FORMATS.map(item => item.id)].map(id => {
            const libelle = id
              ? en
                ? FORMATS.find(item => item.id === id)!.en
                : FORMATS.find(item => item.id === id)!.fr
              : en
                ? 'All'
                : 'Tout'
            const actif = format === id
            return (
              <Link key={id ?? 'tout'} onPress={() => setFormat(id)} accessibilityLabel={libelle}>
                <Box
                  className="px-[14px] h-[34px] rounded-[17px] justify-center"
                  style={
                    actif ? { backgroundColor: theme.colors.default } : styleVerre(verre, 17, false)
                  }
                >
                  <Text
                    style={{
                      fontFamily: police(POLICES.titre),
                      fontSize: 13,
                      color: actif ? theme.colors.reverse : theme.colors.default,
                    }}
                  >
                    {libelle}
                  </Text>
                </Box>
              </Link>
            )
          })}
        </Box>
      )}
      {DOMAINES.map(domaine => {
        const entries = discoverable.filter(
          plan =>
            domaineDuPlan(plan) === domaine.id && (!format || formatsDe(plan).includes(format))
        )
        if (!entries.length) return null
        return (
          <Box key={domaine.id} className="mb-[28px]">
            <Text
              accessibilityRole="header"
              className="mb-[12px]"
              style={{ fontFamily: police(POLICES.gras), fontSize: 19, letterSpacing: -0.3 }}
            >
              {en ? domaine.en : domaine.fr}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingBottom: 6 }}
            >
              {entries.map(plan => (
                <CartePlan
                  key={plan.id}
                  plan={plan}
                  formats={formatsDe(plan)}
                  largeur={largeurCarte}
                />
              ))}
            </ScrollView>
          </Box>
        )
      })}
    </ScrollView>
  )
}
export default ReadingPlansScreen

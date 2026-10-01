import HorizontalControlScrollView from '~common/HorizontalControlScrollView'
import { goBackOrHome } from '~navigation/goBackOrHome'
import { useResponsiveWorkspace } from '~features/app-switcher/utils/useResponsiveWorkspace'
import { useTheme } from '~themes/ThemeProvider'
import Color from 'color'
import { getAppleReviewing } from '~helpers/getAppleReviewing'
import React from 'react'
import { Linking, Platform } from 'react-native'
import DesktopHome from './DesktopHome'
import Box, { HStack, TouchableBox, VStack } from '~common/ui/Box'
import Button from '~common/ui/Button'
import { FeatherIcon } from '~common/ui/Icon'
import { HomeScrollView } from '~common/ui/ScrollView'
import DonationWidget from './DonationWidget'
import NaveOfTheDay from './NaveOfTheDay'
import PlanHome from './PlanHome'
import MeditationsHome from './MeditationsHome'
import StrongOfTheDay from './StrongOfTheDay'
import TheBibleProject from './TheBibleProjectPlan'
import TimelineWidget from './TimelineWidget'
import UserWidget, { LoginPrompt } from './UserWidget'
import WordOfTheDay from './WordOfTheDay'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import TryAudibibleWidget from './TryAudibibleWidget'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Events } from './Events'
import ProfileStats from '~features/profile/components/ProfileStats'
import PassageMediaLibraryWidget from './PassageMediaLibraryWidget'
import AccueilLumiere, { Micro } from '~features/empreinte/AccueilLumiere'
// local react props
type HomeProps = {
  closeHome: () => void
  inWorkspace?: boolean
}

export const Home = ({ closeHome, inWorkspace = false }: HomeProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const isWide = useResponsiveWorkspace()
  const appleIsReviewing = getAppleReviewing()

  if (Platform.OS === 'web' && isWide) return <DesktopHome />

  return (
    <Box className="overflow-hidden border-continuous bg-light-grey flex-[1]">
      <HomeScrollView showsVerticalScrollIndicator={false}>
        <AccueilLumiere />
        <Events />
        <UserWidget />
        <ProfileStats />
        <LoginPrompt />
        <Box className="overflow-hidden border-continuous pt-[40px] px-[20px]">
          <Micro>{t('Apprendre')}</Micro>
          <Box className="h-[10px]" />
          <PassageMediaLibraryWidget />
          <HStack className="overflow-hidden border-continuous mt-[12px] h-[174px] gap-[12px] items-stretch">
            <TheBibleProject />
            <TimelineWidget />
          </HStack>
        </Box>
        <Box className="overflow-hidden border-continuous bg-light-grey pt-[40px] px-[20px]">
          <Micro>{t('Étudier')}</Micro>
        </Box>
        <Box className="overflow-hidden border-continuous bg-light-grey pt-[20px]">
          <HorizontalControlScrollView
            horizontal
            style={{ overflow: 'visible' }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              overflow: 'visible',
            }}
          >
            <StrongOfTheDay type="grec" />
            <StrongOfTheDay type="hebreu" color1="rgb(140,131,120)" color2="rgb(62,70,82)" />
            <NaveOfTheDay />
            <WordOfTheDay />
          </HorizontalControlScrollView>
        </Box>
        <Box className="overflow-hidden border-continuous bg-light-grey pt-[40px] px-[20px]">
          <Micro>{t('Méditer')}</Micro>
        </Box>
        <VStack className="overflow-hidden border-continuous gap-[10px]">
          <Box className="px-[20px] pt-[20px]">
            <MeditationsHome />
          </Box>
          <PlanHome />
          <TryAudibibleWidget />
        </VStack>

        <Box className="overflow-hidden border-continuous bg-light-grey px-[20px]">
          <Micro>{t('Aller plus loin')}</Micro>
        </Box>
        {!appleIsReviewing && <DonationWidget />}
        <Box className="overflow-hidden border-continuous bg-light-grey">
          <Box
            className="overflow-hidden border-continuous flex-row px-[20px] pt-[20px]"
            style={[
              { paddingBottom: insets.bottom + 100 },
              { borderTopLeftRadius: 30, borderTopRightRadius: 30 },
            ]}
          >
            <Box className="overflow-hidden border-continuous flex-[1]">
              <Button
                reverse
                onPress={() => Linking.openURL('https://www.facebook.com/fr.bible.strong')}
                leftIcon={
                  <FeatherIcon
                    name="facebook"
                    size={18}
                    color="default"
                    style={{ marginRight: 10 }}
                  />
                }
              >
                {t('Suivre')}
              </Button>
            </Box>
            <Box className="overflow-hidden border-continuous w-[20px]" />
            <Box className="overflow-hidden border-continuous flex-[1]">
              <Button
                route="FAQ"
                leftIcon={
                  <FeatherIcon
                    name="help-circle"
                    size={18}
                    color="reverse"
                    style={{ marginRight: 10 }}
                  />
                }
              >
                {t('FAQ')}
              </Button>
            </Box>
          </Box>
        </Box>
      </HomeScrollView>
      {!inWorkspace && (
        <Box
          className="overflow-hidden border-continuous absolute left-[0px] right-[0px] bottom-[0px] h-[100px] items-center justify-center"
          style={{ paddingBottom: insets.bottom }}
        >
          <Box className="overflow-hidden border-continuous absolute top-[0px] bottom-[0px] left-[0px] right-[0px]">
            <LinearGradient
              start={[0.5, 0]}
              end={[0.5, 0.9]}
              style={{ height: 100 }}
              colors={[
                `${Color(theme.colors.lightGrey).alpha(0).string()}`,
                `${theme.colors.lightGrey}`,
              ]}
            />
          </Box>
          <TouchableBox
            className="overflow-hidden border-continuous items-center justify-center w-[50px] h-[50px] rounded-[30px] bg-reverse/60 border border-reverse/90"
            accessibilityLabel={t('Fermer')}
            accessibilityRole="button"
            activeOpacity={0.8}
            onPress={closeHome}
            style={{
              shadowColor: '#111113',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.06,
              shadowRadius: 24,
              elevation: 1,
              overflow: 'visible',
            }}
          >
            <FeatherIcon name="x" size={24} color="grey" />
          </TouchableBox>
        </Box>
      )}
    </Box>
  )
}

const HomeScreen = () => {
  const router = useRouter()
  const closeHome = () => goBackOrHome(router)

  const isWide = useResponsiveWorkspace()
  return <Home closeHome={closeHome} inWorkspace={isWide} />
}
export default HomeScreen

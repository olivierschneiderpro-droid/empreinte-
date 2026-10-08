import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { usePushRouteOnce } from '~navigation/usePushRouteOnce'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'

const illustration = require('~assets/images/new-tab/notes-writer.webp')

/**
 * Empreinte : la seule invitation à se connecter de toute l'app. Lire, chercher et étudier
 * restent libres ; seul ce qu'on écrit et qu'on veut garder (études, synchronisation) demande
 * un compte. On invite, on ne bloque pas.
 */
export default function ConnexionRequise({ titre, raison }: { titre: string; raison: string }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const pushRoute = usePushRouteOnce()
  return (
    <Box className="flex-1 items-center justify-center p-[24px]">
      <Box className="w-full max-w-[460px] items-center gap-[14px] rounded-[28px] bg-reverse p-[28px] shadow-[0_8px_24px_rgba(17,17,19,0.06)]">
        <Image
          source={illustration}
          contentFit="contain"
          style={{ width: 180, height: 150 }}
          accessible={false}
        />
        <Text
          accessibilityRole="header"
          className="text-[26px] text-center"
          style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
        >
          {titre}
        </Text>
        <Text className="text-grey text-[15px] leading-[22px] text-center">{raison}</Text>
        <HStack className="flex-wrap justify-center gap-[10px] mt-[8px]">
          <LinkBox
            onPress={() => pushRoute({ pathname: '/login' })}
            className="flex-row items-center gap-[8px] rounded-[14px] bg-primary px-[20px] h-[46px]"
          >
            <FeatherIcon name="log-in" size={17} color="white" />
            <Text className="text-[white] font-bold text-[14px]">{t('Se connecter')}</Text>
          </LinkBox>
          <LinkBox
            onPress={() => pushRoute({ pathname: '/register' })}
            className="flex-row items-center gap-[8px] rounded-[14px] bg-light-primary px-[20px] h-[46px]"
          >
            <FeatherIcon name="user-plus" size={17} color="primary" />
            <Text className="text-primary font-bold text-[14px]">{t('Créer un compte')}</Text>
          </LinkBox>
        </HStack>
        <Text className="text-tertiary text-[12px] text-center">{t('auth.freeNote')}</Text>
      </Box>
    </Box>
  )
}

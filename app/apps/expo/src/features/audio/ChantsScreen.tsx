import { useTranslation } from 'react-i18next'
import { Linking, ScrollView } from 'react-native'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'

const SOURCES = [
  { nom: 'Hymnary.org', url: 'https://hymnary.org', cle: 'hymnary' },
  { nom: 'Cantiques francophones anciens', url: 'https://gallica.bnf.fr', cle: 'cantiques' },
  { nom: 'Musique libre pour la prière', url: 'https://musopen.org', cle: 'priere' },
] as const

/**
 * Empreinte Audio · Chants : la deuxième entrée de l'audio, à côté de la Bible écoutée.
 * Les chants arrivent après validation des sources libres (voir docs/SOURCES.md).
 */
export default function ChantsScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const titre = resolveFontFamily(theme.fontFamily.title)
  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('chants.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Box className="px-[24px] gap-[24px] w-full max-w-[1100px] self-center">
          <Box
            className="rounded-[28px] p-[28px] gap-[12px]"
            style={{ backgroundColor: '#3B1F4A' }}
          >
            <HStack className="items-center gap-[10px]">
              <FeatherIcon name="music" size={22} color="white" />
              <Text className="text-[white] text-[12px] font-bold uppercase tracking-[1.5px] opacity-[0.8]">
                {t('chants.tagline')}
              </Text>
            </HStack>
            <Text className="text-[white] text-[30px] leading-[36px]" style={{ fontFamily: titre }}>
              {t('chants.heroTitle')}
            </Text>
            <Text className="text-[white] text-[15px] leading-[23px] opacity-[0.85] max-w-[640px]">
              {t('chants.heroText')}
            </Text>
          </Box>
          <Text className="text-[18px]" style={{ fontFamily: titre }}>
            {t('chants.sourcesTitle')}
          </Text>
          <Box className="gap-[12px]">
            {SOURCES.map(source => (
              <LinkBox
                key={source.cle}
                onPress={() => void Linking.openURL(source.url)}
                className="flex-row items-center gap-[14px] rounded-[20px] p-[18px] bg-reverse"
              >
                <Box className="w-[46px] h-[46px] rounded-[14px] items-center justify-center bg-light-grey">
                  <FeatherIcon name="music" size={20} color="grey" />
                </Box>
                <Box className="flex-1 gap-[3px]">
                  <Text className="font-bold text-[15px]">{source.nom}</Text>
                  <Text className="text-grey text-[13px]">{t(`chants.source.${source.cle}`)}</Text>
                </Box>
                <FeatherIcon name="external-link" size={16} color="grey" />
              </LinkBox>
            ))}
          </Box>
          <Text className="text-tertiary text-[12px]">{t('chants.note')}</Text>
        </Box>
      </ScrollView>
    </Box>
  )
}

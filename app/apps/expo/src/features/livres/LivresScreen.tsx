import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { Couverture } from './Couverture'
import {
  adresseLivres,
  catalogueLivres,
  ficheLivre,
  langueLivresAtom,
  progressionLivresAtom,
  THEMES,
} from './livres'

/**
 * Empreinte · Livres : les classiques chrétiens du domaine public, à lire et à écouter
 * comme la Bible, rangés par thème.
 */
export default function LivresScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const titre = resolveFontFamily(theme.fontFamily.title)
  const router = useRouter()
  const [langue, setLangue] = useAtom(langueLivresAtom)
  const progression = useAtomValue(progressionLivresAtom)
  const livres = catalogueLivres.filter(livre => langue === 'tous' || livre.langue === langue)
  const enCours = Object.keys(progression)
    .map(ficheLivre)
    .filter(livre => livre !== undefined)
  const ouvrir = (id: string) => router.push({ pathname: '/livre', params: { id } } as never)

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('livres.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Box className="px-[24px] gap-[28px] w-full max-w-[1300px] self-center">
          <Box className="gap-[8px]">
            <Text className="text-[30px]" style={{ fontFamily: titre }}>
              {t('livres.heading')}
            </Text>
            <Text className="text-grey text-[14px] leading-[21px] max-w-[640px]">
              {t('livres.intro')}
            </Text>
          </Box>

          <HStack className="gap-[8px] flex-wrap">
            {(['tous', 'fr', 'en'] as const).map(choix => (
              <LinkBox
                key={choix}
                onPress={() => setLangue(choix)}
                accessibilityState={{ selected: langue === choix }}
                className={`rounded-full px-[14px] h-[34px] items-center justify-center ${
                  langue === choix ? 'bg-primary' : 'bg-light-grey'
                }`}
              >
                <Text className={`font-bold text-[13px] ${langue === choix ? 'text-reverse' : ''}`}>
                  {t(`livres.language.${choix}`)}
                </Text>
              </LinkBox>
            ))}
          </HStack>

          {!adresseLivres() ? (
            <Box className="rounded-[18px] p-[16px] bg-reverse flex-row gap-[10px] items-center">
              <FeatherIcon name="wifi-off" size={18} color="grey" />
              <Text className="text-grey text-[13px] flex-1">{t('livres.serverOnly')}</Text>
            </Box>
          ) : null}

          {enCours.length ? (
            <Box className="gap-[14px]">
              <Text className="text-[20px]" style={{ fontFamily: titre }}>
                {t('livres.continue')}
              </Text>
              <HStack className="gap-[14px] flex-wrap">
                {enCours.map(livre => (
                  <LinkBox
                    key={livre.id}
                    onPress={() => ouvrir(livre.id)}
                    accessibilityLabel={livre.titre}
                    className="flex-row items-center gap-[14px] rounded-[20px] p-[12px] pr-[20px] bg-reverse"
                  >
                    <Couverture livre={livre} largeur={56} />
                    <Box className="gap-[4px]">
                      <Text className="font-bold text-[14px]">{livre.titre}</Text>
                      <Text className="text-grey text-[12px]">
                        {t('livres.atPart', { part: (progression[livre.id]?.chapitre ?? 0) + 1 })}
                      </Text>
                    </Box>
                  </LinkBox>
                ))}
              </HStack>
            </Box>
          ) : null}

          {THEMES.map(themeLivres => {
            const duTheme = livres.filter(livre => livre.theme === themeLivres)
            if (!duTheme.length) return null
            return (
              <Box key={themeLivres} className="gap-[14px]">
                <Text className="text-[20px]" style={{ fontFamily: titre }}>
                  {t(`livres.theme.${themeLivres}`)}
                </Text>
                <HStack className="gap-[18px] flex-wrap">
                  {duTheme.map(livre => (
                    <LinkBox
                      key={livre.id}
                      onPress={() => ouvrir(livre.id)}
                      accessibilityLabel={livre.titre}
                      className="gap-[8px] w-[150px]"
                    >
                      <Couverture livre={livre} />
                      <Text className="font-bold text-[13px]" numberOfLines={2}>
                        {livre.titre}
                      </Text>
                      <Text className="text-grey text-[12px]" numberOfLines={1}>
                        {`${livre.auteur} · ${livre.annee}`}
                      </Text>
                    </LinkBox>
                  ))}
                </HStack>
              </Box>
            )
          })}

          <Text className="text-grey text-[12px] leading-[18px]">{t('livres.credit')}</Text>
        </Box>
      </ScrollView>
    </Box>
  )
}

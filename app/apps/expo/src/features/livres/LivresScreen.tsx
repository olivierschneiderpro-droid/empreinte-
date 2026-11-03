import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { CarteImagee, Rangee, Vedette } from '~features/empreinte/vitrine/Rangee'
import {
  adresseLivres,
  catalogueLivres,
  ficheLivre,
  langueLivresAtom,
  progressionLivresAtom,
  THEMES,
  type FicheLivre,
} from './livres'

/**
 * Empreinte · Livres : une vitrine. En haut, le livre en cours (ou un livre à découvrir) ;
 * dessous, une rangée par thème, qui défile.
 */
export default function LivresScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [langue, setLangue] = useAtom(langueLivresAtom)
  const progression = useAtomValue(progressionLivresAtom)
  const livres = catalogueLivres.filter(livre => langue === 'tous' || livre.langue === langue)
  const enCours = Object.keys(progression)
    .map(ficheLivre)
    .filter((livre): livre is FicheLivre => livre !== undefined)
  const ouvrir = (id: string) => router.push({ pathname: '/livre', params: { id } } as never)
  const vedette = enCours[0] ?? livres[0] ?? catalogueLivres[0]
  const partie = (id: string) => (progression[id]?.chapitre ?? 0) + 1

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('livres.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Box className="px-[24px] gap-[30px] w-full max-w-[1300px] self-center">
          <Vedette
            scene={vedette.scene}
            surtitre={enCours[0] ? t('livres.continue') : t('livres.discover')}
            titre={vedette.titre}
            texte={
              enCours[0]
                ? `${vedette.auteur} · ${t('livres.atPart', { part: partie(vedette.id) })}`
                : vedette.resume
            }
            action={enCours[0] ? t('livres.resume') : t('livres.start')}
            onPress={() => ouvrir(vedette.id)}
          />

          <HStack className="gap-[8px] flex-wrap items-center">
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

          {enCours.length > 1 ? (
            <Rangee titre={t('livres.continue')}>
              {enCours.map(livre => (
                <CarteImagee
                  key={livre.id}
                  scene={livre.scene}
                  titre={livre.titre}
                  sousTitre={t('livres.atPart', { part: partie(livre.id) })}
                  onPress={() => ouvrir(livre.id)}
                />
              ))}
            </Rangee>
          ) : null}

          {THEMES.map(theme => {
            const duTheme = livres.filter(livre => livre.theme === theme)
            if (!duTheme.length) return null
            return (
              <Rangee key={theme} titre={t(`livres.theme.${theme}`)}>
                {duTheme.map(livre => (
                  <CarteImagee
                    key={livre.id}
                    scene={livre.scene}
                    titre={livre.titre}
                    sousTitre={`${livre.auteur} · ${livre.annee}`}
                    badge={livre.langue.toUpperCase()}
                    largeur={240}
                    hauteur={140}
                    onPress={() => ouvrir(livre.id)}
                  />
                ))}
              </Rangee>
            )
          })}

          <Text className="text-grey text-[12px] leading-[18px]">{t('livres.credit')}</Text>
        </Box>
      </ScrollView>
    </Box>
  )
}

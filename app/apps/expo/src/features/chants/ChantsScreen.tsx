import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { jouerLibre } from '~features/audio/bibleAudio'
import { POLICES, police } from '~features/empreinte/lumiere'
import { Rangee } from '~features/empreinte/vitrine/Rangee'
import { adresseLivres } from '~features/livres/livres'
import {
  THEMES_CHANTS,
  catalogueChants,
  chantDuJour,
  degradeTheme,
  langueChantsAtom,
  ficheChant,
  mesChantsAtom,
  supprimerListe,
  useDecouvertes,
  type Enregistrement,
  type FicheChant,
  type ThemeChant,
} from './chants'

const ICONES: Record<ThemeChant, React.ComponentProps<typeof FeatherIcon>['name']> = {
  louange: 'sun',
  confiance: 'shield',
  priere: 'feather',
  paques: 'sunrise',
  noel: 'star',
  enfants: 'smile',
  meditation: 'music',
}

/** Une carte de chant : le dégradé de son thème, son titre posé dessus. */
export function CarteChant({
  theme,
  titre,
  sousTitre,
  onPress,
  icone,
}: {
  theme: ThemeChant
  titre: string
  sousTitre?: string
  onPress: () => void
  icone?: React.ComponentProps<typeof FeatherIcon>['name']
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={titre}
      className="gap-[8px]"
      style={{ width: 210 }}
    >
      <Box
        className="rounded-[18px] overflow-hidden p-[14px] justify-between"
        style={
          {
            height: 124,
            backgroundImage: degradeTheme(theme),
            boxShadow: '0 8px 22px rgba(17,17,19,0.12)',
          } as object
        }
      >
        <Box
          className="w-[32px] h-[32px] rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
        >
          <FeatherIcon name={icone ?? ICONES[theme]} size={15} color="white" />
        </Box>
        <Text
          className="text-[white]"
          style={{ fontFamily: police(POLICES.titre), fontSize: 17, lineHeight: 21 }}
          numberOfLines={2}
        >
          {titre}
        </Text>
      </Box>
      {sousTitre ? (
        <Text className="text-grey text-[12px] px-[2px]" numberOfLines={1}>
          {sousTitre}
        </Text>
      ) : null}
    </LinkBox>
  )
}

/**
 * Empreinte · Chants : des cantiques du domaine public à écouter et à chanter. Le chant du
 * jour en grand, une rangée par thème, puis d'autres enregistrements libres trouvés par le
 * serveur (Wikimedia Commons, Internet Archive).
 */
export default function ChantsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [langue, setLangue] = useAtom(langueChantsAtom)
  const decouvertes = useDecouvertes()
  const [mes, setMes] = useAtom(mesChantsAtom)
  const favoris = mes.favoris.map(ficheChant).filter((c): c is FicheChant => Boolean(c))
  const chanterListe = (liste: string) =>
    router.push({ pathname: '/chanter', params: { liste } } as never)
  const ouvrir = (id: string) => router.push({ pathname: '/chant', params: { id } } as never)
  const visibles = catalogueChants.filter(
    chant => langue === 'tous' || chant.langue === langue || chant.langue === 'tous'
  )
  const duJour = chantDuJour()
  const autres: Enregistrement[] = decouvertes.data?.enregistrements ?? []
  const pistes = autres.map(e => ({
    titre: e.titre,
    sousTitre: [e.auteur, e.source].filter(Boolean).join(' · '),
    url: e.url,
    retour: '/chants',
  }))
  const sousTitreDe = (chant: FicheChant) => `${chant.auteur.split(' · ')[0]} · ${chant.annee}`

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('chants.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Box className="px-[24px] gap-[30px] w-full max-w-[1300px] self-center">
          {/* Le chant du jour, en grand. */}
          <LinkBox
            onPress={() => ouvrir(duJour.id)}
            accessibilityLabel={`${t('chants.ofTheDay')} · ${duJour.titre}`}
            className="rounded-[28px] overflow-hidden"
            style={
              {
                minHeight: 260,
                backgroundImage: degradeTheme(duJour.theme),
                boxShadow: '0 16px 40px rgba(17,17,19,0.16)',
              } as object
            }
          >
            <HStack className="p-[28px] gap-[28px] flex-wrap items-center">
              <Box className="flex-1 min-w-[280px] gap-[10px]">
                <HStack className="items-center gap-[8px]">
                  <FeatherIcon name="music" size={16} color="white" />
                  <Text className="text-[white] text-[12px] font-bold uppercase tracking-[1.5px] opacity-[0.85]">
                    {t('chants.ofTheDay')}
                  </Text>
                </HStack>
                <Text
                  className="text-[white]"
                  style={{ fontFamily: police(POLICES.titre), fontSize: 34, lineHeight: 40 }}
                >
                  {duJour.titre}
                </Text>
                <Text className="text-[white] text-[14px] opacity-[0.85]">
                  {`${duJour.auteur} · ${duJour.annee}`}
                </Text>
                <HStack className="mt-[8px]">
                  <Box className="flex-row items-center gap-[8px] rounded-full px-[18px] h-[42px] bg-[white]">
                    <FeatherIcon name="music" size={16} color="#111113" />
                    <Text className="font-bold text-[14px]" style={{ color: '#111113' }}>
                      {t('chants.open')}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              {duJour.paroles?.[0] ? (
                <Box
                  className="rounded-[20px] p-[20px] gap-[4px] max-w-[420px]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                >
                  {duJour.paroles[0].slice(0, 4).map((ligne, i) => (
                    <Text
                      key={i}
                      className="text-[white] text-[16px] leading-[25px]"
                      style={{ fontFamily: police(POLICES.lecture) }}
                    >
                      {ligne}
                    </Text>
                  ))}
                </Box>
              ) : null}
            </HStack>
          </LinkBox>

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
                  {t(`chants.language.${choix}`)}
                </Text>
              </LinkBox>
            ))}
          </HStack>

          {!adresseLivres() ? (
            <Box className="rounded-[18px] p-[16px] bg-reverse flex-row gap-[10px] items-center">
              <FeatherIcon name="wifi-off" size={18} color="grey" />
              <Text className="text-grey text-[13px] flex-1">{t('chants.serverOnly')}</Text>
            </Box>
          ) : null}

          {favoris.length ? (
            <Rangee
              titre={t('chants.favorites')}
              sousTitre={t('chants.count', { count: favoris.length })}
            >
              {favoris.map(chant => (
                <CarteChant
                  key={chant.id}
                  theme={chant.theme}
                  icone="heart"
                  titre={chant.titre}
                  sousTitre={sousTitreDe(chant)}
                  onPress={() => ouvrir(chant.id)}
                />
              ))}
            </Rangee>
          ) : null}

          {mes.listes.map(liste => {
            const chants = liste.chants.map(ficheChant).filter((c): c is FicheChant => Boolean(c))
            return (
              <Box key={liste.id} className="gap-[10px]">
                <Rangee titre={liste.nom} sousTitre={t('chants.count', { count: chants.length })}>
                  {chants.length ? (
                    chants.map(chant => (
                      <CarteChant
                        key={chant.id}
                        theme={chant.theme}
                        titre={chant.titre}
                        sousTitre={sousTitreDe(chant)}
                        onPress={() => ouvrir(chant.id)}
                      />
                    ))
                  ) : (
                    <Text className="text-grey text-[13px]">{t('chants.emptyList')}</Text>
                  )}
                </Rangee>
                <HStack className="gap-[8px]">
                  {chants.length ? (
                    <LinkBox
                      onPress={() => chanterListe(liste.id)}
                      className="flex-row items-center gap-[6px] rounded-full px-[14px] h-[34px] bg-primary"
                    >
                      <FeatherIcon name="maximize-2" size={13} color="reverse" />
                      <Text className="text-reverse font-bold text-[13px]">
                        {t('chants.singList')}
                      </Text>
                    </LinkBox>
                  ) : null}
                  <LinkBox
                    onPress={() => setMes(supprimerListe(mes, liste.id))}
                    className="flex-row items-center gap-[6px] rounded-full px-[14px] h-[34px] bg-light-grey"
                  >
                    <FeatherIcon name="trash-2" size={13} color="grey" />
                    <Text className="text-grey font-bold text-[13px]">
                      {t('chants.deleteList')}
                    </Text>
                  </LinkBox>
                </HStack>
              </Box>
            )
          })}

          {THEMES_CHANTS.map(theme => {
            const duTheme = visibles.filter(chant => chant.theme === theme)
            if (!duTheme.length) return null
            return (
              <Rangee
                key={theme}
                titre={t(`chants.theme.${theme}`)}
                sousTitre={t('chants.count', { count: duTheme.length })}
              >
                {duTheme.map(chant => (
                  <CarteChant
                    key={chant.id}
                    theme={chant.theme}
                    titre={chant.titre}
                    sousTitre={sousTitreDe(chant)}
                    onPress={() => ouvrir(chant.id)}
                  />
                ))}
              </Rangee>
            )
          })}

          {autres.length ? (
            <Rangee titre={t('chants.more')} sousTitre={t('chants.moreHint')}>
              {autres.map((enregistrement, index) => (
                <CarteChant
                  key={enregistrement.url}
                  theme={THEMES_CHANTS[index % THEMES_CHANTS.length]!}
                  icone="play"
                  titre={enregistrement.titre}
                  sousTitre={[enregistrement.licence, enregistrement.source]
                    .filter(Boolean)
                    .join(' · ')}
                  onPress={() => jouerLibre(pistes, index)}
                />
              ))}
            </Rangee>
          ) : null}

          <Text className="text-tertiary text-[12px] leading-[18px]">{t('chants.credit')}</Text>
        </Box>
      </ScrollView>
    </Box>
  )
}

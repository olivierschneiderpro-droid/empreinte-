import { useLocalSearchParams } from 'expo-router'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Linking, ScrollView } from 'react-native'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { basculer, etatAudioAtom, jouerLibre } from '~features/audio/bibleAudio'
import { POLICES, police } from '~features/empreinte/lumiere'
import { adresseLivres } from '~features/livres/livres'
import { degradeTheme, ficheChant, useEnregistrements, type Enregistrement } from './chants'

/**
 * Empreinte · Un chant : écouter un enregistrement libre (le mini-lecteur prend le relais
 * quand on quitte la page) et chanter avec les paroles, strophe par strophe.
 */
export default function ChantScreen() {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<{ id: string }>()
  const chant = ficheChant(id ?? '')
  const { data, isLoading, isError } = useEnregistrements(chant?.id ?? '')
  const etat = useAtomValue(etatAudioAtom)
  if (!chant)
    return (
      <Box className="flex-1">
        <Header hasBackButton title={t('chants.notFound')} />
      </Box>
    )

  const enregistrements: Enregistrement[] = data?.enregistrements ?? []
  const pistes = enregistrements.map(e => ({
    titre: chant.titre,
    sousTitre: [e.auteur, e.source].filter(Boolean).join(' · '),
    url: e.url,
    retour: `/chant?id=${chant.id}`,
  }))
  const enCours = (index: number) =>
    etat.libre?.pistes[etat.libre.index]?.url === enregistrements[index]?.url
  const ecouter = (index: number) => (enCours(index) ? basculer() : jouerLibre(pistes, index))
  const premierEnLecture = enCours(0) && etat.enLecture

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('chants.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Box className="px-[24px] gap-[26px] w-full max-w-[900px] self-center">
          <Box
            className="rounded-[28px] p-[28px] gap-[12px]"
            style={
              {
                backgroundImage: degradeTheme(chant.theme),
                boxShadow: '0 16px 40px rgba(17,17,19,0.16)',
              } as object
            }
          >
            <Text className="text-[white] text-[12px] font-bold uppercase tracking-[1.5px] opacity-[0.85]">
              {t(`chants.theme.${chant.theme}`)}
            </Text>
            <Text
              className="text-[white]"
              style={{ fontFamily: police(POLICES.titre), fontSize: 32, lineHeight: 38 }}
            >
              {chant.titre}
            </Text>
            <Text className="text-[white] text-[14px] opacity-[0.85]">
              {`${chant.auteur} · ${chant.annee}`}
            </Text>
            <HStack className="mt-[8px] items-center gap-[12px] flex-wrap">
              {enregistrements.length ? (
                <LinkBox
                  onPress={() => ecouter(0)}
                  className="flex-row items-center gap-[8px] rounded-full px-[18px] h-[44px] bg-[white]"
                >
                  <FeatherIcon
                    name={premierEnLecture ? 'pause' : 'play'}
                    size={16}
                    color="#111113"
                  />
                  <Text className="font-bold text-[14px]" style={{ color: '#111113' }}>
                    {premierEnLecture ? t('audio.pause') : t('chants.listen')}
                  </Text>
                </LinkBox>
              ) : isLoading ? (
                <HStack className="items-center gap-[10px]">
                  <ActivityIndicator color="white" />
                  <Text className="text-[white] text-[13px] opacity-[0.85]">
                    {t('chants.searching')}
                  </Text>
                </HStack>
              ) : (
                <Text className="text-[white] text-[13px] opacity-[0.85] max-w-[520px]">
                  {isError || !adresseLivres() ? t('chants.serverOnly') : t('chants.noRecording')}
                </Text>
              )}
            </HStack>
          </Box>

          {enregistrements.length ? (
            <Box className="gap-[10px]">
              <Text style={{ fontFamily: police(POLICES.titre), fontSize: 19 }}>
                {t('chants.recordings')}
              </Text>
              {enregistrements.map((e, index) => {
                const actif = enCours(index) && etat.enLecture
                return (
                  <HStack
                    key={e.url}
                    className="items-center gap-[14px] rounded-[18px] p-[14px] bg-reverse"
                  >
                    <LinkBox
                      onPress={() => ecouter(index)}
                      accessibilityLabel={actif ? t('audio.pause') : t('audio.play')}
                      className={`w-[42px] h-[42px] rounded-full items-center justify-center ${
                        enCours(index) ? 'bg-primary' : 'bg-light-grey'
                      }`}
                    >
                      <FeatherIcon
                        name={actif ? 'pause' : 'play'}
                        size={16}
                        color={enCours(index) ? 'reverse' : 'default'}
                      />
                    </LinkBox>
                    <Box className="flex-1 gap-[2px]">
                      <Text className="font-bold text-[14px]" numberOfLines={1}>
                        {e.titre}
                      </Text>
                      <Text className="text-grey text-[12px]" numberOfLines={1}>
                        {[e.auteur, e.licence].filter(Boolean).join(' · ')}
                      </Text>
                    </Box>
                    {e.page ? (
                      <LinkBox
                        onPress={() => void Linking.openURL(e.page!)}
                        accessibilityLabel={e.source}
                        className="flex-row items-center gap-[6px] px-[10px] h-[32px] rounded-full bg-light-grey"
                      >
                        <Text className="text-[12px]">{e.source}</Text>
                        <FeatherIcon name="external-link" size={12} color="grey" />
                      </LinkBox>
                    ) : null}
                  </HStack>
                )
              })}
            </Box>
          ) : null}

          <Box className="gap-[18px]">
            <Text style={{ fontFamily: police(POLICES.titre), fontSize: 19 }}>
              {t('chants.lyricsTitle')}
            </Text>
            {chant.paroles?.length ? (
              chant.paroles.map((strophe, index) => (
                <Box key={index} className="gap-[18px]">
                  <HStack className="gap-[14px]">
                    <Text
                      className="text-tertiary"
                      style={{ fontFamily: police(POLICES.points), fontSize: 18, width: 22 }}
                    >
                      {index + 1}
                    </Text>
                    <Box className="flex-1 gap-[2px]">
                      {strophe.map((ligne, i) => (
                        <Text
                          key={i}
                          className="text-[18px] leading-[30px]"
                          style={{ fontFamily: police(POLICES.lecture) }}
                        >
                          {ligne}
                        </Text>
                      ))}
                    </Box>
                  </HStack>
                  {chant.refrain && index === 0 ? (
                    <Box className="ml-[36px] pl-[16px] gap-[2px] border-l-[3px] border-primary">
                      <Text className="text-primary text-[11px] font-bold uppercase tracking-[1px] mb-[4px]">
                        {t('chants.refrain')}
                      </Text>
                      {chant.refrain.map((ligne, i) => (
                        <Text
                          key={i}
                          className="text-[18px] leading-[30px] italic"
                          style={{ fontFamily: police(POLICES.lecture) }}
                        >
                          {ligne}
                        </Text>
                      ))}
                    </Box>
                  ) : null}
                </Box>
              ))
            ) : (
              <Text className="text-grey text-[14px]">{t('chants.noLyrics')}</Text>
            )}
          </Box>

          <Text className="text-tertiary text-[12px] leading-[18px]">{t('chants.credit')}</Text>
        </Box>
      </ScrollView>
    </Box>
  )
}

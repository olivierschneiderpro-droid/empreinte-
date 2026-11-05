import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Linking, Platform, ScrollView, TextInput } from 'react-native'
import books from '~assets/bible_versions/books-desc'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { basculer, etatAudioAtom, jouerLibre } from '~features/audio/bibleAudio'
import { POLICES, police } from '~features/empreinte/lumiere'
import { useOuvrirDansLaBible } from '~features/empreinte/ouvrirDansLaBible'
import { Volet } from '~features/empreinte/vitrine/Volet'
import { adresseLivres } from '~features/livres/livres'
import { useTheme } from '~themes/ThemeProvider'
import {
  ajouterALaListe,
  basculerFavori,
  creerListe,
  degradeTheme,
  ficheChant,
  mesChantsAtom,
  partiesChantees,
  useEnregistrements,
  type Enregistrement,
  type FicheChant,
} from './chants'
import { partagerCouplet } from './partagerCouplet'

type Icone = React.ComponentProps<typeof FeatherIcon>['name']

function Pilule({
  icone,
  libelle,
  onPress,
  plein,
}: {
  icone: Icone
  libelle: string
  onPress: () => void
  plein?: boolean
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={libelle}
      className="flex-row items-center gap-[8px] rounded-full px-[16px] h-[42px]"
      style={{ backgroundColor: plein ? 'white' : 'rgba(255,255,255,0.16)' }}
    >
      <FeatherIcon name={icone} size={16} color={plein ? '#111113' : 'white'} />
      <Text className="font-bold text-[14px]" style={{ color: plein ? '#111113' : 'white' }}>
        {libelle}
      </Text>
    </LinkBox>
  )
}

/** Les paroles, strophe par strophe, dans l'ordre chanté ; un couplet se partage en image. */
function Paroles({ chant, compact }: { chant: FicheChant; compact?: boolean }) {
  const { t } = useTranslation()
  const parties = partiesChantees(chant)
  if (!parties.length) return <Text className="text-grey text-[14px]">{t('chants.noLyrics')}</Text>
  // Le refrain n'est écrit en entier qu'une fois ; ensuite, un simple rappel.
  return (
    <Box className="gap-[18px]">
      {parties.map((partie, index) =>
        partie.type === 'refrain' && index > 1 ? (
          <Text key={index} className="text-primary text-[13px] font-bold ml-[36px] italic">
            {`${t('chants.refrain')}…`}
          </Text>
        ) : (
          <HStack key={index} className="gap-[14px] items-start">
            <Text
              className="text-tertiary"
              style={{ fontFamily: police(POLICES.points), fontSize: 18, width: 22 }}
            >
              {partie.type === 'strophe' ? partie.numero : ''}
            </Text>
            <Box
              className={`flex-1 gap-[2px] ${partie.type === 'refrain' ? 'pl-[16px] border-l-[3px] border-primary' : ''}`}
            >
              {partie.type === 'refrain' ? (
                <Text className="text-primary text-[11px] font-bold uppercase tracking-[1px] mb-[4px]">
                  {t('chants.refrain')}
                </Text>
              ) : null}
              {partie.lignes.map((ligne, i) => (
                <Text
                  key={i}
                  className={compact ? 'text-[16px] leading-[26px]' : 'text-[18px] leading-[30px]'}
                  style={{
                    fontFamily: police(POLICES.lecture),
                    fontStyle: partie.type === 'refrain' ? 'italic' : 'normal',
                  }}
                >
                  {ligne}
                </Text>
              ))}
            </Box>
            {Platform.OS === 'web' ? (
              <LinkBox
                onPress={() => void partagerCouplet(chant, partie.lignes)}
                accessibilityLabel={t('chants.shareVerse')}
                className="w-[32px] h-[32px] rounded-full items-center justify-center bg-light-grey"
              >
                <FeatherIcon name="share-2" size={14} color="grey" />
              </LinkBox>
            ) : null}
          </HStack>
        )
      )}
    </Box>
  )
}

/**
 * Empreinte · Un chant : l'écouter, le chanter en plein écran, le garder (favori, liste),
 * et découvrir ce qu'il y a autour (versets, histoire, version dans l'autre langue).
 */
export default function ChantScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const chant = ficheChant(id ?? '')
  const { data, isLoading, isError } = useEnregistrements(chant?.id ?? '')
  const etat = useAtomValue(etatAudioAtom)
  const [mes, setMes] = useAtom(mesChantsAtom)
  const ouvrirDansLaBible = useOuvrirDansLaBible()
  const [cote, setCote] = useState(false)
  const [voletListes, setVoletListes] = useState(false)
  const [nouvelle, setNouvelle] = useState('')
  if (!chant)
    return (
      <Box className="flex-1">
        <Header hasBackButton title={t('chants.notFound')} />
      </Box>
    )

  const traduction = chant.traduction ? ficheChant(chant.traduction) : undefined
  const enregistrements: Enregistrement[] = data?.enregistrements ?? []
  const enCours = (index: number) =>
    etat.libre?.pistes[etat.libre.index]?.url === enregistrements[index]?.url
  const ecouter = (index: number) => {
    if (enCours(index)) return basculer()
    const e = enregistrements[index]!
    jouerLibre(
      [
        {
          titre: chant.titre,
          sousTitre: [e.auteur, e.source].filter(Boolean).join(' · '),
          url: e.url,
          retour: `/chant?id=${chant.id}`,
        },
      ],
      0
    )
  }
  const premierEnLecture = enCours(0) && etat.enLecture
  const favori = mes.favoris.includes(chant.id)
  const nomLivre = (numero: number) => t(books.find(b => b.Numero === numero)?.Nom ?? '')

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('chants.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Box className="px-[24px] gap-[28px] w-full max-w-[1000px] self-center">
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
            <HStack className="mt-[8px] items-center gap-[10px] flex-wrap">
              <Pilule
                plein
                icone="maximize-2"
                libelle={t('chants.sing')}
                onPress={() =>
                  router.push({ pathname: '/chanter', params: { id: chant.id } } as never)
                }
              />
              {enregistrements.length ? (
                <Pilule
                  icone={premierEnLecture ? 'pause' : 'play'}
                  libelle={premierEnLecture ? t('audio.pause') : t('chants.listen')}
                  onPress={() => ecouter(0)}
                />
              ) : null}
              <Pilule
                icone="heart"
                libelle={favori ? t('chants.inFavorites') : t('chants.addFavorite')}
                onPress={() => setMes(basculerFavori(mes, chant.id))}
              />
              <Pilule
                icone="list"
                libelle={t('chants.addToList')}
                onPress={() => setVoletListes(true)}
              />
            </HStack>
            {!enregistrements.length ? (
              isLoading ? (
                <HStack className="items-center gap-[10px] mt-[4px]">
                  <ActivityIndicator color="white" />
                  <Text className="text-[white] text-[13px] opacity-[0.85]">
                    {t('chants.searching')}
                  </Text>
                </HStack>
              ) : (
                <Text className="text-[white] text-[13px] opacity-[0.85] max-w-[560px] mt-[4px]">
                  {isError || !adresseLivres() ? t('chants.serverOnly') : t('chants.noRecording')}
                </Text>
              )
            ) : null}
          </Box>

          {/* Autour du chant : versets, histoire, l'autre langue. */}
          {chant.versets?.length || chant.histoire || traduction ? (
            <Box className="gap-[14px]">
              <Text style={{ fontFamily: police(POLICES.titre), fontSize: 19 }}>
                {t('chants.around')}
              </Text>
              <HStack className="gap-[14px] flex-wrap items-stretch">
                {chant.histoire ? (
                  <Box className="flex-1 min-w-[280px] rounded-[20px] p-[18px] bg-reverse gap-[8px]">
                    <HStack className="items-center gap-[8px]">
                      <FeatherIcon name="clock" size={15} color="grey" />
                      <Text className="font-bold text-[14px]">{t('chants.history')}</Text>
                    </HStack>
                    <Text className="text-[14px] leading-[22px]">{chant.histoire}</Text>
                  </Box>
                ) : null}
                {chant.versets?.length ? (
                  <Box className="min-w-[240px] rounded-[20px] p-[18px] bg-reverse gap-[10px]">
                    <HStack className="items-center gap-[8px]">
                      <FeatherIcon name="book-open" size={15} color="grey" />
                      <Text className="font-bold text-[14px]">{t('chants.verses')}</Text>
                    </HStack>
                    <HStack className="gap-[8px] flex-wrap">
                      {chant.versets.map(v => (
                        <LinkBox
                          key={`${v.livre}-${v.chapitre}-${v.verset ?? ''}`}
                          onPress={() =>
                            ouvrirDansLaBible({
                              book: v.livre,
                              chapter: v.chapitre,
                              verse: v.verset,
                            })
                          }
                          className="flex-row items-center gap-[6px] rounded-full px-[12px] h-[32px] bg-light-grey"
                        >
                          <Text className="text-[13px] font-bold">
                            {`${nomLivre(v.livre)} ${v.chapitre}${v.verset ? `.${v.verset}` : ''}`}
                          </Text>
                          <FeatherIcon name="arrow-up-right" size={12} color="grey" />
                        </LinkBox>
                      ))}
                    </HStack>
                  </Box>
                ) : null}
                {traduction ? (
                  <Box className="min-w-[240px] rounded-[20px] p-[18px] bg-reverse gap-[10px]">
                    <HStack className="items-center gap-[8px]">
                      <FeatherIcon name="globe" size={15} color="grey" />
                      <Text className="font-bold text-[14px]">{t('chants.otherLanguage')}</Text>
                    </HStack>
                    <LinkBox
                      onPress={() =>
                        router.push({ pathname: '/chant', params: { id: traduction.id } } as never)
                      }
                    >
                      <Text className="text-primary font-bold text-[15px]">{traduction.titre}</Text>
                    </LinkBox>
                    <LinkBox
                      onPress={() => setCote(c => !c)}
                      accessibilityState={{ selected: cote }}
                      className={`self-start flex-row items-center gap-[6px] rounded-full px-[12px] h-[32px] ${
                        cote ? 'bg-primary' : 'bg-light-grey'
                      }`}
                    >
                      <FeatherIcon name="columns" size={13} color={cote ? 'reverse' : 'default'} />
                      <Text className={`text-[12px] font-bold ${cote ? 'text-reverse' : ''}`}>
                        {t('chants.sideBySide')}
                      </Text>
                    </LinkBox>
                  </Box>
                ) : null}
              </HStack>
            </Box>
          ) : null}

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
            {cote && traduction ? (
              <HStack className="gap-[28px] flex-wrap items-start">
                <Box className="flex-1 min-w-[300px] gap-[12px]">
                  <Text className="text-grey text-[12px] font-bold uppercase tracking-[1px]">
                    {chant.titre}
                  </Text>
                  <Paroles chant={chant} compact />
                </Box>
                <Box className="flex-1 min-w-[300px] gap-[12px]">
                  <Text className="text-grey text-[12px] font-bold uppercase tracking-[1px]">
                    {traduction.titre}
                  </Text>
                  <Paroles chant={traduction} compact />
                </Box>
              </HStack>
            ) : (
              <Paroles chant={chant} />
            )}
          </Box>

          <Text className="text-tertiary text-[12px] leading-[18px]">{t('chants.credit')}</Text>
        </Box>
      </ScrollView>

      {voletListes ? (
        <Volet titre={t('chants.addToList')} onFermer={() => setVoletListes(false)}>
          <Box className="gap-[10px]">
            {mes.listes.map(liste => {
              const dedans = liste.chants.includes(chant.id)
              return (
                <LinkBox
                  key={liste.id}
                  onPress={() => {
                    setMes(ajouterALaListe(mes, liste.id, chant.id))
                    setVoletListes(false)
                  }}
                  className="flex-row items-center gap-[12px] rounded-[16px] p-[14px] bg-light-grey"
                >
                  <FeatherIcon name={dedans ? 'check' : 'list'} size={16} />
                  <Text className="flex-1 font-bold text-[14px]">{liste.nom}</Text>
                  <Text className="text-grey text-[12px]">
                    {t('chants.count', { count: liste.chants.length })}
                  </Text>
                </LinkBox>
              )
            })}
            <HStack className="items-center gap-[10px] rounded-[16px] px-[14px] h-[52px] border border-border">
              <FeatherIcon name="plus" size={16} color="grey" />
              <TextInput
                value={nouvelle}
                onChangeText={setNouvelle}
                placeholder={t('chants.newListPlaceholder')}
                placeholderTextColor={theme.colors.tertiary}
                onSubmitEditing={() => {
                  if (!nouvelle.trim()) return
                  setMes(creerListe(mes, nouvelle, chant.id))
                  setNouvelle('')
                  setVoletListes(false)
                }}
                className="flex-1 text-[15px] text-default h-full"
                style={{ outlineStyle: 'none' } as object}
              />
              <LinkBox
                onPress={() => {
                  if (!nouvelle.trim()) return
                  setMes(creerListe(mes, nouvelle, chant.id))
                  setNouvelle('')
                  setVoletListes(false)
                }}
                className="rounded-full px-[14px] h-[34px] items-center justify-center bg-primary"
              >
                <Text className="text-reverse font-bold text-[13px]">{t('chants.create')}</Text>
              </LinkBox>
            </HStack>
          </Box>
        </Volet>
      ) : null}
    </Box>
  )
}

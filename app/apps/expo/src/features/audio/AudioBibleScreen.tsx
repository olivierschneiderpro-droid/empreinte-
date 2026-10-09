import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { sections } from '~assets/bible_versions/books-desc'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { useOuvrirDansLaBible } from '~features/empreinte/ouvrirDansLaBible'
import { useResourceAccess } from '~features/resources/resourceAccess'
import { loadBibleVerseTexts } from '~features/resources/resourceQueries'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { Pochette } from './Pochette'
import {
  basculer,
  changerVitesse,
  chercher,
  etatAudioAtom,
  familleDuLivre,
  formatTemps,
  jouer,
  livre,
  precedent,
  suivant,
  versionsAudio,
  type PisteBible,
} from './bibleAudio'

/** Le texte du chapitre en cours, pour écouter et lire en même temps. */
function TexteDuChapitre({ piste, versetLu }: { piste: PisteBible; versetLu?: number }) {
  const resources = useResourceAccess()
  const theme = useTheme()
  const { data } = useQuery({
    queryKey: ['audio-chapitre', piste.version, piste.book, piste.chapter],
    queryFn: () =>
      loadBibleVerseTexts(
        resources,
        piste.version,
        Array.from({ length: 176 }, (_, i) => `${piste.book}-${piste.chapter}-${i + 1}`)
      ),
    staleTime: Infinity,
    networkMode: 'always',
  })
  const versets = Object.entries(data ?? {})
    .map(([cle, texte]) => ({ numero: Number(cle.split('-')[2]), texte }))
    .sort((a, b) => a.numero - b.numero)
  return (
    <Box className="gap-[10px]">
      {versets.length === 0 ? (
        <Text className="text-grey text-[14px]">…</Text>
      ) : (
        versets.map(({ numero, texte }) => (
          <Text
            key={numero}
            className="text-[17px] leading-[28px] rounded-[10px] px-[8px]"
            style={{
              fontFamily: resolveFontFamily(theme.fontFamily.paragraph),
              backgroundColor: versetLu === numero ? `${theme.colors.primary}14` : undefined,
            }}
          >
            <Text className="text-tertiary text-[12px] font-bold">{`${numero} `}</Text>
            {texte}
          </Text>
        ))
      )}
    </Box>
  )
}

/**
 * Empreinte Audio : la Bible lue à voix haute, dans l'app. Choisir un livre et un chapitre,
 * écouter avec un vrai lecteur, et lire le texte en même temps.
 */
export default function AudioBibleScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const etat = useAtomValue(etatAudioAtom)
  const ouvrirDansLaBible = useOuvrirDansLaBible()
  const [version, setVersion] = useState(etat.piste?.version ?? versionsAudio[0]?.id ?? 'LSG')
  const [livreChoisi, setLivreChoisi] = useState<number | null>(etat.piste?.book ?? null)
  const [lireEnMemeTemps, setLireEnMemeTemps] = useState(true)
  const piste = etat.piste
  const titre = resolveFontFamily(theme.fontFamily.title)
  const progression = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (etat.piste) setLivreChoisi(etat.piste.book)
  }, [etat.piste])

  const testaments = [
    {
      titre: t('audio.oldTestament'),
      livres: sections.slice(0, 5).flatMap(section => section.data),
    },
    {
      titre: t('audio.newTestament'),
      livres: sections.slice(7, 12).flatMap(section => section.data),
    },
  ]

  return (
    <Box className="flex-1">
      <Header
        hasBackButton
        title={t('audio.title')}
        rightComponent={
          <HStack className="rounded-full p-[3px] bg-light-grey gap-[2px]">
            {versionsAudio.map(v => (
              <LinkBox
                key={v.id}
                onPress={() => setVersion(v.id)}
                accessibilityLabel={v.name}
                accessibilityState={{ selected: version === v.id }}
                className="px-[10px] h-[32px] rounded-full items-center justify-center"
                style={version === v.id ? { backgroundColor: theme.colors.reverse } : undefined}
              >
                <Text
                  className={version === v.id ? 'font-bold text-[12px]' : 'text-grey text-[12px]'}
                >
                  {v.id}
                </Text>
              </LinkBox>
            ))}
          </HStack>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Box className="px-[24px] gap-[28px] w-full max-w-[1400px] self-center">
          {/* Le lecteur, façon plateforme musicale : pochette, titre, description, commandes. */}
          <Box
            className="rounded-[28px] p-[28px] gap-[24px]"
            style={{ backgroundColor: '#112A4D', flexDirection: 'row', flexWrap: 'wrap' }}
          >
            <Pochette book={piste?.book ?? 19} chapter={piste?.chapter ?? 23} />
            <Box className="flex-1 min-w-[280px] gap-[14px] justify-center">
              <Text className="text-[white] text-[12px] font-bold uppercase tracking-[1.5px] opacity-[0.7]">
                {piste ? t('audio.nowPlaying') : t('audio.tagline')}
              </Text>
              <Text
                className="text-[white] text-[34px] leading-[40px]"
                style={{ fontFamily: titre }}
              >
                {piste ? `${livre(piste.book)?.Nom} ${piste.chapter}` : t('audio.heroTitle')}
              </Text>
              <Text className="text-[white] text-[14px] leading-[22px] opacity-[0.8]">
                {piste
                  ? `${familleDuLivre(piste.book)} · ${versionsAudio.find(v => v.id === piste.version)?.name ?? piste.version}`
                  : t('audio.heroText')}
              </Text>
              {piste ? (
                <Box className="gap-[12px]">
                  <div
                    ref={progression}
                    role="slider"
                    aria-label={t('audio.progress')}
                    aria-valuenow={Math.round(etat.position)}
                    onClick={event => {
                      const zone = progression.current?.getBoundingClientRect()
                      if (zone && etat.duree)
                        chercher(((event.clientX - zone.left) / zone.width) * etat.duree)
                    }}
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: 'white',
                        width: `${etat.duree ? (etat.position / etat.duree) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <HStack className="justify-between">
                    <Text className="text-[white] text-[12px] opacity-[0.7]">
                      {formatTemps(etat.position)}
                    </Text>
                    <Text className="text-[white] text-[12px] opacity-[0.7]">
                      {formatTemps(etat.duree)}
                    </Text>
                  </HStack>
                  <HStack className="items-center gap-[14px] flex-wrap">
                    <LinkBox
                      onPress={precedent}
                      accessibilityLabel={t('audio.previous')}
                      className="w-[44px] h-[44px] rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                    >
                      <FeatherIcon name="skip-back" size={18} color="white" />
                    </LinkBox>
                    <LinkBox
                      onPress={basculer}
                      accessibilityLabel={etat.enLecture ? t('audio.pause') : t('audio.play')}
                      className="w-[58px] h-[58px] rounded-full items-center justify-center bg-[white]"
                    >
                      <FeatherIcon
                        name={etat.enLecture ? 'pause' : 'play'}
                        size={24}
                        color="#112A4D"
                      />
                    </LinkBox>
                    <LinkBox
                      onPress={suivant}
                      accessibilityLabel={t('audio.next')}
                      className="w-[44px] h-[44px] rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                    >
                      <FeatherIcon name="skip-forward" size={18} color="white" />
                    </LinkBox>
                    <HStack className="gap-[4px] ml-[8px]">
                      {[0.75, 1, 1.25, 1.5].map(v => (
                        <LinkBox
                          key={v}
                          onPress={() => changerVitesse(v)}
                          className="px-[10px] h-[30px] rounded-full items-center justify-center"
                          style={{
                            backgroundColor:
                              etat.vitesse === v ? 'white' : 'rgba(255,255,255,0.12)',
                          }}
                        >
                          <Text
                            className="text-[12px] font-bold"
                            style={{ color: etat.vitesse === v ? '#112A4D' : 'white' }}
                          >
                            {`${v}×`}
                          </Text>
                        </LinkBox>
                      ))}
                    </HStack>
                    <LinkBox
                      onPress={() => setLireEnMemeTemps(v => !v)}
                      className="flex-row items-center gap-[8px] rounded-full px-[14px] h-[36px]"
                      style={{
                        backgroundColor: lireEnMemeTemps ? 'white' : 'rgba(255,255,255,0.12)',
                      }}
                    >
                      <FeatherIcon
                        name="book-open"
                        size={15}
                        color={lireEnMemeTemps ? '#112A4D' : 'white'}
                      />
                      <Text
                        className="text-[13px] font-bold"
                        style={{ color: lireEnMemeTemps ? '#112A4D' : 'white' }}
                      >
                        {t('audio.readAlong')}
                      </Text>
                    </LinkBox>
                    <LinkBox
                      onPress={() =>
                        ouvrirDansLaBible({
                          book: piste.book,
                          chapter: piste.chapter,
                          version: piste.version,
                        })
                      }
                      className="flex-row items-center gap-[8px] rounded-full px-[14px] h-[36px]"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                    >
                      <FeatherIcon name="external-link" size={15} color="white" />
                      <Text className="text-[13px] font-bold text-[white]">
                        {t('audio.openInBible')}
                      </Text>
                    </LinkBox>
                  </HStack>
                  {etat.erreur ? (
                    <Text className="text-[white] text-[13px] opacity-[0.85]">
                      {t('audio.error')}
                    </Text>
                  ) : null}
                </Box>
              ) : (
                <LinkBox
                  onPress={() => jouer({ version, book: 19, chapter: 23 })}
                  className="self-start flex-row items-center gap-[10px] rounded-full px-[20px] py-[12px] bg-[white]"
                >
                  <FeatherIcon name="play" size={16} color="#112A4D" />
                  <Text className="font-bold text-[14px]" style={{ color: '#112A4D' }}>
                    {t('audio.start')}
                  </Text>
                </LinkBox>
              )}
            </Box>
          </Box>

          {piste && lireEnMemeTemps ? (
            <Box className="rounded-[24px] p-[24px] bg-reverse gap-[14px]">
              <Text className="text-[18px]" style={{ fontFamily: titre }}>
                {`${livre(piste.book)?.Nom} ${piste.chapter}`}
              </Text>
              <TexteDuChapitre piste={piste} />
            </Box>
          ) : null}

          {testaments.map(testament => (
            <Box key={testament.titre} className="gap-[14px]">
              <Text className="text-[20px]" style={{ fontFamily: titre }}>
                {testament.titre}
              </Text>
              <Box className="flex-row flex-wrap gap-[12px]">
                {testament.livres.map(book => (
                  <LinkBox
                    key={book.Numero}
                    onPress={() => setLivreChoisi(livreChoisi === book.Numero ? null : book.Numero)}
                    accessibilityLabel={book.Nom}
                    accessibilityState={{ expanded: livreChoisi === book.Numero }}
                  >
                    <Pochette book={book.Numero} taille={118} />
                  </LinkBox>
                ))}
              </Box>
              {livreChoisi && testament.livres.some(book => book.Numero === livreChoisi) ? (
                <Box className="rounded-[20px] p-[18px] bg-reverse gap-[12px]">
                  <Text className="font-bold text-[15px]">
                    {t('audio.chooseChapter', { book: livre(livreChoisi)?.Nom })}
                  </Text>
                  <Box className="flex-row flex-wrap gap-[8px]">
                    {Array.from(
                      { length: livre(livreChoisi)?.Chapitres ?? 0 },
                      (_, i) => i + 1
                    ).map(chapter => {
                      const actif = piste?.book === livreChoisi && piste?.chapter === chapter
                      return (
                        <LinkBox
                          key={chapter}
                          onPress={() => jouer({ version, book: livreChoisi, chapter })}
                          accessibilityLabel={`${livre(livreChoisi)?.Nom} ${chapter}`}
                          className="w-[44px] h-[44px] rounded-[12px] items-center justify-center"
                          style={{ backgroundColor: actif ? '#112A4D' : theme.colors.lightGrey }}
                        >
                          <Text
                            className="text-[14px] font-bold"
                            style={{ color: actif ? 'white' : theme.colors.default }}
                          >
                            {chapter}
                          </Text>
                        </LinkBox>
                      )
                    })}
                  </Box>
                </Box>
              ) : null}
            </Box>
          ))}
          <Text className="text-tertiary text-[12px]">{t('audio.credit')}</Text>
        </Box>
      </ScrollView>
    </Box>
  )
}

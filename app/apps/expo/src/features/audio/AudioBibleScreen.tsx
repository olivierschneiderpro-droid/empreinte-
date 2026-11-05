import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, useWindowDimensions } from 'react-native'
import { sections } from '~assets/bible_versions/books-desc'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { useOuvrirDansLaBible } from '~features/empreinte/ouvrirDansLaBible'
import { POLICES, police } from '~features/empreinte/lumiere'
import { CreditsPhotos } from '~features/empreinte/vitrine/CreditsPhotos'
import { ImageVitrine } from '~features/empreinte/vitrine/ImageVitrine'
import { photoDuLivre } from '~features/empreinte/vitrine/photos'
import { CarteImagee, Rangee } from '~features/empreinte/vitrine/Rangee'
import { Volet } from '~features/empreinte/vitrine/Volet'
import { useResourceAccess } from '~features/resources/resourceAccess'
import { loadBibleVerseTexts } from '~features/resources/resourceQueries'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import {
  basculer,
  changerVitesse,
  chercher,
  ecoutesAtom,
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

/** Les familles de livres, chacune sur sa rangée (les livres canoniques). */
const FAMILLES = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11]

const BLANC_DOUX = 'rgba(255,255,255,0.14)'

function Rond({
  icone,
  libelle,
  onPress,
  grand,
}: {
  icone: React.ComponentProps<typeof FeatherIcon>['name']
  libelle: string
  onPress: () => void
  grand?: boolean
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={libelle}
      className="rounded-full items-center justify-center"
      style={{
        width: grand ? 60 : 44,
        height: grand ? 60 : 44,
        backgroundColor: grand ? 'white' : BLANC_DOUX,
      }}
    >
      <FeatherIcon name={icone} size={grand ? 24 : 18} color={grand ? '#111827' : 'white'} />
    </LinkBox>
  )
}

function Pastille({
  libelle,
  actif,
  onPress,
  icone,
}: {
  libelle: string
  actif?: boolean
  onPress: () => void
  icone?: React.ComponentProps<typeof FeatherIcon>['name']
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityState={{ selected: !!actif }}
      className="flex-row items-center gap-[6px] rounded-full px-[12px] h-[32px]"
      style={{ backgroundColor: actif ? 'white' : BLANC_DOUX }}
    >
      {icone ? <FeatherIcon name={icone} size={14} color={actif ? '#111827' : 'white'} /> : null}
      <Text className="text-[12px] font-bold" style={{ color: actif ? '#111827' : 'white' }}>
        {libelle}
      </Text>
    </LinkBox>
  )
}

/**
 * Empreinte Audio : la Bible lue à voix haute, rangée comme les autres pages. Le lecteur en
 * haut (sur la photo du livre), « Reprendre l'écoute », puis une rangée par famille de livres ;
 * toucher un livre ouvre le volet des chapitres. Le texte se lit à côté, dans un panneau.
 */
export default function AudioBibleScreen() {
  const { t } = useTranslation()
  const etat = useAtomValue(etatAudioAtom)
  const ecoutes = useAtomValue(ecoutesAtom)
  const ouvrirDansLaBible = useOuvrirDansLaBible()
  const { width } = useWindowDimensions()
  const [version, setVersion] = useState(etat.piste?.version ?? versionsAudio[0]?.id ?? 'LSG')
  const [livreChoisi, setLivreChoisi] = useState<number | null>(null)
  const [lireEnMemeTemps, setLireEnMemeTemps] = useState(true)
  const progression = useRef<HTMLDivElement>(null)
  const piste = etat.piste
  const nom = (numero: number) => t(livre(numero)?.Nom ?? '')
  const aCote = width >= 1180
  const versionDe = (id: string) => versionsAudio.find(v => v.id === id)?.name ?? id

  const lecteur = (
    <Box
      className="rounded-[28px] overflow-hidden"
      style={{ minHeight: 280, boxShadow: '0 16px 40px rgba(17,17,19,0.16)' } as object}
    >
      <Box className="absolute inset-0" style={{ backgroundColor: '#121827' }} />
      <ImageVitrine
        photo={photoDuLivre(piste?.book ?? 19)}
        largeur={1200}
        hauteur={300}
        avecCredit
      />
      <Box
        className="absolute inset-0"
        style={
          {
            backgroundImage:
              'linear-gradient(90deg, rgba(14,18,30,0.94) 0%, rgba(14,18,30,0.72) 45%, rgba(14,18,30,0.2) 100%)',
          } as object
        }
      />
      <Box className="p-[28px] gap-[12px] max-w-[720px]">
        <Text className="text-[white] text-[12px] font-bold uppercase tracking-[1.5px] opacity-[0.8]">
          {piste ? t('audio.nowPlaying') : t('audio.tagline')}
        </Text>
        <Text
          className="text-[white]"
          style={{ fontFamily: police(POLICES.titre), fontSize: 34, lineHeight: 40 }}
        >
          {piste ? `${nom(piste.book)} ${piste.chapter}` : t('audio.heroTitle')}
        </Text>
        <Text className="text-[white] text-[14px] leading-[21px] opacity-[0.85]">
          {piste
            ? `${t(familleDuLivre(piste.book))} · ${versionDe(piste.version)}`
            : t('audio.heroText')}
        </Text>
        {piste ? (
          <Box className="gap-[12px] mt-[4px]">
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
                background: 'rgba(255,255,255,0.22)',
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
              <Text className="text-[white] text-[12px] opacity-[0.75]">
                {formatTemps(etat.position)}
              </Text>
              <Text className="text-[white] text-[12px] opacity-[0.75]">
                {formatTemps(etat.duree)}
              </Text>
            </HStack>
            <HStack className="items-center gap-[14px]">
              <Rond icone="skip-back" libelle={t('audio.previous')} onPress={precedent} />
              <Rond
                grand
                icone={etat.enLecture ? 'pause' : 'play'}
                libelle={etat.enLecture ? t('audio.pause') : t('audio.play')}
                onPress={basculer}
              />
              <Rond icone="skip-forward" libelle={t('audio.next')} onPress={suivant} />
            </HStack>
            <HStack className="items-center gap-[6px] flex-wrap">
              {[0.75, 1, 1.25, 1.5].map(v => (
                <Pastille
                  key={v}
                  libelle={`${v}×`}
                  actif={etat.vitesse === v}
                  onPress={() => changerVitesse(v)}
                />
              ))}
              <Box className="w-[8px]" />
              <Pastille
                icone="book-open"
                libelle={t('audio.readAlong')}
                actif={lireEnMemeTemps}
                onPress={() => setLireEnMemeTemps(v => !v)}
              />
              <Pastille
                icone="external-link"
                libelle={t('audio.openInBible')}
                onPress={() =>
                  ouvrirDansLaBible({
                    book: piste.book,
                    chapter: piste.chapter,
                    version: piste.version,
                  })
                }
              />
            </HStack>
            {etat.erreur ? (
              <Text className="text-[white] text-[13px] opacity-[0.85]">{t('audio.error')}</Text>
            ) : null}
          </Box>
        ) : (
          <LinkBox
            onPress={() => jouer({ version, book: 19, chapter: 23 })}
            className="self-start flex-row items-center gap-[10px] rounded-full px-[20px] h-[44px] mt-[6px] bg-[white]"
          >
            <FeatherIcon name="play" size={16} color="#111827" />
            <Text className="font-bold text-[14px]" style={{ color: '#111827' }}>
              {t('audio.start')}
            </Text>
          </LinkBox>
        )}
      </Box>
    </Box>
  )

  const texte =
    piste && lireEnMemeTemps ? (
      <Box className="rounded-[24px] p-[22px] bg-reverse gap-[14px]">
        <HStack className="items-center gap-[8px]">
          <FeatherIcon name="book-open" size={16} color="grey" />
          <Text className="flex-1" style={{ fontFamily: police(POLICES.titre), fontSize: 18 }}>
            {`${nom(piste.book)} ${piste.chapter}`}
          </Text>
        </HStack>
        <TexteDuChapitre piste={piste} />
      </Box>
    ) : null

  const rangees = (
    <>
      {ecoutes.length ? (
        <Rangee titre={t('audio.resumeListening')}>
          {ecoutes.map(e => (
            <CarteImagee
              key={`${e.book}-${e.chapter}`}
              scene="nuit"
              photo={photoDuLivre(e.book)}
              titre={`${nom(e.book)} ${e.chapter}`}
              sousTitre={versionDe(e.version)}
              largeur={200}
              hauteur={118}
              onPress={() => jouer(e)}
              surImage={
                <Box className="w-[36px] h-[36px] rounded-full items-center justify-center bg-[white]">
                  <FeatherIcon name="play" size={16} color="#111827" />
                </Box>
              }
            />
          ))}
        </Rangee>
      ) : null}

      {FAMILLES.map(index => {
        const section = sections[index]
        if (!section) return null
        return (
          <Rangee
            key={index}
            titre={t(section.title)}
            sousTitre={t('bibleAccueil.booksCount', { count: section.data.length })}
          >
            {section.data.map(book => (
              <CarteImagee
                key={book.Numero}
                scene="nuit"
                photo={photoDuLivre(book.Numero)}
                titre={t(book.Nom)}
                sousTitre={t('bibleAccueil.chaptersCount', { count: book.Chapitres })}
                largeur={176}
                hauteur={112}
                onPress={() => setLivreChoisi(book.Numero)}
                titreSurImage
                surImage={
                  <HStack className="items-end justify-between gap-[8px]">
                    <Text
                      className="text-[white] flex-1"
                      style={{ fontFamily: police(POLICES.titre), fontSize: 18 }}
                      numberOfLines={2}
                    >
                      {t(book.Nom)}
                    </Text>
                    <FeatherIcon name="headphones" size={16} color="white" />
                  </HStack>
                }
              />
            ))}
          </Rangee>
        )
      })}
      <Text className="text-tertiary text-[12px]">{t('audio.credit')}</Text>
      <CreditsPhotos />
    </>
  )

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
                className={`px-[10px] h-[32px] rounded-full items-center justify-center ${
                  version === v.id ? 'bg-reverse' : ''
                }`}
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
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Box className="px-[24px] gap-[30px] w-full max-w-[1300px] self-center">
          {lecteur}
          {texte && aCote ? (
            <HStack className="gap-[24px] items-start">
              <Box className="flex-1 gap-[30px] min-w-0">{rangees}</Box>
              <Box style={{ width: 380, position: 'sticky', top: 12 } as object}>
                <ScrollView style={{ maxHeight: 640 }}>{texte}</ScrollView>
              </Box>
            </HStack>
          ) : (
            <>
              {texte}
              {rangees}
            </>
          )}
        </Box>
      </ScrollView>

      {livreChoisi ? (
        <Volet
          titre={t('audio.chooseChapter', { book: nom(livreChoisi) })}
          onFermer={() => setLivreChoisi(null)}
        >
          <HStack className="flex-wrap gap-[8px]">
            {Array.from({ length: livre(livreChoisi)?.Chapitres ?? 0 }, (_, i) => i + 1).map(
              chapter => {
                const actif = piste?.book === livreChoisi && piste?.chapter === chapter
                return (
                  <LinkBox
                    key={chapter}
                    onPress={() => {
                      jouer({ version, book: livreChoisi, chapter })
                      setLivreChoisi(null)
                    }}
                    accessibilityLabel={`${nom(livreChoisi)} ${chapter}`}
                    className={`w-[48px] h-[48px] rounded-[14px] items-center justify-center ${
                      actif ? 'bg-primary' : 'bg-light-grey'
                    }`}
                  >
                    <Text
                      className={actif ? 'text-reverse' : ''}
                      style={{ fontFamily: police(POLICES.points), fontSize: 18 }}
                    >
                      {chapter}
                    </Text>
                  </LinkBox>
                )
              }
            )}
          </HStack>
        </Volet>
      ) : null}
    </Box>
  )
}

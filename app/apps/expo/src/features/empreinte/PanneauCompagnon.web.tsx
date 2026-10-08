import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import books from '~assets/bible_versions/books-desc'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { useResourceAccess } from '~features/resources/resourceAccess'
import { loadBibleVerseTexts } from '~features/resources/resourceQueries'
import { trouverVideo, useLangueVideos } from '~features/videos/catalogueVideos'
import { CadreYoutube } from '~features/videos/LecteurVideo'
import { versions } from '~helpers/bibleVersions'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { compagnonAtom } from './compagnon'

const LIVRES_CANON = books.filter(book => book.Numero <= 66)

const champ: React.CSSProperties = {
  height: 36,
  borderRadius: 12,
  border: '1px solid var(--color-border)',
  background: 'var(--color-reverse)',
  color: 'var(--color-default)',
  padding: '0 10px',
  font: '600 13px system-ui, sans-serif',
}

function Bouton({
  icone,
  libelle,
  onPress,
}: {
  icone: React.ComponentProps<typeof FeatherIcon>['name']
  libelle: string
  onPress: () => void
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={libelle}
      className="w-[36px] h-[36px] rounded-[12px] items-center justify-center bg-light-grey"
    >
      <FeatherIcon name={icone} size={17} />
    </LinkBox>
  )
}

/** La deuxième lecture, indépendante de la première, avec sa propre barre en haut. */
function DeuxiemeLecture({
  book,
  chapter,
  version,
}: {
  book: number
  chapter: number
  version: string
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [, setCompagnon] = useAtom(compagnonAtom)
  const resources = useResourceAccess()
  const livre = LIVRES_CANON.find(item => item.Numero === book) ?? LIVRES_CANON[0]
  const aller = (partiel: Partial<{ book: number; chapter: number; version: string }>) =>
    setCompagnon({ type: 'bible', book, chapter, version, ...partiel })
  const voisin = (sens: 1 | -1) => {
    const suivant = chapter + sens
    if (suivant >= 1 && suivant <= livre.Chapitres) return aller({ chapter: suivant })
    const autre = LIVRES_CANON.find(item => item.Numero === book + sens)
    if (autre) aller({ book: autre.Numero, chapter: sens === 1 ? 1 : autre.Chapitres })
  }
  const { data, isLoading } = useQuery({
    queryKey: ['compagnon-chapitre', version, book, chapter],
    queryFn: () =>
      loadBibleVerseTexts(
        resources,
        version,
        Array.from({ length: 176 }, (_, i) => `${book}-${chapter}-${i + 1}`)
      ),
    staleTime: Infinity,
    networkMode: 'always',
  })
  const versets = Object.entries(data ?? {})
    .map(([cle, texte]) => ({ numero: Number(cle.split('-')[2]), texte }))
    .sort((a, b) => a.numero - b.numero)

  return (
    <Box className="flex-1">
      {/* La barre de cette lecture : fixe en haut, distincte de celle de la Bible. */}
      <HStack className="items-center gap-[8px] px-[14px] py-[12px] flex-wrap border-b border-border">
        <Bouton icone="chevron-left" libelle={t('compagnon.previous')} onPress={() => voisin(-1)} />
        <select
          aria-label={t('compagnon.book')}
          value={book}
          onChange={event => aller({ book: Number(event.target.value), chapter: 1 })}
          style={{ ...champ, maxWidth: 150 }}
        >
          {LIVRES_CANON.map(item => (
            <option key={item.Numero} value={item.Numero}>
              {t(item.Nom)}
            </option>
          ))}
        </select>
        <select
          aria-label={t('compagnon.chapter')}
          value={chapter}
          onChange={event => aller({ chapter: Number(event.target.value) })}
          style={champ}
        >
          {Array.from({ length: livre.Chapitres }, (_, i) => i + 1).map(numero => (
            <option key={numero} value={numero}>
              {numero}
            </option>
          ))}
        </select>
        <select
          aria-label={t('compagnon.version')}
          value={version}
          onChange={event => aller({ version: event.target.value })}
          style={{ ...champ, maxWidth: 110 }}
        >
          {Object.values(versions).map(item => (
            <option key={item.id} value={item.id}>
              {item.id}
            </option>
          ))}
        </select>
        <Bouton icone="chevron-right" libelle={t('compagnon.next')} onPress={() => voisin(1)} />
      </HStack>
      <ScrollView contentContainerStyle={{ padding: 22, gap: 10 }}>
        <Text
          className="text-[22px] mb-[6px]"
          style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
        >
          {`${t(livre.Nom)} ${chapter}`}
        </Text>
        {isLoading ? (
          <Text className="text-grey">…</Text>
        ) : versets.length ? (
          versets.map(({ numero, texte }) => (
            <Text
              key={numero}
              className="text-[17px] leading-[29px]"
              style={{ fontFamily: resolveFontFamily(theme.fontFamily.paragraph) }}
            >
              <Text className="text-tertiary text-[12px] font-bold">{`${numero} `}</Text>
              {texte}
            </Text>
          ))
        ) : (
          <Text className="text-grey">{t('resource.action.temporarilyUnavailable')}</Text>
        )}
      </ScrollView>
    </Box>
  )
}

function VideoACote({ id }: { id: string }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const [langue] = useLangueVideos()
  const video = trouverVideo(langue, id)
  if (!video) return <Text className="p-[22px] text-grey">{t('passageMediaLibrary.notFound')}</Text>
  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
      <CadreYoutube idYoutube={video.providerId} titre={video.title} />
      <Text
        className="text-[20px] leading-[26px]"
        style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
      >
        {video.title}
      </Text>
      <Text className="text-grey text-[13px]">
        {[video.reference, video.attributionLabel].filter(Boolean).join(' · ')}
      </Text>
    </ScrollView>
  )
}

/**
 * Empreinte · Espace d'étude : le panneau à droite de la Bible. Il garde la Parole au centre
 * et y ajoute une deuxième lecture ou une vidéo, chacune avec ses commandes.
 */
export default function PanneauCompagnon() {
  const { t } = useTranslation()
  const [compagnon, setCompagnon] = useAtom(compagnonAtom)
  if (!compagnon) return null
  return (
    <Box className="flex-1">
      <HStack className="items-center justify-between px-[16px] pt-[14px]">
        <HStack className="items-center gap-[8px]">
          <FeatherIcon
            name={compagnon.type === 'video' ? 'play-circle' : 'columns'}
            size={16}
            color="grey"
          />
          <Text className="text-grey text-[12px] font-bold uppercase tracking-[1px]">
            {compagnon.type === 'video' ? t('compagnon.videoTitle') : t('compagnon.bibleTitle')}
          </Text>
        </HStack>
        <LinkBox
          onPress={() => setCompagnon(null)}
          accessibilityLabel={t('compagnon.close')}
          className="w-[34px] h-[34px] rounded-full items-center justify-center bg-light-grey"
        >
          <FeatherIcon name="x" size={16} />
        </LinkBox>
      </HStack>
      {compagnon.type === 'bible' ? (
        <DeuxiemeLecture
          book={compagnon.book}
          chapter={compagnon.chapter}
          version={compagnon.version}
        />
      ) : (
        <VideoACote id={compagnon.id} />
      )}
    </Box>
  )
}

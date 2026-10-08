import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView } from 'react-native'
import books from '~assets/bible_versions/books-desc'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { jouer, versionsAudio } from '~features/audio/bibleAudio'
import {
  formatPassageMediaDuration,
  getAllPassageMedia,
  getPassageMediaForChapter,
  type ResolvedPassageMedia,
} from '~features/bible/passageMedia'
import { chargerCatalogueLocal } from '~features/plans/catalogueLocal'
import { useResourceAccess } from '~features/resources/resourceAccess'
import { loadBibleVerseTexts } from '~features/resources/resourceQueries'
import { trouverVideo, useLangueVideos } from '~features/videos/catalogueVideos'
import { CadreYoutube } from '~features/videos/LecteurVideo'
import { versions } from '~helpers/bibleVersions'
import useLanguage from '~helpers/useLanguage'
import { activeTabIndexAtom, tabsAtom, type BibleTab } from '~state/tabs'
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

/** Le passage lu dans la Bible principale (l'onglet actif). */
const useLecturePrincipale = () => {
  const onglets = useAtomValue(tabsAtom)
  const actif = useAtomValue(activeTabIndexAtom)
  const onglet = onglets[actif]
  return onglet?.type === 'bible' ? (onglet as BibleTab).data : null
}

const normaliser = (texte: string) => texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <Box className="gap-[10px]">
      <Text className="text-grey text-[12px] font-bold uppercase tracking-[1px]">{titre}</Text>
      {children}
    </Box>
  )
}

function CarteVideoCompacte({
  video,
  onPress,
}: {
  video: ResolvedPassageMedia
  onPress: () => void
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={video.title}
      className="flex-row items-center gap-[12px] rounded-[16px] p-[8px] bg-reverse"
    >
      <Box className="w-[112px] h-[63px] rounded-[10px] overflow-hidden bg-light-grey">
        {video.thumbnailUrl ? (
          <Image source={{ uri: video.thumbnailUrl }} style={{ width: 112, height: 63 }} />
        ) : null}
      </Box>
      <Box className="flex-1 gap-[3px]">
        <Text className="font-bold text-[13px] leading-[18px]" numberOfLines={2}>
          {video.title}
        </Text>
        <Text className="text-grey text-[12px]" numberOfLines={1}>
          {[video.reference, formatPassageMediaDuration(video.durationSeconds)]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </Box>
    </LinkBox>
  )
}

/**
 * « Autour du passage » : ce qui accompagne le chapitre lu à gauche, et qui suit la lecture
 * quand on change de chapitre — vidéos du chapitre puis du livre, écoute, plans, deuxième
 * lecture. Rien ne remplace la Bible : tout s'ouvre à côté.
 */
function AutourDuPassage() {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const langueApp = useLanguage()
  const [langue] = useLangueVideos()
  const [, setCompagnon] = useAtom(compagnonAtom)
  const lecture = useLecturePrincipale()
  const book = lecture?.selectedBook.Numero ?? 0
  const chapter = lecture?.selectedChapter ?? 0
  const { data: catalogue } = useQuery({
    queryKey: ['catalogue-plans-local'],
    queryFn: chargerCatalogueLocal,
    staleTime: Infinity,
  })
  if (!lecture) return <Text className="p-[22px] text-grey">{t('compagnon.aroundEmpty')}</Text>

  const nomLivre = t(lecture.selectedBook.Nom)
  const media = getPassageMediaForChapter({ book, chapter, language: langue })
  const duChapitre = [
    ...media.introduction,
    ...media.chapterResources,
    ...Object.values(media.afterVerses).flat(),
  ].filter((video, i, liste) => liste.findIndex(autre => autre.workId === video.workId) === i)
  const dejaVues = new Set(duChapitre.map(video => video.workId))
  const duLivre = getAllPassageMedia(langue)
    .filter(video => video.books.includes(book) && !dejaVues.has(video.workId))
    .slice(0, 6)
  const cle = normaliser(nomLivre)
  const plans = (catalogue?.plans ?? [])
    .filter(plan => !plan.lang || plan.lang === langueApp)
    .filter(plan => normaliser(`${plan.title} ${plan.description ?? ''}`).includes(cle))
    .slice(0, 4)
  const versionAudio =
    versionsAudio.find(version => version.id === lecture.selectedVersion) ??
    versionsAudio.find(version => version.id === (langueApp === 'fr' ? 'LSG' : 'KJV')) ??
    versionsAudio[0]
  const voirAcote = (video: ResolvedPassageMedia) =>
    setCompagnon({ type: 'video', id: video.workId })

  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 22 }}>
      <Text
        className="text-[22px]"
        style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
      >
        {t('compagnon.aroundTitle', { passage: `${nomLivre} ${chapter}` })}
      </Text>

      <HStack className="gap-[10px] flex-wrap">
        {versionAudio ? (
          <LinkBox
            onPress={() => jouer({ version: versionAudio.id, book, chapter })}
            accessibilityLabel={t('compagnon.listenChapter')}
            className="flex-row items-center gap-[8px] rounded-full px-[14px] h-[38px] bg-light-grey"
          >
            <FeatherIcon name="headphones" size={16} />
            <Text className="font-bold text-[13px]">{t('compagnon.listenChapter')}</Text>
          </LinkBox>
        ) : null}
        <LinkBox
          onPress={() =>
            setCompagnon({ type: 'bible', book, chapter, version: lecture.selectedVersion })
          }
          accessibilityLabel={t('compagnon.twoReadings')}
          className="flex-row items-center gap-[8px] rounded-full px-[14px] h-[38px] bg-light-grey"
        >
          <FeatherIcon name="columns" size={16} />
          <Text className="font-bold text-[13px]">{t('compagnon.twoReadings')}</Text>
        </LinkBox>
      </HStack>

      {duChapitre.length ? (
        <Section titre={t('compagnon.chapterVideos')}>
          {duChapitre.map(video => (
            <CarteVideoCompacte key={video.workId} video={video} onPress={() => voirAcote(video)} />
          ))}
        </Section>
      ) : null}
      {duLivre.length ? (
        <Section titre={t('compagnon.bookVideos', { book: nomLivre })}>
          {duLivre.map(video => (
            <CarteVideoCompacte key={video.workId} video={video} onPress={() => voirAcote(video)} />
          ))}
        </Section>
      ) : null}
      {!duChapitre.length && !duLivre.length ? (
        <Text className="text-grey text-[13px]">{t('compagnon.noVideos')}</Text>
      ) : null}

      <Section titre={t('compagnon.relatedPlans')}>
        {plans.map(plan => (
          <LinkBox
            key={plan.id}
            onPress={() => router.push({ pathname: '/plan', params: { planId: plan.id } })}
            accessibilityLabel={plan.title}
            className="flex-row items-center gap-[12px] rounded-[16px] p-[8px] bg-reverse"
          >
            <Box className="w-[64px] h-[36px] rounded-[8px] overflow-hidden bg-light-grey">
              {plan.image ? (
                <Image source={{ uri: plan.image }} style={{ width: 64, height: 36 }} />
              ) : null}
            </Box>
            <Text className="flex-1 font-bold text-[13px]" numberOfLines={2}>
              {plan.title}
            </Text>
          </LinkBox>
        ))}
        <LinkBox
          onPress={() => router.push({ pathname: '/plans' })}
          accessibilityLabel={t('compagnon.allPlans')}
          className="flex-row items-center gap-[8px]"
        >
          <Text className="text-primary font-bold text-[13px]">{t('compagnon.allPlans')}</Text>
          <FeatherIcon name="arrow-right" size={14} color="primary" />
        </LinkBox>
      </Section>
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
  const lecture = useLecturePrincipale()
  if (!compagnon) return null
  type Onglet = {
    type: NonNullable<typeof compagnon>['type']
    libelle: string
    icone: React.ComponentProps<typeof FeatherIcon>['name']
    ouvrir: () => void
  }
  const onglets: Onglet[] = [
    {
      type: 'autour',
      libelle: t('compagnon.around'),
      icone: 'compass',
      ouvrir: () => setCompagnon({ type: 'autour' }),
    },
    {
      type: 'bible',
      libelle: t('compagnon.bibleTitle'),
      icone: 'columns',
      ouvrir: () =>
        compagnon.type !== 'bible' &&
        lecture &&
        setCompagnon({
          type: 'bible',
          book: lecture.selectedBook.Numero,
          chapter: lecture.selectedChapter,
          version: lecture.selectedVersion,
        }),
    },
  ]
  // L'onglet Vidéo n'apparaît que lorsqu'une vidéo est ouverte à côté.
  if (compagnon.type === 'video')
    onglets.push({
      type: 'video',
      libelle: t('compagnon.videoTitle'),
      icone: 'play-circle',
      ouvrir: () => {},
    })
  return (
    <Box className="flex-1">
      <HStack className="items-center justify-between px-[16px] pt-[14px] gap-[8px]">
        <HStack className="items-center gap-[6px] flex-wrap">
          {onglets.map(onglet => {
            const actif = onglet.type === compagnon.type
            return (
              <LinkBox
                key={onglet.type}
                onPress={onglet.ouvrir}
                accessibilityLabel={onglet.libelle}
                accessibilityState={{ selected: actif }}
                className={`flex-row items-center gap-[6px] rounded-full px-[12px] h-[32px] ${
                  actif ? 'bg-primary' : 'bg-light-grey'
                }`}
              >
                <FeatherIcon name={onglet.icone} size={14} color={actif ? 'reverse' : 'default'} />
                <Text className={`text-[12px] font-bold ${actif ? 'text-reverse' : ''}`}>
                  {onglet.libelle}
                </Text>
              </LinkBox>
            )
          })}
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
      ) : compagnon.type === 'video' ? (
        <VideoACote id={compagnon.id} />
      ) : (
        <AutourDuPassage />
      )}
    </Box>
  )
}

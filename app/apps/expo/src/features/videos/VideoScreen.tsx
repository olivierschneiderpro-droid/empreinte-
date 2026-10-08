import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ScrollView, Share, TextInput, useWindowDimensions } from 'react-native'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { formatPassageMediaDuration } from '~features/bible/passageMedia'
import { useOuvrirDansLaBible } from '~features/empreinte/ouvrirDansLaBible'
import {
  commentairesEmpreinte,
  comptesEmpreinteActifs,
  ErreurCompte,
  type Commentaire,
} from '~helpers/compteEmpreinte'
import { toast } from '~helpers/toast'
import useLogin from '~helpers/useLogin'
import { usePushRouteOnce } from '~navigation/usePushRouteOnce'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { trouverVideo, useLangueVideos, videosLiees, type Video } from './catalogueVideos'
import LecteurVideo from './LecteurVideo'
import { CarteVideo, ChoixLangue } from './VideosScreen'

function Action({
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
      className="flex-row items-center gap-[8px] rounded-full px-[16px] h-[40px] bg-reverse border border-border"
    >
      <FeatherIcon name={icone} size={16} />
      <Text className="font-bold text-[13px]">{libelle}</Text>
    </LinkBox>
  )
}

/** Empreinte : partager sa compréhension sous la vidéo. */
function Compréhensions({ sujet }: { sujet: string }) {
  const { t } = useTranslation()
  const { isLogged } = useLogin()
  const pushRoute = usePushRouteOnce()
  const [liste, setListe] = useState<Commentaire[]>([])
  const [texte, setTexte] = useState('')
  const theme = useTheme()
  const actifs = comptesEmpreinteActifs()

  useEffect(() => {
    if (!actifs) return
    commentairesEmpreinte.lire(sujet).then(setListe, () => setListe([]))
  }, [actifs, sujet])

  const envoyer = async () => {
    if (!texte.trim()) return
    try {
      const nouveau = await commentairesEmpreinte.ajouter(sujet, texte)
      setListe(actuels => [nouveau, ...actuels])
      setTexte('')
    } catch (erreur) {
      toast.error(erreur instanceof ErreurCompte ? erreur.message : t('Une erreur est survenue.'))
    }
  }

  return (
    <Box className="gap-[14px]">
      <Text
        className="text-[18px]"
        style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
      >
        {t('videos.comments.title')}
      </Text>
      <Text className="text-grey text-[13px]">{t('videos.comments.intro')}</Text>
      {!actifs ? (
        <Text className="text-tertiary text-[13px]">{t('videos.comments.unavailable')}</Text>
      ) : isLogged ? (
        <Box className="gap-[10px]">
          <TextInput
            value={texte}
            onChangeText={setTexte}
            multiline
            placeholder={t('videos.comments.placeholder')}
            placeholderTextColor={theme.colors.tertiary}
            className="min-h-[90px] rounded-[16px] p-[14px] bg-reverse border border-border text-[14px] text-default"
            style={{ outlineStyle: 'none', textAlignVertical: 'top' } as object}
          />
          <LinkBox
            onPress={() => void envoyer()}
            className="self-end flex-row items-center gap-[8px] rounded-full px-[18px] h-[40px] bg-primary"
          >
            <FeatherIcon name="send" size={15} color="white" />
            <Text className="text-[white] font-bold text-[13px]">{t('videos.comments.send')}</Text>
          </LinkBox>
        </Box>
      ) : (
        <LinkBox
          onPress={() => pushRoute({ pathname: '/login' })}
          className="self-start flex-row items-center gap-[8px] rounded-full px-[18px] h-[40px] bg-light-primary"
        >
          <FeatherIcon name="log-in" size={15} color="primary" />
          <Text className="text-primary font-bold text-[13px]">{t('videos.comments.login')}</Text>
        </LinkBox>
      )}
      {liste.map(commentaire => (
        <Box key={commentaire.id} className="gap-[4px] rounded-[16px] p-[14px] bg-reverse">
          <HStack className="items-center gap-[8px]">
            <Text className="font-bold text-[13px]">{commentaire.nom}</Text>
            <Text className="text-tertiary text-[11px]">
              {new Date(commentaire.created.replace(' ', 'T')).toLocaleDateString()}
            </Text>
          </HStack>
          <Text className="text-[14px] leading-[21px]">{commentaire.texte}</Text>
        </Box>
      ))}
    </Box>
  )
}

/**
 * Empreinte : la page d'une vidéo, façon YouTube. La vidéo en grand, ce qu'elle explique,
 * le passage à lire, les compréhensions partagées, et les vidéos à suivre à côté.
 */
export default function VideoScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const [langue] = useLangueVideos()
  const ouvrirDansLaBible = useOuvrirDansLaBible()
  const { width } = useWindowDimensions()
  const large = width >= 1100
  const video: Video | undefined = id ? trouverVideo(langue, id) : undefined
  const titre = resolveFontFamily(theme.fontFamily.title)

  if (!video)
    return (
      <Box className="flex-1">
        <Header hasBackButton title={t('videos.title')} rightComponent={<ChoixLangue />} />
        <Box className="flex-1 items-center justify-center p-[24px]">
          <Text className="text-grey text-center">{t('passageMediaLibrary.notFound')}</Text>
        </Box>
      </Box>
    )

  const liees = videosLiees(langue, video)
  const categorie = video.categories[0]

  const principal = (
    <Box className="gap-[18px]" style={large ? { flex: 1, minWidth: 0 } : undefined}>
      <LecteurVideo idYoutube={video.providerId} titre={video.title} />
      <Box className="gap-[6px]">
        <Text className="text-[26px] leading-[32px]" style={{ fontFamily: titre }}>
          {video.title}
        </Text>
        <Text className="text-grey text-[13px]">
          {[
            formatPassageMediaDuration(video.durationSeconds),
            video.attributionLabel,
            langue.toUpperCase(),
          ].join(' · ')}
        </Text>
      </Box>
      <HStack className="flex-wrap gap-[10px]">
        {video.books[0] ? (
          <Action
            icone="book-open"
            libelle={t('videos.readPassage')}
            onPress={() => ouvrirDansLaBible({ book: video.books[0], chapter: 1 })}
          />
        ) : null}
        <Action
          icone="share-2"
          libelle={t('Partager')}
          onPress={() => void Share.share({ message: `${video.title} — ${video.sourceUrl}` })}
        />
        <Action
          icone="youtube"
          libelle={t('videos.openYoutube')}
          onPress={() => void Linking.openURL(video.sourceUrl)}
        />
      </HStack>
      <Box className="gap-[8px] rounded-[20px] p-[18px] bg-reverse">
        <Text className="font-bold text-[14px]">{t(`videos.cat.${categorie}.title`)}</Text>
        <Text className="text-[14px] leading-[22px]">
          {t(`videos.cat.${categorie}.description`)}
        </Text>
        {video.reference ? (
          <Text className="text-grey text-[13px]">
            {t('videos.passages')} : {video.reference}
          </Text>
        ) : null}
        <Text className="text-tertiary text-[12px]">{t('videos.credit')}</Text>
      </Box>
      <Compréhensions sujet={`video:${video.workId}`} />
    </Box>
  )

  const aSuivre = (
    <Box className="gap-[16px]" style={large ? { width: 380 } : undefined}>
      <Text className="text-[18px]" style={{ fontFamily: titre }}>
        {t('videos.next')}
      </Text>
      {liees.map(autre => (
        <CarteVideo key={autre.editionId} video={autre} largeur={large ? 380 : 300} />
      ))}
    </Box>
  )

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('videos.title')} rightComponent={<ChoixLangue />} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Box
          className="px-[24px] gap-[32px] w-full max-w-[1500px] self-center"
          style={large ? { flexDirection: 'row', alignItems: 'flex-start' } : undefined}
        >
          {principal}
          {aSuivre}
        </Box>
      </ScrollView>
    </Box>
  )
}

import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, TextInput } from 'react-native'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { formatPassageMediaDuration } from '~features/bible/passageMedia'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { chercherVideos, useLangueVideos, videosParRangee, type Video } from './catalogueVideos'

export function ChoixLangue() {
  const [langue, choisir] = useLangueVideos()
  const theme = useTheme()
  return (
    <HStack className="rounded-full p-[3px] bg-light-grey" accessibilityRole="radiogroup">
      {(['fr', 'en'] as const).map(code => (
        <LinkBox
          key={code}
          accessibilityRole="radio"
          accessibilityState={{ selected: langue === code }}
          onPress={() => choisir(code)}
          className="px-[12px] h-[32px] rounded-full items-center justify-center"
          style={langue === code ? { backgroundColor: theme.colors.reverse } : undefined}
        >
          <Text className={langue === code ? 'font-bold text-[13px]' : 'text-grey text-[13px]'}>
            {code.toUpperCase()}
          </Text>
        </LinkBox>
      ))}
    </HStack>
  )
}

export function CarteVideo({ video, largeur = 280 }: { video: Video; largeur?: number }) {
  const router = useRouter()
  const theme = useTheme()
  return (
    <LinkBox
      accessibilityLabel={video.title}
      onPress={() => router.push({ pathname: '/video', params: { id: video.workId } } as never)}
      style={{ width: largeur }}
      className="gap-[10px]"
    >
      <Box className="rounded-[16px] overflow-hidden bg-light-grey" style={{ aspectRatio: 16 / 9 }}>
        <Image
          source={{ uri: video.thumbnailUrl }}
          placeholder={{ blurhash: video.blurHash }}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
          accessible={false}
        />
        <Box className="absolute right-[8px] bottom-[8px] rounded-[6px] px-[6px] py-[2px] bg-black/75">
          <Text className="text-[white] text-[11px] font-bold">
            {formatPassageMediaDuration(video.durationSeconds)}
          </Text>
        </Box>
      </Box>
      <Box className="gap-[3px] px-[2px]">
        <Text
          className="text-[15px] leading-[20px]"
          numberOfLines={2}
          style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
        >
          {video.title}
        </Text>
        <Text className="text-grey text-[12px]" numberOfLines={1}>
          {video.reference || video.attributionLabel}
        </Text>
      </Box>
    </LinkBox>
  )
}

/**
 * Empreinte : la page Vidéos, façon YouTube. Une vidéo à la une, puis une rangée par
 * catégorie (panoramas des livres, thèmes, études de mots…), une recherche et la langue.
 */
export default function VideosScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const [langue] = useLangueVideos()
  const [recherche, setRecherche] = useState('')
  const rangees = videosParRangee(langue)
  const resultats = recherche.trim() ? chercherVideos(langue, recherche) : null
  const une = rangees[0]?.videos[0]
  const titre = resolveFontFamily(theme.fontFamily.title)

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('videos.title')} rightComponent={<ChoixLangue />} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Box className="px-[24px] gap-[28px] w-full max-w-[1400px] self-center">
          <HStack className="items-center gap-[10px] h-[48px] px-[16px] rounded-[16px] bg-reverse border border-border">
            <FeatherIcon name="search" size={18} color="grey" />
            <TextInput
              value={recherche}
              onChangeText={setRecherche}
              placeholder={t('videos.search')}
              placeholderTextColor={theme.colors.tertiary}
              accessibilityLabel={t('videos.search')}
              className="flex-1 text-[15px] text-default h-full"
              style={{ outlineStyle: 'none' } as object}
            />
          </HStack>

          {resultats ? (
            <Box className="gap-[16px]">
              <Text className="text-[20px]" style={{ fontFamily: titre }}>
                {t('videos.results', { count: resultats.length })}
              </Text>
              <Box className="flex-row flex-wrap gap-[20px]">
                {resultats.map(video => (
                  <CarteVideo key={video.editionId} video={video} />
                ))}
              </Box>
            </Box>
          ) : (
            <>
              {une && (
                <LinkBox
                  accessibilityLabel={une.title}
                  onPress={() =>
                    router.push({ pathname: '/video', params: { id: une.workId } } as never)
                  }
                  className="rounded-[28px] overflow-hidden"
                  style={{ minHeight: 320 }}
                >
                  <Image
                    source={{ uri: une.thumbnailUrl }}
                    placeholder={{ blurhash: une.blurHash }}
                    contentFit="cover"
                    style={{ position: 'absolute', inset: 0 } as object}
                    accessible={false}
                  />
                  <Box
                    className="flex-1 justify-end p-[32px] gap-[12px]"
                    style={
                      {
                        backgroundImage:
                          'linear-gradient(90deg, rgba(10,15,25,0.86) 0%, rgba(10,15,25,0.55) 45%, rgba(10,15,25,0) 75%)',
                      } as object
                    }
                  >
                    <Text className="text-[white] text-[12px] font-bold uppercase tracking-[1.5px] opacity-[0.8]">
                      {t(`videos.cat.${rangees[0].categorie}.title`)}
                    </Text>
                    <Text
                      className="text-[white] text-[32px] leading-[38px] max-w-[560px]"
                      style={{ fontFamily: titre }}
                    >
                      {une.title}
                    </Text>
                    <HStack className="self-start items-center gap-[10px] rounded-full px-[20px] py-[12px] bg-[white]">
                      <FeatherIcon name="play" size={16} color="#111113" />
                      <Text className="font-bold text-[14px]" style={{ color: '#111113' }}>
                        {t('videos.watch')}
                      </Text>
                    </HStack>
                  </Box>
                </LinkBox>
              )}

              {rangees.map(({ categorie, videos }) => (
                <Box key={categorie} className="gap-[14px]">
                  <Box className="gap-[3px]">
                    <HStack className="items-baseline gap-[10px]">
                      <Text className="text-[20px]" style={{ fontFamily: titre }}>
                        {t(`videos.cat.${categorie}.title`)}
                      </Text>
                      <Text className="text-grey text-[13px]">{videos.length}</Text>
                    </HStack>
                    <Text className="text-grey text-[13px]">
                      {t(`videos.cat.${categorie}.description`)}
                    </Text>
                  </Box>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack className="gap-[18px] pb-[6px]">
                      {videos.map(video => (
                        <CarteVideo key={video.editionId} video={video} />
                      ))}
                    </HStack>
                  </ScrollView>
                </Box>
              ))}

              {/* Empreinte : les films chrétiens arrivent après le tri des sources libres
                  (domaine public, sans représentation de Jésus). */}
              <Box className="gap-[14px]">
                <Box className="gap-[3px]">
                  <Text className="text-[20px]" style={{ fontFamily: titre }}>
                    {t('videos.films.title')}
                  </Text>
                  <Text className="text-grey text-[13px]">{t('videos.films.description')}</Text>
                </Box>
                <HStack className="items-center gap-[16px] rounded-[20px] p-[20px] bg-reverse border border-border">
                  <Box className="w-[52px] h-[52px] rounded-[16px] items-center justify-center bg-light-grey">
                    <FeatherIcon name="film" size={24} color="grey" />
                  </Box>
                  <Text className="flex-1 text-grey text-[14px] leading-[21px]">
                    {t('videos.films.soon')}
                  </Text>
                </HStack>
              </Box>
            </>
          )}
          <Text className="text-tertiary text-[12px]">{t('videos.credit')}</Text>
        </Box>
      </ScrollView>
    </Box>
  )
}

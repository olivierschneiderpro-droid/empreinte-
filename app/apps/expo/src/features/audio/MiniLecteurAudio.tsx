import { useAtomValue } from 'jotai'
import { usePathname, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { arreter, basculer, etatAudioAtom, livre, suivant } from './bibleAudio'
import { Pochette } from './Pochette'

/** Empreinte Audio : la lecture continue d'une page à l'autre, avec ce petit lecteur. */
export default function MiniLecteurAudio() {
  const { t } = useTranslation()
  const etat = useAtomValue(etatAudioAtom)
  const pathname = usePathname()
  const router = useRouter()
  if (!etat.piste || pathname === '/audio') return null
  const { piste } = etat
  return (
    <Box
      className="absolute right-[24px] bottom-[24px] rounded-[20px] p-[10px] pr-[14px]"
      style={
        {
          zIndex: 900,
          backgroundColor: '#112A4D',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        } as object
      }
    >
      <HStack className="items-center gap-[12px]">
        <LinkBox
          onPress={() => router.push('/audio' as never)}
          accessibilityLabel={t('audio.title')}
        >
          <Pochette book={piste.book} chapter={piste.chapter} taille={52} />
        </LinkBox>
        <Box className="gap-[2px] min-w-[120px]">
          <Text className="text-[white] font-bold text-[14px]">{`${livre(piste.book)?.Nom} ${piste.chapter}`}</Text>
          <Text className="text-[white] text-[11px] opacity-[0.7]">{t('audio.title')}</Text>
        </Box>
        <LinkBox
          onPress={basculer}
          accessibilityLabel={etat.enLecture ? t('audio.pause') : t('audio.play')}
          className="w-[40px] h-[40px] rounded-full items-center justify-center bg-[white]"
        >
          <FeatherIcon name={etat.enLecture ? 'pause' : 'play'} size={18} color="#112A4D" />
        </LinkBox>
        <LinkBox
          onPress={suivant}
          accessibilityLabel={t('audio.next')}
          className="w-[34px] h-[34px] items-center justify-center"
        >
          <FeatherIcon name="skip-forward" size={16} color="white" />
        </LinkBox>
        <LinkBox
          onPress={arreter}
          accessibilityLabel={t('audio.stop')}
          className="w-[34px] h-[34px] items-center justify-center"
        >
          <FeatherIcon name="x" size={16} color="white" />
        </LinkBox>
      </HStack>
    </Box>
  )
}

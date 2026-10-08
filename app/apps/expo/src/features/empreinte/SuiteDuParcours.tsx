import { useAtom } from 'jotai'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { parcoursEnCoursAtom } from './compagnon'

/** Empreinte · Plan ↔ Bible : dans la Bible, revenir à l'étape du plan en un geste. */
export default function SuiteDuParcours() {
  const { t } = useTranslation()
  const router = useRouter()
  const [parcours, setParcours] = useAtom(parcoursEnCoursAtom)
  if (!parcours) return null
  return (
    <Box className="absolute left-[32px] bottom-[32px]" style={{ zIndex: 50 }}>
      <HStack
        className="items-center gap-[4px] rounded-full pl-[6px] pr-[6px] py-[6px]"
        style={{ backgroundColor: '#0F766E', boxShadow: '0 10px 28px rgba(0,0,0,0.2)' } as object}
      >
        <LinkBox
          onPress={() => {
            setParcours(null)
            router.push(parcours.retour as never)
          }}
          accessibilityLabel={t('plan.continue')}
          className="flex-row items-center gap-[8px] rounded-full px-[14px] h-[40px]"
        >
          <FeatherIcon name="arrow-left" size={16} color="white" />
          <Text className="text-[white] font-bold text-[14px]">{t('plan.continue')}</Text>
        </LinkBox>
        <LinkBox
          onPress={() => setParcours(null)}
          accessibilityLabel={t('compagnon.close')}
          className="w-[32px] h-[32px] rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.16)' }}
        >
          <FeatherIcon name="x" size={14} color="white" />
        </LinkBox>
      </HStack>
    </Box>
  )
}

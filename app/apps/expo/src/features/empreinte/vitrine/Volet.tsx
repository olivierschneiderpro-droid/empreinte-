import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { LinkBox } from '~common/Link'
import Box, { HStack, TouchableBox } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { POLICES, police, styleVerre, useVerre } from '../lumiere'

/** Un volet qui s'ouvre par-dessus la lecture (chapitres, écoute, fiche, réglages). */
export function Volet({
  titre,
  onFermer,
  children,
}: React.PropsWithChildren<{ titre: string; onFermer: () => void }>) {
  const { t } = useTranslation()
  const verre = useVerre()
  return (
    <Box className="absolute inset-0" style={{ zIndex: 20 }}>
      <TouchableBox
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(17,17,19,0.25)' }}
        onPress={onFermer}
        accessibilityLabel={t('compagnon.close')}
      />
      <Box
        className="self-center mt-[72px] w-full max-w-[720px] rounded-[26px] overflow-hidden bg-reverse"
        style={[styleVerre(verre, 26), { maxHeight: '78%' }]}
      >
        <HStack className="items-center justify-between px-[20px] pt-[16px] pb-[8px]">
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 17 }}>{titre}</Text>
          <LinkBox
            onPress={onFermer}
            accessibilityLabel={t('compagnon.close')}
            className="w-[34px] h-[34px] rounded-full items-center justify-center bg-light-grey"
          >
            <FeatherIcon name="x" size={16} />
          </LinkBox>
        </HStack>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 6 }}>
          {children}
        </ScrollView>
      </Box>
    </Box>
  )
}

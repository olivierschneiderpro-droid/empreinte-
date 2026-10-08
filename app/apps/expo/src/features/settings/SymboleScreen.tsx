import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import Header from '~common/Header'
import Box from '~common/ui/Box'
import Container from '~common/ui/Container'
import ScrollView from '~common/ui/ScrollView'
import Text from '~common/ui/Text'
import ChoixSymbole from '~features/empreinte/ChoixSymbole'
import { DessinSymbole, INFOS_SYMBOLES, symboleCompteAtom } from '~features/empreinte/SymboleCompte'

/** Empreinte : la page « Mon symbole » des réglages. */
export default function SymboleScreen() {
  const { t } = useTranslation()
  const symbole = useAtomValue(symboleCompteAtom)
  const { nom, sens } = INFOS_SYMBOLES[symbole]
  return (
    <Container>
      <Header hasBackButton title={t('symbole.title')} />
      <ScrollView>
        <Box className="p-[20px] gap-[24px] web:w-full web:max-w-[860px] web:self-center">
          <Box className="flex-row items-center gap-[20px] rounded-[24px] bg-reverse p-[20px]">
            <Box className="flex-row items-end gap-[6px]">
              {[0, 1, 2, 3].map(niveau => (
                <DessinSymbole
                  key={niveau}
                  symbole={symbole}
                  taille={30 + niveau * 10}
                  niveau={niveau}
                />
              ))}
            </Box>
            <Box className="flex-1 gap-[6px]">
              <Text className="text-[20px] font-bold">{nom}</Text>
              <Text className="text-grey text-[14px]">{sens}</Text>
              <Text className="text-tertiary text-[12px]">{t('symbole.growth')}</Text>
            </Box>
          </Box>
          <Text className="text-grey text-[14px]">{t('symbole.intro')}</Text>
          <ChoixSymbole />
        </Box>
      </ScrollView>
    </Container>
  )
}

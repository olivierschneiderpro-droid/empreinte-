import { useAtom } from 'jotai'
import Box from '~common/ui/Box'
import { LinkBox } from '~common/Link'
import Text from '~common/ui/Text'
import { DessinSymbole, INFOS_SYMBOLES, SYMBOLES, symboleCompteAtom } from './SymboleCompte'

/** Empreinte : choisir son symbole, à l'inscription comme dans les réglages. */
export default function ChoixSymbole({ compact = false }: { compact?: boolean }) {
  const [choisi, choisir] = useAtom(symboleCompteAtom)
  return (
    <Box className="flex-row flex-wrap gap-[10px]">
      {SYMBOLES.map(symbole => {
        const actif = symbole === choisi
        const { nom, sens, couleur } = INFOS_SYMBOLES[symbole]
        return (
          <LinkBox
            key={symbole}
            onPress={() => choisir(symbole)}
            accessibilityRole="radio"
            accessibilityState={{ selected: actif }}
            accessibilityLabel={`${nom} : ${sens}`}
            className={
              compact
                ? 'items-center gap-[6px] rounded-[14px] p-[8px] w-[76px]'
                : 'flex-row items-center gap-[12px] rounded-[16px] p-[12px] w-[260px]'
            }
            style={{
              borderWidth: 2,
              borderColor: actif ? couleur : 'transparent',
              backgroundColor: actif ? `${couleur}0F` : undefined,
            }}
          >
            <DessinSymbole symbole={symbole} taille={compact ? 40 : 48} niveau={2} />
            <Box className={compact ? 'items-center' : 'flex-1 gap-[3px]'}>
              <Text
                className={compact ? 'text-[11px] font-bold text-center' : 'text-[14px] font-bold'}
                numberOfLines={1}
              >
                {nom}
              </Text>
              {!compact && (
                <Text className="text-grey text-[12px]" numberOfLines={2}>
                  {sens}
                </Text>
              )}
            </Box>
          </LinkBox>
        )
      })}
    </Box>
  )
}

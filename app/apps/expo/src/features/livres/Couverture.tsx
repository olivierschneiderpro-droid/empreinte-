import Box from '~common/ui/Box'
import Text from '~common/ui/Text'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import type { FicheLivre } from './livres'

/** Une couleur par thème : la couverture se reconnaît sans image. */
export const COULEURS_THEMES: Record<string, [string, string]> = {
  'vie-interieure': ['#1E3A5F', '#3B6EA5'],
  priere: ['#3F2A56', '#7A5AA6'],
  evangile: ['#7A2E12', '#C2410C'],
  temoignage: ['#14532D', '#2F855A'],
  recit: ['#5B3A1A', '#A86B2D'],
  apologetique: ['#1F2937', '#4B5563'],
}

/**
 * La couverture d'un livre, dessinée en typographie (pas d'illustration : rien ne
 * représente le Christ, et l'on ne dépend d'aucune image extérieure).
 */
export function Couverture({ livre, largeur = 150 }: { livre: FicheLivre; largeur?: number }) {
  const theme = useTheme()
  const [fonce, clair] = COULEURS_THEMES[livre.theme] ?? COULEURS_THEMES.apologetique
  const petit = largeur < 100
  return (
    <Box
      className="rounded-[14px] overflow-hidden justify-between"
      style={
        {
          width: largeur,
          height: largeur * 1.45,
          padding: petit ? 8 : 14,
          backgroundImage: `linear-gradient(160deg, ${clair}, ${fonce})`,
          backgroundColor: fonce,
          boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        } as object
      }
    >
      <Box className="h-[2px] w-[28px] bg-[white] opacity-[0.6]" />
      <Text
        className="text-[white]"
        numberOfLines={petit ? 3 : 5}
        style={{
          fontFamily: resolveFontFamily(theme.fontFamily.title),
          fontSize: petit ? 11 : Math.round(largeur / 8.5),
          lineHeight: petit ? 14 : Math.round(largeur / 6.8),
        }}
      >
        {livre.titre}
      </Text>
      {petit ? null : (
        <Text className="text-[white] text-[11px] opacity-[0.8]" numberOfLines={2}>
          {livre.auteur}
        </Text>
      )}
    </Box>
  )
}

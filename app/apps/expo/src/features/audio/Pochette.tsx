import { sections } from '~assets/bible_versions/books-desc'
import Box from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { familleDuLivre, livre } from './bibleAudio'

const COULEURS_FAMILLES = [
  '#0F766E',
  '#1D4ED8',
  '#7C3AED',
  '#A16207',
  '#BE123C',
  '#15803D',
  '#C2410C',
  '#334155',
]

const couleurDuLivre = (numero: number) => {
  const index = sections.findIndex(section => section.data.some(book => book.Numero === numero))
  return COULEURS_FAMILLES[Math.max(0, index) % COULEURS_FAMILLES.length]
}

/** La « pochette » d'un chapitre : la couleur de sa famille de livres et son nom. */
export function Pochette({
  book,
  chapter,
  taille = 220,
}: {
  book: number
  chapter?: number
  taille?: number
}) {
  const theme = useTheme()
  const couleur = couleurDuLivre(book)
  const petite = taille < 90
  return (
    <Box
      className={
        petite
          ? 'rounded-[14px] overflow-hidden items-center justify-center'
          : 'rounded-[22px] overflow-hidden justify-end p-[18px]'
      }
      style={
        {
          width: taille,
          height: taille,
          backgroundImage: `linear-gradient(150deg, ${couleur} 0%, ${couleur}CC 55%, #0c1f3a 100%)`,
        } as object
      }
    >
      {petite ? (
        <FeatherIcon name="headphones" size={Math.round(taille * 0.42)} color="white" />
      ) : (
        <>
          <Text className="text-[white] text-[11px] font-bold uppercase tracking-[1.5px] opacity-[0.8]">
            {familleDuLivre(book)}
          </Text>
          <Text
            className="text-[white]"
            style={{
              fontFamily: resolveFontFamily(theme.fontFamily.title),
              fontSize: taille > 120 ? 30 : 15,
            }}
            numberOfLines={2}
          >
            {livre(book)?.Nom}
            {chapter ? ` ${chapter}` : ''}
          </Text>
        </>
      )}
    </Box>
  )
}

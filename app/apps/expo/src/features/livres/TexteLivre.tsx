import { useSelector } from 'react-redux'
import Box from '~common/ui/Box'
import Text from '~common/ui/Text'
import { POLICES, police } from '~features/empreinte/lumiere'
import type { RootState } from '~redux/modules/reducer'

const INTERLIGNE = { small: 0.8, normal: 1.1, large: 1.4 } as const

/**
 * Les réglages de lecture de la Bible (taille, interligne, police) : un livre se lit avec
 * exactement la même typographie, et « Aa » règle les deux à la fois.
 */
export const useTypographieBible = () => {
  const { fontSizeScale, lineHeight, fontFamily } = useSelector(
    (state: RootState) => state.user.bible.settings
  )
  const echelle = 1 + fontSizeScale * 0.1
  return {
    taille: 19 * echelle,
    interligne: Math.round(32 * echelle * INTERLIGNE[lineHeight ?? 'normal']),
    numero: 10.5 * echelle,
    police: police(fontFamily || POLICES.lecture),
  }
}

/**
 * Le texte d'une partie, au format de la Bible : chaque paragraphe porte un petit numéro
 * en exposant, comme un verset, dans la police et la colonne de lecture de la Bible.
 */
export default function TexteLivre({
  titre,
  paragraphes,
}: {
  titre: string
  paragraphes: string[]
}) {
  const typo = useTypographieBible()
  return (
    <Box className="gap-[14px]">
      <Text
        className="mb-[6px]"
        style={{ fontFamily: police(POLICES.titre), fontSize: 22, lineHeight: 28 }}
      >
        {titre}
      </Text>
      {paragraphes.map((paragraphe, n) => (
        <Text
          key={n}
          style={{ fontFamily: typo.police, fontSize: typo.taille, lineHeight: typo.interligne }}
        >
          <Text
            className="text-grey"
            style={{
              fontFamily: police(POLICES.monoMoyen),
              fontSize: typo.numero,
              verticalAlign: 'top',
            }}
          >
            {`${n + 1} `}
          </Text>
          {paragraphe}
        </Text>
      ))}
    </Box>
  )
}

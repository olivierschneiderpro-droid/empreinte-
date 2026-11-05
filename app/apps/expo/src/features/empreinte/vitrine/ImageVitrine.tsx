import { useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import Box from '~common/ui/Box'
import Text from '~common/ui/Text'
import { Illustration, type DefIllustration } from './Illustration'
import { adressePhoto, type Photo } from './photos'

/**
 * Empreinte · L'image d'une carte de vitrine : la photo quand elle est là, sinon (hors ligne,
 * photo introuvable) l'illustration dessinée, pour qu'une carte ne reste jamais vide.
 */
export function ImageVitrine({
  photo,
  secours,
  largeur,
  hauteur,
  avecCredit,
}: {
  photo?: Photo
  secours: DefIllustration
  largeur: number
  hauteur: number
  /** Écrit l'auteur de la photo dans le coin (grande carte). */
  avecCredit?: boolean
}) {
  // L'échec retient la photo en cause : une autre photo (autre livre) retente sa chance.
  const [echec, setEchec] = useState<string | null>(null)
  if (!photo || echec === photo.photo) return <Illustration def={secours} />
  return (
    <Box className="absolute inset-0" style={{ backgroundColor: '#1b2233' }}>
      <Image
        source={{ uri: adressePhoto(photo, largeur, hauteur) }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onError={() => setEchec(photo.photo)}
        accessibilityIgnoresInvertColors
      />
      {avecCredit ? (
        <Text
          className="absolute bottom-[8px] right-[14px] text-[10px] opacity-[0.7]"
          style={{ color: 'white', zIndex: 1 }}
        >
          {`Photo · ${photo.auteur} · Unsplash`}
        </Text>
      ) : null}
    </Box>
  )
}

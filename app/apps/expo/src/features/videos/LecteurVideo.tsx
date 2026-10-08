import { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import Box from '~common/ui/Box'
import YoutubePlayer from '~helpers/react-native-youtube-iframe'

/** Empreinte (mobile) : le lecteur YouTube ; il s'arrête quand l'écran se ferme. */
export default function LecteurVideo({
  idYoutube,
  autoplay = true,
}: {
  idYoutube: string
  titre: string
  autoplay?: boolean
}) {
  const { width } = useWindowDimensions()
  const [largeur, setLargeur] = useState(Math.min(width - 32, 960))
  return (
    <Box
      className="w-full rounded-[20px] overflow-hidden bg-black"
      onLayout={event => setLargeur(event.nativeEvent.layout.width)}
    >
      <YoutubePlayer
        key={idYoutube}
        height={(largeur * 9) / 16}
        width={largeur}
        videoId={idYoutube}
        play={autoplay}
        initialPlayerParams={{ rel: false }}
      />
    </Box>
  )
}

import { useIsFocused } from 'expo-router'

/**
 * Empreinte (web) : le lecteur YouTube intégré. La vidéo vit dans ce cadre : quand la page
 * se ferme ou que l'on change de vidéo, le cadre disparaît et la lecture s'arrête vraiment.
 */
export default function LecteurVideo({
  idYoutube,
  titre,
  autoplay = true,
}: {
  idYoutube: string
  titre: string
  autoplay?: boolean
}) {
  // La page reste en mémoire quand on navigue ailleurs : le lecteur, lui, disparaît.
  const visible = useIsFocused()
  const parametres = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {visible ? (
        <iframe
          key={idYoutube}
          title={titre}
          src={`https://www.youtube-nocookie.com/embed/${idYoutube}?${parametres}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : null}
    </div>
  )
}

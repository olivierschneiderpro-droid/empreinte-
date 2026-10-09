import { useIsFocused } from 'expo-router'

/**
 * Empreinte (web) : le lecteur YouTube intégré. La vidéo vit dans ce cadre : quand la page
 * se ferme ou que l'on change de vidéo, le cadre disparaît et la lecture s'arrête vraiment.
 */
type Props = { idYoutube: string; titre: string; autoplay?: boolean }

export default function LecteurVideo(props: Props) {
  // La page reste en mémoire quand on navigue ailleurs : le lecteur, lui, disparaît.
  const visible = useIsFocused()
  return <CadreYoutube {...props} visible={visible} />
}

/** Le cadre seul, utilisable hors d'une page (panneau à côté de la Bible). */
export function CadreYoutube({
  idYoutube,
  titre,
  autoplay = true,
  visible = true,
}: Props & { visible?: boolean }) {
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

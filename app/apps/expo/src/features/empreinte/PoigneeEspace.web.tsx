import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { LARGEUR_ESPACE, largeurEspaceAtom } from './compagnon'

/**
 * Empreinte · La poignée entre la Bible et l'Espace d'étude : on la tire pour donner plus
 * ou moins de place à l'un ou à l'autre (de 30 à 60 %). La largeur est retenue.
 */
export default function PoigneeEspace({ aGauche }: { aGauche: boolean }) {
  const { t } = useTranslation()
  const [largeur, setLargeur] = useAtom(largeurEspaceAtom)
  const pourcent = `${largeur * 100}%`

  const commencer = (event: React.PointerEvent<HTMLDivElement>) => {
    const poignee = event.currentTarget
    const cadre = poignee.parentElement?.getBoundingClientRect()
    if (!cadre) return
    // La capture garde le glissement même au-dessus d'une vidéo (iframe).
    poignee.setPointerCapture(event.pointerId)
    const suivre = (mouvement: PointerEvent) => {
      const part = aGauche
        ? (mouvement.clientX - cadre.left) / cadre.width
        : (cadre.right - mouvement.clientX) / cadre.width
      setLargeur(Math.min(LARGEUR_ESPACE.max, Math.max(LARGEUR_ESPACE.min, part)))
    }
    const finir = () => {
      poignee.removeEventListener('pointermove', suivre)
      poignee.removeEventListener('pointerup', finir)
      document.body.style.userSelect = ''
    }
    document.body.style.userSelect = 'none'
    poignee.addEventListener('pointermove', suivre)
    poignee.addEventListener('pointerup', finir)
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={t('espace.resize')}
      title={t('espace.resize')}
      onPointerDown={commencer}
      onDoubleClick={() => setLargeur(LARGEUR_ESPACE.defaut)}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [aGauche ? 'left' : 'right']: `calc(${pourcent} - 8px)`,
        width: 16,
        height: 96,
        cursor: 'col-resize',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
      }}
    >
      <div
        style={{
          width: 5,
          height: 56,
          borderRadius: 3,
          background: 'var(--color-grey, #9a9aa0)',
          opacity: 0.45,
        }}
      />
    </div>
  )
}

import { usePathname, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { useWebAuthStatus } from '~features/app/useWebAuthStatus'
import { PAGES_SANS_COQUE, aChoisiInvite, exigeCompte } from './compte'

/**
 * Empreinte : à l'arrivée, on passe d'abord par la page de connexion (sauf si l'on a
 * déjà choisi de continuer en invité) ; et toute page qui demande un compte y mène, puis
 * revient exactement là où l'on voulait aller.
 */
export default function PorteDeConnexion() {
  const pathname = usePathname()
  const router = useRouter()
  const statut = useWebAuthStatus()
  const premiereVisite = useRef(true)

  useEffect(() => {
    if (statut !== 'guest') return
    if (PAGES_SANS_COQUE.includes(pathname)) {
      premiereVisite.current = false
      return
    }
    const retour = `${pathname}${typeof window !== 'undefined' ? window.location.search : ''}`
    if (exigeCompte(pathname)) {
      router.replace({ pathname: '/login', params: { retour, raison: 'compte' } })
    } else if (premiereVisite.current && !aChoisiInvite()) {
      router.replace({ pathname: '/login', params: { retour } })
    }
    premiereVisite.current = false
  }, [statut, pathname, router])

  return null
}

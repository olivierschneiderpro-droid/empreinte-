import { Platform, useWindowDimensions } from 'react-native'
import { useWorkspaceRoutePanel } from '~navigation/useWorkspaceRoutePanel'

/**
 * Empreinte : en-tête « bureau » (web, écran large, page principale) — le titre à côté du
 * retour, la recherche de la page et le bouton Onglets sur la même ligne. Le panneau étroit
 * ouvert à côté de la Bible garde l'en-tête compact.
 */
export const useEnteteBureau = () => {
  const { width } = useWindowDimensions()
  const { showsStudy } = useWorkspaceRoutePanel()
  return Platform.OS === 'web' && width >= 900 && !showsStudy
}

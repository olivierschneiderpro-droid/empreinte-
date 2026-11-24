import { useWindowDimensions } from 'react-native'

// Deux interfaces : en dessous de 1024 px, téléphone et tablette partagent l'interface mobile
// (barre flottante en bas) ; à partir de 1024 px, l'interface desktop (barre latérale).
export const WORKSPACE_SIDEBAR_BREAKPOINT = 1024
export const WORKSPACE_SIDEBAR_WIDTH = 260

export const useResponsiveWorkspace = () =>
  useWindowDimensions().width >= WORKSPACE_SIDEBAR_BREAKPOINT

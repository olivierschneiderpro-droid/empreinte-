import React, { createContext, useContext } from 'react'
import { TabContextType } from './type'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useResponsiveWorkspace } from '../utils/useResponsiveWorkspace'
import { FLOATING_BAR_BOTTOM, FLOATING_BAR_HEIGHT } from '../utils/constants'

const TabContext = createContext<TabContextType>({
  isInTab: false,
})

export const TabContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <TabContext.Provider value={{ isInTab: true }}>{children}</TabContext.Provider>
}

export const useTabContext = () => {
  return useContext(TabContext)
}

export const useBottomBarHeightInTab = () => {
  const insets = useSafeAreaInsets()
  const { isInTab } = useTabContext()
  const isWide = useResponsiveWorkspace()
  const bottomBarHeight =
    isInTab && !isWide
      ? FLOATING_BAR_HEIGHT + FLOATING_BAR_BOTTOM + 8 + insets.bottom
      : insets.bottom

  return { bottomBarHeight }
}

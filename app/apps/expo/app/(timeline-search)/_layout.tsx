import { Platform } from 'react-native'
import { useTheme } from '~themes/ThemeProvider'
import { Stack } from 'expo-router'
import ModalRouteFrame from '~navigation/ModalRouteFrame'
const TimelineSearchLayout = () => {
  const theme = useTheme()

  return (
    <ModalRouteFrame>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            // Empreinte : sur le web, le fond uniforme de l'espace de travail reste visible.
            backgroundColor: Platform.OS === 'web' ? 'transparent' : theme.colors.reverse,
          },
        }}
      >
        <Stack.Screen name="timeline-search" />
      </Stack>
    </ModalRouteFrame>
  )
}

export default TimelineSearchLayout

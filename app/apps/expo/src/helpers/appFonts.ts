import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

// The browser must load the same bundled faces as the native app before showing its UI.
export const appFonts = {
  ...Feather.font,
  ...Ionicons.font,
  ...MaterialIcons.font,
  ...MaterialCommunityIcons.font,
  'Literata Book': require('~assets/fonts/LiterataBook-Regular.otf'),
  'eina-03-bold': require('~assets/fonts/eina-03-bold.otf'),
  FiraCode: require('~assets/fonts/FiraCode-Regular.otf'),
  // Empreinte
  Geist: require('~assets/fonts/Geist_400Regular.ttf'),
  'Geist Medium': require('~assets/fonts/Geist_500Medium.ttf'),
  'Geist SemiBold': require('~assets/fonts/Geist_600SemiBold.ttf'),
  'Geist Bold': require('~assets/fonts/Geist_700Bold.ttf'),
  'Geist Mono': require('~assets/fonts/GeistMono_400Regular.ttf'),
  'Geist Mono Medium': require('~assets/fonts/GeistMono_500Medium.ttf'),
  Doto: require('~assets/fonts/Doto_900Black.ttf'),
}

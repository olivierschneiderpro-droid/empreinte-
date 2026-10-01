import { Platform } from 'react-native'
const theme = {
  measures: {
    headerHeight: 60,
    headerMarginTop: Platform.OS === 'ios' ? 0 : 25,
    maxWidth: 320,
    paddingBottom: 30,
  },
  fontFamily: {
    // Empreinte : Geist pour l'interface (eina-03-bold reste chargée).
    text: 'Geist',
    title: 'Geist SemiBold',
    titleItalic: Platform.OS === 'ios' ? 'System' : 'normal',
    paragraph: Platform.OS === 'ios' ? 'System' : 'normal',
  },
}

export default theme

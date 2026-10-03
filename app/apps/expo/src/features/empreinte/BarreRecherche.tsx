import React from 'react'
import { Platform, Pressable, Text } from 'react-native'
import { useSetAtom } from 'jotai/react'
import { useTranslation } from 'react-i18next'
import {
  commandPaletteOpenAtom,
  commandPaletteReturnFocusAtom,
} from '~features/app-switcher/commandPalette/state'
import { useTheme } from '~themes/ThemeProvider'
import { Icone } from './icones'
import { POLICES, police, styleVerre, useVerre } from './lumiere'

/** Empreinte : la barre de recherche, identique sur toutes les pages (comme sur l'accueil). */
export default function BarreRecherche() {
  const { t } = useTranslation()
  const theme = useTheme()
  const verre = useVerre()
  const ouvrir = useSetAtom(commandPaletteOpenAtom)
  const setRetour = useSetAtom(commandPaletteReturnFocusAtom)
  const mac =
    Platform.OS === 'web' &&
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/.test(navigator.platform)
  return (
    <Pressable
      testID="barre-recherche"
      accessibilityRole="button"
      accessibilityLabel={t('commandPalette.label')}
      onPress={event => {
        const cible = (event as unknown as { currentTarget?: unknown }).currentTarget
        if (typeof HTMLElement !== 'undefined' && cible instanceof HTMLElement) setRetour(cible)
        ouvrir(true)
      }}
      style={[
        styleVerre(verre, 20),
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          height: 48,
          paddingHorizontal: 18,
          width: '100%',
          maxWidth: 560,
        },
      ]}
    >
      <Icone nom="search" taille={18} couleur={theme.colors.grey} />
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontFamily: police(POLICES.texte),
          fontSize: 14.5,
          color: theme.colors.grey,
        }}
      >
        {t('home.dashboard.search')}
      </Text>
      <Text style={{ fontFamily: police(POLICES.mono), fontSize: 11.5, color: theme.colors.grey }}>
        {mac ? '⌘ K' : 'Ctrl K'}
      </Text>
    </Pressable>
  )
}

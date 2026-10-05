import React, { useState } from 'react'
import { Platform, Pressable, Text, TextInput, View } from 'react-native'
import { useSetAtom } from 'jotai/react'
import { usePathname } from 'expo-router'
import {
  commandPaletteOpenAtom,
  commandPaletteQueryAtom,
  commandPaletteScopeAtom,
} from '~features/app-switcher/commandPalette/state'
import { useTheme } from '~themes/ThemeProvider'
import { contexteRecherche } from './contexteRecherche'
import { Icone } from './icones'
import { POLICES, police, styleVerre, useVerre } from './lumiere'

/**
 * Empreinte : la barre de recherche des pages, dans leur en-tête. Elle est propre à chaque
 * page (versets dans la Bible, plans dans Plans…) : dès qu'on tape, la recherche s'ouvre
 * sur le bon périmètre avec le texte déjà saisi.
 */
export default function BarreRecherche({
  onFermer,
  autoFocus = false,
}: {
  /** Barre dépliée depuis un bouton (Bible) : la croix la replie. */
  onFermer?: () => void
  autoFocus?: boolean
}) {
  const theme = useTheme()
  const verre = useVerre()
  const chemin = usePathname()
  const { scope, invite } = contexteRecherche(chemin)
  const ouvrir = useSetAtom(commandPaletteOpenAtom)
  const setPerimetre = useSetAtom(commandPaletteScopeAtom)
  const setTexte = useSetAtom(commandPaletteQueryAtom)
  const [saisie, setSaisie] = useState('')
  const mac =
    Platform.OS === 'web' &&
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/.test(navigator.platform)

  const lancer = (texte: string) => {
    setPerimetre(scope)
    setTexte(texte)
    ouvrir(true)
    setSaisie('')
  }

  return (
    <View
      testID="barre-recherche"
      // Le contour de focus entoure la barre entière, pas le champ seul.
      {...({ dataSet: { focusGroup: 'true' } } as object)}
      style={[
        styleVerre(verre, 20, false),
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          height: 44,
          paddingLeft: 16,
          paddingRight: onFermer ? 4 : 14,
          flex: 1,
          minWidth: 0,
          maxWidth: onFermer ? undefined : 520,
          // Dépliée dans le panneau blanc de la Bible, la barre garde un fond visible.
          ...(onFermer ? { backgroundColor: verre.actif, borderColor: verre.ligne } : null),
        },
      ]}
    >
      <Icone nom="search" taille={17} couleur={theme.colors.grey} />
      <TextInput
        value={saisie}
        autoFocus={autoFocus}
        onChangeText={texte => (texte ? lancer(texte) : setSaisie(texte))}
        onSubmitEditing={() => lancer(saisie)}
        onFocus={() => {
          // Un clic sur une barre vide ouvre aussi la recherche de la page.
          if (!autoFocus) lancer('')
        }}
        placeholder={invite}
        placeholderTextColor={theme.colors.grey}
        accessibilityLabel={invite}
        style={
          {
            flex: 1,
            minWidth: 0,
            fontFamily: police(POLICES.texte),
            fontSize: 14.5,
            color: theme.colors.default,
            outlineStyle: 'none',
            outlineWidth: 0,
          } as object
        }
      />
      {onFermer ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer la recherche"
          onPress={onFermer}
          style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icone nom="x" taille={16} couleur={theme.colors.grey} />
        </Pressable>
      ) : (
        <Text
          style={{ fontFamily: police(POLICES.mono), fontSize: 11.5, color: theme.colors.grey }}
        >
          {mac ? '⌘ K' : 'Ctrl K'}
        </Text>
      )}
    </View>
  )
}

/** Le bouton loupe qui déplie la barre (en-tête de la Bible). */
export function BoutonRecherche({ onPress }: { onPress: () => void }) {
  const verre = useVerre()
  return (
    <Pressable
      testID="bouton-recherche"
      accessibilityRole="button"
      accessibilityLabel="Rechercher"
      onPress={onPress}
      style={[
        styleVerre(verre, 22),
        { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Icone nom="search" taille={18} />
    </Pressable>
  )
}

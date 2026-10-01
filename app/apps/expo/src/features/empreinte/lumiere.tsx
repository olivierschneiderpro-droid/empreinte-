import React from 'react'
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import Text from '~common/ui/Text'
import { useTheme } from '~themes/ThemeProvider'

/** Polices d'Empreinte (chargées dans helpers/appFonts.ts). */
export const POLICES = {
  texte: 'Geist',
  moyen: 'Geist Medium',
  titre: 'Geist SemiBold',
  mono: 'Geist Mono',
  monoMoyen: 'Geist Mono Medium',
  points: 'Doto',
  lecture: 'Literata Book',
} as const

const police = (nom: string) => (Platform.OS === 'web' ? `"${nom}", system-ui, sans-serif` : nom)

/** Empreinte digitale : des lignes de crête concentriques, ouvertes en bas. */
export function LogoEmpreinte({ taille = 28, couleur }: { taille?: number; couleur?: string }) {
  const theme = useTheme()
  const c = couleur ?? theme.colors.default
  const cretes = [
    'M12 4.2c4.3 0 7.8 3.5 7.8 7.8v1.6',
    'M4.2 15.2V12c0-4.3 3.5-7.8 7.8-7.8',
    'M12 7.2c2.7 0 4.8 2.1 4.8 4.8v3.4c0 1.6.4 3.1 1.1 4.4',
    'M7.2 18.6c-.3-1-.4-2-.4-3.1V12c0-2.7 2.1-4.8 4.8-4.8',
    'M12 10.2c1 0 1.8.8 1.8 1.8v3.6c0 2 .6 3.9 1.6 5.4',
    'M10.2 12v3.6c0 2.3-.5 4.1-1.4 5.6',
  ]
  return (
    <Svg width={taille} height={taille} viewBox="0 0 24 24" fill="none">
      {cretes.map(d => (
        <Path key={d} d={d} stroke={c} strokeWidth={1.4} strokeLinecap="round" />
      ))}
    </Svg>
  )
}

export function Marque({ taille = 22 }: { taille?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <LogoEmpreinte taille={taille + 4} />
      <Text style={{ fontFamily: police(POLICES.titre), fontSize: taille, letterSpacing: -0.4 }}>
        Empreinte
      </Text>
    </View>
  )
}

/** Surface de verre gris léger : fond translucide, filet clair, ombre très douce. */
export function Verre({
  children,
  style,
  ecart = false,
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle>; ecart?: boolean }>) {
  const theme = useTheme()
  return (
    <View
      style={[
        styles.verre,
        {
          backgroundColor: theme.colors.reverse,
          borderColor: ecart ? theme.colors.quart : theme.colors.border,
        },
        Platform.OS === 'web' ? ({ backdropFilter: 'blur(18px)' } as ViewStyle) : null,
        style,
      ]}
    >
      {children}
    </View>
  )
}

/** Chiffres en matrice de points (Doto). */
export function Points({
  children,
  taille = 40,
  couleur,
}: {
  children: React.ReactNode
  taille?: number
  couleur?: string
}) {
  const theme = useTheme()
  return (
    <Text
      style={{
        fontFamily: police(POLICES.points),
        fontSize: taille,
        lineHeight: taille * 1.05,
        color: couleur ?? theme.colors.default,
        letterSpacing: 1,
      }}
    >
      {children}
    </Text>
  )
}

/** Petite capitale grise au-dessus d'un bloc. */
export function Surtitre({ children, couleur }: { children: React.ReactNode; couleur?: string }) {
  const theme = useTheme()
  return (
    <Text
      style={{
        fontFamily: police(POLICES.monoMoyen),
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: couleur ?? theme.colors.grey,
      }}
    >
      {children}
    </Text>
  )
}

export function Mono({
  children,
  taille = 13,
  couleur,
}: {
  children: React.ReactNode
  taille?: number
  couleur?: string
}) {
  const theme = useTheme()
  return (
    <Text
      style={{
        fontFamily: police(POLICES.mono),
        fontSize: taille,
        color: couleur ?? theme.colors.default,
      }}
    >
      {children}
    </Text>
  )
}

export function Titre({ children, taille = 28 }: { children: React.ReactNode; taille?: number }) {
  return (
    <Text
      style={{
        fontFamily: police(POLICES.titre),
        fontSize: taille,
        letterSpacing: -0.6,
        lineHeight: taille * 1.15,
      }}
    >
      {children}
    </Text>
  )
}

export function Corps({
  children,
  couleur,
  taille = 15,
  lignes,
}: {
  children: React.ReactNode
  couleur?: string
  taille?: number
  lignes?: number
}) {
  const theme = useTheme()
  return (
    <Text
      numberOfLines={lignes}
      style={{
        fontFamily: police(POLICES.texte),
        fontSize: taille,
        lineHeight: taille * 1.45,
        color: couleur ?? theme.colors.default,
      }}
    >
      {children}
    </Text>
  )
}

/** Pastille : état, genre, type de manifestation. Rouge uniquement pour un écart. */
export function Pastille({
  children,
  ecart = false,
}: {
  children: React.ReactNode
  ecart?: boolean
}) {
  const theme = useTheme()
  return (
    <View
      style={{
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 99,
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderColor: ecart ? theme.colors.quart : theme.colors.border,
        backgroundColor: ecart ? 'transparent' : theme.colors.lightGrey,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          fontFamily: police(POLICES.monoMoyen),
          fontSize: 11,
          color: ecart ? theme.colors.quart : theme.colors.tertiary,
        }}
      >
        {children}
      </Text>
    </View>
  )
}

/** Barre de confiance d'une manifestation (0 → 1). */
export function Confiance({ valeur }: { valeur: number }) {
  const theme = useTheme()
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <View
          key={i}
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor:
              i < Math.round(valeur * 10) ? theme.colors.default : theme.colors.border,
          }}
        />
      ))}
    </View>
  )
}

export function Separateur() {
  const theme = useTheme()
  return (
    <View style={{ height: StyleSheet.hairlineWidth * 2, backgroundColor: theme.colors.border }} />
  )
}

const styles = StyleSheet.create({
  verre: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#111113',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
})

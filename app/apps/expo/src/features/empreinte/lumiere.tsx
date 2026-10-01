import React from 'react'
import { Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icone, type NomIcone } from './icones'
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg'
import { colorWithOpacity } from '~themes/colorValues'
import Text from '~common/ui/Text'
import { useTheme } from '~themes/ThemeProvider'

/** Polices d'Empreinte (chargées dans helpers/appFonts.ts). */
export const POLICES = {
  texte: 'Geist',
  moyen: 'Geist Medium',
  titre: 'Geist SemiBold',
  gras: 'Geist Bold',
  mono: 'Geist Mono',
  monoMoyen: 'Geist Mono Medium',
  points: 'Doto',
  lecture: 'Literata Book',
} as const

export const police = (nom: string) =>
  Platform.OS === 'web' ? `"${nom}", system-ui, sans-serif` : nom

/** Empreinte digitale de la maquette : trois crêtes ouvertes vers le bas. */
export function LogoEmpreinte({ taille = 22, couleur }: { taille?: number; couleur?: string }) {
  const theme = useTheme()
  const c = couleur ?? theme.colors.default
  return (
    <Svg width={taille} height={taille} viewBox="0 0 32 32" fill="none">
      <Path
        d="M8 25c-2-2.6-3-5.6-3-9a11 11 0 0 1 22 0"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M12 27c-1.6-2.4-2.6-5.6-2.6-9.6a6.6 6.6 0 0 1 13.2 0c0 3-.5 5.6-1.6 8"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M16 28c-1-2.6-1.8-6.2-1.8-10.6a1.8 1.8 0 0 1 3.6 0c0 3.4-.2 6-.8 8.6"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  )
}

/** « empreinte » en minuscules, Geist 700, comme dans la maquette. */
export function Marque({ taille = 18 }: { taille?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <LogoEmpreinte taille={taille + 4} />
      <Text style={{ fontFamily: police(POLICES.gras), fontSize: taille, letterSpacing: -0.36 }}>
        empreinte
      </Text>
    </View>
  )
}

/** Couleurs du verre, dérivées du thème pour rester lisibles en sombre. */
export function useVerre() {
  const theme = useTheme()
  return {
    fond: colorWithOpacity(theme.colors.reverse, 0.62),
    filet: colorWithOpacity(theme.colors.reverse, 0.9),
    ligne: colorWithOpacity(theme.colors.default, 0.07),
    doux: colorWithOpacity(theme.colors.default, 0.05),
    actif: colorWithOpacity(theme.colors.default, 0.07),
  }
}

/** Style de verre de la maquette (.g) : blanc à 62 %, filet blanc, ombre très douce. */
export function styleVerre(v: ReturnType<typeof useVerre>, rayon = 24, ombre = true): ViewStyle {
  return {
    backgroundColor: v.fond,
    borderColor: v.filet,
    borderWidth: 1,
    borderRadius: rayon,
    ...(ombre
      ? {
          shadowColor: '#111113',
          shadowOpacity: 0.06,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
        }
      : null),
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(22px) saturate(120%)' } as ViewStyle)
      : null),
  }
}

/** Surface de verre. `ecart` ajoute le filet rouge réservé aux écarts. */
export function Verre({
  children,
  style,
  ecart = false,
  rayon = 24,
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle>; ecart?: boolean; rayon?: number }>) {
  const theme = useTheme()
  const v = useVerre()
  return (
    <View
      style={[
        styleVerre(v, rayon),
        { padding: 18 },
        ecart ? { borderColor: colorWithOpacity(theme.colors.quart, 0.45) } : null,
        style,
      ]}
    >
      {children}
    </View>
  )
}

/** Halos de l'aurore : quatre taches grises très douces derrière le verre. */
export function Aurore() {
  const theme = useTheme()
  const taches = [
    { x: -170, y: -140, t: 420, c: '#E3E2DE' },
    { x: 'droite', y: 60, t: 380, c: '#DCDFE3' },
    { x: -120, y: 420, t: 420, c: '#E6E2DC' },
    { x: 'droite', y: 'bas', t: 380, c: '#DEE2E0' },
  ] as const
  if (theme.colors.reverse !== 'rgb(255,255,255)') return null
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {taches.map((tache, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: tache.t,
            height: tache.t,
            ...(tache.x === 'droite' ? { right: -170 } : { left: tache.x }),
            ...(tache.y === 'bas' ? { bottom: -120 } : { top: tache.y }),
          }}
        >
          <Svg width={tache.t} height={tache.t}>
            <Defs>
              <RadialGradient id={`a${i}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={tache.c} stopOpacity={1} />
                <Stop offset="0.68" stopColor={tache.c} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={tache.t / 2} cy={tache.t / 2} r={tache.t / 2} fill={`url(#a${i})`} />
          </Svg>
        </View>
      ))}
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
  return <Pilule ton={ecart ? 'rouge' : 'neutre'}>{children}</Pilule>
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

/** Barre du haut de la maquette : retour rond en verre, élément central, action ronde. */
export function BarreHaut({
  centre,
  droite,
  retour = true,
}: {
  centre?: React.ReactNode
  droite?: React.ReactNode
  retour?: boolean
}) {
  const v = useVerre()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 16,
        paddingBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {retour ? (
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={[
            styleVerre(v, 22),
            { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
          ]}
        >
          <Icone nom="back" taille={20} />
        </Pressable>
      ) : (
        <View style={{ width: 44 }} />
      )}
      <View style={{ flex: 1, alignItems: 'center' }}>{centre}</View>
      {droite ?? <View style={{ width: 44 }} />}
    </View>
  )
}

/** Bouton rond en verre (44 px) avec une icône de la maquette. */
export function BoutonRond({
  icone,
  onPress,
  libelle,
}: {
  icone: NomIcone
  onPress: () => void
  libelle: string
}) {
  const v = useVerre()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={libelle}
      style={[
        styleVerre(v, 22),
        { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Icone nom={icone} taille={20} />
    </Pressable>
  )
}

/** Pastille (.pill) : neutre, noire (active), rouge (écart) ou verte. */
export function Pilule({
  children,
  ton = 'neutre',
  onPress,
}: {
  children: React.ReactNode
  ton?: 'neutre' | 'actif' | 'rouge' | 'vert' | 'verre'
  onPress?: () => void
}) {
  const theme = useTheme()
  const v = useVerre()
  const fonds = {
    neutre: colorWithOpacity(theme.colors.default, 0.06),
    actif: theme.colors.default,
    rouge: colorWithOpacity(theme.colors.quart, 0.1),
    vert: colorWithOpacity(theme.colors.success, 0.12),
    verre: v.fond,
  }
  const textes = {
    neutre: theme.colors.default,
    actif: theme.colors.reverse,
    rouge: theme.colors.quart,
    vert: '#3F6A53',
    verre: theme.colors.default,
  }
  const contenu = (
    <View
      style={[
        ton === 'verre' ? styleVerre(v, 15, false) : null,
        {
          height: 30,
          paddingHorizontal: 12,
          borderRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: fonds[ton],
        },
      ]}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={{ fontFamily: police(POLICES.titre), fontSize: 12.5, color: textes[ton] }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button">
      {contenu}
    </Pressable>
  ) : (
    contenu
  )
}

/** Fond d'écran Empreinte : gris clair + aurore. */
export function FondLumiere({ children }: React.PropsWithChildren) {
  const theme = useTheme()
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.lightGrey }}>
      <Aurore />
      {children}
    </View>
  )
}

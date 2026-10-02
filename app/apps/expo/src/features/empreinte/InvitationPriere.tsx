import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useAtomValue } from 'jotai/react'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'
import { useTheme } from '~themes/ThemeProvider'
import { colorWithOpacity } from '~themes/colorValues'
import { POLICES, police, styleVerre, useVerre } from './lumiere'

/**
 * Empreinte : la lecture ne s'arrête pas au texte. Entre deux passages (plans, Bible, vidéos),
 * une invitation douce pousse à parler au Saint-Esprit, à prier, à laisser la Parole
 * transformer. Jamais imposée : la personne choisit sa fréquence (réglage).
 */
export type FrequenceInvitation = 'toujours' | 'parfois' | 'jamais'
export const frequenceInvitationAtom = atomWithAsyncStorage<FrequenceInvitation>(
  'empreinte.invitationPriere',
  'toujours'
)

const INVITATIONS = [
  'Entrez dans un temps de prière. Parlez au Saint-Esprit de ce que vous venez de lire.',
  'Qu’est-ce que ce passage vous dit aujourd’hui ? Demandez-le à Dieu.',
  'Faites silence un instant. Laissez la Parole descendre dans votre cœur.',
  'Avant de continuer, priez : « Seigneur, ouvre mes yeux sur ta Parole. »',
  'Quel mot vous a touché ? Redites-le à Dieu, simplement.',
  'Remerciez Dieu pour une chose que ce texte vous révèle de lui.',
  'Demandez au Saint-Esprit ce qu’il veut changer en vous à travers ce passage.',
]

/** L'orbe qui respire (reprend l'animation des étapes « prière » des plans). */
export function Orbe({ taille = 30 }: { taille?: number }) {
  const theme = useTheme()
  const couleur = (alpha: number) => colorWithOpacity(theme.colors.default, alpha)
  const anneau = (debut: number, fin: number, alpha: number) => (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      <Animated.View
        style={{
          width: taille,
          height: taille,
          borderRadius: taille / 2,
          backgroundColor: couleur(alpha),
          animationName: {
            from: { transform: [{ scale: debut }] },
            to: { transform: [{ scale: fin }] },
          },
          animationDuration: '2.6s',
          animationTimingFunction: 'ease-in-out',
          animationDirection: 'alternate',
          animationIterationCount: 'infinite',
        }}
      />
    </View>
  )
  return (
    <View style={{ width: taille * 3.4, height: taille * 3.4 }}>
      {anneau(1.1, 2.7, 0.08)}
      {anneau(1, 2.05, 0.16)}
    </View>
  )
}

export default function InvitationPriere({
  graine = 0,
  texte,
}: {
  /** Choisit l'invitation (ex. l'index de l'étape), pour varier sans scintiller. */
  graine?: number
  /** Texte imposé par le contenu (ex. « méditez sur le psaume suivant »). */
  texte?: string
}) {
  const theme = useTheme()
  const verre = useVerre()
  const frequence = useAtomValue(frequenceInvitationAtom)
  const [silence, setSilence] = useState(0)
  const invitation = useMemo(
    () => texte ?? INVITATIONS[Math.abs(graine) % INVITATIONS.length],
    [graine, texte]
  )
  useEffect(() => {
    if (!silence) return
    const minuterie = setTimeout(() => setSilence(valeur => valeur - 1), 1000)
    return () => clearTimeout(minuterie)
  }, [silence])

  if (frequence === 'jamais') return null
  if (frequence === 'parfois' && graine % 2 === 1 && !texte) return null

  return (
    <View style={{ alignItems: 'center', gap: 14, marginVertical: 36, paddingHorizontal: 24 }}>
      <Orbe />
      <Text
        style={{
          fontFamily: police(POLICES.lecture),
          fontSize: 17,
          lineHeight: 26,
          textAlign: 'center',
          color: theme.colors.default,
          maxWidth: 520,
        }}
      >
        {silence ? `Temps de silence et de prière… ${silence} s` : invitation}
      </Text>
      <Pressable
        onPress={() => setSilence(valeur => (valeur ? 0 : 60))}
        accessibilityRole="button"
        style={[
          styleVerre(verre, 17, false),
          { height: 34, paddingHorizontal: 16, justifyContent: 'center' },
        ]}
      >
        <Text style={{ fontFamily: police(POLICES.titre), fontSize: 13 }}>
          {silence ? 'Reprendre la lecture' : 'Prendre un moment (1 min)'}
        </Text>
      </Pressable>
    </View>
  )
}

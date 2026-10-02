import React, { useEffect, useState } from 'react'
import { Pressable, Text } from 'react-native'
import * as Speech from 'expo-speech'
import { Icone } from './icones'
import { POLICES, police, styleVerre, useVerre } from './lumiere'

/** Empreinte : écouter un texte (lecture biblique d'un plan) tout en le lisant. */
export default function EcouterTexte({ texte, langue = 'fr' }: { texte: string; langue?: string }) {
  const verre = useVerre()
  const [enCours, setEnCours] = useState(false)
  useEffect(() => () => void Speech.stop(), [])
  const basculer = () => {
    if (enCours) {
      void Speech.stop()
      setEnCours(false)
      return
    }
    setEnCours(true)
    Speech.speak(texte, {
      language: langue === 'en' ? 'en-US' : 'fr-FR',
      onDone: () => setEnCours(false),
      onStopped: () => setEnCours(false),
      onError: () => setEnCours(false),
    })
  }
  return (
    <Pressable
      onPress={basculer}
      accessibilityRole="button"
      accessibilityLabel={enCours ? 'Arrêter l’écoute' : 'Écouter'}
      style={[
        styleVerre(verre, 17, false),
        { flexDirection: 'row', alignItems: 'center', gap: 6, height: 34, paddingHorizontal: 12 },
      ]}
    >
      <Icone nom={enCours ? 'pause' : 'headph'} taille={15} />
      <Text style={{ fontFamily: police(POLICES.titre), fontSize: 13 }}>
        {enCours ? 'Arrêter' : 'Écouter'}
      </Text>
    </Pressable>
  )
}

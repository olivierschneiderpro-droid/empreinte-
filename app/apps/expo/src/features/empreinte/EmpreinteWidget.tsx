import React from 'react'
import { Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'
import { FeatherIcon } from '~common/ui/Icon'
import { useTheme } from '~themes/ThemeProvider'
import { useEmpreinte } from './registreEmpreinte'
import { Corps, Marque, Points, Surtitre, Verre } from './lumiere'

/** Carte d'accueil : s'ajoute au-dessus des widgets d’Empreinte, sans en retirer aucun. */
const EmpreinteWidget = ({ style }: { style?: object }) => {
  const theme = useTheme()
  const router = useRouter()
  const { registre, anomalies } = useEmpreinte()
  const ecarts = anomalies.filter(a => a.gravite !== 'info').length

  return (
    <Pressable onPress={() => router.push('/empreinte')} style={style} testID="empreinte-widget">
      <Verre style={{ gap: 14 }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Marque taille={18} />
          <FeatherIcon name="arrow-up-right" size={18} color="grey" />
        </View>
        <View style={{ flexDirection: 'row', gap: 24 }}>
          <View style={{ gap: 4 }}>
            <Surtitre>Réalités</Surtitre>
            <Points taille={34}>{String(registre.realites.length).padStart(2, '0')}</Points>
          </View>
          <View style={{ gap: 4 }}>
            <Surtitre couleur={ecarts ? theme.colors.quart : undefined}>Écarts</Surtitre>
            <Points taille={34} couleur={ecarts ? theme.colors.quart : undefined}>
              {String(ecarts).padStart(2, '0')}
            </Points>
          </View>
        </View>
        <Corps taille={13} couleur={theme.colors.grey}>
          Factures, livres, Bibles, équipements, missions : chaque réalité physique garde son
          empreinte.
        </Corps>
      </Verre>
    </Pressable>
  )
}

export default EmpreinteWidget

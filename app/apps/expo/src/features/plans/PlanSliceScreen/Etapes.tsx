import React from 'react'
import { View } from 'react-native'
import type { EntitySlice } from '~common/types'
import Text from '~common/ui/Text'
import { Icone, type NomIcone } from '~features/empreinte/icones'
import { POLICES, police, styleVerre, useVerre } from '~features/empreinte/lumiere'
import { useTheme } from '~themes/ThemeProvider'

/**
 * Empreinte : une journée de plan se vit par étapes séparées — lire, écouter, regarder,
 * méditer — qui peuvent toutes se combiner (on peut lire en écoutant).
 */
const NATURE: Partial<Record<string, { libelle: string; icone: NomIcone }>> = {
  Chapter: { libelle: 'Lire et écouter', icone: 'book' },
  Verse: { libelle: 'Lire et écouter', icone: 'book' },
  Video: { libelle: 'Regarder', icone: 'play' },
  Text: { libelle: 'Méditer', icone: 'note' },
  Image: { libelle: 'Contempler', icone: 'image' },
}

const typeDe = (slice: EntitySlice) => slice.type ?? 'Verse'

/** Numérote les étapes de contenu (les titres restent des titres). */
export const etapesNumerotees = (slices: EntitySlice[]) => {
  let numero = 0
  return slices.map(slice => ({
    slice,
    numero: NATURE[typeDe(slice)] ? ++numero : 0,
  }))
}

export function EnteteEtape({ numero, type }: { numero: number; type?: string }) {
  const theme = useTheme()
  const nature = NATURE[type ?? 'Verse']
  if (!nature) return null
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        marginTop: 28,
        marginBottom: 4,
      }}
    >
      <Icone nom={nature.icone} taille={14} couleur={theme.colors.grey} />
      <Text
        style={{
          fontFamily: police(POLICES.monoMoyen),
          fontSize: 11,
          letterSpacing: 1.1,
          textTransform: 'uppercase',
          color: theme.colors.grey,
        }}
      >
        {`Étape ${numero} · ${nature.libelle}`}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border, marginLeft: 6 }} />
    </View>
  )
}

/** Résumé du parcours du jour : combien d'étapes de chaque nature. */
export function ResumeEtapes({ slices }: { slices: EntitySlice[] }) {
  const verre = useVerre()
  const comptes = new Map<string, { libelle: string; icone: NomIcone; nombre: number }>()
  for (const slice of slices) {
    const nature = NATURE[typeDe(slice)]
    if (!nature) continue
    const actuel = comptes.get(nature.libelle)
    comptes.set(nature.libelle, { ...nature, nombre: (actuel?.nombre ?? 0) + 1 })
  }
  if (comptes.size < 2) return null
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingHorizontal: 20,
        marginBottom: 8,
      }}
    >
      {[...comptes.values()].map(nature => (
        <View
          key={nature.libelle}
          style={[
            styleVerre(verre, 15, false),
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              height: 30,
              paddingHorizontal: 12,
            },
          ]}
        >
          <Icone nom={nature.icone} taille={13} />
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 12.5 }}>
            {nature.nombre > 1 ? `${nature.libelle} · ${nature.nombre}` : nature.libelle}
          </Text>
        </View>
      ))}
    </View>
  )
}

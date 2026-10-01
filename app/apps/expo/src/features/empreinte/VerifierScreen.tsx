import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { verifierJournal, type Anomalie } from '@empreinte/core'
import Text from '~common/ui/Text'
import { useTheme } from '~themes/ThemeProvider'
import { colorWithOpacity } from '~themes/colorValues'
import { Dot, Micro, desaccord } from './AccueilLumiere'
import { Icone } from './icones'
import { BoutonRond, FondLumiere, POLICES, police, styleVerre, useVerre } from './lumiere'
import { useEmpreinte } from './registreEmpreinte'

const TITRES: Record<Anomalie['code'], string> = {
  'incoherence-valeur': 'Valeurs différentes',
  'doublon-potentiel': 'Doublon possible',
  'relation-manquante': 'Relation manquante',
  'preuve-manquante': 'Preuve manquante',
  'rupture-tracabilite': 'Original introuvable',
  'realite-non-integree': 'Nouvelle réalité à intégrer',
  'transition-forcee': 'Passage inhabituel',
  'marquage-absent': 'Marquage absent',
  'journal-altere': 'Journal altéré',
}

const VerifierScreen = () => {
  const theme = useTheme()
  const v = useVerre()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { registre, anomalies, reinitialiser } = useEmpreinte()
  const journalIntact = verifierJournal([...registre.journal]) === null
  const critiques = anomalies.filter(a => a.gravite === 'critique')
  const attention = anomalies.filter(a => a.gravite === 'attention')
  const infos = anomalies.filter(a => a.gravite === 'info')
  const total = anomalies.length || 1
  const tete = critiques[0] ?? attention[0]
  const reste = anomalies.filter(a => a !== tete)
  const ouvrir = (id: string) => router.push({ pathname: '/empreinte/realite', params: { id } })
  const valeurs = tete ? desaccord(registre.chercher(tete.realiteIds[0]))?.split(' ≠ ') : undefined
  const couleurGravite = (g: Anomalie['gravite']) =>
    g === 'critique'
      ? theme.colors.quart
      : g === 'attention'
        ? theme.colors.secondary
        : theme.colors.color1

  return (
    <FondLumiere>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 14,
          paddingBottom: 130,
          gap: 14,
        }}
      >
        {router.canGoBack() ? (
          <BoutonRond icone="back" libelle="Retour" onPress={() => router.back()} />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <View style={{ flex: 1, gap: 6 }}>
            <Micro>À vérifier</Micro>
            <Text
              style={{
                fontFamily: police(POLICES.gras),
                fontSize: 30,
                lineHeight: 32,
                letterSpacing: -0.9,
              }}
            >
              {anomalies.length ? 'Le système signale.\nVous décidez.' : 'Tout concorde.'}
            </Text>
          </View>
          <Dot taille={60}>{anomalies.length}</Dot>
        </View>

        <View style={{ flexDirection: 'row', gap: 4, height: 7 }}>
          {[
            [critiques.length, theme.colors.quart],
            [attention.length, theme.colors.secondary],
            [infos.length, theme.colors.color1],
          ].map(([n, c], i) =>
            Number(n) ? (
              <View
                key={i}
                style={{ flex: Number(n) / total, borderRadius: 4, backgroundColor: String(c) }}
              />
            ) : null
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          {[
            [critiques.length, 'critique', theme.colors.quart],
            [attention.length, 'attention', theme.colors.secondary],
            [infos.length, 'infos', theme.colors.color1],
          ].map(([n, l, c]) => (
            <View key={String(l)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: String(c) }} />
              <Text
                style={{
                  fontFamily: police(POLICES.moyen),
                  fontSize: 13,
                  color: theme.colors.grey,
                }}
              >
                {n} {l}
              </Text>
            </View>
          ))}
        </View>

        {tete ? (
          <Pressable
            onPress={() => ouvrir(tete.realiteIds[0])}
            style={[
              styleVerre(v, 24),
              {
                padding: 18,
                gap: 8,
                borderColor: colorWithOpacity(couleurGravite(tete.gravite), 0.4),
              },
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <Text style={{ fontFamily: police(POLICES.gras), fontSize: 16 }}>
                {TITRES[tete.code]}
              </Text>
              <Text
                style={{ fontFamily: police(POLICES.mono), fontSize: 11, color: theme.colors.grey }}
              >
                {tete.realiteIds[0]}
              </Text>
            </View>
            {valeurs ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Dot taille={30}>{valeurs[0]?.replace(/\s/g, '')}</Dot>
                <Text style={{ color: theme.colors.grey, fontSize: 18 }}>≠</Text>
                <Dot taille={30} couleur={theme.colors.quart}>
                  {valeurs[1]?.replace(/\s/g, '')}
                </Dot>
                <View style={{ flex: 1 }} />
                <Icone nom="fwd" taille={18} />
              </View>
            ) : (
              <Text
                style={{
                  fontFamily: police(POLICES.moyen),
                  fontSize: 14,
                  color: theme.colors.grey,
                }}
              >
                {tete.message}
              </Text>
            )}
            <Text
              style={{
                fontFamily: police(POLICES.moyen),
                fontSize: 12.5,
                color: theme.colors.grey,
              }}
            >
              {tete.suggestion}
            </Text>
          </Pressable>
        ) : null}

        {reste.length ? (
          <View style={[styleVerre(v, 24), { paddingHorizontal: 18, paddingVertical: 4 }]}>
            {reste.map((a, i) => (
              <Pressable
                key={i}
                onPress={() => ouvrir(a.realiteIds[0])}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 12,
                  borderTopWidth: i ? 1 : 0,
                  borderTopColor: v.ligne,
                }}
              >
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: couleurGravite(a.gravite),
                  }}
                />
                <View style={{ flex: 1, gap: 1 }}>
                  <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14.5 }}>
                    {TITRES[a.code]}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: police(POLICES.moyen),
                      fontSize: 12.5,
                      color: theme.colors.grey,
                    }}
                  >
                    {a.realiteIds.join(' et ')}
                  </Text>
                </View>
                <Icone nom="fwd" taille={16} couleur={theme.colors.grey} />
              </Pressable>
            ))}
          </View>
        ) : null}

        <View
          style={[
            styleVerre(v, 20),
            { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
          ]}
        >
          <Icone
            nom="lock"
            taille={18}
            couleur={journalIntact ? theme.colors.success : theme.colors.quart}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>
              {journalIntact ? 'Journal intact' : 'Journal altéré'}
            </Text>
            <Text
              style={{ fontFamily: police(POLICES.mono), fontSize: 11, color: theme.colors.grey }}
            >
              {registre.journal.length} événements chaînés · SHA-256
            </Text>
          </View>
        </View>

        <Pressable onPress={reinitialiser} style={{ alignSelf: 'center', padding: 10 }}>
          <Text
            style={{ fontFamily: police(POLICES.moyen), fontSize: 13, color: theme.colors.grey }}
          >
            Recharger l’exemple F-47
          </Text>
        </Pressable>
      </ScrollView>
    </FondLumiere>
  )
}

export default VerifierScreen

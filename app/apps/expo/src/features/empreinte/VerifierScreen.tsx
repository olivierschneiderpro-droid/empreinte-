import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { verifierJournal, type Gravite } from '@empreinte/core'
import Container from '~common/ui/Container'
import Header from '~common/Header'
import { FeatherIcon } from '~common/ui/Icon'
import { useTheme } from '~themes/ThemeProvider'
import { useEmpreinte } from './registreEmpreinte'
import { Corps, Mono, Pastille, Points, Surtitre, Titre, Verre } from './lumiere'

const GRAVITES: { cle: Gravite; titre: string }[] = [
  { cle: 'critique', titre: 'Critique' },
  { cle: 'attention', titre: 'À vérifier' },
  { cle: 'info', titre: 'Pour information' },
]

const VerifierScreen = () => {
  const theme = useTheme()
  const router = useRouter()
  const { registre, anomalies, reinitialiser } = useEmpreinte()
  const journalIntact = verifierJournal([...registre.journal]) === null
  const ecarts = anomalies.filter(a => a.gravite !== 'info').length

  return (
    <Container>
      <Header hasBackButton title="Vérifier" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 22, paddingBottom: 60 }}>
        <View style={{ gap: 8 }}>
          <Points taille={72} couleur={ecarts ? theme.colors.quart : undefined}>
            {String(ecarts).padStart(2, '0')}
          </Points>
          <Titre>{ecarts ? 'Anomalie détectée — vérification nécessaire' : 'Tout concorde'}</Titre>
          <Corps couleur={theme.colors.grey}>
            Empreinte compare l’original, la photo, l’OCR et les données, suit les relations
            attendues et relit le journal. Rien n’est corrigé sans vous.
          </Corps>
        </View>

        <Verre
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
          ecart={!journalIntact}
        >
          <FeatherIcon
            name={journalIntact ? 'lock' : 'alert-triangle'}
            size={18}
            color={journalIntact ? 'success' : 'quart'}
          />
          <View style={{ flex: 1, gap: 2 }}>
            <Corps>{journalIntact ? 'Journal intact' : 'Journal altéré'}</Corps>
            <Mono taille={11} couleur={theme.colors.grey}>
              {registre.journal.length} événements chaînés · SHA-256
            </Mono>
          </View>
        </Verre>

        {GRAVITES.map(({ cle, titre }) => {
          const liste = anomalies.filter(a => a.gravite === cle)
          if (liste.length === 0) return null
          return (
            <View key={cle} style={{ gap: 10 }}>
              <Surtitre couleur={cle === 'info' ? undefined : theme.colors.quart}>
                {titre} · {liste.length}
              </Surtitre>
              {liste.map((a, i) => (
                <Verre key={i} ecart={cle !== 'info'} style={{ gap: 8 }}>
                  <Pastille ecart={cle !== 'info'}>{a.code}</Pastille>
                  <Corps>{a.message}</Corps>
                  <Corps taille={13} couleur={theme.colors.grey}>
                    {a.suggestion}
                  </Corps>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {a.realiteIds.map(id => (
                      <Pressable
                        key={id}
                        onPress={() =>
                          router.push({ pathname: '/empreinte/realite', params: { id } })
                        }
                      >
                        <Mono taille={12} couleur={theme.colors.tertiary}>
                          {id} ↗
                        </Mono>
                      </Pressable>
                    ))}
                  </View>
                </Verre>
              ))}
            </View>
          )
        })}

        <Pressable onPress={reinitialiser} style={{ alignSelf: 'center', padding: 10 }}>
          <Corps taille={13} couleur={theme.colors.grey}>
            Recharger l’exemple F-47
          </Corps>
        </Pressable>
      </ScrollView>
    </Container>
  )
}

export default VerifierScreen

import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import type { Realite } from '@empreinte/core'
import Container from '~common/ui/Container'
import Header from '~common/Header'
import { FeatherIcon } from '~common/ui/Icon'
import { useTheme } from '~themes/ThemeProvider'
import { LIBELLES_GENRE, useEmpreinte } from './registreEmpreinte'
import { Corps, Marque, Mono, Pastille, Points, Surtitre, Titre, Verre } from './lumiere'

export function emplacementLisible(r: Realite): string {
  if (!r.emplacement) return 'Aucun emplacement'
  if (r.emplacement.introuvable) return 'Introuvable'
  return r.emplacement.rangement.join(' › ') || r.emplacement.dossier.join(' › ')
}

const RealitesScreen = () => {
  const theme = useTheme()
  const router = useRouter()
  const { registre, anomalies } = useEmpreinte()
  const [texte, setTexte] = useState('')
  const [genre, setGenre] = useState<string | null>(null)

  const genres = useMemo(() => [...new Set(registre.realites.map(r => r.genre))], [registre])
  const liste = useMemo(() => {
    const base = texte.trim() ? registre.rechercher(texte) : [...registre.realites]
    return genre ? base.filter(r => r.genre === genre) : base
  }, [registre, texte, genre])

  const ecartsPar = useMemo(() => {
    const m = new Map<string, number>()
    for (const a of anomalies) for (const id of a.realiteIds) m.set(id, (m.get(id) ?? 0) + 1)
    return m
  }, [anomalies])
  const critiques = anomalies.filter(a => a.gravite !== 'info').length
  const physiques = registre.realites.filter(r => r.physiqueAttendu).length

  return (
    <Container>
      <Header hasBackButton title="Empreinte" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 60 }}>
        <View style={{ gap: 6 }}>
          <Marque />
          <Corps couleur={theme.colors.grey}>
            Le réel laisse une empreinte. L’empreinte retrouve le réel.
          </Corps>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Verre style={{ flex: 1, gap: 6 }}>
            <Surtitre>Réalités</Surtitre>
            <Points>{String(registre.realites.length).padStart(2, '0')}</Points>
            <Corps taille={12} couleur={theme.colors.grey}>
              {physiques} physiques
            </Corps>
          </Verre>
          <Pressable style={{ flex: 1 }} onPress={() => router.push('/empreinte/verifier')}>
            <Verre style={{ gap: 6 }} ecart={critiques > 0}>
              <Surtitre couleur={critiques > 0 ? theme.colors.quart : undefined}>Écarts</Surtitre>
              <Points couleur={critiques > 0 ? theme.colors.quart : undefined}>
                {String(critiques).padStart(2, '0')}
              </Points>
              <Corps taille={12} couleur={theme.colors.grey}>
                Vérifier →
              </Corps>
            </Verre>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.reverse,
            paddingHorizontal: 14,
          }}
        >
          <FeatherIcon name="search" size={16} color="grey" />
          <TextInput
            value={texte}
            onChangeText={setTexte}
            placeholder="FAC-2026-0047, F-47, Classeur 02…"
            placeholderTextColor={theme.colors.grey}
            style={{
              flex: 1,
              paddingVertical: 12,
              fontFamily: 'Geist',
              fontSize: 15,
              color: theme.colors.default,
            }}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {[null, ...genres].map(g => {
            const actif = genre === g
            return (
              <Pressable
                key={g ?? 'tout'}
                onPress={() => setGenre(g)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 99,
                  backgroundColor: actif ? theme.colors.default : theme.colors.reverse,
                  borderWidth: 1,
                  borderColor: actif ? theme.colors.default : theme.colors.border,
                }}
              >
                <Corps taille={13} couleur={actif ? theme.colors.reverse : theme.colors.default}>
                  {g ? (LIBELLES_GENRE[g] ?? g) : 'Tout'}
                </Corps>
              </Pressable>
            )
          })}
        </ScrollView>

        {liste.map(r => {
          const ecarts = ecartsPar.get(r.id) ?? 0
          return (
            <Pressable
              key={r.id}
              onPress={() => router.push({ pathname: '/empreinte/realite', params: { id: r.id } })}
            >
              <Verre style={{ gap: 10 }} ecart={ecarts > 0}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Mono>{r.id}</Mono>
                  {ecarts > 0 ? (
                    <Pastille ecart>
                      {ecarts} écart{ecarts > 1 ? 's' : ''}
                    </Pastille>
                  ) : null}
                </View>
                <Titre taille={18}>{r.titre}</Titre>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  <Pastille>{LIBELLES_GENRE[r.genre] ?? r.genre}</Pastille>
                  <Pastille>{r.etat}</Pastille>
                  <Pastille>
                    {r.manifestations.length} manifestation{r.manifestations.length > 1 ? 's' : ''}
                  </Pastille>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FeatherIcon name="map-pin" size={13} color="grey" />
                  <Corps
                    taille={13}
                    couleur={r.emplacement?.introuvable ? theme.colors.quart : theme.colors.grey}
                  >
                    {emplacementLisible(r)}
                  </Corps>
                </View>
              </Verre>
            </Pressable>
          )
        })}
        {liste.length === 0 ? (
          <Corps couleur={theme.colors.grey}>Aucune réalité ne correspond.</Corps>
        ) : null}

        <Pressable
          onPress={() => router.push('/empreinte/capturer')}
          style={{
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
            borderRadius: 16,
            backgroundColor: theme.colors.default,
          }}
        >
          <FeatherIcon name="plus" size={17} color="reverse" />
          <Corps couleur={theme.colors.reverse}>Intégrer une réalité</Corps>
        </Pressable>
      </ScrollView>
    </Container>
  )
}

export default RealitesScreen

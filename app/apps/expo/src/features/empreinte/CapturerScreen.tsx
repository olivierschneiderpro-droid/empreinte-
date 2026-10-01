import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import {
  extrairePassages,
  numeroDepuisReference,
  prefixePour,
  proposerIdentifiant,
  type TypeManifestation,
} from '@empreinte/core'
import Container from '~common/ui/Container'
import Header from '~common/Header'
import { useTheme } from '~themes/ThemeProvider'
import { LIBELLES_GENRE, LIBELLES_MANIFESTATION, useEmpreinte } from './registreEmpreinte'
import { Corps, Mono, Points, Surtitre, Verre } from './lumiere'

const GENRES = [
  'document',
  'livre',
  'bible',
  'objet',
  'equipement',
  'mission',
  'projet',
  'paiement',
  'stock',
]
const FORMES: TypeManifestation[] = ['physique-original', 'photo', 'scan', 'fichier-numerique']

function Champ({
  libelle,
  valeur,
  onChange,
  indice,
  multiligne = false,
}: {
  libelle: string
  valeur: string
  onChange: (v: string) => void
  indice?: string
  multiligne?: boolean
}) {
  const theme = useTheme()
  return (
    <View style={{ gap: 6 }}>
      <Surtitre>{libelle}</Surtitre>
      <TextInput
        value={valeur}
        onChangeText={onChange}
        placeholder={indice}
        placeholderTextColor={theme.colors.grey}
        multiline={multiligne}
        style={{
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.reverse,
          paddingHorizontal: 14,
          paddingVertical: 12,
          minHeight: multiligne ? 80 : undefined,
          fontFamily: 'Geist',
          fontSize: 15,
          color: theme.colors.default,
        }}
      />
    </View>
  )
}

function Choix({
  actif,
  onPress,
  children,
}: React.PropsWithChildren<{ actif: boolean; onPress: () => void }>) {
  const theme = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: actif ? theme.colors.default : theme.colors.border,
        backgroundColor: actif ? theme.colors.default : theme.colors.reverse,
      }}
    >
      <Corps taille={13} couleur={actif ? theme.colors.reverse : theme.colors.default}>
        {children}
      </Corps>
    </Pressable>
  )
}

const CapturerScreen = () => {
  const theme = useTheme()
  const router = useRouter()
  const { registre, modifier } = useEmpreinte()
  const [genre, setGenre] = useState('document')
  const [forme, setForme] = useState<TypeManifestation>('physique-original')
  const [titre, setTitre] = useState('')
  const [reference, setReference] = useState('')
  const [emetteur, setEmetteur] = useState('')
  const [montant, setMontant] = useState('')
  const [notes, setNotes] = useState('')

  const sousType = genre === 'document' && /^f/i.test(reference.trim()) ? 'facture' : undefined
  const identifiant = useMemo(
    () =>
      proposerIdentifiant(
        registre.realites.map(r => r.id),
        prefixePour(genre, sousType),
        new Date().getFullYear(),
        reference ? numeroDepuisReference(reference) : undefined
      ),
    [registre, genre, sousType, reference]
  )
  const passages = useMemo(() => (notes.trim() ? extrairePassages(notes) : []), [notes])
  const memeReference = reference.trim() ? registre.rechercher(reference.trim()) : []

  const integrer = () => {
    if (!titre.trim()) return
    modifier(reg => {
      const r = reg.integrer({
        id: identifiant,
        genre,
        sousType,
        titre: titre.trim(),
        references: reference.trim()
          ? [{ cle: 'reference', valeur: reference.trim(), emetteur: emetteur.trim() || undefined }]
          : [],
      })
      reg.ajouterManifestation(r.id, {
        type: forme,
        donnees: montant.trim() ? { montant: montant.trim() } : {},
      })
      if (passages.length) reg.lierPassages(r.id, passages)
    })
    router.replace({ pathname: '/empreinte/realite', params: { id: identifiant } })
  }

  return (
    <Container>
      <Header hasBackButton title="Intégrer une réalité" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 60 }}>
        <Verre style={{ gap: 6, alignItems: 'flex-start' }}>
          <Surtitre>Identité proposée</Surtitre>
          <Points taille={34}>{identifiant}</Points>
          <Corps taille={13} couleur={theme.colors.grey}>
            Quand le papier porte déjà un numéro libre, Empreinte le reprend.
          </Corps>
        </Verre>

        <View style={{ gap: 8 }}>
          <Surtitre>Nature</Surtitre>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {GENRES.map(g => (
              <Choix key={g} actif={genre === g} onPress={() => setGenre(g)}>
                {LIBELLES_GENRE[g]}
              </Choix>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Surtitre>Ce que j’ai en main</Surtitre>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {FORMES.map(f => (
              <Choix key={f} actif={forme === f} onPress={() => setForme(f)}>
                {LIBELLES_MANIFESTATION[f]}
              </Choix>
            ))}
          </View>
        </View>

        <Champ libelle="Titre" valeur={titre} onChange={setTitre} indice="Facture de rachat F-48" />
        <Champ
          libelle="Numéro porté par l’objet"
          valeur={reference}
          onChange={setReference}
          indice="F-48, ISBN, n° de série…"
        />
        {memeReference.length > 0 ? (
          <Verre ecart style={{ gap: 4, padding: 14 }}>
            <Corps taille={13} couleur={theme.colors.quart}>
              Cette référence existe déjà : {memeReference.map(r => r.id).join(', ')}. Doublon
              possible.
            </Corps>
          </Verre>
        ) : null}
        <Champ
          libelle="Émetteur"
          valeur={emetteur}
          onChange={setEmetteur}
          indice="Client, éditeur, fabricant"
        />
        <Champ libelle="Montant" valeur={montant} onChange={setMontant} indice="1 250,00 €" />
        <Champ
          libelle="Notes"
          valeur={notes}
          onChange={setNotes}
          indice="Ex. : à lire avec Jean 3:16"
          multiligne
        />
        {passages.length ? (
          <Mono taille={12} couleur={theme.colors.tertiary}>
            Passages reconnus : {passages.join(', ')}
          </Mono>
        ) : null}

        <Pressable
          onPress={integrer}
          disabled={!titre.trim()}
          style={{
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: 'center',
            backgroundColor: titre.trim() ? theme.colors.default : theme.colors.border,
          }}
        >
          <Corps couleur={theme.colors.reverse}>Intégrer {identifiant}</Corps>
        </Pressable>
      </ScrollView>
    </Container>
  )
}

export default CapturerScreen

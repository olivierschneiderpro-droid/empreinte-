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
import { useTheme } from '~themes/ThemeProvider'
import { LIBELLES_GENRE, LIBELLES_MANIFESTATION, useEmpreinte } from './registreEmpreinte'
import Text from '~common/ui/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icone, type NomIcone } from './icones'
import {
  BarreHaut,
  BoutonRond,
  Corps,
  FondLumiere,
  Mono,
  POLICES,
  Pilule,
  Points,
  Surtitre,
  Verre,
  police,
  styleVerre,
  useVerre,
} from './lumiere'

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
  const [choisi, setChoisi] = useState(false)
  const v = useVerre()
  const insets = useSafeAreaInsets()
  const choisir = (g: string, f: TypeManifestation, ref = '') => {
    setGenre(g)
    setForme(f)
    if (ref) setReference(ref)
    setChoisi(true)
  }

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

  if (!choisi) {
    const tuiles: [NomIcone, string, () => void][] = [
      ['paper', 'Document', () => choisir('document', 'physique-original')],
      ['euro', 'Facture', () => choisir('document', 'physique-original', 'F-')],
      ['book', 'Livre · ISBN', () => choisir('livre', 'physique-original')],
      ['book', 'Bible', () => choisir('bible', 'physique-original')],
      ['laptop', 'Équipement', () => choisir('equipement', 'physique-original')],
      ['box', 'Objet', () => choisir('objet', 'physique-original')],
      ['note', 'Page de carnet', () => choisir('document', 'scan')],
      ['truck', 'Lot · mission', () => choisir('mission', 'physique-original')],
    ]
    return (
      <FondLumiere>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: insets.top + 10,
            paddingBottom: 130,
            gap: 12,
          }}
        >
          <BoutonRond
            icone="back"
            libelle="Retour"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
          <View style={{ gap: 6, marginTop: 8 }}>
            <Text
              style={{
                fontFamily: police(POLICES.gras),
                fontSize: 30,
                lineHeight: 32,
                letterSpacing: -0.9,
              }}
            >
              {'Qu’avez-vous\ndevant vous ?'}
            </Text>
            <Text
              style={{ fontFamily: police(POLICES.moyen), fontSize: 14, color: theme.colors.grey }}
            >
              Le physique garde son existence. Empreinte en crée la trace.
            </Text>
          </View>
          <Pressable
            onPress={() => choisir('document', 'photo')}
            accessibilityRole="button"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              padding: 18,
              borderRadius: 24,
              backgroundColor: theme.colors.default,
            }}
          >
            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: theme.colors.reverse,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icone nom="camera" taille={24} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{
                  fontFamily: police(POLICES.gras),
                  fontSize: 17,
                  color: theme.colors.reverse,
                }}
              >
                Photographier
              </Text>
              <Text
                style={{
                  fontFamily: police(POLICES.moyen),
                  fontSize: 13,
                  color: theme.colors.lightGrey,
                }}
              >
                Empreinte reconnaît le type tout seul
              </Text>
            </View>
          </Pressable>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {tuiles.map(([icone, libelle, faire]) => (
              <Pressable
                key={libelle}
                onPress={faire}
                accessibilityRole="button"
                style={[
                  styleVerre(v, 20),
                  {
                    width: '23.2%',
                    minHeight: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: 6,
                  },
                ]}
              >
                <Icone nom={icone} taille={20} />
                <Text
                  style={{ fontFamily: police(POLICES.titre), fontSize: 11.5, textAlign: 'center' }}
                >
                  {libelle}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={[styleVerre(v, 24), { paddingHorizontal: 18, paddingVertical: 4 }]}>
            {(
              [
                [
                  'sparkle',
                  'Créer sans original',
                  'Projet, idée : une réalité d’abord numérique',
                  () => choisir('projet', 'fichier-numerique'),
                ],
                [
                  'upload',
                  'Importer des fichiers',
                  'PDF, photos, relevés OFX, Factur-X',
                  () => choisir('document', 'fichier-numerique'),
                ],
              ] as [NomIcone, string, string, () => void][]
            ).map(([icone, titreLigne, sous, faire], i) => (
              <Pressable
                key={titreLigne}
                onPress={faire}
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
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    backgroundColor: v.doux,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icone nom={icone} taille={19} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: police(POLICES.gras), fontSize: 15 }}>
                    {titreLigne}
                  </Text>
                  <Text
                    style={{
                      fontFamily: police(POLICES.moyen),
                      fontSize: 12.5,
                      color: theme.colors.grey,
                    }}
                  >
                    {sous}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </FondLumiere>
    )
  }

  return (
    <FondLumiere>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 130, gap: 18 }}>
        <BarreHaut
          centre={<Pilule ton="verre">Intégrer une réalité</Pilule>}
          droite={
            <BoutonRond icone="x" libelle="Changer de type" onPress={() => setChoisi(false)} />
          }
        />
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
    </FondLumiere>
  )
}

export default CapturerScreen

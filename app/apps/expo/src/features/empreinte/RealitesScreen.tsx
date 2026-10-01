import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { Realite } from '@empreinte/core'
import Text from '~common/ui/Text'
import { useTheme } from '~themes/ThemeProvider'
import { Dot, Micro } from './AccueilLumiere'
import { Icone, type NomIcone } from './icones'
import { BoutonRond, FondLumiere, POLICES, Pilule, police, styleVerre, useVerre } from './lumiere'
import { useEmpreinte } from './registreEmpreinte'

export function emplacementLisible(r: Realite): string {
  if (!r.emplacement) return 'Aucun emplacement'
  if (r.emplacement.introuvable) return 'Introuvable'
  return r.emplacement.rangement.join(' › ') || r.emplacement.dossier.join(' › ')
}

/** Catégorie affichée dans la grille : les factures sont séparées des autres documents. */
export function categorie(r: Realite): string {
  if (r.genre === 'document' && r.sousType?.startsWith('facture')) return 'facture'
  return r.genre
}

export const CATEGORIES: Record<string, { libelle: string; icone: NomIcone }> = {
  document: { libelle: 'Documents', icone: 'paper' },
  facture: { libelle: 'Factures', icone: 'euro' },
  livre: { libelle: 'Livres', icone: 'book' },
  bible: { libelle: 'Bibles', icone: 'book' },
  equipement: { libelle: 'Équipements', icone: 'laptop' },
  objet: { libelle: 'Objets', icone: 'box' },
  mission: { libelle: 'Missions', icone: 'flag' },
  projet: { libelle: 'Projets', icone: 'folder' },
  paiement: { libelle: 'Paiements', icone: 'bank' },
  stock: { libelle: 'Stocks', icone: 'box' },
  personne: { libelle: 'Personnes', icone: 'user' },
}

type Filtre = 'toutes' | 'physiques' | 'numeriques' | 'verifier'

const RealitesScreen = () => {
  const theme = useTheme()
  const v = useVerre()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { registre, anomalies } = useEmpreinte()
  const [texte, setTexte] = useState('')
  const [filtre, setFiltre] = useState<Filtre>('toutes')
  const [cat, setCat] = useState<string | null>(null)

  const aVerifier = useMemo(
    () => new Set(anomalies.filter(a => a.gravite !== 'info').flatMap(a => a.realiteIds)),
    [anomalies]
  )
  const toutes = registre.realites
  const physiques = toutes.filter(r => r.physiqueAttendu)
  const numeriques = toutes.filter(r => !r.physiqueAttendu)

  const base = useMemo(() => {
    let l: Realite[] = texte.trim() ? registre.rechercher(texte) : [...toutes]
    if (filtre === 'physiques') l = l.filter(r => r.physiqueAttendu)
    if (filtre === 'numeriques') l = l.filter(r => !r.physiqueAttendu)
    if (filtre === 'verifier') l = l.filter(r => aVerifier.has(r.id))
    return l
  }, [registre, toutes, texte, filtre, aVerifier])

  const grille = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of base) m.set(categorie(r), (m.get(categorie(r)) ?? 0) + 1)
    return [...m.entries()]
  }, [base])

  const liste = cat ? base.filter(r => categorie(r) === cat) : base
  const recentes = useMemo(() => {
    const vus: string[] = []
    for (const e of [...registre.journal].reverse())
      if (e.realiteId && !vus.includes(e.realiteId)) vus.push(e.realiteId)
    return vus.slice(0, 3).map(id => ({
      r: registre.chercher(id)!,
      le: registre.journal.filter(e => e.realiteId === id).pop()?.le ?? '',
    }))
  }, [registre])

  const ouvrir = (id: string) => router.push({ pathname: '/empreinte/realite', params: { id } })

  return (
    <FondLumiere>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 18,
          paddingBottom: 130,
          gap: 12,
        }}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {router.canGoBack() ? (
              <BoutonRond icone="back" libelle="Retour" onPress={() => router.back()} />
            ) : null}
            <Text style={{ fontFamily: police(POLICES.gras), fontSize: 30, letterSpacing: -0.9 }}>
              Réalités
            </Text>
          </View>
          <Dot taille={34}>{toutes.length}</Dot>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={[
              styleVerre(v, 25, false),
              {
                flex: 1,
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 18,
              },
            ]}
          >
            <Icone nom="search" taille={18} couleur={theme.colors.grey} />
            <TextInput
              value={texte}
              onChangeText={setTexte}
              placeholder="Numéro, titre, emplacement…"
              placeholderTextColor={theme.colors.grey}
              style={
                {
                  flex: 1,
                  fontFamily: police(POLICES.moyen),
                  fontSize: 15,
                  color: theme.colors.default,
                  outlineStyle: 'none',
                } as object
              }
            />
          </View>
          <BoutonRond
            icone="shield"
            libelle="Vérifier"
            onPress={() => router.push('/empreinte/verifier')}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
        >
          <Pilule
            ton={filtre === 'toutes' ? 'actif' : 'neutre'}
            onPress={() => setFiltre('toutes')}
          >
            Toutes
          </Pilule>
          <Pilule
            ton={filtre === 'physiques' ? 'actif' : 'neutre'}
            onPress={() => setFiltre('physiques')}
          >
            {`Physiques · ${physiques.length}`}
          </Pilule>
          <Pilule
            ton={filtre === 'numeriques' ? 'actif' : 'neutre'}
            onPress={() => setFiltre('numeriques')}
          >
            {`Numériques · ${numeriques.length}`}
          </Pilule>
          <Pilule
            ton={filtre === 'verifier' ? 'actif' : 'rouge'}
            onPress={() => setFiltre('verifier')}
          >
            {`À vérifier · ${aVerifier.size}`}
          </Pilule>
        </ScrollView>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {grille.map(([c, n]) => {
            const info = CATEGORIES[c] ?? { libelle: c, icone: 'box' as NomIcone }
            const actif = cat === c
            return (
              <Pressable
                key={c}
                onPress={() => setCat(actif ? null : c)}
                accessibilityRole="button"
                accessibilityState={{ selected: actif }}
                style={[
                  styleVerre(v, 24),
                  {
                    width: '48.5%',
                    padding: 14,
                    gap: 14,
                    borderColor: actif ? theme.colors.default : v.filet,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                    <Icone nom={info.icone} taille={19} />
                  </View>
                  <Dot taille={24}>{n}</Dot>
                </View>
                <Text style={{ fontFamily: police(POLICES.gras), fontSize: 15 }}>
                  {info.libelle}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {!cat && !texte.trim() && filtre === 'toutes' ? (
          <View style={{ gap: 8, marginTop: 6 }}>
            <Micro>Récemment touchées</Micro>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {recentes.map(({ r, le }) => (
                <Pressable
                  key={r.id}
                  onPress={() => ouvrir(r.id)}
                  style={[styleVerre(v, 16), { flex: 1, padding: 12, gap: 4 }]}
                >
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: police(POLICES.gras), fontSize: 13.5 }}
                  >
                    {r.referencesExternes[0]?.valeur ?? r.id.replace(/-\d{4}-/, '-')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: police(POLICES.mono),
                      fontSize: 10.5,
                      color: theme.colors.grey,
                    }}
                  >
                    {le.slice(11, 16)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ gap: 8, marginTop: 6 }}>
          <Micro>{`${liste.length} réalité${liste.length > 1 ? 's' : ''}${cat ? ` · ${CATEGORIES[cat]?.libelle ?? cat}` : ''}`}</Micro>
          <View style={[styleVerre(v, 24), { paddingHorizontal: 18, paddingVertical: 4 }]}>
            {liste.map((r, i) => {
              const ecart = aVerifier.has(r.id)
              return (
                <Pressable
                  key={r.id}
                  onPress={() => ouvrir(r.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingVertical: 11,
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
                    <Icone nom={CATEGORIES[categorie(r)]?.icone ?? 'box'} taille={19} />
                  </View>
                  <View style={{ flex: 1, gap: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{ fontFamily: police(POLICES.titre), fontSize: 14.5 }}
                    >
                      {r.titre}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: police(POLICES.moyen),
                        fontSize: 12.5,
                        color: r.emplacement?.introuvable ? theme.colors.quart : theme.colors.grey,
                      }}
                    >
                      {r.id} · {emplacementLisible(r)}
                    </Text>
                  </View>
                  {ecart ? (
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: theme.colors.quart,
                      }}
                    />
                  ) : null}
                  <Icone nom="fwd" taille={16} couleur={theme.colors.grey} />
                </Pressable>
              )
            })}
            {liste.length === 0 ? (
              <Text
                style={{
                  paddingVertical: 14,
                  fontFamily: police(POLICES.moyen),
                  color: theme.colors.grey,
                }}
              >
                Aucune réalité ne correspond.
              </Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </FondLumiere>
  )
}

export default RealitesScreen

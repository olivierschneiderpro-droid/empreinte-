import React, { useMemo } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  analyserLacunes,
  proposerEmplacement,
  proposerMarquages,
  transitionsPossibles,
  type Lacunes,
  type Realite,
} from '@empreinte/core'
import Container from '~common/ui/Container'
import Header from '~common/Header'
import { FeatherIcon } from '~common/ui/Icon'
import { useTheme } from '~themes/ThemeProvider'
import {
  LIBELLES_GENRE,
  LIBELLES_LACUNES,
  LIBELLES_MANIFESTATION,
  useEmpreinte,
} from './registreEmpreinte'
import { emplacementLisible } from './RealitesScreen'
import {
  Confiance,
  Corps,
  Mono,
  Pastille,
  Points,
  Separateur,
  Surtitre,
  Titre,
  Verre,
} from './lumiere'

const LIBELLES_METHODE: Record<string, string> = {
  'numero-manuscrit': 'Numéro manuscrit',
  'etiquette-qr': 'Étiquette QR',
  'code-barres': 'Code-barres',
  nfc: 'Puce NFC',
  emplacement: 'Emplacement',
  couleur: 'Couleur',
}

function Section({
  titre,
  children,
  action,
}: React.PropsWithChildren<{ titre: string; action?: React.ReactNode }>) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Surtitre>{titre}</Surtitre>
        {action}
      </View>
      {children}
    </View>
  )
}

function Bouton({
  children,
  onPress,
  plein = false,
}: React.PropsWithChildren<{ onPress: () => void; plein?: boolean }>) {
  const theme = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: plein ? theme.colors.default : theme.colors.border,
        backgroundColor: plein ? theme.colors.default : theme.colors.reverse,
      }}
    >
      <Corps taille={13} couleur={plein ? theme.colors.reverse : theme.colors.default}>
        {children}
      </Corps>
    </Pressable>
  )
}

/** Partie numérique de l'identifiant, affichée en matrice de points. */
function numero(id: string) {
  const m = id.match(/^([A-Z]+)-(\d{4})-(\d+)$/)
  return m ? { prefixe: `${m[1]}-${m[2]}`, numero: m[3] } : { prefixe: '', numero: id }
}

const RealiteScreen = () => {
  const theme = useTheme()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { registre, anomalies, modifier } = useEmpreinte()
  const realite = registre.chercher(String(id))

  const lacunes = useMemo<Lacunes | undefined>(
    () => (realite ? analyserLacunes(registre, realite, anomalies) : undefined),
    [registre, realite, anomalies]
  )

  if (!realite) {
    return (
      <Container>
        <Header hasBackButton title="Réalité" />
        <View style={{ padding: 20 }}>
          <Corps>Réalité inconnue : {String(id)}</Corps>
        </View>
      </Container>
    )
  }

  const r: Realite = realite
  const ecarts = anomalies.filter(a => a.realiteIds.includes(r.id))
  const transitions = transitionsPossibles(r) ?? []
  const marquage = proposerMarquages(r, { telephone: true, imprimante: true })
  const placement = proposerEmplacement(registre.realites, r)
  const relations = registre.relationsDe(r.id)
  const historique = registre.historique(r.id).slice().reverse()
  const { prefixe, numero: n } = numero(r.id)

  return (
    <Container>
      <Header hasBackButton title={r.id} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 26, paddingBottom: 80 }}>
        {/* Identité */}
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
            <Points taille={64}>{n}</Points>
            <View style={{ paddingBottom: 10 }}>
              <Mono couleur={theme.colors.grey}>{prefixe}</Mono>
            </View>
          </View>
          <Titre>{r.titre}</Titre>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            <Pastille>{LIBELLES_GENRE[r.genre] ?? r.genre}</Pastille>
            {r.sousType ? <Pastille>{r.sousType}</Pastille> : null}
            <Pastille>{r.physiqueAttendu ? 'existe physiquement' : 'numérique seulement'}</Pastille>
          </View>
          {r.referencesExternes.map(ref => (
            <Corps key={ref.cle + ref.valeur} taille={13} couleur={theme.colors.grey}>
              {ref.cle} : {ref.valeur}
              {ref.emetteur ? ` — ${ref.emetteur}` : ''}
            </Corps>
          ))}
        </View>

        {/* Écarts */}
        {ecarts.length > 0 ? (
          <Verre ecart style={{ gap: 12 }}>
            <Surtitre couleur={theme.colors.quart}>
              Anomalie détectée — vérification nécessaire
            </Surtitre>
            {ecarts.map((a, i) => (
              <View key={i} style={{ gap: 4 }}>
                <Corps>{a.message}</Corps>
                <Corps taille={13} couleur={theme.colors.grey}>
                  {a.suggestion}
                </Corps>
              </View>
            ))}
          </Verre>
        ) : null}

        {/* Manifestations : chacune reste distincte */}
        <Section titre={`Manifestations · ${r.manifestations.length}`}>
          <Corps taille={13} couleur={theme.colors.grey}>
            La photo n’est pas l’original, l’OCR n’est pas la photo : chaque forme garde ses propres
            valeurs.
          </Corps>
          {r.manifestations.map(m => (
            <Verre key={m.id} style={{ gap: 8, padding: 14 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Pastille>{LIBELLES_MANIFESTATION[m.type] ?? m.type}</Pastille>
                <Confiance valeur={m.confiance} />
              </View>
              {m.description ? <Corps taille={14}>{m.description}</Corps> : null}
              {Object.entries(m.donnees).map(([k, v]) => (
                <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Corps taille={13} couleur={theme.colors.grey}>
                    {k}
                  </Corps>
                  <Mono>{String(v)}</Mono>
                </View>
              ))}
              {m.source || m.fichier ? (
                <Mono taille={11} couleur={theme.colors.grey}>
                  {[m.fichier, m.source].filter(Boolean).join(' · ')}
                </Mono>
              ) : null}
            </Verre>
          ))}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(['photo', 'scan', 'ocr', 'physique-original'] as const).map(t => (
              <Bouton
                key={t}
                onPress={() => modifier(reg => void reg.ajouterManifestation(r.id, { type: t }))}
              >
                + {LIBELLES_MANIFESTATION[t]}
              </Bouton>
            ))}
          </View>
        </Section>

        {/* Emplacement */}
        <Section titre="Emplacement">
          <Verre ecart={!!r.emplacement?.introuvable} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FeatherIcon
                name="map-pin"
                size={16}
                color={r.emplacement?.introuvable ? 'quart' : 'default'}
              />
              <Corps couleur={r.emplacement?.introuvable ? theme.colors.quart : undefined}>
                {emplacementLisible(r)}
              </Corps>
            </View>
            {r.emplacement?.dossier.length ? (
              <Corps taille={13} couleur={theme.colors.grey}>
                Classement : {r.emplacement.dossier.join(' › ')}
              </Corps>
            ) : null}
            {r.emplacement?.detenteur ? (
              <Corps taille={13} couleur={theme.colors.grey}>
                Détenteur : {r.emplacement.detenteur}
              </Corps>
            ) : null}
            <Separateur />
            {!r.emplacement?.rangement.length ? (
              <Corps taille={13} couleur={theme.colors.grey}>
                Proposition : {placement.rangement.join(' › ')} ({placement.dossier.join(' › ')})
              </Corps>
            ) : null}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {!r.emplacement?.rangement.length ? (
                <Bouton onPress={() => modifier(reg => void reg.placer(r.id, placement))}>
                  Ranger ici
                </Bouton>
              ) : null}
              {!r.emplacement?.introuvable ? (
                <Bouton onPress={() => modifier(reg => reg.signalerIntrouvable(r.id))}>
                  Signaler introuvable
                </Bouton>
              ) : (
                <Bouton
                  onPress={() => modifier(reg => void reg.placer(r.id, { introuvable: false }))}
                >
                  Retrouvé
                </Bouton>
              )}
            </View>
          </Verre>
        </Section>

        {/* État */}
        <Section titre="État">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Bouton plein onPress={() => {}}>
              {r.etat}
            </Bouton>
            {transitions.map(t => (
              <Bouton key={t} onPress={() => modifier(reg => reg.changerEtat(r.id, t))}>
                → {t}
              </Bouton>
            ))}
          </View>
        </Section>

        {/* Marquage */}
        <Section titre="Marquage physique">
          <Verre style={{ gap: 8 }}>
            {r.marquages.map((m, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Corps taille={14}>{LIBELLES_METHODE[m.methode] ?? m.methode}</Corps>
                <Mono>{m.contenu}</Mono>
              </View>
            ))}
            {r.marquages.length === 0 ? (
              <Corps taille={14} couleur={theme.colors.grey}>
                Rien n’est encore inscrit sur l’objet.
              </Corps>
            ) : null}
            <Separateur />
            <Corps taille={13} couleur={theme.colors.grey}>
              Recommandé : {LIBELLES_METHODE[marquage.principal.methode]} —{' '}
              {marquage.principal.raisons[0]}
            </Corps>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[marquage.principal, ...marquage.complements].map(p => (
                <Bouton
                  key={p.methode}
                  onPress={() => modifier(reg => void reg.marquer(r.id, p.methode, p.contenu))}
                >
                  Marquer · {LIBELLES_METHODE[p.methode] ?? p.methode}
                </Bouton>
              ))}
            </View>
          </Verre>
        </Section>

        {/* Preuves */}
        <Section titre={`Preuves · ${r.preuves.length}`}>
          {r.preuves.map(p => (
            <View key={p.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Corps taille={14}>{p.type}</Corps>
              <Mono taille={12} couleur={theme.colors.grey}>
                {p.le.slice(0, 10)}
              </Mono>
            </View>
          ))}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Bouton
              onPress={() =>
                modifier(
                  reg => void reg.ajouterPreuve(r.id, { type: 'validation-humaine', par: 'moi' })
                )
              }
            >
              + Validation humaine
            </Bouton>
            <Bouton
              onPress={() =>
                modifier(reg => void reg.ajouterPreuve(r.id, { type: 'transaction-bancaire' }))
              }
            >
              + Transaction bancaire
            </Bouton>
          </View>
        </Section>

        {/* Relations */}
        <Section titre={`Relations · ${relations.length}`}>
          {relations.map(rel => {
            const autre = rel.de === r.id ? rel.vers : rel.de
            return (
              <Pressable
                key={rel.id}
                onPress={() =>
                  router.push({ pathname: '/empreinte/realite', params: { id: autre } })
                }
              >
                <Verre
                  style={{
                    padding: 14,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ gap: 2, flex: 1 }}>
                    <Mono taille={12} couleur={theme.colors.grey}>
                      {rel.type}
                    </Mono>
                    <Corps taille={14}>{registre.chercher(autre)?.titre ?? autre}</Corps>
                  </View>
                  <FeatherIcon name="arrow-up-right" size={16} color="grey" />
                </Verre>
              </Pressable>
            )
          })}
          {relations.length === 0 ? (
            <Corps taille={14} couleur={theme.colors.grey}>
              Aucune relation.
            </Corps>
          ) : null}
        </Section>

        {/* Passages bibliques (Bible Strong) */}
        {r.passages.length > 0 ? (
          <Section titre="Passages">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {r.passages.map(p => (
                <Pastille key={p}>{p}</Pastille>
              ))}
            </View>
          </Section>
        ) : null}

        {/* Lacunes */}
        {lacunes ? (
          <Section titre="Lacunes">
            <Verre style={{ gap: 12 }}>
              {LIBELLES_LACUNES.map(({ cle, question }) => {
                const items = (lacunes as unknown as Record<string, string[]>)[cle] ?? []
                return (
                  <View key={cle} style={{ gap: 3 }}>
                    <Corps taille={14}>{question}</Corps>
                    <Corps
                      taille={13}
                      couleur={items.length ? theme.colors.tertiary : theme.colors.grey}
                    >
                      {items.length ? items.join(' · ') : '—'}
                    </Corps>
                  </View>
                )
              })}
            </Verre>
          </Section>
        ) : null}

        {/* Historique chaîné */}
        <Section titre={`Historique · ${historique.length}`}>
          {historique.map(e => (
            <View key={e.seq} style={{ flexDirection: 'row', gap: 12 }}>
              <Mono taille={11} couleur={theme.colors.grey}>
                #{String(e.seq).padStart(3, '0')}
              </Mono>
              <View style={{ flex: 1, gap: 2 }}>
                <Corps taille={14}>{e.type}</Corps>
                <Mono taille={10} couleur={theme.colors.grey}>
                  {e.le.slice(0, 16).replace('T', ' ')} · {e.hachage.slice(0, 12)}
                </Mono>
              </View>
            </View>
          ))}
        </Section>
      </ScrollView>
    </Container>
  )
}

export default RealiteScreen

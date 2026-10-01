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
import VueEclatee from './VueEclatee'
import Text from '~common/ui/Text'
import {
  BarreHaut,
  BoutonRond,
  FondLumiere,
  POLICES,
  Pilule,
  police,
  Confiance,
  Corps,
  Mono,
  Pastille,
  Points,
  Separateur,
  Surtitre,
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

const ETATS_LISIBLES: Record<string, string> = {
  recu: 'Reçue',
  verifie: 'Vérifiée',
  paye: 'Payée',
  conteste: 'Contestée',
  annule: 'Annulée',
  archive: 'Archivée',
  rembourse: 'Remboursée',
  disponible: 'Disponible',
  prete: 'Prêté',
  perdu: 'Perdu',
  'en-service': 'En service',
  'en-cours': 'En cours',
  preparee: 'Préparée',
  enregistre: 'Enregistré',
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

  // Manifestations dont une valeur diverge de l'original (ou de la plus fiable).
  const reference =
    r.manifestations.find(m => m.type === 'physique-original') ??
    [...r.manifestations].sort((x, y) => y.confiance - x.confiance)[0]
  const norm = (x: unknown) =>
    String(x)
      .replace(/[^\d,.-]/g, '')
      .replace(/,00$/, '')
      .replace(',', '.')
  const divergentes = new Set(
    r.manifestations
      .filter(
        m =>
          reference &&
          m.id !== reference.id &&
          Object.entries(m.donnees).some(
            ([k, val]) =>
              reference.donnees[k] !== undefined &&
              Number(norm(val)) !== Number(norm(reference.donnees[k]))
          )
      )
      .map(m => m.id)
  )
  const champEcart = reference
    ? Object.keys(reference.donnees).find(k =>
        r.manifestations.some(
          m =>
            divergentes.has(m.id) &&
            m.donnees[k] !== undefined &&
            Number(norm(m.donnees[k])) !== Number(norm(reference.donnees[k]))
        )
      )
    : undefined
  const valeurOriginale = champEcart && reference ? reference.donnees[champEcart] : undefined
  const autreValeur = champEcart
    ? r.manifestations.find(m => divergentes.has(m.id) && m.donnees[champEcart] !== undefined)
        ?.donnees[champEcart]
    : undefined
  const difference =
    valeurOriginale !== undefined && autreValeur !== undefined
      ? Math.abs(Number(norm(autreValeur)) - Number(norm(valeurOriginale)))
      : undefined
  const garder = () =>
    modifier(reg => {
      if (!champEcart || valeurOriginale === undefined) return
      for (const id of divergentes)
        reg.corrigerManifestation(
          id,
          { [champEcart]: valeurOriginale },
          {
            par: 'moi',
            note: 'Aligné sur l’original',
          }
        )
    })
  const idPoints = r.id.replace(/-/g, '·')
  const ref0 = r.referencesExternes[0]
  const rangementCourt = r.emplacement?.introuvable
    ? 'introuvable'
    : (r.emplacement?.rangement ?? [])
        .map(x => x.replace(/^(Classeur|Section|Pochette|Étagère|Rang)\s*/i, ''))
        .join('·') || '—'

  return (
    <FondLumiere>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 130, gap: 22 }}>
        <BarreHaut
          centre={
            <Pilule ton="verre">
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: ecarts.length ? theme.colors.quart : theme.colors.success,
                }}
              />
              <Text style={{ fontFamily: police(POLICES.titre), fontSize: 13 }}>
                {ETATS_LISIBLES[r.etat] ?? r.etat.charAt(0).toUpperCase() + r.etat.slice(1)} ·{' '}
                {r.historiqueEtats[r.historiqueEtats.length - 1]?.le.slice(8, 10)}/
                {r.historiqueEtats[r.historiqueEtats.length - 1]?.le.slice(5, 7)}
              </Text>
            </Pilule>
          }
          droite={
            <BoutonRond
              icone="more"
              libelle="Vérifier"
              onPress={() => router.push('/empreinte/verifier')}
            />
          }
        />

        {r.manifestations.length ? <VueEclatee realite={r} divergentes={divergentes} /> : null}

        {/* Identité */}
        <View style={{ gap: 6 }}>
          <Points taille={idPoints.length >= 13 ? 37 : 46}>{idPoints}</Points>
          <Text
            style={{ fontFamily: police(POLICES.moyen), fontSize: 15, color: theme.colors.grey }}
          >
            {ref0?.emetteur ? `${ref0.emetteur} → ` : ''}
            {r.titre}
            {r.sousType ? ` · ${r.sousType}` : ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: -8 }}>
          {[
            ['Original', rangementCourt, () => {}],
            ['Liens', `${relations.length}`, () => {}],
            ['Preuves', `${r.preuves.length}`, () => {}],
          ].map(([titre, valeur]) => (
            <Verre key={String(titre)} rayon={16} style={{ flex: 1, padding: 12, gap: 3 }}>
              <Surtitre>{String(titre)}</Surtitre>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: police(POLICES.monoMoyen),
                  fontSize: 13,
                  color: valeur === 'introuvable' ? theme.colors.quart : theme.colors.default,
                }}
              >
                {String(valeur)}
              </Text>
            </Verre>
          ))}
        </View>

        {/* Écart principal, avec la décision de la maquette */}
        {difference !== undefined ? (
          <Verre ecart style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ fontFamily: police(POLICES.gras), fontSize: 16 }}>
                Écart de {difference.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ')}
                {/€/.test(String(valeurOriginale)) || champEcart === 'montant' ? ' €' : ''}
              </Text>
              <Text
                style={{
                  fontFamily: police(POLICES.moyen),
                  fontSize: 13,
                  color: theme.colors.grey,
                }}
              >
                La saisie ne correspond pas à l’original
              </Text>
            </View>
            <Pressable
              onPress={garder}
              accessibilityRole="button"
              style={{
                height: 46,
                paddingHorizontal: 18,
                borderRadius: 23,
                backgroundColor: theme.colors.default,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: police(POLICES.titre),
                  fontSize: 14,
                  color: theme.colors.reverse,
                }}
              >
                Garder {String(valeurOriginale)}
              </Text>
            </Pressable>
          </Verre>
        ) : null}

        {/* Toutes les anomalies de cette réalité */}
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

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          <Pastille>{LIBELLES_GENRE[r.genre] ?? r.genre}</Pastille>
          <Pastille>{r.physiqueAttendu ? 'existe physiquement' : 'numérique seulement'}</Pastille>
          {r.referencesExternes.map(ref => (
            <Pastille key={ref.cle + ref.valeur}>{`${ref.cle} : ${ref.valeur}`}</Pastille>
          ))}
        </View>

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
    </FondLumiere>
  )
}

export default RealiteScreen

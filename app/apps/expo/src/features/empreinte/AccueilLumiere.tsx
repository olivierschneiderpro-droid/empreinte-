import React, { useMemo } from 'react'
import { Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import Svg, { Circle } from 'react-native-svg'
import type { Anomalie, Realite } from '@empreinte/core'
import Text from '~common/ui/Text'
import { useComputedPlanItems } from '~features/plans/plan.hooks'
import { useVerseOfTheDay } from '~features/home/useVerseOfTheDay'
import type { RootState } from '~redux/modules/reducer'
import { useTheme } from '~themes/ThemeProvider'
import { colorWithOpacity } from '~themes/colorValues'
import { Aurore, LogoEmpreinte, POLICES, police, styleVerre, useVerre } from './lumiere'
import { LIBELLES_GENRE, useEmpreinte } from './registreEmpreinte'

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]
const deux = (n: number) => String(n).padStart(2, '0')

export function Micro({ children, couleur }: { children: React.ReactNode; couleur?: string }) {
  const theme = useTheme()
  return (
    <Text
      numberOfLines={1}
      style={{
        fontFamily: police(POLICES.monoMoyen),
        fontSize: 10.5,
        letterSpacing: 0.84,
        textTransform: 'uppercase',
        color: couleur ?? theme.colors.grey,
      }}
    >
      {children}
    </Text>
  )
}

export function Dot({
  children,
  taille,
  couleur,
}: {
  children: React.ReactNode
  taille: number
  couleur?: string
}) {
  const theme = useTheme()
  return (
    <Text
      style={{
        fontFamily: police(POLICES.points),
        fontSize: taille,
        lineHeight: taille * 1.02,
        letterSpacing: -0.02 * taille,
        color: couleur ?? theme.colors.default,
      }}
    >
      {children}
    </Text>
  )
}

/** Anneau de progression de la maquette. */
export function Anneau({
  part,
  taille = 64,
  couleur,
}: {
  part: number
  taille?: number
  couleur?: string
}) {
  const theme = useTheme()
  const ep = 7
  const r = (taille - ep) / 2
  const c = 2 * Math.PI * r
  return (
    <Svg width={taille} height={taille}>
      <Circle
        cx={taille / 2}
        cy={taille / 2}
        r={r}
        fill="none"
        stroke="rgba(11,11,18,.08)"
        strokeWidth={ep}
      />
      <Circle
        cx={taille / 2}
        cy={taille / 2}
        r={r}
        fill="none"
        stroke={couleur ?? theme.colors.secondary}
        strokeWidth={ep}
        strokeLinecap="round"
        strokeDasharray={`${c * Math.min(1, Math.max(0, part))} ${c}`}
        transform={`rotate(-90 ${taille / 2} ${taille / 2})`}
      />
    </Svg>
  )
}

/** Résumé du jour : réalités, traces, écarts, réalité à la une. */
export function useJourEmpreinte() {
  const { registre, anomalies } = useEmpreinte()
  return useMemo(() => {
    const maintenant = new Date()
    const jour = maintenant.toISOString().slice(0, 10)
    const traces = registre.journal.filter(e => e.le.slice(0, 10) === jour).length
    const ecarts = anomalies.filter(a => a.gravite !== 'info')
    const parId = new Map<string, Anomalie[]>()
    for (const a of ecarts)
      for (const id of a.realiteIds) parId.set(id, [...(parId.get(id) ?? []), a])
    const documents = registre.realites.filter(r => r.genre === 'document')
    const une: Realite | undefined =
      documents.find(r => parId.has(r.id)) ??
      documents[documents.length - 1] ??
      registre.realites[0]
    const mission = registre.realites.find(r => r.genre === 'mission')
    return { maintenant, traces, ecarts, parId, une, mission, registre }
  }, [registre, anomalies])
}

/** Valeurs en désaccord pour un champ (ex. 1 250 ≠ 1 520). */
export function desaccord(r: Realite | undefined): string | undefined {
  if (!r) return undefined
  const valeurs = new Map<string, Set<string>>()
  for (const m of r.manifestations)
    for (const [k, v] of Object.entries(m.donnees)) {
      const n = String(v)
        .replace(/[^\d,.-]/g, '')
        .replace(/,00$/, '')
        .replace(',', '.')
      const propre = n ? String(Math.round(Number(n))) : String(v)
      valeurs.set(k, (valeurs.get(k) ?? new Set()).add(propre))
    }
  for (const [, ens] of valeurs)
    if (ens.size > 1)
      return [...ens]
        .slice(0, 2)
        .map(x => (/^\d+$/.test(x) ? Number(x).toLocaleString('fr-FR').replace(/ | /g, ' ') : x))
        .join(' ≠ ')
  return undefined
}

/** Feuille de papier miniature : la réalité physique à côté de son empreinte. */
export function MiniPapier({ realite, largeur = 140 }: { realite: Realite; largeur?: number }) {
  const original = realite.manifestations.find(m => m.type === 'physique-original')
  const ref = realite.referencesExternes[0]
  const lignes = Object.entries(original?.donnees ?? realite.attributs).slice(0, 3)
  return (
    <View
      style={{
        width: largeur,
        backgroundColor: '#FFFEFA',
        borderRadius: 3,
        padding: 12,
        gap: 5,
        transform: [{ rotate: '3deg' }],
        shadowColor: '#111113',
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          fontFamily: police(POLICES.lecture),
          fontSize: 9,
          color: '#1F1A16',
          letterSpacing: 0.4,
        }}
      >
        {(ref?.emetteur ?? realite.titre).toUpperCase()}
      </Text>
      <Text
        numberOfLines={1}
        style={{ fontFamily: police(POLICES.lecture), fontSize: 8, color: '#4A4540' }}
      >
        {ref ? `${ref.valeur} · ` : ''}
        {String(realite.attributs.date ?? '')}
      </Text>
      <View style={{ height: 1, backgroundColor: '#E2DCD2' }} />
      {lignes.map(([k, v]) => (
        <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6 }}>
          <Text style={{ fontFamily: police(POLICES.lecture), fontSize: 8, color: '#4A4540' }}>
            {k}
          </Text>
          <Text style={{ fontFamily: police(POLICES.lecture), fontSize: 8, color: '#1F1A16' }}>
            {String(v)}
          </Text>
        </View>
      ))}
    </View>
  )
}

/** En-tête de l'accueil : marque, bouton profil, date en points, traces du jour. */
export function TeteAccueil({ compact = false }: { compact?: boolean }) {
  const theme = useTheme()
  const router = useRouter()
  const v = useVerre()
  const { maintenant, traces, ecarts } = useJourEmpreinte()
  const initiale = useSelector((state: RootState) =>
    (state.user.displayName || state.user.email || 'O').trim().charAt(0).toUpperCase()
  )
  return (
    <View style={{ gap: 2 }}>
      {!compact ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 22,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <LogoEmpreinte taille={22} />
            <Text style={{ fontFamily: police(POLICES.gras), fontSize: 18, letterSpacing: -0.36 }}>
              empreinte
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Profil"
            style={[
              styleVerre(v, 22),
              { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
            ]}
          >
            <Text style={{ fontFamily: police(POLICES.gras), fontSize: 15 }}>{initiale}</Text>
          </Pressable>
        </View>
      ) : null}
      <Micro>
        {compact
          ? `${JOURS[maintenant.getDay()]} ${maintenant.getDate() === 1 ? '1er' : maintenant.getDate()} ${MOIS[maintenant.getMonth()]}`
          : `${JOURS[maintenant.getDay()]} · ${MOIS[maintenant.getMonth()]}`}
      </Micro>
      <Dot
        taille={compact ? 104 : 96}
      >{`${deux(maintenant.getDate())}.${deux(maintenant.getMonth() + 1)}`}</Dot>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <Text style={{ fontFamily: police(POLICES.gras), fontSize: 15 }}>
          {traces} trace{traces > 1 ? 's' : ''}
        </Text>
        <Text style={{ fontFamily: police(POLICES.moyen), fontSize: 15, color: theme.colors.grey }}>
          aujourd’hui
        </Text>
        {ecarts.length ? (
          <>
            <Text style={{ color: theme.colors.grey }}>•</Text>
            <Text
              style={{ fontFamily: police(POLICES.titre), fontSize: 15, color: theme.colors.quart }}
            >
              {ecarts.length} écart{ecarts.length > 1 ? 's' : ''}
            </Text>
          </>
        ) : null}
      </View>
    </View>
  )
}

/** Pile de cartes : la réalité à la une devant, la mission et la Bible derrière. */
export function PileRealites({ bibleRef }: { bibleRef?: string }) {
  const theme = useTheme()
  const router = useRouter()
  const v = useVerre()
  const { une, parId, mission } = useJourEmpreinte()
  if (!une) return null
  const ecart = parId.has(une.id) ? desaccord(une) : undefined
  const ref = une.referencesExternes[0]?.valeur ?? une.id
  const rangement = une.emplacement?.rangement
    .map(x => x.replace(/^(Classeur|Section|Pochette|Étagère|Rang)\s*/i, ''))
    .join('·')
  const heure = une.creeLe.slice(11, 16)
  const fondCarte = (decalage: number, couleur: string, opacite: number) => ({
    position: 'absolute' as const,
    left: 20 + decalage,
    right: 20 + decalage,
    height: 60,
    borderRadius: 22,
    backgroundColor: couleur,
    opacity: opacite,
  })
  return (
    <View style={{ paddingTop: 48 }}>
      <View
        style={[
          fondCarte(20, colorWithOpacity(theme.colors.default, 0.04) ?? '', 1),
          { top: 0, paddingTop: 12, paddingHorizontal: 20 },
        ]}
      >
        <Micro>
          {mission ? `Mission · ${mission.titre.replace(/^Mission\s*/i, '')}` : 'Mission'}
        </Micro>
      </View>
      <View
        style={[
          fondCarte(0, theme.colors.lightSecondary, 1),
          { top: 22, paddingTop: 12, paddingHorizontal: 20 },
        ]}
      >
        <Micro couleur={theme.colors.reverse}>{`Bible · ${bibleRef ?? 'Jean 3'}`}</Micro>
      </View>
      <Pressable
        onPress={() => router.push({ pathname: '/empreinte/realite', params: { id: une.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${une.titre}, ${une.id}`}
        style={[
          styleVerre(v, 24),
          {
            padding: 18,
            minHeight: 172,
            flexDirection: 'row',
            backgroundColor: colorWithOpacity(theme.colors.reverse, 0.86),
          },
        ]}
      >
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Micro>{`${LIBELLES_GENRE[une.genre] ?? une.genre}${une.sousType?.startsWith('facture') ? '' : ''} · reçue ${heure}`}</Micro>
          <Dot taille={34}>{ref}</Dot>
          <Text
            style={{ fontFamily: police(POLICES.mono), fontSize: 11.5, color: theme.colors.grey }}
          >
            {une.id}
            {rangement ? ` · ${rangement}` : ''}
          </Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <MiniPapier realite={une} largeur={132} />
        </View>
        {ecart ? (
          <View
            style={[
              styleVerre(v, 17),
              {
                position: 'absolute',
                right: -6,
                top: -18,
                height: 34,
                paddingHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
              },
            ]}
          >
            <View
              style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.quart }}
            />
            <Text
              style={{
                fontFamily: police(POLICES.titre),
                fontSize: 12.5,
                color: theme.colors.quart,
              }}
            >
              {ecart}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  )
}

/** Verset du jour (Bible Strong) dans la carte de la maquette. */
export function CarteVerset({ large = false }: { large?: boolean }) {
  const theme = useTheme()
  const router = useRouter()
  const v = useVerre()
  const verset = useVerseOfTheDay(0)
  const ok = verset && !('error' in verset)
  const reference = ok ? verset.title : 'Ps 23.1'
  const texte = ok ? verset.content : 'L’Éternel est mon berger : je ne manquerai de rien.'
  return (
    <Pressable
      onPress={() => router.push('/daily-verse')}
      accessibilityRole="button"
      style={[styleVerre(v, 24), { paddingVertical: 16, paddingHorizontal: 18, gap: 6 }]}
    >
      <Micro>{`Verset du jour · ${reference}`}</Micro>
      <Text
        numberOfLines={large ? 2 : 4}
        style={{
          fontFamily: police(POLICES.lecture),
          fontSize: 18,
          lineHeight: 25,
          color: theme.colors.default,
        }}
      >
        « {texte.trim()} »
      </Text>
    </Pressable>
  )
}

/** Mission (registre Empreinte) et plan de lecture (Bible Strong), côte à côte. */
export function CartesMissionPlan() {
  const theme = useTheme()
  const router = useRouter()
  const v = useVerre()
  const { mission } = useJourEmpreinte()
  const plans = useComputedPlanItems()
  const plan = plans.find(p => p.status === 'Progress') ?? plans[0]
  const objectif = Number(mission?.attributs.objectif ?? 0)
  const fait = Number(mission?.attributs.distribuees ?? 0)
  const jour = plan ? Math.max(1, Math.round(plan.progress * 365)) : 0
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Pressable
        onPress={() =>
          mission
            ? router.push({ pathname: '/empreinte/realite', params: { id: mission.id } })
            : router.push('/empreinte')
        }
        style={[
          styleVerre(v, 24),
          { flex: 1, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
        ]}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Anneau part={objectif ? fait / objectif : 0} taille={58} />
          <View style={{ position: 'absolute' }}>
            <Dot taille={15}>{objectif ? Math.round((fait / objectif) * 100) : 0}</Dot>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={2} style={{ fontFamily: police(POLICES.gras), fontSize: 14.5 }}>
            {mission ? mission.titre.replace(/^Mission\s*/i, '') : 'Missions'}
          </Text>
          <Text
            style={{ fontFamily: police(POLICES.moyen), fontSize: 12.5, color: theme.colors.grey }}
          >
            {fait} remises
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() =>
          router.push(plan ? { pathname: '/plan', params: { planId: plan.id } } : '/plans')
        }
        style={[styleVerre(v, 24), { flex: 1, padding: 14, gap: 6 }]}
      >
        <Micro>Plan de lecture</Micro>
        {plan ? (
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
            <Dot taille={30}>{jour}</Dot>
            <Text
              numberOfLines={2}
              style={{
                flex: 1,
                fontFamily: police(POLICES.moyen),
                fontSize: 12.5,
                color: theme.colors.grey,
              }}
            >
              /365 · {plan.title}
            </Text>
          </View>
        ) : (
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>Choisir un plan →</Text>
        )}
      </Pressable>
    </View>
  )
}

/** Accueil mobile de la maquette, posé au-dessus des contenus de Bible Strong. */
export default function AccueilLumiere() {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 16 }}>
      <Aurore />
      <TeteAccueil />
      <PileRealites />
      <CarteVerset />
      <CartesMissionPlan />
    </View>
  )
}

const TYPES_JOURNAL: Record<string, string> = {
  integration: 'Intégrée',
  manifestation: 'Nouvelle manifestation',
  correction: 'Correction',
  emplacement: 'Rangée',
  introuvable: 'Signalée introuvable',
  etat: 'Changement d’état',
  preuve: 'Preuve ajoutée',
  marquage: 'Marquée',
  relation: 'Reliée',
  passages: 'Passages liés',
}

/** Colonne droite du bureau : ce qui attend une vérification. */
export function CarteAVerifier() {
  const theme = useTheme()
  const router = useRouter()
  const v = useVerre()
  const { ecarts, registre } = useJourEmpreinte()
  return (
    <View style={[styleVerre(v, 24), { padding: 18, gap: 4 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8 }}>
        <Micro>À vérifier</Micro>
        <Dot taille={16} couleur={ecarts.length ? theme.colors.quart : undefined}>
          {ecarts.length}
        </Dot>
      </View>
      {ecarts.slice(0, 5).map((a, i) => {
        const id = a.realiteIds[0]
        const r = registre.chercher(id)
        return (
          <Pressable
            key={i}
            onPress={() => router.push({ pathname: '/empreinte/realite', params: { id } })}
            style={{
              flexDirection: 'row',
              gap: 10,
              paddingVertical: 11,
              borderTopWidth: 1,
              borderTopColor: v.ligne,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                marginTop: 7,
                backgroundColor: i === 0 ? theme.colors.quart : theme.colors.secondary,
              }}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <Text numberOfLines={1} style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>
                {r?.titre ?? a.code}
              </Text>
              <Text
                style={{ fontFamily: police(POLICES.mono), fontSize: 11, color: theme.colors.grey }}
              >
                {id}
              </Text>
            </View>
          </Pressable>
        )
      })}
      {ecarts.length === 0 ? (
        <Text
          style={{ fontFamily: police(POLICES.moyen), fontSize: 13.5, color: theme.colors.grey }}
        >
          Tout concorde.
        </Text>
      ) : null}
    </View>
  )
}

/** Fil du jour : le journal chaîné, le plus récent en premier. */
export function FilDuJour() {
  const theme = useTheme()
  const router = useRouter()
  const v = useVerre()
  const { registre } = useJourEmpreinte()
  const evenements = [...registre.journal]
    .reverse()
    .filter(e => e.realiteId)
    .slice(0, 6)
  return (
    <View style={[styleVerre(v, 24), { padding: 18, gap: 12 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Micro>Fil du jour</Micro>
        <Pressable onPress={() => router.push('/empreinte')}>
          <Micro couleur={theme.colors.default}>Journal ›</Micro>
        </Pressable>
      </View>
      {evenements.map((e, i) => {
        const r = e.realiteId ? registre.chercher(e.realiteId) : undefined
        return (
          <View key={e.seq} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ alignItems: 'center', width: 12 }}>
              <View
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: i === 0 ? theme.colors.default : theme.colors.grey,
                  marginTop: 3,
                }}
              />
              {i < evenements.length - 1 ? (
                <View style={{ flex: 1, width: 1, backgroundColor: v.ligne, marginTop: 3 }} />
              ) : null}
            </View>
            <View style={{ flex: 1, gap: 1, paddingBottom: 4 }}>
              <Text numberOfLines={1} style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>
                {r?.titre ?? e.realiteId}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: police(POLICES.moyen),
                  fontSize: 12.5,
                  color: theme.colors.grey,
                }}
              >
                {TYPES_JOURNAL[e.type] ?? e.type}
              </Text>
            </View>
            <Text
              style={{ fontFamily: police(POLICES.mono), fontSize: 11, color: theme.colors.grey }}
            >
              {e.le.slice(11, 16)}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

/** Où sont les originaux : occupation des rangements, segment rouge pour un introuvable. */
export function OuSontLesOriginaux() {
  const theme = useTheme()
  const v = useVerre()
  const { registre } = useJourEmpreinte()
  const groupes = new Map<string, Realite[]>()
  for (const r of registre.realites) {
    const cle =
      r.emplacement?.rangement[0] ??
      r.emplacement?.dossier[0] ??
      (r.emplacement?.introuvable ? 'Introuvables' : undefined)
    if (!cle) continue
    groupes.set(cle, [...(groupes.get(cle) ?? []), r])
  }
  return (
    <View style={[styleVerre(v, 24), { padding: 18, gap: 12 }]}>
      <Micro>Où sont les originaux</Micro>
      {[...groupes.entries()].map(([cle, liste]) => (
        <View key={cle} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>{cle}</Text>
            <Text
              style={{ fontFamily: police(POLICES.mono), fontSize: 11, color: theme.colors.grey }}
            >
              {liste.length} réalité{liste.length > 1 ? 's' : ''}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {Array.from({ length: 12 }, (_, i) => {
              const r = liste[i]
              return (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 9,
                    borderRadius: 2,
                    backgroundColor: r
                      ? r.emplacement?.introuvable
                        ? theme.colors.quart
                        : theme.colors.default
                      : v.doux,
                  }}
                />
              )
            })}
          </View>
        </View>
      ))}
    </View>
  )
}

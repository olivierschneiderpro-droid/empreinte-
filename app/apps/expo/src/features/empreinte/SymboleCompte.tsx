import { atom, useAtomValue } from 'jotai'
import Svg, { Circle, Ellipse, G, Path, Text as SvgText } from 'react-native-svg'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'
import useLogin from '~helpers/useLogin'

/**
 * Empreinte : le symbole du compte remplace l'avatar « flamme » de Bible Strong. Chacun le
 * choisit à l'inscription ou dans les réglages ; il suit la personne dans toute l'app
 * (barre latérale, profil, parcours) et grandit avec sa régularité.
 */
export const SYMBOLES = [
  'empreinte',
  'lampe',
  'pas',
  'graine',
  'sceau',
  'ancre',
  'rameau',
  'etoile',
] as const
export type Symbole = (typeof SYMBOLES)[number]

export const INFOS_SYMBOLES: Record<Symbole, { nom: string; sens: string; couleur: string }> = {
  empreinte: {
    nom: 'Empreinte',
    sens: 'La Parole laisse sa trace en moi',
    couleur: '#1D4ED8',
  },
  lampe: {
    nom: 'Lampe',
    sens: 'Ta parole est une lampe à mes pieds (Ps 119:105)',
    couleur: '#C2410C',
  },
  pas: { nom: 'Pas', sens: 'Marcher avec la Parole, jour après jour', couleur: '#0F766E' },
  graine: { nom: 'Graine', sens: 'La semence qui pousse (Mc 4:26-29)', couleur: '#15803D' },
  sceau: { nom: 'Sceau', sens: 'Mon nom, gravé dans le cachet', couleur: '#BE123C' },
  ancre: { nom: 'Ancre', sens: 'Une ancre de l’âme, sûre et solide (Hé 6:19)', couleur: '#334155' },
  rameau: {
    nom: 'Rameau',
    sens: 'Le rameau d’olivier, signe de paix (Gn 8:11)',
    couleur: '#65A30D',
  },
  etoile: { nom: 'Étoile', sens: 'L’étoile du matin se lève (2 P 1:19)', couleur: '#A16207' },
}

export const symboleCompteAtom = atomWithAsyncStorage<Symbole>('empreinte.symbole', 'empreinte')
/** Les jours où la personne a lu ou écouté la Parole (AAAA-MM-JJ), gardés dans le compte. */
export const joursDeLectureAtom = atomWithAsyncStorage<string[]>('empreinte.joursDeLecture', [])

const jour = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

/** Note qu'aujourd'hui, on a lu ou écouté la Parole. */
export const noterLecture = (jours: string[]) => {
  const aujourdhui = jour(new Date())
  return jours.includes(aujourdhui) ? jours : [...jours, aujourdhui].slice(-400)
}

/** Jours de lecture d'affilée, jusqu'à aujourd'hui (ou hier, pour ne pas punir le matin). */
export const regulariteAtom = atom(get => {
  const jours = new Set(get(joursDeLectureAtom))
  const curseur = new Date()
  if (!jours.has(jour(curseur))) curseur.setDate(curseur.getDate() - 1)
  let total = 0
  while (jours.has(jour(curseur))) {
    total += 1
    curseur.setDate(curseur.getDate() - 1)
  }
  return total
})

export const niveauDeRegularite = (jours: number) =>
  jours >= 30 ? 3 : jours >= 7 ? 2 : jours >= 1 ? 1 : 0

const initialesDe = (nom?: string) =>
  (nom ?? '')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(mot => mot[0]?.toUpperCase())
    .join('') || 'E'

export function DessinSymbole({
  symbole,
  taille = 40,
  actif = true,
  niveau = 1,
  initiales = 'E',
  fond = true,
}: {
  symbole: Symbole
  taille?: number
  /** false = invité : le symbole est esquissé en pointillés, en attente. */
  actif?: boolean
  niveau?: number
  initiales?: string
  fond?: boolean
}) {
  const couleur = actif ? INFOS_SYMBOLES[symbole].couleur : '#9A9AA0'
  const trait = {
    stroke: couleur,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
    strokeDasharray: actif ? undefined : '3 3.2',
  }
  const plein = actif ? couleur : 'none'
  return (
    <Svg width={taille} height={taille} viewBox="0 0 48 48">
      {fond ? <Circle cx={24} cy={24} r={24} fill={actif ? `${couleur}1F` : '#9A9AA01A'} /> : null}
      {symbole === 'empreinte' && (
        <G {...trait}>
          <Path d="M15 33c-1.6-2.4-2.4-5-2.4-8.2a11.4 11.4 0 0 1 22.8 0" />
          <Path d="M19 35.5c-1.3-2.5-2-5.6-2-9.4a7 7 0 0 1 14 0c0 3.2-.6 6-1.8 8.6" />
          <Path d="M24 36.5c-.9-2.8-1.4-6.3-1.4-10.4a1.4 1.4 0 0 1 2.8 0c0 3.6-.3 6.4-1 9" />
          {niveau >= 2 && <Path d="M11 29.5a14.8 14.8 0 0 1 26-14.6" />}
          {niveau >= 3 && <Path d="M36.4 30.5c.5-1.8.7-3.6.6-5.5" />}
        </G>
      )}
      {symbole === 'lampe' && (
        <G>
          <Path
            {...trait}
            d="M10 29c3 4.4 8.6 6 14 6s10.4-1.4 13.4-5.2c.8-1 .2-2.3-1-2.3H25.5c-1.6 0-3.2-.6-4.4-1.6L18 23.4c-1.6-1.2-4-.9-5.3.7-1.3 1.5-2.4 3.2-2.7 4.9Z"
          />
          <Path {...trait} d="M37.5 27.5c1.6-.6 2.8-1.9 3-3.6" />
          <Path {...trait} d="M18 38h12" />
          {actif && (
            <Path
              d={`M24 ${21 - niveau * 2.2}c-2.6 2.6-3.6 4.6-3.6 6.2a3.6 3.6 0 0 0 7.2 0c0-1.6-1-3.6-3.6-6.2Z`}
              fill="#F59E0B"
            />
          )}
        </G>
      )}
      {symbole === 'pas' && (
        <G>
          <Ellipse {...trait} fill={plein} cx={18} cy={30} rx={4.4} ry={6.4} />
          <Circle cx={15.4} cy={21.6} r={1.5} fill={couleur} />
          <Circle cx={18.6} cy={21} r={1.5} fill={couleur} />
          <Circle cx={21.4} cy={22.2} r={1.3} fill={couleur} />
          <Ellipse
            {...trait}
            fill={niveau >= 1 ? plein : 'none'}
            cx={30}
            cy={22}
            rx={4.4}
            ry={6.4}
          />
          <Circle cx={27.4} cy={13.6} r={1.5} fill={couleur} />
          <Circle cx={30.6} cy={13} r={1.5} fill={couleur} />
          <Circle cx={33.4} cy={14.2} r={1.3} fill={couleur} />
        </G>
      )}
      {symbole === 'graine' && (
        <G>
          <Path {...trait} d="M12 38h24" />
          {niveau === 0 || !actif ? (
            <Ellipse {...trait} fill={plein} cx={24} cy={33} rx={4} ry={3} />
          ) : (
            <G>
              <Path {...trait} d={`M24 38V${niveau >= 3 ? 16 : niveau >= 2 ? 22 : 28}`} />
              <Path
                {...trait}
                fill={plein}
                d="M24 30c-4.6 0-7.4-2.6-7.6-6.6 4.4 0 7.4 2.4 7.6 6.6Z"
              />
              {niveau >= 2 && (
                <Path
                  {...trait}
                  fill={plein}
                  d="M24 25c4.8 0 7.6-2.8 7.8-7 -4.6 0-7.6 2.6-7.8 7Z"
                />
              )}
              {niveau >= 3 && <Circle {...trait} fill={`${couleur}55`} cx={24} cy={14} r={7.5} />}
            </G>
          )}
        </G>
      )}
      {symbole === 'sceau' && (
        <G>
          <Path
            {...trait}
            fill={actif ? `${couleur}22` : 'none'}
            d="M24 8l3.4 2.6 4.2-.6 1.6 4 4 1.6-.6 4.2L39.2 23l-2.6 3.4.6 4.2-4 1.6-1.6 4-4.2-.6L24 38.2l-3.4-2.6-4.2.6-1.6-4-4-1.6.6-4.2L8.8 23l2.6-3.4-.6-4.2 4-1.6 1.6-4 4.2.6Z"
          />
          <SvgText
            x={24}
            y={27.6}
            fontSize={initiales.length > 1 ? 11 : 13}
            fontWeight="bold"
            fill={couleur}
            textAnchor="middle"
          >
            {actif ? initiales : '?'}
          </SvgText>
        </G>
      )}
      {symbole === 'ancre' && (
        <G {...trait}>
          <Circle cx={24} cy={12.5} r={3} />
          <Path d="M24 15.5V38" />
          <Path d="M17.5 20h13" />
          <Path d="M12 28c1 6 6 10 12 10s11-4 12-10" />
          <Path d="M12 28l-2 3M12 28l3.2 1.6M36 28l2 3M36 28l-3.2 1.6" />
        </G>
      )}
      {symbole === 'rameau' && (
        <G>
          <Path {...trait} d="M12 38C18 32 25 24 35 10" />
          {[
            'M16.5 33.5c-4.6.4-6.6-1.6-6.8-4.6 3.8-.4 6.2 1.4 6.8 4.6Z',
            'M19.5 30c.6-4.6 3.2-6.4 6.2-6.2-.2 3.8-2.4 6-6.2 6.2Z',
            'M23.2 25.4c-4.4-1.2-5.6-3.8-5-6.6 3.6.8 5.4 3.2 5 6.6Z',
            'M26.6 21.2c1.4-4.4 4.2-5.6 7-4.8-.8 3.6-3.4 5.2-7 4.8Z',
            'M30.4 15.6c-3.6-2.8-3.8-5.6-2.4-8 3.2 1.8 4 4.6 2.4 8Z',
          ].map((d, i) => (
            <Path
              key={i}
              {...trait}
              strokeWidth={1.8}
              fill={i < niveau + 2 ? plein : 'none'}
              d={d}
            />
          ))}
        </G>
      )}
      {symbole === 'etoile' && (
        <G>
          <Path
            {...trait}
            fill={actif ? `${couleur}33` : 'none'}
            d="M24 8l3 10.2L37 15l-6.8 8.9L37 33l-10-3.2L24 40l-3-10.2L11 33l6.8-9.1L11 15l10 3.2Z"
          />
          {actif && niveau >= 2 && <Circle cx={24} cy={24} r={3} fill={couleur} />}
        </G>
      )}
    </Svg>
  )
}

/** Le symbole de la personne connectée (ou l'esquisse en pointillés pour un invité). */
export default function SymboleCompte({ taille = 40 }: { taille?: number }) {
  const symbole = useAtomValue(symboleCompteAtom)
  const regularite = useAtomValue(regulariteAtom)
  const { isLogged, user } = useLogin()
  return (
    <DessinSymbole
      symbole={symbole}
      taille={taille}
      actif={isLogged}
      niveau={Math.max(1, niveauDeRegularite(regularite))}
      initiales={initialesDe(user?.displayName || user?.email)}
    />
  )
}

/** Empreinte : le symbole qui célèbre une étape ou la fin d'un parcours (au lieu de la
 * couronne et de la médaille de Bible Strong). Il apparaît en douceur, à sa taille finale. */
export function SymboleDeParcours({
  taille = 40,
  complet = false,
}: {
  taille?: number
  complet?: boolean
}) {
  const symbole = useAtomValue(symboleCompteAtom)
  return (
    <DessinSymbole symbole={symbole} taille={taille} niveau={complet ? 3 : 2} fond={taille > 60} />
  )
}

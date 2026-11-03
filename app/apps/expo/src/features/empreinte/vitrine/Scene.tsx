import type { ReactNode } from 'react'
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg'

/**
 * Empreinte · Les illustrations des vitrines : des paysages et des objets dessinés, sans
 * aucun personnage (rien ne représente le Christ). Toutes tiennent dans un cadre 320 × 200
 * et se recadrent sans se déformer.
 */
export type NomScene =
  | 'aube'
  | 'desert'
  | 'ville'
  | 'nuit'
  | 'montagne'
  | 'riviere'
  | 'chemin'
  | 'mer'
  | 'rouleau'
  | 'lampe'
  | 'lumiere'
  | 'ble'
  | 'jardin'

export const SCENES: NomScene[] = [
  'aube',
  'desert',
  'ville',
  'nuit',
  'montagne',
  'riviere',
  'chemin',
  'mer',
  'rouleau',
  'lampe',
  'lumiere',
  'ble',
  'jardin',
]

const COLLINES = {
  loin: 'M0 128 C60 100 110 116 160 104 C220 90 272 110 320 98 V200 H0Z',
  milieu: 'M0 150 C70 124 122 146 182 132 C240 118 282 140 320 130 V200 H0Z',
  pres: 'M0 172 C82 154 152 176 222 160 C262 151 292 162 320 156 V200 H0Z',
}

type Decor = {
  ciel: [string, string]
  astre?: { x: number; y: number; r: number; couleur: string; halo?: string }
  couches?: [string, string][]
  devant?: ReactNode
}

const decors: Record<NomScene, Decor> = {
  // L'aube sur les collines : le commencement.
  aube: {
    ciel: ['#F8C9A0', '#FCE9D2'],
    astre: { x: 160, y: 112, r: 30, couleur: '#FFF4E0', halo: '#FFD9A8' },
    couches: [
      [COLLINES.loin, '#E7A982'],
      [COLLINES.milieu, '#C9806A'],
      [COLLINES.pres, '#8E5A55'],
    ],
  },
  // Les dunes et le soleil haut : le désert, la marche.
  desert: {
    ciel: ['#F3D7A6', '#FBEFD8'],
    astre: { x: 236, y: 58, r: 22, couleur: '#FFF6E2', halo: '#F8DFAE' },
    couches: [
      ['M0 132 C80 110 150 140 230 120 C270 110 300 118 320 114 V200 H0Z', '#E4B877'],
      ['M0 160 C60 140 120 150 180 142 C240 134 290 152 320 146 V200 H0Z', '#D29A57'],
      ['M0 182 C90 166 170 188 250 172 C280 166 304 170 320 168 V200 H0Z', '#B27941'],
    ],
  },
  // Une ville fortifiée sur la colline : l'histoire d'un peuple.
  ville: {
    ciel: ['#BFD3E6', '#EAF1F7'],
    astre: { x: 70, y: 52, r: 16, couleur: '#FFFFFF' },
    couches: [[COLLINES.loin, '#A8BCCF']],
    devant: (
      <G>
        <Path d="M0 150 C80 120 240 120 320 150 V200 H0Z" fill="#8FA3B8" />
        <G fill="#E9DFCB">
          <Rect x="96" y="104" width="128" height="30" />
          <Rect x="110" y="88" width="20" height="46" />
          <Rect x="150" y="80" width="22" height="54" />
          <Rect x="192" y="90" width="18" height="44" />
          <Path d="M146 80 L161 64 L176 80Z" />
        </G>
        <G fill="#C9BBA0">
          <Rect x="156" y="114" width="10" height="20" rx="5" />
          <Rect x="114" y="96" width="5" height="7" />
          <Rect x="198" y="98" width="5" height="7" />
        </G>
        <Path d="M0 176 C90 160 200 180 320 166 V200 H0Z" fill="#6E8399" />
      </G>
    ),
  },
  // La nuit étoilée : la louange, la poésie.
  nuit: {
    ciel: ['#1B2A4A', '#3B4F7A'],
    astre: { x: 236, y: 56, r: 18, couleur: '#F4EFD8', halo: '#5B6E98' },
    couches: [
      [COLLINES.milieu, '#26375C'],
      [COLLINES.pres, '#16223D'],
    ],
    devant: (
      <G fill="#F4EFD8">
        {[
          [40, 30, 1.6],
          [90, 54, 1.2],
          [130, 24, 1.8],
          [180, 44, 1.1],
          [60, 80, 1],
          [290, 30, 1.4],
          [270, 92, 1],
          [150, 72, 1.3],
          [20, 60, 1.1],
          [210, 20, 1.2],
        ].map(([x, y, r]) => (
          <Circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
        <Circle cx="243" cy="50" r="16" fill="#233355" />
      </G>
    ),
  },
  // Les sommets et la lumière : les prophètes.
  montagne: {
    ciel: ['#9FB7CF', '#E4EDF4'],
    astre: { x: 250, y: 50, r: 14, couleur: '#FFFFFF', halo: '#CFDDEA' },
    devant: (
      <G>
        <Path d="M0 160 L58 96 L92 124 L150 54 L204 118 L238 88 L320 150 V200 H0Z" fill="#6F8199" />
        <Path d="M150 54 L132 76 L144 72 L152 82 L162 70 L170 76Z" fill="#F4F7FA" />
        <Path d="M58 96 L48 108 L60 104 L68 110Z" fill="#F4F7FA" />
        <Path d="M238 88 L228 98 L240 96 L246 102Z" fill="#F4F7FA" />
        <Path d="M0 178 C80 156 160 182 240 164 C276 156 300 162 320 160 V200 H0Z" fill="#4E5F76" />
      </G>
    ),
  },
  // La rivière qui serpente : l'appel au retour.
  riviere: {
    ciel: ['#BFE0DA', '#EEF7F4'],
    couches: [
      [COLLINES.loin, '#9CC7B8'],
      [COLLINES.milieu, '#76AB98'],
    ],
    devant: (
      <G>
        <Path d="M0 166 C70 150 150 172 220 158 C266 150 296 156 320 154 V200 H0Z" fill="#4F8A74" />
        <Path
          d="M168 132 C150 142 186 150 160 162 C136 172 190 184 150 200 L196 200 C226 186 172 176 196 164 C214 154 182 146 176 132Z"
          fill="#D9EEF0"
        />
      </G>
    ),
  },
  // Le chemin vers l'horizon : la Voie, l'Évangile.
  chemin: {
    ciel: ['#F6DDB8', '#FDF4E6'],
    astre: { x: 168, y: 104, r: 24, couleur: '#FFF8EC', halo: '#FBE3BE' },
    couches: [
      [COLLINES.loin, '#D8C29A'],
      [COLLINES.milieu, '#B5A378'],
      [COLLINES.pres, '#8C7D58'],
    ],
    devant: (
      <Path
        d="M150 200 C160 184 138 170 158 156 C172 146 160 134 166 126 L170 126 C168 136 182 146 168 158 C150 172 182 186 178 200Z"
        fill="#F2E3C4"
      />
    ),
  },
  // La mer et la voile : les voyages des apôtres.
  mer: {
    ciel: ['#A9CDE5', '#E6F2FA'],
    astre: { x: 82, y: 60, r: 18, couleur: '#FFFFFF', halo: '#D3E7F4' },
    devant: (
      <G>
        <Path d="M0 120 C80 116 240 124 320 118 V200 H0Z" fill="#4D86AE" />
        <Path d="M0 146 C60 140 120 152 190 144 C250 138 290 146 320 142 V200 H0Z" fill="#3A6F95" />
        <Path d="M0 176 C90 168 180 182 320 172 V200 H0Z" fill="#2B5778" />
        <G stroke="#CFE4F2" strokeWidth="1.4" fill="none" strokeLinecap="round">
          <Path d="M30 132 h22" />
          <Path d="M226 158 h26" />
          <Path d="M120 168 h18" />
        </G>
        <Path d="M196 126 L240 126 L232 136 L204 136Z" fill="#6B4A32" />
        <Path d="M216 122 L216 84 L240 120Z" fill="#F7F1E6" />
        <Path d="M214 122 L214 92 L198 120Z" fill="#E7DDCC" />
      </G>
    ),
  },
  // Le rouleau déplié : la Parole écrite, les lettres.
  rouleau: {
    ciel: ['#E9D9BE', '#F7EEDD'],
    devant: (
      <G>
        <Rect x="70" y="56" width="180" height="96" rx="4" fill="#F8EFD9" />
        <Rect x="58" y="50" width="16" height="108" rx="8" fill="#B88A55" />
        <Rect x="246" y="50" width="16" height="108" rx="8" fill="#B88A55" />
        <G stroke="#C9B48E" strokeWidth="2" strokeLinecap="round">
          {[72, 84, 96, 108, 120, 132].map(y => (
            <Path key={y} d={`M92 ${y} H${y % 24 === 0 ? 200 : 228}`} />
          ))}
        </G>
        <Rect x="0" y="176" width="320" height="24" fill="#D5BE97" />
      </G>
    ),
  },
  // La lampe allumée : la vie intérieure, la Parole qui éclaire.
  lampe: {
    ciel: ['#2B2233', '#4A3A4E'],
    devant: (
      <G>
        <Circle cx="160" cy="92" r="70" fill="url(#halo-lampe)" />
        <Path d="M162 88 C150 76 160 60 164 50 C170 64 178 76 166 88Z" fill="#FFD27A" />
        <Path d="M163 86 C158 80 162 72 164 66 C168 74 170 80 165 86Z" fill="#FFF3C8" />
        <Path
          d="M106 112 C120 96 196 96 222 108 C236 112 240 120 226 124 L196 132 C170 140 140 138 120 128 C108 122 100 118 106 112Z"
          fill="#B7774A"
        />
        <Path d="M216 108 L250 98 C256 96 258 102 252 104 L226 118Z" fill="#9C6238" />
        <Ellipse cx="164" cy="104" rx="14" ry="4" fill="#5C3B24" />
        <Rect x="0" y="160" width="320" height="40" fill="#3A2E3C" />
      </G>
    ),
  },
  // La lumière qui perce : la promesse, la fin des temps.
  lumiere: {
    ciel: ['#E7E3F4', '#FBFAFF'],
    devant: (
      <G>
        <G fill="#FFFFFF" opacity={0.7}>
          {[-60, -36, -12, 12, 36, 60].map(angle => (
            <Path
              key={angle}
              d="M160 70 L150 -40 L170 -40Z"
              transform={`rotate(${angle} 160 70)`}
            />
          ))}
        </G>
        <Circle cx="160" cy="70" r="26" fill="#FFF6D6" />
        <Path
          d="M0 140 C40 124 80 132 120 126 C170 118 200 134 250 126 C280 122 304 128 320 124 V200 H0Z"
          fill="#CFC6E6"
        />
        <Path d="M0 168 C70 150 150 172 230 156 C270 150 300 156 320 152 V200 H0Z" fill="#ABA0CF" />
      </G>
    ),
  },
  // Le champ de blé : les paraboles, la moisson.
  ble: {
    ciel: ['#F5E2B0', '#FCF5E0'],
    astre: { x: 250, y: 58, r: 20, couleur: '#FFF8E6', halo: '#F7E3B0' },
    couches: [[COLLINES.loin, '#E2C47E']],
    devant: (
      <G>
        <Path d="M0 140 C80 126 160 146 240 134 C280 128 304 132 320 130 V200 H0Z" fill="#D7AE57" />
        <G stroke="#A9782F" strokeWidth="2" strokeLinecap="round">
          {[20, 52, 84, 116, 148, 180, 212, 244, 276, 304].map((x, i) => (
            <Path
              key={x}
              d={`M${x} 200 Q${x + 4} ${170 - (i % 3) * 6} ${x + 8} ${150 - (i % 3) * 6}`}
              fill="none"
            />
          ))}
        </G>
        <G fill="#C08A35">
          {[20, 52, 84, 116, 148, 180, 212, 244, 276, 304].map((x, i) => (
            <Ellipse key={x} cx={x + 8} cy={146 - (i % 3) * 6} rx="3.6" ry="8" />
          ))}
        </G>
      </G>
    ),
  },
  // L'arbre au jardin : la prière, demeurer.
  jardin: {
    ciel: ['#CFE6CF', '#F1F8EE'],
    astre: { x: 66, y: 54, r: 16, couleur: '#FFFFFF', halo: '#E3F1DD' },
    couches: [[COLLINES.loin, '#A9CDA2']],
    devant: (
      <G>
        <Path d="M0 156 C80 136 220 136 320 156 V200 H0Z" fill="#7FAF75" />
        <Rect x="186" y="96" width="10" height="56" rx="4" fill="#6B4E36" />
        <Circle cx="191" cy="84" r="34" fill="#4E8A52" />
        <Circle cx="170" cy="96" r="22" fill="#5C9A5E" />
        <Circle cx="214" cy="98" r="22" fill="#467E4A" />
        <Path d="M0 180 C100 166 200 186 320 174 V200 H0Z" fill="#5E8F57" />
      </G>
    ),
  },
}

/** Une illustration en pleine largeur ; la hauteur suit le cadre qui la contient. */
export function Scene({ nom, rayon = 0 }: { nom: NomScene; rayon?: number }) {
  const decor = decors[nom]
  const id = `scene-${nom}`
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      style={{ borderRadius: rayon }}
    >
      <Defs>
        <LinearGradient id={`${id}-ciel`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={decor.ciel[0]} />
          <Stop offset="1" stopColor={decor.ciel[1]} />
        </LinearGradient>
        {decor.astre?.halo ? (
          <RadialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor={decor.astre.halo} stopOpacity="0.9" />
            <Stop offset="1" stopColor={decor.astre.halo} stopOpacity="0" />
          </RadialGradient>
        ) : null}
        <RadialGradient id="halo-lampe" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFC870" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#FFC870" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="200" fill={`url(#${id}-ciel)`} />
      {decor.astre ? (
        <G>
          {decor.astre.halo ? (
            <Circle
              cx={decor.astre.x}
              cy={decor.astre.y}
              r={decor.astre.r * 2.6}
              fill={`url(#${id}-halo)`}
            />
          ) : null}
          <Circle
            cx={decor.astre.x}
            cy={decor.astre.y}
            r={decor.astre.r}
            fill={decor.astre.couleur}
          />
        </G>
      ) : null}
      {decor.couches?.map(([d, couleur]) => (
        <Path key={d} d={d} fill={couleur} />
      ))}
      {decor.devant}
    </Svg>
  )
}

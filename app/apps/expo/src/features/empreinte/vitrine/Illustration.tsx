import type { ReactNode } from 'react'
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg'

/**
 * Empreinte · Le moteur d'illustrations des vitrines. Une illustration est un paysage
 * (moment du jour, relief, sol) sur lequel se pose, en silhouette, le symbole d'un livre.
 * Aucun personnage n'est jamais dessiné : rien ne représente le Christ. Cadre 320 × 200.
 */
export type Ambiance =
  | 'aube'
  | 'matin'
  | 'midi'
  | 'soir'
  | 'nuit'
  | 'crepuscule'
  | 'orage'
  | 'printemps'
export type Relief = 'collines' | 'dunes' | 'montagnes' | 'plaine' | 'mer' | 'falaises'
export type Sol = 'sable' | 'olive' | 'pierre' | 'terre' | 'prairie' | 'mer'
export type Motif =
  | 'arbre'
  | 'merOuverte'
  | 'autel'
  | 'tentes'
  | 'tables'
  | 'murailles'
  | 'torches'
  | 'gerbes'
  | 'lampe'
  | 'couronne'
  | 'temple'
  | 'flammes'
  | 'harpe'
  | 'rouleaux'
  | 'chantier'
  | 'eclair'
  | 'sablier'
  | 'vigne'
  | 'montagneLumiere'
  | 'amandier'
  | 'ruines'
  | 'roues'
  | 'lion'
  | 'fleurs'
  | 'pluie'
  | 'fil'
  | 'rocher'
  | 'poisson'
  | 'tour'
  | 'colombe'
  | 'pierres'
  | 'chandelier'
  | 'soleil'
  | 'etoile'
  | 'chemin'
  | 'brebis'
  | 'aigle'
  | 'voilier'
  | 'olivier'
  | 'coupe'
  | 'vase'
  | 'bouclier'
  | 'laurier'
  | 'trompette'
  | 'colonne'
  | 'lettre'
  | 'ancre'
  | 'gouvernail'
  | 'rayons'
  | 'etoiles'
  | 'chandeliers'
  | 'tombeau'
  | 'pains'
  | 'puits'
  | 'arcEnCiel'

export type DefIllustration = { ambiance: Ambiance; relief: Relief; sol: Sol; motif?: Motif }

type Ciel = {
  degrade: [string, string, string]
  astre?: { x: number; y: number; r: number; couleur: string; lune?: boolean }
  brume: string
  etoiles?: boolean
  nuages?: string
}

const CIELS: Record<Ambiance, Ciel> = {
  aube: {
    degrade: ['#46507F', '#C98B95', '#F8D2AE'],
    astre: { x: 168, y: 120, r: 26, couleur: '#FFF2DE' },
    brume: '#F6D2B7',
    nuages: '#F3C2B4',
  },
  matin: {
    degrade: ['#6FA6DB', '#AFD2EE', '#EEF5F8'],
    astre: { x: 252, y: 50, r: 15, couleur: '#FFFFFF' },
    brume: '#EDF4F8',
    nuages: '#FFFFFF',
  },
  midi: {
    degrade: ['#D29A58', '#EEC88F', '#FBEBD0'],
    astre: { x: 236, y: 48, r: 20, couleur: '#FFF8E8' },
    brume: '#F7E1BB',
  },
  soir: {
    degrade: ['#2E2B57', '#B5557C', '#F4A766'],
    astre: { x: 152, y: 128, r: 30, couleur: '#FFDCA6' },
    brume: '#EFA57D',
    nuages: '#D9798A',
  },
  nuit: {
    degrade: ['#0A1230', '#1C2A55', '#3A4D86'],
    astre: { x: 244, y: 46, r: 13, couleur: '#F4EFDC', lune: true },
    brume: '#3A4D86',
    etoiles: true,
  },
  crepuscule: {
    degrade: ['#1E1B3E', '#5A4A8C', '#D2A4C8'],
    brume: '#B892C3',
    etoiles: true,
  },
  orage: {
    degrade: ['#28323F', '#4E5D70', '#8F9BAA'],
    brume: '#97A3B1',
    nuages: '#3B4757',
  },
  printemps: {
    degrade: ['#8ECDC0', '#C6E7D8', '#F3F9EF'],
    astre: { x: 70, y: 48, r: 14, couleur: '#FFFFFF' },
    brume: '#E9F5EB',
    nuages: '#FFFFFF',
  },
}

const SOLS: Record<Sol, string> = {
  sable: '#B57E45',
  olive: '#56734A',
  pierre: '#66657B',
  terre: '#7A5243',
  prairie: '#4F8A57',
  mer: '#2D5C86',
}

// Trois plans de relief (loin, milieu, près), du plus haut au plus bas.
const RELIEFS: Record<Relief, [string, string, string]> = {
  collines: [
    'M0 126 C50 104 96 118 150 104 C206 90 262 112 320 98 V200 H0Z',
    'M0 148 C64 126 118 146 180 132 C236 120 284 140 320 130 V200 H0Z',
    'M0 170 C80 154 150 176 222 160 C262 151 294 162 320 156 V200 H0Z',
  ],
  dunes: [
    'M0 128 C70 110 140 136 220 118 C266 108 300 116 320 112 V200 H0Z',
    'M0 152 C56 136 116 150 176 140 C236 130 286 150 320 144 V200 H0Z',
    'M0 176 C90 160 170 186 248 170 C280 164 304 168 320 166 V200 H0Z',
  ],
  montagnes: [
    'M0 132 L40 104 L78 122 L128 82 L176 116 L222 92 L268 114 L320 96 V200 H0Z',
    'M0 152 L52 120 L90 138 L146 108 L196 140 L246 118 L320 146 V200 H0Z',
    'M0 174 C80 160 160 182 240 166 C276 158 300 164 320 162 V200 H0Z',
  ],
  plaine: [
    'M0 130 C80 124 240 126 320 122 V200 H0Z',
    'M0 150 C90 144 220 152 320 146 V200 H0Z',
    'M0 176 C100 170 220 180 320 172 V200 H0Z',
  ],
  mer: [
    'M0 118 C40 112 70 116 96 112 L96 120 L0 122Z',
    'M0 122 H320 V200 H0Z',
    'M0 176 C90 168 180 182 320 172 V200 H0Z',
  ],
  falaises: [
    'M0 124 C60 112 120 120 180 110 C240 100 280 112 320 106 V200 H0Z',
    'M0 150 L0 112 L40 108 L56 150 C120 144 200 152 320 146 V200 H0Z',
    'M0 176 C90 166 190 184 320 170 V200 H0Z',
  ],
}

const hex = (couleur: string) => [1, 3, 5].map(i => parseInt(couleur.slice(i, i + 2), 16))
const melange = (a: string, b: string, t: number) => {
  const [x, y] = [hex(a), hex(b)]
  return `#${x
    .map((v, i) =>
      Math.round(v + (y[i] - v) * t)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`
}

type Teintes = { ombre: string; milieu: string; lueur: string; clair: string; ciel: Ciel }

/** Les symboles, en silhouette sur le paysage. */
const MOTIFS: Record<Motif, (c: Teintes) => ReactNode> = {
  arbre: c => (
    <G fill={c.ombre}>
      <Path d="M200 160 C198 140 202 122 196 104 L204 104 C204 124 208 140 210 160Z" />
      <Circle cx="200" cy="92" r="26" />
      <Circle cx="180" cy="104" r="17" />
      <Circle cx="222" cy="104" r="17" />
      <Circle cx="190" cy="78" r="15" />
      <Circle cx="214" cy="80" r="14" />
    </G>
  ),
  merOuverte: c => (
    <G>
      <Path
        d="M0 120 C60 118 110 122 136 120 C126 140 128 166 118 200 H0Z"
        fill={melange(SOLS.mer, c.clair, 0.25)}
      />
      <Path
        d="M320 120 C260 118 210 122 184 120 C194 140 192 166 202 200 H320Z"
        fill={melange(SOLS.mer, c.clair, 0.25)}
      />
      <Path
        d="M136 120 C126 140 128 166 118 200 H202 C192 166 194 140 184 120Z"
        fill={melange(SOLS.sable, c.clair, 0.35)}
      />
      <G stroke={c.clair} strokeWidth="1.2" opacity={0.6} fill="none">
        <Path d="M20 140 C50 136 80 142 110 138" />
        <Path d="M210 150 C240 146 270 152 300 148" />
        <Path d="M30 170 C60 166 80 172 104 168" />
      </G>
    </G>
  ),
  autel: c => (
    <G>
      <Path d="M150 128 C142 110 156 98 160 84 C166 98 180 108 170 128Z" fill={c.lueur} />
      <Path d="M156 128 C152 118 160 110 162 102 C166 112 172 118 166 128Z" fill="#FFF4D6" />
      <Rect x="132" y="128" width="58" height="34" rx="3" fill={c.ombre} />
      <Rect x="128" y="124" width="66" height="8" rx="2" fill={c.ombre} />
    </G>
  ),
  tentes: c => (
    <G>
      <Rect x="226" y="40" width="16" height="118" rx="8" fill={c.lueur} opacity={0.55} />
      <Rect x="230" y="34" width="8" height="124" rx="4" fill="#FFF1D2" opacity={0.75} />
      <G fill={c.ombre}>
        <Path d="M70 160 L100 122 L130 160Z" />
        <Path d="M120 160 L156 116 L192 160Z" />
        <Path d="M180 160 L204 130 L228 160Z" />
      </G>
      <G fill={c.lueur} opacity={0.8}>
        <Path d="M96 160 L100 146 L104 160Z" />
        <Path d="M152 160 L156 142 L160 160Z" />
      </G>
    </G>
  ),
  tables: c => (
    <G>
      <Circle cx="160" cy="92" r="40" fill={c.lueur} opacity={0.35} />
      <Path d="M138 120 V86 C138 74 156 74 156 86 V120Z" fill={c.clair} />
      <Path d="M164 120 V86 C164 74 182 74 182 86 V120Z" fill={c.clair} />
      <G stroke={c.ombre} strokeWidth="1.6" opacity={0.5}>
        {[92, 100, 108].map(y => (
          <G key={y}>
            <Line x1="142" y1={y} x2="152" y2={y} />
            <Line x1="168" y1={y} x2="178" y2={y} />
          </G>
        ))}
      </G>
    </G>
  ),
  murailles: c => (
    <G fill={c.ombre}>
      <Rect x="70" y="118" width="180" height="44" />
      {[70, 120, 170, 220].map(x => (
        <Rect key={x} x={x - 4} y="102" width="38" height="60" />
      ))}
      {[66, 82, 98, 116, 132, 148, 166, 182, 198, 216, 232, 248].map(x => (
        <Rect key={x} x={x} y="96" width="10" height="8" />
      ))}
      <Path d="M150 162 L156 132 L162 140 L166 118 L170 162Z" fill={c.lueur} opacity={0.9} />
    </G>
  ),
  torches: c => (
    <G>
      {[110, 160, 210].map((x, i) => (
        <G key={x}>
          <Circle cx={x} cy={120 - (i % 2) * 8} r="22" fill={c.lueur} opacity={0.3} />
          <Path
            d={`M${x - 6} ${124 - (i % 2) * 8} C${x - 8} ${112 - (i % 2) * 8} ${x} ${104 - (i % 2) * 8} ${x} ${98 - (i % 2) * 8} C${x + 4} ${108 - (i % 2) * 8} ${x + 8} ${114 - (i % 2) * 8} ${x + 6} ${124 - (i % 2) * 8}Z`}
            fill={c.lueur}
          />
          <Rect
            x={x - 3}
            y={124 - (i % 2) * 8}
            width="6"
            height={38 + (i % 2) * 8}
            fill={c.ombre}
          />
        </G>
      ))}
    </G>
  ),
  gerbes: c => (
    <G>
      {[104, 160, 216].map((x, n) => (
        <G key={x}>
          <G stroke={c.ombre} strokeWidth="2" strokeLinecap="round">
            {[-16, -11, -6, -1, 4, 9, 14].map(d => (
              <Line key={d} x1={x + d * 0.35} y1="140" x2={x + d} y2="162" />
            ))}
            {[-18, -12, -6, 0, 6, 12, 18].map(d => (
              <Line key={`h${d}`} x1={x + d * 0.3} y1="140" x2={x + d} y2={112 - (n % 2) * 4} />
            ))}
          </G>
          {[-18, -12, -6, 0, 6, 12, 18].map(d => (
            <Ellipse
              key={`e${d}`}
              cx={x + d * 1.04}
              cy={108 - (n % 2) * 4 - (6 - Math.abs(d) / 3)}
              rx="2.6"
              ry="7"
              fill={c.lueur}
              transform={`rotate(${d * 1.6} ${x + d * 1.04} ${108 - (n % 2) * 4})`}
            />
          ))}
          <Rect x={x - 9} y="136" width="18" height="6" rx="3" fill={c.lueur} />
        </G>
      ))}
    </G>
  ),
  lampe: c => (
    <G>
      <Circle cx="160" cy="110" r="46" fill={c.lueur} opacity={0.35} />
      <Path d="M162 108 C150 96 160 80 164 70 C170 84 178 96 166 108Z" fill={c.lueur} />
      <Path d="M163 106 C158 100 162 92 164 86 C168 94 170 100 165 106Z" fill="#FFF4CF" />
      <Path
        d="M112 130 C124 116 192 116 214 126 C226 130 230 138 218 142 L192 150 C168 158 140 156 122 146 C110 140 106 136 112 130Z"
        fill={c.ombre}
      />
      <Path d="M208 126 L240 116 C246 114 248 120 242 122 L218 136Z" fill={c.ombre} />
    </G>
  ),
  couronne: c => (
    <G>
      <Circle cx="160" cy="112" r="44" fill={c.lueur} opacity={0.3} />
      <Path d="M126 138 L120 100 L140 118 L160 92 L180 118 L200 100 L194 138Z" fill={c.lueur} />
      <Rect x="124" y="136" width="72" height="10" rx="3" fill={c.lueur} />
      {[120, 160, 200].map((x, i) => (
        <Circle key={x} cx={x} cy={[100, 92, 100][i] - 4} r="4" fill="#FFF5DA" />
      ))}
    </G>
  ),
  temple: c => (
    <G fill={c.ombre}>
      <Path d="M100 110 L160 84 L220 110Z" />
      <Rect x="104" y="110" width="112" height="8" />
      {[110, 130, 150, 170, 190, 206].map(x => (
        <Rect key={x} x={x} y="118" width="8" height="34" />
      ))}
      <Rect x="96" y="152" width="128" height="6" />
      <Rect x="88" y="158" width="144" height="6" />
      <Rect x="153" y="124" width="14" height="28" fill={c.lueur} opacity={0.9} />
    </G>
  ),
  flammes: c => (
    <G>
      <Circle cx="160" cy="96" r="54" fill={c.lueur} opacity={0.28} />
      <Path
        d="M160 40 C130 80 176 92 146 132 C190 120 172 84 196 70 C188 96 210 106 196 132 C222 112 208 72 160 40Z"
        fill={c.lueur}
      />
      <Path
        d="M160 78 C150 100 172 104 160 126 C182 116 172 96 182 88 C182 104 190 110 184 124 C196 110 188 90 160 78Z"
        fill="#FFF0C8"
      />
    </G>
  ),
  harpe: c => (
    <G>
      <Path
        d="M132 160 C124 120 132 84 160 70 C176 62 196 70 200 84 L188 90 C184 80 174 78 166 84 C148 96 146 124 152 160Z"
        fill={c.lueur}
      />
      <Path d="M150 160 H204 V152 H150Z" fill={c.lueur} />
      <G stroke={c.clair} strokeWidth="1.1" opacity={0.85}>
        {[160, 168, 176, 184, 192].map((x, i) => (
          <Line key={x} x1={x} y1={88 - i * 1.5} x2={x} y2="152" />
        ))}
      </G>
    </G>
  ),
  rouleaux: c => (
    <G>
      <Circle cx="160" cy="130" r="50" fill={c.lueur} opacity={0.22} />
      {[
        [100, 140],
        [150, 140],
        [124, 118],
        [200, 140],
        [176, 118],
      ].map(([x, y]) => (
        <G key={`${x}-${y}`}>
          <Rect x={x} y={y} width="44" height="20" rx="10" fill={c.clair} />
          <Circle cx={x + 10} cy={y + 10} r="7" fill={melange(c.clair, c.ombre, 0.35)} />
          <Circle cx={x + 10} cy={y + 10} r="2.5" fill={c.ombre} />
        </G>
      ))}
    </G>
  ),
  chantier: c => (
    <G fill={c.ombre}>
      {[0, 1, 2, 3].map(rangee =>
        Array.from({ length: 7 - rangee }, (_, i) => (
          <Rect
            key={`${rangee}-${i}`}
            x={90 + i * 24 + rangee * 12}
            y={146 - rangee * 14}
            width="22"
            height="12"
            rx="1.5"
          />
        ))
      )}
      <Rect x="232" y="76" width="4" height="86" />
      <Rect x="250" y="76" width="4" height="86" />
      {[86, 100, 114, 128, 142, 156].map(y => (
        <Rect key={y} x="232" y={y} width="22" height="3" />
      ))}
      <Rect x="146" y="88" width="22" height="12" rx="1.5" fill={c.lueur} />
    </G>
  ),
  eclair: c => (
    <G>
      <G fill={c.ombre} opacity={0.85}>
        <Ellipse cx="110" cy="44" rx="70" ry="22" />
        <Ellipse cx="190" cy="36" rx="80" ry="26" />
        <Ellipse cx="260" cy="50" rx="60" ry="20" />
      </G>
      <Path d="M182 56 L162 104 L178 104 L156 152 L200 90 L182 90 L198 56Z" fill="#FFF3C4" />
    </G>
  ),
  sablier: c => (
    <G>
      <Circle cx="160" cy="110" r="44" fill={c.lueur} opacity={0.25} />
      <Rect x="134" y="66" width="52" height="7" rx="3" fill={c.ombre} />
      <Rect x="134" y="150" width="52" height="7" rx="3" fill={c.ombre} />
      <Path
        d="M140 73 C140 100 156 104 156 112 C156 120 140 124 140 150 H180 C180 124 164 120 164 112 C164 104 180 100 180 73Z"
        fill={c.clair}
        opacity={0.85}
      />
      <Path d="M146 150 C150 136 170 136 174 150Z" fill={c.lueur} />
      <Path d="M148 84 H172 C168 96 162 100 160 108 C158 100 152 96 148 84Z" fill={c.lueur} />
    </G>
  ),
  vigne: c => (
    <G>
      <Path
        d="M70 160 V104 M250 160 V104 M66 104 H254"
        stroke={c.ombre}
        strokeWidth="4"
        fill="none"
      />
      <Path
        d="M70 110 C110 96 130 124 160 108 C190 92 210 122 250 106"
        stroke={c.ombre}
        strokeWidth="3"
        fill="none"
      />
      {[100, 150, 205].map(x => (
        <G key={x}>
          <Path
            d={`M${x} 110 C${x - 16} 104 ${x - 18} 94 ${x - 6} 92 C${x - 2} 100 ${x} 104 ${x} 110Z`}
            fill={c.ombre}
          />
          {[0, 1, 2, 3].map(r =>
            Array.from({ length: 4 - r }, (_, i) => (
              <Circle
                key={`${r}-${i}`}
                cx={x + 4 + i * 6 + r * 3}
                cy={118 + r * 6}
                r="3.4"
                fill={c.lueur}
              />
            ))
          )}
        </G>
      ))}
    </G>
  ),
  montagneLumiere: c => (
    <G>
      <Circle cx="166" cy="70" r="56" fill={c.lueur} opacity={0.3} />
      <Path d="M70 160 L166 62 L262 160Z" fill={c.ombre} />
      <Path d="M166 62 L148 82 L158 78 L166 88 L176 78 L184 82Z" fill={c.clair} />
    </G>
  ),
  amandier: c => (
    <G>
      <Path
        d="M168 162 C166 140 172 126 160 108 M164 132 C150 120 138 118 128 106 M168 124 C182 112 194 110 206 98"
        stroke={c.ombre}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {[
        [128, 100],
        [140, 92],
        [156, 98],
        [160, 86],
        [176, 92],
        [190, 96],
        [206, 90],
        [196, 82],
        [146, 108],
        [172, 104],
        [120, 108],
        [214, 100],
      ].map(([x, y]) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#FBE1E6" />
      ))}
      {[
        [134, 96],
        [168, 90],
        [200, 92],
        [152, 104],
      ].map(([x, y]) => (
        <Circle key={`c${x}`} cx={x} cy={y} r="2" fill={c.lueur} />
      ))}
    </G>
  ),
  ruines: c => (
    <G fill={c.ombre}>
      <Rect x="96" y="104" width="14" height="58" />
      <Rect x="92" y="98" width="22" height="8" />
      <Path d="M140 162 V122 L146 118 L152 126 L154 162Z" />
      <Rect x="186" y="116" width="14" height="46" />
      <Path d="M182 116 H204 L198 108 H188Z" />
      <Rect x="214" y="152" width="40" height="10" rx="2" transform="rotate(-8 234 157)" />
      <Path
        d="M150 112 C142 96 156 88 150 72 C164 84 160 96 166 108"
        fill="none"
        stroke={c.clair}
        strokeWidth="3"
        opacity={0.5}
      />
    </G>
  ),
  roues: c => (
    <G>
      <Circle cx="160" cy="92" r="50" fill={c.lueur} opacity={0.25} />
      {[34, 26, 18].map((r, i) => (
        <Circle
          key={r}
          cx="160"
          cy="92"
          r={r}
          fill="none"
          stroke={i === 1 ? c.clair : c.lueur}
          strokeWidth="2.5"
        />
      ))}
      <Circle
        cx="160"
        cy="92"
        r="40"
        fill="none"
        stroke={c.lueur}
        strokeWidth="1.4"
        strokeDasharray="2 6"
      />
      <Path d="M160 52 V132 M120 92 H200" stroke={c.lueur} strokeWidth="1.4" opacity={0.7} />
    </G>
  ),
  lion: c => (
    <G fill={c.ombre}>
      <Path d="M96 162 C100 148 112 144 120 146 C134 148 160 146 182 148 C198 136 218 136 228 148 C236 156 236 162 236 162Z" />
      <Circle cx="212" cy="134" r="20" />
      <Path d="M214 140 C222 142 230 140 234 146 L222 150Z" />
      <Path
        d="M100 154 C86 150 80 140 84 132"
        stroke={c.ombre}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <Rect x="64" y="160" width="190" height="6" rx="3" opacity={0.8} />
    </G>
  ),
  fleurs: c => (
    <G>
      {[90, 120, 150, 180, 210, 240].map((x, i) => (
        <G key={x}>
          <Path
            d={`M${x} 166 C${x - 2} 150 ${x + 2} 140 ${x} ${128 + (i % 3) * 6}`}
            stroke={c.ombre}
            strokeWidth="2.5"
            fill="none"
          />
          <Path
            d={`M${x} ${124 + (i % 3) * 6} C${x - 12} ${116 + (i % 3) * 6} ${x - 8} ${104 + (i % 3) * 6} ${x} ${110 + (i % 3) * 6} C${x + 8} ${104 + (i % 3) * 6} ${x + 12} ${116 + (i % 3) * 6} ${x} ${124 + (i % 3) * 6}Z`}
            fill="#FFFFFF"
          />
          <Circle cx={x} cy={118 + (i % 3) * 6} r="2.4" fill={c.lueur} />
        </G>
      ))}
    </G>
  ),
  pluie: c => (
    <G>
      <G fill={c.ombre} opacity={0.75}>
        <Ellipse cx="120" cy="46" rx="80" ry="22" />
        <Ellipse cx="220" cy="40" rx="90" ry="24" />
      </G>
      <G stroke={c.clair} strokeWidth="1.6" strokeLinecap="round" opacity={0.75}>
        {Array.from({ length: 22 }, (_, i) => (
          <Line
            key={i}
            x1={50 + i * 11}
            y1={70 + (i % 4) * 8}
            x2={44 + i * 11}
            y2={88 + (i % 4) * 8}
          />
        ))}
      </G>
    </G>
  ),
  fil: c => (
    <G>
      <Rect x="96" y="106" width="70" height="56" fill={c.ombre} />
      {[0, 1, 2, 3].map(r => (
        <Line
          key={r}
          x1="96"
          y1={120 + r * 14}
          x2="166"
          y2={120 + r * 14}
          stroke={c.milieu}
          strokeWidth="1.5"
        />
      ))}
      <Line x1="196" y1="54" x2="196" y2="132" stroke={c.clair} strokeWidth="1.6" />
      <Path d="M188 132 H204 L196 150Z" fill={c.lueur} />
    </G>
  ),
  rocher: c => (
    <G>
      <Path d="M120 162 L134 108 L158 82 L186 92 L204 128 L214 162Z" fill={c.ombre} />
      <Path d="M158 82 L170 100 L162 120 L176 140" stroke={c.milieu} strokeWidth="2" fill="none" />
      <Path
        d="M220 64 C232 58 244 58 252 66 C244 64 236 66 230 72 C240 70 248 72 254 78 C242 76 232 76 222 72Z"
        fill={c.ombre}
      />
    </G>
  ),
  poisson: c => (
    <G>
      <Path
        d="M86 150 C112 108 196 100 238 132 L268 112 L262 144 L276 168 L240 152 C196 182 116 178 86 150Z"
        fill={c.ombre}
      />
      <Circle cx="118" cy="140" r="4" fill={c.clair} />
      <G stroke={c.clair} strokeWidth="1.4" fill="none" opacity={0.6}>
        <Path d="M40 170 C60 166 76 172 96 168" />
        <Path d="M230 180 C250 176 266 182 290 178" />
      </G>
    </G>
  ),
  tour: c => (
    <G fill={c.ombre}>
      <Path d="M144 162 L150 84 H174 L180 162Z" />
      <Rect x="140" y="74" width="44" height="12" />
      {[140, 152, 164, 176].map(x => (
        <Rect key={x} x={x} y="66" width="8" height="9" />
      ))}
      <Rect x="157" y="100" width="10" height="16" rx="5" fill={c.lueur} />
    </G>
  ),
  colombe: c => (
    <G fill={c.clair}>
      <Path d="M150 112 C130 92 104 88 90 96 C112 100 124 112 136 122 Z" />
      <Path d="M150 112 C162 84 190 70 214 74 C194 84 180 100 170 120Z" />
      <Path d="M132 124 C150 110 176 112 192 122 C204 120 212 124 214 128 C202 128 196 132 188 136 C168 142 146 138 132 124Z" />
      <Path d="M210 126 C224 120 236 122 246 116 C240 126 228 132 214 132Z" fill="#7E9B4A" />
    </G>
  ),
  pierres: c => (
    <G fill={c.ombre}>
      <Path d="M110 162 L114 116 L134 112 L138 162Z" />
      <Path d="M146 162 L150 96 L174 92 L176 162Z" />
      <Path d="M184 162 L188 120 L206 118 L210 162Z" />
      <Rect x="144" y="88" width="34" height="8" rx="2" fill={c.lueur} />
    </G>
  ),
  chandelier: c => (
    <G>
      <Circle cx="160" cy="96" r="50" fill={c.lueur} opacity={0.25} />
      <Path d="M160 162 V90" stroke={c.lueur} strokeWidth="5" />
      {[24, 44, 64].map(d => (
        <Path
          key={d}
          d={`M${160 - d} 92 C${160 - d} 124 ${160 + d} 124 ${160 + d} 92`}
          stroke={c.lueur}
          strokeWidth="4"
          fill="none"
        />
      ))}
      <Rect x="140" y="160" width="40" height="6" rx="3" fill={c.lueur} />
      {[-64, -44, -24, 0, 24, 44, 64].map(d => (
        <Path
          key={d}
          d={`M${160 + d} 88 C${157 + d} 82 ${160 + d} 76 ${161 + d} 72 C${164 + d} 78 ${164 + d} 84 ${160 + d} 88Z`}
          fill="#FFF2C6"
        />
      ))}
    </G>
  ),
  soleil: c => (
    <G>
      <Circle cx="160" cy="112" r="70" fill={c.lueur} opacity={0.22} />
      {Array.from({ length: 16 }, (_, i) => (
        <Path
          key={i}
          d="M160 112 L156 40 L164 40Z"
          fill={c.lueur}
          opacity={0.5}
          transform={`rotate(${i * 22.5} 160 112)`}
        />
      ))}
      <Circle cx="160" cy="112" r="24" fill="#FFF3D4" />
    </G>
  ),
  etoile: c => (
    <G>
      <Circle cx="170" cy="56" r="34" fill={c.lueur} opacity={0.3} />
      <Path d="M170 30 L176 52 L198 56 L176 60 L170 84 L164 60 L142 56 L164 52Z" fill="#FFF6D8" />
      <Path d="M170 84 L174 150" stroke={c.lueur} strokeWidth="1" opacity={0.6} />
      <G fill={c.ombre}>
        <Rect x="120" y="140" width="22" height="22" />
        <Rect x="144" y="132" width="28" height="30" />
        <Path d="M144 132 L158 120 L172 132Z" />
        <Rect x="174" y="144" width="20" height="18" />
        <Rect x="196" y="138" width="16" height="24" />
        <Rect x="154" y="146" width="6" height="8" fill={c.lueur} />
      </G>
    </G>
  ),
  chemin: c => (
    <Path
      d="M146 200 C158 184 134 170 154 156 C168 146 156 134 162 124 L168 124 C166 134 180 146 166 158 C148 172 180 186 176 200Z"
      fill={c.clair}
      opacity={0.9}
    />
  ),
  brebis: c => (
    <G>
      {[
        [110, 150, 1],
        [168, 142, 1.2],
        [222, 154, 0.9],
      ].map(([x, y, e]) => (
        <G key={x} transform={`translate(${x} ${y}) scale(${e})`}>
          <Ellipse cx="0" cy="0" rx="20" ry="13" fill="#FBF7EE" />
          <Circle cx="-10" cy="-6" r="8" fill="#FBF7EE" />
          <Circle cx="8" cy="-8" r="8" fill="#FBF7EE" />
          <Ellipse cx="22" cy="-4" rx="7" ry="6" fill={c.ombre} />
          <Rect x="-12" y="10" width="3" height="9" fill={c.ombre} />
          <Rect x="8" y="10" width="3" height="9" fill={c.ombre} />
        </G>
      ))}
    </G>
  ),
  aigle: c => (
    <G fill={c.ombre}>
      <Path d="M160 92 C134 74 104 70 74 78 C100 82 118 92 132 104 C142 100 152 98 160 100Z" />
      <Path d="M160 92 C186 74 216 70 246 78 C220 82 202 92 188 104 C178 100 168 98 160 100Z" />
      <Path d="M152 98 C152 112 156 124 160 130 C164 124 168 112 168 98Z" />
      <Circle cx="160" cy="92" r="6" />
      <Path d="M150 128 L160 140 L170 128Z" />
    </G>
  ),
  voilier: c => (
    <G>
      <Path d="M120 150 H210 L196 166 H136Z" fill={c.ombre} />
      <Path d="M166 148 V70 L206 144Z" fill={c.clair} />
      <Path d="M162 148 V82 L128 144Z" fill={melange(c.clair, c.ombre, 0.15)} />
      <Path d="M164 70 V150" stroke={c.ombre} strokeWidth="2" />
      <G stroke={c.clair} strokeWidth="1.3" fill="none" opacity={0.6}>
        <Path d="M60 172 C80 168 96 174 116 170" />
        <Path d="M220 176 C240 172 256 178 280 174" />
      </G>
    </G>
  ),
  olivier: c => (
    <G fill={c.ombre}>
      <Path d="M166 162 C160 146 172 136 162 118 C158 110 166 104 170 112 C176 124 168 138 176 162Z" />
      <Ellipse cx="150" cy="104" rx="28" ry="16" />
      <Ellipse cx="186" cy="98" rx="30" ry="18" />
      <Ellipse cx="168" cy="84" rx="26" ry="14" />
      {[
        [144, 98],
        [190, 92],
        [170, 80],
        [160, 108],
      ].map(([x, y]) => (
        <Ellipse key={`${x}`} cx={x} cy={y} rx="3" ry="2" fill={c.lueur} />
      ))}
    </G>
  ),
  coupe: c => (
    <G>
      <Circle cx="160" cy="106" r="44" fill={c.lueur} opacity={0.28} />
      <Path d="M132 88 H188 C188 114 176 128 160 128 C144 128 132 114 132 88Z" fill={c.lueur} />
      <Rect x="157" y="128" width="6" height="22" fill={c.lueur} />
      <Path d="M140 158 C144 150 176 150 180 158Z" fill={c.lueur} />
      <Path d="M138 94 H182" stroke="#FFF4D2" strokeWidth="2" />
    </G>
  ),
  vase: c => (
    <G>
      <Circle cx="160" cy="106" r="46" fill={c.lueur} opacity={0.3} />
      <Path
        d="M150 70 H170 V80 C170 86 192 96 192 120 C192 140 176 152 160 152 C144 152 128 140 128 120 C128 96 150 86 150 80Z"
        fill="#C98A5A"
      />
      <Path d="M150 84 C138 84 134 96 142 104" stroke="#C98A5A" strokeWidth="4" fill="none" />
      <Path d="M170 84 C182 84 186 96 178 104" stroke="#C98A5A" strokeWidth="4" fill="none" />
      <Path d="M132 118 H188" stroke="#E7B98C" strokeWidth="3" />
      <Path d="M136 128 H184" stroke="#A86E45" strokeWidth="2" />
      <Rect x="146" y="66" width="28" height="6" rx="3" fill="#B37A4E" />
      <Circle cx="160" cy="62" r="8" fill="#FFF3CF" opacity={0.9} />
    </G>
  ),
  bouclier: c => (
    <G>
      <Circle cx="160" cy="108" r="46" fill={c.lueur} opacity={0.25} />
      <Path d="M160 66 L196 80 C196 116 184 140 160 152 C136 140 124 116 124 80Z" fill={c.lueur} />
      <Path d="M160 76 L186 86 C186 114 176 132 160 142Z" fill="#FFF2CC" opacity={0.7} />
    </G>
  ),
  laurier: c => (
    <G>
      <Circle cx="160" cy="104" r="46" fill={c.lueur} opacity={0.25} />
      {[-1, 1].map(s => (
        <G key={s}>
          <Path
            d={`M160 146 C${160 + s * 40} 136 ${160 + s * 44} 96 ${160 + s * 22} 70`}
            stroke={c.lueur}
            strokeWidth="2.5"
            fill="none"
          />
          {[0, 1, 2, 3, 4, 5].map(i => (
            <Ellipse
              key={i}
              cx={160 + s * (30 - Math.abs(i - 2.5) * 4)}
              cy={138 - i * 13}
              rx="9"
              ry="4"
              fill={c.lueur}
              transform={`rotate(${s * (40 - i * 8)} ${160 + s * (30 - Math.abs(i - 2.5) * 4)} ${138 - i * 13})`}
            />
          ))}
        </G>
      ))}
    </G>
  ),
  trompette: c => (
    <G>
      <Circle cx="210" cy="88" r="40" fill={c.lueur} opacity={0.3} />
      <Path
        d="M96 132 C130 130 170 116 196 88 C206 76 220 72 232 74 C228 92 222 104 210 108 C180 120 140 132 98 140Z"
        fill={c.lueur}
      />
      <Path d="M232 74 C240 88 236 102 222 110" stroke="#FFF2C8" strokeWidth="3" fill="none" />
    </G>
  ),
  colonne: c => (
    <G fill={c.ombre}>
      <Rect x="140" y="64" width="40" height="10" />
      <Rect x="146" y="74" width="28" height="80" />
      <Rect x="136" y="152" width="48" height="10" />
      {[152, 160, 168].map(x => (
        <Rect key={x} x={x} y="78" width="2" height="72" fill={c.milieu} />
      ))}
      <Circle cx="160" cy="58" r="10" fill={c.lueur} />
    </G>
  ),
  lettre: c => (
    <G>
      <Circle cx="160" cy="110" r="44" fill={c.lueur} opacity={0.25} />
      <Rect x="118" y="86" width="84" height="56" rx="4" fill={c.clair} />
      <Path
        d="M118 90 L160 120 L202 90"
        stroke={melange(c.clair, c.ombre, 0.4)}
        strokeWidth="2"
        fill="none"
      />
      <Circle cx="160" cy="122" r="9" fill="#B5473B" />
    </G>
  ),
  ancre: c => (
    <G fill="none" stroke={c.ombre} strokeWidth="7" strokeLinecap="round">
      <Circle cx="160" cy="74" r="9" />
      <Path d="M160 84 V152" />
      <Path d="M138 100 H182" />
      <Path d="M124 128 C126 146 142 154 160 154 C178 154 194 146 196 128" />
    </G>
  ),
  gouvernail: c => (
    <G stroke={c.ombre} strokeWidth="5" fill="none" strokeLinecap="round">
      <Circle cx="160" cy="112" r="32" />
      <Circle cx="160" cy="112" r="8" fill={c.ombre} />
      {[0, 45, 90, 135].map(a => (
        <Path key={a} d="M160 68 V156" transform={`rotate(${a} 160 112)`} />
      ))}
    </G>
  ),
  rayons: c => (
    <G>
      {[-50, -30, -10, 10, 30, 50].map(a => (
        <Path
          key={a}
          d="M160 80 L150 -20 L170 -20Z"
          fill="#FFFFFF"
          opacity={0.45}
          transform={`rotate(${a} 160 80)`}
        />
      ))}
      <Circle cx="160" cy="80" r="22" fill="#FFF6DA" />
    </G>
  ),
  etoiles: () => (
    <G fill="#FFF6DA">
      {[
        [60, 40],
        [120, 28],
        [200, 36],
        [260, 60],
        [90, 76],
        [170, 64],
        [230, 92],
        [40, 96],
      ].map(([x, y], i) => (
        <Path
          key={i}
          d={`M${x} ${y - 6} L${x + 1.6} ${y - 1.6} L${x + 6} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 6} L${x - 1.6} ${y + 1.6} L${x - 6} ${y} L${x - 1.6} ${y - 1.6}Z`}
        />
      ))}
    </G>
  ),
  chandeliers: c => (
    <G>
      {[70, 100, 130, 160, 190, 220, 250].map((x, i) => (
        <G key={x}>
          <Circle cx={x} cy={102 + (i % 2) * 6} r="14" fill={c.lueur} opacity={0.3} />
          <Rect
            x={x - 2}
            y={110 + (i % 2) * 6}
            width="4"
            height={48 - (i % 2) * 6}
            fill={c.lueur}
          />
          <Rect x={x - 7} y="156" width="14" height="4" rx="2" fill={c.lueur} />
          <Path
            d={`M${x} ${108 + (i % 2) * 6} C${x - 4} ${100 + (i % 2) * 6} ${x} ${94 + (i % 2) * 6} ${x + 1} ${90 + (i % 2) * 6} C${x + 4} ${96 + (i % 2) * 6} ${x + 4} ${102 + (i % 2) * 6} ${x} ${108 + (i % 2) * 6}Z`}
            fill="#FFF2C6"
          />
        </G>
      ))}
    </G>
  ),
  tombeau: c => (
    <G>
      <Path d="M100 162 C96 120 120 92 160 90 C200 92 224 120 220 162Z" fill={c.ombre} />
      <Path d="M140 162 C140 136 148 124 160 124 C172 124 180 136 180 162Z" fill={c.lueur} />
      <Path d="M144 162 C146 140 152 132 160 132 C168 132 174 140 176 162Z" fill="#FFF6DA" />
      <Circle cx="216" cy="146" r="18" fill={melange(c.ombre, c.milieu, 0.4)} />
      <Path
        d="M150 124 L136 96 M170 124 L184 96 M160 124 V92"
        stroke={c.lueur}
        strokeWidth="2"
        opacity={0.5}
      />
    </G>
  ),
  pains: c => (
    <G>
      <Path d="M100 140 H220 L206 166 H114Z" fill={c.ombre} />
      {[124, 150, 176, 202].map((x, i) => (
        <Ellipse
          key={x}
          cx={x - 6}
          cy={134 - (i % 2) * 4}
          rx="16"
          ry="10"
          fill={melange('#D9A05B', c.clair, 0.1)}
        />
      ))}
      <Ellipse cx="160" cy="124" rx="16" ry="10" fill={melange('#D9A05B', c.clair, 0.2)} />
      <Path
        d="M118 112 C130 104 146 106 152 112 C146 118 130 120 118 112Z M152 112 L160 106 L160 118Z"
        fill={c.clair}
      />
      <Path
        d="M178 108 C190 100 206 102 212 108 C206 114 190 116 178 108Z M212 108 L220 102 L220 114Z"
        fill={c.clair}
      />
    </G>
  ),
  puits: c => (
    <G fill={c.ombre}>
      <Rect x="128" y="126" width="64" height="36" rx="4" />
      <Rect x="124" y="122" width="72" height="8" rx="3" />
      <Rect x="132" y="80" width="5" height="44" />
      <Rect x="183" y="80" width="5" height="44" />
      <Path d="M126 84 L160 64 L194 84Z" />
      <Line x1="160" y1="84" x2="160" y2="108" stroke={c.clair} strokeWidth="1.5" />
      <Rect x="153" y="106" width="14" height="10" rx="2" fill={c.lueur} />
    </G>
  ),
  arcEnCiel: () => (
    <G fill="none" strokeWidth="5" opacity={0.75}>
      {['#E66A6A', '#F0A35E', '#F3D36B', '#7CC587', '#6BA6E0', '#8A7BD6'].map((couleur, i) => (
        <Path
          key={couleur}
          d={`M${40 + i * 6} 150 A${120 - i * 6} ${110 - i * 6} 0 0 1 ${280 - i * 6} 150`}
          stroke={couleur}
        />
      ))}
    </G>
  ),
}

let compteur = 0

/** Une illustration en pleine largeur ; la hauteur suit le cadre qui la contient. */
export function Illustration({ def }: { def: DefIllustration }) {
  const ciel = CIELS[def.ambiance]
  const sombre = def.ambiance === 'nuit' || def.ambiance === 'crepuscule'
  const base = sombre ? melange(SOLS[def.sol], '#0B1330', 0.55) : SOLS[def.sol]
  const [loin, milieu, pres] = [
    melange(base, ciel.brume, 0.6),
    melange(base, ciel.brume, 0.3),
    melange(base, '#000000', 0.18),
  ]
  const teintes: Teintes = {
    ombre: melange(pres, '#000000', 0.25),
    milieu,
    lueur:
      ciel.astre?.couleur && !ciel.astre.lune
        ? melange(ciel.astre.couleur, '#EDA234', 0.7)
        : '#F2BC5A',
    clair: melange(ciel.degrade[2], '#FFFFFF', 0.5),
    ciel,
  }
  const id = `il${(compteur = (compteur + 1) % 100000)}`
  const reliefs = RELIEFS[def.relief]
  const couches: [string, string][] = [
    [reliefs[0], loin],
    [reliefs[1], def.relief === 'mer' ? melange(SOLS.mer, ciel.brume, 0.35) : milieu],
    [reliefs[2], pres],
  ]
  const motifDevant =
    def.motif && ['merOuverte', 'chemin', 'poisson', 'voilier'].includes(def.motif)
  return (
    <Svg width="100%" height="100%" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={ciel.degrade[0]} />
          <Stop offset="0.55" stopColor={ciel.degrade[1]} />
          <Stop offset="1" stopColor={ciel.degrade[2]} />
        </LinearGradient>
        <RadialGradient id={`${id}h`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={ciel.astre?.couleur ?? '#FFFFFF'} stopOpacity="0.85" />
          <Stop offset="1" stopColor={ciel.astre?.couleur ?? '#FFFFFF'} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={ciel.brume} stopOpacity="0" />
          <Stop offset="1" stopColor={ciel.brume} stopOpacity="0.55" />
        </LinearGradient>
        {couches.map(([, couleur], i) => (
          <LinearGradient key={i} id={`${id}r${i}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={melange(couleur, ciel.brume, 0.22)} />
            <Stop offset="1" stopColor={couleur} />
          </LinearGradient>
        ))}
        <RadialGradient id={`${id}v`} cx="0.5" cy="0.45" r="0.75">
          <Stop offset="0.6" stopColor="#000000" stopOpacity="0" />
          <Stop offset="1" stopColor="#000000" stopOpacity="0.28" />
        </RadialGradient>
      </Defs>
      <Rect width="320" height="200" fill={`url(#${id}c)`} />
      {ciel.etoiles ? (
        <G fill="#FFF8E6">
          {[
            [24, 22, 1],
            [60, 50, 0.8],
            [96, 16, 1.2],
            [138, 40, 0.9],
            [176, 18, 1],
            [204, 58, 0.7],
            [286, 24, 1.1],
            [300, 70, 0.8],
            [40, 84, 0.7],
            [120, 70, 0.8],
            [262, 88, 0.6],
            [214, 30, 0.9],
          ].map(([x, y, r]) => (
            <Circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity={0.9} />
          ))}
        </G>
      ) : null}
      {ciel.astre ? (
        <G>
          <Circle
            cx={ciel.astre.x}
            cy={ciel.astre.y}
            r={ciel.astre.r * 3.2}
            fill={`url(#${id}h)`}
          />
          {ciel.astre.lune ? (
            // Un croissant de lune : le grand arc éclairé, puis l'arc intérieur.
            <Path
              d={`M${ciel.astre.x} ${ciel.astre.y - ciel.astre.r} A${ciel.astre.r} ${ciel.astre.r} 0 1 0 ${ciel.astre.x} ${ciel.astre.y + ciel.astre.r} A${ciel.astre.r * 0.72} ${ciel.astre.r} 0 1 1 ${ciel.astre.x} ${ciel.astre.y - ciel.astre.r}Z`}
              fill={ciel.astre.couleur}
            />
          ) : (
            <Circle
              cx={ciel.astre.x}
              cy={ciel.astre.y}
              r={ciel.astre.r}
              fill={ciel.astre.couleur}
            />
          )}
        </G>
      ) : null}
      {ciel.nuages ? (
        <G fill={ciel.nuages} opacity={def.ambiance === 'orage' ? 0.85 : 0.55}>
          <Ellipse cx="70" cy="60" rx="46" ry="9" />
          <Ellipse cx="96" cy="54" rx="26" ry="9" />
          <Ellipse cx="236" cy="82" rx="54" ry="8" />
          <Ellipse cx="214" cy="76" rx="24" ry="8" />
        </G>
      ) : null}
      <Path d={couches[0][0]} fill={`url(#${id}r0)`} />
      <Rect y="96" width="320" height="60" fill={`url(#${id}b)`} />
      <Path d={couches[1][0]} fill={`url(#${id}r1)`} />
      {def.motif && !motifDevant ? MOTIFS[def.motif](teintes) : null}
      <Path d={couches[2][0]} fill={`url(#${id}r2)`} />
      {def.motif && motifDevant ? MOTIFS[def.motif](teintes) : null}
      <Rect width="320" height="200" fill={`url(#${id}v)`} />
    </Svg>
  )
}

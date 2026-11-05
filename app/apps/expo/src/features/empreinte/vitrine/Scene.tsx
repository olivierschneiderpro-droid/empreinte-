import { Illustration, type DefIllustration } from './Illustration'

/**
 * Empreinte · Les illustrations nommées des vitrines (portes, livres chrétiens), dessinées
 * par le moteur d'illustrations : un paysage et un symbole, jamais de personnage.
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

export const SCENES_NOMMEES: Record<NomScene, DefIllustration> = {
  aube: { ambiance: 'aube', relief: 'collines', sol: 'prairie', motif: 'soleil' },
  desert: { ambiance: 'midi', relief: 'dunes', sol: 'sable', motif: 'tentes' },
  ville: { ambiance: 'matin', relief: 'collines', sol: 'pierre', motif: 'murailles' },
  nuit: { ambiance: 'nuit', relief: 'collines', sol: 'olive', motif: 'harpe' },
  montagne: { ambiance: 'matin', relief: 'montagnes', sol: 'pierre', motif: 'montagneLumiere' },
  riviere: { ambiance: 'printemps', relief: 'collines', sol: 'prairie', motif: 'puits' },
  chemin: { ambiance: 'aube', relief: 'collines', sol: 'terre', motif: 'chemin' },
  mer: { ambiance: 'matin', relief: 'mer', sol: 'mer', motif: 'voilier' },
  rouleau: { ambiance: 'soir', relief: 'plaine', sol: 'pierre', motif: 'rouleaux' },
  lampe: { ambiance: 'crepuscule', relief: 'collines', sol: 'pierre', motif: 'lampe' },
  lumiere: { ambiance: 'crepuscule', relief: 'mer', sol: 'mer', motif: 'rayons' },
  ble: { ambiance: 'soir', relief: 'plaine', sol: 'sable', motif: 'gerbes' },
  jardin: { ambiance: 'printemps', relief: 'collines', sol: 'olive', motif: 'arbre' },
}

export function Scene({ nom }: { nom: NomScene }) {
  return <Illustration def={SCENES_NOMMEES[nom]} />
}

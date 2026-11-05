import type { Ambiance, DefIllustration, Motif, Relief, Sol } from './Illustration'

const d = (ambiance: Ambiance, relief: Relief, sol: Sol, motif?: Motif): DefIllustration => ({
  ambiance,
  relief,
  sol,
  motif,
})

/**
 * Empreinte · Une illustration par livre de la Bible : un moment du jour, un relief et le
 * symbole du livre (jamais de personnage). Numéros des livres : 1 = Genèse … 66 = Apocalypse.
 */
export const ILLUSTRATIONS_BIBLE: Record<number, DefIllustration> = {
  // Loi
  1: d('aube', 'collines', 'prairie', 'arbre'),
  2: d('midi', 'plaine', 'sable', 'merOuverte'),
  3: d('soir', 'dunes', 'sable', 'autel'),
  4: d('nuit', 'dunes', 'sable', 'tentes'),
  5: d('matin', 'montagnes', 'pierre', 'tables'),
  // Histoire
  6: d('midi', 'plaine', 'sable', 'murailles'),
  7: d('nuit', 'collines', 'olive', 'torches'),
  8: d('soir', 'plaine', 'sable', 'gerbes'),
  9: d('crepuscule', 'collines', 'pierre', 'lampe'),
  10: d('aube', 'collines', 'olive', 'couronne'),
  11: d('matin', 'collines', 'pierre', 'temple'),
  12: d('soir', 'montagnes', 'terre', 'flammes'),
  13: d('nuit', 'collines', 'olive', 'harpe'),
  14: d('aube', 'collines', 'pierre', 'temple'),
  15: d('matin', 'plaine', 'pierre', 'rouleaux'),
  16: d('midi', 'collines', 'pierre', 'chantier'),
  17: d('crepuscule', 'plaine', 'terre', 'couronne'),
  // Poésie
  18: d('orage', 'montagnes', 'pierre', 'eclair'),
  19: d('nuit', 'collines', 'prairie', 'harpe'),
  20: d('matin', 'collines', 'prairie', 'chemin'),
  21: d('midi', 'dunes', 'sable', 'sablier'),
  22: d('printemps', 'collines', 'prairie', 'vigne'),
  // Grands prophètes
  23: d('aube', 'montagnes', 'pierre', 'montagneLumiere'),
  24: d('printemps', 'collines', 'olive', 'amandier'),
  25: d('crepuscule', 'plaine', 'pierre', 'ruines'),
  26: d('orage', 'plaine', 'terre', 'roues'),
  27: d('soir', 'falaises', 'pierre', 'lion'),
  // Petits prophètes
  28: d('printemps', 'plaine', 'prairie', 'fleurs'),
  29: d('orage', 'plaine', 'olive', 'pluie'),
  30: d('midi', 'collines', 'terre', 'fil'),
  31: d('soir', 'falaises', 'pierre', 'rocher'),
  32: d('orage', 'mer', 'mer', 'poisson'),
  33: d('aube', 'montagnes', 'olive', 'montagneLumiere'),
  34: d('orage', 'mer', 'mer', 'eclair'),
  35: d('crepuscule', 'collines', 'terre', 'tour'),
  36: d('matin', 'collines', 'prairie', 'colombe'),
  37: d('midi', 'collines', 'pierre', 'pierres'),
  38: d('nuit', 'collines', 'olive', 'chandelier'),
  39: d('aube', 'plaine', 'prairie', 'soleil'),
  // Évangiles
  40: d('nuit', 'collines', 'terre', 'etoile'),
  41: d('matin', 'dunes', 'sable', 'chemin'),
  42: d('printemps', 'collines', 'prairie', 'brebis'),
  43: d('aube', 'montagnes', 'pierre', 'aigle'),
  // Actes
  44: d('matin', 'mer', 'mer', 'voilier'),
  // Lettres de Paul
  45: d('printemps', 'collines', 'olive', 'olivier'),
  46: d('soir', 'collines', 'terre', 'coupe'),
  47: d('crepuscule', 'plaine', 'terre', 'vase'),
  48: d('printemps', 'collines', 'prairie', 'vigne'),
  49: d('aube', 'collines', 'pierre', 'bouclier'),
  50: d('matin', 'plaine', 'prairie', 'laurier'),
  51: d('printemps', 'collines', 'olive', 'arbre'),
  52: d('aube', 'plaine', 'prairie', 'trompette'),
  53: d('nuit', 'collines', 'pierre', 'lampe'),
  54: d('matin', 'collines', 'pierre', 'colonne'),
  55: d('soir', 'plaine', 'pierre', 'rouleaux'),
  56: d('midi', 'falaises', 'pierre', 'lettre'),
  57: d('printemps', 'plaine', 'prairie', 'lettre'),
  // Lettres générales
  58: d('orage', 'mer', 'mer', 'ancre'),
  59: d('matin', 'mer', 'mer', 'gouvernail'),
  60: d('midi', 'collines', 'pierre', 'pierres'),
  61: d('aube', 'collines', 'olive', 'etoile'),
  62: d('matin', 'montagnes', 'prairie', 'rayons'),
  63: d('soir', 'collines', 'olive', 'lettre'),
  64: d('crepuscule', 'collines', 'terre', 'lettre'),
  65: d('nuit', 'plaine', 'pierre', 'etoiles'),
  // Prophétie
  66: d('crepuscule', 'mer', 'mer', 'chandeliers'),
}

export const illustrationDuLivre = (numero: number): DefIllustration =>
  ILLUSTRATIONS_BIBLE[numero] ?? d('matin', 'collines', 'prairie', 'rouleaux')

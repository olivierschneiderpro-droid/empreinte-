/**
 * Modèle d'Empreinte.
 *
 * Une Réalité existe une seule fois. Elle peut avoir plusieurs Manifestations
 * (original papier, photo, OCR, données structurées…) qui ne se confondent
 * jamais entre elles : photo ≠ facture physique, OCR ≠ facture physique.
 */

export type Genre =
  | 'document'
  | 'objet'
  | 'livre'
  | 'bible'
  | 'equipement'
  | 'mission'
  | 'projet'
  | 'paiement'
  | 'personne'
  | 'stock'
  | (string & {})

export type TypeManifestation =
  | 'physique-original'
  | 'physique-copie'
  | 'photo'
  | 'scan'
  | 'ocr'
  | 'donnees-structurees'
  | 'fichier-numerique'
  | 'impression'

export const MANIFESTATIONS_PHYSIQUES: readonly TypeManifestation[] = [
  'physique-original',
  'physique-copie',
  'impression',
]

/** Niveau de confiance par défaut de chaque manifestation (0 → 1). */
export const CONFIANCE_PAR_DEFAUT: Record<TypeManifestation, number> = {
  'physique-original': 1,
  'physique-copie': 0.85,
  impression: 0.8,
  scan: 0.9,
  photo: 0.8,
  'fichier-numerique': 0.85,
  'donnees-structurees': 0.75,
  ocr: 0.6,
}

export interface Manifestation {
  id: string
  type: TypeManifestation
  description?: string
  /** Chemin ou URI d'un fichier (photo, scan, PDF…). */
  fichier?: string
  /** Empreinte SHA-256 du fichier, pour reconnaître une même image. */
  empreinteFichier?: string
  /** Valeurs lues ou saisies sur cette manifestation (montant, date, TVA…). */
  donnees: Record<string, string | number | boolean>
  confiance: number
  source?: string
  creeLe: string
}

export interface ReferenceExterne {
  /** Ex. « numero-facture », « isbn », « numero-serie ». */
  cle: string
  valeur: string
  /** Qui a émis la référence (fournisseur, éditeur, fabricant…). */
  emetteur?: string
}

export interface Emplacement {
  /** Classement logique, ex. ['Fournisseurs', '2026', 'Achats']. */
  dossier: string[]
  /** Rangement physique, ex. ['Classeur 02', 'Section B', 'Pochette 14']. */
  rangement: string[]
  detenteur?: string
  depuis: string
  introuvable?: boolean
}

export type TypePreuve =
  | 'photo-originale'
  | 'ocr'
  | 'signature'
  | 'piece-comptable'
  | 'transaction-bancaire'
  | 'validation-humaine'
  | 'bon-de-livraison'
  | 'autre'

export interface Preuve {
  id: string
  type: TypePreuve
  description?: string
  manifestationId?: string
  par?: string
  le: string
}

export type MethodeMarquage =
  | 'numero-manuscrit'
  | 'etiquette-qr'
  | 'code-barres'
  | 'nfc'
  | 'emplacement'
  | 'couleur'

export interface Marquage {
  methode: MethodeMarquage
  /** Texte ou contenu effectivement porté sur l'objet physique. */
  contenu: string
  appliqueLe: string
}

export interface ChangementEtat {
  de: string | null
  vers: string
  le: string
  par?: string
  note?: string
  force?: boolean
}

export interface Realite {
  /** Identifiant système, ex. FAC-2026-0047. */
  id: string
  genre: Genre
  /** Précision libre, ex. « facture-rachat ». */
  sousType?: string
  titre: string
  referencesExternes: ReferenceExterne[]
  attributs: Record<string, string | number | boolean>
  manifestations: Manifestation[]
  emplacement?: Emplacement
  etat: string
  historiqueEtats: ChangementEtat[]
  preuves: Preuve[]
  marquages: Marquage[]
  /** Passages bibliques canoniques (OSIS) liés à cette réalité. */
  passages: string[]
  /** La réalité doit-elle exister physiquement ? */
  physiqueAttendu: boolean
  creeLe: string
}

export type TypeRelation =
  | 'correspond-a'
  | 'commande'
  | 'paye-par'
  | 'emise-par'
  | 'concerne-projet'
  | 'alimente-stock'
  | 'concerne-produit'
  | 'concerne-mission'
  | 'copie-de'
  | 'version-de'
  | 'appartient-a'
  | (string & {})

export interface Relation {
  id: string
  de: string
  vers: string
  type: TypeRelation
  note?: string
  creeLe: string
}

export interface Evenement {
  seq: number
  le: string
  type: string
  realiteId?: string
  details: Record<string, unknown>
  /** Hachage de l'événement précédent : le journal ne peut pas être réécrit en silence. */
  precedent: string
  hachage: string
}

export type Gravite = 'info' | 'attention' | 'critique'

export interface Anomalie {
  code:
    | 'incoherence-valeur'
    | 'doublon-potentiel'
    | 'relation-manquante'
    | 'preuve-manquante'
    | 'rupture-tracabilite'
    | 'realite-non-integree'
    | 'transition-forcee'
    | 'marquage-absent'
    | 'journal-altere'
  gravite: Gravite
  realiteIds: string[]
  message: string
  suggestion: string
}

export interface EtatRegistre {
  version: 1
  realites: Realite[]
  relations: Relation[]
  journal: Evenement[]
}

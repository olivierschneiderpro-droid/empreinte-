import type { Registre } from './registre.ts'
import { MANIFESTATIONS_PHYSIQUES, type Anomalie, type Realite } from './types.ts'

/**
 * Pour chaque réalité, les questions de la vision Empreinte :
 * qu'est-ce qui manque, est en double, n'est pas relié, est mal identifié,
 * risque d'être perdu, peut être automatisé, doit rester humain ?
 */
export interface Lacunes {
  realiteId: string
  manque: string[]
  enDouble: string[]
  nonRelie: string[]
  malIdentifie: string[]
  risquePerte: string[]
  automatisable: string[]
  resteHumain: string[]
  resteePhysique: string[]
  numerique: string[]
}

export function analyserLacunes(registre: Registre, r: Realite, anomalies: Anomalie[]): Lacunes {
  const types = new Set(r.manifestations.map(m => m.type))
  const physique = r.manifestations.some(m => MANIFESTATIONS_PHYSIQUES.includes(m.type))
  const image = types.has('photo') || types.has('scan')
  const donnees = types.has('donnees-structurees') || types.has('ocr')
  const relations = registre.relationsDe(r.id)
  const miennes = anomalies.filter(a => a.realiteIds.includes(r.id))
  const confianceMax = Math.max(0, ...r.manifestations.map(m => m.confiance))

  const l: Lacunes = {
    realiteId: r.id,
    manque: [],
    enDouble: miennes.filter(a => a.code === 'doublon-potentiel').map(a => a.message),
    nonRelie: [],
    malIdentifie: [],
    risquePerte: [],
    automatisable: [],
    resteHumain: [],
    resteePhysique: [],
    numerique: [],
  }

  if (r.physiqueAttendu && !physique) l.manque.push('Original physique non constaté.')
  if (physique && !image) l.manque.push('Aucune photo ou scan de l’original.')
  if (!donnees) l.manque.push('Aucune donnée structurée (montant, date, lignes…).')
  if (r.physiqueAttendu && !r.emplacement) l.manque.push('Emplacement physique non enregistré.')
  for (const a of miennes.filter(a => a.code === 'preuve-manquante' || a.code === 'relation-manquante')) l.manque.push(a.message)

  if (relations.length === 0) l.nonRelie.push('Aucune relation avec une autre réalité (client, fournisseur, projet, paiement…).')

  if (r.referencesExternes.length === 0) l.malIdentifie.push('Aucune référence externe (numéro d’origine, ISBN, numéro de série…).')
  if (r.manifestations.length > 0 && confianceMax < 0.7) l.malIdentifie.push(`Confiance maximale faible (${confianceMax}).`)
  for (const a of miennes.filter(a => a.code === 'incoherence-valeur')) l.malIdentifie.push(a.message)

  if (physique && !image) l.risquePerte.push('Si l’original disparaît, il n’en reste aucune trace visuelle.')
  if (r.emplacement?.introuvable) l.risquePerte.push('Original actuellement introuvable.')
  if (!physique && r.physiqueAttendu && image) l.risquePerte.push('Seule la représentation numérique est connue.')

  if (image && !donnees) l.automatisable.push('Extraire les données de la photo par OCR (puis faire valider).')
  if (physique && r.marquages.length === 0) l.automatisable.push(`Imprimer l’étiquette QR de ${r.id}.`)
  if (r.physiqueAttendu && !r.emplacement) l.automatisable.push('Calculer un emplacement selon le plan de classement.')
  if (r.genre === 'paiement') l.automatisable.push('Rapprocher automatiquement avec le relevé bancaire importé.')

  l.resteHumain.push('Trancher chaque anomalie : le système signale, l’humain décide.')
  if (r.sousType?.startsWith('facture')) l.resteHumain.push('Valider la facture et la signature ; décider du paiement.')
  if (r.genre === 'bible' || r.passages.length > 0) l.resteHumain.push('La lecture, la méditation et l’étude elles-mêmes.')

  if (r.physiqueAttendu) l.resteePhysique.push('L’original reste la référence ; ses représentations n’en sont que des empreintes.')
  if (r.sousType?.startsWith('facture')) l.resteePhysique.push('Conserver l’original papier pendant la durée légale.')
  if (r.genre === 'bible' || r.genre === 'livre') l.resteePhysique.push('L’exemplaire, ses annotations et son usage.')

  l.numerique.push('Identité, historique, relations, recherche et détection des incohérences.')
  return l
}

export function analyserToutesLacunes(registre: Registre, anomalies: Anomalie[]): Lacunes[] {
  return registre.realites.map(r => analyserLacunes(registre, r, anomalies))
}

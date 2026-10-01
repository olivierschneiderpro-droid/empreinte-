import type { Genre } from './types.ts'

const PREFIXES: Record<string, string> = {
  document: 'DOC',
  facture: 'FAC',
  objet: 'OBJ',
  livre: 'LIV',
  bible: 'BIB',
  equipement: 'EQP',
  mission: 'MIS',
  projet: 'PRJ',
  paiement: 'PAY',
  personne: 'PER',
  stock: 'STK',
}

/** Une facture est un document, mais elle mérite son propre préfixe FAC. */
export function prefixePour(genre: Genre, sousType?: string): string {
  if (sousType?.startsWith('facture')) return PREFIXES.facture
  return PREFIXES[genre] ?? genre.slice(0, 3).toUpperCase().padEnd(3, 'X')
}

export function formaterIdentifiant(prefixe: string, annee: number, numero: number): string {
  return `${prefixe}-${annee}-${String(numero).padStart(4, '0')}`
}

const MOTIF = /^([A-Z]{3})-(\d{4})-(\d{4,})$/

export function lireIdentifiant(id: string): { prefixe: string; annee: number; numero: number } | null {
  const m = MOTIF.exec(id)
  if (!m) return null
  return { prefixe: m[1], annee: Number(m[2]), numero: Number(m[3]) }
}

/**
 * Propose un identifiant système. Quand la réalité physique porte déjà un numéro
 * (facture n° 47) et qu'il est libre, on le reprend : FAC-2026-0047. Ainsi le papier
 * et le système parlent la même langue. Sinon, on prend le suivant disponible.
 */
export function proposerIdentifiant(
  existants: Iterable<string>,
  prefixe: string,
  annee: number,
  numeroSouhaite?: number,
): string {
  const pris = new Set<number>()
  for (const id of existants) {
    const lu = lireIdentifiant(id)
    if (lu && lu.prefixe === prefixe && lu.annee === annee) pris.add(lu.numero)
  }
  if (numeroSouhaite !== undefined && numeroSouhaite > 0 && !pris.has(numeroSouhaite)) {
    return formaterIdentifiant(prefixe, annee, numeroSouhaite)
  }
  let n = 1
  while (pris.has(n)) n++
  return formaterIdentifiant(prefixe, annee, n)
}

/** Extrait le numéro d'une référence comme « F-47 », « 2026/047 » ou « 47 ». */
export function numeroDepuisReference(valeur: string): number | undefined {
  const m = /(\d+)\D*$/.exec(valeur)
  return m ? Number(m[1]) : undefined
}

/** Contenu d'un QR code de liaison : court, lisible, sans dépendre d'un serveur. */
export function contenuQr(id: string): string {
  return `EMPREINTE:${id}`
}

export function idDepuisQr(contenu: string): string | null {
  const m = /^EMPREINTE:(.+)$/.exec(contenu.trim())
  return m ? m[1] : null
}

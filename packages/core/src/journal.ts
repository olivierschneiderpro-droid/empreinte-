import { createHash } from 'node:crypto'
import type { Evenement } from './types.ts'

const ORIGINE = '0'.repeat(64)

function hacher(e: Omit<Evenement, 'hachage'>): string {
  const contenu = JSON.stringify([e.seq, e.le, e.type, e.realiteId ?? null, e.details, e.precedent])
  return createHash('sha256').update(contenu).digest('hex')
}

/** Ajoute un événement chaîné au précédent. Le journal n'est jamais réécrit. */
export function ajouterEvenement(
  journal: Evenement[],
  le: string,
  type: string,
  realiteId: string | undefined,
  details: Record<string, unknown>,
): Evenement {
  const precedent = journal.at(-1)?.hachage ?? ORIGINE
  const base = { seq: journal.length + 1, le, type, realiteId, details, precedent }
  const evenement: Evenement = { ...base, hachage: hacher(base) }
  journal.push(evenement)
  return evenement
}

/** Renvoie le numéro du premier événement altéré, ou `null` si la chaîne est intacte. */
export function verifierJournal(journal: Evenement[]): number | null {
  let precedent = ORIGINE
  for (const e of journal) {
    const { hachage, ...base } = e
    if (e.precedent !== precedent || hacher(base) !== hachage) return e.seq
    precedent = hachage
  }
  return null
}

export function empreinteContenu(contenu: Buffer | string): string {
  return createHash('sha256').update(contenu).digest('hex')
}

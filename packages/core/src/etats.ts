import type { Realite } from './types.ts'

/**
 * Cycles de vie connus. Une transition hors cycle reste possible (le réel a
 * toujours raison), mais elle doit être forcée et sera signalée pour vérification.
 */
const CYCLES: Record<string, { initial: string; transitions: Record<string, string[]> }> = {
  document: {
    initial: 'recu',
    transitions: {
      recu: ['verifie', 'conteste', 'annule'],
      verifie: ['paye', 'conteste', 'annule', 'archive'],
      paye: ['rembourse', 'archive', 'conteste'],
      conteste: ['verifie', 'annule'],
      rembourse: ['archive'],
      annule: ['archive'],
      archive: [],
    },
  },
  paiement: {
    initial: 'enregistre',
    transitions: {
      enregistre: ['rapproche', 'annule'],
      rapproche: ['archive'],
      annule: ['archive'],
      archive: [],
    },
  },
  livre: {
    initial: 'disponible',
    transitions: {
      disponible: ['prete', 'perdu', 'retire'],
      prete: ['disponible', 'perdu'],
      perdu: ['disponible', 'retire'],
      retire: [],
    },
  },
  equipement: {
    initial: 'en-service',
    transitions: {
      'en-service': ['en-maintenance', 'hors-service', 'perdu'],
      'en-maintenance': ['en-service', 'hors-service'],
      'hors-service': ['en-maintenance', 'retire'],
      perdu: ['en-service', 'retire'],
      retire: [],
    },
  },
  mission: {
    initial: 'preparee',
    transitions: {
      preparee: ['en-cours', 'annulee'],
      'en-cours': ['terminee', 'suspendue'],
      suspendue: ['en-cours', 'annulee'],
      terminee: [],
      annulee: [],
    },
  },
}
CYCLES.bible = CYCLES.livre

export function etatInitial(genre: string): string {
  return CYCLES[genre]?.initial ?? 'enregistre'
}

/** `null` : pas de cycle connu pour ce genre, toute transition est libre. */
export function transitionsPossibles(realite: Realite): string[] | null {
  const cycle = CYCLES[realite.genre]
  if (!cycle) return null
  return cycle.transitions[realite.etat] ?? []
}

export function transitionValide(realite: Realite, vers: string): boolean {
  const possibles = transitionsPossibles(realite)
  return possibles === null || possibles.includes(vers)
}

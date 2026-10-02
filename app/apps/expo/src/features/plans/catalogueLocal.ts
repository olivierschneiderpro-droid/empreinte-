import type { OnlinePlan, Section } from '~common/types'

/**
 * Empreinte : les plans de lecture livrés avec l'app (BibleProject et Empreinte, FR/EN),
 * issus de output/imports/reading-plans-2026-09. Ils s'affichent même sans la base Firestore
 * de Bible Strong ; les plans de Firestore restent prioritaires quand elle répond.
 */
type CatalogueLocal = { plans: OnlinePlan[]; sections: Record<string, Section[]> }

export const chargerCatalogueLocal = async (): Promise<CatalogueLocal> =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./catalogueLocal.json') as CatalogueLocal

/** Fusionne Firestore et le catalogue local : même identifiant → la version Firestore. */
export const fusionnerPlans = (enLigne: OnlinePlan[], locaux: OnlinePlan[]) => {
  const ids = new Set(enLigne.map(plan => plan.id))
  return [...enLigne, ...locaux.filter(plan => !ids.has(plan.id))]
}

/** Firestore peut rester sans réponse (domaine non autorisé, hors ligne) : on n'attend pas. */
export const avecDelai = <T>(promesse: Promise<T>, ms: number) =>
  Promise.race([
    promesse,
    new Promise<never>((_, refus) => setTimeout(() => refus(new Error('délai dépassé')), ms)),
  ])

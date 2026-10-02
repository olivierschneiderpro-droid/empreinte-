/** Retient que la personne est déjà entrée dans l'app (web) : la présentation ne revient plus. */
const CLE_ENTREE = 'empreinte:entree'

export const dejaEntre = () => {
  try {
    return globalThis.localStorage?.getItem(CLE_ENTREE) === '1'
  } catch {
    return false
  }
}

export const retenirEntree = () => {
  try {
    globalThis.localStorage?.setItem(CLE_ENTREE, '1')
  } catch {
    // Navigation privée : la présentation reviendra à la prochaine visite.
  }
}

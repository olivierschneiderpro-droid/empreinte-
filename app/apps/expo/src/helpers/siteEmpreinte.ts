/**
 * Empreinte : adresse du site de présentation, pour les liens partagés (« la suite sur … »).
 * Sur le web, c'est le site qui sert l'app ; sinon, aucune adresse n'est inventée.
 */
export const urlSiteEmpreinte = (chemin = '') => {
  const origine = typeof globalThis.location?.origin === 'string' ? globalThis.location.origin : ''
  return origine ? `${origine}/${chemin.replace(/^\//, '')}` : ''
}

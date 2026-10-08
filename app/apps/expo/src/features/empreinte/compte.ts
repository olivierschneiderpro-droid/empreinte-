/**
 * Empreinte : la règle unique du compte.
 * Libre sans compte : la Bible, le verset du jour, la recherche, les vidéos, l'audio, les
 * ressources d'étude. Avec un compte : ce qui est à soi et qui se garde (études, notes,
 * marque-pages, surlignages, étiquettes, réalités, profil) et les plans, qui sont un parcours.
 */
const PREFIXES_COMPTE = [
  '/studies',
  '/edit-study',
  '/bible-verse-notes',
  '/bookmarks',
  '/highlights',
  '/tags',
  '/empreinte',
  '/profile',
  '/plans',
  '/plan',
  '/my-plan-list',
]

export const exigeCompte = (chemin: string) =>
  PREFIXES_COMPTE.some(prefixe => chemin === prefixe || chemin.startsWith(`${prefixe}/`)) ||
  chemin.startsWith('/plan-slice') ||
  chemin.startsWith('/plan?')

/** Pages qui s'affichent seules, sans barre latérale. */
export const PAGES_SANS_COQUE = ['/login', '/register', '/forgot-password']

const CLE_INVITE = 'empreinte.choixInvite'

export const aChoisiInvite = () => {
  try {
    return globalThis.localStorage?.getItem(CLE_INVITE) === '1'
  } catch {
    return false
  }
}

export const choisirInvite = () => {
  try {
    globalThis.localStorage?.setItem(CLE_INVITE, '1')
  } catch {
    // Navigation privée : le choix vaut pour cette visite seulement.
  }
}

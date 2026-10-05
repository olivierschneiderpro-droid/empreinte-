/**
 * Empreinte : chaque page a sa propre recherche. La barre ouvre la recherche générale déjà
 * placée sur le bon périmètre (passages, plans, commentaires…) avec une invite adaptée.
 */
export type ContexteRecherche = { scope?: string; invite: string }

const CONTEXTES: { prefixes: string[]; contexte: ContexteRecherche }[] = [
  {
    prefixes: ['/plan', '/my-plan-list'],
    contexte: { scope: 'plan', invite: 'Rechercher un plan, une méditation…' },
  },
  {
    prefixes: ['/commentar'],
    contexte: { scope: 'commentary', invite: 'Rechercher un commentaire…' },
  },
  {
    prefixes: ['/timeline'],
    contexte: { scope: 'timeline', invite: 'Rechercher un événement, une époque…' },
  },
  {
    prefixes: ['/bible-verse-notes', '/note'],
    contexte: { scope: 'notes', invite: 'Rechercher dans vos notes…' },
  },
  {
    prefixes: ['/studies', '/edit-study'],
    contexte: { scope: 'study', invite: 'Rechercher une étude…' },
  },
  {
    prefixes: ['/lexique', '/strong'],
    contexte: { scope: 'strong', invite: 'Rechercher un mot hébreu ou grec…' },
  },
  {
    prefixes: ['/nave'],
    contexte: { scope: 'nave', invite: 'Rechercher un thème, un personnage…' },
  },
  {
    prefixes: ['/dictionnaire', '/dictionnary', '/dictionary'],
    contexte: { scope: 'dictionary', invite: 'Rechercher un mot du dictionnaire…' },
  },
  {
    prefixes: ['/daily-verse', '/daily-reading'],
    contexte: { scope: 'bible', invite: 'Rechercher un verset…' },
  },
  { prefixes: ['/passage-media'], contexte: { invite: 'Rechercher une vidéo, un cours…' } },
  { prefixes: ['/history'], contexte: { invite: 'Rechercher dans vos récents…' } },
  { prefixes: ['/bookmarks'], contexte: { invite: 'Rechercher un marque-page, un passage…' } },
  { prefixes: ['/highlights'], contexte: { invite: 'Rechercher un surlignage, un passage…' } },
  { prefixes: ['/empreinte'], contexte: { invite: 'Rechercher une réalité, un passage…' } },
]

/** Bible (« / ») : on cherche des versets et des passages. */
export const contexteRecherche = (chemin: string): ContexteRecherche => {
  if (chemin === '/' || chemin.startsWith('/bible')) {
    return { scope: 'bible', invite: 'Rechercher un verset, un passage, un mot…' }
  }
  return (
    CONTEXTES.find(({ prefixes }) => prefixes.some(prefixe => chemin.startsWith(prefixe)))
      ?.contexte ?? { invite: 'Rechercher un passage, un mot, un thème…' }
  )
}

/**
 * Empreinte : une entrée Nave est un long texte HTML (rubriques suivies de leurs références).
 * On en tire une vue d'ensemble lisible : les rubriques dans l'ordre (pour une personne,
 * c'est le fil de son histoire), les renvois vers d'autres thèmes, et le nombre de passages.
 */
export type RubriqueNave = {
  intitule: string
  references: number
  /** Premier passage de la rubrique, au format « livre-chapitre-versets ». */
  premierPassage?: string
}

export type AnalyseNave = {
  rubriques: RubriqueNave[]
  voirAussi: { nom: string; cle: string }[]
  totalReferences: number
}

const ENTITES: Record<string, string> = {
  amp: '&',
  nbsp: ' ',
  quot: '"',
  apos: '’',
  lt: '<',
  gt: '>',
}

export const decoderEntites = (texte: string) =>
  texte
    .replace(/&#x([0-9a-f]+);/gi, (_, hexa: string) => String.fromCodePoint(parseInt(hexa, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&([a-z]+);/gi, (entite, nom: string) => ENTITES[nom.toLowerCase()] ?? entite)

const sansBalises = (html: string) =>
  decoderEntites(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

const LIEN = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi

export const analyserNave = (html: string): AnalyseNave => {
  const rubriques: RubriqueNave[] = []
  const voirAussi = new Map<string, string>()
  let totalReferences = 0

  for (const bloc of html.split(/<\/p>|<br\s*\/?>|<\/li>|<\/h\d>|<\/div>|\n/i)) {
    const liens = [...bloc.matchAll(LIEN)]
    const passages = liens.filter(([, cible]) => cible.startsWith('v='))
    for (const [, cible, libelle] of liens) {
      if (!cible.startsWith('w=')) continue
      const cle = cible.slice(2)
      if (cle && !voirAussi.has(cle)) voirAussi.set(cle, sansBalises(libelle) || cle)
    }
    totalReferences += passages.length
    const debut = bloc.search(/<a\b/i)
    const intitule = sansBalises(debut >= 0 ? bloc.slice(0, debut) : bloc)
      .replace(/^[\s,;:.\-–—]+|[\s,;:.\-–—(]+$/g, '')
      .trim()
    if (!intitule || !passages.length || intitule.length > 140) continue
    rubriques.push({
      intitule: (intitule.charAt(0).toUpperCase() + intitule.slice(1)).replace(/'/g, '’'),
      references: passages.length,
      premierPassage: passages[0]?.[1].slice(2),
    })
  }

  return {
    rubriques,
    voirAussi: [...voirAussi].map(([cle, nom]) => ({ cle, nom })),
    totalReferences,
  }
}

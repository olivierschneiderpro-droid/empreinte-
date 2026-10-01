import { createBibleReferenceParser, type BibleReferenceParser } from '@empreinte/bible-references'

/**
 * Pont avec la couche biblique issue de Bible Strong : une Bible physique, une note
 * de journal ou une mission peut être reliée aux passages qu'elle concerne.
 */
const parseurs = new Map<'fr' | 'en', BibleReferenceParser>()

function parseur(langue: 'fr' | 'en'): BibleReferenceParser {
  let p = parseurs.get(langue)
  if (!p) {
    p = createBibleReferenceParser(langue)
    parseurs.set(langue, p)
  }
  return p
}

/** « Jean 3:16 et Rom 8.28-30 » → ['John.3.16', 'Rom.8.28-Rom.8.30'] */
export function extrairePassages(texte: string, langue: 'fr' | 'en' = 'fr'): string[] {
  const osis = parseur(langue).parse(texte).osis()
  return osis ? osis.split(',') : []
}

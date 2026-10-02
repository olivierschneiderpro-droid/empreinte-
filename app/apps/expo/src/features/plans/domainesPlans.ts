import type { OnlinePlan, Section } from '~common/types'

/** Empreinte : les plans sont rangés par domaines de vie liés à l'Écriture. */
export type DomainePlan = 'dieu' | 'jesus' | 'eglise' | 'sagesse' | 'lire' | 'autres'

export const DOMAINES: { id: DomainePlan; fr: string; en: string; motsCles: string[] }[] = [
  {
    id: 'lire',
    fr: 'Apprendre à lire la Bible',
    en: 'Learn to read the Bible',
    motsCles: ['how-to-read'],
  },
  {
    id: 'jesus',
    fr: 'Découvrir Jésus',
    en: 'Discover Jesus',
    motsCles: ['mark', 'strong-john', 'gospels', 'sermon'],
  },
  {
    id: 'dieu',
    fr: 'Connaître Dieu',
    en: 'Know God',
    motsCles: ['character-of-god', 'lords-prayer'],
  },
  {
    id: 'eglise',
    fr: 'L’Église et les lettres',
    en: 'The Church and the letters',
    motsCles: ['acts', 'paul', 'writings-of-john', 'james', 'philippians'],
  },
  {
    id: 'sagesse',
    fr: 'Sagesse et vie quotidienne',
    en: 'Wisdom for daily life',
    motsCles: ['proverbs', 'hope'],
  },
  { id: 'autres', fr: 'Autres parcours', en: 'More journeys', motsCles: [] },
]

export const domaineDuPlan = (plan: Pick<OnlinePlan, 'id'>): DomainePlan =>
  DOMAINES.find(domaine => domaine.motsCles.some(mot => plan.id.includes(mot)))?.id ?? 'autres'

/** Les façons de vivre un plan : chaque étape reste séparée, mais tout peut se combiner. */
export type FormatPlan = 'lire' | 'ecouter' | 'regarder' | 'mediter'

export const FORMATS: {
  id: FormatPlan
  fr: string
  en: string
  icone: 'book' | 'headph' | 'play' | 'note'
}[] = [
  { id: 'lire', fr: 'Lire', en: 'Read', icone: 'book' },
  { id: 'ecouter', fr: 'Écouter', en: 'Listen', icone: 'headph' },
  { id: 'regarder', fr: 'Regarder', en: 'Watch', icone: 'play' },
  { id: 'mediter', fr: 'Méditer', en: 'Reflect', icone: 'note' },
]

/** Formats présents dans les étapes d'un plan (le texte biblique peut aussi s'écouter). */
export const formatsDuPlan = (sections?: Section[]): FormatPlan[] => {
  if (!sections) return []
  const types = new Set(
    sections.flatMap(section =>
      section.readingSlices.flatMap(lecture => lecture.slices.map(etape => etape.type ?? 'Verse'))
    )
  )
  const formats: FormatPlan[] = []
  if (types.has('Chapter') || types.has('Verse')) formats.push('lire', 'ecouter')
  if (types.has('Video')) formats.push('regarder')
  if (types.has('Text')) formats.push('mediter')
  return formats
}

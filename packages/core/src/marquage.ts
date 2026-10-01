import { contenuQr } from './identifiants.ts'
import type { MethodeMarquage, Realite } from './types.ts'

/**
 * Comment relier un objet physique à son empreinte numérique ?
 * Aucune méthode n'est imposée : chacune est évaluée selon le contexte.
 */
export interface ContexteMarquage {
  support?: 'papier' | 'livre' | 'objet' | 'electronique' | 'carton'
  /** Peut-on écrire directement sur l'original ? */
  peutEcrireDessus?: boolean
  /** Objet de valeur ou ancien : rien qui l'abîme (adhésif, encre). */
  patrimonial?: boolean
  imprimante?: boolean
  telephone?: boolean
  nfc?: boolean
  lecteurCodeBarres?: boolean
  /** Nombre de réalités de même nature à gérer. */
  volume?: number
  manipulations?: 'rare' | 'frequente'
}

export interface PropositionMarquage {
  methode: MethodeMarquage
  score: number
  contenu: string
  raisons: string[]
}

export interface RecommandationMarquage {
  /** Identifie l'objet (numéro, QR, code-barres, NFC). */
  principal: PropositionMarquage
  /** Aide à le retrouver ou à le lire si le principal échoue. */
  complements: PropositionMarquage[]
  toutes: PropositionMarquage[]
}

const IDENTIFIANTS: MethodeMarquage[] = ['numero-manuscrit', 'etiquette-qr', 'code-barres', 'nfc']

const COULEURS = ['bleu', 'vert', 'jaune', 'rouge', 'violet', 'orange', 'gris']

/** Couleur stable par domaine (premier niveau du dossier). */
export function couleurPour(domaine: string): string {
  let h = 0
  for (const c of domaine) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return COULEURS[h % COULEURS.length]
}

function supportPar(r: Realite): NonNullable<ContexteMarquage['support']> {
  if (r.genre === 'livre' || r.genre === 'bible') return 'livre'
  if (r.genre === 'equipement') return 'electronique'
  if (r.genre === 'objet' || r.genre === 'stock') return 'objet'
  return 'papier'
}

export function proposerMarquages(r: Realite, c: ContexteMarquage = {}): RecommandationMarquage {
  const support = c.support ?? supportPar(r)
  const patrimonial = c.patrimonial ?? false
  const ecrire = c.peutEcrireDessus ?? (support === 'papier' && !patrimonial)
  const imprimante = c.imprimante ?? true
  const telephone = c.telephone ?? true
  const volume = c.volume ?? 50
  const domaine = r.emplacement?.dossier[0]

  const props: PropositionMarquage[] = []
  const ajouter = (methode: MethodeMarquage, contenu: string, base: number, ajustements: [boolean, number, string][]) => {
    let score = base
    const raisons: string[] = []
    for (const [condition, delta, raison] of ajustements) {
      if (!condition) continue
      score += delta
      raisons.push(raison)
    }
    props.push({ methode, contenu, score: Math.max(0, Math.min(10, score)), raisons })
  }

  ajouter('numero-manuscrit', r.id, 6, [
    [ecrire, 2, 'Lisible par tous, sans appareil, ne s’efface pas avec la technologie.'],
    [!ecrire, -2, 'Ne pas écrire sur l’original : inscrire le numéro sur un marque-page, une fiche ou la pochette.'],
    [volume > 500, -1, 'Gros volume : risque d’erreur de recopie.'],
  ])
  ajouter('etiquette-qr', contenuQr(r.id), 6, [
    [telephone, 2, 'Un scan avec le téléphone ouvre directement l’empreinte numérique.'],
    [volume > 100, 1, 'Retrouver vite un élément parmi beaucoup.'],
    [!imprimante, -5, 'Nécessite une imprimante pour les étiquettes.'],
    [patrimonial, -3, 'Ne pas coller sur l’original : utiliser une pochette, un marque-page ou une fiche.'],
  ])
  ajouter('code-barres', r.id, 3, [
    [!!c.lecteurCodeBarres, 3, 'Lecteur disponible : lecture très rapide en série.'],
    [volume > 500, 1, 'Adapté aux inventaires volumineux.'],
    [!imprimante, -4, 'Nécessite une imprimante.'],
  ])
  ajouter('nfc', contenuQr(r.id), 1, [
    [!!c.nfc, 4, 'Puces NFC disponibles : lecture sans contact.'],
    [support === 'objet' || support === 'electronique', 2, 'Résiste mieux qu’une étiquette papier sur un objet manipulé.'],
    [support === 'papier', -1, 'Peu pertinent sur une feuille.'],
  ])
  ajouter(
    'emplacement',
    r.emplacement?.rangement.join(' → ') || 'à définir',
    5,
    [
      [c.manipulations === 'rare', 2, 'Peu déplacé : l’emplacement reste fiable.'],
      [c.manipulations === 'frequente', -2, 'Souvent déplacé : l’emplacement seul ne suffit pas.'],
      [!r.emplacement, -1, 'Aucun emplacement encore attribué.'],
    ],
  )
  ajouter('couleur', domaine ? couleurPour(domaine) : 'selon le domaine', 2, [
    [volume > 50, 2, 'Tri visuel immédiat par domaine.'],
    [true, 0, 'Ne suffit jamais seule à identifier.'],
  ])

  const toutes = props.sort((a, b) => b.score - a.score)
  const principal = toutes.find(p => IDENTIFIANTS.includes(p.methode))!
  const complements: PropositionMarquage[] = []
  // Un code machine doit toujours avoir un équivalent lisible par l'humain.
  if (principal.methode !== 'numero-manuscrit') {
    const lisible = toutes.find(p => p.methode === 'numero-manuscrit')!
    complements.push({
      ...lisible,
      raisons: [`Texte lisible à côté du code : ${r.id}, utile si le code est abîmé.`, ...lisible.raisons],
    })
  }
  const reperage = toutes.find(p => !IDENTIFIANTS.includes(p.methode) && p.score >= 4)
  if (reperage) complements.push(reperage)
  return { principal, complements, toutes }
}

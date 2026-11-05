import { COULEURS_THEME, type FicheChant } from './chants'

/**
 * Empreinte · Partager un couplet en image : une carte carrée (dégradé du thème, paroles,
 * titre et auteur) dessinée dans le navigateur, partagée si l'appareil le permet, sinon
 * téléchargée.
 */
const couper = (contexte: CanvasRenderingContext2D, ligne: string, largeur: number) => {
  const mots = ligne.split(' ')
  const lignes: string[] = []
  let courante = ''
  for (const mot of mots) {
    const essai = courante ? `${courante} ${mot}` : mot
    if (contexte.measureText(essai).width > largeur && courante) {
      lignes.push(courante)
      courante = mot
    } else courante = essai
  }
  if (courante) lignes.push(courante)
  return lignes
}

export const imageDuCouplet = async (chant: FicheChant, lignes: string[]): Promise<Blob | null> => {
  if (typeof document === 'undefined') return null
  const taille = 1080
  const toile = document.createElement('canvas')
  toile.width = taille
  toile.height = taille
  const c = toile.getContext('2d')
  if (!c) return null
  const [debut, fin] = COULEURS_THEME[chant.theme]
  const fond = c.createLinearGradient(0, 0, taille, taille)
  fond.addColorStop(0, debut)
  fond.addColorStop(1, fin)
  c.fillStyle = fond
  c.fillRect(0, 0, taille, taille)
  // Un halo doux, comme sur la page du chant.
  const halo = c.createRadialGradient(
    taille * 0.8,
    taille * 0.2,
    0,
    taille * 0.8,
    taille * 0.2,
    taille * 0.7
  )
  halo.addColorStop(0, 'rgba(255,255,255,0.18)')
  halo.addColorStop(1, 'rgba(255,255,255,0)')
  c.fillStyle = halo
  c.fillRect(0, 0, taille, taille)

  await document.fonts?.ready
  const marge = 110
  let taillePolice = 58
  let texte: string[] = []
  // On réduit la police jusqu'à ce que le couplet tienne dans la carte.
  for (; taillePolice >= 34; taillePolice -= 4) {
    c.font = `${taillePolice}px "Literata Book", Georgia, serif`
    texte = lignes.flatMap(ligne => couper(c, ligne, taille - marge * 2))
    if (texte.length * taillePolice * 1.45 < taille - 380) break
  }
  c.fillStyle = 'white'
  c.textBaseline = 'top'
  const hauteur = texte.length * taillePolice * 1.45
  let y = (taille - hauteur) / 2 - 30
  for (const ligne of texte) {
    c.fillText(ligne, marge, y)
    y += taillePolice * 1.45
  }
  c.fillStyle = 'rgba(255,255,255,0.92)'
  c.font = `600 34px "Geist SemiBold", system-ui, sans-serif`
  c.fillText(chant.titre, marge, taille - 190)
  c.fillStyle = 'rgba(255,255,255,0.7)'
  c.font = `26px Geist, system-ui, sans-serif`
  c.fillText(`${chant.auteur} · ${chant.annee}`, marge, taille - 140)
  c.fillStyle = 'rgba(255,255,255,0.55)'
  c.font = `600 24px "Geist SemiBold", system-ui, sans-serif`
  c.fillText('EMPREINTE', marge, 80)
  return new Promise(resolve => toile.toBlob(resolve, 'image/png'))
}

export const partagerCouplet = async (chant: FicheChant, lignes: string[]) => {
  const image = await imageDuCouplet(chant, lignes)
  if (!image) return
  const fichier = new File([image], `${chant.id}.png`, { type: 'image/png' })
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean }
  if (nav.share && nav.canShare?.({ files: [fichier] })) {
    try {
      await nav.share({ files: [fichier], title: chant.titre })
      return
    } catch {
      // Partage annulé : on propose le téléchargement à la place.
    }
  }
  const lien = document.createElement('a')
  lien.href = URL.createObjectURL(image)
  lien.download = `${chant.id}.png`
  lien.click()
  setTimeout(() => URL.revokeObjectURL(lien.href), 4000)
}

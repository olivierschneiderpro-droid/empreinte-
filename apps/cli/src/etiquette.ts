import QRCode from 'qrcode'
import { contenuQr, type Realite } from '@empreinte/core'

const echapper = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/**
 * Étiquette à imprimer et coller (ou glisser) avec l'original :
 * un QR code pour la machine, l'identifiant et l'emplacement en clair pour l'humain.
 */
export async function etiquetteSvg(r: Realite): Promise<string> {
  const qr = await QRCode.toString(contenuQr(r.id), { type: 'svg', errorCorrectionLevel: 'M', margin: 1 })
  const interieur = qr.replace('<svg ', '<svg x="20" y="12" width="200" height="200" ')
  const rangement = r.emplacement?.rangement.join(' · ') ?? ''
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="290" viewBox="0 0 240 290">',
    '<rect width="240" height="290" fill="#fff" stroke="#000" stroke-width="1"/>',
    interieur,
    `<text x="120" y="238" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">${echapper(r.id)}</text>`,
    `<text x="120" y="260" font-family="sans-serif" font-size="11" text-anchor="middle">${echapper(r.titre.slice(0, 36))}</text>`,
    `<text x="120" y="278" font-family="sans-serif" font-size="10" text-anchor="middle">${echapper(rangement)}</text>`,
    '</svg>',
  ].join('\n')
}

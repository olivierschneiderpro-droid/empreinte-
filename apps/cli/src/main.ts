import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Registre } from '@empreinte/core'
import { executer } from './commandes.ts'
import { charger, enregistrer } from './stockage.ts'

/** Scénario de la vision : la facture physique n° 47 devient une réalité traçable. */
export function scenarioDemo(dossier: string): string[][] {
  return [
    ['integrer', 'document', '--sous-type', 'facture-rachat', '--titre', 'Facture de rachat F-47', '--ref', 'numero-facture=F-47@Client Dupont', '--attr', 'montant=1250', '--attr', 'date=2026-09-28', '--attr', 'sens=achat', '--annee', '2026'],
    ['manifester', 'FAC-2026-0047', 'physique-original', '--donnee', 'montant=1 250 €', '--description', 'Original papier signé'],
    ['manifester', 'FAC-2026-0047', 'photo', '--fichier', 'photos/F-47.jpg'],
    ['manifester', 'FAC-2026-0047', 'donnees-structurees', '--donnee', 'montant=1520', '--donnee', 'tva=20', '--description', 'Saisie comptable'],
    ['proposer-marquage', 'FAC-2026-0047', '--volume', '600'],
    ['placer', 'FAC-2026-0047', '--auto'],
    ['marquer', 'FAC-2026-0047', 'etiquette-qr', 'EMPREINTE:FAC-2026-0047'],
    ['etiquette', 'FAC-2026-0047', '--sortie', join(dossier, 'FAC-2026-0047.svg')],
    ['etat', 'FAC-2026-0047', 'verifie', '--par', 'Olivier'],
    ['etat', 'FAC-2026-0047', 'paye'],
    ['integrer', 'paiement', '--titre', 'Virement facture F-47', '--attr', 'montant=1250', '--annee', '2026'],
    ['verifier'],
    ['relier', 'FAC-2026-0047', 'paye-par', 'PAY-2026-0001'],
    ['preuve', 'FAC-2026-0047', 'validation-humaine', '--par', 'Olivier'],
    ['integrer', 'bible', '--titre', 'Bible Segond 21 — exemplaire de mission', '--attr', 'traduction=Segond 21', '--annee', '2026'],
    ['passages', 'BIB-2026-0001', 'Étudié : Jean 3:16, Ps 23 et Rom 8.28-30'],
    ['corriger', 'FAC-2026-0047/M3', '--donnee', 'montant=1250', '--par', 'Olivier', '--note', 'Erreur de saisie, contrôlé sur l’original'],
    ['scan', 'EMPREINTE:FAC-2026-0047'],
    ['lacunes', 'FAC-2026-0047'],
    ['organiser', '--nombre', '600', '--recherches', '10', '--domaines', '5', '--projets', '3', '--conservation', '10'],
    ['verifier'],
  ]
}

async function demo(): Promise<void> {
  const dossier = mkdtempSync(join(tmpdir(), 'empreinte-demo-'))
  const registre = new Registre()
  for (const argv of scenarioDemo(dossier)) {
    console.log(`\n$ empreinte ${argv.map(a => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')}`)
    console.log((await executer(argv, registre)).sortie)
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  if (argv[0] === 'demo') return demo()
  const registre = charger()
  const { sortie, modifie } = await executer(argv, registre)
  if (modifie) enregistrer(registre)
  console.log(sortie)
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('main.ts')) {
  main().catch((e: Error) => {
    console.error(`✖ ${e.message}`)
    process.exitCode = 1
  })
}

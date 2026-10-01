import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { Registre } from '@empreinte/core'
import { executer } from '../src/commandes.ts'
import { scenarioDemo } from '../src/main.ts'

test('le scénario F-47 complet aboutit à une seule anomalie restante', async () => {
  const dossier = mkdtempSync(join(tmpdir(), 'empreinte-test-'))
  const registre = new Registre()
  let derniere = ''
  for (const argv of scenarioDemo(dossier)) derniere = (await executer(argv, registre)).sortie
  assert.match(derniere, /PAY-2026-0001 de 1250 : aucune preuve « transaction-bancaire »/)
  assert.doesNotMatch(derniere, /incoherence-valeur/)
  const svg = readFileSync(join(dossier, 'FAC-2026-0047.svg'), 'utf8')
  assert.match(svg, /^<svg/)
  assert.match(svg, /FAC-2026-0047/)
  assert.deepEqual(registre.obtenir('FAC-2026-0047').emplacement?.rangement, ['Classeur 01', 'Section A', 'Pochette 01'])
})

test('un QR inconnu signale une réalité physique à intégrer', async () => {
  const { sortie } = await executer(['scan', 'EMPREINTE:FAC-2026-0099'], new Registre())
  assert.match(sortie, /à intégrer/)
})

test('le binaire persiste le registre entre deux appels', () => {
  const chemin = join(mkdtempSync(join(tmpdir(), 'empreinte-bin-')), 'registre.json')
  const bin = new URL('../bin/empreinte.js', import.meta.url).pathname
  const env = { ...process.env, EMPREINTE_REGISTRE: chemin }
  execFileSync(bin, ['integrer', 'livre', '--titre', 'Concordance Strong', '--ref', 'isbn=978-2-00000-000-0'], { env })
  const sortie = execFileSync(bin, ['chercher', 'strong'], { env, encoding: 'utf8' })
  assert.match(sortie, /LIV-\d{4}-0001 .*Concordance Strong/)
})

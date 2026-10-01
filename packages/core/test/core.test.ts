import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  Registre,
  analyserLacunes,
  comparerStrategies,
  detecterAnomalies,
  extrairePassages,
  idDepuisQr,
  normaliserValeur,
  proposerEmplacement,
  proposerIdentifiant,
  proposerMarquages,
  verifierJournal,
} from '../src/index.ts'

const horloge = () => new Date('2026-10-01T09:00:00Z')

function factureF47(registre = new Registre(undefined, horloge)) {
  const f = registre.integrer({
    genre: 'document',
    sousType: 'facture-rachat',
    titre: 'Facture de rachat F-47',
    references: [{ cle: 'numero-facture', valeur: 'F-47', emetteur: 'Client Dupont' }],
    attributs: { montant: 1250, date: '2026-09-28', sens: 'achat' },
  })
  return { registre, f }
}

test('le numéro physique devient l’identifiant système quand il est libre', () => {
  const { registre, f } = factureF47()
  assert.equal(f.id, 'FAC-2026-0047')
  const autre = registre.integrer({
    genre: 'document',
    sousType: 'facture-rachat',
    titre: 'Autre facture 47',
    references: [{ cle: 'numero-facture', valeur: '47', emetteur: 'Autre client' }],
  })
  assert.equal(autre.id, 'FAC-2026-0001')
  assert.equal(proposerIdentifiant(['LIV-2026-0001', 'LIV-2026-0002'], 'LIV', 2026), 'LIV-2026-0003')
})

test('photo, OCR et original restent des manifestations distinctes', () => {
  const { registre, f } = factureF47()
  registre.ajouterManifestation(f.id, { type: 'physique-original', donnees: { montant: '1 250,00 €' } })
  registre.ajouterManifestation(f.id, { type: 'photo', fichier: 'f47.jpg', empreinteFichier: 'abc' })
  registre.ajouterManifestation(f.id, { type: 'ocr', donnees: { montant: '1250' } })
  assert.deepEqual(
    f.manifestations.map(m => [m.type, m.confiance]),
    [['physique-original', 1], ['photo', 0.8], ['ocr', 0.6]],
  )
  assert.equal(detecterAnomalies(registre).filter(a => a.code === 'incoherence-valeur').length, 0)
})

test('incohérence physique / numérique : 1 250 € contre 1 520 €', () => {
  const { registre, f } = factureF47()
  registre.ajouterManifestation(f.id, { type: 'physique-original', donnees: { montant: '1 250 €' } })
  registre.ajouterManifestation(f.id, { type: 'donnees-structurees', donnees: { montant: 1520 } })
  const [a] = detecterAnomalies(registre).filter(x => x.code === 'incoherence-valeur')
  assert.ok(a)
  assert.match(a.message, /1250 .*1520/)
  assert.match(a.message, /vérification nécessaire/)
  assert.match(a.suggestion, /physique-original/)
})

test('facture payée sans paiement relié, paiement sans justificatif bancaire', () => {
  const { registre, f } = factureF47()
  registre.changerEtat(f.id, 'verifie', { par: 'Olivier' })
  registre.changerEtat(f.id, 'paye')
  let codes = detecterAnomalies(registre).map(a => a.code)
  assert.ok(codes.includes('relation-manquante'))
  assert.ok(codes.includes('preuve-manquante')) // validation humaine

  const p = registre.integrer({ genre: 'paiement', titre: 'Virement F-47', attributs: { montant: 1250 } })
  registre.relier(f.id, p.id, 'paye-par')
  registre.ajouterPreuve(f.id, { type: 'validation-humaine', par: 'Olivier' })
  const restantes = detecterAnomalies(registre).filter(a => a.code === 'relation-manquante' || a.code === 'preuve-manquante')
  assert.deepEqual(restantes.map(a => a.realiteIds[0]), [p.id])
  assert.match(restantes[0].message, /transaction-bancaire/)

  registre.ajouterPreuve(p.id, { type: 'transaction-bancaire', description: 'Relevé du 30/09' })
  codes = detecterAnomalies(registre).map(a => a.code)
  assert.ok(!codes.includes('relation-manquante') && !codes.includes('preuve-manquante'))
})

test('doublons : deux documents physiques F-47, même référence sur deux réalités', () => {
  const { registre, f } = factureF47()
  registre.ajouterManifestation(f.id, { type: 'physique-original' })
  registre.ajouterManifestation(f.id, { type: 'physique-original' })
  registre.integrer({
    genre: 'document',
    sousType: 'facture-rachat',
    titre: 'Saisie en double',
    references: [{ cle: 'numero-facture', valeur: 'f-47', emetteur: 'client dupont' }],
  })
  const d = detecterAnomalies(registre).filter(a => a.code === 'doublon-potentiel')
  assert.equal(d.length, 2)
})

test('rupture de traçabilité et réalité non intégrée', () => {
  const { registre, f } = factureF47()
  registre.ajouterManifestation(f.id, { type: 'donnees-structurees', donnees: { montant: 1250 } })
  assert.ok(detecterAnomalies(registre).some(a => a.code === 'rupture-tracabilite' && /aucun document physique/.test(a.message)))

  const livre = registre.integrer({ genre: 'livre', titre: 'Livre retrouvé' })
  registre.ajouterManifestation(livre.id, { type: 'physique-original' })
  const codes = detecterAnomalies(registre).filter(a => a.realiteIds.includes(livre.id)).map(a => a.code)
  assert.ok(codes.includes('realite-non-integree'))
  assert.ok(codes.includes('rupture-tracabilite')) // original sans emplacement

  registre.placer(livre.id, { dossier: ['Bibliothèque'], rangement: ['Étagère 1'] })
  registre.signalerIntrouvable(livre.id)
  assert.ok(detecterAnomalies(registre).some(a => a.code === 'rupture-tracabilite' && a.gravite === 'critique'))
})

test('transitions : refusée sans forcer, signalée si forcée', () => {
  const { registre, f } = factureF47()
  assert.throws(() => registre.changerEtat(f.id, 'paye'), /Transition inhabituelle recu → paye/)
  registre.changerEtat(f.id, 'paye', { forcer: true, par: 'Olivier' })
  assert.ok(detecterAnomalies(registre).some(a => a.code === 'transition-forcee'))
})

test('le journal est chaîné et détecte une altération', () => {
  const { registre, f } = factureF47()
  registre.ajouterManifestation(f.id, { type: 'photo' })
  const etat = registre.exporter()
  assert.equal(verifierJournal(etat.journal), null)
  etat.journal[0].details.titre = 'falsifié'
  assert.equal(verifierJournal(etat.journal), 1)
  assert.ok(detecterAnomalies(new Registre(etat)).some(a => a.code === 'journal-altere'))
})

test('emplacement : Fournisseurs → 2026 → Achats, pochettes remplies dans l’ordre', () => {
  const registre = new Registre(undefined, horloge)
  for (let i = 1; i <= 12; i++) {
    const r = registre.integrer({ genre: 'document', sousType: 'facture-rachat', titre: `F-${i}`, references: [{ cle: 'n', valeur: String(i) }] })
    const e = proposerEmplacement(registre.realites, r)
    registre.placer(r.id, e)
  }
  const derniere = registre.obtenir('FAC-2026-0012').emplacement!
  assert.deepEqual(derniere.dossier, ['Fournisseurs', '2026', 'Achats'])
  assert.deepEqual(derniere.rangement, ['Classeur 01', 'Section A', 'Pochette 02'])

  const bible = registre.integrer({ genre: 'bible', titre: 'Bible Segond 21' })
  assert.deepEqual(proposerEmplacement(registre.realites, bible).rangement, ['Classeur 01', 'Section B', 'Pochette 01'])
})

test('marquage : QR + numéro lisible pour une facture, pas d’encre dans une Bible ancienne', () => {
  const { f } = factureF47()
  const reco = proposerMarquages(f, { imprimante: true, telephone: true, volume: 600 })
  assert.equal(reco.principal.methode, 'etiquette-qr')
  assert.equal(idDepuisQr(reco.principal.contenu), 'FAC-2026-0047')
  assert.ok(reco.complements.some(c => c.methode === 'numero-manuscrit' && c.contenu === 'FAC-2026-0047'))

  const registre = new Registre(undefined, horloge)
  const bible = registre.integrer({ genre: 'bible', titre: 'Bible de famille 1910' })
  const r2 = proposerMarquages(bible, { patrimonial: true, imprimante: false })
  assert.equal(r2.principal.methode, 'numero-manuscrit')
  assert.ok(r2.principal.raisons.some(x => /marque-page/.test(x)))
})

test('comparaison des architectures de classement', () => {
  const evals = comparerStrategies({ nombre: 600, recherchesParSemaine: 10, domaines: 5, projets: 3, dureeConservationAns: 10 })
  assert.equal(evals.length, 4)
  assert.equal(evals[0].strategie, 'hybride')
  const sansNumerique = comparerStrategies({ nombre: 600, recherchesParSemaine: 10, domaines: 5, projets: 3, synchronisationNumerique: false })
  assert.ok(sansNumerique.find(e => e.strategie === 'hybride')!.tempsRechercheSecondes > 20)
})

test('lacunes : ce qui manque, ce qui est automatisable, ce qui reste humain', () => {
  const { registre, f } = factureF47()
  registre.ajouterManifestation(f.id, { type: 'physique-original' })
  registre.ajouterManifestation(f.id, { type: 'photo' })
  const l = analyserLacunes(registre, f, detecterAnomalies(registre))
  assert.ok(l.manque.some(x => /donnée structurée/.test(x)))
  assert.ok(l.automatisable.some(x => /OCR/.test(x)))
  assert.ok(l.automatisable.some(x => /QR de FAC-2026-0047/.test(x)))
  assert.ok(l.nonRelie.length > 0)
  assert.ok(l.resteHumain.length > 0)
})

test('passages bibliques via l’analyseur de Bible Strong', () => {
  assert.deepEqual(extrairePassages('Lu ce matin Jean 3:16 et Rom 8.28-30'), ['John.3.16', 'Rom.8.28-Rom.8.30'])
  const registre = new Registre(undefined, horloge)
  const bible = registre.integrer({ genre: 'bible', titre: 'Bible d’étude' })
  registre.lierPassages(bible.id, extrairePassages('Ps 23'))
  assert.deepEqual(registre.obtenir(bible.id).passages, ['Ps.23'])
})

test('normalisation des montants', () => {
  assert.equal(normaliserValeur('1 250,00 €'), 1250)
  assert.equal(normaliserValeur('1 520 €'), 1520)
  assert.equal(normaliserValeur(' Payé '), 'payé')
})

test('corriger une manifestation résout l’incohérence et garde la trace', () => {
  const { registre, f } = factureF47()
  registre.ajouterManifestation(f.id, { type: 'physique-original', donnees: { montant: '1 250 €' } })
  const m = registre.ajouterManifestation(f.id, { type: 'donnees-structurees', donnees: { montant: 1520 } })
  registre.corrigerManifestation(m.id, { montant: 1250 }, { par: 'Olivier' })
  assert.ok(!detecterAnomalies(registre).some(a => a.code === 'incoherence-valeur'))
  const correction = registre.journal.find(e => e.type === 'correction')!
  assert.deepEqual(correction.details.avant, { montant: 1520 })
})

test('sha256 pur identique à node:crypto', async () => {
  const { createHash } = await import('node:crypto')
  const { sha256 } = await import('../src/sha256.ts')
  for (const t of ['', 'abc', 'FAC-2026-0047', 'é'.repeat(200), 'x'.repeat(55), 'x'.repeat(64)]) {
    assert.equal(sha256(t), createHash('sha256').update(t).digest('hex'))
  }
})

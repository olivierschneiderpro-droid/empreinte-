import { useAtom } from 'jotai/react'
import { useCallback, useMemo } from 'react'
import {
  Registre,
  analyserLacunes,
  detecterAnomalies,
  type Anomalie,
  type EtatRegistre,
} from '@empreinte/core'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'

/**
 * Registre d'exemple : la facture F-47 et les réalités qui l'entourent.
 * Les écarts sont volontaires (montant OCR ≠ montant de l'original, pas de paiement relié)
 * pour que la vérification ait quelque chose à montrer dès la première ouverture.
 */
export function registreExemple(): EtatRegistre {
  const r = new Registre()

  const f = r.integrer({
    genre: 'document',
    sousType: 'facture-rachat',
    titre: 'Facture de rachat F-47',
    references: [{ cle: 'numero-facture', valeur: 'F-47', emetteur: 'Client Dupont' }],
    attributs: { montant: 1250, date: '2026-09-28', sens: 'achat' },
  })
  r.ajouterManifestation(f.id, {
    type: 'physique-original',
    description: 'Feuille A4 signée, tampon du client',
    donnees: { montant: '1 250,00 €', date: '2026-09-28' },
  })
  r.ajouterManifestation(f.id, {
    type: 'photo',
    description: 'Photo prise au téléphone',
    fichier: 'F-47.jpg',
    empreinteFichier: '9f2c41a0',
  })
  r.ajouterManifestation(f.id, {
    type: 'ocr',
    description: 'Texte lu sur la photo',
    donnees: { montant: '1 520,00 €', date: '2026-09-28' },
    source: 'tesseract.js',
  })
  r.ajouterManifestation(f.id, {
    type: 'donnees-structurees',
    description: 'Saisie comptable',
    donnees: { montant: 1250, tva: 0 },
  })
  r.placer(f.id, {
    dossier: ['Fournisseurs', '2026', 'Achats'],
    rangement: ['Classeur 02', 'Section B', 'Pochette 14'],
    detenteur: 'Bureau',
  })
  r.ajouterPreuve(f.id, { type: 'photo-originale', manifestationId: `${f.id}/M2` })
  r.marquer(f.id, 'numero-manuscrit', f.id)

  const projet = r.integrer({ genre: 'projet', titre: 'Rachat de matériel 2026' })
  r.relier(f.id, projet.id, 'concerne-projet')

  const livre = r.integrer({
    genre: 'livre',
    titre: 'Concordance de Strong',
    references: [{ cle: 'isbn', valeur: '978-2-8287-0001-4' }],
  })
  r.ajouterManifestation(livre.id, {
    type: 'physique-original',
    description: 'Relié, couverture bleue',
  })
  r.placer(livre.id, { dossier: ['Bibliothèque', 'Étude'], rangement: ['Étagère 3', 'Rang 2'] })
  r.marquer(livre.id, 'etiquette-qr', livre.id)

  const bible = r.integrer({ genre: 'bible', titre: 'Bible de famille 1910' })
  r.ajouterManifestation(bible.id, {
    type: 'physique-original',
    description: 'Cuir, annotations manuscrites',
  })
  r.placer(bible.id, { dossier: ['Bibliothèque', 'Patrimoine'], rangement: ['Vitrine', 'Haut'] })
  r.lierPassages(bible.id, ['John.3.16', 'Ps.23'])

  const mission = r.integrer({
    genre: 'mission',
    titre: 'Mission 1000 Bibles',
    attributs: { objectif: 1000, distribuees: 312 },
  })
  r.changerEtat(mission.id, 'en-cours')
  const stock = r.integrer({
    genre: 'stock',
    titre: 'Carton de Bibles — lot 3',
    attributs: { quantite: 48 },
  })
  r.relier(stock.id, mission.id, 'concerne-mission')

  const equipement = r.integrer({ genre: 'equipement', titre: 'Vidéoprojecteur salle 2' })
  r.ajouterManifestation(equipement.id, { type: 'physique-original' })
  r.signalerIntrouvable(equipement.id, 'Pas retrouvé lors du dernier inventaire')

  return r.exporter()
}

export const etatEmpreinteAtom = atomWithAsyncStorage<EtatRegistre | null>(
  'empreinteRegistre',
  null
)

export interface Empreinte {
  registre: Registre
  anomalies: Anomalie[]
  /** Applique une opération au registre et enregistre le nouvel état. */
  modifier: (operation: (registre: Registre) => void) => void
  reinitialiser: () => void
}

export function useEmpreinte(): Empreinte {
  const [etat, setEtat] = useAtom(etatEmpreinteAtom)
  const etatCourant = useMemo(() => etat ?? registreExemple(), [etat])
  const registre = useMemo(
    () => new Registre(JSON.parse(JSON.stringify(etatCourant)) as EtatRegistre),
    [etatCourant]
  )
  const anomalies = useMemo(() => detecterAnomalies(registre), [registre])

  const modifier = useCallback(
    (operation: (registre: Registre) => void) => {
      const copie = new Registre(JSON.parse(JSON.stringify(etatCourant)) as EtatRegistre)
      operation(copie)
      setEtat(copie.exporter())
    },
    [etatCourant, setEtat]
  )
  const reinitialiser = useCallback(() => setEtat(registreExemple()), [setEtat])

  return { registre, anomalies, modifier, reinitialiser }
}

export function useLacunes(id: string) {
  const { registre, anomalies } = useEmpreinte()
  const realite = registre.chercher(id)
  return realite ? analyserLacunes(registre, realite, anomalies) : undefined
}

export const LIBELLES_GENRE: Record<string, string> = {
  document: 'Document',
  objet: 'Objet',
  livre: 'Livre',
  bible: 'Bible',
  equipement: 'Équipement',
  mission: 'Mission',
  projet: 'Projet',
  paiement: 'Paiement',
  personne: 'Personne',
  stock: 'Stock',
}

export const LIBELLES_MANIFESTATION: Record<string, string> = {
  'physique-original': 'Original',
  'physique-copie': 'Copie papier',
  photo: 'Photo',
  scan: 'Scan',
  ocr: 'OCR',
  'donnees-structurees': 'Données',
  'fichier-numerique': 'Fichier',
  impression: 'Impression',
}

export const LIBELLES_LACUNES: { cle: string; question: string }[] = [
  { cle: 'manque', question: 'Qu’est-ce qui manque ?' },
  { cle: 'enDouble', question: 'Qu’est-ce qui existe en double ?' },
  { cle: 'nonRelie', question: 'Qu’est-ce qui n’est pas relié ?' },
  { cle: 'malIdentifie', question: 'Qu’est-ce qui est mal identifié ?' },
  { cle: 'risquePerte', question: 'Qu’est-ce qui risque d’être perdu ?' },
  { cle: 'automatisable', question: 'Qu’est-ce qui peut être automatisé ?' },
  { cle: 'resteHumain', question: 'Qu’est-ce qui doit rester humain ?' },
  { cle: 'resteePhysique', question: 'Qu’est-ce qui doit rester physique ?' },
  { cle: 'numerique', question: 'Qu’est-ce qui doit devenir numérique ?' },
]

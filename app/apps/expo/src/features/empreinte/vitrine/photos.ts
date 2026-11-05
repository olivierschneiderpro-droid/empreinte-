import type { NomScene } from './Scene'

/**
 * Empreinte · Les photos des vitrines, choisies sur Unsplash (licence Unsplash, libre
 * d'usage) : des paysages, des objets et des animaux, jamais de personne ni de
 * représentation religieuse. Chaque photo garde le nom de son auteur pour les crédits.
 *
 * Fichier généré depuis la sélection ; pour changer une photo, remplacer sa ligne.
 */
export type Photo = { photo: string; auteur: string; pseudo: string }

/** L'adresse de la photo, recadrée à la taille demandée par le CDN d'Unsplash. */
export const adressePhoto = (photo: Photo, largeur: number, hauteur: number) =>
  `https://images.unsplash.com/${photo.photo}?ixlib=rb-4.1.0&auto=format&fit=crop&q=75&w=${Math.round(
    largeur * 2
  )}&h=${Math.round(hauteur * 2)}`

/** La page de l'auteur sur Unsplash (lien de crédit demandé par Unsplash). */
export const pageAuteur = (photo: Photo) =>
  `https://unsplash.com/@${photo.pseudo}?utm_source=empreinte&utm_medium=referral`

export const PAGE_UNSPLASH = 'https://unsplash.com/?utm_source=empreinte&utm_medium=referral'

/** Une photo par livre de la Bible (1 = Genèse … 66 = Apocalypse). */
export const PHOTOS_BIBLE: Record<number, Photo> = {
  1: { photo: 'photo-1566894195953-915f513e0868', auteur: 'marco forno', pseudo: 'marco4no' }, // arc-en-ciel sur un champ
  2: { photo: 'photo-1636885344961-b31b0c615e13', auteur: 'Ivan Rohovchenko', pseudo: 'ivrn' }, // mer en Égypte
  3: { photo: 'photo-1561212856-44e9bae482aa', auteur: 'David Tomaseti', pseudo: 'dtomaseti' }, // flamme de bougie
  4: { photo: 'photo-1621795307430-3ff25aa08945', auteur: 'Ze Paulo', pseudo: 'zepaulotravel' }, // dunes
  5: { photo: 'photo-1663179857170-047f450483d9', auteur: 'Ahmad Ajmi', pseudo: 'ahmadajmi' }, // grande montagne rocheuse
  6: { photo: 'photo-1598417642835-f05aa7bd7702', auteur: 'yeswanth M', pseudo: 'yeswanthm' }, // ruines en Jordanie
  7: { photo: 'photo-1679978677453-9452668cb867', auteur: 'Zetong Li', pseudo: 'zetong' }, // dunes
  8: { photo: 'photo-1593455071238-92dd081a39b1', auteur: 'Sarah Mason', pseudo: 'sarahthemason' }, // champ doré
  9: { photo: 'photo-1605455021703-13b57dcb9efa', auteur: 'Ritabrata Das', pseudo: 'ritabrata123' }, // flamme sur table de bois
  10: { photo: 'photo-1722228097356-bd0202d99367', auteur: 'Devon MacKay', pseudo: 'devon_mac' }, // oliveraie et moutons
  11: { photo: 'photo-1768133571447-8a332c020825', auteur: 'George', pseudo: 'geox3' }, // murs de pierre et arbres
  12: { photo: 'photo-1514519273132-6a1abd48302c', auteur: 'Diego PH', pseudo: 'jdiegoph' }, // rayons dans les nuages
  13: { photo: 'photo-1768765985289-0e53ecd9e765', auteur: 'George', pseudo: 'geox3' }, // mur de pierre antique et ville
  14: { photo: 'photo-1717518215150-dbee9416a940', auteur: 'Alexis Presa', pseudo: 'alexispresa' }, // ruines romaines et végétation
  15: { photo: 'photo-1580501170888-80668882ca0c', auteur: 'Taylor Flowe', pseudo: 'taypaigey' }, // rouleau de la Torah déployé
  16: { photo: 'photo-1768765985554-d94de1af1aa7', auteur: 'George', pseudo: 'geox3' }, // ville sur une colline
  17: { photo: 'photo-1654330352875-1f86a5b011cf', auteur: 'Yuheng Mei', pseudo: 'march4mei' }, // nuit étoilée sur le désert
  18: { photo: 'photo-1470115209269-18dd2d7285cd', auteur: 'JOHN TOWNER', pseudo: 'heytowner' }, // mer agitée
  19: { photo: 'photo-1569624518693-cf47b6553e8c', auteur: 'Hasan Almasi', pseudo: 'hasanalmasi' }, // troupeau dans les collines
  20: { photo: 'photo-1592205644721-2fe5214762ae', auteur: 'Hongru Wang', pseudo: 'whongru' }, // chemin dans les prés
  21: {
    photo: 'photo-1611522135886-a632d94ff6ae',
    auteur: 'Dylan Jenkinson',
    pseudo: 'dylan_j_604',
  }, // crête de dune
  22: { photo: 'photo-1537640538966-79f369143f8f', auteur: 'David Köhler', pseudo: 'davidkhlr' }, // raisins noirs sur la vigne
  23: { photo: 'photo-1419833173245-f59e1b93f9ee', auteur: 'Sam Schooler', pseudo: 'sam' }, // ciel nuageux lumineux
  24: {
    photo: 'photo-1774638460781-12a27374ccec',
    auteur: 'Nikolett Emmert',
    pseudo: 'niki_emmert',
  }, // fleurs d'amandier
  25: { photo: 'photo-1500120393694-26bf69c14a46', auteur: 'Joshua Rodriguez', pseudo: 'jcrod' }, // colonnes antiques
  26: {
    photo: 'photo-1508083535939-45a5fa9f0226',
    auteur: 'Carlo Trolese',
    pseudo: 'carlotrolese',
  }, // cascades en forêt
  27: { photo: 'photo-1546182990-dffeafbe841d', auteur: 'Francesco', pseudo: 'detpho' }, // lion qui marche
  28: { photo: 'photo-1472352327492-9765783b74e1', auteur: 'Thomas Schaefer', pseudo: 'tomonine' }, // raisins blancs à la vendange
  29: {
    photo: 'photo-1719338950449-994b80b7a1c4',
    auteur: 'Andrii Motygullin',
    pseudo: 'andrii_motygullin',
  }, // blé sous ciel nuageux
  30: { photo: 'photo-1774776841499-e025b385b653', auteur: 'Chelaxy Designs', pseudo: 'chelaxydp' }, // brebis sur une colline
  31: {
    photo: 'photo-1639517937235-9b4963550882',
    auteur: 'Youhana Nassif',
    pseudo: 'youhananassif',
  }, // vallée du Sinaï à l'aube
  32: {
    photo: 'photo-1524679166686-04237b4667b4',
    auteur: 'Torsten Dederichs',
    pseudo: 'tdederichs',
  }, // vagues sous ciel d'orage
  33: {
    photo: 'photo-1784484920241-9c2844d1a118',
    auteur: 'Gabriel McCallin',
    pseudo: 'gabrielmccallin',
  }, // chemin entre les collines
  34: { photo: 'photo-1514747975201-4715db583da9', auteur: 'Jakob Owens', pseudo: 'jakobowens1' }, // éclair sur la mer
  35: { photo: 'photo-1759049219585-4feb729fb018', auteur: 'Sies Kranen', pseudo: 'sinusfiction' }, // sommets dans la lumière dorée
  36: {
    photo: 'photo-1567712631541-12e7def8aa20',
    auteur: 'David Billings',
    pseudo: 'dav_billings',
  }, // montagne la nuit
  37: {
    photo: 'photo-1668212145518-b9a2a614bbd9',
    auteur: 'Casey Lovegrove',
    pseudo: 'clovegrove7',
  }, // temple à colonnes
  38: { photo: 'photo-1642687791249-86d868e17746', auteur: 'Kostas Morfiris', pseudo: 'kmorfiris' }, // colline d'arbres
  39: { photo: 'photo-1495756111155-45cb19b8aeee', auteur: 'Daniel Páscoa', pseudo: 'dpascoa' }, // lumière à travers les nuages
  40: { photo: 'photo-1580838368578-2eb2f83a2672', auteur: 'Tomasz Smal', pseudo: 'apphex' }, // sommets à l'aube
  41: { photo: 'photo-1613412984420-1300edb8219f', auteur: 'Sylvain Brison', pseudo: 'sbrison' }, // lac et collines
  42: { photo: 'photo-1692961888969-373530a74860', auteur: 'Jean Vella', pseudo: 'jean_vella' }, // brebis au-dessus d'un lac
  43: { photo: 'photo-1528351655744-27cc30462816', auteur: 'Paolo Nicolello', pseudo: 'paul_nic' }, // petite flamme dans la nuit
  44: { photo: 'photo-1672421186707-fd1339a0d9a7', auteur: 'Ahmad Ajmi', pseudo: 'ahmadajmi' }, // plage et eau
  45: { photo: 'photo-1478641300939-0ec5188d3802', auteur: 'Clark Young', pseudo: 'cbyoung' }, // encrier sur un bureau
  46: { photo: 'photo-1586765501508-cffc1fe200c8', auteur: 'Tommaso Urli', pseudo: 'tunnuz' }, // pain sur table de bois
  47: { photo: 'photo-1551127481-43279ba6dec4', auteur: 'Pierre Bamin', pseudo: 'bamin' }, // plume et papier
  48: { photo: 'photo-1785097565450-eab5283e3640', auteur: 'Remedy', pseudo: 'remeedy' }, // chemin au coucher du soleil
  49: { photo: 'photo-1777830801220-17fa8f94400e', auteur: 'Stock Birken', pseudo: 'stockbirken' }, // pierres et arches antiques
  50: {
    photo: 'photo-1779008108950-8a969500d8c2',
    auteur: 'Nikolett Emmert',
    pseudo: 'niki_emmert',
  }, // branche en fleurs
  51: { photo: 'photo-1695470393142-4c14422ffb9a', auteur: 'Thomas Hahnen', pseudo: 'thomas65' }, // olivier dans un champ
  52: { photo: 'photo-1760301269447-fbc82b5a8d14', auteur: 'Gantavya Bhatt', pseudo: 'gbhatt_2' }, // sommet au lever du soleil
  53: {
    photo: 'photo-1639517937400-632bece71c3a',
    auteur: 'Youhana Nassif',
    pseudo: 'youhananassif',
  }, // acacia au couchant, Sinaï
  54: { photo: 'photo-1722182877533-7378b60bf1e8', auteur: 'Peter Herrmann', pseudo: 'tama66' }, // bibliothèque ancienne
  55: {
    photo: 'photo-1595123550441-d377e017de6a',
    auteur: 'Prateek Katyal',
    pseudo: 'prateekkatyal',
  }, // livres anciens empilés
  56: { photo: 'photo-1728940823516-ff387be88638', auteur: 'Bastian Cimander', pseudo: 'buzztea' }, // rangée d'oliviers
  57: { photo: 'photo-1625053376622-e462848c453f', auteur: 'Peter Herrmann', pseudo: 'tama66' }, // rayonnages de livres
  58: { photo: 'photo-1580501170961-bb0dbf63a6df', auteur: 'Taylor Flowe', pseudo: 'taypaigey' }, // détail d'un rouleau
  59: { photo: 'photo-1662495711132-773db951a270', auteur: 'Paul Crook', pseudo: 'goldenplover31' }, // ruisseau sous la montagne
  60: {
    photo: 'photo-1465306417166-e11002b6eb25',
    auteur: 'Chris Gallimore',
    pseudo: 'chrisgallimore',
  }, // lac calme
  61: {
    photo: 'photo-1469041635451-4512b21a9326',
    auteur: 'james ballard',
    pseudo: 'jamesballard79',
  }, // lac au matin
  62: { photo: 'photo-1518528802892-ec2191995c99', auteur: 'Jarl Schmidt', pseudo: 'jarl_schmidt' }, // bougie allumée
  63: {
    photo: 'photo-1779008108960-473a360841f1',
    auteur: 'Nikolett Emmert',
    pseudo: 'niki_emmert',
  }, // amandier en fleurs
  64: { photo: 'photo-1578161836513-c4ae1706f01f', auteur: 'Boudhayan Bardhan', pseudo: 'yan_slg' }, // fleurs blanches
  65: { photo: 'photo-1524275804141-5e9f2bc5a71d', auteur: 'Ivana Cajina', pseudo: 'von_co' }, // orage
  66: { photo: 'photo-1521051506619-e586ac67fa41', auteur: 'Chris Barbalis', pseudo: 'cbarbalis' }, // arc-en-ciel sur la montagne
}

/** Les scènes nommées (portes d'entrée, rangées). */
export const PHOTOS_SCENES: Record<NomScene, Photo> = {
  aube: { photo: 'photo-1466175159277-f2bd141e94a3', auteur: 'Robert Bye', pseudo: 'robertbye' }, // rive du lac
  desert: {
    photo: 'photo-1555930254-f837962bc58f',
    auteur: 'Peggy Anke',
    pseudo: 'instagramfotografin',
  }, // chameau, nuages
  ville: { photo: 'photo-1768133571447-8a332c020825', auteur: 'George', pseudo: 'geox3' }, // murs de pierre et arbres
  nuit: { photo: 'photo-1654330352875-1f86a5b011cf', auteur: 'Yuheng Mei', pseudo: 'march4mei' }, // nuit étoilée sur le désert
  montagne: {
    photo: 'photo-1760301269447-fbc82b5a8d14',
    auteur: 'Gantavya Bhatt',
    pseudo: 'gbhatt_2',
  }, // sommet au lever du soleil
  riviere: {
    photo: 'photo-1706810693459-25f649381663',
    auteur: 'Fouad Abou-Rizk',
    pseudo: 'fouadabourizkfa',
  }, // ruisseau dans la verdure
  chemin: { photo: 'photo-1592205644721-2fe5214762ae', auteur: 'Hongru Wang', pseudo: 'whongru' }, // chemin dans les prés
  mer: { photo: 'photo-1672421186707-fd1339a0d9a7', auteur: 'Ahmad Ajmi', pseudo: 'ahmadajmi' }, // plage et eau
  rouleau: {
    photo: 'photo-1580501170888-80668882ca0c',
    auteur: 'Taylor Flowe',
    pseudo: 'taypaigey',
  }, // rouleau de la Torah déployé
  lampe: {
    photo: 'photo-1605455021703-13b57dcb9efa',
    auteur: 'Ritabrata Das',
    pseudo: 'ritabrata123',
  }, // flamme sur table de bois
  lumiere: { photo: 'photo-1514519273132-6a1abd48302c', auteur: 'Diego PH', pseudo: 'jdiegoph' }, // rayons dans les nuages
  ble: { photo: 'photo-1595444042058-f038c7e0e778', auteur: 'Nick Fewings', pseudo: 'jannerboy62' }, // blé mûr
  jardin: {
    photo: 'photo-1515778767554-42d4b373f2b3',
    auteur: 'Nacho Domínguez Argenta',
    pseudo: 'nachoargenta',
  }, // grappes
}

/** Les livres chrétiens de la bibliothèque. */
export const PHOTOS_LIVRES: Record<string, Photo> = {
  'pensees-pascal': {
    photo: 'photo-1580051859262-017717989ae8',
    auteur: 'Gopal Krishna',
    pseudo: 'x_7',
  }, // désert au couchant
  'imitation-fr': {
    photo: 'photo-1528351655744-27cc30462816',
    auteur: 'Paolo Nicolello',
    pseudo: 'paul_nic',
  }, // petite flamme dans la nuit
  'imitation-en': {
    photo: 'photo-1518528802892-ec2191995c99',
    auteur: 'Jarl Schmidt',
    pseudo: 'jarl_schmidt',
  }, // bougie allumée
  'vie-devote': {
    photo: 'photo-1657626625832-2c0851cdaa9b',
    auteur: 'Benoît Deschasaux',
    pseudo: 'benowa',
  }, // blé au couchant
  'confessions-fr': {
    photo: 'photo-1768765985289-0e53ecd9e765',
    auteur: 'George',
    pseudo: 'geox3',
  }, // mur de pierre antique et ville
  'confessions-en': {
    photo: 'photo-1768765985554-d94de1af1aa7',
    auteur: 'George',
    pseudo: 'geox3',
  }, // ville sur une colline
  'pilgrims-progress': {
    photo: 'photo-1785097565450-eab5283e3640',
    auteur: 'Remedy',
    pseudo: 'remeedy',
  }, // chemin au coucher du soleil
  'presence-of-god': { photo: 'photo-1547978059-2639fd612c66', auteur: 'DDP', pseudo: 'moino007' }, // pain cuit
  'all-of-grace': {
    photo: 'photo-1662495711132-773db951a270',
    auteur: 'Paul Crook',
    pseudo: 'goldenplover31',
  }, // ruisseau sous la montagne
  'abide-in-christ': {
    photo: 'photo-1515778767554-42d4b373f2b3',
    auteur: 'Nacho Domínguez Argenta',
    pseudo: 'nachoargenta',
  }, // grappes
  orthodoxy: {
    photo: 'photo-1575550959106-5a7defe28b56',
    auteur: 'Zdeněk Macháček',
    pseudo: 'zmachacek',
  }, // lion dans l'herbe
}

export const photoDuLivre = (numero: number): Photo | undefined => PHOTOS_BIBLE[numero]
export const photoDuLivreChretien = (id: string): Photo | undefined => PHOTOS_LIVRES[id]

/** Tous les auteurs, une fois chacun, pour la page des crédits. */
export const auteursDesPhotos = (): Photo[] => {
  const vus = new Map<string, Photo>()
  for (const photo of [
    ...Object.values(PHOTOS_BIBLE),
    ...Object.values(PHOTOS_SCENES),
    ...Object.values(PHOTOS_LIVRES),
  ])
    if (!vus.has(photo.pseudo)) vus.set(photo.pseudo, photo)
  return [...vus.values()].sort((a, b) => a.auteur.localeCompare(b.auteur))
}

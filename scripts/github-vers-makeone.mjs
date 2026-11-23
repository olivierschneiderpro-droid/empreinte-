#!/usr/bin/env node
// Importe TOUS les dépôts GitHub (publics et privés, perso et organisations) dans MakeOne.
//
//   GITHUB_TOKEN=… MAKEONE_TOKEN=… node github-vers-makeone.mjs --essai     (montre ce qui sera fait)
//   GITHUB_TOKEN=… MAKEONE_TOKEN=… node github-vers-makeone.mjs             (import complet)
//   GITHUB_TOKEN=… MAKEONE_TOKEN=… node github-vers-makeone.mjs --miroir    (miroir synchronisé)
//
// Les deux jetons peuvent aussi être rangés dans un fichier (une ligne NOM=valeur chacun),
// lisible par vous seul : --cles ~/.makeone-cles. Ne les mettez jamais dans un dépôt.
//
// Import complet : code, branches, étiquettes, wiki, tickets, pull requests, libellés, jalons,
// versions (releases) et fichiers LFS. Copie unique : à faire au moment de quitter GitHub.
// Miroir : code, wiki, versions et LFS, resynchronisés depuis GitHub toutes les 8 h
// (MakeOne ne copie pas les tickets en mode miroir). Pratique tant que GitHub sert encore.
//
// Options : --makeone https://makeone.space  --proprietaire NOM (tout ranger sous un seul
// compte au lieu de recréer les organisations)  --seulement depot1,depot2  --public (garder
// publics les dépôts publics ; par défaut tout devient privé).
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const option = nom => {
  const i = args.indexOf(nom)
  return i >= 0 ? args[i + 1] : undefined
}
const drapeau = nom => args.includes(nom)

const cles = {}
const fichierCles = option('--cles')
if (fichierCles) {
  for (const ligne of readFileSync(fichierCles.replace(/^~/, process.env.HOME), 'utf8').split('\n')) {
    const m = ligne.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)
    if (m) cles[m[1]] = m[2]
  }
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || cles.GITHUB_TOKEN
const MAKEONE_TOKEN = process.env.MAKEONE_TOKEN || cles.MAKEONE_TOKEN
const MAKEONE = (option('--makeone') || process.env.MAKEONE_URL || 'https://makeone.space').replace(/\/$/, '')
const ESSAI = drapeau('--essai')
const MIROIR = drapeau('--miroir')
const GARDER_PUBLIC = drapeau('--public')
const PROPRIETAIRE = option('--proprietaire')
const SEULEMENT = option('--seulement')?.split(',').map(s => s.trim().toLowerCase())

if (!GITHUB_TOKEN || !MAKEONE_TOKEN) {
  console.error('Il manque GITHUB_TOKEN ou MAKEONE_TOKEN (variables ou fichier --cles).')
  process.exit(1)
}

const appel = async (url, { jeton, methode = 'GET', corps } = {}) => {
  const reponse = await fetch(url, {
    method: methode,
    headers: {
      Authorization: `token ${jeton}`,
      Accept: 'application/json',
      ...(corps ? { 'Content-Type': 'application/json' } : {}),
    },
    body: corps ? JSON.stringify(corps) : undefined,
  })
  const texte = await reponse.text()
  let donnees
  try {
    donnees = texte ? JSON.parse(texte) : null
  } catch {
    donnees = texte
  }
  return { statut: reponse.status, donnees }
}
const github = chemin => appel(`https://api.github.com${chemin}`, { jeton: GITHUB_TOKEN })
const makeone = (chemin, options = {}) =>
  appel(`${MAKEONE}/api/v1${chemin}`, { jeton: MAKEONE_TOKEN, ...options })

// --- Qui suis-je, des deux côtés ---------------------------------------------------------
const moiGithub = await github('/user')
if (moiGithub.statut !== 200) {
  console.error(`✘ Jeton GitHub refusé (${moiGithub.statut}).`)
  process.exit(1)
}
const moiMakeone = await makeone('/user')
if (moiMakeone.statut !== 200) {
  console.error(`✘ Jeton MakeOne refusé (${moiMakeone.statut}) sur ${MAKEONE}.`)
  process.exit(1)
}
const loginGithub = moiGithub.donnees.login
const loginMakeone = moiMakeone.donnees.login
console.log(`GitHub : ${loginGithub}  →  MakeOne : ${loginMakeone} (${MAKEONE})`)
console.log(MIROIR ? 'Mode : miroir synchronisé' : 'Mode : import complet (tickets, PR, versions…)')
if (ESSAI) console.log('Essai : rien ne sera créé.\n')

// --- Tous les dépôts GitHub accessibles ----------------------------------------------------
const depots = []
for (let page = 1; ; page++) {
  const { statut, donnees } = await github(
    `/user/repos?per_page=100&page=${page}&affiliation=owner,organization_member&sort=full_name`
  )
  if (statut !== 200) {
    console.error(`✘ Liste des dépôts GitHub impossible (${statut}).`)
    process.exit(1)
  }
  depots.push(...donnees)
  if (donnees.length < 100) break
}
const choisis = depots.filter(d => !SEULEMENT || SEULEMENT.includes(d.name.toLowerCase()))
console.log(`${choisis.length} dépôt(s) à importer.\n`)

// --- Les organisations à recréer dans MakeOne ---------------------------------------------
const proprietaireDe = depot => {
  if (PROPRIETAIRE) return PROPRIETAIRE
  return depot.owner.login === loginGithub ? loginMakeone : depot.owner.login
}
const organisationsVues = new Set()
const preparerProprietaire = async nom => {
  if (nom === loginMakeone || organisationsVues.has(nom)) return true
  organisationsVues.add(nom)
  const existe = await makeone(`/orgs/${encodeURIComponent(nom)}`)
  if (existe.statut === 200) return true
  const utilisateur = await makeone(`/users/${encodeURIComponent(nom)}`)
  if (utilisateur.statut === 200) return true
  if (ESSAI) {
    console.log(`  + organisation ${nom} (à créer)`)
    return true
  }
  const cree = await makeone('/orgs', {
    methode: 'POST',
    corps: { username: nom, visibility: 'private' },
  })
  if (cree.statut === 201) {
    console.log(`  + organisation ${nom} créée`)
    return true
  }
  console.log(`  ✘ organisation ${nom} : ${cree.statut} ${JSON.stringify(cree.donnees)}`)
  return false
}

// --- Import, un dépôt à la fois -----------------------------------------------------------
const bilan = { importes: [], deja: [], echecs: [] }
for (const depot of choisis) {
  const proprietaire = proprietaireDe(depot)
  const cible = `${proprietaire}/${depot.name}`
  const prive = depot.private || !GARDER_PUBLIC
  if (!(await preparerProprietaire(proprietaire))) {
    bilan.echecs.push(`${cible} (propriétaire)`)
    continue
  }
  const deja = await makeone(`/repos/${encodeURIComponent(proprietaire)}/${encodeURIComponent(depot.name)}`)
  if (deja.statut === 200) {
    console.log(`  = ${cible} existe déjà`)
    bilan.deja.push(cible)
    continue
  }
  const etiquette = `${depot.full_name}${depot.private ? ' (privé)' : ''}${depot.archived ? ' (archivé)' : ''}`
  if (ESSAI) {
    console.log(`  → ${etiquette}  ⇒  ${cible}${prive ? ' (privé)' : ''}`)
    bilan.importes.push(cible)
    continue
  }
  process.stdout.write(`  → ${etiquette}  ⇒  ${cible} … `)
  const debut = Date.now()
  const { statut, donnees } = await makeone('/repos/migrate', {
    methode: 'POST',
    corps: {
      clone_addr: depot.clone_url,
      service: 'github',
      auth_token: GITHUB_TOKEN,
      repo_owner: proprietaire,
      repo_name: depot.name,
      description: depot.description ?? '',
      private: prive,
      mirror: MIROIR,
      ...(MIROIR ? { mirror_interval: '8h0m0s' } : {}),
      wiki: depot.has_wiki,
      lfs: true,
      releases: true,
      issues: !MIROIR,
      pull_requests: !MIROIR,
      labels: !MIROIR,
      milestones: !MIROIR,
    },
  })
  const duree = Math.round((Date.now() - debut) / 1000)
  if (statut === 201) {
    console.log(`✔ ${duree} s`)
    bilan.importes.push(cible)
  } else {
    const message = typeof donnees === 'object' ? donnees?.message : donnees
    console.log(`✘ ${statut} ${message ?? ''}`)
    bilan.echecs.push(`${cible} : ${statut} ${message ?? ''}`)
  }
}

console.log(`
Bilan : ${bilan.importes.length} ${ESSAI ? 'à importer' : 'importé(s)'}, ${bilan.deja.length} déjà présent(s), ${bilan.echecs.length} échec(s).`)
for (const echec of bilan.echecs) console.log(`  ✘ ${echec}`)
console.log(`
Ce que GitHub ne laisse pas copier, à refaire à la main dans MakeOne :
  - les valeurs des secrets Actions (GitHub ne les rend jamais lisibles) ;
  - les webhooks, clés de déploiement, GitHub Pages et paquets (ghcr.io).`)
process.exit(bilan.echecs.length ? 1 : 0)

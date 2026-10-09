#!/usr/bin/env node
// Sert Empreinte sans aucune dépendance :
//   /         le site de présentation (dossier presentation/ du dépôt, mis à jour par git pull) ;
//   /app/…    l'app web (export Expo) ; toute route inconnue renvoie son index.html,
//             pour que /app/home, /app/plans… s'ouvrent directement.
// Les demandes /v1/… sont relayées vers l'API publique de Bible Strong : le navigateur ne parle
// qu'à ce serveur, ce qui évite le blocage CORS (l'API n'accepte que les sites de Bible Strong).
//
//   node scripts/servir-empreinte.mjs <dossier-web> [port]
//   ex. : node scripts/servir-empreinte.mjs ~/empreinte-web 8080
import { createServer } from 'node:http'
import { createReadStream, createWriteStream, statSync, watchFile } from 'node:fs'
import { readFile, readdir, rename, unlink } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { constants, createBrotliCompress, createGzip } from 'node:zlib'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'
import { spawn, execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'

const racine = resolve(process.argv[2] ?? 'empreinte-web')
const site = resolve(
  process.env.EMPREINTE_SITE ?? join(dirname(fileURLToPath(import.meta.url)), '..', 'presentation')
)
const port = Number(process.argv[3] ?? process.env.PORT ?? 8080)
const API = process.env.EMPREINTE_API ?? 'https://api.bible-strong.app'
// YouVersion : la clé reste sur le serveur (variable YOUVERSION_KEY), jamais dans le navigateur.
const YOUVERSION = 'https://api.youversion.com'
const CLE_YOUVERSION = process.env.YOUVERSION_KEY ?? ''
// Annonce le relais à l'app (lu dans resourceAccess.web.tsx) et, quand la base de comptes
// tourne, l'adresse des comptes Empreinte (lue dans compteEmpreinte.ts).
const annonce = () =>
  `<script>window.__EMPREINTE_RELAIS__=location.origin${
    comptesPrets ? ";window.__EMPREINTE_COMPTES__=location.origin+'/comptes'" : ''
  }</script>`

// Comptes Empreinte : PocketBase, téléchargé, lancé et surveillé par ce serveur.
const POCKETBASE_VERSION = '0.22.55'
const DOSSIER_COMPTES = process.env.EMPREINTE_COMPTES ?? join(homedir(), 'empreinte-comptes')
const PORT_COMPTES = 8090
const COMPTES = `http://127.0.0.1:${PORT_COMPTES}`
const MIGRATIONS = join(dirname(fileURLToPath(import.meta.url)), '..', 'comptes', 'pb_migrations')
let comptesPrets = false
const installerPocketBase = async () => {
  const binaire = join(DOSSIER_COMPTES, 'pocketbase')
  if (existsSync(binaire)) return binaire
  mkdirSync(DOSSIER_COMPTES, { recursive: true })
  const arch = process.arch === 'arm64' ? 'arm64' : 'amd64'
  const url = `https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_${arch}.zip`
  const reponse = await fetch(url)
  if (!reponse.ok) throw new Error(`téléchargement de PocketBase impossible (${reponse.status})`)
  const zip = join(DOSSIER_COMPTES, 'pocketbase.zip')
  await pipeline(Readable.fromWeb(reponse.body), createWriteStream(zip))
  execFileSync('python3', ['-m', 'zipfile', '-e', zip, DOSSIER_COMPTES])
  execFileSync('chmod', ['+x', binaire])
  await unlink(zip).catch(() => {})
  return binaire
}
const lancerComptes = async () => {
  if (process.env.EMPREINTE_SANS_COMPTES) return
  try {
    const binaire = await installerPocketBase()
    const processus = spawn(
      binaire,
      ['serve', `--http=127.0.0.1:${PORT_COMPTES}`, `--dir=${join(DOSSIER_COMPTES, 'pb_data')}`, `--migrationsDir=${MIGRATIONS}`],
      { stdio: 'inherit' }
    )
    // Quand le serveur s'arrête (mise à jour), la base de comptes s'arrête avec lui.
    process.once('exit', () => processus.kill())
    for (const signal of ['SIGTERM', 'SIGINT'])
      process.once(signal, () => {
        processus.kill()
        process.exit(0)
      })
    processus.on('exit', code => {
      comptesPrets = false
      console.log(`Comptes Empreinte arrêtés (${code}) : relance dans 5 s.`)
      setTimeout(lancerComptes, 5000)
    })
  } catch (erreur) {
    console.log(`Comptes Empreinte indisponibles : ${erreur.message}. Nouvel essai dans 60 s.`)
    setTimeout(lancerComptes, 60000)
  }
}
setInterval(async () => {
  try {
    comptesPrets = (await fetch(`${COMPTES}/api/health`)).ok
  } catch {
    comptesPrets = false
  }
}, 5000)
// Écran d'attente, visible dès les premiers octets, remplacé par l'app quand elle démarre.
const ATTENTE = `<div id="empreinte-attente" style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#f4f4f2;font:600 15px system-ui,sans-serif;color:#111113;z-index:0">
<svg width="44" height="44" viewBox="0 0 32 32" fill="none" stroke="#111113" stroke-width="2" stroke-linecap="round" style="animation:empreinte-souffle 1.6s ease-in-out infinite alternate"><path d="M8 25c-2-2.6-3-5.6-3-9a11 11 0 0 1 22 0"/><path d="M12 27c-1.6-2.4-2.6-5.6-2.6-9.6a6.6 6.6 0 0 1 13.2 0c0 3-.5 5.6-1.6 8"/><path d="M16 28c-1-2.6-1.8-6.2-1.8-10.6a1.8 1.8 0 0 1 3.6 0c0 3.4-.2 6-.8 8.6"/></svg>
Empreinte<style>@keyframes empreinte-souffle{from{opacity:.35;transform:scale(.94)}to{opacity:1;transform:scale(1)}}@media (prefers-color-scheme:dark){#empreinte-attente{background:#111113!important;color:#f4f4f2!important}#empreinte-attente svg{stroke:#f4f4f2}}</style></div>`
const SANS = new Set(['host', 'origin', 'referer', 'connection', 'content-length', 'accept-encoding'])

const relayer = async (req, res, cible = API + req.url, entetes = {}) => {
  try {
    const headers = Object.fromEntries(
      Object.entries(req.headers).filter(([k]) => !SANS.has(k.toLowerCase()))
    )
    const corps = req.method === 'GET' || req.method === 'HEAD' ? undefined : Readable.toWeb(req)
    const reponse = await fetch(cible, {
      method: req.method,
      headers: { ...headers, ...entetes },
      body: corps,
      duplex: corps ? 'half' : undefined,
    })
    const sortie = {}
    reponse.headers.forEach((v, k) => {
      if (!/^(access-control-|content-encoding|content-length|transfer-encoding|connection)/i.test(k))
        sortie[k] = v
    })
    res.writeHead(reponse.status, sortie)
    if (reponse.body) Readable.fromWeb(reponse.body).pipe(res)
    else res.end()
  } catch (erreur) {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(`Relais vers ${new URL(cible).host} impossible : ${erreur.message}`)
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wasm': 'application/wasm',
}

const fichier = chemin => {
  try {
    return statSync(chemin).isFile() ? chemin : null
  } catch {
    return null
  }
}

// Compression : l'app web pèse plusieurs dizaines de Mo non compressée ; compressée (Brotli),
// elle descend à quelques Mo. Chaque fichier reçoit une fois pour toutes sa copie « .br »,
// préparée en arrière-plan ; en attendant, il part compressé à la volée (gzip).
const COMPRESSIBLES = new Set(['.html', '.js', '.css', '.json', '.txt', '.svg', '.ttf', '.otf', '.wasm', '.map'])
const enPreparation = new Set()
// Une copie « .br » plus ancienne que son fichier (mise à jour) n'est jamais servie.
const brotliAJour = chemin => {
  try {
    return statSync(`${chemin}.br`).mtimeMs >= statSync(chemin).mtimeMs
  } catch {
    return false
  }
}
const preparerBrotli = async chemin => {
  // Seulement dans l'export de l'app : le dossier du site appartient au dépôt git.
  if (!chemin.startsWith(racine) || enPreparation.has(chemin) || brotliAJour(chemin)) return
  enPreparation.add(chemin)
  const provisoire = `${chemin}.br.${process.pid}`
  try {
    await pipeline(
      createReadStream(chemin),
      createBrotliCompress({
        params: {
          [constants.BROTLI_PARAM_QUALITY]: 9,
          [constants.BROTLI_PARAM_SIZE_HINT]: statSync(chemin).size,
        },
      }),
      createWriteStream(provisoire)
    )
    await rename(provisoire, `${chemin}.br`)
  } catch {
    await unlink(provisoire).catch(() => {})
  } finally {
    enPreparation.delete(chemin)
  }
}
// Au démarrage, prépare tout l'export de l'app, un fichier après l'autre (sans bloquer le serveur).
const preparerDossier = async dossier => {
  for (const entree of await readdir(dossier, { withFileTypes: true }).catch(() => [])) {
    const chemin = join(dossier, entree.name)
    if (entree.isDirectory()) await preparerDossier(chemin)
    else if (COMPRESSIBLES.has(extname(chemin)) && statSync(chemin).size > 1024) await preparerBrotli(chemin)
  }
}

// Le site précharge l'app pendant la lecture : « Ouvrir l'app » démarre alors presque aussitôt.
let memoireScripts = { date: 0, scripts: [] }
const scriptsApp = async () => {
  try {
    const date = statSync(join(racine, 'index.html')).mtimeMs
    if (date !== memoireScripts.date) {
      const html = await readFile(join(racine, 'index.html'), 'utf8')
      memoireScripts = {
        date,
        scripts: [...html.matchAll(/<script src="(\/app\/_expo\/[^"]+\.js)"/g)].map(([, src]) => src),
      }
    }
  } catch {
    memoireScripts = { date: 0, scripts: [] }
  }
  return memoireScripts.scripts
}

const envoyer = (req, res, chemin, cache, statut = 200, transformer) => {
  const entetes = {
    'Content-Type': TYPES[extname(chemin)] ?? 'application/octet-stream',
    'Cache-Control': cache ? 'public, max-age=31536000, immutable' : 'no-cache',
    Vary: 'Accept-Encoding',
  }
  const accepte = String(req.headers['accept-encoding'] ?? '')
  const compressible = COMPRESSIBLES.has(extname(chemin))
  if (transformer) {
    // Page modifiée à la volée (index.html de l'app) : petite, compressée directement.
    return void readFile(chemin, 'utf8').then(
      texte => {
        const corps = Buffer.from(transformer(texte))
        if (/\bgzip\b/.test(accepte)) {
          res.writeHead(statut, { ...entetes, 'Content-Encoding': 'gzip' })
          const gz = createGzip()
          gz.pipe(res)
          gz.end(corps)
        } else res.writeHead(statut, entetes).end(corps)
      },
      () => res.writeHead(503, { 'Content-Type': TYPES['.txt'] }).end("L'app web n'est pas encore installée.")
    )
  }
  if (compressible && /\bbr\b/.test(accepte) && brotliAJour(chemin)) {
    res.writeHead(statut, { ...entetes, 'Content-Encoding': 'br' })
    return void createReadStream(`${chemin}.br`).pipe(res)
  }
  if (compressible && statSync(chemin).size > 1024) {
    void preparerBrotli(chemin)
    if (/\bgzip\b/.test(accepte)) {
      res.writeHead(statut, { ...entetes, 'Content-Encoding': 'gzip' })
      return void pipeline(createReadStream(chemin), createGzip({ level: 6 }), res).catch(() => {})
    }
  }
  res.writeHead(statut, entetes)
  createReadStream(chemin).pipe(res)
}

createServer((req, res) => {
  if ((req.url ?? '').startsWith('/v1/')) return void relayer(req, res)
  // /comptes/… → la base de comptes Empreinte. Sa console d'administration (/comptes/_/)
  // n'est ouverte que depuis le serveur lui-même.
  if ((req.url ?? '').startsWith('/comptes/')) {
    const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '')
    if ((req.url ?? '').startsWith('/comptes/_/') && !local) return void res.writeHead(403).end()
    return void relayer(req, res, COMPTES + req.url.slice('/comptes'.length))
  }
  // /youversion/v1/… → api.youversion.com/v1/… avec la clé de l'app.
  if ((req.url ?? '').startsWith('/youversion/')) {
    if (!CLE_YOUVERSION) return void res.writeHead(503).end('Clé YouVersion absente (YOUVERSION_KEY).')
    return void relayer(req, res, YOUVERSION + req.url.slice('/youversion'.length), {
      'X-YVP-App-Key': CLE_YOUVERSION,
    })
  }
  let url
  try {
    url = decodeURIComponent((req.url ?? '/').split('?')[0])
  } catch {
    res.writeHead(400).end()
    return
  }

  // L'app web, sous /app.
  if (url === '/app' || url.startsWith('/app/')) {
    const demande = normalize(join(racine, url.slice('/app'.length) || '/'))
    if (!demande.startsWith(racine)) return void res.writeHead(403).end()
    const trouve = fichier(demande) ?? fichier(join(demande, 'index.html'))
    if (trouve && !trouve.endsWith('index.html'))
      return void envoyer(req, res, trouve, url.startsWith('/app/_expo/') || url.startsWith('/app/assets/'))
    return void envoyer(req, res, trouve ?? join(racine, 'index.html'), false, 200, html =>
      html.replace('<head>', `<head>${annonce()}`).replace('<div id="root"></div>', `<div id="root">${ATTENTE}</div>`)
    )
  }

  // Le site de présentation.
  const demande = normalize(join(site, url))
  if (!demande.startsWith(site)) return void res.writeHead(403).end()
  const trouve = fichier(demande) ?? fichier(join(demande, 'index.html'))
  if (trouve?.endsWith('.html'))
    return void scriptsApp().then(scripts =>
      envoyer(req, res, trouve, false, 200, html =>
        html.replace(
          '</head>',
          `${scripts.map(src => `<link rel="prefetch" href="${src}" as="script">`).join('')}</head>`
        )
      )
    )
  if (trouve) return void envoyer(req, res, trouve, false)
  const introuvable = fichier(join(site, '404.html')) ?? fichier(join(site, 'index.html'))
  if (!introuvable) return void res.writeHead(404).end()
  envoyer(req, res, introuvable, false, 404)
}).listen(port, '0.0.0.0', () => {
  // Mise à jour automatique : si ce script change (git pull), on s'arrête et systemd
  // relance aussitôt la nouvelle version (Restart=always).
  watchFile(new URL(import.meta.url), { interval: 5000 }, () => {
    console.log('Serveur mis à jour : redémarrage.')
    process.exit(0)
  })
  void preparerDossier(racine)
  void lancerComptes()
  console.log(
    `Empreinte sur http://0.0.0.0:${port} : site ${site}, app ${racine} (sous /app), API relayée : ${API}`
  )
})

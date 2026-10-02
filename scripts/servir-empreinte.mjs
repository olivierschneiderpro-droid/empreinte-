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
import { createReadStream, statSync, watchFile } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'

const racine = resolve(process.argv[2] ?? 'empreinte-web')
const site = resolve(
  process.env.EMPREINTE_SITE ?? join(dirname(fileURLToPath(import.meta.url)), '..', 'presentation')
)
const port = Number(process.argv[3] ?? process.env.PORT ?? 8080)
const API = process.env.EMPREINTE_API ?? 'https://api.bible-strong.app'
// Annonce le relais à l'app (lu dans resourceAccess.web.tsx).
const ANNONCE = '<script>window.__EMPREINTE_RELAIS__=location.origin</script>'
const SANS = new Set(['host', 'origin', 'referer', 'connection', 'content-length', 'accept-encoding'])

const relayer = async (req, res) => {
  try {
    const headers = Object.fromEntries(
      Object.entries(req.headers).filter(([k]) => !SANS.has(k.toLowerCase()))
    )
    const corps = req.method === 'GET' || req.method === 'HEAD' ? undefined : Readable.toWeb(req)
    const reponse = await fetch(API + req.url, {
      method: req.method,
      headers,
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
    res.end(`Relais vers ${API} impossible : ${erreur.message}`)
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

const envoyer = (res, chemin, cache) => {
  res.writeHead(200, {
    'Content-Type': TYPES[extname(chemin)] ?? 'application/octet-stream',
    'Cache-Control': cache ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  createReadStream(chemin).pipe(res)
}

createServer((req, res) => {
  if ((req.url ?? '').startsWith('/v1/')) return void relayer(req, res)
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
      return void envoyer(res, trouve, url.startsWith('/app/_expo/'))
    readFile(trouve ?? join(racine, 'index.html'), 'utf8').then(
      html => {
        res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-cache' })
        res.end(html.replace('<head>', `<head>${ANNONCE}`))
      },
      () => res.writeHead(503, { 'Content-Type': TYPES['.txt'] }).end("L'app web n'est pas encore installée.")
    )
    return
  }

  // Le site de présentation.
  const demande = normalize(join(site, url))
  if (!demande.startsWith(site)) return void res.writeHead(403).end()
  const trouve = fichier(demande) ?? fichier(join(demande, 'index.html'))
  if (trouve) return void envoyer(res, trouve, false)
  const introuvable = fichier(join(site, '404.html')) ?? fichier(join(site, 'index.html'))
  if (!introuvable) return void res.writeHead(404).end()
  res.writeHead(404, { 'Content-Type': TYPES['.html'] })
  createReadStream(introuvable).pipe(res)
}).listen(port, '0.0.0.0', () => {
  // Mise à jour automatique : si ce script change (git pull), on s'arrête et systemd
  // relance aussitôt la nouvelle version (Restart=always).
  watchFile(new URL(import.meta.url), { interval: 5000 }, () => {
    console.log('Serveur mis à jour : redémarrage.')
    process.exit(0)
  })
  console.log(
    `Empreinte sur http://0.0.0.0:${port} : site ${site}, app ${racine} (sous /app), API relayée : ${API}`
  )
})

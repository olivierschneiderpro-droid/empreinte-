#!/usr/bin/env node
// Sert la version web d'Empreinte (export Expo) sans aucune dépendance.
// Toute route inconnue renvoie index.html, pour que /empreinte, /home… s'ouvrent directement.
// Les demandes /v1/… sont relayées vers l'API publique de Bible Strong : le navigateur ne parle
// qu'à ce serveur, ce qui évite le blocage CORS (l'API n'accepte que les sites de Bible Strong).
//
//   node scripts/servir-empreinte.mjs <dossier-web> [port]
//   ex. : node scripts/servir-empreinte.mjs ~/empreinte-web 8080
import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { Readable } from 'node:stream'

const racine = resolve(process.argv[2] ?? 'empreinte-web')
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

createServer((req, res) => {
  if ((req.url ?? '').startsWith('/v1/')) return void relayer(req, res)
  const url = decodeURIComponent((req.url ?? '/').split('?')[0])
  const demande = normalize(join(racine, url))
  if (!demande.startsWith(racine)) {
    res.writeHead(403).end()
    return
  }
  const trouve = fichier(demande) ?? fichier(join(demande, 'index.html'))
  const servi = trouve ?? join(racine, 'index.html')
  const statique = Boolean(trouve) && url.startsWith('/_expo/')
  res.writeHead(200, {
    'Content-Type': TYPES[extname(servi)] ?? 'application/octet-stream',
    'Cache-Control': statique ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  if (servi.endsWith('index.html')) {
    readFile(servi, 'utf8').then(html => res.end(html.replace('<head>', `<head>${ANNONCE}`)))
    return
  }
  createReadStream(servi).pipe(res)
}).listen(port, '0.0.0.0', () => {
  console.log(`Empreinte servi depuis ${racine} sur http://0.0.0.0:${port} (API relayée : ${API})`)
})

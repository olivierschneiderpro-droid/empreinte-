#!/usr/bin/env node
// Sert la version web d'Empreinte (export Expo) sans aucune dépendance.
// Toute route inconnue renvoie index.html, pour que /empreinte, /home… s'ouvrent directement.
//
//   node scripts/servir-empreinte.mjs <dossier-web> [port]
//   ex. : node scripts/servir-empreinte.mjs ~/empreinte-web 8080
import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'

const racine = resolve(process.argv[2] ?? 'empreinte-web')
const port = Number(process.argv[3] ?? process.env.PORT ?? 8080)

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
  createReadStream(servi).pipe(res)
}).listen(port, '0.0.0.0', () => {
  console.log(`Empreinte servi depuis ${racine} sur http://0.0.0.0:${port}`)
})

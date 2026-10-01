import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { Registre, type EtatRegistre } from '@empreinte/core'

export function cheminRegistre(): string {
  return resolve(process.env.EMPREINTE_REGISTRE ?? '.empreinte/registre.json')
}

export function charger(chemin = cheminRegistre()): Registre {
  if (!existsSync(chemin)) return new Registre()
  return new Registre(JSON.parse(readFileSync(chemin, 'utf8')) as EtatRegistre)
}

/** Écriture atomique : on n'abîme jamais le registre existant. */
export function enregistrer(registre: Registre, chemin = cheminRegistre()): void {
  mkdirSync(dirname(chemin), { recursive: true })
  const temp = `${chemin}.tmp`
  writeFileSync(temp, JSON.stringify(registre.exporter(), null, 2))
  renameSync(temp, chemin)
}

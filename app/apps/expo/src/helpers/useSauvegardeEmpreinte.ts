import { getDefaultStore } from 'jotai/vanilla'
import { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import {
  joursDeLectureAtom,
  symboleCompteAtom,
  SYMBOLES,
  type Symbole,
} from '~features/empreinte/SymboleCompte'
import * as UserActions from '~redux/modules/user'
import type { RootState } from '~redux/modules/reducer'
import { compteEmpreinte } from './compteEmpreinte'
import useLogin from './useLogin'

type Sauvegarde = {
  bible?: Partial<RootState['user']['bible']>
  studies?: RootState['user']['bible']['studies']
  symbole?: Symbole
  joursDeLecture?: string[]
  version?: number
}

const extraire = (etat: RootState): Sauvegarde => {
  const { studies, changelog: _changelog, ...bible } = etat.user.bible
  return {
    bible,
    studies,
    symbole: getDefaultStore().get(symboleCompteAtom),
    joursDeLecture: getDefaultStore().get(joursDeLectureAtom),
    version: 1,
  }
}

const estObjet = (valeur: unknown): valeur is Record<string, unknown> =>
  Boolean(valeur) && typeof valeur === 'object' && !Array.isArray(valeur)

/** Réunit deux sauvegardes : ce qui existe d'un côté ou de l'autre est gardé. */
const reunir = <T>(serveur: T, local: T): T => {
  if (!estObjet(serveur) || !estObjet(local)) return (serveur ?? local) as T
  const resultat: Record<string, unknown> = { ...local }
  for (const [cle, valeur] of Object.entries(serveur)) resultat[cle] = reunir(valeur, local[cle])
  return resultat as T
}

/**
 * Empreinte : la synchronisation des comptes Empreinte. À la connexion, la sauvegarde du
 * compte est réunie avec ce qui est déjà sur l'appareil ; ensuite, chaque changement est
 * renvoyé au serveur quelques secondes plus tard.
 */
export default function useSauvegardeEmpreinte() {
  const { isLogged, user } = useLogin()
  const store = useStore<RootState>()
  const dispatch = useDispatch()
  const actif = isLogged && user.provider === 'empreinte'

  useEffect(() => {
    if (!actif) return
    let annule = false
    let id: string | null = null
    let derniere = ''
    let minuterie: ReturnType<typeof setTimeout> | undefined

    const envoyer = async () => {
      const donnees = extraire(store.getState())
      const texte = JSON.stringify(donnees)
      if (texte === derniere) return
      try {
        const reponse = await compteEmpreinte.ecrireSauvegarde(id, donnees)
        if (reponse) id = reponse.id
        derniere = texte
      } catch {
        // Hors ligne : on renverra au prochain changement.
      }
    }

    const demarrer = async () => {
      try {
        const existante = await compteEmpreinte.lireSauvegarde()
        if (annule) return
        if (existante) {
          id = existante.id
          const serveur = (existante.donnees ?? {}) as Sauvegarde
          const local = extraire(store.getState())
          dispatch(
            UserActions.importData({
              bible: reunir(serveur.bible ?? {}, local.bible ?? {}),
              studies: reunir(serveur.studies ?? {}, local.studies ?? {}),
            } as never)
          )
          if (serveur.symbole && SYMBOLES.includes(serveur.symbole))
            getDefaultStore().set(symboleCompteAtom, serveur.symbole)
          if (Array.isArray(serveur.joursDeLecture))
            getDefaultStore().set(
              joursDeLectureAtom,
              [
                ...new Set([
                  ...serveur.joursDeLecture,
                  ...getDefaultStore().get(joursDeLectureAtom),
                ]),
              ]
                .sort()
                .slice(-400)
            )
        }
        await envoyer()
      } catch {
        // Serveur injoignable : les données restent sur l'appareil.
      }
    }
    void demarrer()

    const programmer = () => {
      clearTimeout(minuterie)
      minuterie = setTimeout(() => void envoyer(), 4000)
    }
    const desabonner = store.subscribe(programmer)
    const desabonnerSymbole = getDefaultStore().sub(symboleCompteAtom, programmer)
    const desabonnerJours = getDefaultStore().sub(joursDeLectureAtom, programmer)
    return () => {
      annule = true
      clearTimeout(minuterie)
      desabonner()
      desabonnerSymbole()
      desabonnerJours()
    }
  }, [actif, user.id, store, dispatch])
}

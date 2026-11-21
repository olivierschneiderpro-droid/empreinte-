import { deleteUser, getAuth } from 'firebase/auth'

import { compteEmpreinte } from './compteEmpreinte'
import { firebaseApp } from './firebaseApp.web'

export const getCurrentAuthUser = () => getAuth(firebaseApp).currentUser

/**
 * Sur le web, la personne est connectée avec un compte Empreinte (serveur de comptes du VPS) ;
 * l'ancien compte Firebase ne compte que s'il existe encore.
 */
export const hasDeletableAccount = () =>
  Boolean(compteEmpreinte.session() || getCurrentAuthUser())

export const deleteCurrentAuthUser = async () => {
  if (compteEmpreinte.session()) return compteEmpreinte.supprimer()
  const user = getCurrentAuthUser()
  if (user) await deleteUser(user)
}

import SymboleCompte from '~features/empreinte/SymboleCompte'

interface UserAvatarProps {
  size?: number
  photoURL?: string
  displayName?: string
  email?: string
}

/** Empreinte : l'avatar est le symbole choisi par la personne (empreinte, lampe, graine…). */
const UserAvatar = ({ size = 60 }: UserAvatarProps) => <SymboleCompte taille={size} />

export default UserAvatar

/**
 * Empreinte : les comptes hébergés sur le serveur Empreinte (PocketBase), sans Firebase.
 * Le serveur annonce leur adresse (window.__EMPREINTE_COMPTES__) quand la base tourne.
 * Ce module ne parle qu'en HTTP : changer de base demain ne touchera que ce fichier.
 */

export type EnregistrementCompte = {
  id: string
  email: string
  name: string
  verified: boolean
  created: string
}

type Session = { token: string; record: EnregistrementCompte }

const CLE_SESSION = 'empreinte.session'

export const adresseComptes = (): string | undefined =>
  typeof window !== 'undefined'
    ? (window as { __EMPREINTE_COMPTES__?: string }).__EMPREINTE_COMPTES__
    : undefined

export const comptesEmpreinteActifs = () => Boolean(adresseComptes())

export class ErreurCompte extends Error {
  constructor(
    message: string,
    readonly code: string
  ) {
    super(message)
  }
}

const lireSession = (): Session | null => {
  try {
    const texte = globalThis.localStorage?.getItem(CLE_SESSION)
    return texte ? (JSON.parse(texte) as Session) : null
  } catch {
    return null
  }
}

const ecrireSession = (session: Session | null) => {
  try {
    if (session) globalThis.localStorage?.setItem(CLE_SESSION, JSON.stringify(session))
    else globalThis.localStorage?.removeItem(CLE_SESSION)
  } catch {
    // Navigation privée : la session vaut pour cette visite seulement.
  }
}

/** Traduit les réponses d'erreur de la base en messages compréhensibles. */
const messageErreur = (statut: number, corps: unknown): ErreurCompte => {
  const donnees = (corps as { data?: Record<string, { code?: string }> })?.data ?? {}
  const champ = Object.entries(donnees)[0]
  const code = champ?.[1]?.code ?? ''
  if (code === 'validation_invalid_email' || code === 'validation_not_unique')
    return new ErreurCompte(
      champ?.[0] === 'email'
        ? 'Cette adresse e-mail est déjà utilisée ou invalide.'
        : 'Ce nom est déjà utilisé.',
      'compte/existe'
    )
  if (code === 'validation_length_out_of_range' && champ?.[0] === 'password')
    return new ErreurCompte(
      'Le mot de passe doit faire au moins 8 caractères.',
      'compte/mot-de-passe'
    )
  if (statut === 400 && !champ)
    return new ErreurCompte('E-mail ou mot de passe incorrect.', 'compte/identifiants')
  if (statut === 401 || statut === 403)
    return new ErreurCompte('Votre session a expiré. Reconnectez-vous.', 'compte/session')
  return new ErreurCompte(
    'Le serveur de comptes ne répond pas. Réessayez dans un instant.',
    'compte/serveur'
  )
}

const appeler = async <T>(
  chemin: string,
  options: RequestInit = {},
  jeton?: string
): Promise<T> => {
  const base = adresseComptes()
  if (!base)
    throw new ErreurCompte('Les comptes Empreinte ne sont pas disponibles ici.', 'compte/absent')
  let reponse: Response
  try {
    reponse = await fetch(`${base}${chemin}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(jeton ? { Authorization: jeton } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new ErreurCompte(
      'Le serveur de comptes ne répond pas. Réessayez dans un instant.',
      'compte/reseau'
    )
  }
  const texte = await reponse.text()
  const corps = texte ? JSON.parse(texte) : null
  if (!reponse.ok) throw messageErreur(reponse.status, corps)
  return corps as T
}

const UTILISATEURS = '/api/collections/users'

export const compteEmpreinte = {
  session: lireSession,

  async connecter(email: string, motDePasse: string) {
    const session = await appeler<Session>(`${UTILISATEURS}/auth-with-password`, {
      method: 'POST',
      body: JSON.stringify({ identity: email.trim(), password: motDePasse }),
    })
    ecrireSession(session)
    return session
  },

  async inscrire(nom: string, email: string, motDePasse: string) {
    await appeler(`${UTILISATEURS}/records`, {
      method: 'POST',
      body: JSON.stringify({
        name: nom.trim(),
        email: email.trim(),
        password: motDePasse,
        passwordConfirm: motDePasse,
        emailVisibility: false,
      }),
    })
    return compteEmpreinte.connecter(email, motDePasse)
  },

  /** Renouvelle le jeton au démarrage ; une session expirée est oubliée. */
  async rafraichir() {
    const actuelle = lireSession()
    if (!actuelle) return null
    try {
      const session = await appeler<Session>(
        `${UTILISATEURS}/auth-refresh`,
        { method: 'POST' },
        actuelle.token
      )
      ecrireSession(session)
      return session
    } catch (erreur) {
      if (erreur instanceof ErreurCompte && erreur.code === 'compte/session') ecrireSession(null)
      // Hors ligne : on garde la session connue pour ne pas déconnecter la personne.
      return erreur instanceof ErreurCompte && erreur.code === 'compte/session' ? null : actuelle
    }
  },

  deconnecter() {
    ecrireSession(null)
  },

  async demanderNouveauMotDePasse(email: string) {
    await appeler(`${UTILISATEURS}/request-password-reset`, {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    })
  },

  async modifier(champs: Record<string, string>) {
    const session = lireSession()
    if (!session) throw new ErreurCompte('Vous n’êtes pas connecté.', 'compte/session')
    const record = await appeler<EnregistrementCompte>(
      `${UTILISATEURS}/records/${session.record.id}`,
      { method: 'PATCH', body: JSON.stringify(champs) },
      session.token
    )
    ecrireSession({ ...session, record })
    return record
  },

  /** La sauvegarde du compte : tout ce que la personne a écrit et marqué. */
  async lireSauvegarde(): Promise<{ id: string; donnees: unknown } | null> {
    const session = lireSession()
    if (!session) return null
    const liste = await appeler<{ items: { id: string; donnees: unknown }[] }>(
      `/api/collections/sauvegardes/records?perPage=1`,
      {},
      session.token
    )
    return liste.items[0] ?? null
  },

  async ecrireSauvegarde(id: string | null, donnees: unknown) {
    const session = lireSession()
    if (!session) return null
    return appeler<{ id: string }>(
      id ? `/api/collections/sauvegardes/records/${id}` : '/api/collections/sauvegardes/records',
      {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(id ? { donnees } : { user: session.record.id, donnees }),
      },
      session.token
    )
  },
}

export type Commentaire = { id: string; nom: string; texte: string; created: string; user: string }

/** Empreinte : les commentaires partagés sur un sujet (une vidéo, un chant, un passage…). */
export const commentairesEmpreinte = {
  async lire(sujet: string): Promise<Commentaire[]> {
    const filtre = encodeURIComponent(`sujet = "${sujet.replace(/"/g, '')}"`)
    const liste = await appeler<{ items: Commentaire[] }>(
      `/api/collections/commentaires/records?filter=${filtre}&sort=-created&perPage=100`
    )
    return liste.items
  },
  async ajouter(sujet: string, texte: string) {
    const session = lireSession()
    if (!session) throw new ErreurCompte('Connectez-vous pour partager.', 'compte/session')
    return appeler<Commentaire>(
      '/api/collections/commentaires/records',
      {
        method: 'POST',
        body: JSON.stringify({
          sujet,
          user: session.record.id,
          nom: session.record.name || session.record.email.split('@')[0],
          texte: texte.trim(),
        }),
      },
      session.token
    )
  },
}

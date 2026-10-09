import * as Sentry from '@sentry/react-native'
import i18n from '~i18n'
import type { AppDispatch } from '~redux/store'
import type { AccountEntryClassification } from './accountEntry'
import { runAllCleanups } from './cleanupRegistry'
import { compteEmpreinte, ErreurCompte, type EnregistrementCompte } from './compteEmpreinte'
import type { FireAuthProfile } from './FireAuth.web'
import { toast } from './toast'

type OnLogin = (payload: {
  profile: FireAuthProfile
  accountEntryClassification: AccountEntryClassification
}) => void

const profilDe = (record: EnregistrementCompte): FireAuthProfile => ({
  id: record.id,
  email: record.email,
  displayName: record.name || record.email.split('@')[0],
  photoURL: '',
  provider: 'empreinte',
  // Pas de vérification par e-mail tant que l'envoi de courriels n'est pas réglé sur le serveur.
  emailVerified: true,
  createdAt: record.created || null,
})

const signaler = (erreur: unknown) => {
  toast.error(erreur instanceof ErreurCompte ? erreur.message : i18n.t('Une erreur est survenue.'))
}

/**
 * Empreinte : la connexion par les comptes hébergés sur le serveur Empreinte. Mêmes
 * fonctions que la connexion Firebase, pour que le reste de l'app ne voie aucune différence.
 */
export class CompteEmpreinteAuth {
  user: { uid: string } | null = null
  profile: FireAuthProfile | null = null
  private onLogin: OnLogin | null = null
  private onUserChange: ((profile: FireAuthProfile) => void) | null = null
  private onLogout: (() => void) | null = null

  async init(
    onLogin: OnLogin,
    onUserChange: (profile: FireAuthProfile) => void,
    onLogout: () => void,
    _onEmailVerified: () => void,
    _onError: (error: unknown) => void,
    _dispatch: AppDispatch
  ) {
    this.onLogin = onLogin
    this.onUserChange = onUserChange
    this.onLogout = onLogout
    const session = await compteEmpreinte.rafraichir()
    if (session) this.ouvrir(session.record, 'existing-account')
  }

  private ouvrir(record: EnregistrementCompte, classification: AccountEntryClassification) {
    const profile = profilDe(record)
    const dejaOuvert = Boolean(this.user)
    this.user = { uid: record.id }
    this.profile = profile
    Sentry.getCurrentScope().setUser({ id: profile.id })
    if (dejaOuvert) this.onUserChange?.(profile)
    else this.onLogin?.({ profile, accountEntryClassification: classification })
  }

  login = async (email: string, password: string): Promise<boolean> => {
    try {
      const session = await compteEmpreinte.connecter(email, password)
      this.ouvrir(session.record, 'existing-account')
    } catch (erreur) {
      signaler(erreur)
    }
    return false
  }

  register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const session = await compteEmpreinte.inscrire(username, email, password)
      this.ouvrir(session.record, 'new-account')
    } catch (erreur) {
      signaler(erreur)
    }
    return false
  }

  resetPassword = async (email: string): Promise<boolean> => {
    try {
      await compteEmpreinte.demanderNouveauMotDePasse(email)
      toast.success(i18n.t('Email envoyé.'))
    } catch (erreur) {
      signaler(erreur)
    }
    return false
  }

  // Google et Apple demandent un nom de domaine en HTTPS : ils viendront avec lui.
  googleLogin = async () => {
    toast.info(i18n.t('auth.providerSoon'))
    return false
  }
  appleLogin = this.googleLogin

  onCredentialSuccess = async (_credential: unknown, resolve: (value: boolean) => void) =>
    resolve(false)

  logout = async () => {
    compteEmpreinte.deconnecter()
    if (this.user) {
      runAllCleanups()
      this.user = null
      this.profile = null
      Sentry.getCurrentScope().setUser(null)
      this.onLogout?.()
    }
    toast(i18n.t('Vous êtes déconnecté.'))
  }

  sendEmailVerification = async () => {}

  updateDisplayName = async (displayName: string) => {
    try {
      this.ouvrir(await compteEmpreinte.modifier({ name: displayName }), 'existing-account')
      return true
    } catch (erreur) {
      signaler(erreur)
      return false
    }
  }

  updatePhotoURL = async (_photoURL: string) => false

  changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await compteEmpreinte.modifier({
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: newPassword,
      })
      return true
    } catch (erreur) {
      signaler(erreur)
      return false
    }
  }

  loginWithCustomToken = async (_token: string) => false

  checkEmailVerification = async () => true
}

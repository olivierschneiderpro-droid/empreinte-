import type React from 'react'
import { useTranslation } from 'react-i18next'
import useLogin from '~helpers/useLogin'
import ConnexionRequise from './ConnexionRequise'

/** Empreinte (web) : au lieu d'une fenêtre qui bloque, la page invite à se connecter. */
const withLogin =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    const { isLogged } = useLogin()
    const { t } = useTranslation()
    if (!isLogged)
      return (
        <ConnexionRequise
          titre={t('Études bibliques')}
          raison={t('Rédigez vos études, sauvegardez-les dans le cloud.')}
        />
      )
    return <Component {...props} />
  }

export default withLogin

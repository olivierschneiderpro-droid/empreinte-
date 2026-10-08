import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, TextInput, type TextInputProps } from 'react-native'
import Link, { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import FireAuth from '~helpers/FireAuth'
import { toast } from '~helpers/toast'
import useLogin from '~helpers/useLogin'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { LogoEmpreinte } from '~features/empreinte/lumiere'
import ChoixSymbole from '~features/empreinte/ChoixSymbole'
import { choisirInvite } from '~features/empreinte/compte'
import './espace-connexion.css'

export type ModeConnexion = 'connexion' | 'inscription'

const illustration = require('~assets/images/new-tab/notes-writer.webp')

function Champ({
  icone,
  label,
  ...props
}: { icone: React.ComponentProps<typeof FeatherIcon>['name']; label: string } & TextInputProps) {
  const theme = useTheme()
  return (
    <Box className="gap-[6px]">
      <Text className="text-[13px] font-bold text-grey">{label}</Text>
      <HStack className="items-center gap-[10px] h-[50px] px-[14px] rounded-[14px] border border-border bg-reverse">
        <FeatherIcon name={icone} size={18} color="grey" />
        <TextInput
          {...props}
          accessibilityLabel={label}
          placeholderTextColor={theme.colors.tertiary}
          className="flex-1 text-[15px] text-default h-full"
          style={{ outlineStyle: 'none' } as object}
        />
      </HStack>
    </Box>
  )
}

/**
 * Empreinte : une seule page pour entrer ou créer son compte. Tout reste lisible sans compte ;
 * le compte sert à garder et synchroniser ce qu'on écrit.
 */
export default function EspaceConnexion({ mode: modeInitial }: { mode: ModeConnexion }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const { retour, raison } = useLocalSearchParams<{ retour?: string; raison?: string }>()
  const { isLogged } = useLogin()
  const [mode, setMode] = useState<ModeConnexion>(modeInitial)
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [voirMotDePasse, setVoirMotDePasse] = useState(false)
  const [enCours, setEnCours] = useState(false)

  // Empreinte : une fois connecté, on revient exactement là où l'on voulait aller.
  useEffect(() => {
    if (isLogged) router.replace((retour && retour !== '/' ? retour : '/home') as never)
  }, [isLogged, retour, router])

  const continuerSansCompte = () => {
    choisirInvite()
    router.replace((raison === 'compte' || !retour || retour === '/' ? '/home' : retour) as never)
  }

  const lancer = async (operation: () => Promise<boolean>) => {
    setEnCours(true)
    setEnCours(await operation())
  }

  const valider = () => {
    if (!email || !motDePasse || (mode === 'inscription' && !nom)) {
      toast.error(t('Veuillez remplir les champs'))
      return
    }
    void lancer(() =>
      mode === 'connexion'
        ? FireAuth.login(email, motDePasse)
        : FireAuth.register(nom, email, motDePasse)
    )
  }

  const titre = resolveFontFamily(theme.fontFamily.title)
  const avantages = [
    { icone: 'refresh-cw', texte: t('auth.benefit.sync') },
    { icone: 'edit-3', texte: t('auth.benefit.studies') },
    { icone: 'shield', texte: t('auth.benefit.backup') },
  ] as const

  return (
    <div className="ec-page">
      <div className="ec-cadre">
        <div className="ec-bloc">
          <aside className="ec-illustration">
            <Box className="gap-[14px]">
              <Text
                className="text-[white] text-[34px] leading-[40px]"
                style={{ fontFamily: titre }}
              >
                {t('auth.heroTitle')}
              </Text>
              <Text className="text-[white] text-[15px] leading-[23px] opacity-[0.85]">
                {t('auth.heroText')}
              </Text>
            </Box>
            <div className="ec-avantages">
              <Box className="gap-[12px] mt-[26px]">
                {avantages.map(({ icone, texte }) => (
                  <HStack key={texte} className="items-center gap-[12px]">
                    <Box
                      className="w-[34px] h-[34px] rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
                    >
                      <FeatherIcon name={icone} size={16} color="white" />
                    </Box>
                    <Text className="text-[white] text-[14px] flex-1">{texte}</Text>
                  </HStack>
                ))}
              </Box>
            </div>
            <div className="ec-image">
              <Image
                source={illustration}
                contentFit="contain"
                contentPosition="bottom"
                style={{ width: '100%', height: '100%' }}
                accessible={false}
              />
            </div>
          </aside>

          <main className="ec-formulaire">
            <Box className="gap-[8px]">
              <HStack className="items-center gap-[10px]">
                <LogoEmpreinte taille={22} />
                <Text className="font-bold text-[16px]">Empreinte</Text>
              </HStack>
              <Text className="text-[30px] mt-[18px]" style={{ fontFamily: titre }}>
                {mode === 'connexion' ? t('auth.loginTitle') : t('auth.registerTitle')}
              </Text>
              <Text className="text-grey text-[14px]">
                {mode === 'connexion' ? t('auth.loginText') : t('auth.registerText')}
              </Text>
            </Box>

            {raison === 'compte' && (
              <HStack className="items-center gap-[10px] rounded-[14px] bg-light-primary px-[14px] py-[12px]">
                <FeatherIcon name="lock" size={16} color="primary" />
                <Text className="flex-1 text-[13px] text-primary">{t('auth.accountRequired')}</Text>
              </HStack>
            )}

            <div className="ec-onglets" role="tablist">
              {(['connexion', 'inscription'] as const).map(choix => (
                <LinkBox
                  key={choix}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: mode === choix }}
                  onPress={() => setMode(choix)}
                  className="flex-1 items-center justify-center h-[40px] rounded-[10px]"
                  style={
                    mode === choix
                      ? {
                          backgroundColor: theme.colors.reverse,
                          boxShadow: '0 2px 8px rgba(17,17,19,0.08)',
                        }
                      : undefined
                  }
                >
                  <Text
                    className={mode === choix ? 'font-bold text-[14px]' : 'text-grey text-[14px]'}
                  >
                    {choix === 'connexion' ? t('Connexion') : t('auth.registerTab')}
                  </Text>
                </LinkBox>
              ))}
            </div>

            <HStack className="gap-[10px]">
              <LinkBox
                disabled={enCours}
                onPress={() => void lancer(() => FireAuth.googleLogin())}
                className="flex-1 flex-row items-center justify-center gap-[10px] h-[48px] rounded-[14px] border border-border bg-reverse"
              >
                <Text className="font-bold text-[16px]" style={{ color: '#4285F4' }}>
                  G
                </Text>
                <Text className="font-bold text-[14px]">Google</Text>
              </LinkBox>
              <LinkBox
                disabled={enCours}
                onPress={() => void lancer(() => FireAuth.appleLogin())}
                className="flex-1 flex-row items-center justify-center gap-[10px] h-[48px] rounded-[14px]"
                style={{ backgroundColor: '#111113' }}
              >
                <Text className="font-bold text-[14px] text-[white]">Apple</Text>
              </LinkBox>
            </HStack>

            <HStack className="items-center gap-[12px]">
              <Box className="flex-1 h-[1px] bg-border" />
              <Text className="text-tertiary text-[12px]">{t('auth.orEmail')}</Text>
              <Box className="flex-1 h-[1px] bg-border" />
            </HStack>

            <Box className="gap-[14px]">
              {mode === 'inscription' && (
                <Champ
                  icone="user"
                  label={t('Nom')}
                  value={nom}
                  onChangeText={setNom}
                  autoComplete="name"
                  placeholder={t('auth.namePlaceholder')}
                />
              )}
              <Champ
                icone="mail"
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoComplete="email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="vous@exemple.fr"
              />
              <Box className="gap-[6px]">
                <Champ
                  icone="lock"
                  label={t('Mot de passe')}
                  value={motDePasse}
                  onChangeText={setMotDePasse}
                  secureTextEntry={!voirMotDePasse}
                  autoComplete={mode === 'connexion' ? 'current-password' : 'new-password'}
                  onSubmitEditing={valider}
                  placeholder="••••••••"
                />
                <HStack className="items-center justify-between">
                  <Link onPress={() => setVoirMotDePasse(v => !v)}>
                    <Text className="text-grey text-[12px]">
                      {voirMotDePasse ? t('auth.hidePassword') : t('auth.showPassword')}
                    </Text>
                  </Link>
                  {mode === 'connexion' && (
                    <Link route="ForgotPassword">
                      <Text className="text-primary text-[12px] font-bold">
                        {t('Mot de passe oublié ?')}
                      </Text>
                    </Link>
                  )}
                </HStack>
              </Box>
            </Box>

            {mode === 'inscription' && (
              <Box className="gap-[10px]">
                <Text className="text-[13px] font-bold text-grey">{t('auth.chooseSymbol')}</Text>
                <ChoixSymbole compact />
              </Box>
            )}

            <LinkBox
              disabled={enCours}
              onPress={valider}
              className="flex-row items-center justify-center gap-[10px] h-[52px] rounded-[14px] bg-primary"
            >
              {enCours ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-[white] font-bold text-[15px]">
                    {mode === 'connexion' ? t('Connexion') : t('Créer mon compte')}
                  </Text>
                  <FeatherIcon name="arrow-right" size={17} color="white" />
                </>
              )}
            </LinkBox>

            <LinkBox
              onPress={continuerSansCompte}
              className="flex-row items-center justify-center gap-[8px] h-[44px] rounded-[14px]"
            >
              <Text className="text-grey font-bold text-[14px]">{t('auth.continueAsGuest')}</Text>
              <FeatherIcon name="arrow-right" size={15} color="grey" />
            </LinkBox>

            <Text className="text-tertiary text-[12px] text-center leading-[18px]">
              {t('auth.freeNote')}
            </Text>
          </main>
        </div>
      </div>
    </div>
  )
}

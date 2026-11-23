import { useAtomValue, useSetAtom } from 'jotai/react'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'
import Text from '~common/ui/Text'
import useSearchButtonPress from '~features/app-switcher/BottomTabBar/Buttons/useSearchButton'
import { compactWorkspaceDrawerAtom } from '~features/app-switcher/workspaceViewTracking'
import { CarteVerset, Micro } from '~features/empreinte/AccueilLumiere'
import { Icone, type NomIcone } from '~features/empreinte/icones'
import { LogoEmpreinte, POLICES, police } from '~features/empreinte/lumiere'
import { useComputedPlanItems } from '~features/plans/plan.hooks'
import type { RootState } from '~redux/modules/reducer'
import { useTheme } from '~themes/ThemeProvider'
import { colorWithOpacity } from '~themes/colorValues'
import { tabsAtom } from '../../state/tabs'
import MenuEspaces from './MenuEspaces'
import { useOuvrirBible } from './useOuvrirBible'

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

function BoutonHaut({
  icone,
  libelle,
  onPress,
}: {
  icone: NomIcone
  libelle: string
  onPress: () => void
}) {
  const theme = useTheme()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={libelle}
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorWithOpacity(theme.colors.default, 0.05),
      }}
    >
      <Icone nom={icone} taille={19} couleur={theme.colors.default} trait={1.9} />
    </Pressable>
  )
}

/**
 * Interface mobile + tablette : le haut de l'accueil, centré sur la Bible.
 * Loupe et menu des espaces en haut ; Réalités n'apparaît plus ici.
 */
export default function AccueilBible() {
  const theme = useTheme()
  const router = useRouter()
  const [espacesOuverts, setEspacesOuverts] = useState(false)
  const setPage = useSetAtom(compactWorkspaceDrawerAtom)
  const { onPress: ouvrirRecherche } = useSearchButtonPress()
  const ouvrirBible = useOuvrirBible()
  const tabs = useAtomValue(tabsAtom)
  const plans = useComputedPlanItems()
  const plan = plans.find(p => p.status === 'Progress') ?? plans[0]
  const initiale = useSelector((state: RootState) =>
    (state.user.displayName || state.user.email || 'O').trim().charAt(0).toUpperCase()
  )

  const bible = tabs.find(tab => tab.type === 'bible')
  const lecture =
    bible && bible.type === 'bible'
      ? {
          livre: bible.data.selectedBook.Nom,
          chapitre: bible.data.selectedChapter,
          version: bible.data.selectedVersion,
        }
      : { livre: 'Genèse', chapitre: 1, version: '' }

  const maintenant = new Date()
  const salut = maintenant.getHours() >= 18 || maintenant.getHours() < 5 ? 'Bonsoir' : 'Bonjour'
  const date = `${JOURS[maintenant.getDay()]} ${maintenant.getDate() === 1 ? '1er' : maintenant.getDate()} ${MOIS[maintenant.getMonth()]}`
  const jourPlan = plan ? Math.max(1, Math.round(plan.progress * 365)) : 0

  const carte = {
    flex: 1,
    padding: 16,
    borderRadius: 22,
    gap: 12,
    backgroundColor: colorWithOpacity(theme.colors.default, 0.04),
  } as const

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <LogoEmpreinte taille={22} />
          <Text style={{ fontFamily: police(POLICES.gras), fontSize: 18, letterSpacing: -0.36 }}>
            Empreinte
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <BoutonHaut
            icone="search"
            libelle="Chercher"
            onPress={() => {
              setPage(null)
              ouvrirRecherche()
            }}
          />
          <BoutonHaut
            icone="layers"
            libelle="Changer d’espace"
            onPress={() => setEspacesOuverts(true)}
          />
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Profil"
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colorWithOpacity(theme.colors.default, 0.1),
            }}
          >
            <Text style={{ fontFamily: police(POLICES.gras), fontSize: 15 }}>{initiale}</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ gap: 2 }}>
        <Micro>{date}</Micro>
        <Text style={{ fontFamily: police(POLICES.gras), fontSize: 30, letterSpacing: -0.9 }}>
          {salut}.
        </Text>
      </View>

      <CarteVerset />

      <Pressable
        onPress={ouvrirBible}
        accessibilityRole="button"
        accessibilityLabel={`Reprendre la lecture : ${lecture.livre} ${lecture.chapitre}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 18,
          borderRadius: 24,
          backgroundColor: theme.colors.default,
        }}
      >
        <View style={{ gap: 4 }}>
          <Micro couleur={colorWithOpacity(theme.colors.reverse, 0.7)}>Reprendre la lecture</Micro>
          <Text
            style={{
              fontFamily: police(POLICES.gras),
              fontSize: 24,
              letterSpacing: -0.5,
              color: theme.colors.reverse,
            }}
          >
            {`${lecture.livre} ${lecture.chapitre}`}
          </Text>
          {lecture.version ? (
            <Text
              style={{
                fontFamily: police(POLICES.moyen),
                fontSize: 12.5,
                color: colorWithOpacity(theme.colors.reverse, 0.7),
              }}
            >
              {lecture.version}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.reverse,
          }}
        >
          <Icone nom="fwd" taille={20} couleur={theme.colors.default} trait={2.2} />
        </View>
      </Pressable>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable
          onPress={() =>
            router.push(plan ? { pathname: '/plan', params: { planId: plan.id } } : '/plans')
          }
          accessibilityRole="button"
          style={carte}
        >
          <Micro>Plan de lecture</Micro>
          {plan ? (
            <>
              <Text style={{ fontFamily: police(POLICES.gras), fontSize: 30, letterSpacing: -0.9 }}>
                {jourPlan}
                <Text
                  style={{ fontFamily: police(POLICES.moyen), fontSize: 15, color: theme.colors.grey }}
                >
                  {' /365'}
                </Text>
              </Text>
              <Text numberOfLines={2} style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>
                {plan.title}
              </Text>
            </>
          ) : (
            <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>
              Choisir un plan →
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => setPage('chants')}
          accessibilityRole="button"
          style={carte}
        >
          <Micro>Chants</Micro>
          <Icone nom="music" taille={30} couleur={theme.colors.default} trait={1.6} />
          <Text numberOfLines={2} style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>
            Cantiques et chant du jour
          </Text>
        </Pressable>
      </View>

      <MenuEspaces
        visible={espacesOuverts}
        onClose={() => setEspacesOuverts(false)}
        espace="bible"
      />
    </View>
  )
}

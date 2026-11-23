import { useSetAtom } from 'jotai/react'
import { Modal, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '~common/ui/Text'
import { compactWorkspaceDrawerAtom } from '~features/app-switcher/workspaceViewTracking'
import { useJourEmpreinte } from '~features/empreinte/AccueilLumiere'
import { Icone, type NomIcone } from '~features/empreinte/icones'
import { POLICES, police } from '~features/empreinte/lumiere'
import { useTheme } from '~themes/ThemeProvider'
import { colorWithOpacity } from '~themes/colorValues'

type Props = { visible: boolean; onClose: () => void; espace: 'bible' | 'realites' }

/**
 * Interface mobile + tablette : feuille « Vos espaces ».
 * La Bible est l'espace public ; Réalités est un espace de travail à part.
 */
export default function MenuEspaces({ visible, onClose, espace }: Props) {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const setPage = useSetAtom(compactWorkspaceDrawerAtom)
  const { ecarts } = useJourEmpreinte()

  const choisir = (cible: 'bible' | 'realites') => {
    onClose()
    if (cible === 'realites') setPage('realites')
    else setPage('home')
  }

  const Ligne = ({
    cible,
    icone,
    titre,
    detail,
    badge,
  }: {
    cible: 'bible' | 'realites'
    icone: NomIcone
    titre: string
    detail: string
    badge?: string
  }) => {
    const actif = espace === cible
    return (
      <Pressable
        onPress={() => choisir(cible)}
        accessibilityRole="button"
        accessibilityState={{ selected: actif }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          padding: 16,
          borderRadius: 20,
          borderWidth: actif ? 1.5 : 1,
          borderColor: actif ? theme.colors.default : colorWithOpacity(theme.colors.default, 0.1),
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: actif
              ? theme.colors.default
              : colorWithOpacity(theme.colors.default, 0.05),
          }}
        >
          <Icone
            nom={icone}
            taille={22}
            couleur={actif ? theme.colors.reverse : theme.colors.default}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: police(POLICES.gras), fontSize: 16 }}>{titre}</Text>
          <Text
            style={{ fontFamily: police(POLICES.moyen), fontSize: 12.5, color: theme.colors.grey }}
          >
            {detail}
          </Text>
        </View>
        {badge ? (
          <View
            style={{
              height: 24,
              paddingHorizontal: 8,
              borderRadius: 12,
              justifyContent: 'center',
              backgroundColor: colorWithOpacity(theme.colors.quart, 0.12),
            }}
          >
            <Text
              style={{ fontFamily: police(POLICES.titre), fontSize: 11, color: theme.colors.quart }}
            >
              {badge}
            </Text>
          </View>
        ) : actif ? (
          <Icone nom="check" taille={20} couleur={theme.colors.default} trait={2.2} />
        ) : null}
      </Pressable>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        accessibilityLabel="Fermer"
        style={{ flex: 1, backgroundColor: 'rgba(17,18,20,0.35)' }}
      />
      <View
        style={{
          paddingTop: 10,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 28,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: theme.colors.reverse,
          gap: 14,
          width: '100%',
          maxWidth: 640,
          alignSelf: 'center',
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: colorWithOpacity(theme.colors.default, 0.12),
          }}
        />
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontFamily: police(POLICES.gras), fontSize: 22, letterSpacing: -0.4 }}>
            Vos espaces
          </Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colorWithOpacity(theme.colors.default, 0.05),
            }}
          >
            <Icone nom="x" taille={16} couleur={theme.colors.default} trait={2} />
          </Pressable>
        </View>
        <Ligne cible="bible" icone="book" titre="Bible" detail="Lire, écouter, étudier, chanter" />
        <Ligne
          cible="realites"
          icone="layers"
          titre="Réalités"
          detail="Documents, missions, vérifications"
          badge={
            ecarts.length ? `${ecarts.length} écart${ecarts.length > 1 ? 's' : ''}` : undefined
          }
        />
        <Text
          style={{
            fontFamily: police(POLICES.moyen),
            fontSize: 12.5,
            lineHeight: 18,
            color: theme.colors.grey,
          }}
        >
          La Bible est l’espace de tous. Réalités est un espace de travail, à part.
        </Text>
      </View>
    </Modal>
  )
}

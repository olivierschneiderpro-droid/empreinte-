import React, { useState } from 'react'
import { Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Icone } from '~features/empreinte/icones'
import { POLICES, police, styleVerre, useVerre } from '~features/empreinte/lumiere'
import { useSwitchGroup } from '~state/tabGroups'
import {
  activeGroupIdAtom,
  activeTabIdAtom,
  activeTabIndexAtom,
  appSwitcherModeAtom,
  tabGroupsAtom,
} from '~state/tabs'
import { useTheme } from '~themes/ThemeProvider'
import { resolveThemeColor } from '~themes/colorValues'
import { resolveUniverseColors } from '~themes/universeColors'
import TabIcon, { tabIconColorConfig } from './utils/getIconByTabType'
import { useCloseWorkspaceTab } from './utils/useCloseWorkspaceTab'
import { useOpenInNewTab } from './utils/useOpenInNewTab'

/**
 * Empreinte : le bouton « Onglets », en haut de chaque page (sauf l'accueil). Il ouvre un bloc
 * pour gérer les onglets, même barre latérale fermée : passer de l'un à l'autre, les fermer,
 * en ouvrir un nouveau, retrouver les groupes.
 */
export default function BoutonOnglets() {
  const { t } = useTranslation()
  const theme = useTheme()
  const verre = useVerre()
  const router = useRouter()
  const [ouvert, setOuvert] = useState(false)
  const groupes = useAtomValue(tabGroupsAtom)
  const groupeActif = useAtomValue(activeGroupIdAtom)
  const ongletActif = useAtomValue(activeTabIdAtom)
  const changerDeGroupe = useSwitchGroup()
  const setIndexActif = useSetAtom(activeTabIndexAtom)
  const setMode = useSetAtom(appSwitcherModeAtom)
  const fermerOnglet = useCloseWorkspaceTab()
  const ouvrirNouvelOnglet = useOpenInNewTab()
  const total = groupes.reduce((somme, groupe) => somme + groupe.tabs.length, 0)
  const tries = [...groupes.filter(g => g.isDefault), ...groupes.filter(g => !g.isDefault)]

  const choisir = (groupeId: string, index: number) => {
    changerDeGroupe(groupeId)
    setIndexActif(index)
    setMode('view')
    setOuvert(false)
    router.navigate('/')
  }

  return (
    <View style={{ zIndex: 50 }}>
      <Pressable
        testID="bouton-onglets"
        accessibilityRole="button"
        accessibilityLabel={t('tabs.title', { defaultValue: 'Onglets' })}
        accessibilityState={{ expanded: ouvert }}
        onPress={() => setOuvert(valeur => !valeur)}
        style={[
          styleVerre(verre, 20),
          { flexDirection: 'row', alignItems: 'center', gap: 8, height: 48, paddingHorizontal: 16 },
        ]}
      >
        <Icone nom="tabs" taille={17} />
        <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>Onglets</Text>
        <View
          style={{
            minWidth: 22,
            height: 22,
            borderRadius: 11,
            paddingHorizontal: 6,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: verre.actif,
          }}
        >
          <Text style={{ fontFamily: police(POLICES.mono), fontSize: 11.5 }}>{total}</Text>
        </View>
      </Pressable>
      {ouvert ? (
        <>
          {/* Un clic hors du bloc le referme. */}
          <Pressable
            accessibilityLabel={t('Fermer')}
            onPress={() => setOuvert(false)}
            style={
              (Platform.OS === 'web'
                ? { position: 'fixed', inset: 0 }
                : {
                    position: 'absolute',
                    top: -2000,
                    left: -2000,
                    right: -2000,
                    bottom: -2000,
                  }) as never
            }
          />
          <View
            testID="bloc-onglets"
            style={[
              styleVerre(verre, 22),
              {
                position: 'absolute',
                top: 56,
                right: 0,
                width: 340,
                maxHeight: 460,
                padding: 10,
                backgroundColor: theme.colors.reverse,
              },
            ]}
          >
            <ScrollView style={{ maxHeight: 380 }}>
              {tries.map(groupe => (
                <View key={groupe.id} style={{ marginBottom: 6 }}>
                  {!groupe.isDefault ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor:
                            resolveThemeColor(theme, groupe.color || '#64748b') ?? '#64748b',
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: police(POLICES.monoMoyen),
                          fontSize: 11,
                          letterSpacing: 0.8,
                          textTransform: 'uppercase',
                          color: theme.colors.grey,
                        }}
                      >
                        {groupe.name}
                      </Text>
                    </View>
                  ) : null}
                  {groupe.tabs.map((onglet, index) => {
                    const actif = groupe.id === groupeActif && onglet.id === ongletActif
                    return (
                      <View
                        key={onglet.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderRadius: 12,
                          backgroundColor: actif ? verre.actif : 'transparent',
                        }}
                      >
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={onglet.title}
                          accessibilityState={{ selected: actif }}
                          onPress={() => choisir(groupe.id, index)}
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            paddingHorizontal: 8,
                            height: 38,
                          }}
                        >
                          <View
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 6,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: resolveUniverseColors(theme.colors, onglet.type)
                                .background,
                            }}
                          >
                            <TabIcon
                              type={onglet.type}
                              size={12}
                              color={resolveThemeColor(
                                theme,
                                tabIconColorConfig[onglet.type] || 'grey'
                              )}
                            />
                          </View>
                          <Text
                            numberOfLines={1}
                            style={{ flex: 1, fontFamily: police(POLICES.texte), fontSize: 13.5 }}
                          >
                            {onglet.title}
                          </Text>
                        </Pressable>
                        {onglet.isRemovable ? (
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t('workspace.closeTab', { title: onglet.title })}
                            onPress={() => fermerOnglet(groupe, onglet.id)}
                            style={{
                              width: 34,
                              height: 34,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icone nom="x" taille={14} couleur={theme.colors.grey} />
                          </Pressable>
                        ) : null}
                      </View>
                    )
                  })}
                </View>
              ))}
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setOuvert(false)
                ouvrirNouvelOnglet(undefined, { autoRedirect: true })
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 40,
                marginTop: 6,
                borderRadius: 14,
                backgroundColor: verre.actif,
              }}
            >
              <Icone nom="plus" taille={15} />
              <Text style={{ fontFamily: police(POLICES.titre), fontSize: 13.5 }}>
                {t('tabs.new')}
              </Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  )
}

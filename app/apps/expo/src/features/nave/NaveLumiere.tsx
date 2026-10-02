import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Icone } from '~features/empreinte/icones'
import { POLICES, Surtitre, police, styleVerre, useVerre } from '~features/empreinte/lumiere'
import { useResourceAccess } from '~features/resources/resourceAccess'
import type { ResourceLanguage } from '~helpers/databaseTypes'
import { localQueryOptions } from '~helpers/queryOptions'
import { useTheme } from '~themes/ThemeProvider'
import type { AnalyseNave } from './analyseNave'

const RUBRIQUES_VISIBLES = 10

/** Bouton discret en verre (pilule). */
export function PiluleNave({
  libelle,
  icone,
  onPress,
  actif = false,
}: {
  libelle: string
  icone?: React.ComponentProps<typeof Icone>['nom']
  onPress: () => void
  actif?: boolean
}) {
  const verre = useVerre()
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styleVerre(verre, 16, false),
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          height: 32,
          paddingHorizontal: 13,
          backgroundColor: actif ? verre.actif : verre.fond,
        },
      ]}
    >
      {icone ? <Icone nom={icone} taille={14} /> : null}
      <Text style={{ fontFamily: police(POLICES.titre), fontSize: 13 }}>{libelle}</Text>
    </Pressable>
  )
}

/** « En résumé » : les rubriques dans l'ordre, chacune ouvrant son premier passage. */
export function ResumeNave({
  analyse,
  onPassage,
}: {
  analyse: AnalyseNave
  onPassage: (passage: string) => void
}) {
  const theme = useTheme()
  const verre = useVerre()
  const [toutVoir, setToutVoir] = useState(false)
  const { rubriques, totalReferences } = analyse
  if (rubriques.length < 2) return null
  const visibles = toutVoir ? rubriques : rubriques.slice(0, RUBRIQUES_VISIBLES)

  return (
    <View style={[styleVerre(verre, 22), { padding: 18, gap: 10 }]}>
      <Surtitre>En résumé</Surtitre>
      <Text style={{ fontFamily: police(POLICES.texte), fontSize: 13.5, color: theme.colors.grey }}>
        {`${rubriques.length} rubriques · ${totalReferences} passages bibliques`}
      </Text>
      <View style={{ gap: 2 }}>
        {visibles.map((rubrique, index) => (
          <Pressable
            key={`${index}-${rubrique.intitule}`}
            accessibilityRole="button"
            disabled={!rubrique.premierPassage}
            onPress={() => rubrique.premierPassage && onPassage(rubrique.premierPassage)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: 12,
              paddingVertical: 7,
              paddingHorizontal: 8,
              marginHorizontal: -8,
              borderRadius: 10,
              backgroundColor: pressed ? verre.doux : 'transparent',
            })}
          >
            <Text
              style={{
                fontFamily: police(POLICES.mono),
                fontSize: 11.5,
                color: theme.colors.grey,
                width: 22,
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </Text>
            <Text
              style={{
                flex: 1,
                fontFamily: police(POLICES.lecture),
                fontSize: 15.5,
                lineHeight: 22,
                color: theme.colors.default,
              }}
            >
              {rubrique.intitule}
            </Text>
            <Text
              style={{ fontFamily: police(POLICES.mono), fontSize: 11.5, color: theme.colors.grey }}
            >
              {rubrique.references}
            </Text>
          </Pressable>
        ))}
      </View>
      {rubriques.length > RUBRIQUES_VISIBLES ? (
        <View style={{ flexDirection: 'row' }}>
          <PiluleNave
            libelle={toutVoir ? 'Réduire' : `Tout voir (${rubriques.length})`}
            onPress={() => setToutVoir(valeur => !valeur)}
          />
        </View>
      ) : null}
    </View>
  )
}

/** Renvois vers d'autres thèmes, cités dans le texte. */
export function VoirAussiNave({
  voirAussi,
  onTheme,
}: {
  voirAussi: AnalyseNave['voirAussi']
  onTheme: (cle: string, nom: string) => void
}) {
  if (!voirAussi.length) return null
  return (
    <View style={{ gap: 10 }}>
      <Surtitre>Voir aussi</Surtitre>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {voirAussi.map(theme => (
          <PiluleNave
            key={theme.cle}
            libelle={theme.nom}
            icone="tag"
            onPress={() => onTheme(theme.cle, theme.nom)}
          />
        ))}
      </View>
    </View>
  )
}

const LETTRES = 'abcdefghijklmnopqrstuvwxyz'.split('')

/** La liste alphabétique des thèmes, ouverte sur la lettre du thème lu. */
export function IndexAlphabetiqueNave({
  initiale,
  actuel,
  langue,
  onTheme,
  hauteurMax,
}: {
  initiale: string
  actuel: string
  langue: ResourceLanguage
  onTheme: (cle: string, nom: string) => void
  hauteurMax?: number
}) {
  const theme = useTheme()
  const verre = useVerre()
  const resources = useResourceAccess()
  const depart = useMemo(
    () => initiale.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().charAt(0) || 'a',
    [initiale]
  )
  const [lettre, setLettre] = useState(depart)
  const requete = useQuery({
    queryKey: ['nave-index', langue, lettre],
    queryFn: async () =>
      (await resources.nave.listByLetterPage(lettre, { limit: 500 }, langue)).topics,
    staleTime: Infinity,
    ...localQueryOptions,
  })

  return (
    <View style={[styleVerre(verre, 22), { padding: 16, gap: 12 }]}>
      <Surtitre>Thèmes de A à Z</Surtitre>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
        {LETTRES.map(l => (
          <Pressable
            key={l}
            accessibilityRole="button"
            accessibilityLabel={`Lettre ${l.toUpperCase()}`}
            onPress={() => setLettre(l)}
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: l === lettre ? verre.actif : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: police(l === lettre ? POLICES.monoMoyen : POLICES.mono),
                fontSize: 11.5,
                color: l === lettre ? theme.colors.default : theme.colors.grey,
              }}
            >
              {l.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView style={hauteurMax ? { maxHeight: hauteurMax } : undefined} nestedScrollEnabled>
        {requete.isPending ? (
          <Text
            style={{ fontFamily: police(POLICES.texte), fontSize: 13, color: theme.colors.grey }}
          >
            Chargement…
          </Text>
        ) : null}
        {requete.data?.map(sujet => {
          const estActuel = sujet.normalizedName === actuel
          return (
            <Pressable
              key={sujet.normalizedName}
              accessibilityRole="button"
              onPress={() => !estActuel && onTheme(sujet.normalizedName, sujet.name)}
              style={({ pressed }) => ({
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 9,
                backgroundColor: estActuel ? verre.actif : pressed ? verre.doux : 'transparent',
              })}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: police(estActuel ? POLICES.moyen : POLICES.texte),
                  fontSize: 14,
                  color: theme.colors.default,
                }}
              >
                {sujet.name}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

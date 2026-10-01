import React from 'react'
import { View } from 'react-native'
import type { Manifestation, Realite } from '@empreinte/core'
import Text from '~common/ui/Text'
import { useTheme } from '~themes/ThemeProvider'
import { colorWithOpacity } from '~themes/colorValues'
import { POLICES, police } from './lumiere'
import { LIBELLES_MANIFESTATION } from './registreEmpreinte'

const INCLINAISON = [{ perspective: 900 }, { rotateX: '52deg' }, { rotateZ: '-24deg' }] as const
const virgule = (n: number) => n.toFixed(2).replace('.', ',')

/** Valeur principale lue sur une manifestation (montant de préférence). */
function valeurPrincipale(m: Manifestation): string | undefined {
  const v = m.donnees.montant ?? Object.values(m.donnees)[0]
  if (v === undefined) return undefined
  if (typeof v === 'number')
    return `${v.toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(/ | /g, ' ')} €`
  return String(v)
}

function Feuille({ m, ecart, realite }: { m: Manifestation; ecart: boolean; realite: Realite }) {
  const theme = useTheme()
  const papier = m.type === 'physique-original' || m.type === 'physique-copie'
  const photo = m.type === 'photo' || m.type === 'scan'
  const lignes = Object.entries(papier ? m.donnees : m.donnees).slice(0, 4)
  return (
    <View
      style={{
        width: 250,
        height: 180,
        borderRadius: papier ? 3 : 10,
        padding: 14,
        gap: 5,
        backgroundColor: papier
          ? '#FFFEFA'
          : photo
            ? colorWithOpacity(theme.colors.reverse, 0.45)
            : colorWithOpacity(theme.colors.reverse, 0.88),
        borderWidth: papier ? 0 : 1,
        borderColor: ecart ? colorWithOpacity(theme.colors.quart, 0.55) : 'rgba(17,17,19,.10)',
        shadowColor: '#111113',
        shadowOpacity: papier ? 0.16 : 0.08,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 14 },
      }}
    >
      {papier ? (
        <>
          <Text
            style={{
              fontFamily: police(POLICES.lecture),
              fontSize: 10,
              color: '#1F1A16',
              letterSpacing: 0.4,
            }}
          >
            {(realite.referencesExternes[0]?.emetteur ?? realite.titre).toUpperCase()}
          </Text>
          <Text style={{ fontFamily: police(POLICES.lecture), fontSize: 9, color: '#4A4540' }}>
            {realite.referencesExternes[0]?.valeur ?? realite.id}
          </Text>
        </>
      ) : null}
      {photo ? (
        <View
          style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(17,17,19,.08)', borderRadius: 6 }}
        >
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              style={{
                flex: 1,
                borderBottomWidth: i < 3 ? 1 : 0,
                borderColor: 'rgba(17,17,19,.06)',
              }}
            />
          ))}
        </View>
      ) : (
        lignes.map(([k, v]) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontFamily: police(papier ? POLICES.lecture : POLICES.mono),
                fontSize: 9,
                color: '#4A4540',
              }}
            >
              {k}
            </Text>
            <Text
              style={{
                fontFamily: police(papier ? POLICES.lecture : POLICES.mono),
                fontSize: 9,
                color: ecart && k === 'montant' && !papier ? theme.colors.quart : '#1F1A16',
              }}
            >
              {String(v)}
            </Text>
          </View>
        ))
      )}
      {papier ? (
        <Text
          style={{
            marginTop: 'auto',
            fontFamily: police(POLICES.lecture),
            fontStyle: 'italic',
            fontSize: 17,
            color: '#2B3E8C',
            transform: [{ rotate: '-4deg' }],
          }}
        >
          {realite.referencesExternes[0]?.emetteur?.split(' ').pop() ?? '—'}
        </Text>
      ) : null}
    </View>
  )
}

/**
 * Vue éclatée de la maquette : chaque manifestation est une feuille inclinée, empilée
 * au-dessus de l'original. L'écart apparaît en rouge sur la feuille qui diverge.
 */
export default function VueEclatee({
  realite,
  divergentes,
}: {
  realite: Realite
  divergentes: Set<string>
}) {
  const theme = useTheme()
  // Ordre de la maquette : données en haut, photo au milieu, original en bas.
  const rang = (m: Manifestation) =>
    m.type === 'physique-original' ? 2 : m.type === 'photo' || m.type === 'scan' ? 1 : 0
  const tries = [...realite.manifestations].sort((a, b) => rang(a) - rang(b))
  // En haut : la manifestation numérique qui diverge (sinon la dernière lue).
  const lues = tries.filter(m => rang(m) === 0)
  const haut = lues.find(m => divergentes.has(m.id)) ?? lues[lues.length - 1]
  const couches = [
    ...(haut ? [haut] : []),
    ...tries.filter(m => rang(m) === 1).slice(-1),
    ...tries.filter(m => rang(m) === 2).slice(-1),
  ]
  const pas = 92
  const hauteur = 120 + pas * Math.max(couches.length - 1, 0) + 90
  return (
    <View
      style={{ height: hauteur, marginHorizontal: -16 }}
      accessibilityLabel="Vue éclatée des manifestations"
    >
      {couches.map((m, i) => {
        const ecart = divergentes.has(m.id)
        const gauche = i % 2 === 1
        const v = valeurPrincipale(m)
        return (
          <React.Fragment key={m.id}>
            <View
              style={{
                position: 'absolute',
                top: 6 + i * pas,
                left: 0,
                right: 0,
                alignItems: 'center',
                transform: [...INCLINAISON],
              }}
            >
              <Feuille m={m} ecart={ecart} realite={realite} />
            </View>
            <View
              style={{
                position: 'absolute',
                top: 10 + i * pas + (gauche ? -4 : 30),
                ...(gauche ? { left: 16 } : { right: 16 }),
                alignItems: gauche ? 'flex-start' : 'flex-end',
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: police(POLICES.monoMoyen),
                  fontSize: 10.5,
                  letterSpacing: 0.84,
                  color: ecart ? theme.colors.quart : theme.colors.default,
                }}
              >
                {`${(LIBELLES_MANIFESTATION[m.type] ?? m.type).toUpperCase()}${m.type === 'physique-original' ? ' PAPIER' : ''} · ${virgule(m.confiance)}`}
              </Text>
              <Text
                style={{
                  fontFamily: police(gauche ? POLICES.mono : POLICES.monoMoyen),
                  fontSize: gauche ? 11 : 14,
                  color: ecart
                    ? theme.colors.quart
                    : gauche
                      ? theme.colors.grey
                      : theme.colors.default,
                }}
              >
                {gauche
                  ? [m.fichier, m.empreinteFichier ? `${m.empreinteFichier.slice(0, 4)}…` : '']
                      .filter(Boolean)
                      .join(' · ') || v
                  : v}
              </Text>
            </View>
          </React.Fragment>
        )
      })}
    </View>
  )
}

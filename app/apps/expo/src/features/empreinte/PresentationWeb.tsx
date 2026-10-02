import React from 'react'
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native'
import Text from '~common/ui/Text'
import { useTheme } from '~themes/ThemeProvider'
import { colorWithOpacity } from '~themes/colorValues'
import { Icone, type NomIcone } from './icones'
import { Aurore, LogoEmpreinte, POLICES, police, styleVerre, useVerre } from './lumiere'

/** Destination choisie depuis la présentation : l'app s'ouvre puis va à cette page. */
export type DestinationEntree = '/' | '/plans' | '/daily-verse' | '/empreinte' | '/login'

const FONCTIONS: { icone: NomIcone; titre: string; texte: string; vers: DestinationEntree }[] = [
  {
    icone: 'book',
    titre: 'La Bible, en grand',
    texte:
      'Des dizaines de versions, le mode parallèle, les notes, les surlignages et les marque-pages.',
    vers: '/',
  },
  {
    icone: 'hash',
    titre: 'Lexique Strong',
    texte: 'Chaque mot relié à son original hébreu ou grec, avec sa concordance complète.',
    vers: '/',
  },
  {
    icone: 'layers',
    titre: 'Réalités',
    texte:
      'Photos, lieux et objets réels reliés aux versets : ce que le texte touche dans le monde.',
    vers: '/empreinte',
  },
  {
    icone: 'cal',
    titre: 'Plans de lecture',
    texte: 'Des parcours par thèmes pour avancer chaque jour, à votre rythme.',
    vers: '/plans',
  },
  {
    icone: 'sun',
    titre: 'Verset du jour',
    texte: 'Un verset chaque matin, à méditer, partager ou mettre en image.',
    vers: '/daily-verse',
  },
  {
    icone: 'headph',
    titre: 'Bible audio',
    texte: 'Écoutez les chapitres, réglez la vitesse, programmez une minuterie.',
    vers: '/',
  },
  {
    icone: 'compare',
    titre: 'Comparer',
    texte: 'Mettez plusieurs traductions côte à côte pour saisir chaque nuance.',
    vers: '/',
  },
  {
    icone: 'download',
    titre: 'Hors ligne',
    texte: 'Téléchargez vos Bibles et ressources pour lire partout, même sans réseau.',
    vers: '/',
  },
]

function Bouton({
  children,
  onPress,
  plein = false,
}: {
  children: string
  onPress: () => void
  plein?: boolean
}) {
  const theme = useTheme()
  const v = useVerre()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[
        plein ? { backgroundColor: theme.colors.default } : styleVerre(v, 24, false),
        { height: 48, paddingHorizontal: 22, borderRadius: 24, justifyContent: 'center' },
      ]}
    >
      <Text
        style={{
          fontFamily: police(POLICES.titre),
          fontSize: 15,
          color: plein ? theme.colors.reverse : theme.colors.default,
        }}
      >
        {children}
      </Text>
    </Pressable>
  )
}

function Micro({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  return (
    <Text
      style={{
        fontFamily: police(POLICES.monoMoyen),
        fontSize: 11,
        letterSpacing: 1.3,
        textTransform: 'uppercase',
        color: theme.colors.grey,
      }}
    >
      {children}
    </Text>
  )
}

/** Page de présentation web, affichée à l'arrivée avant d'entrer dans l'app. */
export default function PresentationWeb({
  onEntrer,
}: {
  onEntrer: (vers?: DestinationEntree) => void
}) {
  const theme = useTheme()
  const v = useVerre()
  const { width } = useWindowDimensions()
  const large = width >= 900
  const moyen = width >= 600
  const gouttiere = large ? 48 : 16
  const colonnes = large ? 4 : moyen ? 2 : 1
  const gris = theme.colors.grey

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.lightGrey }}>
      <Aurore />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={{ width: '100%', maxWidth: 1200, alignSelf: 'center' }}>
          {/* Navigation */}
          <View
            style={[
              styleVerre(v, 28),
              {
                marginHorizontal: gouttiere,
                marginTop: 16,
                height: 60,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 18,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <LogoEmpreinte taille={24} />
              <Text style={{ fontFamily: police(POLICES.gras), fontSize: 18 }}>Empreinte</Text>
            </View>
            {large && (
              <View style={{ flexDirection: 'row', gap: 22, marginLeft: 18 }}>
                {(
                  [
                    ['Bible', '/'],
                    ['Plans', '/plans'],
                    ['Verset du jour', '/daily-verse'],
                    ['Réalités', '/empreinte'],
                  ] as const
                ).map(([nom, vers]) => (
                  <Pressable key={nom} onPress={() => onEntrer(vers)} accessibilityRole="link">
                    <Text style={{ fontFamily: police(POLICES.moyen), fontSize: 14, color: gris }}>
                      {nom}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            <View style={{ flex: 1 }} />
            {moyen && (
              <Pressable onPress={() => onEntrer('/login')} accessibilityRole="link">
                <Text style={{ fontFamily: police(POLICES.moyen), fontSize: 14 }}>Se connecter</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => onEntrer()}
              accessibilityRole="button"
              style={{
                height: 38,
                paddingHorizontal: 16,
                borderRadius: 19,
                backgroundColor: theme.colors.default,
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14, color: theme.colors.reverse }}>
                Ouvrir l’app
              </Text>
            </Pressable>
          </View>

          {/* Accroche */}
          <View
            style={{
              marginHorizontal: gouttiere,
              marginTop: large ? 72 : 40,
              flexDirection: large ? 'row' : 'column',
              alignItems: large ? 'center' : 'stretch',
              gap: 40,
            }}
          >
            <View style={{ flex: large ? 1.2 : undefined, gap: 20 }}>
              <Micro>La Bible, lue dans le réel</Micro>
              <Text
                style={{
                  fontFamily: police(POLICES.gras),
                  fontSize: large ? 64 : 40,
                  lineHeight: (large ? 64 : 40) * 1.05,
                  letterSpacing: -1.6,
                }}
              >
                La Parole,{'\n'}et la trace qu’elle laisse.
              </Text>
              <Text
                style={{
                  fontFamily: police(POLICES.texte),
                  fontSize: 18,
                  lineHeight: 27,
                  color: gris,
                  maxWidth: 560,
                }}
              >
                Empreinte réunit la lecture de la Bible, l’étude des mots originaux et les réalités
                du monde qu’elle décrit : lieux, photos, objets. Gratuit et sans publicité.
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                <Bouton plein onPress={() => onEntrer('/')}>
                  Lire la Bible
                </Bouton>
                <Bouton onPress={() => onEntrer('/empreinte')}>Découvrir les réalités</Bouton>
              </View>
            </View>

            {/* Carte verset */}
            <View style={{ flex: large ? 1 : undefined }}>
              <View
                style={[
                  styleVerre(v, 32),
                  { padding: large ? 32 : 24, gap: 18, transform: [{ rotate: large ? '-1.5deg' : '0deg' }] },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icone nom="sun" taille={16} couleur={gris} />
                  <Micro>Verset du jour</Micro>
                </View>
                <Text
                  style={{
                    fontFamily: police(POLICES.lecture),
                    fontSize: large ? 24 : 20,
                    lineHeight: (large ? 24 : 20) * 1.45,
                  }}
                >
                  « Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconque
                  croit en lui ne périsse point, mais qu’il ait la vie éternelle. »
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>Jean 3:16</Text>
                  <Pressable
                    onPress={() => onEntrer('/daily-verse')}
                    accessibilityRole="link"
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                  >
                    <Text style={{ fontFamily: police(POLICES.moyen), fontSize: 13, color: gris }}>
                      Voir le verset du jour
                    </Text>
                    <Icone nom="fwd" taille={14} couleur={gris} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* Fonctions */}
          <View style={{ marginHorizontal: gouttiere, marginTop: large ? 96 : 56, gap: 20 }}>
            <Micro>Tout ce qu’il faut pour lire et comprendre</Micro>
            <Text
              style={{
                fontFamily: police(POLICES.gras),
                fontSize: large ? 36 : 28,
                letterSpacing: -0.8,
              }}
            >
              Une seule app, toute l’étude biblique.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
              {FONCTIONS.map(f => (
                <View key={f.titre} style={{ width: `${100 / colonnes}%`, padding: 8 }}>
                  <Pressable
                    onPress={() => onEntrer(f.vers)}
                    accessibilityRole="link"
                    style={[styleVerre(v, 24), { padding: 20, gap: 12, minHeight: 170 }]}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colorWithOpacity(theme.colors.default, 0.06),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icone nom={f.icone} taille={19} />
                    </View>
                    <Text style={{ fontFamily: police(POLICES.titre), fontSize: 16 }}>{f.titre}</Text>
                    <Text
                      style={{
                        fontFamily: police(POLICES.texte),
                        fontSize: 14,
                        lineHeight: 20,
                        color: gris,
                      }}
                    >
                      {f.texte}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/* Réalités */}
          <View
            style={{
              marginHorizontal: gouttiere,
              marginTop: large ? 80 : 48,
              borderRadius: 32,
              backgroundColor: theme.colors.default,
              padding: large ? 48 : 28,
              flexDirection: large ? 'row' : 'column',
              gap: 28,
              alignItems: large ? 'center' : 'stretch',
            }}
          >
            <View style={{ flex: large ? 1 : undefined, gap: 14 }}>
              <Text
                style={{
                  fontFamily: police(POLICES.monoMoyen),
                  fontSize: 11,
                  letterSpacing: 1.3,
                  textTransform: 'uppercase',
                  color: colorWithOpacity(theme.colors.reverse, 0.6),
                }}
              >
                Réalités
              </Text>
              <Text
                style={{
                  fontFamily: police(POLICES.gras),
                  fontSize: large ? 36 : 26,
                  letterSpacing: -0.8,
                  color: theme.colors.reverse,
                }}
              >
                Capturez ce que vous voyez. Reliez-le au texte.
              </Text>
              <Text
                style={{
                  fontFamily: police(POLICES.texte),
                  fontSize: 16,
                  lineHeight: 24,
                  color: colorWithOpacity(theme.colors.reverse, 0.7),
                }}
              >
                Une photo d’un lieu, d’un objet, d’une plante : Empreinte la situe, la vérifie et la
                rattache aux versets qui en parlent.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, flex: large ? 1 : undefined }}>
              {(
                [
                  ['camera', 'Capturer'],
                  ['pin', 'Situer'],
                  ['shield', 'Vérifier'],
                  ['link', 'Relier aux versets'],
                ] as const
              ).map(([icone, nom]) => (
                <View
                  key={nom}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    height: 44,
                    paddingHorizontal: 16,
                    borderRadius: 22,
                    backgroundColor: colorWithOpacity(theme.colors.reverse, 0.1),
                  }}
                >
                  <Icone nom={icone} taille={17} couleur={theme.colors.reverse} />
                  <Text style={{ fontFamily: police(POLICES.moyen), fontSize: 14, color: theme.colors.reverse }}>
                    {nom}
                  </Text>
                </View>
              ))}
              <View style={{ width: '100%', marginTop: 8 }}>
                <Pressable
                  onPress={() => onEntrer('/empreinte')}
                  accessibilityRole="button"
                  style={{
                    alignSelf: 'flex-start',
                    height: 48,
                    paddingHorizontal: 22,
                    borderRadius: 24,
                    backgroundColor: theme.colors.reverse,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: police(POLICES.titre), fontSize: 15 }}>Voir les réalités</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Appareils */}
          <View style={{ marginHorizontal: gouttiere, marginTop: large ? 80 : 48, alignItems: 'center', gap: 14 }}>
            <Micro>Partout avec vous</Micro>
            <Text
              style={{
                fontFamily: police(POLICES.gras),
                fontSize: large ? 36 : 26,
                letterSpacing: -0.8,
                textAlign: 'center',
              }}
            >
              Sur le web, votre téléphone et votre tablette.
            </Text>
            <Text style={{ fontFamily: police(POLICES.texte), fontSize: 16, color: gris, textAlign: 'center', maxWidth: 560 }}>
              Vos notes, surlignages et plans vous suivent d’un appareil à l’autre une fois connecté.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              <Bouton plein onPress={() => onEntrer()}>
                Ouvrir Empreinte
              </Bouton>
              <Bouton onPress={() => onEntrer('/login')}>Créer un compte</Bouton>
            </View>
          </View>

          {/* Pied de page */}
          <View
            style={{
              marginHorizontal: gouttiere,
              marginTop: large ? 80 : 48,
              paddingTop: 24,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              gap: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <LogoEmpreinte taille={18} />
              <Text style={{ fontFamily: police(POLICES.gras), fontSize: 15 }}>Empreinte</Text>
            </View>
            <Text style={{ fontFamily: police(POLICES.texte), fontSize: 13, color: gris, lineHeight: 19 }}>
              La Bible, lue dans le réel.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

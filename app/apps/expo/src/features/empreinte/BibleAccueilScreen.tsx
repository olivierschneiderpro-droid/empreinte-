import { useAtomValue, useSetAtom } from 'jotai'
import { getDefaultStore } from 'jotai/vanilla'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView } from 'react-native'
import { sections } from '~assets/bible_versions/books-desc'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { commandPaletteOpenAtom } from '~features/app-switcher/commandPalette/state'
import { usePushRouteOnce } from '~navigation/usePushRouteOnce'
import { activeTabIndexAtom, tabsAtomsAtom, type BibleTab } from '~state/tabs'
import { compagnonAtom } from './compagnon'
import { POLICES, police } from './lumiere'
import { useAllerALaBible, useOuvrirDansLaBible } from './ouvrirDansLaBible'
import { CarteImagee, Rangee, Vedette } from './vitrine/Rangee'
import type { NomScene } from './vitrine/Scene'
import { Volet } from './vitrine/Volet'

/** La lecture en cours : l'onglet Bible actif, sinon le premier (sans en créer pendant l'affichage). */
const lectureEnCours = () => {
  const store = getDefaultStore()
  const onglets = store.get(tabsAtomsAtom).map(onglet => store.get(onglet))
  const actif = onglets[store.get(activeTabIndexAtom)]
  const bible = (
    actif?.type === 'bible' ? actif : onglets.find(onglet => onglet.type === 'bible')
  ) as BibleTab | undefined
  return bible?.data ?? null
}

/** Une illustration par famille de livres (les livres canoniques seulement). */
const FAMILLES: { index: number; scene: NomScene }[] = [
  { index: 0, scene: 'desert' },
  { index: 1, scene: 'ville' },
  { index: 2, scene: 'nuit' },
  { index: 3, scene: 'montagne' },
  { index: 4, scene: 'riviere' },
  { index: 7, scene: 'chemin' },
  { index: 8, scene: 'mer' },
  { index: 9, scene: 'rouleau' },
  { index: 10, scene: 'lampe' },
  { index: 11, scene: 'lumiere' },
]

export const sceneDuLivre = (numero: number): NomScene =>
  FAMILLES.find(famille => sections[famille.index]?.data.some(book => book.Numero === numero))
    ?.scene ?? 'rouleau'

/**
 * Empreinte : l'accueil de la Bible, en vitrine. La lecture en cours en grand, les portes
 * d'entrée sur une rangée, puis les livres rangés par famille, chacune sur sa rangée.
 */
export default function BibleAccueilScreen() {
  const { t } = useTranslation()
  const pushRoute = usePushRouteOnce()
  const allerALaBible = useAllerALaBible()
  const ouvrirDansLaBible = useOuvrirDansLaBible()
  const ouvrirRecherche = useSetAtom(commandPaletteOpenAtom)
  const setCompagnon = useSetAtom(compagnonAtom)
  useAtomValue(tabsAtomsAtom)
  const enCours = lectureEnCours()
  const [livreChoisi, setLivreChoisi] = useState<{
    numero: number
    nom: string
    chapitres: number
  } | null>(null)

  const portes: { scene: NomScene; titre: string; texte: string; ouvrir: () => void }[] = [
    ...(Platform.OS === 'web' && enCours
      ? [
          {
            scene: 'rouleau' as NomScene,
            titre: t('compagnon.twoReadings'),
            texte: t('bibleAccueil.twoReadingsShort'),
            ouvrir: () => {
              setCompagnon({
                type: 'bible',
                book: enCours.selectedBook.Numero,
                chapter: enCours.selectedChapter,
                version: enCours.selectedVersion,
              })
              allerALaBible()
            },
          },
        ]
      : []),
    {
      scene: 'nuit',
      titre: t('audio.title'),
      texte: t('bibleAccueil.listenShort'),
      ouvrir: () => pushRoute({ pathname: '/audio' }),
    },
    {
      scene: 'montagne',
      titre: t('videos.title'),
      texte: t('bibleAccueil.videosShort'),
      ouvrir: () => pushRoute({ pathname: '/(library)/passage-media' }),
    },
    {
      scene: 'chemin',
      titre: t('Plans'),
      texte: t('bibleAccueil.plansShort'),
      ouvrir: () => pushRoute({ pathname: '/plans' }),
    },
    {
      scene: 'lampe',
      titre: t('livres.title'),
      texte: t('bibleAccueil.booksShort'),
      ouvrir: () => pushRoute({ pathname: '/livres' }),
    },
    {
      scene: 'aube',
      titre: t('dailyReading.title'),
      texte: t('bibleAccueil.verseShort'),
      ouvrir: () => pushRoute({ pathname: '/daily-verse' }),
    },
    {
      scene: 'ville',
      titre: t('home.desktop.timeline'),
      texte: t('bibleAccueil.timelineShort'),
      ouvrir: () => pushRoute({ pathname: '/(library)/timeline-home' }),
    },
  ]

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('bibleAccueil.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Box className="px-[24px] gap-[30px] w-full max-w-[1300px] self-center">
          {enCours ? (
            <Vedette
              scene={sceneDuLivre(enCours.selectedBook.Numero)}
              surtitre={t('bibleAccueil.resume')}
              titre={`${t(enCours.selectedBook.Nom)} ${enCours.selectedChapter}`}
              texte={enCours.selectedVersion}
              action={t('bibleAccueil.read')}
              onPress={allerALaBible}
            />
          ) : (
            <Vedette
              scene="chemin"
              surtitre={t('bibleAccueil.start')}
              titre={t('bibleAccueil.startTitle')}
              texte={t('bibleAccueil.startText')}
              action={t('bibleAccueil.read')}
              onPress={() => ouvrirDansLaBible({ book: 43, chapter: 1 })}
            />
          )}

          <LinkBox
            onPress={() => ouvrirRecherche(true)}
            accessibilityLabel={t('bibleAccueil.search')}
            className="flex-row items-center gap-[12px] rounded-full px-[18px] h-[52px] bg-reverse"
          >
            <FeatherIcon name="search" size={18} color="grey" />
            <Text className="text-grey text-[14px] flex-1">{t('bibleAccueil.searchHint')}</Text>
          </LinkBox>

          <Rangee titre={t('bibleAccueil.doors')}>
            {portes.map(porte => (
              <CarteImagee
                key={porte.titre}
                scene={porte.scene}
                titre={porte.titre}
                sousTitre={porte.texte}
                largeur={210}
                hauteur={124}
                onPress={porte.ouvrir}
              />
            ))}
          </Rangee>

          {FAMILLES.map(({ index, scene }) => {
            const section = sections[index]
            if (!section) return null
            return (
              <Rangee
                key={index}
                titre={t(section.title)}
                sousTitre={t('bibleAccueil.booksCount', { count: section.data.length })}
              >
                {section.data.map(book => (
                  <CarteImagee
                    key={book.Numero}
                    scene={scene}
                    titre={t(book.Nom)}
                    sousTitre={t('bibleAccueil.chaptersCount', { count: book.Chapitres })}
                    largeur={176}
                    hauteur={112}
                    onPress={() =>
                      setLivreChoisi({
                        numero: book.Numero,
                        nom: t(book.Nom),
                        chapitres: book.Chapitres,
                      })
                    }
                    titreSurImage
                    surImage={
                      <Text
                        className="text-[white]"
                        style={{
                          fontFamily: police(POLICES.titre),
                          fontSize: 18,
                          textShadowColor: 'rgba(0,0,0,0.45)',
                          textShadowRadius: 8,
                        }}
                        numberOfLines={2}
                      >
                        {t(book.Nom)}
                      </Text>
                    }
                  />
                ))}
              </Rangee>
            )
          })}
        </Box>
      </ScrollView>

      {livreChoisi ? (
        <Volet
          titre={t('audio.chooseChapter', { book: livreChoisi.nom })}
          onFermer={() => setLivreChoisi(null)}
        >
          <HStack className="flex-wrap gap-[8px]">
            {Array.from({ length: livreChoisi.chapitres }, (_, i) => i + 1).map(chapter => (
              <LinkBox
                key={chapter}
                onPress={() => {
                  setLivreChoisi(null)
                  ouvrirDansLaBible({ book: livreChoisi.numero, chapter })
                }}
                className="w-[48px] h-[48px] rounded-[14px] items-center justify-center bg-light-grey"
              >
                <Text style={{ fontFamily: police(POLICES.points), fontSize: 18 }}>{chapter}</Text>
              </LinkBox>
            ))}
          </HStack>
        </Volet>
      ) : null}
    </Box>
  )
}

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
import { Pochette } from '~features/audio/Pochette'
import { commandPaletteOpenAtom } from '~features/app-switcher/commandPalette/state'
import { usePushRouteOnce } from '~navigation/usePushRouteOnce'
import { activeTabIndexAtom, tabsAtomsAtom, type BibleTab } from '~state/tabs'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { compagnonAtom } from './compagnon'
import { useAllerALaBible, useOuvrirDansLaBible } from './ouvrirDansLaBible'

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

function Entree({
  icone,
  titre,
  texte,
  couleur,
  onPress,
}: {
  icone: React.ComponentProps<typeof FeatherIcon>['name']
  titre: string
  texte: string
  couleur: string
  onPress: () => void
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={titre}
      className="flex-1 min-w-[220px] rounded-[22px] p-[18px] gap-[10px] bg-reverse"
    >
      <Box
        className="w-[42px] h-[42px] rounded-[14px] items-center justify-center"
        style={{ backgroundColor: `${couleur}1A` }}
      >
        <FeatherIcon name={icone} size={20} color={couleur} />
      </Box>
      <Text className="font-bold text-[15px]">{titre}</Text>
      <Text className="text-grey text-[13px] leading-[19px]">{texte}</Text>
    </LinkBox>
  )
}

/**
 * Empreinte : la page d'accueil de la Bible. On n'arrive pas sur un passage déjà ouvert : on
 * reprend sa lecture, on cherche un passage, on choisit un livre, ou l'on entre par une autre
 * porte (deux lectures, écouter, vidéos, plans, verset du jour, chronologie).
 */
export default function BibleAccueilScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const titre = resolveFontFamily(theme.fontFamily.title)
  const pushRoute = usePushRouteOnce()
  const allerALaBible = useAllerALaBible()
  const ouvrirDansLaBible = useOuvrirDansLaBible()
  const ouvrirRecherche = useSetAtom(commandPaletteOpenAtom)
  const setCompagnon = useSetAtom(compagnonAtom)
  useAtomValue(tabsAtomsAtom)
  const enCours = lectureEnCours()
  const [livreChoisi, setLivreChoisi] = useState<number | null>(null)
  const testaments = [
    {
      titre: t('audio.oldTestament'),
      livres: sections.slice(0, 5).flatMap(section => section.data),
    },
    {
      titre: t('audio.newTestament'),
      livres: sections.slice(7, 12).flatMap(section => section.data),
    },
  ]

  return (
    <Box className="flex-1">
      <Header hasBackButton title={t('bibleAccueil.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Box className="px-[24px] gap-[28px] w-full max-w-[1300px] self-center">
          <HStack className="flex-wrap gap-[16px]">
            {enCours ? (
              <LinkBox
                onPress={allerALaBible}
                accessibilityLabel={t('bibleAccueil.resume')}
                className="flex-row items-center gap-[18px] rounded-[26px] p-[22px] flex-[2] min-w-[300px]"
                style={{ backgroundColor: '#112A4D' }}
              >
                <Pochette book={enCours.selectedBook.Numero} taille={96} />
                <Box className="flex-1 gap-[6px]">
                  <Text className="text-[white] text-[12px] font-bold uppercase tracking-[1.5px] opacity-[0.7]">
                    {t('bibleAccueil.resume')}
                  </Text>
                  <Text className="text-[white] text-[28px]" style={{ fontFamily: titre }}>
                    {`${t(enCours.selectedBook.Nom)} ${enCours.selectedChapter}`}
                  </Text>
                  <Text className="text-[white] text-[13px] opacity-[0.75]">
                    {enCours.selectedVersion}
                  </Text>
                </Box>
                <FeatherIcon name="arrow-right" size={22} color="white" />
              </LinkBox>
            ) : null}
            <LinkBox
              onPress={() => ouvrirRecherche(true)}
              accessibilityLabel={t('bibleAccueil.search')}
              className="flex-row items-center gap-[14px] rounded-[26px] p-[22px] flex-1 min-w-[260px] bg-reverse"
            >
              <Box className="w-[48px] h-[48px] rounded-[16px] items-center justify-center bg-light-grey">
                <FeatherIcon name="search" size={22} />
              </Box>
              <Box className="flex-1 gap-[4px]">
                <Text className="font-bold text-[16px]">{t('bibleAccueil.search')}</Text>
                <Text className="text-grey text-[13px]">{t('bibleAccueil.searchHint')}</Text>
              </Box>
            </LinkBox>
          </HStack>

          <HStack className="flex-wrap gap-[14px]">
            {Platform.OS === 'web' && enCours ? (
              <Entree
                icone="columns"
                titre={t('compagnon.twoReadings')}
                texte={t('bibleAccueil.twoReadingsText')}
                couleur="#1D4ED8"
                onPress={() => {
                  setCompagnon({
                    type: 'bible',
                    book: enCours.selectedBook.Numero,
                    chapter: enCours.selectedChapter,
                    version: enCours.selectedVersion,
                  })
                  allerALaBible()
                }}
              />
            ) : null}
            <Entree
              icone="headphones"
              titre={t('audio.title')}
              texte={t('bibleAccueil.listenText')}
              couleur="#C2410C"
              onPress={() => pushRoute({ pathname: '/audio' })}
            />
            <Entree
              icone="play-circle"
              titre={t('videos.title')}
              texte={t('bibleAccueil.videosText')}
              couleur="#7C3AED"
              onPress={() => pushRoute({ pathname: '/(library)/passage-media' })}
            />
            <Entree
              icone="calendar"
              titre={t('Plans')}
              texte={t('bibleAccueil.plansText')}
              couleur="#0F766E"
              onPress={() => pushRoute({ pathname: '/plans' })}
            />
            <Entree
              icone="sun"
              titre={t('dailyReading.title')}
              texte={t('bibleAccueil.verseText')}
              couleur="#A16207"
              onPress={() => pushRoute({ pathname: '/daily-verse' })}
            />
            <Entree
              icone="clock"
              titre={t('home.desktop.timeline')}
              texte={t('bibleAccueil.timelineText')}
              couleur="#334155"
              onPress={() => pushRoute({ pathname: '/(library)/timeline-home' })}
            />
          </HStack>

          {testaments.map(testament => (
            <Box key={testament.titre} className="gap-[14px]">
              <Text className="text-[20px]" style={{ fontFamily: titre }}>
                {testament.titre}
              </Text>
              <Box className="flex-row flex-wrap gap-[10px]">
                {testament.livres.map(book => (
                  <LinkBox
                    key={book.Numero}
                    onPress={() => setLivreChoisi(livreChoisi === book.Numero ? null : book.Numero)}
                    accessibilityLabel={t(book.Nom)}
                    accessibilityState={{ expanded: livreChoisi === book.Numero }}
                  >
                    <Pochette book={book.Numero} taille={110} />
                  </LinkBox>
                ))}
              </Box>
              {livreChoisi && testament.livres.some(book => book.Numero === livreChoisi) ? (
                <Box className="rounded-[20px] p-[18px] bg-reverse gap-[12px]">
                  <Text className="font-bold text-[15px]">
                    {t('audio.chooseChapter', {
                      book: t(
                        testament.livres.find(book => book.Numero === livreChoisi)?.Nom ?? ''
                      ),
                    })}
                  </Text>
                  <Box className="flex-row flex-wrap gap-[8px]">
                    {Array.from(
                      {
                        length:
                          testament.livres.find(book => book.Numero === livreChoisi)?.Chapitres ??
                          0,
                      },
                      (_, i) => i + 1
                    ).map(chapter => (
                      <LinkBox
                        key={chapter}
                        onPress={() => ouvrirDansLaBible({ book: livreChoisi, chapter })}
                        className="w-[44px] h-[44px] rounded-[12px] items-center justify-center bg-light-grey"
                      >
                        <Text className="text-[14px] font-bold">{chapter}</Text>
                      </LinkBox>
                    ))}
                  </Box>
                </Box>
              ) : null}
            </Box>
          ))}
        </Box>
      </ScrollView>
    </Box>
  )
}

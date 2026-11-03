import { useRouter, useSegments } from 'expo-router'
import { useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { ficheLivre } from '~features/livres/livres'
import { trouverVideo, useLangueVideos } from '~features/videos/catalogueVideos'
import { activeTabIndexAtom, tabsAtom, type BibleTab } from '~state/tabs'
import { compagnonAtom, espaceAGaucheAtom, espaceAgrandiAtom, type Compagnon } from './compagnon'

type Icone = React.ComponentProps<typeof FeatherIcon>['name']

/** L'outil d'étude ouvert depuis le texte (mot Strong, dictionnaire, thème, commentaire). */
const outilDEtude = (segments: string[]): string | null => {
  if (segments[0] === 'strong') return 'espace.tool.strong'
  if (segments[0] === '(commentary)') return 'espace.tool.commentary'
  if (segments[0] === '(timeline-search)') return 'espace.tool.timeline'
  if (segments[0] === '(explore)') {
    if (segments[1]?.startsWith('dictionar') || segments[1]?.startsWith('dictionnary'))
      return 'espace.tool.dictionary'
    if (segments[1]?.startsWith('nave')) return 'espace.tool.nave'
    if (segments[1]?.startsWith('concordance')) return 'espace.tool.concordance'
    return 'espace.tool.study'
  }
  return null
}

function Bouton({
  icone,
  libelle,
  onPress,
}: {
  icone: Icone
  libelle: string
  onPress: () => void
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={libelle}
      className="w-[32px] h-[32px] rounded-full items-center justify-center bg-light-grey"
    >
      <FeatherIcon name={icone} size={15} />
    </LinkBox>
  )
}

/**
 * Empreinte · La barre de l'Espace d'étude, la même quel que soit ce qui est ouvert : le
 * fil (« Bible › Jean 3 › Vidéo »), les volets, et les commandes du cadre (échanger les
 * côtés, agrandir, fermer).
 */
export default function BarreEspace({ etudeOuverte }: { etudeOuverte?: boolean }) {
  const { t } = useTranslation()
  const router = useRouter()
  const segments = useSegments() as string[]
  const [compagnon, setCompagnon] = useAtom(compagnonAtom)
  const [aGauche, setAGauche] = useAtom(espaceAGaucheAtom)
  const [agrandi, setAgrandi] = useAtom(espaceAgrandiAtom)
  const onglets = useAtomValue(tabsAtom)
  const actif = useAtomValue(activeTabIndexAtom)
  const [langue] = useLangueVideos()
  const lecture = onglets[actif]?.type === 'bible' ? (onglets[actif] as BibleTab).data : null
  const outil = etudeOuverte ? outilDEtude(segments) : null

  // Choisir un volet ferme l'outil d'étude ouvert depuis le texte : un seul cadre à la fois.
  const choisir = (valeur: Compagnon) => {
    setCompagnon(valeur)
    if (etudeOuverte) router.navigate('/')
  }
  const fermer = () => {
    setAgrandi(false)
    if (etudeOuverte) router.navigate('/')
    else setCompagnon(null)
  }

  const volets: {
    cle: string
    libelle: string
    icone: Icone
    actif: boolean
    ouvrir: () => void
  }[] = [
    {
      cle: 'autour',
      libelle: t('compagnon.around'),
      icone: 'compass',
      actif: !outil && compagnon?.type === 'autour',
      ouvrir: () => choisir({ type: 'autour' }),
    },
    {
      cle: 'bible',
      libelle: t('compagnon.bibleTitle'),
      icone: 'book-open',
      actif: !outil && compagnon?.type === 'bible',
      ouvrir: () =>
        lecture
          ? choisir(
              compagnon?.type === 'bible'
                ? compagnon
                : {
                    type: 'bible',
                    book: lecture.selectedBook.Numero,
                    chapter: lecture.selectedChapter,
                    version: lecture.selectedVersion,
                  }
            )
          : undefined,
    },
  ]
  if (compagnon?.type === 'video')
    volets.push({
      cle: 'video',
      libelle: t('compagnon.videoTitle'),
      icone: 'play-circle',
      actif: !outil,
      ouvrir: () => choisir(compagnon),
    })
  if (compagnon?.type === 'livre')
    volets.push({
      cle: 'livre',
      libelle: ficheLivre(compagnon.id)?.titre ?? t('livres.title'),
      icone: 'book',
      actif: !outil,
      ouvrir: () => choisir(compagnon),
    })
  if (outil)
    volets.push({ cle: 'outil', libelle: t(outil), icone: 'search', actif: true, ouvrir: () => {} })

  const volet = volets.find(item => item.actif)
  const detail =
    !outil && compagnon?.type === 'video' ? trouverVideo(langue, compagnon.id)?.title : undefined
  const fil = [
    t('espace.bible'),
    lecture ? `${t(lecture.selectedBook.Nom)} ${lecture.selectedChapter}` : null,
    volet?.libelle,
    detail,
  ].filter(Boolean)

  return (
    <Box className="gap-[10px] px-[16px] pt-[14px] pb-[10px] border-b border-border">
      <HStack className="items-center gap-[8px]">
        <FeatherIcon name="layout" size={15} color="grey" />
        <Text className="flex-1 text-grey text-[12px]" numberOfLines={1}>
          {fil.join('  ›  ')}
        </Text>
        <Bouton icone="repeat" libelle={t('espace.swap')} onPress={() => setAGauche(!aGauche)} />
        <Bouton
          icone={agrandi ? 'minimize-2' : 'maximize-2'}
          libelle={agrandi ? t('espace.reduce') : t('espace.expand')}
          onPress={() => setAgrandi(!agrandi)}
        />
        <Bouton icone="x" libelle={t('compagnon.close')} onPress={fermer} />
      </HStack>
      <HStack className="items-center gap-[6px] flex-wrap">
        {volets.map(item => (
          <LinkBox
            key={item.cle}
            onPress={item.ouvrir}
            accessibilityLabel={item.libelle}
            accessibilityState={{ selected: item.actif }}
            className={`flex-row items-center gap-[6px] rounded-full px-[12px] h-[32px] max-w-[220px] ${
              item.actif ? 'bg-primary' : 'bg-light-grey'
            }`}
          >
            <FeatherIcon name={item.icone} size={14} color={item.actif ? 'reverse' : 'default'} />
            <Text
              className={`text-[12px] font-bold ${item.actif ? 'text-reverse' : ''}`}
              numberOfLines={1}
            >
              {item.libelle}
            </Text>
          </LinkBox>
        ))}
      </HStack>
    </Box>
  )
}

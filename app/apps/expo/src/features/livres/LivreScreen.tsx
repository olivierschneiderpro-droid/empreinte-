import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { LinkBox } from '~common/Link'
import Box, { HStack, TouchableBox } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { READING_TEXT_MAX_WIDTH } from '~common/readingLayout'
import { basculer, etatAudioAtom, formatTemps, jouerLibre } from '~features/audio/bibleAudio'
import { compagnonAtom } from '~features/empreinte/compagnon'
import { Icone } from '~features/empreinte/icones'
import { POLICES, police, styleVerre, useVerre } from '~features/empreinte/lumiere'
import { useAllerALaBible } from '~features/empreinte/ouvrirDansLaBible'
import type { RootState } from '~redux/modules/reducer'
import {
  decreaseSettingsFontSizeScale,
  increaseSettingsFontSizeScale,
  setSettingsLineHeight,
} from '~redux/modules/user/settings'
import { Couverture } from './Couverture'
import {
  ficheLivre,
  progressionLivresAtom,
  titreChapitre,
  useChapitre,
  useLivre,
  type Livre,
} from './livres'
import TexteLivre from './TexteLivre'

type Panneau = 'chapitres' | 'ecouter' | 'fiche' | 'aa' | null

/** Un bouton rond en verre, comme ceux de l'en-tête de la Bible. */
function BoutonVerre({
  libelle,
  onPress,
  children,
  desactive,
}: React.PropsWithChildren<{ libelle: string; onPress?: () => void; desactive?: boolean }>) {
  const verre = useVerre()
  return (
    <TouchableBox
      className="overflow-hidden border-continuous items-center justify-center"
      style={[styleVerre(verre, 22), { width: 44, height: 44, opacity: desactive ? 0.4 : 1 }]}
      onPress={desactive ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={libelle}
      accessibilityState={{ disabled: desactive }}
    >
      {children}
    </TouchableBox>
  )
}

/** Un volet qui s'ouvre par-dessus la lecture (chapitres, écoute, fiche, réglages). */
function Volet({
  titre,
  onFermer,
  children,
}: React.PropsWithChildren<{ titre: string; onFermer: () => void }>) {
  const { t } = useTranslation()
  const verre = useVerre()
  return (
    <Box className="absolute inset-0" style={{ zIndex: 20 }}>
      <TouchableBox
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(17,17,19,0.25)' }}
        onPress={onFermer}
        accessibilityLabel={t('compagnon.close')}
      />
      <Box
        className="self-center mt-[72px] w-full max-w-[720px] rounded-[26px] overflow-hidden bg-reverse"
        style={[styleVerre(verre, 26), { maxHeight: '78%' }]}
      >
        <HStack className="items-center justify-between px-[20px] pt-[16px] pb-[8px]">
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 17 }}>{titre}</Text>
          <LinkBox
            onPress={onFermer}
            accessibilityLabel={t('compagnon.close')}
            className="w-[34px] h-[34px] rounded-full items-center justify-center bg-light-grey"
          >
            <FeatherIcon name="x" size={16} />
          </LinkBox>
        </HStack>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 6 }}>
          {children}
        </ScrollView>
      </Box>
    </Box>
  )
}

function Chapitres({
  livre,
  numero,
  aller,
}: {
  livre: Livre
  numero: number
  aller: (n: number) => void
}) {
  const { t } = useTranslation()
  return (
    <Box className="flex-row flex-wrap gap-[8px]">
      {livre.chapitres.map((item, n) => (
        <LinkBox
          key={n}
          onPress={() => aller(n)}
          accessibilityState={{ selected: n === numero }}
          className={`flex-row items-center gap-[10px] rounded-[14px] px-[10px] py-[8px] w-[320px] max-w-full ${
            n === numero ? 'bg-primary' : 'bg-light-grey'
          }`}
        >
          <Text
            className={n === numero ? 'text-reverse' : ''}
            style={{ fontFamily: police(POLICES.points), fontSize: 18, minWidth: 28 }}
          >
            {n + 1}
          </Text>
          <Text
            className={`flex-1 text-[13px] ${n === numero ? 'text-reverse' : ''}`}
            numberOfLines={2}
          >
            {titreChapitre(item.titre, n, t('livres.part'))}
          </Text>
        </LinkBox>
      ))}
    </Box>
  )
}

function Ecouter({ id, livre }: { id: string; livre: Livre }) {
  const { t } = useTranslation()
  const fiche = ficheLivre(id)
  const etat = useAtomValue(etatAudioAtom)
  const retour = `/livre?id=${id}`
  const pistes = livre.audio.map(piste => ({
    titre: piste.titre,
    sousTitre: fiche?.titre ?? '',
    url: piste.url,
    retour,
  }))
  if (!pistes.length)
    return (
      <Text className="text-grey">
        {livre.audioEnCours ? t('livres.audioLoading') : t('livres.noAudio')}
      </Text>
    )
  const enCours = etat.libre?.pistes[0]?.retour === retour ? etat.libre.index : -1
  return (
    <>
      <Text className="text-grey text-[13px] mb-[8px]">
        {t('livres.readBy', { readers: livre.audio[0]?.lecteur || 'LibriVox' })}
      </Text>
      {livre.audio.map((piste, n) => (
        <LinkBox
          key={piste.url}
          onPress={() => jouerLibre(pistes, n)}
          accessibilityLabel={piste.titre}
          className={`flex-row items-center gap-[12px] rounded-[14px] px-[12px] py-[10px] ${
            n === enCours ? 'bg-light-grey' : ''
          }`}
        >
          <FeatherIcon
            name={n === enCours && etat.enLecture ? 'volume-2' : 'play'}
            size={16}
            color={n === enCours ? 'primary' : 'grey'}
          />
          <Text className={`flex-1 text-[14px] ${n === enCours ? 'font-bold' : ''}`}>
            {piste.titre}
          </Text>
          <Text className="text-grey text-[12px]">{formatTemps(piste.duree)}</Text>
        </LinkBox>
      ))}
    </>
  )
}

function Fiche({ id, livre }: { id: string; livre?: Livre }) {
  const { t } = useTranslation()
  const fiche = ficheLivre(id)
  if (!fiche) return null
  const audio = livre?.audio[0]
  const lien = (libelle: string, url: string) => (
    <LinkBox
      onPress={() => void Linking.openURL(url)}
      className="flex-row items-center gap-[8px] self-start"
    >
      <FeatherIcon name="external-link" size={14} color="primary" />
      <Text className="text-primary font-bold text-[14px]">{libelle}</Text>
    </LinkBox>
  )
  return (
    <Box className="gap-[14px]">
      <HStack className="gap-[18px] flex-wrap">
        <Couverture livre={fiche} largeur={110} />
        <Box className="flex-1 min-w-[220px] gap-[6px]">
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 22 }}>{fiche.titre}</Text>
          <Text className="text-grey text-[13px]">
            {`${fiche.auteur} · ${fiche.annee} · ${t(`livres.language.${fiche.langue}`)}`}
          </Text>
          <Text className="text-[14px] leading-[22px]">{fiche.resume}</Text>
        </Box>
      </HStack>
      <Text className="text-[14px] leading-[22px]">{t('livres.publicDomain')}</Text>
      {livre ? (
        <>
          <Text className="text-grey text-[13px]">
            {t('livres.sourceText', { title: livre.source.titre, number: livre.source.gutenberg })}
          </Text>
          {lien(t('livres.openGutenberg'), livre.source.url)}
          {audio ? lien(t('livres.openLibrivox'), audio.page) : null}
        </>
      ) : null}
      <Text className="text-grey text-[12px] leading-[18px]">{t('livres.sourceNote')}</Text>
    </Box>
  )
}

/** Les réglages de lecture, partagés avec la Bible. */
function Reglages() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { fontSizeScale, lineHeight } = useSelector((state: RootState) => state.user.bible.settings)
  return (
    <Box className="gap-[16px]">
      <HStack className="items-center gap-[12px]">
        <LinkBox
          onPress={() => dispatch(decreaseSettingsFontSizeScale())}
          accessibilityLabel={t('livres.smaller')}
          className="w-[48px] h-[44px] rounded-[14px] items-center justify-center bg-light-grey"
        >
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>A−</Text>
        </LinkBox>
        <Text className="text-grey text-[13px]">{`${100 + fontSizeScale * 10} %`}</Text>
        <LinkBox
          onPress={() => dispatch(increaseSettingsFontSizeScale())}
          accessibilityLabel={t('livres.larger')}
          className="w-[48px] h-[44px] rounded-[14px] items-center justify-center bg-light-grey"
        >
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 19 }}>A+</Text>
        </LinkBox>
      </HStack>
      <HStack className="gap-[8px] flex-wrap">
        {(['small', 'normal', 'large'] as const).map(choix => (
          <LinkBox
            key={choix}
            onPress={() => dispatch(setSettingsLineHeight(choix))}
            accessibilityState={{ selected: lineHeight === choix }}
            className={`rounded-full px-[14px] h-[34px] items-center justify-center ${
              lineHeight === choix ? 'bg-primary' : 'bg-light-grey'
            }`}
          >
            <Text className={`font-bold text-[13px] ${lineHeight === choix ? 'text-reverse' : ''}`}>
              {t(`livres.lineHeight.${choix}`)}
            </Text>
          </LinkBox>
        ))}
      </HStack>
      <Text className="text-grey text-[12px]">{t('livres.sharedSettings')}</Text>
    </Box>
  )
}

/**
 * Empreinte · Lire un livre au format de la Bible : la page entière pour le texte, une
 * pastille « Titre · chapitre » qui ouvre les chapitres, les flèches sur les côtés, le
 * bouton d'écoute en bas, et les réglages « Aa » partagés avec la Bible.
 */
export default function LivreScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const verre = useVerre()
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const fiche = ficheLivre(id)
  const livre = useLivre(id)
  const [progression, setProgression] = useAtom(progressionLivresAtom)
  const etatAudio = useAtomValue(etatAudioAtom)
  const setCompagnon = useSetAtom(compagnonAtom)
  const allerALaBible = useAllerALaBible()
  const [panneau, setPanneau] = useState<Panneau>(null)
  const defilement = useRef<ScrollView>(null)

  const total = livre.data?.chapitres.length ?? 0
  const numero = Math.min(progression[id]?.chapitre ?? 0, Math.max(0, total - 1))
  const chapitre = useChapitre(id, numero)
  const aller = (n: number) => {
    if (n < 0 || n >= total) return
    setProgression({ ...progression, [id]: { chapitre: n } })
    setPanneau(null)
    defilement.current?.scrollTo({ y: 0, animated: false })
  }

  if (!fiche) return <Text className="p-[24px] text-grey">{t('livres.unknown')}</Text>

  const retour = `/livre?id=${id}`
  const audio = livre.data?.audio ?? []
  const ecouteCeLivre = etatAudio.libre?.pistes[0]?.retour === retour
  const titre = livre.data
    ? titreChapitre(livre.data.chapitres[numero]?.titre ?? '', numero, t('livres.part'))
    : ''
  // Écouter : la piste du même chapitre quand LibriVox suit le même découpage, sinon la liste.
  const ecouter = () => {
    if (ecouteCeLivre) return basculer()
    if (audio.length && audio.length === total)
      return jouerLibre(
        audio.map(piste => ({
          titre: piste.titre,
          sousTitre: fiche.titre,
          url: piste.url,
          retour,
        })),
        numero
      )
    setPanneau('ecouter')
  }

  return (
    <Box className="flex-1">
      {/* En-tête : comme celui de la Bible, en verre, aux deux bords. */}
      <HStack
        className="items-center gap-[8px] px-[16px] pt-[14px] pb-[6px]"
        style={{ zIndex: 10 }}
      >
        <BoutonVerre libelle={t('livres.back')} onPress={() => router.back()}>
          <Icone nom="back" taille={20} />
        </BoutonVerre>
        <TouchableBox
          className="overflow-hidden border-continuous flex-row items-center gap-[8px] pl-[16px] pr-[14px]"
          style={[styleVerre(verre, 22), { height: 44, flexShrink: 1 }]}
          onPress={() => livre.data && setPanneau('chapitres')}
          accessibilityRole="button"
          accessibilityLabel={t('livres.contents')}
        >
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 15 }} numberOfLines={1}>
            {fiche.titre}
          </Text>
          <Text style={{ fontFamily: police(POLICES.points), fontSize: 20, lineHeight: 22 }}>
            {total ? numero + 1 : '…'}
          </Text>
          <FeatherIcon name="chevron-down" size={15} color="grey" />
        </TouchableBox>
        <Box className="flex-1" />
        <BoutonVerre libelle={t('livres.settings')} onPress={() => setPanneau('aa')}>
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 15 }}>Aa</Text>
        </BoutonVerre>
        {Platform.OS === 'web' ? (
          <BoutonVerre
            libelle={t('livres.besideBible')}
            onPress={() => {
              setCompagnon({ type: 'livre', id })
              allerALaBible()
            }}
          >
            <FeatherIcon name="columns" size={18} />
          </BoutonVerre>
        ) : null}
        <BoutonVerre libelle={t('livres.about')} onPress={() => setPanneau('fiche')}>
          <FeatherIcon name="info" size={18} />
        </BoutonVerre>
      </HStack>

      {/* Le texte, dans la colonne de lecture de la Bible. */}
      <ScrollView ref={defilement} contentContainerStyle={{ paddingBottom: 160 }}>
        <Box
          className="w-full self-center px-[15px] pt-[24px]"
          style={{ maxWidth: READING_TEXT_MAX_WIDTH + 30 }}
        >
          {livre.isError || chapitre.isError ? (
            <Text className="text-grey">{t('livres.unavailable')}</Text>
          ) : !livre.data || !chapitre.data ? (
            <Text className="text-grey">{t('livres.loading')}</Text>
          ) : (
            <TexteLivre titre={titre} paragraphes={chapitre.data.paragraphes} />
          )}
        </Box>
      </ScrollView>

      {/* Les flèches aux bords, comme dans la Bible. */}
      {numero > 0 ? (
        <Box className="absolute left-[16px] top-[50%]">
          <BoutonVerre libelle={t('livres.previous')} onPress={() => aller(numero - 1)}>
            <Icone nom="back" taille={20} />
          </BoutonVerre>
        </Box>
      ) : null}
      {numero < total - 1 ? (
        <Box className="absolute right-[16px] top-[50%]">
          <BoutonVerre libelle={t('livres.next')} onPress={() => aller(numero + 1)}>
            <Icone nom="fwd" taille={20} />
          </BoutonVerre>
        </Box>
      ) : null}

      {/* Le bouton d'écoute en bas, au centre, comme le bouton audio de la Bible. */}
      {audio.length || livre.data?.audioEnCours ? (
        <Box className="absolute bottom-[24px] self-center">
          <TouchableBox
            className="overflow-hidden border-continuous flex-row items-center gap-[8px] px-[18px]"
            style={[styleVerre(verre, 24), { height: 48 }]}
            onPress={ecouter}
            accessibilityRole="button"
            accessibilityLabel={t('livres.tab.listen')}
          >
            <FeatherIcon
              name={ecouteCeLivre && etatAudio.enLecture ? 'pause' : 'headphones'}
              size={18}
            />
            <Text style={{ fontFamily: police(POLICES.titre), fontSize: 14 }}>
              {ecouteCeLivre && etatAudio.enLecture ? t('audio.pause') : t('livres.tab.listen')}
            </Text>
          </TouchableBox>
        </Box>
      ) : null}

      {panneau === 'chapitres' && livre.data ? (
        <Volet titre={t('livres.contents')} onFermer={() => setPanneau(null)}>
          <Chapitres livre={livre.data} numero={numero} aller={aller} />
        </Volet>
      ) : panneau === 'ecouter' && livre.data ? (
        <Volet titre={t('livres.tab.listen')} onFermer={() => setPanneau(null)}>
          <Ecouter id={id} livre={livre.data} />
        </Volet>
      ) : panneau === 'fiche' ? (
        <Volet titre={t('livres.about')} onFermer={() => setPanneau(null)}>
          <Fiche id={id} livre={livre.data} />
        </Volet>
      ) : panneau === 'aa' ? (
        <Volet titre={t('livres.settings')} onFermer={() => setPanneau(null)}>
          <Reglages />
        </Volet>
      ) : null}
    </Box>
  )
}

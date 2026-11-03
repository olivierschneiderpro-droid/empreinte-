import { useAtomValue, useSetAtom } from 'jotai'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, ScrollView } from 'react-native'
import Header from '~common/Header'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { etatAudioAtom, formatTemps, jouerLibre } from '~features/audio/bibleAudio'
import { compagnonAtom } from '~features/empreinte/compagnon'
import { useAllerALaBible } from '~features/empreinte/ouvrirDansLaBible'
import { resolveFontFamily } from '~themes/styleValues'
import { useTheme } from '~themes/ThemeProvider'
import { Couverture } from './Couverture'
import LectureLivre from './LectureLivre'
import { ficheLivre, useLivre } from './livres'

type Onglet = 'lire' | 'ecouter' | 'source'

function Ecouter({ id }: { id: string }) {
  const { t } = useTranslation()
  const livre = useLivre(id)
  const fiche = ficheLivre(id)
  const etat = useAtomValue(etatAudioAtom)
  const pistes = (livre.data?.audio ?? []).map(piste => ({
    titre: piste.titre,
    sousTitre: fiche?.titre ?? '',
    url: piste.url,
    retour: `/livre?id=${id}`,
  }))
  if (!livre.data) return <Text className="text-grey">{t('livres.loading')}</Text>
  if (!pistes.length) return <Text className="text-grey">{t('livres.noAudio')}</Text>
  const enCours = etat.libre?.pistes[0]?.retour === `/livre?id=${id}` ? etat.libre.index : -1
  return (
    <Box className="gap-[6px] max-w-[760px]">
      <Text className="text-grey text-[13px] mb-[8px]">
        {t('livres.readBy', { readers: livre.data.audio[0]?.lecteur || 'LibriVox' })}
      </Text>
      {livre.data.audio.map((piste, n) => (
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
    </Box>
  )
}

function Source({ id }: { id: string }) {
  const { t } = useTranslation()
  const livre = useLivre(id)
  const audio = livre.data?.audio[0]
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
    <Box className="gap-[14px] max-w-[760px]">
      <Text className="text-[14px] leading-[22px]">{t('livres.publicDomain')}</Text>
      {livre.data ? (
        <>
          <Text className="text-grey text-[13px]">
            {t('livres.sourceText', {
              title: livre.data.source.titre,
              number: livre.data.source.gutenberg,
            })}
          </Text>
          {lien(t('livres.openGutenberg'), livre.data.source.url)}
          {audio ? lien(t('livres.openLibrivox'), audio.page) : null}
        </>
      ) : null}
      <Text className="text-grey text-[12px] leading-[18px]">{t('livres.sourceNote')}</Text>
    </Box>
  )
}

/** Empreinte · La page d'un livre : le lire, l'écouter, vérifier d'où il vient. */
export default function LivreScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const fiche = ficheLivre(id)
  const [onglet, setOnglet] = useState<Onglet>('lire')
  const setCompagnon = useSetAtom(compagnonAtom)
  const allerALaBible = useAllerALaBible()
  const livre = useLivre(id)

  if (!fiche)
    return (
      <Box className="flex-1">
        <Header hasBackButton title={t('livres.title')} />
        <Text className="p-[24px] text-grey">{t('livres.unknown')}</Text>
      </Box>
    )

  const onglets: {
    id: Onglet
    libelle: string
    icone: React.ComponentProps<typeof FeatherIcon>['name']
  }[] = [
    { id: 'lire', libelle: t('livres.tab.read'), icone: 'book-open' },
    { id: 'ecouter', libelle: t('livres.tab.listen'), icone: 'headphones' },
    { id: 'source', libelle: t('livres.tab.source'), icone: 'shield' },
  ]

  return (
    <Box className="flex-1">
      <Header hasBackButton title={fiche.titre} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} stickyHeaderIndices={[1]}>
        <HStack className="px-[24px] gap-[24px] flex-wrap w-full max-w-[1100px] self-center pb-[20px]">
          <Couverture livre={fiche} largeur={140} />
          <Box className="flex-1 min-w-[260px] gap-[8px]">
            <Text
              className="text-[30px] leading-[36px]"
              style={{ fontFamily: resolveFontFamily(theme.fontFamily.title) }}
            >
              {fiche.titre}
            </Text>
            <Text className="text-grey text-[14px]">
              {`${fiche.auteur} · ${fiche.annee} · ${t(`livres.language.${fiche.langue}`)}`}
            </Text>
            <Text className="text-[14px] leading-[22px] max-w-[620px]">{fiche.resume}</Text>
            <HStack className="gap-[10px] flex-wrap mt-[6px]">
              {livre.data?.audio.length ? (
                <LinkBox
                  onPress={() => setOnglet('ecouter')}
                  className="flex-row items-center gap-[8px] rounded-full px-[14px] h-[38px] bg-light-grey"
                >
                  <FeatherIcon name="headphones" size={16} />
                  <Text className="font-bold text-[13px]">{t('livres.tab.listen')}</Text>
                </LinkBox>
              ) : null}
              {Platform.OS === 'web' ? (
                <LinkBox
                  onPress={() => {
                    setCompagnon({ type: 'livre', id: fiche.id })
                    allerALaBible()
                  }}
                  className="flex-row items-center gap-[8px] rounded-full px-[14px] h-[38px] bg-light-grey"
                >
                  <FeatherIcon name="columns" size={16} />
                  <Text className="font-bold text-[13px]">{t('livres.besideBible')}</Text>
                </LinkBox>
              ) : null}
            </HStack>
          </Box>
        </HStack>

        <HStack className="px-[24px] gap-[8px] w-full max-w-[1100px] self-center py-[10px] bg-default">
          {onglets.map(item => (
            <LinkBox
              key={item.id}
              onPress={() => setOnglet(item.id)}
              accessibilityState={{ selected: onglet === item.id }}
              className={`flex-row items-center gap-[6px] rounded-full px-[14px] h-[36px] ${
                onglet === item.id ? 'bg-primary' : 'bg-light-grey'
              }`}
            >
              <FeatherIcon
                name={item.icone}
                size={15}
                color={onglet === item.id ? 'reverse' : 'default'}
              />
              <Text className={`font-bold text-[13px] ${onglet === item.id ? 'text-reverse' : ''}`}>
                {item.libelle}
              </Text>
            </LinkBox>
          ))}
        </HStack>

        <Box className="px-[24px] w-full max-w-[1100px] self-center pt-[8px]">
          {onglet === 'lire' ? (
            <LectureLivre id={fiche.id} />
          ) : onglet === 'ecouter' ? (
            <Ecouter id={fiche.id} />
          ) : (
            <Source id={fiche.id} />
          )}
        </Box>
      </ScrollView>
    </Box>
  )
}

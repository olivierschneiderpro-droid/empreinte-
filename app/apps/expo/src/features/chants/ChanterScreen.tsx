import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, useWindowDimensions } from 'react-native'
import { LinkBox } from '~common/Link'
import Box, { HStack } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { basculer, etatAudioAtom, jouerLibre } from '~features/audio/bibleAudio'
import { POLICES, police } from '~features/empreinte/lumiere'
import atomWithAsyncStorage from '~helpers/atomWithAsyncStorage'
import {
  COULEURS_THEME,
  ficheChant,
  mesChantsAtom,
  partiesChantees,
  useEnregistrements,
  type PartieChant,
} from './chants'
import { partagerCouplet } from './partagerCouplet'

type Icone = React.ComponentProps<typeof FeatherIcon>['name']

/** La taille du texte choisie en mode chant (gardée d'une fois sur l'autre). */
const tailleChantAtom = atomWithAsyncStorage<number>('empreinte.chants.taille', 1)

const ARRIERE = {
  animationKeyframes: [
    {
      '0%': { backgroundPosition: '0% 30%' },
      '50%': { backgroundPosition: '100% 70%' },
      '100%': { backgroundPosition: '0% 30%' },
    },
  ],
  animationDuration: '22s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
}

const halo = (duree: string, sens: 1 | -1) => ({
  animationKeyframes: [
    {
      '0%': { transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }] },
      '50%': {
        transform: [{ translateX: 60 * sens }, { translateY: -40 * sens }, { scale: 1.15 }],
      },
      '100%': { transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }] },
    },
  ],
  animationDuration: duree,
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
})

const APPARITION = {
  animationKeyframes: [
    {
      from: { opacity: 0, transform: [{ translateY: 22 }] },
      to: { opacity: 1, transform: [{ translateY: 0 }] },
    },
  ],
  animationDuration: '700ms',
  animationTimingFunction: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
}

function Bouton({
  icone,
  libelle,
  onPress,
  actif,
  grand,
}: {
  icone: Icone
  libelle: string
  onPress: () => void
  actif?: boolean
  grand?: boolean
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={libelle}
      className="rounded-full items-center justify-center"
      style={{
        width: grand ? 64 : 42,
        height: grand ? 64 : 42,
        backgroundColor: grand || actif ? 'white' : 'rgba(255,255,255,0.14)',
      }}
    >
      <FeatherIcon
        name={icone}
        size={grand ? 26 : 17}
        color={grand || actif ? '#111113' : 'white'}
      />
    </LinkBox>
  )
}

const libellePartie = (t: (cle: string, o?: object) => string, partie?: PartieChant) =>
  !partie
    ? ''
    : partie.type === 'refrain'
      ? t('chants.refrain')
      : t('chants.verse', { numero: partie.numero })

/**
 * Empreinte · Le mode chant : plein écran, fond qui respire, la strophe en cours en très
 * grand et la suivante en aperçu. Le texte suit la musique (estimation d'après la durée,
 * recalable d'un geste), et le mode projection sert pour chanter à plusieurs.
 * Avec ?liste=…, les chants de la liste s'enchaînent.
 */
export default function ChanterScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { width, height } = useWindowDimensions()
  const params = useLocalSearchParams<{ id?: string; liste?: string }>()
  const mes = useAtomValue(mesChantsAtom)
  const liste = mes.listes.find(l => l.id === params.liste)
  const ids = liste ? liste.chants : params.id ? [params.id] : []
  const [rang, setRang] = useState(Math.max(0, params.id ? ids.indexOf(params.id) : 0))
  const chant = ficheChant(ids[rang] ?? '')
  const { data } = useEnregistrements(chant?.id ?? '')
  const etat = useAtomValue(etatAudioAtom)
  const [taille, setTaille] = useAtom(tailleChantAtom)
  const [manuel, setManuel] = useState(0)
  const [decalage, setDecalage] = useState(0)
  const [projection, setProjection] = useState(false)
  const [commandesVisibles, setCommandesVisibles] = useState(true)
  const minuterie = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const parties = chant ? partiesChantees(chant) : []
  const enregistrements = data?.enregistrements ?? []
  const urlEnCours = etat.libre?.pistes[etat.libre.index]?.url
  const ceChantJoue = Boolean(urlEnCours && enregistrements.some(e => e.url === urlEnCours))
  const suivre = ceChantJoue && etat.duree > 0 && parties.length > 0
  const estime = suivre
    ? Math.min(parties.length - 1, Math.floor((etat.position / etat.duree) * parties.length))
    : 0
  const borne = (n: number) => Math.max(0, Math.min(parties.length - 1, n))
  const index = suivre ? borne(estime + decalage) : borne(manuel)
  const partie = parties[index]
  const suivante = parties[index + 1]

  // Nouveau chant (liste) : on repart du début.
  useEffect(() => {
    setManuel(0)
    setDecalage(0)
  }, [chant?.id])

  const ecouter = () => {
    if (!chant || !enregistrements.length) return
    if (ceChantJoue) return basculer()
    // Un seul enregistrement à la fois : à la fin, on ne passe pas à une autre version.
    const e = enregistrements[0]!
    jouerLibre(
      [
        {
          titre: chant.titre,
          sousTitre: [e.auteur, e.source].filter(Boolean).join(' · '),
          url: e.url,
          retour: `/chanter?id=${chant.id}`,
        },
      ],
      0
    )
    setDecalage(0)
  }

  const avancer = (sens: 1 | -1) => {
    if (suivre) return setDecalage(d => d + sens)
    const prochain = manuel + sens
    if (prochain >= parties.length && rang + 1 < ids.length) return setRang(r => r + 1)
    if (prochain < 0 && rang > 0) return setRang(r => r - 1)
    setManuel(borne(prochain))
  }

  const pleinEcran = () => {
    if (Platform.OS !== 'web') return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }

  const quitter = () => {
    if (Platform.OS === 'web' && document.fullscreenElement) void document.exitFullscreen()
    if (router.canGoBack()) router.back()
    else router.replace(chant ? `/chant?id=${chant.id}` : '/chants')
  }

  // Le clavier : ← → pour les strophes, Espace pour la musique, P projection, F plein écran.
  useEffect(() => {
    if (Platform.OS !== 'web') return
    const touche = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.tagName === 'INPUT') return
      if (event.key === 'ArrowRight' || event.key === 'PageDown') avancer(1)
      else if (event.key === 'ArrowLeft' || event.key === 'PageUp') avancer(-1)
      else if (event.key === ' ') {
        event.preventDefault()
        if (enregistrements.length) ecouter()
        else avancer(1)
      } else if (event.key.toLowerCase() === 'p') setProjection(p => !p)
      else if (event.key.toLowerCase() === 'f') pleinEcran()
      else if (event.key === 'Escape' && !document.fullscreenElement) quitter()
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  })

  // En projection, les commandes s'effacent ; elles reviennent quand la souris bouge.
  const reveler = () => {
    setCommandesVisibles(true)
    clearTimeout(minuterie.current)
    if (projection) minuterie.current = setTimeout(() => setCommandesVisibles(false), 2500)
  }
  useEffect(() => {
    reveler()
    return () => clearTimeout(minuterie.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projection])

  if (!chant)
    return (
      <Box className="flex-1 items-center justify-center gap-[12px]">
        <Text>{t('chants.notFound')}</Text>
        <LinkBox onPress={() => router.replace('/chants')}>
          <Text className="text-primary font-bold">{t('chants.title')}</Text>
        </LinkBox>
      </Box>
    )

  const [debut, fin] = COULEURS_THEME[chant.theme]
  const large = width >= 900
  const base = (large ? 46 : 30) * taille * (projection ? 1.25 : 1)
  const lignesMax = Math.max(...(partie?.lignes.map(l => l.length) ?? [20]))
  // Les très longues strophes se resserrent pour tenir à l'écran.
  const police_ = Math.min(
    base,
    (height * 0.62) / Math.max(4, partie?.lignes.length ?? 4) / 1.4,
    (width * 1.7) / Math.max(18, lignesMax)
  )
  const montrer = !projection || commandesVisibles

  return (
    <Box
      onPointerMove={reveler}
      style={
        {
          position: Platform.OS === 'web' ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          overflow: 'hidden',
          backgroundColor: '#0B0D14',
          cursor: montrer ? 'auto' : 'none',
        } as object
      }
    >
      {projection ? null : (
        <>
          <Box
            className="absolute inset-0"
            style={
              {
                backgroundImage: `linear-gradient(120deg, ${debut} 0%, #0B0D14 45%, ${fin} 100%)`,
                backgroundSize: '300% 300%',
                ...ARRIERE,
              } as object
            }
          />
          <Box
            className="absolute rounded-full"
            style={
              {
                width: 620,
                height: 620,
                top: -160,
                right: -120,
                backgroundImage: `radial-gradient(circle, ${fin}88 0%, transparent 65%)`,
                ...halo('17s', 1),
              } as object
            }
          />
          <Box
            className="absolute rounded-full"
            style={
              {
                width: 520,
                height: 520,
                bottom: -180,
                left: -140,
                backgroundImage: `radial-gradient(circle, ${debut}aa 0%, transparent 65%)`,
                ...halo('23s', -1),
              } as object
            }
          />
        </>
      )}

      {/* En haut : le chant, et les réglages. */}
      <HStack
        className="absolute top-0 left-0 right-0 items-center gap-[10px] px-[22px] pt-[18px]"
        style={{ opacity: montrer ? 1 : 0, transition: 'opacity 400ms' } as object}
      >
        <Bouton icone="x" libelle={t('compagnon.close')} onPress={quitter} />
        <Box className="flex-1 gap-[2px] px-[6px]">
          <Text
            className="text-[white] text-[15px]"
            style={{ fontFamily: police(POLICES.titre) }}
            numberOfLines={1}
          >
            {chant.titre}
          </Text>
          <Text className="text-[white] text-[12px] opacity-[0.7]" numberOfLines={1}>
            {liste
              ? `${liste.nom} · ${rang + 1}/${ids.length}`
              : `${chant.auteur} · ${chant.annee}`}
          </Text>
        </Box>
        <Bouton
          icone="minus"
          libelle={t('chants.smaller')}
          onPress={() => setTaille(Math.max(0.7, taille - 0.1))}
        />
        <Bouton
          icone="plus"
          libelle={t('chants.bigger')}
          onPress={() => setTaille(Math.min(1.6, taille + 0.1))}
        />
        {partie ? (
          <Bouton
            icone="share-2"
            libelle={t('chants.shareVerse')}
            onPress={() => void partagerCouplet(chant, partie.lignes)}
          />
        ) : null}
        <Bouton
          icone="monitor"
          libelle={t('chants.projection')}
          actif={projection}
          onPress={() => setProjection(p => !p)}
        />
        {Platform.OS === 'web' ? (
          <Bouton icone="maximize" libelle={t('chants.fullscreen')} onPress={pleinEcran} />
        ) : null}
      </HStack>

      {/* Au centre : la strophe en cours, et la suivante en aperçu. */}
      <Box className="absolute inset-0 items-center justify-center px-[28px]">
        <Box className="w-full max-w-[1100px] gap-[28px]">
          {partie ? (
            <Box key={`${chant.id}-${index}`} className="gap-[6px]" style={APPARITION as object}>
              <Text
                className="text-[white] text-[13px] font-bold uppercase tracking-[2px] mb-[10px]"
                style={{ opacity: 0.65 }}
              >
                {libellePartie(t, partie)}
              </Text>
              {partie.lignes.map((ligne, i) => (
                <Text
                  key={i}
                  className="text-[white]"
                  style={{
                    fontFamily: police(POLICES.lecture),
                    fontSize: police_,
                    lineHeight: police_ * 1.35,
                    fontStyle: partie.type === 'refrain' ? 'italic' : 'normal',
                    textShadowColor: 'rgba(0,0,0,0.25)',
                    textShadowRadius: 12,
                  }}
                >
                  {ligne}
                </Text>
              ))}
            </Box>
          ) : (
            <Box className="gap-[10px] items-center" style={APPARITION as object}>
              <FeatherIcon name="music" size={34} color="white" />
              <Text
                className="text-[white] text-center"
                style={{ fontFamily: police(POLICES.titre), fontSize: 40 }}
              >
                {chant.titre}
              </Text>
              <Text className="text-[white] text-[15px] opacity-[0.75] text-center">
                {t('chants.noLyrics')}
              </Text>
            </Box>
          )}
          {suivante && !projection ? (
            <Box className="gap-[2px]" style={{ opacity: 0.42 }}>
              <Text className="text-[white] text-[11px] font-bold uppercase tracking-[2px] mb-[4px]">
                {`${t('chants.next')} · ${libellePartie(t, suivante)}`}
              </Text>
              <Text
                className="text-[white]"
                style={{
                  fontFamily: police(POLICES.lecture),
                  fontSize: Math.max(16, police_ * 0.42),
                }}
                numberOfLines={1}
              >
                {suivante.lignes[0]}
              </Text>
            </Box>
          ) : null}
        </Box>
      </Box>

      {/* En bas : la musique, les strophes, et le fil des parties. */}
      <Box
        className="absolute bottom-0 left-0 right-0 items-center gap-[14px] pb-[26px] px-[22px]"
        style={{ opacity: montrer ? 1 : 0, transition: 'opacity 400ms' } as object}
      >
        <HStack className="gap-[6px] flex-wrap justify-center">
          {parties.map((p, i) => (
            <LinkBox
              key={i}
              onPress={() => (suivre ? setDecalage(i - estime) : setManuel(i))}
              accessibilityLabel={libellePartie(t, p)}
              style={
                {
                  width: i === index ? 26 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'width 300ms',
                } as object
              }
            />
          ))}
        </HStack>
        <HStack className="items-center gap-[16px]">
          <Bouton icone="chevron-left" libelle={t('audio.previous')} onPress={() => avancer(-1)} />
          {enregistrements.length ? (
            <Bouton
              grand
              icone={ceChantJoue && etat.enLecture ? 'pause' : 'play'}
              libelle={ceChantJoue && etat.enLecture ? t('audio.pause') : t('chants.listen')}
              onPress={ecouter}
            />
          ) : null}
          <Bouton icone="chevron-right" libelle={t('audio.next')} onPress={() => avancer(1)} />
        </HStack>
        <Text className="text-[white] text-[11px] opacity-[0.55] text-center">
          {suivre
            ? decalage
              ? t('chants.followAdjusted')
              : t('chants.following')
            : enregistrements.length
              ? t('chants.keysWithMusic')
              : t('chants.keys')}
        </Text>
      </Box>
    </Box>
  )
}

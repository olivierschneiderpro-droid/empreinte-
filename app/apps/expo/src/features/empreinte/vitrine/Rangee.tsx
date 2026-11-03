import { useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView } from 'react-native'
import { LinkBox } from '~common/Link'
import Box, { HStack, TouchableBox } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import Text from '~common/ui/Text'
import { Icone } from '../icones'
import { POLICES, police, styleVerre, useVerre } from '../lumiere'
import { Scene, type NomScene } from './Scene'

/**
 * Empreinte · Une rangée qui défile, comme une vitrine : quelques cartes visibles, les
 * autres à portée d'un glissement (ou des flèches ‹ › sur ordinateur).
 */
export function Rangee({
  titre,
  sousTitre,
  onVoirTout,
  children,
}: {
  titre: string
  sousTitre?: string
  onVoirTout?: () => void
  children: ReactNode
}) {
  const { t } = useTranslation()
  const verre = useVerre()
  const defilement = useRef<ScrollView>(null)
  const [position, setPosition] = useState(0)
  const [largeur, setLargeur] = useState(0)
  const [contenu, setContenu] = useState(0)
  const deplacer = (sens: 1 | -1) =>
    defilement.current?.scrollTo({
      x: Math.max(0, position + sens * largeur * 0.85),
      animated: true,
    })
  const fleche = (sens: 1 | -1, visible: boolean) =>
    Platform.OS === 'web' && visible ? (
      <TouchableBox
        onPress={() => deplacer(sens)}
        accessibilityRole="button"
        accessibilityLabel={sens === 1 ? t('vitrine.next') : t('vitrine.previous')}
        className="overflow-hidden border-continuous items-center justify-center"
        style={[styleVerre(verre, 18), { width: 36, height: 36 }]}
      >
        <Icone nom={sens === 1 ? 'fwd' : 'back'} taille={16} />
      </TouchableBox>
    ) : null

  return (
    <Box className="gap-[12px]">
      <HStack className="items-end gap-[10px]">
        <Box className="flex-1 gap-[2px]">
          <Text style={{ fontFamily: police(POLICES.titre), fontSize: 19 }}>{titre}</Text>
          {sousTitre ? <Text className="text-grey text-[13px]">{sousTitre}</Text> : null}
        </Box>
        {onVoirTout ? (
          <LinkBox
            onPress={onVoirTout}
            className="flex-row items-center gap-[4px] px-[6px] h-[36px]"
          >
            <Text className="text-primary font-bold text-[13px]">{t('vitrine.seeAll')}</Text>
            <FeatherIcon name="chevron-right" size={14} color="primary" />
          </LinkBox>
        ) : null}
        {fleche(-1, position > 4)}
        {fleche(1, contenu - largeur - position > 4)}
      </HStack>
      <ScrollView
        ref={defilement}
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={event => setLargeur(event.nativeEvent.layout.width)}
        onContentSizeChange={w => setContenu(w)}
        onScroll={event => setPosition(event.nativeEvent.contentOffset.x)}
        scrollEventThrottle={32}
        contentContainerStyle={{ gap: 16, paddingBottom: 4 }}
      >
        {children}
      </ScrollView>
    </Box>
  )
}

/** Une carte imagée : l'illustration, un titre, une ligne d'information. */
export function CarteImagee({
  scene,
  titre,
  sousTitre,
  badge,
  largeur = 220,
  hauteur = 128,
  onPress,
  surImage,
  titreSurImage,
}: {
  scene: NomScene
  titre: string
  sousTitre?: string
  badge?: string
  largeur?: number
  hauteur?: number
  onPress: () => void
  surImage?: ReactNode
  /** Le titre est déjà écrit sur l'image : sous la carte, seule l'information reste. */
  titreSurImage?: boolean
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={titre}
      className="gap-[8px]"
      style={{ width: largeur }}
    >
      <Box
        className="rounded-[18px] overflow-hidden"
        style={
          { width: largeur, height: hauteur, boxShadow: '0 8px 22px rgba(17,17,19,0.12)' } as object
        }
      >
        <Scene nom={scene} />
        {surImage ? <Box className="absolute inset-0 p-[12px] justify-end">{surImage}</Box> : null}
        {badge ? (
          <Box
            className="absolute top-[10px] left-[10px] rounded-full px-[9px] h-[22px] justify-center"
            style={{ backgroundColor: 'rgba(17,17,19,0.55)' }}
          >
            <Text className="text-[white] text-[11px] font-bold">{badge}</Text>
          </Box>
        ) : null}
      </Box>
      <Box className="gap-[2px] px-[2px]">
        {titreSurImage ? null : (
          <Text className="font-bold text-[14px]" numberOfLines={1}>
            {titre}
          </Text>
        )}
        {sousTitre ? (
          <Text className="text-grey text-[12px]" numberOfLines={1}>
            {sousTitre}
          </Text>
        ) : null}
      </Box>
    </LinkBox>
  )
}

/** La grande carte du haut : l'illustration en fond, le texte posé dessus. */
export function Vedette({
  scene,
  surtitre,
  titre,
  texte,
  action,
  onPress,
  extra,
}: {
  scene: NomScene
  surtitre: string
  titre: string
  texte?: string
  action: string
  onPress: () => void
  extra?: ReactNode
}) {
  return (
    <LinkBox
      onPress={onPress}
      accessibilityLabel={`${surtitre} · ${titre}`}
      className="rounded-[28px] overflow-hidden w-full"
      style={{ height: 240, boxShadow: '0 16px 40px rgba(17,17,19,0.16)' } as object}
    >
      <Scene nom={scene} />
      <Box
        className="absolute inset-0"
        style={
          {
            backgroundImage:
              'linear-gradient(90deg, rgba(10,14,26,0.72) 0%, rgba(10,14,26,0.35) 55%, rgba(10,14,26,0) 100%)',
            backgroundColor: Platform.OS === 'web' ? undefined : 'rgba(10,14,26,0.4)',
          } as object
        }
      />
      <Box className="absolute inset-0 p-[28px] justify-end gap-[8px] max-w-[620px]">
        <Text className="text-[white] text-[12px] font-bold uppercase tracking-[1.5px] opacity-[0.8]">
          {surtitre}
        </Text>
        <Text
          className="text-[white]"
          style={{ fontFamily: police(POLICES.titre), fontSize: 32, lineHeight: 38 }}
        >
          {titre}
        </Text>
        {texte ? (
          <Text
            className="text-[white] text-[14px] leading-[21px] opacity-[0.85]"
            numberOfLines={2}
          >
            {texte}
          </Text>
        ) : null}
        {extra}
        <HStack className="mt-[6px]">
          <Box className="flex-row items-center gap-[8px] rounded-full px-[16px] h-[40px] bg-[white]">
            <Text className="font-bold text-[14px]" style={{ color: '#111113' }}>
              {action}
            </Text>
            <FeatherIcon name="arrow-right" size={16} color="#111113" />
          </Box>
        </HStack>
      </Box>
    </LinkBox>
  )
}

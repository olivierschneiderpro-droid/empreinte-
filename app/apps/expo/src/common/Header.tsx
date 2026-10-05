import React from 'react'
import PageContent from '~common/ui/PageContent'
import Back from '~common/Back'
import Box, { HStack, VStack } from '~common/ui/Box'
import Text from '~common/ui/Text'
import { usePublicShell } from '~navigation/PublicShellContext'
import { Icone } from '~features/empreinte/icones'
import { POLICES, police, styleVerre, useVerre } from '~features/empreinte/lumiere'
import { useTheme } from '~themes/ThemeProvider'
import { colorWithOpacity } from '~themes/colorValues'
import BarreRecherche from '~features/empreinte/BarreRecherche'
import BoutonOnglets from '~features/app-switcher/BlocOnglets'
import { useEnteteBureau } from './useEnteteBureau'
interface Props {
  maxWidth?: number
  background?: boolean
  hasBackButton?: boolean
  isModal?: boolean
  title?: string
  detail?: string
  subTitle?: string
  fontSize?: number
  onTitlePress?: () => void
  rightComponent?: React.ReactNode
  onCustomBackPress?: () => void
  children?: React.ReactNode
}

const Header = ({
  maxWidth,
  background,
  hasBackButton,
  isModal,
  title,
  detail,
  subTitle,
  fontSize = 14,
  onTitlePress,
  rightComponent,
  onCustomBackPress,
  children,
  ...props
}: Props) => {
  const publicShell = usePublicShell()
  const theme = useTheme()
  const verre = useVerre()
  const showBackButton = hasBackButton && !publicShell.active
  const bureau = useEnteteBureau() && !isModal
  if (publicShell.active) return null
  // Empreinte, bureau : retour, titre à côté ; à droite la recherche de la page, les actions
  // de la page et « Onglets », sur la ligne d'origine (aucune ligne ajoutée au-dessus).
  if (bureau) {
    return (
      <Box {...props} testID="workspace-page-header" className="overflow-visible border-continuous">
        <Box
          className="overflow-visible border-continuous flex-row items-center px-[16px] gap-[12px]"
          style={{ minHeight: 76, zIndex: 20 }}
        >
          {showBackButton ? (
            <Back onCustomPress={onCustomBackPress}>
              <Box
                className="items-center justify-center"
                style={[styleVerre(verre, 22), { width: 44, height: 44 }]}
              >
                <Icone nom="back" taille={20} />
              </Box>
            </Back>
          ) : null}
          <VStack className="overflow-visible shrink" style={{ gap: 2, maxWidth: '40%' }}>
            <Text
              accessibilityRole={onTitlePress ? 'button' : 'header'}
              numberOfLines={1}
              onPress={onTitlePress}
              style={{ fontFamily: police(POLICES.titre), fontSize: 17 }}
            >
              {title}
              {detail ? <Text style={{ color: theme.colors.grey }}>{` · ${detail}`}</Text> : null}
            </Text>
            {!!subTitle && (
              <Text className="text-[12px] text-grey" numberOfLines={1}>
                {subTitle}
              </Text>
            )}
          </VStack>
          <HStack className="flex-1 items-center justify-end gap-[10px] overflow-visible">
            <BarreRecherche />
            {rightComponent ? (
              <Box className="border-continuous overflow-visible justify-center">
                {rightComponent}
              </Box>
            ) : null}
            <BoutonOnglets />
          </HStack>
        </Box>
        {children ? (
          <PageContent style={maxWidth ? { maxWidth } : undefined}>{children}</PageContent>
        ) : null}
      </Box>
    )
  }
  // Empreinte : forme de la maquette Lumière — retour rond en verre, titre dans une
  // pastille de verre centrée, action ronde à droite, sans filet ni fond opaque.
  return (
    <Box
      {...props}
      testID="workspace-page-header"
      className="overflow-visible border-continuous"
      style={{
        backgroundColor: background ? colorWithOpacity(theme.colors.reverse, 0.4) : undefined,
      }}
    >
      {/* La barre prend toute la largeur : retour et action collés aux bords. */}
      <Box
        className="overflow-visible border-continuous flex-row items-center px-[16px] gap-[10px]"
        style={{ minHeight: 64 }}
      >
        {showBackButton ? (
          <Back onCustomPress={onCustomBackPress}>
            <Box
              className="items-center justify-center"
              style={[styleVerre(verre, 22), { width: 44, height: 44 }]}
            >
              <Icone nom={isModal ? 'x' : 'back'} taille={20} />
            </Box>
          </Back>
        ) : (
          <Box style={{ width: rightComponent ? 44 : 4 }} />
        )}
        <VStack
          className="overflow-visible border-continuous flex-[1] items-center"
          style={{ gap: 3 }}
        >
          <HStack
            className="overflow-hidden border-continuous items-center px-[16px]"
            style={[styleVerre(verre, 19, false), { height: 38, maxWidth: '100%' }]}
          >
            <Text
              accessibilityRole={onTitlePress ? 'button' : 'header'}
              numberOfLines={1}
              onPress={onTitlePress}
              style={{
                fontFamily: police(POLICES.titre),
                fontSize: fontSize && fontSize !== 14 ? fontSize : 13.5,
                flexShrink: 1,
              }}
            >
              {title}
            </Text>
            {!!detail && (
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: police(POLICES.titre),
                  fontSize: fontSize && fontSize !== 14 ? fontSize : 13.5,
                  color: theme.colors.grey,
                  flexShrink: 1,
                }}
              >
                {` · ${detail}`}
              </Text>
            )}
          </HStack>
          {!!subTitle && (
            <Text className="text-[12px] text-grey" numberOfLines={1}>
              {subTitle}
            </Text>
          )}
        </VStack>
        {rightComponent ? (
          <Box className="border-continuous overflow-visible justify-center items-end">
            {rightComponent}
          </Box>
        ) : (
          <Box style={{ width: showBackButton ? 44 : 4 }} />
        )}
      </Box>
      {children ? (
        <PageContent style={maxWidth ? { maxWidth } : undefined}>{children}</PageContent>
      ) : null}
    </Box>
  )
}

export default Header

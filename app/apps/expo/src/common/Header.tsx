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
  if (publicShell.active) return null
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

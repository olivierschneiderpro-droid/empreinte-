import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import Box, { TouchableBox } from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import { Icone } from '~features/empreinte/icones'
import { useTheme } from '~themes/ThemeProvider'
type PlayButtonProps = {
  disabled?: boolean
  isPlaying: boolean
  onToggle: () => void
  error?: boolean
  isLoading?: boolean
}

const PlayButton = ({ disabled, isPlaying, onToggle, error, isLoading }: PlayButtonProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  if (error) {
    return (
      <Box
        className="overflow-hidden border-continuous w-[60px] h-[60px] rounded-[30px] bg-reverse mx-[10px] items-center justify-center"
        accessible
        accessibilityRole="text"
        accessibilityLabel={t('accessibility.audioUnavailable')}
      >
        <FeatherIcon name="x" size={23} color="quart" />
      </Box>
    )
  }
  // IsBuffering
  if (isLoading) {
    return (
      <Box
        className="overflow-hidden border-continuous w-[60px] h-[60px] bg-default rounded-[30px] items-center justify-center mx-[10px]"
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={t('accessibility.audioLoading')}
        accessibilityLiveRegion="polite"
      >
        <ActivityIndicator color={theme.colors.reverse} />
      </Box>
    )
  }

  return (
    <TouchableBox
      className="overflow-hidden border-continuous items-center justify-center w-[60px] h-[60px] bg-default rounded-[30px] mx-[10px]"
      disabled={disabled}
      activeOpacity={0.5}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? t('accessibility.pauseAudio') : t('accessibility.playAudio')}
      accessibilityState={{ disabled }}
      style={[{ opacity: disabled ? 0.6 : 1 }, [{ opacity: disabled ? 0.6 : 1 }]]}
    >
      <Box style={{ marginLeft: isPlaying ? 0 : 3 }}>
        <Icone nom={isPlaying ? 'pause' : 'play'} taille={26} couleur={theme.colors.reverse} trait={2.2} />
      </Box>
    </TouchableBox>
  )
}

export default PlayButton

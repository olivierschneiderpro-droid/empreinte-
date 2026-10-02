import React from 'react'
import { useTranslation } from 'react-i18next'
import Box, { TouchableBox } from '~common/ui/Box'
import { Icone } from '~features/empreinte/icones'
export interface ChapterButtonProps {
  hasNextChapter: boolean
  disabled?: boolean
  onPress: () => void
  direction: 'left' | 'right'
}

const ChapterButton = ({ direction, hasNextChapter, disabled, onPress }: ChapterButtonProps) => {
  const { t } = useTranslation()
  const accessibilityLabel = t(
    direction === 'left' ? 'accessibility.previousChapter' : 'accessibility.nextChapter'
  )

  return (
    <Box className="border-continuous overflow-visible w-[40px] h-[40px]">
      {hasNextChapter && (
        <>
          <TouchableBox
            className="overflow-hidden border-continuous w-[40px] h-[40px] items-center justify-center"
            disabled={disabled}
            activeOpacity={0.5}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ disabled }}
            style={[{ opacity: disabled ? 0.6 : 1 }, [{ opacity: disabled ? 0.6 : 1 }]]}
          >
            <Icone nom={direction === 'left' ? 'back' : 'fwd'} taille={22} />
          </TouchableBox>
        </>
      )}
    </Box>
  )
}

export default ChapterButton

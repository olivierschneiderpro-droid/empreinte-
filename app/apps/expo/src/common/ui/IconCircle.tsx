import type { ComponentPropsWithRef as UIComponentProps } from 'react'
import { twMerge } from '~common/ui/classNames'

import Box from '~common/ui/Box'
import type { Theme as AppTheme } from '~themes'
import { useTheme as useAppTheme } from '~themes/ThemeProvider'
import { useVerre } from '~features/empreinte/lumiere'

interface IconCircleProps {
  bg?: string
  size?: number
}

const IconCircle = (
  componentProps: Omit<UIComponentProps<typeof Box>, keyof IconCircleProps | 'theme'> &
    Omit<IconCircleProps, 'theme'> & { theme?: AppTheme; className?: string }
) => {
  const contextTheme = useAppTheme()
  const { theme: themeOverride, className, ...props } = componentProps
  const theme = themeOverride ?? contextTheme
  const verre = useVerre()
  const { bg, size = 40 } = props
  // Empreinte : carré doux neutre de la maquette ; les couleurs vives restent pour l'icône.
  const neutre = !bg || bg.startsWith('rgba') || bg === 'lightPrimary' || bg === 'opacity5'
  const resolvedClassName = twMerge('rounded-[14px] items-center justify-center', className)
  return (
    <Box
      {...props}
      style={
        [
          {
            width: size,
            height: size,
            backgroundColor: neutre
              ? verre.doux
              : theme.colors[bg as keyof typeof theme.colors] || bg,
          },
          props.style,
        ] as UIComponentProps<typeof Box>['style']
      }
      className={twMerge('overflow-hidden border-continuous', resolvedClassName)}
    />
  )
}

export default IconCircle

import type { ComponentPropsWithRef as UIComponentProps } from 'react'
import { twMerge } from '~common/ui/classNames'

import Box from '~common/ui/Box'
import type { Theme as AppTheme } from '~themes'
import { styleVerre, useVerre } from '~features/empreinte/lumiere'

const SectionCard = (
  componentProps: Omit<UIComponentProps<typeof Box>, 'theme'> & {
    theme?: AppTheme
    className?: string
  }
) => {
  const { theme: _themeOverride, className, ...props } = componentProps
  // Empreinte : carte de verre de la maquette (blanc 62 %, filet blanc, rayon 24).
  const verre = useVerre()

  const resolvedClassName = twMerge('rounded-[24px] mx-[16px] mb-[14px]', className)
  return (
    <Box
      {...props}
      style={[styleVerre(verre, 24), props.style] as UIComponentProps<typeof Box>['style']}
      className={twMerge('overflow-hidden border-continuous', resolvedClassName)}
    />
  )
}

export const SectionCardHeader = (
  componentProps: Omit<UIComponentProps<typeof Box>, 'theme'> & {
    theme?: AppTheme
    className?: string
  }
) => {
  const { theme: _themeOverride, className, ...props } = componentProps

  const resolvedClassName = twMerge('flex-row items-center px-[18px] pt-[16px] pb-[6px]', className)
  return (
    <Box
      {...props}
      style={[props.style] as UIComponentProps<typeof Box>['style']}
      className={twMerge('overflow-hidden border-continuous', resolvedClassName)}
    />
  )
}

export default SectionCard

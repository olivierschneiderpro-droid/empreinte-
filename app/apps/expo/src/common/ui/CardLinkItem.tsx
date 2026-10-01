import type { ComponentPropsWithRef as UIComponentProps } from 'react'
import { twMerge } from '~common/ui/classNames'

import Link, { LinkProps } from '~common/Link'
import { MainStackProps } from '~navigation/type'
import type { Theme as AppTheme } from '~themes'
import { useVerre } from '~features/empreinte/lumiere'

interface CardLinkItemProps {
  isLast?: boolean
}

const CardLinkItem = (
  componentProps: Omit<
    UIComponentProps<typeof Link>,
    keyof (LinkProps<keyof MainStackProps> & CardLinkItemProps) | 'theme'
  > &
    Omit<LinkProps<keyof MainStackProps> & CardLinkItemProps, 'theme'> & {
      theme?: AppTheme
      className?: string
    }
) => {
  const { theme: _themeOverride, className, ...props } = componentProps

  const { isLast } = props
  const verre = useVerre()
  // Empreinte : lignes de la maquette, séparées par un filet très doux.
  const resolvedClassName = twMerge(
    'flex-row items-center gap-[12px] mx-[18px] py-[11px]',
    className
  )
  return (
    <Link
      {...props}
      className={resolvedClassName}
      style={
        [
          { borderBottomWidth: isLast ? 0 : 1, borderBottomColor: verre.ligne },
          props.style,
        ] as UIComponentProps<typeof Link>['style']
      }
    />
  )
}

export default CardLinkItem

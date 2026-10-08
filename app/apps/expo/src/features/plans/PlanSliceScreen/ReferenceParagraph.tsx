import type { ComponentPropsWithRef as UIComponentProps } from 'react'
import React from 'react'
import * as NativeUI from 'react-native'
import { twMerge } from '~common/ui/classNames'

import type { Theme as AppTheme } from '~themes'

import Paragraph from '~common/ui/Paragraph'
import { BcvLanguage, BibleReferenceTarget, parseInlineBibleReferences } from '~helpers/bcvParser'
import { getBook } from '~helpers/bibleBookCatalog'
import { usePushRouteOnce } from '~navigation/usePushRouteOnce'
import { usePathname } from 'expo-router'
import { useSetAtom } from 'jotai'
import { parcoursEnCoursAtom } from '~features/empreinte/compagnon'
import { useOuvrirDansLaBible } from '~features/empreinte/ouvrirDansLaBible'

type ParagraphProps = React.ComponentProps<typeof Paragraph>

interface ReferenceParagraphProps extends Omit<ParagraphProps, 'children'> {
  children: string
  planLanguage?: BcvLanguage
}

const getBibleViewParams = (target: BibleReferenceTarget) => ({
  contextDisplayMode: 'focused',
  book: JSON.stringify(getBook(target.book)),
  chapter: String(target.chapter),
  verse: String(target.verse),
  ...(target.focusVerses ? { focusVerses: JSON.stringify(target.focusVerses) } : {}),
})

const ReferenceText = (
  componentProps: Omit<UIComponentProps<typeof NativeUI.Text>, 'theme'> & {
    theme?: AppTheme
    className?: string
  }
) => {
  const { theme: _themeOverride, className, ...props } = componentProps

  const resolvedClassName = twMerge('text-primary', className)
  return (
    <NativeUI.Text
      {...props}
      className={resolvedClassName}
      style={
        [{ textDecorationLine: 'underline' }, props.style] as UIComponentProps<
          typeof NativeUI.Text
        >['style']
      }
    />
  )
}

const ReferenceParagraph = ({ children, planLanguage, ...props }: ReferenceParagraphProps) => {
  const pushRouteOnce = usePushRouteOnce()
  const pathname = usePathname()
  const setParcours = useSetAtom(parcoursEnCoursAtom)
  const ouvrirDansLaBible = useOuvrirDansLaBible()
  // Empreinte (web) : le passage s'ouvre dans la Bible en grand, qui propose ensuite
  // « Suite du plan » pour revenir à cette étape.
  const ouvrir = (target: BibleReferenceTarget) => {
    if (NativeUI.Platform.OS !== 'web') {
      pushRouteOnce({ pathname: '/bible-view', params: getBibleViewParams(target) })
      return
    }
    setParcours({ retour: `${pathname}${window.location.search}` })
    ouvrirDansLaBible({ book: target.book, chapter: target.chapter, verse: target.verse })
  }
  const references = parseInlineBibleReferences(children, planLanguage)

  if (!references.length) {
    return <Paragraph {...props}>{children}</Paragraph>
  }

  const lastReferenceEnd = references[references.length - 1].end

  return (
    <Paragraph {...props} selectable={false}>
      {references.map((reference, index) => {
        const previousEnd = index === 0 ? 0 : references[index - 1].end
        const before = children.slice(previousEnd, reference.start)

        return (
          <React.Fragment key={`${reference.start}-${reference.end}-${reference.target.osis}`}>
            {before}
            <ReferenceText
              accessibilityLabel={reference.text}
              accessibilityRole="link"
              onPress={() => ouvrir(reference.target)}
            >
              {reference.text}
            </ReferenceText>
          </React.Fragment>
        )
      })}
      {children.slice(lastReferenceEnd)}
    </Paragraph>
  )
}

export default ReferenceParagraph

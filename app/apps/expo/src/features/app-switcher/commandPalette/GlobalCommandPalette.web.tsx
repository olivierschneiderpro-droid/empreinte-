import {
  commandPaletteOpenAtom,
  commandPaletteScopeAtom,
  commandPaletteQueryAtom,
  commandPaletteReturnFocusAtom,
  recentCommandTabIdsAtom,
  TAB_ACTIONS_SCOPE,
} from './state'
import * as Dialog from '@radix-ui/react-dialog'
import { usePathname } from 'expo-router'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { activeGroupAtom, activeTabIdAtom, appSwitcherModeAtom } from '~state/tabs'
import CommandPalette from './CommandPalette.web'
import { useTheme } from '~themes/ThemeProvider'
import { webThemeVariables } from '~themes/webThemeVariables'

export default function GlobalCommandPalette() {
  const theme = useTheme()
  const { t } = useTranslation()
  const pathname = usePathname()
  const activeId = useAtomValue(activeTabIdAtom)
  const mode = useAtomValue(appSwitcherModeAtom)
  const group = useAtomValue(activeGroupAtom)
  const activeType = group.tabs[group.activeTabIndex]?.type
  const setRecentIds = useSetAtom(recentCommandTabIdsAtom)
  useEffect(() => {
    if (pathname !== '/' || mode !== 'view' || !activeId || activeType === 'new') return
    setRecentIds(previous => [activeId, ...previous.filter(id => id !== activeId)].slice(0, 50))
  }, [activeId, activeType, pathname, mode, setRecentIds])
  const [launchRevision, setLaunchRevision] = useState(0)
  const [initialScope, setInitialScope] = useAtom(commandPaletteScopeAtom)
  const [initialQuery, setInitialQuery] = useAtom(commandPaletteQueryAtom)
  const [open, setOpen] = useAtom(commandPaletteOpenAtom)
  const [restoreFocus, setRestoreFocus] = useAtom(commandPaletteReturnFocusAtom)
  // Empreinte : à la fermeture, on oublie le texte et le périmètre de la page.
  useEffect(() => {
    if (open) return
    setInitialQuery('')
  }, [open, setInitialQuery])
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.isComposing ||
        event.altKey ||
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== 'k'
      )
        return
      event.preventDefault()
      if (event.repeat) return
      setInitialQuery('')
      if (!open) {
        setRestoreFocus(
          document.activeElement instanceof HTMLElement ? document.activeElement : null
        )
      }
      if (event.shiftKey) {
        setInitialScope(TAB_ACTIONS_SCOPE)
        // Reset an already-open palette too, including a manually removed chip.
        setLaunchRevision(revision => revision + 1)
        setOpen(true)
      } else {
        if (!open) setInitialScope(undefined)
        setOpen(previous => !previous)
      }
    }
    document.addEventListener('keydown', handleKey, true)
    return () => document.removeEventListener('keydown', handleKey, true)
  }, [pathname, activeId, mode, open, setOpen, setRestoreFocus, setInitialScope, setInitialQuery])
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bs-command-overlay" />
        <Dialog.Content
          className="bs-command-dialog"
          style={webThemeVariables(theme.colors)}
          aria-describedby={undefined}
          onCloseAutoFocus={event => {
            event.preventDefault()
            restoreFocus?.focus()
            setRestoreFocus(null)
          }}
        >
          <Dialog.Title className="bs-command-sr-only">{t('commandPalette.label')}</Dialog.Title>
          <CommandPalette
            key={`${initialScope ?? 'search'}:${initialQuery}:${launchRevision}`}
            initialScope={initialScope}
            initialQuery={initialQuery}
            onDone={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

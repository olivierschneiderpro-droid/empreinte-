import { atom } from 'jotai/vanilla'
import type { TabItem } from '~state/tabs'
import type { AnalyticsEvent, AnalyticsParameters } from '~helpers/analyticsCore'

// Page pleine affichée au-dessus des onglets sur téléphone (Empreinte : plus de tiroirs).
export type CompactWorkspacePage = 'home' | 'menu' | 'realites'
export const compactWorkspaceDrawerAtom = atom<CompactWorkspacePage | null>(null)

// IDs are used only for local deduplication, never included in event parameters.
export function createWorkspaceViewTracker(
  emit: (name: AnalyticsEvent, parameters: AnalyticsParameters) => void
) {
  let previous: string | null = null
  return (view: { tabId: string; tabType: TabItem['type'] } | CompactWorkspacePage | null) => {
    const key =
      view === null ? null : typeof view === 'string' ? view : `tab:${view.tabId}:${view.tabType}`
    if (key === previous) return
    previous = key
    if (!view) return
    if (typeof view === 'string') emit('workspace_drawer_view', { screen_name: view })
    else emit('study_tab_view', { tab_type: view.tabType })
  }
}

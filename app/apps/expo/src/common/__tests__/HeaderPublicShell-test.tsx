import React, { act } from 'react'
import { create, type ReactTestRenderer } from 'react-test-renderer'

import Header from '../Header'
import { PublicShellProvider } from '~navigation/PublicShellContext'
jest.mock('~features/empreinte/BarreRecherche', () => 'BarreRecherche')
jest.mock('~features/app-switcher/BlocOnglets', () => 'BoutonOnglets')
jest.mock('~common/useEnteteBureau', () => ({ useEnteteBureau: () => false }))

jest.mock('~common/ui/classNames', () => ({ twMerge: (...values: string[]) => values.join(' ') }))
jest.mock('~common/ui/PageContent', () => ({ __esModule: true, default: 'PageContent' }))
jest.mock('~common/Back', () => ({ __esModule: true, default: 'Back' }))
jest.mock('~common/ui/Box', () => ({
  __esModule: true,
  default: 'Box',
  HStack: 'HStack',
  VStack: 'VStack',
}))
jest.mock('~common/ui/Text', () => ({ __esModule: true, default: 'Text' }))
jest.mock('~common/ui/Icon', () => ({ FeatherIcon: 'FeatherIcon' }))
jest.mock('~features/empreinte/icones', () => ({ Icone: 'Icone' }))
jest.mock('~features/empreinte/lumiere', () => ({
  POLICES: { titre: 'Geist SemiBold' },
  police: (nom: string) => nom,
  styleVerre: () => ({}),
  useVerre: () => ({}),
}))
jest.mock('~themes/ThemeProvider', () => ({ useTheme: () => ({ colors: {} }) }))
jest.mock('~themes/colorValues', () => ({ colorWithOpacity: () => undefined }))

describe('Header in the public shell', () => {
  let renderer: ReactTestRenderer

  beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }))
  afterEach(() => act(() => renderer.unmount()))

  it('never renders a back control', () => {
    act(() => {
      renderer = create(
        <PublicShellProvider active openWorkspace={jest.fn()}>
          <Header hasBackButton title="Genèse 3:3" />
        </PublicShellProvider>
      )
    })

    expect(renderer.root.findAll(item => String(item.type) === 'Back')).toHaveLength(0)
  })
})

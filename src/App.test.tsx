import { beforeEach, describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { App } from './App.tsx'
import { TimerScreen } from './screens/TimerScreen.tsx'
import { PetScreen } from './screens/PetScreen.tsx'
import { ProgressScreen } from './screens/ProgressScreen.tsx'
import { useAppStore } from './store/useAppStore.ts'

beforeEach(() => {
  localStorage.clear()
  useAppStore.getState().resetAll()
})

describe('app rendering', () => {
  it('shows onboarding to new users', () => {
    const html = renderToString(<App />)
    expect(html).toContain('onboarding')
    expect(html).toContain('Poket')
  })

  it('renders the focus screen', () => {
    const html = renderToString(<TimerScreen />)
    expect(html).toContain('25:00')
    expect(html).toContain('timer-modes')
  })

  it('renders the pet screen', () => {
    const html = renderToString(<PetScreen />)
    expect(html).toContain('Ember')
    expect(html).toContain('statbar')
  })

  it('renders the progress screen', () => {
    const html = renderToString(<ProgressScreen />)
    expect(html).toContain('progress')
    expect(html).toContain('ach-item')
  })
})

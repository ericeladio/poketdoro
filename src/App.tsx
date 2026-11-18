import { useEffect, useRef, useState } from 'react'
import { useAppStore } from './store/useAppStore.ts'
import { useI18n } from './i18n/index.ts'
import { useCelebrationFx } from './hooks/useCelebrationFx.ts'
import { useFavicon, useTimerEngine } from './hooks/useTimerEngine.ts'
import { useNow } from './hooks/useNow.ts'
import { dayKey } from './lib/date.ts'
import { ICONS } from './data/icons.ts'
import { Onboarding } from './components/ui/Onboarding.tsx'
import { TabBar } from './components/ui/TabBar.tsx'
import { SettingsModal } from './components/ui/SettingsModal.tsx'
import { CelebrationOverlay } from './components/ui/CelebrationOverlay.tsx'
import { Confetti } from './components/ui/Confetti.tsx'
import { Toast } from './components/ui/Toast.tsx'
import { Icon } from './components/ui/Icon.tsx'
import { PixelSprite } from './components/ui/PixelSprite.tsx'
import { TimerScreen } from './screens/TimerScreen.tsx'
import { PetScreen } from './screens/PetScreen.tsx'
import { ProgressScreen } from './screens/ProgressScreen.tsx'
import type { Tab } from './types.ts'

export function App() {
  const onboarded = useAppStore((s) => s.onboarded)
  const lang = useAppStore((s) => s.lang)
  const streak = useAppStore((s) => s.streak)
  const coins = useAppStore((s) => s.stats.coins)
  const reduceMotion = useAppStore((s) => s.settings.reduceMotion)
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>('timer')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const now = useNow(30_000)

  useTimerEngine()
  useFavicon()
  useCelebrationFx()

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [tab])

  if (!onboarded) {
    return (
      <div className={`app${reduceMotion ? ' reduce-motion' : ''}`}>
        <div className="app-frame">
          <Onboarding />
          <Toast />
        </div>
      </div>
    )
  }

  const streakAtRisk = streak.count > 0 && streak.lastDayKey !== dayKey(now)

  return (
    <div className={`app${reduceMotion ? ' reduce-motion' : ''}`}>
      <div className="app-frame">
        <header className="topbar">
          <span className="brand" title={t('app.tagline')}>
            <span className="brand-dot" />
            Poket<span>Doro</span>
          </span>
          <div className="topbar-stats">
            <span
              className={`top-chip${streakAtRisk ? ' is-risk' : ''}`}
              title={streakAtRisk ? t('timer.streakRisk') : t('progress.streak')}
            >
              <PixelSprite rows={ICONS.flame} size={15} />
              {streak.count}
            </span>
            <span className="top-chip" title={t('common.coins')}>
              <PixelSprite rows={ICONS.coin} size={15} />
              {coins}
            </span>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setSettingsOpen(true)}
              aria-label={t('settings.title')}
            >
              <Icon name="settings" size={18} />
            </button>
          </div>
        </header>

        <main className="app-main" ref={mainRef}>
          {tab === 'timer' ? <TimerScreen /> : null}
          {tab === 'pet' ? <PetScreen /> : null}
          {tab === 'progress' ? <ProgressScreen /> : null}
        </main>

        <TabBar active={tab} onChange={setTab} />
        <Toast />
        <CelebrationOverlay />
        <Confetti />
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}

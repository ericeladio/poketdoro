import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore.ts'
import { remainingSeconds } from '../lib/timer.ts'
import { formatClock } from '../lib/date.ts'
import { setFavicon } from '../lib/favicon.ts'

export function useTimerEngine() {
  const hydrate = useAppStore((s) => s.hydrate)
  const checkTimer = useAppStore((s) => s.checkTimer)
  const decay = useAppStore((s) => s.decay)
  const onboarded = useAppStore((s) => s.onboarded)

  useEffect(() => {
    hydrate(Date.now())
  }, [hydrate])

  useEffect(() => {
    if (!onboarded) return
    const tick = () => {
      const now = Date.now()
      checkTimer(now)
      decay(now)
    }
    const id = window.setInterval(tick, 500)
    const onVisible = () => {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [checkTimer, decay, onboarded])
}

export function useFavicon() {
  useEffect(() => {
    const paint = () => {
      const state = useAppStore.getState()
      if (!state.onboarded) {
        setFavicon(null)
        return
      }
      if (state.timer.status !== 'running') {
        setFavicon(null)
        return
      }
      const seconds = remainingSeconds(state.timer, Date.now())
      setFavicon(formatClock(seconds), state.timer.mode === 'focus')
    }
    paint()
    const id = window.setInterval(paint, 1000)
    return () => {
      window.clearInterval(id)
      setFavicon(null)
    }
  }, [])
}

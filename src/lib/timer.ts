import type { Settings, TimerMode, TimerSlice } from '../types.ts'
import type { I18nKey } from '../i18n/es.ts'

export const MODE_KEYS: Record<TimerMode, I18nKey> = {
  focus: 'timer.focus',
  short: 'timer.short',
  long: 'timer.long',
}

export function secondsForMode(mode: TimerMode, settings: Settings): number {
  const minutes =
    mode === 'focus'
      ? settings.focusMin
      : mode === 'short'
        ? settings.shortMin
        : settings.longMin
  return Math.max(1, Math.round(minutes)) * 60
}

export function remainingSeconds(timer: TimerSlice, now: number): number {
  if (timer.status === 'running' && timer.endsAt) {
    return Math.max(0, Math.ceil((timer.endsAt - now) / 1000))
  }
  if (timer.status === 'paused') return timer.remainingSec
  return timer.remainingSec || timer.durationSec
}

export function timerProgress(timer: TimerSlice, now: number): number {
  if (timer.durationSec <= 0) return 0
  return Math.min(1, Math.max(0, 1 - remainingSeconds(timer, now) / timer.durationSec))
}

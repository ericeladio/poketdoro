import { describe, expect, it } from 'vitest'
import type { Settings, TimerSlice } from '../types.ts'
import { remainingSeconds, secondsForMode, timerProgress } from './timer.ts'

const settings: Settings = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  sessionsPerCycle: 4,
  autoStartBreaks: true,
  autoStartFocus: false,
  sound: true,
  notifications: false,
  reduceMotion: false,
  pauseLimitMin: 2,
}

function timer(patch: Partial<TimerSlice>): TimerSlice {
  return {
    mode: 'focus',
    status: 'idle',
    durationSec: 1500,
    remainingSec: 1500,
    endsAt: null,
    startedAt: null,
    pausedAt: null,
    cycle: 0,
    consecutiveFails: 0,
    ...patch,
  }
}

describe('secondsForMode', () => {
  it('reads each duration from settings', () => {
    expect(secondsForMode('focus', settings)).toBe(1500)
    expect(secondsForMode('short', settings)).toBe(300)
    expect(secondsForMode('long', settings)).toBe(900)
  })

  it('never returns less than one minute', () => {
    expect(secondsForMode('short', { ...settings, shortMin: 0 })).toBe(60)
  })
})

describe('remainingSeconds', () => {
  it('counts down a running timer', () => {
    const now = 1_000_000
    expect(
      remainingSeconds(
        timer({ status: 'running', endsAt: now + 90_000 }),
        now,
      ),
    ).toBe(90)
  })

  it('never goes below zero', () => {
    expect(
      remainingSeconds(timer({ status: 'running', endsAt: 1_000 }), 5_000),
    ).toBe(0)
  })

  it('freezes while paused', () => {
    expect(
      remainingSeconds(
        timer({ status: 'paused', remainingSec: 321, endsAt: 99 }),
        12_345,
      ),
    ).toBe(321)
  })
})

describe('timerProgress', () => {
  it('is the elapsed fraction of the session', () => {
    const now = 1_000_000
    const progress = timerProgress(
      timer({ status: 'running', endsAt: now + 750_000 }),
      now,
    )
    expect(progress).toBeCloseTo(0.5, 5)
  })

  it('saturates at one', () => {
    expect(
      timerProgress(timer({ status: 'running', endsAt: 1_000 }), 5_000),
    ).toBe(1)
  })
})

import { describe, expect, it } from 'vitest'
import type { Streak } from '../types.ts'
import { dayKey } from './date.ts'
import { maintainStreak, registerFocusDay } from './streak.ts'

const base: Streak = {
  count: 0,
  best: 0,
  lastDayKey: null,
  freezes: 0,
}

function noon(offsetDays = 0): number {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  return date.getTime()
}

describe('registerFocusDay', () => {
  it('starts a streak on the first focus day', () => {
    const result = registerFocusDay(base, noon())
    expect(result.streak.count).toBe(1)
    expect(result.streak.best).toBe(1)
    expect(result.started).toBe(true)
  })

  it('does not double count the same day', () => {
    const first = registerFocusDay(base, noon())
    const again = registerFocusDay(first.streak, noon())
    expect(again.streak.count).toBe(1)
    expect(again.started).toBe(false)
  })

  it('extends on consecutive days', () => {
    const first = registerFocusDay(base, noon(-1))
    const second = registerFocusDay(first.streak, noon())
    expect(second.streak.count).toBe(2)
    expect(second.streak.best).toBe(2)
    expect(second.freezeUsed).toBe(false)
  })

  it('spends a freeze when one day is missed', () => {
    const streak: Streak = {
      ...base,
      count: 3,
      best: 3,
      lastDayKey: registerFocusDay(base, noon(-2)).streak.lastDayKey,
      freezes: 1,
    }
    const result = registerFocusDay(streak, noon())
    expect(result.streak.count).toBe(4)
    expect(result.streak.freezes).toBe(0)
    expect(result.freezeUsed).toBe(true)
  })

  it('restarts after a longer gap', () => {
    const streak: Streak = {
      ...base,
      count: 5,
      best: 5,
      lastDayKey: registerFocusDay(base, noon(-4)).streak.lastDayKey,
      freezes: 2,
    }
    const result = registerFocusDay(streak, noon())
    expect(result.streak.count).toBe(1)
    expect(result.streak.best).toBe(5)
    expect(result.streak.freezes).toBe(2)
  })

  it('earns a freeze every seven days', () => {
    const streak: Streak = {
      ...base,
      count: 6,
      best: 6,
      lastDayKey: registerFocusDay(base, noon(-1)).streak.lastDayKey,
    }
    const result = registerFocusDay(streak, noon())
    expect(result.streak.count).toBe(7)
    expect(result.streak.freezes).toBe(1)
  })
})

describe('maintainStreak', () => {
  it('keeps a streak within one day', () => {
    const streak: Streak = { ...base, count: 2, lastDayKey: dayKey(noon()) }
    const result = maintainStreak(streak, noon())
    expect(result.streak.count).toBe(2)
    expect(result.freezeUsed).toBe(false)
  })

  it('uses a freeze for a single missed day', () => {
    const result = maintainStreak(
      {
        count: 4,
        best: 4,
        lastDayKey: registerFocusDay(base, noon(-2)).streak.lastDayKey,
        freezes: 1,
      },
      noon(),
    )
    expect(result.freezeUsed).toBe(true)
    expect(result.streak.count).toBe(4)
    expect(result.streak.freezes).toBe(0)
    expect(result.streak.lastDayKey).not.toBe(null)
  })

  it('breaks the streak after two missed days without a freeze', () => {
    const result = maintainStreak(
      {
        count: 4,
        best: 4,
        lastDayKey: registerFocusDay(base, noon(-3)).streak.lastDayKey,
        freezes: 0,
      },
      noon(),
    )
    expect(result.streak.count).toBe(0)
  })
})

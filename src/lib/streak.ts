import type { Streak } from '../types.ts'
import { dayGap, dayKey, shiftDay } from './date.ts'

export interface StreakResult {
  streak: Streak
  freezeUsed: boolean
  started: boolean
}

export function registerFocusDay(
  streak: Streak,
  now: number,
): StreakResult {
  const today = dayKey(now)
  if (streak.lastDayKey === today) {
    return {
      streak: { ...streak, best: Math.max(streak.best, streak.count) },
      freezeUsed: false,
      started: false,
    }
  }

  const gap = streak.lastDayKey ? dayGap(streak.lastDayKey, today) : 1
  let count = 1
  let freezes = streak.freezes
  let freezeUsed = false

  if (gap === 1 && streak.lastDayKey) {
    count = streak.count + 1
  } else if (gap === 2 && freezes > 0 && streak.count > 0) {
    freezes -= 1
    freezeUsed = true
    count = streak.count + 1
  } else if (streak.lastDayKey === null) {
    count = 1
  }

  if (count > 0 && count % 7 === 0) {
    freezes = Math.min(2, freezes + 1)
  }

  return {
    streak: {
      count,
      best: Math.max(streak.best, count),
      lastDayKey: today,
      freezes,
    },
    freezeUsed,
    started: streak.count === 0,
  }
}

export function maintainStreak(
  streak: Streak,
  now: number,
): { streak: Streak; freezeUsed: boolean } {
  if (!streak.lastDayKey) return { streak, freezeUsed: false }
  const today = dayKey(now)
  const gap = dayGap(streak.lastDayKey, today)
  if (gap <= 1) return { streak, freezeUsed: false }

  if (gap === 2 && streak.freezes > 0 && streak.count > 0) {
    return {
      streak: {
        ...streak,
        freezes: streak.freezes - 1,
        lastDayKey: dayKey(shiftDay(now, -1)),
      },
      freezeUsed: true,
    }
  }

  return { streak: { ...streak, count: 0 }, freezeUsed: false }
}

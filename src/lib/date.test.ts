import { describe, expect, it } from 'vitest'
import { dayGap, dayKey, formatClock, lastDays, shiftDay } from './date.ts'

const sample = new Date(2026, 0, 5, 10, 30, 0).getTime()

describe('dayKey', () => {
  it('returns a local YYYY-MM-DD key', () => {
    expect(dayKey(sample)).toBe('2026-01-05')
  })
})

describe('shiftDay', () => {
  it('moves by whole days', () => {
    expect(dayKey(shiftDay(sample, 1))).toBe('2026-01-06')
    expect(dayKey(shiftDay(sample, -5))).toBe('2025-12-31')
  })
})

describe('dayGap', () => {
  it('counts calendar days between keys', () => {
    expect(dayGap('2026-01-05', '2026-01-06')).toBe(1)
    expect(dayGap('2026-01-05', '2026-01-07')).toBe(2)
    expect(dayGap('2026-01-05', '2026-01-05')).toBe(0)
  })
})

describe('formatClock', () => {
  it('formats minutes and seconds with padding', () => {
    expect(formatClock(0)).toBe('00:00')
    expect(formatClock(59)).toBe('00:59')
    expect(formatClock(60)).toBe('01:00')
    expect(formatClock(3599)).toBe('59:59')
  })

  it('clamps negative values', () => {
    expect(formatClock(-5)).toBe('00:00')
  })
})

describe('lastDays', () => {
  it('ends with today and has unique days', () => {
    const days = lastDays(7, sample)
    expect(days).toHaveLength(7)
    expect(new Set(days).size).toBe(7)
    expect(days.at(-1)).toBe('2026-01-05')
    expect(days[0]).toBe('2025-12-30')
  })
})

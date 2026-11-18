import { describe, expect, it } from 'vitest'
import { levelInfo, stageForLevel, stageForXp, xpForNext } from './levels.ts'

describe('xpForNext', () => {
  it('grows by forty per level', () => {
    expect(xpForNext(1)).toBe(80)
    expect(xpForNext(2)).toBe(120)
    expect(xpForNext(5)).toBe(240)
  })
})

describe('levelInfo', () => {
  it('starts at level one', () => {
    expect(levelInfo(0)).toEqual({
      level: 1,
      intoLevel: 0,
      needed: 80,
      progress: 0,
    })
  })

  it('levels up exactly at the threshold', () => {
    expect(levelInfo(79).level).toBe(1)
    expect(levelInfo(80).level).toBe(2)
    expect(levelInfo(80).intoLevel).toBe(0)
  })

  it('subtracts earlier thresholds', () => {
    expect(levelInfo(200)).toMatchObject({
      level: 3,
      intoLevel: 0,
      needed: 160,
    })
    expect(levelInfo(360).level).toBe(4)
  })
})

describe('stages', () => {
  it('evolves at level three and eight', () => {
    expect(stageForLevel(1)).toBe('hatchling')
    expect(stageForLevel(2)).toBe('hatchling')
    expect(stageForLevel(3)).toBe('drake')
    expect(stageForLevel(7)).toBe('drake')
    expect(stageForLevel(8)).toBe('emberwing')
    expect(stageForXp(200)).toBe('drake')
  })
})

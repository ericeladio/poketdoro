import type { Stage } from '../types.ts'

export const STAGE_LEVELS: Record<Stage, number> = {
  hatchling: 1,
  drake: 3,
  emberwing: 8,
}

export function xpForNext(level: number): number {
  return 80 + (level - 1) * 40
}

export interface LevelInfo {
  level: number
  intoLevel: number
  needed: number
  progress: number
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1
  let rest = Math.max(0, Math.round(xp))
  while (rest >= xpForNext(level) && level < 99) {
    rest -= xpForNext(level)
    level += 1
  }
  const needed = xpForNext(level)
  return {
    level,
    intoLevel: rest,
    needed,
    progress: needed === 0 ? 0 : Math.min(1, rest / needed),
  }
}

export function stageForLevel(level: number): Stage {
  if (level >= STAGE_LEVELS.emberwing) return 'emberwing'
  if (level >= STAGE_LEVELS.drake) return 'drake'
  return 'hatchling'
}

export function stageForXp(xp: number): Stage {
  return stageForLevel(levelInfo(xp).level)
}

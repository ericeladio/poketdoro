import type { I18nKey } from './i18n/es.ts'

export type Lang = 'es' | 'en'

export type TimerMode = 'focus' | 'short' | 'long'

export type TimerStatus = 'idle' | 'running' | 'paused'

export type Tab = 'timer' | 'pet' | 'progress'

export type Mood =
  | 'happy'
  | 'neutral'
  | 'hungry'
  | 'tired'
  | 'sick'
  | 'sleeping'
  | 'celebrating'

export type Stage = 'hatchling' | 'drake' | 'emberwing'

export type QuestKind = 'sessions' | 'minutes' | 'care'

export interface Settings {
  focusMin: number
  shortMin: number
  longMin: number
  sessionsPerCycle: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
  sound: boolean
  notifications: boolean
  reduceMotion: boolean
  pauseLimitMin: number
}

export interface Pet {
  name: string
  xp: number
  health: number
  hunger: number
  happiness: number
  energy: number
  sick: boolean
  lastDecayAt: number
  lastPettedAt: number
  hatchedAt: number
}

export interface Streak {
  count: number
  best: number
  lastDayKey: string | null
  freezes: number
}

export interface Quest {
  id: string
  kind: QuestKind
  target: number
  progress: number
  claimed: boolean
  reward: number
}

export interface QuestBoard {
  dayKey: string
  list: Quest[]
}

export interface SessionRecord {
  id: string
  mode: TimerMode
  startedAt: number
  endedAt: number
  durationSec: number
  completed: boolean
  xp: number
  coins: number
}

export interface Stats {
  totalFocusSec: number
  totalSessions: number
  failedSessions: number
  dayKey: string
  todayFocusSec: number
  todaySessions: number
  focusByDay: Record<string, number>
  coins: number
  totalCoins: number
  sessions: SessionRecord[]
}

export interface TimerSlice {
  mode: TimerMode
  status: TimerStatus
  durationSec: number
  endsAt: number | null
  remainingSec: number
  startedAt: number | null
  pausedAt: number | null
  cycle: number
  consecutiveFails: number
}

export interface Celebration {
  id: number
  kind: 'focus' | 'break' | 'levelup' | 'failed' | 'achievement'
  xp: number
  coins: number
  level?: number
  stage?: Stage
  achievement?: string
  healed?: boolean
  streak?: number
  sick?: boolean
  freezeUsed?: boolean
}

export interface Flash {
  id: string
  tone: 'success' | 'warn' | 'info'
  titleKey: I18nKey
  bodyKey?: I18nKey
  params?: Record<string, string | number>
}

export interface AppData {
  version: number
  lang: Lang
  onboarded: boolean
  settings: Settings
  pet: Pet
  streak: Streak
  quests: QuestBoard
  stats: Stats
  timer: TimerSlice
  achievements: string[]
}

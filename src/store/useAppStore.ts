import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AppData,
  Celebration,
  Flash,
  Lang,
  Pet,
  Quest,
  SessionRecord,
  Settings,
  Stats,
  Streak,
  TimerMode,
  TimerSlice,
} from '../types.ts'
import { dayKey, uid } from '../lib/date.ts'
import { decayPet } from '../lib/pet.ts'
import { levelInfo, stageForLevel } from '../lib/levels.ts'
import { maintainStreak, registerFocusDay } from '../lib/streak.ts'
import { secondsForMode } from '../lib/timer.ts'
import { createQuestBoard, progressQuests } from '../data/quests.ts'
import { ACHIEVEMENTS } from '../data/achievements.ts'
import type { AchievementDef } from '../data/achievements.ts'

const STORE_VERSION = 1
const GRACE_MS = 10 * 60 * 1000
const FEED_COST = 10
const MEDICINE_COST = 25
const PET_COOLDOWN_MS = 60_000

const clamp = (n: number) => Math.max(0, Math.min(100, n))

export const DEFAULT_SETTINGS: Settings = {
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

function createAppData(now: number, lang: Lang): AppData {
  return {
    version: STORE_VERSION,
    lang,
    onboarded: false,
    settings: { ...DEFAULT_SETTINGS },
    pet: {
      name: 'Ember',
      xp: 0,
      health: 80,
      hunger: 75,
      happiness: 70,
      energy: 80,
      sick: false,
      lastDecayAt: now,
      lastPettedAt: 0,
      hatchedAt: now,
    },
    streak: { count: 0, best: 0, lastDayKey: null, freezes: 0 },
    quests: createQuestBoard(dayKey(now)),
    stats: {
      totalFocusSec: 0,
      totalSessions: 0,
      failedSessions: 0,
      dayKey: dayKey(now),
      todayFocusSec: 0,
      todaySessions: 0,
      focusByDay: {},
      coins: 20,
      totalCoins: 20,
      sessions: [],
    },
    timer: idleTimer('focus', DEFAULT_SETTINGS, 0),
    achievements: [],
  }
}

function idleTimer(
  mode: TimerMode,
  settings: Settings,
  cycle: number,
  consecutiveFails = 0,
): TimerSlice {
  const durationSec = secondsForMode(mode, settings)
  return {
    mode,
    status: 'idle',
    durationSec,
    remainingSec: durationSec,
    endsAt: null,
    startedAt: null,
    pausedAt: null,
    cycle,
    consecutiveFails,
  }
}

function runningTimer(
  mode: TimerMode,
  settings: Settings,
  now: number,
  cycle: number,
): TimerSlice {
  const durationSec = secondsForMode(mode, settings)
  return {
    mode,
    status: 'running',
    durationSec,
    remainingSec: durationSec,
    endsAt: now + durationSec * 1000,
    startedAt: now,
    pausedAt: null,
    cycle,
    consecutiveFails: 0,
  }
}

function checkAchievements(input: {
  pet: Pet
  stats: Stats
  streak: Streak
  achievements: string[]
  hour: number
  healed?: boolean
}): AchievementDef[] {
  const unlocked = new Set(input.achievements)
  const level = levelInfo(input.pet.xp).level
  return ACHIEVEMENTS.filter((def) => {
    if (unlocked.has(def.id)) return false
    switch (def.id) {
      case 'first_focus':
        return input.stats.totalSessions >= 1
      case 'five_sessions':
        return input.stats.totalSessions >= 5
      case 'sessions_25':
        return input.stats.totalSessions >= 25
      case 'minutes_100':
        return input.stats.totalFocusSec >= 100 * 60
      case 'minutes_1000':
        return input.stats.totalFocusSec >= 1000 * 60
      case 'streak_3':
        return input.streak.count >= 3
      case 'streak_7':
        return input.streak.count >= 7
      case 'night_owl':
        return input.hour >= 22
      case 'early_bird':
        return input.hour < 7
      case 'healer':
        return Boolean(input.healed)
      case 'level_5':
        return level >= 5
      case 'level_10':
        return level >= 10
      case 'perfect_day':
        return input.stats.todaySessions >= 4
      default:
        return false
    }
  })
}

function withAchievementRewards(
  stats: Stats,
  achievements: string[],
  defs: AchievementDef[],
): { stats: Stats; achievements: string[]; coins: number } {
  if (defs.length === 0) return { stats, achievements, coins: 0 }
  const coins = defs.reduce((sum, def) => sum + def.reward, 0)
  return {
    stats: {
      ...stats,
      coins: stats.coins + coins,
      totalCoins: stats.totalCoins + coins,
    },
    achievements: [...achievements, ...defs.map((def) => def.id)],
    coins,
  }
}

interface Actions {
  hydrate: (now: number) => void
  checkTimer: (now: number) => void
  start: () => void
  pause: () => void
  reset: () => void
  skipBreak: () => void
  switchMode: (mode: TimerMode) => void
  completeTimer: (now: number) => void
  decay: (now: number) => void
  setSettings: (patch: Partial<Settings>) => void
  setLang: (lang: Lang) => void
  finishOnboarding: (name: string) => void
  renamePet: (name: string) => void
  feedPet: () => void
  healPet: () => void
  petPet: () => void
  claimQuest: (id: string) => void
  dismissCelebration: () => void
  showFlash: (flash: Omit<Flash, 'id'>) => void
  clearFlash: () => void
  resetAll: () => void
}

export type AppState = AppData & {
  celebration: Celebration | null
  flash: Flash | null
  burst: number
} & Actions

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const ensureDay = (now: number) => {
        const state = get()
        const today = dayKey(now)
        if (state.stats.dayKey === today) return
        const maintained = maintainStreak(state.streak, now)
        set({
          stats: {
            ...state.stats,
            dayKey: today,
            todayFocusSec: 0,
            todaySessions: 0,
          },
          quests: createQuestBoard(today),
          streak: maintained.streak,
        })
        if (maintained.freezeUsed) {
          set({
            flash: {
              id: uid(),
              tone: 'info',
              titleKey: 'timer.freezeUsed',
            },
          })
        }
      }

      const failSession = (reason: 'manual' | 'pause' | 'expired', now: number) => {
        const state = get()
        const timer = state.timer
        if (timer.status === 'idle') return

        if (timer.mode !== 'focus') {
          set({ timer: idleTimer('focus', state.settings, state.timer.cycle) })
          return
        }

        const startedAt = timer.startedAt ?? now - timer.durationSec * 1000
        const elapsed = Math.min(
          timer.durationSec,
          Math.max(0, Math.round((now - startedAt) / 1000)),
        )
        const record: SessionRecord = {
          id: uid(),
          mode: 'focus',
          startedAt,
          endedAt: now,
          durationSec: elapsed,
          completed: false,
          xp: 0,
          coins: 0,
        }

        const consecutiveFails = timer.consecutiveFails + 1
        const health = timer.mode === 'focus' ? clamp(state.pet.health - 15) : state.pet.health
        const hunger = clamp(state.pet.hunger - 3)
        const happiness = clamp(state.pet.happiness - 12)
        const energy = clamp(state.pet.energy - 5)
        const sick =
          state.pet.sick || consecutiveFails >= 2 || health < 25

        set({
          pet: {
            ...state.pet,
            health,
            hunger,
            happiness,
            energy,
            sick,
          },
          stats: {
            ...state.stats,
            failedSessions: state.stats.failedSessions + 1,
            sessions: [record, ...state.stats.sessions].slice(0, 60),
          },
          timer: idleTimer(
            'focus',
            state.settings,
            state.timer.cycle,
            consecutiveFails,
          ),
          celebration: {
            id: now,
            kind: 'failed',
            xp: 0,
            coins: 0,
            sick,
          },
          flash:
            reason === 'pause'
              ? {
                  id: uid(),
                  tone: 'warn',
                  titleKey: 'timer.pauseLimit',
                }
              : state.flash,
        })
      }

      const finish = (now: number) => {
        const state = get()
        const timer = state.timer
        if (timer.status !== 'running' || !timer.endsAt) return
        if (now < timer.endsAt) return
        if (now - timer.endsAt > GRACE_MS) {
          failSession('expired', now)
          return
        }

        ensureDay(now)

        if (timer.mode !== 'focus') {
          const nextCycle = timer.mode === 'long' ? 0 : timer.cycle
          const current = get()
          const autoStart = current.settings.autoStartFocus
          set({
            pet: {
              ...current.pet,
              energy: clamp(current.pet.energy + 2),
              happiness: clamp(current.pet.happiness + 1),
            },
            timer: autoStart
              ? runningTimer('focus', current.settings, now, nextCycle)
              : idleTimer('focus', current.settings, nextCycle),
            celebration: {
              id: now,
              kind: 'break',
              xp: 0,
              coins: 0,
            },
          })
          return
        }

        const current = get()
        const settings = current.settings
        const durationSec = timer.durationSec
        const minutes = Math.max(1, Math.round(durationSec / 60))
        const wasSick = current.pet.sick
        const baseXp = minutes + 15
        const xp = wasSick ? Math.max(1, Math.round(baseXp * 0.5)) : baseXp
        const baseCoins = 8
        const bonus = Math.random() < 0.3 ? 5 : 0
        const coins = wasSick ? Math.round((baseCoins + bonus) / 2) : baseCoins + bonus

        const pet: Pet = {
          ...current.pet,
          xp: current.pet.xp + xp,
          health: clamp(current.pet.health + 6 + (wasSick ? 12 : 0)),
          hunger: clamp(current.pet.hunger - 4),
          happiness: clamp(current.pet.happiness + 8),
          energy: clamp(current.pet.energy - 6),
          sick: false,
        }

        const streakResult = registerFocusDay(current.streak, now)
        const today = dayKey(now)
        const todayReset =
          current.stats.dayKey === today
            ? current.stats
            : {
                ...current.stats,
                dayKey: today,
                todayFocusSec: 0,
                todaySessions: 0,
              }

        const record: SessionRecord = {
          id: uid(),
          mode: 'focus',
          startedAt: timer.startedAt ?? now - durationSec * 1000,
          endedAt: now,
          durationSec,
          completed: true,
          xp,
          coins,
        }

        let quests =
          current.quests.dayKey === today
            ? current.quests
            : createQuestBoard(today)
        quests = progressQuests(quests, 'sessions', 1)
        quests = progressQuests(quests, 'minutes', minutes)

        let stats: Stats = {
          ...todayReset,
          totalFocusSec: todayReset.totalFocusSec + durationSec,
          totalSessions: todayReset.totalSessions + 1,
          todayFocusSec: todayReset.todayFocusSec + durationSec,
          todaySessions: todayReset.todaySessions + 1,
          focusByDay: {
            ...todayReset.focusByDay,
            [today]: (todayReset.focusByDay[today] ?? 0) + durationSec,
          },
          coins: todayReset.coins + coins,
          totalCoins: todayReset.totalCoins + coins,
          sessions: [record, ...todayReset.sessions].slice(0, 60),
        }

        const defs = checkAchievements({
          pet,
          stats,
          streak: streakResult.streak,
          achievements: current.achievements,
          hour: new Date(now).getHours(),
          healed: wasSick,
        })
        const rewarded = withAchievementRewards(
          stats,
          current.achievements,
          defs,
        )
        stats = rewarded.stats

        const beforeLevel = levelInfo(current.pet.xp).level
        const afterLevel = levelInfo(pet.xp).level
        const levelUp = afterLevel > beforeLevel
        const cycleAfter = timer.cycle + 1
        const nextMode: TimerMode =
          cycleAfter % settings.sessionsPerCycle === 0 ? 'long' : 'short'
        const autoStart = settings.autoStartBreaks

        set({
          pet,
          stats,
          quests,
          streak: streakResult.streak,
          achievements: rewarded.achievements,
          timer: autoStart
            ? runningTimer(nextMode, settings, now, cycleAfter)
            : idleTimer(nextMode, settings, cycleAfter),
          celebration: {
            id: now,
            kind: levelUp ? 'levelup' : 'focus',
            xp,
            coins: coins + rewarded.coins,
            level: levelUp ? afterLevel : undefined,
            stage: levelUp ? stageForLevel(afterLevel) : undefined,
            achievement: defs[0]?.id,
            healed: wasSick,
            streak: streakResult.streak.count,
            freezeUsed: streakResult.freezeUsed,
          },
          burst: current.burst + 1,
        })
      }

      return {
        ...createAppData(Date.now(), 'es'),
        celebration: null,
        flash: null,
        burst: 0,

        hydrate: (now) => {
          const state = get()
          if (!state.onboarded) return
          ensureDay(now)
          get().decay(now)
          const timer = get().timer
          if (timer.status === 'running' && timer.endsAt && now >= timer.endsAt) {
            finish(now)
          } else if (
            timer.status === 'paused' &&
            timer.pausedAt &&
            now - timer.pausedAt > get().settings.pauseLimitMin * 60_000
          ) {
            failSession('pause', now)
          }
        },

        checkTimer: (now) => {
          const state = get()
          if (!state.onboarded) return
          if (
            state.timer.status === 'running' &&
            state.timer.endsAt &&
            now >= state.timer.endsAt
          ) {
            finish(now)
            return
          }
          if (
            state.timer.status === 'paused' &&
            state.timer.pausedAt &&
            now - state.timer.pausedAt >
              state.settings.pauseLimitMin * 60_000
          ) {
            failSession('pause', now)
          }
        },

        completeTimer: (now) => finish(now),

        decay: (now) => {
          const state = get()
          if (!state.onboarded) return
          ensureDay(now)
          if (now - state.pet.lastDecayAt < 60_000) return
          const result = decayPet(state.pet, state.pet.lastDecayAt, now)
          const becameSick = !state.pet.sick && result.pet.sick
          set({
            pet: {
              ...state.pet,
              ...result.pet,
              lastDecayAt: now,
            },
            flash: becameSick
              ? {
                  id: uid(),
                  tone: 'warn',
                  titleKey: 'pet.sick',
                  bodyKey: 'pet.sickHint',
                }
              : state.flash,
          })
        },

        start: () => {
          const state = get()
          const now = Date.now()
          if (state.timer.status === 'running') return
          if (state.timer.status === 'paused') {
            set({
              timer: {
                ...state.timer,
                status: 'running',
                endsAt: now + state.timer.remainingSec * 1000,
                pausedAt: null,
              },
            })
            return
          }
          const durationSec =
            state.timer.durationSec ||
            secondsForMode(state.timer.mode, state.settings)
          set({
            timer: {
              ...state.timer,
              status: 'running',
              durationSec,
              remainingSec: durationSec,
              endsAt: now + durationSec * 1000,
              startedAt: now,
              pausedAt: null,
            },
            celebration: null,
          })
        },

        pause: () => {
          const state = get()
          if (state.timer.status !== 'running' || !state.timer.endsAt) return
          const now = Date.now()
          const remainingSec = Math.max(
            0,
            Math.ceil((state.timer.endsAt - now) / 1000),
          )
          set({
            timer: {
              ...state.timer,
              status: 'paused',
              remainingSec,
              endsAt: null,
              pausedAt: now,
            },
          })
        },

        reset: () => {
          const state = get()
          if (
            state.timer.status === 'running' ||
            state.timer.status === 'paused'
          ) {
            if (state.timer.mode === 'focus') {
              failSession('manual', Date.now())
            } else {
              set({
                timer: idleTimer(
                  state.timer.mode,
                  state.settings,
                  state.timer.cycle,
                ),
              })
            }
            return
          }
          set({
            timer: idleTimer(
              state.timer.mode,
              state.settings,
              state.timer.cycle,
            ),
          })
        },

        skipBreak: () => {
          const state = get()
          if (state.timer.mode === 'focus') return
          set({
            timer: idleTimer('focus', state.settings, state.timer.cycle),
            celebration: null,
          })
        },

        switchMode: (mode) => {
          const state = get()
          if (state.timer.status !== 'idle') return
          if (state.timer.mode === mode) return
          set({
            timer: idleTimer(mode, state.settings, state.timer.cycle),
            celebration: null,
          })
        },

        setSettings: (patch) => {
          const state = get()
          const settings = { ...state.settings, ...patch }
          let timer = state.timer
          if (timer.status === 'idle') {
            const durationSec = secondsForMode(timer.mode, settings)
            timer = { ...timer, durationSec, remainingSec: durationSec }
          }
          set({ settings, timer })
        },

        setLang: (lang) => {
          set({ lang })
          document.documentElement.lang = lang
        },

        finishOnboarding: (name) => {
          const now = Date.now()
          set({
            onboarded: true,
            pet: {
              ...get().pet,
              name: name.trim().slice(0, 14) || 'Ember',
              lastDecayAt: now,
              hatchedAt: now,
            },
          })
        },

        renamePet: (name) => {
          const trimmed = name.trim().slice(0, 14)
          if (!trimmed) return
          set({ pet: { ...get().pet, name: trimmed } })
          get().showFlash({
            tone: 'success',
            titleKey: 'pet.renamed',
          })
        },

        feedPet: () => {
          const state = get()
          if (state.stats.coins < FEED_COST) {
            get().showFlash({
              tone: 'warn',
              titleKey: 'pet.noCoins',
            })
            return
          }
          ensureDay(Date.now())
          const current = get()
          let quests =
            current.quests.dayKey === dayKey(Date.now())
              ? current.quests
              : createQuestBoard(dayKey(Date.now()))
          quests = progressQuests(quests, 'care', 1)
          set({
            pet: {
              ...current.pet,
              hunger: clamp(current.pet.hunger + 35),
              happiness: clamp(current.pet.happiness + 4),
              health: clamp(current.pet.health + 3),
            },
            stats: {
              ...current.stats,
              coins: current.stats.coins - FEED_COST,
            },
            quests,
          })
          get().showFlash({
            tone: 'success',
            titleKey: 'pet.fed',
            params: { amount: 35 },
          })
        },

        healPet: () => {
          const state = get()
          if (!state.pet.sick) {
            get().showFlash({ tone: 'info', titleKey: 'pet.notSick' })
            return
          }
          if (state.stats.coins < MEDICINE_COST) {
            get().showFlash({ tone: 'warn', titleKey: 'pet.noCoins' })
            return
          }
          ensureDay(Date.now())
          const current = get()
          let quests =
            current.quests.dayKey === dayKey(Date.now())
              ? current.quests
              : createQuestBoard(dayKey(Date.now()))
          quests = progressQuests(quests, 'care', 1)

          const pet: Pet = {
            ...current.pet,
            sick: false,
            health: clamp(current.pet.health + 30),
            happiness: clamp(current.pet.happiness + 6),
          }
          let stats: Stats = {
            ...current.stats,
            coins: current.stats.coins - MEDICINE_COST,
          }

          const defs = checkAchievements({
            pet,
            stats,
            streak: current.streak,
            achievements: current.achievements,
            hour: new Date().getHours(),
            healed: true,
          })
          const rewarded = withAchievementRewards(
            stats,
            current.achievements,
            defs,
          )
          stats = rewarded.stats

          set({
            pet,
            stats,
            quests,
            achievements: rewarded.achievements,
            celebration:
              defs.length > 0
                ? {
                    id: Date.now(),
                    kind: 'achievement',
                    xp: 0,
                    coins: rewarded.coins,
                    achievement: defs[0].id,
                  }
                : current.celebration,
            burst: defs.length > 0 ? current.burst + 1 : current.burst,
          })
          get().showFlash({ tone: 'success', titleKey: 'pet.healed' })
        },

        petPet: () => {
          const state = get()
          const now = Date.now()
          const remaining = PET_COOLDOWN_MS - (now - state.pet.lastPettedAt)
          if (remaining > 0) {
            get().showFlash({
              tone: 'info',
              titleKey: 'pet.pettedCooldown',
              params: { sec: Math.ceil(remaining / 1000) },
            })
            return
          }
          ensureDay(now)
          const current = get()
          let quests =
            current.quests.dayKey === dayKey(now)
              ? current.quests
              : createQuestBoard(dayKey(now))
          quests = progressQuests(quests, 'care', 1)
          set({
            pet: {
              ...current.pet,
              happiness: clamp(current.pet.happiness + 8),
              energy: clamp(current.pet.energy + 2),
              lastPettedAt: now,
            },
            quests,
          })
          get().showFlash({ tone: 'success', titleKey: 'pet.petted' })
        },

        claimQuest: (id) => {
          const state = get()
          const quest: Quest | undefined = state.quests.list.find(
            (item) => item.id === id,
          )
          if (!quest || quest.claimed || quest.progress < quest.target) return
          set({
            stats: {
              ...state.stats,
              coins: state.stats.coins + quest.reward,
              totalCoins: state.stats.totalCoins + quest.reward,
            },
            quests: {
              ...state.quests,
              list: state.quests.list.map((item) =>
                item.id === id ? { ...item, claimed: true } : item,
              ),
            },
          })
          get().showFlash({
            tone: 'success',
            titleKey: 'progress.rewardClaimed',
            params: { coins: quest.reward },
          })
        },

        dismissCelebration: () => set({ celebration: null }),

        showFlash: (flash) =>
          set({ flash: { ...flash, id: uid() } }),

        clearFlash: () => set({ flash: null }),

        resetAll: () => {
          const fresh = createAppData(Date.now(), get().lang)
          set({
            ...fresh,
            celebration: null,
            flash: null,
            burst: 0,
          })
        },
      }
    },
    {
      name: 'poketdoro-v1',
      version: STORE_VERSION,
      partialize: (state) => ({
        version: state.version,
        lang: state.lang,
        onboarded: state.onboarded,
        settings: state.settings,
        pet: state.pet,
        streak: state.streak,
        quests: state.quests,
        stats: state.stats,
        timer: state.timer,
        achievements: state.achievements,
      }),
    },
  ),
)

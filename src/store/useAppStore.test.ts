import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAppStore } from './useAppStore.ts'

function setup(name = 'Test') {
  useAppStore.getState().finishOnboarding(name)
}

beforeEach(() => {
  vi.useRealTimers()
  localStorage.clear()
  useAppStore.getState().resetAll()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('focus sessions', () => {
  it('completes a session, pays rewards and starts a break', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 5, 10, 0, 0))
    useAppStore.getState().resetAll()
    setup()
    useAppStore.getState().setSettings({
      focusMin: 1,
      autoStartBreaks: false,
    })

    useAppStore.getState().start()
    expect(useAppStore.getState().timer.status).toBe('running')

    vi.setSystemTime(new Date(2026, 0, 5, 10, 1, 5))
    useAppStore.getState().checkTimer(Date.now())

    const state = useAppStore.getState()
    expect(state.timer.status).toBe('idle')
    expect(state.timer.mode).toBe('short')
    expect(state.stats.todaySessions).toBe(1)
    expect(state.stats.totalSessions).toBe(1)
    expect(state.stats.coins).toBeGreaterThan(20)
    expect(state.pet.xp).toBeGreaterThan(0)
    expect(state.celebration?.kind).toBe('focus')
    expect(state.celebration?.xp).toBeGreaterThan(0)
    expect(state.streak.count).toBe(1)
  })

  it('fails a session when the pause limit expires', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 5, 10, 0, 0))
    useAppStore.getState().resetAll()
    setup()
    useAppStore.getState().setSettings({ pauseLimitMin: 1 })

    useAppStore.getState().start()
    vi.setSystemTime(new Date(2026, 0, 5, 10, 0, 20))
    useAppStore.getState().pause()

    vi.setSystemTime(new Date(2026, 0, 5, 10, 1, 30))
    useAppStore.getState().checkTimer(Date.now())

    const state = useAppStore.getState()
    expect(state.timer.status).toBe('idle')
    expect(state.timer.mode).toBe('focus')
    expect(state.stats.failedSessions).toBe(1)
    expect(state.pet.health).toBeLessThan(80)
    expect(state.celebration?.kind).toBe('failed')
  })

  it('resumes a paused session with the remaining time', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 5, 10, 0, 0))
    useAppStore.getState().resetAll()
    setup()
    useAppStore.getState().setSettings({ focusMin: 5 })

    useAppStore.getState().start()
    vi.setSystemTime(new Date(2026, 0, 5, 10, 1, 0))
    useAppStore.getState().pause()
    expect(useAppStore.getState().timer.remainingSec).toBe(240)

    vi.setSystemTime(new Date(2026, 0, 5, 10, 1, 30))
    useAppStore.getState().start()
    const timer = useAppStore.getState().timer
    expect(timer.status).toBe('running')
    expect(timer.endsAt).toBe(Date.now() + 240_000)
  })
})

describe('pet care', () => {
  it('feeds the pet and progresses the care quest', () => {
    setup()
    const before = useAppStore.getState()
    useAppStore.getState().feedPet()
    const after = useAppStore.getState()

    expect(after.pet.hunger).toBeGreaterThan(before.pet.hunger)
    expect(after.stats.coins).toBe(before.stats.coins - 10)
    expect(after.quests.list.find((q) => q.kind === 'care')?.progress).toBe(1)
    expect(after.flash?.titleKey).toBe('pet.fed')
  })

  it('refuses to feed without coins', () => {
    setup()
    const state = useAppStore.getState()
    useAppStore.setState({
      stats: { ...state.stats, coins: 0 },
    })
    useAppStore.getState().feedPet()
    expect(useAppStore.getState().flash?.titleKey).toBe('pet.noCoins')
  })

  it('heals a sick pet with medicine', () => {
    setup()
    const state = useAppStore.getState()
    useAppStore.setState({
      pet: { ...state.pet, sick: true, health: 40 },
      stats: { ...state.stats, coins: 50, totalCoins: 50 },
    })

    useAppStore.getState().healPet()
    const after = useAppStore.getState()
    expect(after.pet.sick).toBe(false)
    expect(after.pet.health).toBeGreaterThan(40)
    expect(after.stats.coins).toBeGreaterThanOrEqual(25)
  })

  it('enforces the petting cooldown', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 5, 10, 0, 0))
    setup()

    useAppStore.getState().petPet()
    const happiness = useAppStore.getState().pet.happiness
    useAppStore.getState().petPet()

    expect(useAppStore.getState().pet.happiness).toBe(happiness)
    expect(useAppStore.getState().flash?.titleKey).toBe('pet.pettedCooldown')
  })
})

describe('quests', () => {
  it('pays a finished quest only once', () => {
    setup()
    const state = useAppStore.getState()
    const quest = state.quests.list[0]
    expect(quest).toBeDefined()
    if (!quest) return

    useAppStore.setState({
      quests: {
        ...state.quests,
        list: state.quests.list.map((item) =>
          item.id === quest.id
            ? { ...item, progress: item.target, claimed: false }
            : item,
        ),
      },
    })

    useAppStore.getState().claimQuest(quest.id)
    const after = useAppStore.getState()
    expect(after.stats.coins).toBe(state.stats.coins + quest.reward)
    expect(after.quests.list.find((q) => q.id === quest.id)?.claimed).toBe(true)

    useAppStore.getState().claimQuest(quest.id)
    expect(useAppStore.getState().stats.coins).toBe(after.stats.coins)
  })
})

import { describe, expect, it } from 'vitest'
import { decayPet, moodFor } from './pet.ts'
import type { PetCore } from './pet.ts'

const healthy: PetCore = {
  health: 80,
  hunger: 100,
  happiness: 100,
  energy: 50,
  sick: false,
}

function atNoon(): number {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  return date.getTime()
}

describe('decayPet', () => {
  it('decays needs over time while healthy', () => {
    const now = atNoon()
    const { pet } = decayPet(healthy, now - 60 * 60_000, now)
    expect(pet.hunger).toBeCloseTo(95.2, 3)
    expect(pet.happiness).toBeCloseTo(97.6, 3)
    expect(pet.energy).toBeCloseTo(48.2, 3)
    expect(pet.health).toBeCloseTo(82.4, 3)
  })

  it('restores energy at night', () => {
    const date = new Date()
    date.setHours(23, 30, 0, 0)
    const now = date.getTime()
    const { pet } = decayPet(healthy, now - 60 * 60_000, now)
    expect(pet.energy).toBeCloseTo(53.6, 3)
  })

  it('gets sick when health drops too low', () => {
    const now = atNoon()
    const { pet } = decayPet(
      { ...healthy, health: 20 },
      now - 60 * 60_000,
      now,
    )
    expect(pet.sick).toBe(true)
  })

  it('flags starvation after long neglect', () => {
    const now = atNoon()
    const result = decayPet(
      { ...healthy, hunger: 5 },
      now - 120 * 60_000,
      now,
    )
    expect(result.starved).toBe(true)
    expect(result.pet.hunger).toBe(0)
    expect(result.pet.health).toBeLessThan(80)
  })

  it('caps offline decay at eight hours', () => {
    const now = atNoon()
    const twoDays = decayPet(healthy, now - 48 * 60 * 60_000, now)
    const eightHours = decayPet(healthy, now - 8 * 60 * 60_000, now)
    expect(twoDays.pet.hunger).toBeCloseTo(eightHours.pet.hunger, 5)
  })
})

describe('moodFor', () => {
  const options = { now: atNoon(), celebrating: false, running: false }

  it('celebrates above everything else', () => {
    expect(
      moodFor(
        { ...healthy, sick: true },
        { ...options, celebrating: true },
      ),
    ).toBe('celebrating')
  })

  it('shows sickness when sick', () => {
    expect(moodFor({ ...healthy, sick: true }, options)).toBe('sick')
  })

  it('sleeps at night when not focusing', () => {
    const night = new Date()
    night.setHours(23, 30, 0, 0)
    expect(moodFor(healthy, { ...options, now: night.getTime() })).toBe(
      'sleeping',
    )
  })

  it('stays awake while a session runs at night', () => {
    const night = new Date()
    night.setHours(23, 30, 0, 0)
    expect(
      moodFor(
        { ...healthy, happiness: 50 },
        { ...options, now: night.getTime(), running: true },
      ),
    ).toBe('neutral')
  })

  it('prioritizes hunger over energy and happiness', () => {
    expect(
      moodFor({ ...healthy, hunger: 20, energy: 10 }, options),
    ).toBe('hungry')
  })

  it('shows tiredness before happiness', () => {
    expect(moodFor({ ...healthy, energy: 10 }, options)).toBe('tired')
  })

  it('is happy with high happiness and neutral otherwise', () => {
    expect(moodFor({ ...healthy, happiness: 80 }, options)).toBe('happy')
    expect(moodFor({ ...healthy, happiness: 50 }, options)).toBe('neutral')
  })
})

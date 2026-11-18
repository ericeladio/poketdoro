import type { Mood } from '../types.ts'

export interface PetCore {
  health: number
  hunger: number
  happiness: number
  energy: number
  sick: boolean
}

const clamp = (n: number) => Math.max(0, Math.min(100, n))

export function decayPet(
  pet: PetCore,
  since: number,
  now: number,
): { pet: PetCore; starved: boolean } {
  const minutes = Math.min(480, Math.max(0, (now - since) / 60_000))
  if (minutes < 1) return { pet, starved: false }

  const hour = new Date(now).getHours()
  const night = hour >= 23 || hour < 6

  let hunger = pet.hunger - minutes * 0.08
  let happiness = pet.happiness - minutes * 0.04
  let energy = night && !pet.sick
    ? Math.min(100, pet.energy + minutes * 0.06)
    : pet.energy - minutes * 0.03
  let health = pet.health

  if (hunger <= 0) health -= minutes * 0.12
  else if (hunger > 40 && happiness > 40 && !pet.sick) {
    health += minutes * 0.04
  }
  if (pet.sick) health -= minutes * 0.03

  health = clamp(health)
  hunger = clamp(hunger)
  happiness = clamp(happiness)
  energy = clamp(energy)

  let sick = pet.sick
  if (!sick && (health < 25 || (hunger <= 0 && health < 45))) sick = true

  return {
    pet: { health, hunger, happiness, energy, sick },
    starved: hunger <= 0,
  }
}

export function moodFor(
  pet: PetCore,
  options: { now: number; celebrating: boolean; running: boolean },
): Mood {
  if (options.celebrating) return 'celebrating'
  if (pet.sick) return 'sick'
  const hour = new Date(options.now).getHours()
  const night = hour >= 23 || hour < 6
  if (night && !options.running) return 'sleeping'
  if (pet.hunger < 30) return 'hungry'
  if (pet.energy < 25) return 'tired'
  if (pet.happiness >= 65) return 'happy'
  return 'neutral'
}

import type { Mood } from '../types.ts'
import { useAppStore } from '../store/useAppStore.ts'
import { moodFor } from '../lib/pet.ts'
import { useNow } from './useNow.ts'

export function usePetMood(): Mood {
  const pet = useAppStore((s) => s.pet)
  const celebration = useAppStore((s) => s.celebration)
  const running = useAppStore((s) => s.timer.status === 'running')
  const now = useNow(30_000)

  const celebrating =
    celebration?.kind === 'focus' ||
    celebration?.kind === 'levelup' ||
    celebration?.kind === 'achievement'

  return moodFor(pet, { now, celebrating, running })
}

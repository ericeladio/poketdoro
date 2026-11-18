import { useEffect, useState } from 'react'

interface InstallEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallEvent | null = null
let installed =
  typeof window !== 'undefined' &&
  window.matchMedia('(display-mode: standalone)').matches
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferred = event as InstallEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    installed = true
    notify()
  })
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function useInstallPrompt() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick((tick) => tick + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return {
    canInstall: deferred !== null,
    installed,
    ios: isIos() && !installed,
    async install(): Promise<boolean> {
      const event = deferred
      if (!event) return false
      await event.prompt()
      const choice = await event.userChoice
      deferred = null
      notify()
      if (choice.outcome === 'accepted') {
        installed = true
        notify()
        return true
      }
      return false
    },
  }
}

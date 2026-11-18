import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore.ts'
import { useI18n } from '../i18n/index.ts'
import { playChime } from '../lib/audio.ts'
import { notifySession } from '../lib/notifications.ts'

export function useCelebrationFx() {
  const celebration = useAppStore((s) => s.celebration)
  const dismiss = useAppStore((s) => s.dismissCelebration)
  const sound = useAppStore((s) => s.settings.sound)
  const notifications = useAppStore((s) => s.settings.notifications)
  const { t } = useI18n()

  useEffect(() => {
    if (!celebration) return
    const isWin =
      celebration.kind === 'focus' ||
      celebration.kind === 'levelup' ||
      celebration.kind === 'achievement'

    if (isWin && sound) playChime('complete')
    if (isWin && notifications) {
      notifySession(
        t('celebration.focusTitle'),
        `+${celebration.xp} XP · +${celebration.coins}`,
      )
    }

    const timer = window.setTimeout(dismiss, 7000)
    return () => window.clearTimeout(timer)
  }, [celebration, dismiss, notifications, sound, t])
}

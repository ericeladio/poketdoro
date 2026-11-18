import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../../i18n/index.ts'
import { useInstallPrompt } from '../../hooks/useInstallPrompt.ts'
import { PixelButton } from './PixelButton.tsx'
import { Icon } from './Icon.tsx'

const DISMISS_KEY = 'poketdoro:install-dismissed'

export function InstallCard() {
  const { t } = useI18n()
  const { canInstall, installed, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === '1',
  )
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!canInstall || dismissed) return
    const timer = window.setTimeout(() => setVisible(true), 5000)
    return () => window.clearTimeout(timer)
  }, [canInstall, dismissed])

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
    setVisible(false)
  }

  const show = visible && canInstall && !installed && !dismissed

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="install-card"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
        >
          <span className="install-icon">
            <Icon name="download" size={18} />
          </span>
          <span className="install-text">
            <strong>{t('pwa.installTitle')}</strong>
            <small>{t('pwa.installBody')}</small>
          </span>
          <span className="install-actions">
            <PixelButton size="sm" onClick={() => void install()}>
              {t('pwa.install')}
            </PixelButton>
            <button
              type="button"
              className="icon-btn"
              onClick={dismiss}
              aria-label={t('pwa.later')}
            >
              <Icon name="close" size={14} />
            </button>
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

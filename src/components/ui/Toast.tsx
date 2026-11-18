import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore } from '../../store/useAppStore.ts'
import { useI18n } from '../../i18n/index.ts'
import { ICONS } from '../../data/icons.ts'
import { PixelSprite } from './PixelSprite.tsx'

export function Toast() {
  const flash = useAppStore((s) => s.flash)
  const clearFlash = useAppStore((s) => s.clearFlash)
  const { t } = useI18n()

  useEffect(() => {
    if (!flash) return
    const timer = window.setTimeout(() => clearFlash(), 3400)
    return () => window.clearTimeout(timer)
  }, [flash, clearFlash])

  return (
    <div className="toast-layer" aria-live="polite">
      <AnimatePresence>
        {flash ? (
          <motion.button
            type="button"
            key={flash.id}
            className={`toast toast-${flash.tone}`}
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onClick={clearFlash}
          >
            <PixelSprite
              rows={
                flash.tone === 'success'
                  ? ICONS.check
                  : flash.tone === 'warn'
                    ? ICONS.drop
                    : ICONS.spark
              }
              size={22}
              className="toast-icon"
            />
            <span className="toast-text">
              <strong>{t(flash.titleKey, flash.params)}</strong>
              {flash.bodyKey ? (
                <small>{t(flash.bodyKey, flash.params)}</small>
              ) : null}
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

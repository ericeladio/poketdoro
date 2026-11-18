import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore.ts'
import { useI18n } from '../../i18n/index.ts'
import { useInstallPrompt } from '../../hooks/useInstallPrompt.ts'
import { Modal } from './Modal.tsx'
import { PixelButton } from './PixelButton.tsx'
import { Stepper, Toggle } from './PixelBar.tsx'
import { Icon } from './Icon.tsx'
import { playChime } from '../../lib/audio.ts'
import { requestNotificationPermission } from '../../lib/notifications.ts'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

const VERSION = '1.0.0'

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const settings = useAppStore((s) => s.settings)
  const lang = useAppStore((s) => s.lang)
  const setSettings = useAppStore((s) => s.setSettings)
  const setLang = useAppStore((s) => s.setLang)
  const resetAll = useAppStore((s) => s.resetAll)
  const showFlash = useAppStore((s) => s.showFlash)
  const { t } = useI18n()
  const install = useInstallPrompt()
  const [confirmReset, setConfirmReset] = useState(false)

  const toggleSound = (next: boolean) => {
    setSettings({ sound: next })
    if (next) playChime('click')
  }

  const toggleNotifications = async (next: boolean) => {
    if (!next) {
      setSettings({ notifications: false })
      return
    }
    const granted = await requestNotificationPermission()
    if (granted) {
      setSettings({ notifications: true })
    } else {
      setSettings({ notifications: false })
      showFlash({
        tone: 'warn',
        titleKey: 'settings.notificationsDenied',
      })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('settings.title')} size="full">
      <section className="settings-section">
        <h3>{t('settings.language')}</h3>
        <div className="segmented">
          <button
            type="button"
            className={lang === 'es' ? 'is-active' : ''}
            onClick={() => setLang('es')}
          >
            ES
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'is-active' : ''}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h3>{t('settings.durations')}</h3>
        <Stepper
          label={t('settings.focus')}
          value={settings.focusMin}
          min={5}
          max={90}
          step={5}
          suffix={t('settings.min')}
          onChange={(focusMin) => setSettings({ focusMin })}
        />
        <Stepper
          label={t('settings.short')}
          value={settings.shortMin}
          min={1}
          max={30}
          suffix={t('settings.min')}
          onChange={(shortMin) => setSettings({ shortMin })}
        />
        <Stepper
          label={t('settings.long')}
          value={settings.longMin}
          min={5}
          max={60}
          step={5}
          suffix={t('settings.min')}
          onChange={(longMin) => setSettings({ longMin })}
        />
        <Stepper
          label={t('settings.cycle')}
          value={settings.sessionsPerCycle}
          min={2}
          max={8}
          onChange={(sessionsPerCycle) => setSettings({ sessionsPerCycle })}
        />
        <Stepper
          label={t('settings.pauseLimit')}
          value={settings.pauseLimitMin}
          min={1}
          max={15}
          suffix={t('settings.min')}
          onChange={(pauseLimitMin) => setSettings({ pauseLimitMin })}
        />
      </section>

      <section className="settings-section">
        <Toggle
          label={t('settings.autoBreak')}
          checked={settings.autoStartBreaks}
          onChange={(autoStartBreaks) => setSettings({ autoStartBreaks })}
        />
        <Toggle
          label={t('settings.autoFocus')}
          checked={settings.autoStartFocus}
          onChange={(autoStartFocus) => setSettings({ autoStartFocus })}
        />
        <Toggle
          label={t('settings.sound')}
          checked={settings.sound}
          onChange={toggleSound}
        />
        <Toggle
          label={t('settings.notifications')}
          checked={settings.notifications}
          onChange={toggleNotifications}
        />
        <Toggle
          label={t('settings.reduceMotion')}
          checked={settings.reduceMotion}
          onChange={(reduceMotion) => setSettings({ reduceMotion })}
        />
      </section>

      <section className="settings-section">
        <h3>{t('settings.install')}</h3>
        {install.installed ? (
          <p className="settings-note">
            <Icon name="check" size={15} /> {t('common.installed')}
          </p>
        ) : install.canInstall ? (
          <PixelButton
            variant="secondary"
            block
            icon={<Icon name="download" size={16} />}
            onClick={() => void install.install()}
          >
            {t('pwa.install')}
          </PixelButton>
        ) : (
          <p className="settings-note">
            {install.ios ? t('settings.iosInstall') : t('settings.installHint')}
          </p>
        )}
        <p className="settings-note muted">{t('settings.offlineReady')}</p>
      </section>

      <section className="settings-section">
        <h3>{t('settings.about')}</h3>
        <p className="settings-note">{t('settings.aboutText')}</p>
        <p className="settings-note muted">{t('settings.localData')}</p>
        <p className="settings-version">
          {t('settings.version')} {VERSION}
        </p>
      </section>

      <section className="settings-section">
        {confirmReset ? (
          <div className="danger-box">
            <p>{t('settings.resetConfirm')}</p>
            <div className="danger-actions">
              <PixelButton
                variant="ghost"
                size="sm"
                onClick={() => setConfirmReset(false)}
              >
                {t('common.cancel')}
              </PixelButton>
              <PixelButton
                variant="danger"
                size="sm"
                onClick={() => {
                  resetAll()
                  setConfirmReset(false)
                  onClose()
                }}
              >
                {t('settings.resetYes')}
              </PixelButton>
            </div>
          </div>
        ) : (
          <PixelButton
            variant="ghost"
            block
            className="text-danger"
            onClick={() => setConfirmReset(true)}
          >
            {t('settings.reset')}
          </PixelButton>
        )}
      </section>
    </Modal>
  )
}

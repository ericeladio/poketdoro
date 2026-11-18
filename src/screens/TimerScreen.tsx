import { useState } from 'react'
import { useAppStore } from '../store/useAppStore.ts'
import { useI18n } from '../i18n/index.ts'
import { useNow } from '../hooks/useNow.ts'
import { usePetMood } from '../hooks/usePetMood.ts'
import { MODE_KEYS, remainingSeconds, timerProgress } from '../lib/timer.ts'
import { dayKey, formatClock } from '../lib/date.ts'
import { levelInfo, stageForXp } from '../lib/levels.ts'
import { pickDialogue } from '../data/dialogue.ts'
import { playChime } from '../lib/audio.ts'
import { ICONS } from '../data/icons.ts'
import { PetScene } from '../components/pet/PetScene.tsx'
import { ProgressRing } from '../components/ui/ProgressRing.tsx'
import { PixelButton } from '../components/ui/PixelButton.tsx'
import { PixelSprite } from '../components/ui/PixelSprite.tsx'
import { Icon } from '../components/ui/Icon.tsx'
import { InstallCard } from '../components/ui/InstallCard.tsx'
import { Modal } from '../components/ui/Modal.tsx'

const MODES = ['focus', 'short', 'long'] as const

export function TimerScreen() {
  const timer = useAppStore((s) => s.timer)
  const settings = useAppStore((s) => s.settings)
  const pet = useAppStore((s) => s.pet)
  const streak = useAppStore((s) => s.streak)
  const start = useAppStore((s) => s.start)
  const pause = useAppStore((s) => s.pause)
  const reset = useAppStore((s) => s.reset)
  const skipBreak = useAppStore((s) => s.skipBreak)
  const switchMode = useAppStore((s) => s.switchMode)
  const { t, lang } = useI18n()
  const mood = usePetMood()
  const now = useNow(250)
  const [confirmReset, setConfirmReset] = useState(false)

  const remaining = remainingSeconds(timer, now)
  const progress = timerProgress(timer, now)
  const stage = stageForXp(pet.xp)
  const dialogue = pickDialogue(
    mood,
    lang,
    Math.floor(now / 45_000) + pet.xp,
    pet.name,
  )

  const total = settings.sessionsPerCycle
  const position = timer.cycle % total
  const done = timer.cycle > 0 && position === 0 ? total : position

  const pauseLeft =
    timer.status === 'paused' && timer.pausedAt
      ? Math.max(
          0,
          Math.ceil(
            (settings.pauseLimitMin * 60_000 - (now - timer.pausedAt)) / 1000,
          ),
        )
      : null

  let hint =
    timer.mode === 'focus' ? t('timer.focusHint') : t('timer.breakHint')
  if (timer.status === 'running') {
    hint =
      timer.mode === 'focus' ? t('timer.runningHint') : t('timer.breakHint')
  }
  if (timer.status === 'paused') {
    hint = `${t('timer.pausedHint')}${pauseLeft !== null ? ` · ${pauseLeft}s` : ''}`
  }

  const streakAtRisk =
    streak.count > 0 && streak.lastDayKey !== dayKey(now)

  const tone =
    mood === 'sleeping'
      ? 'night'
      : timer.mode === 'focus'
        ? 'day'
        : timer.mode === 'long'
          ? 'night'
          : 'sunset'

  const primaryLabel =
    timer.status === 'running'
      ? t('timer.pause')
      : timer.status === 'paused'
        ? t('timer.resume')
        : t('timer.start')

  const handlePrimary = () => {
    if (timer.status === 'running') {
      pause()
      return
    }
    if (settings.sound) playChime('start')
    start()
  }

  return (
    <div className="screen screen-timer">
      <InstallCard />

      {streakAtRisk ? (
        <div className="risk-chip">
          <PixelSprite rows={ICONS.flame} size={15} />
          <span>{t('timer.streakRisk')}</span>
        </div>
      ) : null}

      <PetScene mood={mood} stage={stage} dialogue={dialogue} tone={tone}>
        <span className="scene-level">
          {t('pet.level', { level: levelInfo(pet.xp).level })}
        </span>
      </PetScene>

      <div className="timer-panel">
        <div className="timer-modes" role="tablist" aria-label={t('timer.focus')}>
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={timer.mode === mode}
              className={`timer-mode${timer.mode === mode ? ' is-active' : ''}`}
              onClick={() => switchMode(mode)}
            >
              {t(MODE_KEYS[mode])}
            </button>
          ))}
        </div>

        <ProgressRing
          value={progress}
          size={208}
          tone={timer.mode === 'focus' ? 'focus' : 'break'}
          paused={timer.status === 'paused'}
        >
          <span className="ring-mode">{t(MODE_KEYS[timer.mode])}</span>
          <span className="ring-clock">{formatClock(remaining)}</span>
          <span className="ring-goal">
            {t('timer.cycle', { done, total })}
          </span>
        </ProgressRing>

        <p className={`timer-hint${timer.status === 'paused' ? ' is-warn' : ''}`}>
          {hint}
        </p>

        <div className="timer-controls">
          {timer.status !== 'idle' ? (
            <button
              type="button"
              className="icon-btn icon-btn-lg"
              onClick={() => setConfirmReset(true)}
              aria-label={t('timer.reset')}
            >
              <Icon name="reset" size={19} />
            </button>
          ) : null}
          <PixelButton
            size="lg"
            className="timer-primary"
            icon={
              <Icon
                name={timer.status === 'running' ? 'pause' : 'play'}
                size={17}
              />
            }
            onClick={handlePrimary}
          >
            {primaryLabel}
          </PixelButton>
          {timer.mode !== 'focus' ? (
            <button
              type="button"
              className="icon-btn icon-btn-lg"
              onClick={skipBreak}
              aria-label={t('timer.skip')}
            >
              <Icon name="arrowRight" size={19} />
            </button>
          ) : null}
        </div>

        <div className="cycle-row">
          <span className="cycle-dots" aria-hidden>
            {Array.from({ length: total }, (_, index) => (
              <span
                key={index}
                className={`cycle-dot${index < done ? ' is-done' : ''}${
                  index === done && timer.mode === 'focus' ? ' is-current' : ''
                }`}
              />
            ))}
          </span>
          <span className="cycle-label">
            {t('timer.sessionGoal', { done, total })}
          </span>
        </div>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title={t('timer.reset')}
      >
        <p className="modal-text">{t('timer.failedBody')}</p>
        <div className="modal-actions">
          <PixelButton
            variant="ghost"
            onClick={() => setConfirmReset(false)}
          >
            {t('common.cancel')}
          </PixelButton>
          <PixelButton
            variant="danger"
            onClick={() => {
              reset()
              setConfirmReset(false)
            }}
          >
            {t('timer.reset')}
          </PixelButton>
        </div>
      </Modal>
    </div>
  )
}

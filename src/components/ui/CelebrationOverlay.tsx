import { AnimatePresence, motion } from 'motion/react'
import { useAppStore } from '../../store/useAppStore.ts'
import { useI18n } from '../../i18n/index.ts'
import { ACHIEVEMENTS } from '../../data/achievements.ts'
import { ICONS } from '../../data/icons.ts'
import { PixelSprite } from './PixelSprite.tsx'
import { PixelButton } from './PixelButton.tsx'

const STAGE_KEY = {
  hatchling: 'pet.stage.hatchling',
  drake: 'pet.stage.drake',
  emberwing: 'pet.stage.emberwing',
} as const

export function CelebrationOverlay() {
  const celebration = useAppStore((s) => s.celebration)
  const dismiss = useAppStore((s) => s.dismissCelebration)
  const { t } = useI18n()

  const achievement = celebration?.achievement
    ? ACHIEVEMENTS.find((item) => item.id === celebration.achievement)
    : undefined

  let title = ''
  let body = ''
  let icon: readonly string[] = ICONS.spark
  let tone: 'win' | 'fail' | 'break' = 'win'

  if (celebration) {
    if (celebration.kind === 'focus') {
      title = t('celebration.focusTitle')
      body = t('celebration.focusBody', {
        xp: celebration.xp,
        coins: celebration.coins,
      })
      icon = ICONS.star
    } else if (celebration.kind === 'levelup') {
      title = t('celebration.levelTitle', {
        level: celebration.level ?? 1,
      })
      body = t('celebration.levelBody', {
        stage: celebration.stage
          ? t(STAGE_KEY[celebration.stage])
          : t('pet.stage.hatchling'),
      })
      icon = ICONS.crown
    } else if (celebration.kind === 'achievement') {
      title = t('celebration.achievementTitle')
      body = achievement
        ? t('celebration.achievementBody', { name: t(achievement.titleKey) })
        : ''
      icon = achievement ? ICONS[achievement.icon] : ICONS.trophy
    } else if (celebration.kind === 'break') {
      title = t('celebration.breakTitle')
      body = t('celebration.breakBody')
      icon = ICONS.moon
      tone = 'break'
    } else {
      title = t('celebration.failedTitle')
      body = celebration.sick
        ? t('celebration.sickBody')
        : t('celebration.failedBody')
      icon = ICONS.drop
      tone = 'fail'
    }
  }

  return (
    <AnimatePresence>
      {celebration ? (
        <motion.div
          className="celebration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={dismiss}
        >
          <motion.div
            className={`celebration-card celebration-${tone}`}
            initial={{ y: 28, scale: 0.92, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="celebration-badge">
              <PixelSprite rows={icon} size={46} />
            </span>
            <h2>{title}</h2>
            {body ? <p className="celebration-body">{body}</p> : null}

            {celebration.kind !== 'break' &&
            celebration.kind !== 'failed' ? (
              <div className="celebration-rewards">
                {celebration.xp > 0 ? (
                  <span className="reward-chip">+{celebration.xp} XP</span>
                ) : null}
                {celebration.coins > 0 ? (
                  <span className="reward-chip reward-coin">
                    <PixelSprite rows={ICONS.coin} size={15} />+
                    {celebration.coins}
                  </span>
                ) : null}
              </div>
            ) : null}

            {celebration.healed ? (
              <p className="celebration-note">{t('pet.curedByFocus')}</p>
            ) : null}

            {celebration.streak && celebration.streak > 0 ? (
              <p className="celebration-note">
                {celebration.freezeUsed
                  ? t('celebration.streakKept', { n: celebration.streak })
                  : celebration.streak === 1
                    ? t('streak.oneDay')
                    : t('streak.days', { n: celebration.streak })}
              </p>
            ) : null}

            <PixelButton block onClick={dismiss}>
              {celebration.kind === 'failed'
                ? t('common.dismiss')
                : t('common.continue')}
            </PixelButton>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

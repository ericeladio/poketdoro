import { useAppStore } from '../store/useAppStore.ts'
import { useI18n } from '../i18n/index.ts'
import { useNow } from '../hooks/useNow.ts'
import { dayKey, formatMinutes, lastDays, shortWeekday } from '../lib/date.ts'
import { ACHIEVEMENTS } from '../data/achievements.ts'
import { ICONS } from '../data/icons.ts'
import type { QuestKind } from '../types.ts'
import { PixelButton } from '../components/ui/PixelButton.tsx'
import { PixelSprite } from '../components/ui/PixelSprite.tsx'
import { Icon } from '../components/ui/Icon.tsx'
import { shareRecap } from '../lib/share.ts'

const QUEST_ICONS: Record<QuestKind, readonly string[]> = {
  sessions: ICONS.bolt,
  minutes: ICONS.clock,
  care: ICONS.paw,
}

export function ProgressScreen() {
  const stats = useAppStore((s) => s.stats)
  const streak = useAppStore((s) => s.streak)
  const quests = useAppStore((s) => s.quests)
  const unlocked = useAppStore((s) => s.achievements)
  const claimQuest = useAppStore((s) => s.claimQuest)
  const showFlash = useAppStore((s) => s.showFlash)
  const { t, lang } = useI18n()
  const now = useNow(30_000)

  const days = lastDays(7, now)
  const today = dayKey(now)
  const values = days.map((key) => stats.focusByDay[key] ?? 0)
  const max = Math.max(25 * 60, ...values)
  const hasWeek = values.some((value) => value > 0)

  const handleShare = async () => {
    const minutes = Math.round(stats.todayFocusSec / 60)
    const result = await shareRecap(t('progress.shareText', { minutes }))
    if (result === 'copied') {
      showFlash({ tone: 'success', titleKey: 'progress.shareCopied' })
    } else if (result === 'failed') {
      showFlash({ tone: 'warn', titleKey: 'progress.shareFailed' })
    }
  }

  return (
    <div className="screen screen-progress">
      <header className="screen-head">
        <div>
          <span className="eyebrow">{t('progress.title')}</span>
          <h1>{t('progress.today')}</h1>
        </div>
        <PixelButton
          variant="ghost"
          size="sm"
          icon={<Icon name="share" size={15} />}
          onClick={() => void handleShare()}
        >
          {t('progress.share')}
        </PixelButton>
      </header>

      <section className="stat-grid">
        <div className="card stat-card">
          <span className="stat-label">{t('progress.focusToday')}</span>
          <strong className="stat-value">
            {formatMinutes(stats.todayFocusSec, lang)}
          </strong>
          <PixelSprite rows={ICONS.clock} size={20} className="stat-icon" />
        </div>
        <div className="card stat-card">
          <span className="stat-label">{t('progress.sessionsToday')}</span>
          <strong className="stat-value">{stats.todaySessions}</strong>
          <PixelSprite rows={ICONS.bolt} size={20} className="stat-icon" />
        </div>
        <div className="card stat-card">
          <span className="stat-label">{t('progress.streak')}</span>
          <strong className="stat-value">{streak.count}</strong>
          <PixelSprite rows={ICONS.flame} size={20} className="stat-icon" />
        </div>
        <div className="card stat-card">
          <span className="stat-label">{t('progress.bestStreak')}</span>
          <strong className="stat-value">{streak.best}</strong>
          <PixelSprite rows={ICONS.star} size={20} className="stat-icon" />
        </div>
      </section>

      <section className="card week-card">
        <div className="card-head">
          <h2>{t('progress.week')}</h2>
          <span className="card-chip">
            {formatMinutes(stats.totalFocusSec, lang)}
          </span>
        </div>
        <div className="week-chart">
          {days.map((key, index) => {
            const value = values[index] ?? 0
            const percent = max === 0 ? 0 : (value / max) * 100
            return (
              <div className="chart-col" key={key}>
                <span className="chart-bar-track">
                  <span
                    className={`chart-bar${key === today ? ' is-today' : ''}${
                      value === 0 ? ' is-empty' : ''
                    }`}
                    style={{ height: `${Math.max(4, percent)}%` }}
                    title={formatMinutes(value, lang)}
                  />
                </span>
                <span
                  className={`chart-day${key === today ? ' is-today' : ''}`}
                >
                  {shortWeekday(key, lang)}
                </span>
              </div>
            )
          })}
        </div>
        {!hasWeek ? (
          <p className="card-note">{t('progress.emptyWeek')}</p>
        ) : null}
        <div className="week-extra">
          <span>
            {t('progress.failures')}: {stats.failedSessions}
          </span>
          <span title={t('progress.freezeHint')}>
            {t('progress.freeze')}: {streak.freezes}
          </span>
        </div>
      </section>

      <section className="card quests-card">
        <div className="card-head">
          <h2>{t('progress.quests')}</h2>
          <PixelSprite rows={ICONS.gift} size={18} />
        </div>
        <ul className="quest-list">
          {quests.list.map((quest) => {
            const complete = quest.progress >= quest.target
            const percent = Math.round(
              (Math.min(quest.progress, quest.target) / quest.target) * 100,
            )
            const title =
              quest.kind === 'sessions'
                ? t('progress.quest.sessions', { n: quest.target })
                : quest.kind === 'minutes'
                  ? t('progress.quest.minutes', { n: quest.target })
                  : t('progress.quest.care', { n: quest.target })
            return (
              <li key={quest.id} className="quest">
                <span className="quest-icon">
                  <PixelSprite rows={QUEST_ICONS[quest.kind]} size={18} />
                </span>
                <span className="quest-mid">
                  <span className="quest-title">{title}</span>
                  <span className="quest-track">
                    <span
                      className="quest-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </span>
                  <span className="quest-meta">
                    {quest.progress}/{quest.target}
                  </span>
                </span>
                {quest.claimed ? (
                  <span className="quest-claimed">
                    <Icon name="check" size={13} /> {t('common.claimed')}
                  </span>
                ) : (
                  <PixelButton
                    size="sm"
                    variant={complete ? 'primary' : 'ghost'}
                    disabled={!complete}
                    onClick={() => claimQuest(quest.id)}
                  >
                    +{quest.reward}
                  </PixelButton>
                )}
              </li>
            )
          })}
        </ul>
        <p className="card-note">{t('progress.questsHint')}</p>
      </section>

      <section className="card achievements-card">
        <div className="card-head">
          <h2>{t('progress.achievements')}</h2>
          <span className="card-chip">
            {t('progress.achievementsCount', {
              done: unlocked.length,
              total: ACHIEVEMENTS.length,
            })}
          </span>
        </div>
        <ul className="ach-list">
          {ACHIEVEMENTS.map((def) => {
            const have = unlocked.includes(def.id)
            return (
              <li
                key={def.id}
                className={`ach-item${have ? ' is-unlocked' : ''}`}
              >
                <span className="ach-icon">
                  <PixelSprite rows={ICONS[def.icon]} size={20} />
                </span>
                <span className="ach-body">
                  <strong>{t(def.titleKey)}</strong>
                  <small>{t(def.descKey)}</small>
                </span>
                <span className="ach-reward">
                  {have ? (
                    <Icon name="check" size={14} />
                  ) : (
                    <>
                      <PixelSprite rows={ICONS.coin} size={12} />
                      {def.reward}
                    </>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

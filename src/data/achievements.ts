import type { I18nKey } from '../i18n/es.ts'
import type { IconName } from './icons.ts'

export interface AchievementDef {
  id: string
  icon: IconName
  titleKey: I18nKey
  descKey: I18nKey
  reward: number
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_focus',
    icon: 'spark',
    titleKey: 'ach.first_focus.title',
    descKey: 'ach.first_focus.desc',
    reward: 10,
  },
  {
    id: 'five_sessions',
    icon: 'flame',
    titleKey: 'ach.five_sessions.title',
    descKey: 'ach.five_sessions.desc',
    reward: 15,
  },
  {
    id: 'sessions_25',
    icon: 'trophy',
    titleKey: 'ach.sessions_25.title',
    descKey: 'ach.sessions_25.desc',
    reward: 30,
  },
  {
    id: 'minutes_100',
    icon: 'clock',
    titleKey: 'ach.minutes_100.title',
    descKey: 'ach.minutes_100.desc',
    reward: 20,
  },
  {
    id: 'minutes_1000',
    icon: 'crown',
    titleKey: 'ach.minutes_1000.title',
    descKey: 'ach.minutes_1000.desc',
    reward: 60,
  },
  {
    id: 'streak_3',
    icon: 'leaf',
    titleKey: 'ach.streak_3.title',
    descKey: 'ach.streak_3.desc',
    reward: 25,
  },
  {
    id: 'streak_7',
    icon: 'star',
    titleKey: 'ach.streak_7.title',
    descKey: 'ach.streak_7.desc',
    reward: 50,
  },
  {
    id: 'night_owl',
    icon: 'moon',
    titleKey: 'ach.night_owl.title',
    descKey: 'ach.night_owl.desc',
    reward: 15,
  },
  {
    id: 'early_bird',
    icon: 'sun',
    titleKey: 'ach.early_bird.title',
    descKey: 'ach.early_bird.desc',
    reward: 15,
  },
  {
    id: 'healer',
    icon: 'heart',
    titleKey: 'ach.healer.title',
    descKey: 'ach.healer.desc',
    reward: 20,
  },
  {
    id: 'level_5',
    icon: 'bolt',
    titleKey: 'ach.level_5.title',
    descKey: 'ach.level_5.desc',
    reward: 40,
  },
  {
    id: 'level_10',
    icon: 'spark',
    titleKey: 'ach.level_10.title',
    descKey: 'ach.level_10.desc',
    reward: 80,
  },
  {
    id: 'perfect_day',
    icon: 'star',
    titleKey: 'ach.perfect_day.title',
    descKey: 'ach.perfect_day.desc',
    reward: 30,
  },
]

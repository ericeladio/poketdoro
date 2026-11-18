import type { ReactNode } from 'react'
import type { Tab } from '../../types.ts'
import { useI18n } from '../../i18n/index.ts'
import { Icon } from './Icon.tsx'
import { PixelSprite } from './PixelSprite.tsx'
import { ICONS } from '../../data/icons.ts'

interface TabBarProps {
  active: Tab
  onChange: (tab: Tab) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  const { t } = useI18n()
  const items: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: 'timer', label: t('nav.timer'), icon: <Icon name="clock" size={20} /> },
    {
      id: 'pet',
      label: t('nav.pet'),
      icon: <PixelSprite rows={ICONS.egg} size={19} />,
    },
    {
      id: 'progress',
      label: t('nav.progress'),
      icon: <Icon name="chart" size={20} />,
    },
  ]

  return (
    <nav className="tabbar" aria-label={t('nav.label')}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`tabbar-item${active === item.id ? ' is-active' : ''}`}
          onClick={() => onChange(item.id)}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className="tabbar-icon">{item.icon}</span>
          <span className="tabbar-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

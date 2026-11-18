import type { ReactNode } from 'react'

interface ProgressRingProps {
  value: number
  size?: number
  stroke?: number
  tone?: 'focus' | 'break'
  paused?: boolean
  children: ReactNode
}

export function ProgressRing({
  value,
  size = 196,
  stroke = 12,
  tone = 'focus',
  paused = false,
  children,
}: ProgressRingProps) {
  const radius = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(1, Math.max(0, value)))
  const center = size / 2

  return (
    <div
      className={`ring ring-${tone}${paused ? ' ring-paused' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          className="ring-track"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="ring-progress"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="ring-content">{children}</div>
    </div>
  )
}

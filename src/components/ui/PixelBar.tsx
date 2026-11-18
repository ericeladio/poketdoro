import { Icon } from './Icon.tsx'
import { PixelSprite } from './PixelSprite.tsx'

interface PixelBarProps {
  label: string
  value: number
  color: string
  iconRows: readonly string[]
  hint?: string
  compact?: boolean
}

export function PixelBar({
  label,
  value,
  color,
  iconRows,
  hint,
  compact = false,
}: PixelBarProps) {
  const rounded = Math.round(Math.max(0, Math.min(100, value)))
  return (
    <div
      className={`statbar${compact ? ' statbar-compact' : ''}`}
      title={hint}
    >
      <span className="statbar-label">
        <PixelSprite rows={iconRows} size={compact ? 14 : 17} />
        <span>{label}</span>
      </span>
      <span className="statbar-track">
        <span
          className="statbar-fill"
          style={{ width: `${rounded}%`, background: color }}
        />
        <span className="statbar-shine" aria-hidden />
      </span>
      <span className="statbar-value">{rounded}</span>
    </div>
  )
}

interface StepperProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}

export function Stepper({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: StepperProps) {
  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <span className="stepper-controls">
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          aria-label={`${label} -`}
        >
          <Icon name="minus" size={14} />
        </button>
        <span className="stepper-value">
          {value}
          {suffix ? <small>{suffix}</small> : null}
        </span>
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          aria-label={`${label} +`}
        >
          <Icon name="plus" size={14} />
        </button>
      </span>
    </div>
  )
}

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Toggle({ label, checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      className={`toggle-row${checked ? ' is-on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-label">{label}</span>
      <span className="toggle" aria-hidden>
        <span className="toggle-knob" />
      </span>
    </button>
  )
}

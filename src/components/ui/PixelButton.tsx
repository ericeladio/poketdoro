import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  icon?: ReactNode
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  children,
  className = '',
  type = 'button',
  ...rest
}: PixelButtonProps) {
  return (
    <button
      type={type}
      className={`pbtn pbtn-${variant} pbtn-${size}${block ? ' pbtn-block' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {icon ? <span className="pbtn-icon">{icon}</span> : null}
      {children}
    </button>
  )
}

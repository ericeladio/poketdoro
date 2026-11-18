interface IconProps {
  name:
    | 'close'
    | 'check'
    | 'play'
    | 'pause'
    | 'reset'
    | 'settings'
    | 'bell'
    | 'sound'
    | 'globe'
    | 'download'
    | 'share'
    | 'edit'
    | 'plus'
    | 'minus'
    | 'arrowLeft'
    | 'arrowRight'
    | 'clock'
    | 'chart'
    | 'trophy'
    | 'lock'
    | 'moon'
    | 'sun'
  size?: number
  className?: string
}

export function Icon({ name, size = 18, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
    className,
    'aria-hidden': true,
    focusable: 'false' as const,
  }

  switch (name) {
    case 'close':
      return (
        <svg {...common}>
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="M3 8.5L6.5 12L13 4.5" />
        </svg>
      )
    case 'play':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M5 3l8 5-8 5z" />
        </svg>
      )
    case 'pause':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <rect x="4" y="3" width="3" height="10" />
          <rect x="9" y="3" width="3" height="10" />
        </svg>
      )
    case 'reset':
      return (
        <svg {...common}>
          <path d="M13 8a5 5 0 1 1-1.7-3.8M13 2v4h-4" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...common}>
          <path d="M2 5h12M2 11h12" />
          <circle cx="5.5" cy="5" r="1.8" fill="#FFFDF6" />
          <circle cx="10.5" cy="11" r="1.8" fill="#FFFDF6" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...common}>
          <path d="M8 2a4 4 0 0 1 4 4v3l1.5 2.5h-11L4 9V6a4 4 0 0 1 4-4z" />
          <path d="M6.5 13a1.6 1.6 0 0 0 3 0" />
        </svg>
      )
    case 'sound':
      return (
        <svg {...common}>
          <path d="M3 6h3l3-3v10l-3-3H3z" />
          <path d="M11 6a3 3 0 0 1 0 4M12.8 4.5a5.5 5.5 0 0 1 0 7" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.5" />
          <path d="M2.5 8h11M8 2.5c2.5 2 2.5 9 0 11M8 2.5c-2.5 2-2.5 9 0 11" />
        </svg>
      )
    case 'download':
      return (
        <svg {...common}>
          <path d="M8 2v8M4.5 7L8 10.5L11.5 7M3 13h10" />
        </svg>
      )
    case 'share':
      return (
        <svg {...common}>
          <path d="M8 2v8M4.5 5.5L8 2l3.5 3.5M3 10v3h10v-3" />
        </svg>
      )
    case 'edit':
      return (
        <svg {...common}>
          <path d="M3 12l1-3 7-7 2 2-7 7-3 1z" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...common}>
          <path d="M8 3v10M3 8h10" />
        </svg>
      )
    case 'minus':
      return (
        <svg {...common}>
          <path d="M3 8h10" />
        </svg>
      )
    case 'arrowLeft':
      return (
        <svg {...common}>
          <path d="M10 3L5 8l5 5" />
        </svg>
      )
    case 'arrowRight':
      return (
        <svg {...common}>
          <path d="M6 3l5 5-5 5" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.5" />
          <path d="M8 4.5V8l2.5 1.5" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common}>
          <path d="M3 13V7M8 13V3M13 13V9M2 13.5h12" />
        </svg>
      )
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M5 3h6v4a3 3 0 0 1-6 0V3z" />
          <path d="M5 4H3v1a2 2 0 0 0 2 2M11 4h2v1a2 2 0 0 1-2 2M8 10v3M5.5 13h5" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="7" width="8" height="6" />
          <path d="M6 7V5a2 2 0 0 1 4 0v2" />
        </svg>
      )
    case 'moon':
      return (
        <svg {...common}>
          <path d="M11.5 10.5A5 5 0 0 1 5 4a5 5 0 1 0 6.5 6.5z" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M13 3l-1.4 1.4M4.4 11.6L3 13" />
        </svg>
      )
    default:
      return null
  }
}

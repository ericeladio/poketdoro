import { useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore.ts'

interface Piece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
  size: number
  rotate: number
}

const COLORS = ['#4FC96E', '#FFD25A', '#F5A33C', '#F58FA3', '#3C6FE0', '#8AE79B']

function makePieces(burst: number): Piece[] {
  return Array.from({ length: 44 }, (_, index) => ({
    id: burst * 1000 + index,
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    duration: 1.5 + Math.random() * 0.9,
    color: COLORS[index % COLORS.length] ?? '#4FC96E',
    size: 5 + Math.round(Math.random() * 6),
    rotate: Math.round(Math.random() * 360),
  }))
}

export function Confetti() {
  const burst = useAppStore((s) => s.burst)
  const reduceMotion = useAppStore((s) => s.settings.reduceMotion)

  const pieces = useMemo(() => {
    if (burst === 0 || reduceMotion) return []
    return makePieces(burst)
  }, [burst, reduceMotion])

  if (pieces.length === 0) return null

  return (
    <div className="confetti" key={burst} aria-hidden>
      {pieces.map((piece) => (
        <i
          key={piece.id}
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            rotate: `${piece.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}

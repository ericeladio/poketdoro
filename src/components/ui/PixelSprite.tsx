import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { svgRectForRows } from '../../lib/pixel.ts'
import { PIXEL_PALETTE } from '../../data/icons.ts'

interface PixelSpriteProps {
  rows: readonly string[]
  palette?: Record<string, string>
  size?: number | string
  className?: string
  title?: string
  style?: CSSProperties
}

export function PixelSprite({
  rows,
  palette = PIXEL_PALETTE,
  size,
  className,
  title,
  style,
}: PixelSpriteProps) {
  const width = rows[0]?.length ?? 8
  const height = rows.length
  const rects = useMemo(
    () => svgRectForRows(rows, palette),
    [rows, palette],
  )
  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {rects.map((rect, index) => (
        <rect
          key={index}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={1}
          fill={rect.fill}
        />
      ))}
    </svg>
  )
}

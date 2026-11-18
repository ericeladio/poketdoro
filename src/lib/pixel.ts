export type PixelGrid = string[][]

export function createGrid(width: number, height: number, fill = '.'): PixelGrid {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => fill),
  )
}

export function setPixel(
  grid: PixelGrid,
  x: number,
  y: number,
  ch: string,
): void {
  if (y < 0 || y >= grid.length) return
  const row = grid[y]
  if (!row || x < 0 || x >= row.length) return
  row[Math.round(x)] = ch
}

export function fillRect(
  grid: PixelGrid,
  x: number,
  y: number,
  width: number,
  height: number,
  ch: string,
): void {
  for (let yy = Math.round(y); yy < Math.round(y + height); yy += 1) {
    for (let xx = Math.round(x); xx < Math.round(x + width); xx += 1) {
      setPixel(grid, xx, yy, ch)
    }
  }
}

export function fillEllipse(
  grid: PixelGrid,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  ch: string,
): void {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
      const dx = (x + 0.5 - cx) / rx
      const dy = (y + 0.5 - cy) / ry
      if (dx * dx + dy * dy <= 1) setPixel(grid, x, y, ch)
    }
  }
}

export function rowsFromGrid(grid: PixelGrid): string[] {
  return grid.map((row) => row.join(''))
}

export interface PixelRect {
  x: number
  y: number
  width: number
  fill: string
}

export function svgRectForRows(
  rows: readonly string[],
  palette: Record<string, string>,
): PixelRect[] {
  const rects: PixelRect[] = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      if (ch === '.' || !palette[ch]) {
        x += 1
        continue
      }
      const fill = palette[ch]
      let width = 1
      while (
        x + width < row.length &&
        row[x + width] === ch &&
        palette[ch] === fill
      ) {
        width += 1
      }
      rects.push({ x, y, width, fill })
      x += width
    }
  })
  return rects
}

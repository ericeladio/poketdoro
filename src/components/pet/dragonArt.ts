import {
  createGrid,
  fillEllipse,
  fillRect,
  rowsFromGrid,
  setPixel,
} from '../../lib/pixel.ts'

export const DRAGON_PALETTE: Record<string, string> = {
  k: '#1C3527',
  g: '#4FC96E',
  l: '#8AE79B',
  d: '#2F9455',
  c: '#F5E7C6',
  C: '#E4CFA6',
  b: '#3C6FE0',
  n: '#2A55B8',
  w: '#FFFFFF',
  y: '#FFD25A',
  o: '#F5A33C',
  p: '#F58FA3',
}

function buildBody(): string[] {
  const g = createGrid(32, 32)

  fillEllipse(g, 23.0, 26.6, 2.8, 2.2, 'k')
  fillEllipse(g, 26.2, 26.2, 2.4, 2.6, 'k')
  fillEllipse(g, 28.3, 23.6, 2.0, 2.8, 'k')
  fillEllipse(g, 29.0, 20.6, 1.7, 2.6, 'k')


  fillEllipse(g, 9.0, 22.6, 2.6, 3.4, 'k')
  fillEllipse(g, 23.0, 22.6, 2.6, 3.4, 'k')

  fillEllipse(g, 16, 22.9, 5.6, 5.6, 'k')

  fillEllipse(g, 8.2, 6.8, 3.2, 3.7, 'k')
  fillEllipse(g, 23.8, 6.8, 3.2, 3.7, 'k')

  fillEllipse(g, 16, 11.2, 8.8, 7.4, 'k')

  fillEllipse(g, 23.0, 26.6, 2.2, 1.6, 'g')
  fillEllipse(g, 26.2, 26.2, 1.8, 2.0, 'g')
  fillEllipse(g, 28.3, 23.6, 1.4, 2.2, 'g')
  fillEllipse(g, 29.0, 20.6, 1.1, 2.0, 'g')


  fillEllipse(g, 9.0, 22.6, 1.9, 2.7, 'g')
  fillEllipse(g, 23.0, 22.6, 1.9, 2.7, 'g')

  fillEllipse(g, 16, 22.9, 4.8, 5.0, 'g')

  fillEllipse(g, 8.2, 6.8, 2.6, 3.1, 'g')
  fillEllipse(g, 23.8, 6.8, 2.6, 3.1, 'g')

  fillEllipse(g, 16, 11.2, 8.0, 6.6, 'g')

  fillEllipse(g, 16, 23.6, 2.9, 4.0, 'c')
  fillEllipse(g, 16, 18.9, 2.3, 1.7, 'c')
  fillEllipse(g, 16, 16.3, 2.7, 1.6, 'c')

  fillEllipse(g, 12.9, 28.6, 2.8, 1.8, 'k')
  fillEllipse(g, 19.1, 28.6, 2.8, 1.8, 'k')
  fillEllipse(g, 12.9, 28.6, 2.1, 1.2, 'g')
  fillEllipse(g, 19.1, 28.6, 2.1, 1.2, 'g')

  fillRect(g, 14, 22, 5, 1, 'C')
  fillRect(g, 14, 25, 5, 1, 'C')

  setPixel(g, 13, 16, 'k')
  setPixel(g, 14, 17, 'k')
  setPixel(g, 15, 17, 'k')
  setPixel(g, 16, 17, 'k')
  setPixel(g, 17, 17, 'k')
  setPixel(g, 18, 16, 'k')

  fillRect(g, 8, 14, 2, 1, 'p')
  fillRect(g, 22, 14, 2, 1, 'p')

  fillRect(g, 12, 6, 2, 1, 'c')
  fillRect(g, 18, 6, 2, 1, 'c')

  setPixel(g, 10, 9, 'l')
  setPixel(g, 22, 9, 'l')
  setPixel(g, 16, 8, 'l')
  setPixel(g, 27, 25, 'l')
  setPixel(g, 28, 21, 'l')
  setPixel(g, 24, 20, 'l')
  setPixel(g, 8, 21, 'l')
  setPixel(g, 24, 21, 'l')

  return rowsFromGrid(g)
}

function buildEyes(): string[] {
  const g = createGrid(32, 32)

  fillEllipse(g, 12.1, 11.9, 3.1, 3.4, 'k')
  fillEllipse(g, 19.9, 11.9, 3.1, 3.4, 'k')
  fillEllipse(g, 12.1, 11.9, 2.3, 2.7, 'b')
  fillEllipse(g, 19.9, 11.9, 2.3, 2.7, 'b')
  fillEllipse(g, 12.1, 13.4, 1.8, 0.8, 'n')
  fillEllipse(g, 19.9, 13.4, 1.8, 0.8, 'n')

  fillRect(g, 10, 9, 2, 2, 'w')
  fillRect(g, 17, 9, 2, 2, 'w')
  setPixel(g, 13, 13, 'n')
  setPixel(g, 20, 13, 'n')

  return rowsFromGrid(g)
}

function buildWings(): string[] {
  const g = createGrid(32, 32)

  fillEllipse(g, 3.8, 20.4, 3.9, 4.8, 'k')
  fillEllipse(g, 28.2, 20.4, 3.9, 4.8, 'k')

  fillEllipse(g, 3.8, 20.4, 3.1, 3.9, 'd')
  fillEllipse(g, 28.2, 20.4, 3.1, 3.9, 'd')

  fillEllipse(g, 3.4, 19.4, 1.2, 1.9, 'l')
  fillEllipse(g, 28.6, 19.4, 1.2, 1.9, 'l')

  setPixel(g, 2, 23, 'g')
  setPixel(g, 4, 24, 'g')
  setPixel(g, 30, 23, 'g')
  setPixel(g, 28, 24, 'g')

  return rowsFromGrid(g)
}

function buildFlame(): string[] {
  const g = createGrid(32, 32)

  fillEllipse(g, 29.2, 17.4, 2.1, 3.7, 'k')
  fillEllipse(g, 29.2, 17.4, 1.5, 3.0, 'y')
  fillEllipse(g, 29.2, 18.2, 0.9, 1.9, 'o')
  fillEllipse(g, 29.2, 19.2, 0.45, 0.8, 'y')
  setPixel(g, 29, 14, 'y')
  setPixel(g, 28, 15, 'o')
  setPixel(g, 30, 15, 'o')

  return rowsFromGrid(g)
}

function buildCrest(): string[] {
  const g = createGrid(32, 32)

  fillEllipse(g, 16, 2.8, 1.7, 2.7, 'k')
  fillEllipse(g, 16, 2.6, 1.2, 2.1, 'y')
  fillEllipse(g, 16, 3.4, 0.7, 1.1, 'o')
  setPixel(g, 16, 0, 'y')
  setPixel(g, 15, 1, 'o')
  setPixel(g, 17, 1, 'o')

  return rowsFromGrid(g)
}

export const DRAGON_BODY = buildBody()
export const DRAGON_EYES = buildEyes()
export const DRAGON_WINGS = buildWings()
export const DRAGON_FLAME = buildFlame()
export const DRAGON_CREST = buildCrest()

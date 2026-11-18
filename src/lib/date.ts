const pad = (n: number) => String(n).padStart(2, '0')

export function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function shiftDay(ts: number, days: number): number {
  const d = new Date(ts)
  d.setDate(d.getDate() + days)
  return d.getTime()
}

export function dayGap(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split('-').map(Number)
  const [ty, tm, td] = toKey.split('-').map(Number)
  const from = new Date(fy, fm - 1, fd).getTime()
  const to = new Date(ty, tm - 1, td).getTime()
  return Math.round((to - from) / 86_400_000)
}

export function formatClock(totalSec: number): string {
  const safe = Math.max(0, Math.ceil(totalSec))
  const min = Math.floor(safe / 60)
  const sec = safe % 60
  return `${pad(min)}:${pad(sec)}`
}

export function formatMinutes(totalSec: number, lang: string): string {
  const min = Math.round(totalSec / 60)
  return `${min} ${lang === 'es' ? 'min' : 'min'}`
}

export function shortWeekday(key: string, lang: string): string {
  const [y, m, d] = key.split('-').map(Number)
  return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en', {
    weekday: 'short',
  })
    .format(new Date(y, m - 1, d))
    .replace('.', '')
}

export function lastDays(count: number, now: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    dayKey(shiftDay(now, i - (count - 1))),
  )
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

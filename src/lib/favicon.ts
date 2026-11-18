let link: HTMLLinkElement | null = null

function faviconLink(): HTMLLinkElement | null {
  if (typeof document === 'undefined') return null
  if (!link) {
    link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
  }
  return link
}

export function setFavicon(label: string | null, focus = true) {
  const element = faviconLink()
  if (!element) return
  if (!label) {
    element.type = 'image/svg+xml'
    element.href = '/favicon.svg'
    return
  }
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = focus ? '#1F4D3A' : '#F5A33C'
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = focus ? '#8AE79B' : '#FFD25A'
  ctx.lineWidth = 8
  ctx.strokeRect(4, 4, size - 8, size - 8)
  ctx.fillStyle = '#F6EFE1'
  ctx.font = '600 42px "Silkscreen", ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, size / 2, size / 2 + 2)
  element.type = 'image/png'
  element.href = canvas.toDataURL('image/png')
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed'

export async function shareRecap(text: string): Promise<ShareResult> {
  if (typeof navigator === 'undefined') return 'failed'

  if ('share' in navigator) {
    try {
      await navigator.share({ title: 'PoketDoro', text })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled'
      }
    }
  }

  if ('clipboard' in navigator) {
    try {
      await navigator.clipboard.writeText(text)
      return 'copied'
    } catch {
      return 'failed'
    }
  }

  return 'failed'
}

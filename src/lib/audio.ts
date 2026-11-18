type Chime = 'start' | 'complete' | 'fail' | 'click' | 'heal'

let context: AudioContext | null = null

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) return null
    context = new Ctor()
  }
  if (context.state === 'suspended') {
    void context.resume()
  }
  return context
}

const SEQUENCES: Record<Chime, { notes: number[]; step: number; gain: number }> = {
  start: { notes: [523, 659], step: 0.1, gain: 0.05 },
  complete: { notes: [523, 659, 784, 1047], step: 0.11, gain: 0.06 },
  fail: { notes: [392, 330, 262], step: 0.14, gain: 0.05 },
  click: { notes: [880], step: 0, gain: 0.03 },
  heal: { notes: [659, 880, 1175], step: 0.09, gain: 0.05 },
}

export function playChime(kind: Chime) {
  const ctx = audioContext()
  if (!ctx) return
  const sequence = SEQUENCES[kind]
  const start = ctx.currentTime + 0.02
  sequence.notes.forEach((frequency, index) => {
    const at = start + index * sequence.step
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(frequency, at)
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(sequence.gain, at + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16)
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(at)
    oscillator.stop(at + 0.18)
  })
}

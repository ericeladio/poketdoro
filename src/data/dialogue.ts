import type { Lang, Mood } from '../types.ts'

export const DIALOGUE: Record<Mood, Record<Lang, string[]>> = {
  happy: {
    es: [
      '¡Hoy se siente un gran día para enfocarse!',
      'Estoy listo. ¿Empezamos otra sesión?',
      'Se siente bien tenerte cerca, {name}.',
      '¡Mira cuánto he crecido gracias a ti!',
    ],
    en: [
      'Today feels like a great day to focus!',
      'I am ready. Shall we start another session?',
      'It feels good to have you around, {name}.',
      'Look how much I have grown thanks to you!',
    ],
  },
  neutral: {
    es: [
      'Te observo desde aquí. Tú puedes.',
      'Una sesión más y me pongo contento.',
      'Sin distracciones. Solo tú y yo.',
      '¿Enfocados? Yo me quedo quietecito.',
    ],
    en: [
      'I am watching from here. You got this.',
      'One more session and I will cheer up.',
      'No distractions. Just you and me.',
      'Focusing? I will stay right here.',
    ],
  },
  hungry: {
    es: [
      'Tengo un poco de hambre, {name}...',
      'Completar enfoques también me alimenta.',
      '¿Me das algo de comer cuando termines?',
      'Mi pancita está haciendo ruido.',
    ],
    en: [
      'I am a little hungry, {name}...',
      'Completing focus sessions feeds me too.',
      'Will you feed me when you are done?',
      'My tummy is rumbling.',
    ],
  },
  tired: {
    es: [
      'Estoy cansado. Un descanso nos vendría bien.',
      'Bostezo... pero sigo aquí contigo.',
      'Descansemos un momento, ¿sí?',
      'Necesito dormir un poquito.',
    ],
    en: [
      'I am tired. A break would do us good.',
      'Yawn... but I am still here with you.',
      'Let us rest for a moment, okay?',
      'I need a little nap.',
    ],
  },
  sick: {
    es: [
      'Me siento mal... completa un enfoque para curarme.',
      'Abandonaste la sesión y me dio fiebre.',
      'Un poco de medicina y vuelvo a volar.',
      'No me dejes así, {name}.',
    ],
    en: [
      'I feel sick... complete a focus session to heal me.',
      'You abandoned the session and I got a fever.',
      'Some medicine and I will fly again.',
      'Do not leave me like this, {name}.',
    ],
  },
  sleeping: {
    es: ['Zzz...', 'Sueño con volcanes y estrellas...', 'Cinco minutitos más...'],
    en: ['Zzz...', 'Dreaming of volcanoes and stars...', 'Five more minutes...'],
  },
  celebrating: {
    es: [
      '¡Lo lograste! ¡Qué orgullo!',
      '¡Más fuerte, más listo, más enfocado!',
      '¡Ese enfoque me dio energía!',
      '¡Vamos por otro!',
    ],
    en: [
      'You did it! I am so proud!',
      'Stronger, smarter, more focused!',
      'That focus gave me energy!',
      'Let us go for another one!',
    ],
  },
}

export function pickDialogue(
  mood: Mood,
  lang: Lang,
  seed: number,
  name: string,
): string {
  const lines = DIALOGUE[mood][lang]
  const raw = lines[Math.abs(seed) % lines.length] ?? lines[0]
  return raw.replaceAll('{name}', name)
}

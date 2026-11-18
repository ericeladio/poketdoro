import { describe, expect, it } from 'vitest'
import { en } from './en.ts'
import { es } from './es.ts'

function placeholders(value: string): string[] {
  return Array.from(value.matchAll(/\{(\w+)\}/g), (match) => match[1] ?? '').sort()
}

describe('dictionaries', () => {
  it('has the same keys in both languages', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort())
  })

  it('has no empty translations', () => {
    for (const [key, value] of Object.entries(es)) {
      expect(value.length, `es:${key}`).toBeGreaterThan(0)
    }
    for (const [key, value] of Object.entries(en)) {
      expect(value.length, `en:${key}`).toBeGreaterThan(0)
    }
  })

  it('keeps placeholders aligned', () => {
    for (const key of Object.keys(es) as (keyof typeof es)[]) {
      expect(placeholders(en[key]), key).toEqual(placeholders(es[key]))
    }
  })
})

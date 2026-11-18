import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore.ts'
import { en } from './en.ts'
import { es } from './es.ts'
import type { I18nKey } from './es.ts'
import type { Lang } from '../types.ts'

export type { I18nKey }

const dictionaries = { es, en }

export type TFunction = (
  key: I18nKey,
  params?: Record<string, string | number>,
) => string

export function translate(
  lang: Lang,
  key: I18nKey,
  params?: Record<string, string | number>,
): string {
  const raw = dictionaries[lang][key] ?? key
  if (!params) return raw
  return raw.replace(/\{(\w+)\}/g, (_, name: string) =>
    params[name] !== undefined ? String(params[name]) : `{${name}}`,
  )
}

export function useI18n(): { lang: Lang; t: TFunction } {
  const lang = useAppStore((s) => s.lang)
  const t = useCallback<TFunction>(
    (key, params) => translate(lang, key, params),
    [lang],
  )
  return { lang, t }
}

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Locale } from '../lib/types'
import { siteConfig } from '../data/siteConfig'
import { en } from './en'
import { ar } from './ar'

export type Dictionary = typeof en

const dictionaries: Record<Locale, Dictionary> = { en, ar }

interface LocaleContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  isRtl: boolean
  t: Dictionary
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'ar'
}

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(siteConfig.localeStorageKey)
    return isLocale(stored) ? stored : null
  } catch {
    return null
  }
}

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const queryLocale = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(queryLocale)) return queryLocale

  const stored = readStoredLocale()
  if (stored) return stored

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]

  return browserLanguages.some((language) => language.toLowerCase().startsWith('ar'))
    ? 'ar'
    : 'en'
}

function applyDocumentLocale(locale: Locale) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = locale
  document.documentElement.dir = dir
  document.documentElement.dataset.locale = locale
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const isRtl = locale === 'ar'

  useLayoutEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    applyDocumentLocale(nextLocale)

    try {
      window.localStorage.setItem(siteConfig.localeStorageKey, nextLocale)
    } catch {
      // Language still works for this session if storage is unavailable.
    }

    // Keep the URL shareable without triggering a reload or losing the route.
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', nextLocale)
      window.history.replaceState(window.history.state, '', url)
    } catch {
      // URL updates are a progressive enhancement.
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en')
  }, [locale, setLocale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir,
      isRtl,
      t: dictionaries[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, dir, isRtl, setLocale, toggleLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext)
  if (!value) {
    throw new Error('useLocale must be used inside LocaleProvider')
  }
  return value
}

import { useEffect } from 'react'
import { siteConfig } from '../data/siteConfig'
import { useLocale } from '../i18n/LocaleContext'

interface PageMeta {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function absoluteAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return siteConfig.siteUrl ? `${siteConfig.siteUrl}${path}` : path
}

export function usePageMeta({
  title,
  description,
  image = '/media/og-cover.jpg',
  type = 'website',
  noIndex = false,
}: PageMeta) {
  const { locale } = useLocale()

  useEffect(() => {
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', absoluteAssetUrl(image))
    upsertMeta('property', 'og:locale', locale === 'ar' ? 'ar_AR' : 'en_US')
    upsertMeta(
      'property',
      'og:locale:alternate',
      locale === 'ar' ? 'en_US' : 'ar_AR',
    )
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', absoluteAssetUrl(image))
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (siteConfig.siteUrl) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = `${siteConfig.siteUrl}${window.location.pathname}`
    } else if (canonical) {
      canonical.remove()
    }
  }, [title, description, image, type, noIndex, locale])
}

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

export function toCssAspectRatio(value: string): string {
  return value.replace(':', ' / ')
}

export function isLandscapeAspect(value: string): boolean {
  const [width, height] = value.split(':').map(Number)
  return Number.isFinite(width) && Number.isFinite(height) && width > height
}

export async function copyText(value: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      // Fall through to the legacy path.
    }
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    textarea.remove()
    return copied
  } catch {
    return false
  }
}

export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  const element = document.getElementById(id)
  if (!element) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({
    behavior: reduceMotion ? 'auto' : behavior,
    block: 'start',
  })
}

export function todayISODate(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

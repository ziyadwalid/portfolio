import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }

    const targetId = decodeURIComponent(hash.slice(1))
    const focusTimer = window.setTimeout(() => {
      const target = document.getElementById(targetId)
      if (!target) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        return
      }

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    }, 50)

    return () => window.clearTimeout(focusTimer)
  }, [pathname, hash])

  return null
}

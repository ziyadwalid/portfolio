import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu } from 'lucide-react'
import { useLocale } from '../i18n/LocaleContext'
import { cn } from '../lib/utils'
import { Brand } from './Brand'
import { LanguageToggle } from './LanguageToggle'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const { t } = useLocale()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: t.nav.work, to: '/#work' },
    { label: t.nav.about, to: '/#about' },
    { label: t.nav.services, to: '/#services' },
    { label: t.nav.contact, to: '/#contact' },
  ]

  return (
    <>
      <header className={cn('site-header', scrolled && 'is-scrolled')}>
        <div className="site-header__inner site-container">
          <Brand />

          <nav className="desktop-nav" aria-label={t.nav.menuLabel}>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="desktop-nav__link">
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <LanguageToggle className="site-header__language" />
            <Link to="/cv" className="desktop-nav__cv">
              {t.nav.cv}
            </Link>
            <Link to="/#contact" className="header-cta">
              <span>{t.nav.startProject}</span>
              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="icon-directional"
                aria-hidden="true"
              />
            </Link>
            <button
              type="button"
              className="menu-toggle"
              aria-label={t.nav.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={21} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

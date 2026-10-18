import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useLocale } from '../i18n/LocaleContext'
import { siteConfig } from '../data/siteConfig'
import { Brand } from './Brand'
import { LanguageToggle } from './LanguageToggle'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const socialKeys = ['whatsapp', 'instagram', 'tiktok'] as const

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useLocale()
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  useFocusTrap(open, panelRef, onClose)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const desktopQuery = window.matchMedia('(min-width: 921px)')
    const handleChange = () => {
      if (desktopQuery.matches) onClose()
    }
    desktopQuery.addEventListener('change', handleChange)
    return () => desktopQuery.removeEventListener('change', handleChange)
  }, [open, onClose])

  const navLinks = [
    { label: t.nav.work, to: '/#work', index: '01' },
    { label: t.nav.about, to: '/#about', index: '02' },
    { label: t.nav.services, to: '/#services', index: '03' },
    { label: t.nav.contact, to: '/#contact', index: '04' },
    { label: t.nav.cv, to: '/cv', index: '05' },
  ]

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          className="mobile-menu"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
        >
          <motion.div
            ref={panelRef}
            className="mobile-menu__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            tabIndex={-1}
            initial={reduceMotion ? false : { y: -16 }}
            animate={{ y: 0 }}
            exit={reduceMotion ? undefined : { y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu__top">
              <Brand onNavigate={onClose} />
              <div className="mobile-menu__top-actions">
                <LanguageToggle />
                <button
                  type="button"
                  className="icon-button"
                  onClick={onClose}
                  aria-label={t.nav.closeMenu}
                  data-autofocus
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mobile-menu__title-row">
              <span id="mobile-menu-title" className="eyebrow">
                {t.nav.menu}
              </span>
              <span className="mobile-menu__meta">ZIAD V.D</span>
            </div>

            <nav className="mobile-menu__nav" aria-label={t.nav.menuLabel}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="mobile-menu__link"
                  onClick={onClose}
                >
                  <span className="mobile-menu__link-index">{link.index}</span>
                  <span>{link.label}</span>
                  <ArrowRight
                    size={22}
                    strokeWidth={1.5}
                    className="icon-directional"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>

            <div className="mobile-menu__bottom">
              <Link to="/#contact" className="button button--accent" onClick={onClose}>
                <span>{t.nav.startProject}</span>
                <ArrowUpRight size={18} className="icon-directional" aria-hidden="true" />
              </Link>
              <div className="mobile-menu__socials">
                <span className="eyebrow">{t.footer.socials}</span>
                <div>
                  {socialKeys.map((key) => (
                    <a
                      key={key}
                      href={siteConfig.socials[key]}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${t.contact[key]} — ${t.common.externalLink}`}
                    >
                      {t.contact[key]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

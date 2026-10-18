import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'
import { useLocale } from '../i18n/LocaleContext'
import { Brand } from './Brand'

const socialKeys = ['whatsapp', 'instagram', 'tiktok'] as const

export function Footer() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  const backToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer__top">
          <div className="site-footer__intro">
            <Brand />
            <p className="site-footer__statement">{t.footer.statement}</p>
          </div>
          <div className="site-footer__contact">
            <span className="eyebrow">{t.contact.eyebrow}</span>
            <p>{t.contact.titleA}</p>
            <Link to="/#contact" className="text-link text-link--large">
              <span>{t.nav.startProject}</span>
              <ArrowUpRight size={18} className="icon-directional" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__section">
            <span className="eyebrow">{t.footer.socials}</span>
            <div className="site-footer__links">
              {socialKeys.map((key) => (
                <a
                  key={key}
                  href={siteConfig.socials[key]}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-link"
                >
                  <span>{t.contact[key]}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer__section">
            <span className="eyebrow">{t.footer.explore}</span>
            <div className="site-footer__links">
              <Link to="/#work" className="text-link">
                {t.nav.work}
              </Link>
              <Link to="/#about" className="text-link">
                {t.nav.about}
              </Link>
              <Link to="/#services" className="text-link">
                {t.nav.services}
              </Link>
              <Link to="/cv" className="text-link">
                {t.nav.cv}
              </Link>
            </div>
          </div>

          <div className="site-footer__section site-footer__section--meta">
            <span className="eyebrow">{t.footer.availability}</span>
            <button type="button" className="back-to-top" onClick={backToTop}>
              <span>{t.footer.backToTop}</span>
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="site-footer__wordmark" aria-hidden="true">
          ZIAD V.D
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {siteConfig.name}. {t.footer.rights}
          </p>
          <p>{t.footer.builtNote}</p>
        </div>
      </div>
    </footer>
  )
}

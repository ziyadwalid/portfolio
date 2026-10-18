import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useLocale } from '../i18n/LocaleContext'
import { Reveal } from './Reveal'

export function ContactBanner() {
  const { t } = useLocale()

  return (
    <section className="contact-banner section-shell" aria-labelledby="project-contact-title">
      <div className="site-container">
        <Reveal>
          <div className="contact-banner__inner">
            <span className="eyebrow">{t.project.contactEyebrow}</span>
            <h2 id="project-contact-title">{t.project.contactTitle}</h2>
            <p>{t.project.contactBody}</p>
            <Link to="/#contact" className="button button--accent">
              <span>{t.project.contactButton}</span>
              <ArrowUpRight size={18} className="icon-directional" aria-hidden="true" />
            </Link>
            <span className="contact-banner__mark" aria-hidden="true">
              ✦
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

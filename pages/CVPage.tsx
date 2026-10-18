import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Download, Printer } from 'lucide-react'
import { cvData } from '../data/cv'
import { projects } from '../data/projects'
import { services } from '../data/services'
import { siteConfig } from '../data/siteConfig'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLocale } from '../i18n/LocaleContext'
import { BrandGlyph } from '../components/Brand'

export default function CVPage() {
  const { locale, t } = useLocale()
  const sheetRef = useRef<HTMLElement>(null)
  const isPdfExport =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('export') === 'pdf'

  usePageMeta({
    title: t.meta.cvTitle,
    description: t.meta.cvDescription,
  })

  // The spotlight is a progressive enhancement: no pointer, no problem.
  // Touch and reduced-motion users get the same readable sheet without it.
  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const resetSpotlight = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      sheet.classList.remove('is-pointer-active')
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return
      if (event.pointerType && event.pointerType !== 'mouse') return
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const rect = sheet.getBoundingClientRect()
        sheet.style.setProperty('--cv-pointer-x', `${Math.round(event.clientX - rect.left)}px`)
        sheet.style.setProperty('--cv-pointer-y', `${Math.round(event.clientY - rect.top)}px`)
        sheet.classList.add('is-pointer-active')
        frame = 0
      })
    }

    const handleMotionPreference = () => {
      if (reducedMotion.matches) resetSpotlight()
    }

    sheet.addEventListener('pointermove', handlePointerMove, { passive: true })
    sheet.addEventListener('pointerleave', resetSpotlight)
    reducedMotion.addEventListener('change', handleMotionPreference)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      sheet.removeEventListener('pointermove', handlePointerMove)
      sheet.removeEventListener('pointerleave', resetSpotlight)
      reducedMotion.removeEventListener('change', handleMotionPreference)
    }
  }, [])

  const selectedProjects = cvData.selectedProjectSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project))

  return (
    <div className="cv-page">
      <header className="cv-page__header site-container">
        <div className="cv-page__topline">
          <Link to="/#about" className="back-link">
            <ArrowLeft size={16} className="icon-directional" aria-hidden="true" />
            <span>{t.cv.back}</span>
          </Link>
          <span className="eyebrow">{t.cv.eyebrow}</span>
        </div>

        <div className="cv-page__heading">
          <div>
            <h1>{t.cv.title}</h1>
            <p>{t.cv.intro}</p>
          </div>
          <div className="cv-page__actions">
            <a
              href={siteConfig.cvPdf[locale]}
              download
              className="button button--accent"
            >
              <Download size={16} aria-hidden="true" />
              <span>{t.cv.download} · {locale === 'ar' ? 'AR' : 'EN'}</span>
            </a>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => window.print()}
            >
              <Printer size={16} aria-hidden="true" />
              <span>{t.cv.print}</span>
            </button>
            <div className="cv-page__downloads">
              <a href={siteConfig.cvPdf.en} download>
                {t.cv.downloadEn}
              </a>
              <span aria-hidden="true">/</span>
              <a href={siteConfig.cvPdf.ar} download>
                {t.cv.downloadAr}
              </a>
            </div>
          </div>
        </div>
        <p className="cv-page__print-hint">{t.cv.printHint}</p>
      </header>

      <div className="site-container cv-page__sheet-wrap">
        <article
          ref={sheetRef}
          className="cv-sheet"
          aria-label={`${siteConfig.name} — ${t.cv.title}`}
        >
          <div className="cv-sheet__topline">
            <div className="cv-sheet__brand">
              <BrandGlyph />
              <span>{siteConfig.displayName}</span>
            </div>
            <div className="cv-sheet__tagline">
              <span>{t.cv.eyebrow}</span>
            </div>
          </div>

          <header className="cv-sheet__header">
            <div className="cv-sheet__identity">
              <h2>{siteConfig.name}</h2>
              <p>{siteConfig.role[locale]}</p>
            </div>
            <div className="cv-sheet__contact">
              <span className="cv-sheet__label">{t.cv.contact}</span>
              <div className="cv-sheet__contact-links">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t.contact.whatsapp}
                  <ArrowUpRight size={11} aria-hidden="true" />
                </a>
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t.contact.instagram}
                  <ArrowUpRight size={11} aria-hidden="true" />
                </a>
                <a
                  href={siteConfig.socials.tiktok}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t.contact.tiktok}
                  <ArrowUpRight size={11} aria-hidden="true" />
                </a>
              </div>
            </div>
          </header>

          <div className="cv-sheet__availability">
            <span className="cv-sheet__label">{t.cv.availability}</span>
            <p>{t.cv.remote}</p>
          </div>

          <div className="cv-sheet__body">
            <div className="cv-sheet__main">
              <section className="cv-section">
                <div className="cv-section__head">
                  <h3>{t.cv.summary}</h3>
                  <span>01</span>
                </div>
                <p className="cv-summary">{cvData.summary[locale]}</p>
              </section>

              <section className="cv-section">
                <div className="cv-section__head">
                  <h3>{t.cv.experience}</h3>
                  <span>02</span>
                </div>
                {cvData.experience.length ? (
                  <div className="cv-timeline">
                    {cvData.experience.map((entry) => (
                      <div
                        key={`${entry.role.en}-${entry.period.en}`}
                        className="cv-timeline__item"
                      >
                        <div className="cv-timeline__period">{entry.period[locale]}</div>
                        <div>
                          <h4>{entry.role[locale]}</h4>
                          {entry.organisation ? <p>{entry.organisation[locale]}</p> : null}
                          <p>{entry.summary[locale]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="cv-placeholder">
                    <span className="cv-placeholder__badge">{t.cv.toAdd}</span>
                    <p>{t.cv.placeholderExperience}</p>
                  </div>
                )}
              </section>

              <section className="cv-section">
                <div className="cv-section__head">
                  <h3>{t.cv.selectedCollaborations}</h3>
                  <span>03</span>
                </div>
                <div className="cv-collaborations">
                  {cvData.collaborations.map((collaboration) => (
                    <a
                      key={collaboration.name}
                      href={collaboration.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="cv-collaboration"
                    >
                      <span className="cv-collaboration__mark" aria-hidden="true" />
                      <span className="cv-collaboration__copy">
                        <strong>{collaboration.name}</strong>
                        <small>{collaboration.type[locale]}</small>
                      </span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only"> — {t.common.externalLink}</span>
                    </a>
                  ))}
                </div>
              </section>

              <section className="cv-section">
                <div className="cv-section__head">
                  <h3>{t.cv.selectedWork}</h3>
                  <span>04</span>
                </div>
                <div className="cv-work-list">
                  {selectedProjects.map((project) => {
                    const content = (
                      <>
                        <span>{project.index}</span>
                        <div>
                          <h4>{project.title[locale]}</h4>
                          <p>{project.category[locale]}</p>
                        </div>
                        <span className="cv-work-list__runtime">
                          {project.video.durationLabel}
                        </span>
                      </>
                    )

                    return isPdfExport ? (
                      <div key={project.id} className="cv-work-list__item">
                        {content}
                      </div>
                    ) : (
                      <Link
                        key={project.id}
                        to={`/work/${project.slug}`}
                        className="cv-work-list__item"
                      >
                        {content}
                      </Link>
                    )
                  })}
                </div>
              </section>

              <section className="cv-section">
                <div className="cv-section__head">
                  <h3>{t.cv.services}</h3>
                  <span>05</span>
                </div>
                <ul className="cv-services-list">
                  {services.map((service) => (
                    <li key={service.id}>
                      <span>{service.number}</span>
                      {service.title[locale]}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="cv-sheet__aside">
              <section className="cv-section cv-section--aside">
                <div className="cv-section__head">
                  <h3>{t.cv.skills}</h3>
                </div>
                <ul className="cv-tag-list">
                  {cvData.skills[locale].map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </section>

              <section className="cv-section cv-section--aside">
                <div className="cv-section__head">
                  <h3>{t.cv.tools}</h3>
                </div>
                {cvData.tools.map((tool) => (
                  <div key={tool.name} className="cv-tool">
                    <h4>{tool.name}</h4>
                    <p>{tool.detail[locale]}</p>
                  </div>
                ))}
                <p className="cv-micro-note">{t.cv.toolsVerifiedNote}</p>
              </section>

              <section className="cv-section cv-section--aside">
                <div className="cv-section__head">
                  <h3>{t.cv.languages}</h3>
                </div>
                <ul className="cv-language-list">
                  {cvData.languages.map((language) => (
                    <li key={language.name.en}>
                      <span>{language.name[locale]}</span>
                      {language.proficiency ? (
                        <span>{language.proficiency[locale]}</span>
                      ) : (
                        <span className="cv-placeholder-inline">
                          {t.cv.placeholderProficiency}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="cv-section cv-section--aside">
                <div className="cv-section__head">
                  <h3>{t.cv.education}</h3>
                </div>
                {cvData.education.length ? (
                  cvData.education.map((entry) => (
                    <div key={entry.qualification.en} className="cv-tool">
                      <h4>{entry.qualification[locale]}</h4>
                      {entry.status ? (
                        <p className="cv-education__status">{entry.status[locale]}</p>
                      ) : null}
                      {entry.institution ? <p>{entry.institution[locale]}</p> : null}
                      {entry.period ? <p>{entry.period}</p> : null}
                    </div>
                  ))
                ) : (
                  <div className="cv-placeholder cv-placeholder--compact">
                    <span className="cv-placeholder__badge">{t.cv.toAdd}</span>
                    <p>{t.cv.placeholderEducation}</p>
                  </div>
                )}
              </section>
            </aside>
          </div>

          <footer className="cv-sheet__footer">
            <div>
              <BrandGlyph />
              <span>
                {siteConfig.name} — {siteConfig.role[locale]}
              </span>
            </div>
            <p>{t.cv.eyebrow}</p>
          </footer>
        </article>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'
import { services } from '../data/services'
import { useLocale } from '../i18n/LocaleContext'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

interface ServicesSectionProps {
  onStartBrief: (serviceId: string) => void
}

export function ServicesSection({ onStartBrief }: ServicesSectionProps) {
  const { locale, t } = useLocale()

  return (
    <section
      className="services section-shell"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow={t.services.eyebrow}
            titleA={t.services.titleA}
            titleB={t.services.titleB}
            intro={t.services.intro}
            titleId="services-title"
            aside={
              <div className="section-heading__aside-meta">
                <span className="mono-label">
                  01 — {String(services.length).padStart(2, '0')}
                </span>
                <span className="mono-label section-heading__cue">
                  {t.footer.availability}
                </span>
              </div>
            }
          />
        </Reveal>

        <div className="services__list">
          {services.map((service, index) => {
            const related = projects.filter((project) =>
              service.relatedProjectSlugs.includes(project.slug),
            )

            return (
              <Reveal
                key={service.id}
                delay={0.03 + index * 0.035}
                className="service-row"
              >
                <span className="service-row__number mono-label">{service.number}</span>
                <h3 className="service-row__title">{service.title[locale]}</h3>
                <div className="service-row__body">
                  <p>{service.description[locale]}</p>
                  {related.length ? (
                    <div className="service-row__related">
                      <span>{t.services.related}</span>
                      {related.map((project) => (
                        <Link
                          key={project.id}
                          to={`/work/${project.slug}`}
                          className="text-link text-link--small"
                        >
                          {project.title[locale]}
                          <ArrowRight
                            size={12}
                            className="icon-directional"
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="service-row__action"
                  onClick={() => onStartBrief(service.id)}
                  aria-label={`${t.services.startBrief}: ${service.title[locale]}`}
                >
                  <span>{t.services.startBrief}</span>
                  <ArrowUpRight size={18} className="icon-directional" aria-hidden="true" />
                </button>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="services__foot">
          <p>{t.services.note}</p>
          <Link to="/#contact" className="text-link text-link--large">
            <span>{t.services.contactLink}</span>
            <ArrowUpRight size={17} className="icon-directional" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

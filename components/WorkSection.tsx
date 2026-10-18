import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react'
import { featuredProject, supportingProjects } from '../data/projects'
import type { Project } from '../lib/types'
import { useLocale } from '../i18n/LocaleContext'
import { ProjectMediaButton } from './ProjectArtwork'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

interface WorkSectionProps {
  onPreview: (project: Project) => void
}

function ProjectMeta({ project }: { project: Project }) {
  const { locale, t } = useLocale()

  return (
    <div className="project-meta">
      <span>{project.format[locale]}</span>
      <span className="project-meta__dot" aria-hidden="true" />
      <span>{t.project.runtime} {project.video.durationLabel}</span>
    </div>
  )
}

const supportingLayout = ['wide', 'tall', 'tall', 'wide'] as const

export function WorkSection({ onPreview }: WorkSectionProps) {
  const { locale, t } = useLocale()
  const featured = featuredProject
  const totalProjects = String(supportingProjects.length + 1).padStart(2, '0')

  const featureStyle = {
    '--work-accent': featured.accent,
  } as CSSProperties

  return (
    <section className="work section-shell" id="work" aria-labelledby="work-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow={t.work.eyebrow}
            titleA={t.work.titleA}
            titleB={t.work.titleB}
            intro={t.work.intro}
            titleId="work-title"
            aside={
              <div className="section-heading__aside-meta">
                <span className="mono-label">
                  {totalProjects} {t.work.count}
                </span>
                <span className="mono-label section-heading__cue">{t.work.cue}</span>
              </div>
            }
          />
        </Reveal>

        <Reveal delay={0.08}>
          <article className="featured-work" style={featureStyle}>
            <div className="featured-work__copy">
              <div className="featured-work__labels">
                <span className="eyebrow">
                  <span className="lime-dot" aria-hidden="true" />
                  {t.work.featured}
                </span>
                <span className="mono-label">
                  {featured.index} / {totalProjects}
                </span>
              </div>

              <div className="featured-work__title-wrap">
                <span className="featured-work__index" aria-hidden="true">
                  {featured.index}
                </span>
                <h3 className="featured-work__title">{featured.title[locale]}</h3>
              </div>

              <p className="featured-work__category">{featured.category[locale]}</p>
              <p className="featured-work__summary">{featured.summary[locale]}</p>
              <ProjectMeta project={featured} />

              <div className="featured-work__actions">
                <button
                  type="button"
                  className="button button--accent"
                  onClick={() => onPreview(featured)}
                >
                  <Play size={15} fill="currentColor" aria-hidden="true" />
                  <span>{t.work.preview}</span>
                </button>
                <Link to={`/work/${featured.slug}`} className="text-link">
                  <span>{t.work.caseStudy}</span>
                  <ArrowUpRight
                    size={16}
                    className="icon-directional"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <div className="featured-work__focus" aria-label={t.project.focus}>
                {featured.focus[locale].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="featured-work__visual">
              <div className="featured-work__visual-grid" aria-hidden="true" />
              <div className="featured-work__visual-caption" aria-hidden="true">
                <span>REEL / {featured.index}</span>
                <span>{featured.video.durationLabel}</span>
              </div>
              <ProjectMediaButton
                project={featured}
                onPreview={onPreview}
                className="featured-work__media"
                priority
              />

              <div className="featured-work__visual-footer">
                <span>{featured.video.aspectRatio}</span>
                <span className="featured-work__scroll-line" aria-hidden="true" />
                <span>{t.work.noFilterNote}</span>
              </div>
            </div>
          </article>
        </Reveal>

        <div className="work-secondary">
          {supportingProjects.map((project, index) => (
            <Reveal
              key={project.id}
              delay={0.05 + index * 0.06}
              className={`work-tile-wrap work-tile-wrap--${
                supportingLayout[index % supportingLayout.length]
              }${index >= 2 ? ' work-tile-wrap--lower' : ''}`}
            >
              <article className="work-tile">
                <ProjectMediaButton
                  project={project}
                  onPreview={onPreview}
                  className="work-tile__media"
                />
                <div className="work-tile__content">
                  <div className="work-tile__topline">
                    <span className="mono-label">
                      {project.index} / {project.category[locale]}
                    </span>
                    <span className="mono-label">{project.video.durationLabel}</span>
                  </div>
                  <h3 className="work-tile__title">
                    <Link to={`/work/${project.slug}`}>{project.title[locale]}</Link>
                  </h3>
                  <p className="work-tile__summary">{project.summary[locale]}</p>
                  <div className="work-tile__actions">
                    <button
                      type="button"
                      onClick={() => onPreview(project)}
                      className="text-link"
                    >
                      <Play size={13} aria-hidden="true" />
                      <span>{t.work.preview}</span>
                    </button>
                    <Link to={`/work/${project.slug}`} className="text-link">
                      <span>{t.work.caseStudy}</span>
                      <ArrowRight
                        size={14}
                        className="icon-directional"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal delay={0.18} className="work-cta-wrap">
            <aside className="work-cta">
              <div>
                <span className="eyebrow">{t.work.ctaEyebrow}</span>
                <h3>{t.work.ctaTitle}</h3>
                <p>{t.work.ctaBody}</p>
              </div>
              <Link to="/#contact" className="round-button round-button--accent">
                <span>{t.work.ctaButton}</span>
                <ArrowUpRight size={20} className="icon-directional" aria-hidden="true" />
              </Link>
              <span className="work-cta__index mono-label" aria-hidden="true">
                NEXT
              </span>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

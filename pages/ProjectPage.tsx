import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getProjectBySlug, getRelatedProjects, projects } from '../data/projects'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLocale } from '../i18n/LocaleContext'
import { ProjectArtwork } from '../components/ProjectArtwork'
import { ProjectVideoInline } from '../components/ProjectVideoInline'
import { ContactBanner } from '../components/ContactBanner'
import { Reveal } from '../components/Reveal'
import { NotFoundContent } from './NotFoundPage'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, t } = useLocale()
  const project = getProjectBySlug(slug)

  usePageMeta({
    title: project
      ? `${project.title[locale]} — ${project.category[locale]} | ${t.meta.projectTitleSuffix}`
      : t.meta.notFoundTitle,
    description: project ? project.summary[locale] : t.notFound.body,
    image: project?.poster ?? '/media/og-cover.jpg',
    type: project ? 'article' : 'website',
    noIndex: !project,
  })

  if (!project) {
    return <NotFoundContent />
  }

  const related = getRelatedProjects(project)
  const isLandscape = project.video.aspectRatio === '16:9'
  const totalProjects = String(projects.length).padStart(2, '0')
  const pageStyle = {
    '--project-accent': project.accent,
  } as CSSProperties

  return (
    <article className="project-page" style={pageStyle}>
      <div className="project-page__accent" aria-hidden="true" />

      <header className="project-hero site-container">
        <div className="project-hero__top">
          <Link to="/#work" className="back-link">
            <ArrowLeft size={16} className="icon-directional" aria-hidden="true" />
            <span>{t.project.back}</span>
          </Link>
          <span className="mono-label">
            {t.project.workIndex} / {project.index} — {totalProjects}
          </span>
        </div>

        <div className="project-hero__grid">
          <div className="project-hero__copy">
            <span className="eyebrow">
              {t.project.eyebrow} / {project.category[locale]}
            </span>
            <h1>{project.title[locale]}</h1>
            <p className="project-hero__summary">{project.summary[locale]}</p>
          </div>

          <aside className="project-hero__facts">
            <dl>
              <div>
                <dt>{t.project.format}</dt>
                <dd>{project.format[locale]}</dd>
              </div>
              <div>
                <dt>{t.project.runtime}</dt>
                <dd>{project.video.durationLabel}</dd>
              </div>
              <div>
                <dt>{t.project.role}</dt>
                <dd>{project.role[locale]}</dd>
              </div>
            </dl>
            <div className="project-focus">
              <span className="eyebrow">{t.project.focus}</span>
              <ul>
                {project.focus[locale].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </header>

      <div
        className={`project-stage site-container${isLandscape ? ' project-stage--landscape' : ''}`}
      >
        <Reveal className="project-stage__video">
          <ProjectVideoInline project={project} />
        </Reveal>

        <Reveal delay={0.08} className="project-stage__sidebar">
          <span className="eyebrow">{t.project.overview}</span>
          <p>{project.overview[locale]}</p>
          <a
            href={project.video.originalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-link"
          >
            <span>{t.project.watchOriginal}</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <span className="project-stage__source mono-label">{t.project.source}</span>
        </Reveal>
      </div>

      <section className="project-approach section-shell site-container">
        <div className="project-approach__label">
          <span className="eyebrow">{t.project.approach}</span>
          <span className="project-approach__number" aria-hidden="true">
            {project.index}
          </span>
        </div>
        <div className="project-approach__copy">
          <p>{project.approach[locale]}</p>
        </div>
      </section>

      <section
        className="related-work section-shell site-container"
        aria-labelledby="related-title"
      >
        <div className="related-work__head">
          <span className="eyebrow">{t.project.related}</span>
          <h2 id="related-title">{t.project.relatedIntro}</h2>
        </div>
        <div className="related-work__grid">
          {related.map((item) => (
            <Link key={item.id} to={`/work/${item.slug}`} className="related-card">
              <div className="related-card__media">
                <ProjectArtwork project={item} />
              </div>
              <div className="related-card__content">
                <div>
                  <span className="mono-label">
                    {item.index} / {item.category[locale]}
                  </span>
                  <h3>{item.title[locale]}</h3>
                </div>
                <span className="related-card__arrow" aria-hidden="true">
                  <ArrowUpRight size={19} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ContactBanner />
    </article>
  )
}

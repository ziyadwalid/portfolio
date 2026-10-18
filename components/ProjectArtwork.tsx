import { useState } from 'react'
import { useLocale } from '../i18n/LocaleContext'
import type { Project } from '../lib/types'
import { cn } from '../lib/utils'
import { BrandGlyph } from './Brand'

interface ProjectArtworkProps {
  project: Project
  className?: string
  priority?: boolean
}

export function ProjectArtwork({
  project,
  className,
  priority = false,
}: ProjectArtworkProps) {
  const { locale, t } = useLocale()
  const [mainFailed, setMainFailed] = useState(false)
  const [hoverFailed, setHoverFailed] = useState(false)

  const title = project.title[locale]
  const category = project.category[locale]

  return (
    <div
      className={cn('project-artwork', mainFailed && 'is-fallback', className)}
      style={{ backgroundColor: project.accent }}
    >
      {!mainFailed ? (
        <img
          src={project.poster}
          alt={`${title} — ${category}`}
          className="project-artwork__image"
          width="900"
          height="1600"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setMainFailed(true)}
        />
      ) : (
        <div className="project-artwork__fallback" role="img" aria-label={`${title} — ${category}`}>
          <BrandGlyph className="project-artwork__fallback-mark" />
          <span>{category}</span>
        </div>
      )}

      {!mainFailed && !hoverFailed ? (
        <img
          src={project.hoverPoster}
          alt=""
          aria-hidden="true"
          className="project-artwork__image project-artwork__image--hover"
          width="900"
          height="1600"
          loading="lazy"
          decoding="async"
          onError={() => setHoverFailed(true)}
        />
      ) : null}

      <span className="project-artwork__grain" aria-hidden="true" />
      <span className="project-artwork__index" aria-hidden="true">
        {project.index}
      </span>
      <span className="project-artwork__preview-chip" aria-hidden="true">
        <span className="project-artwork__preview-dot" />
        {t.work.preview}
      </span>
    </div>
  )
}

export function ProjectMediaButton({
  project,
  onPreview,
  className,
  priority = false,
}: ProjectArtworkProps & {
  onPreview: (project: Project) => void
}) {
  const { locale, t } = useLocale()

  return (
    <div className={cn('project-media-button', className)}>
      <ProjectArtwork project={project} priority={priority} />
      <button
        type="button"
        className="project-media-button__control"
        onClick={() => onPreview(project)}
        aria-label={`${t.work.cardOpen}: ${project.title[locale]}`}
      />
      <span className="project-media-button__action" aria-hidden="true">
        {t.common.preview}
      </span>
    </div>
  )
}

import { useState } from 'react'
import { AlertCircle, ArrowUpRight } from 'lucide-react'
import { useLocale } from '../i18n/LocaleContext'
import type { Project } from '../lib/types'
import { isLandscapeAspect, toCssAspectRatio } from '../lib/utils'

export function ProjectVideoInline({ project }: { project: Project }) {
  const { locale, t } = useLocale()
  const [videoError, setVideoError] = useState(false)
  const title = project.title[locale]
  const isLandscape = isLandscapeAspect(project.video.aspectRatio)
  const aspectStyle = { aspectRatio: toCssAspectRatio(project.video.aspectRatio) }

  return (
    <div className={`project-player${isLandscape ? ' project-player--landscape' : ''}`}>

      {project.video.provider === 'embed' ? (
        <iframe
          src={project.video.src}
          title={`${title} — ${t.project.videoLabel}`}
          className="project-player__video"
          style={aspectStyle}
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : videoError ? (
        <div className="video-error video-error--inline" role="alert">
          <AlertCircle size={28} aria-hidden="true" />
          <h2>{t.common.videoErrorTitle}</h2>
          <p>{t.common.videoErrorBody}</p>
          <a
            href={project.video.originalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="button button--accent"
          >
            <span>{t.common.openOriginal}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      ) : (
        <video
          className="project-player__video"
          style={aspectStyle}
          src={project.video.src}
          poster={project.video.poster}
          controls
          playsInline
          preload="metadata"
          onError={() => setVideoError(true)}
          aria-label={`${title} — ${t.project.videoLabel}`}
        />
      )}

      <div className="project-player__caption">
        <span className="mono-label">
          {project.video.aspectRatio} / {project.video.durationLabel}
        </span>
        <span>{t.common.videoOriginalNote}</span>
      </div>
    </div>
  )
}

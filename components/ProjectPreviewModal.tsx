import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, ArrowUpRight, Play, X } from 'lucide-react'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useLocale } from '../i18n/LocaleContext'
import type { Project } from '../lib/types'
import { isLandscapeAspect, toCssAspectRatio } from '../lib/utils'

interface ProjectPreviewModalProps {
  project: Project
  onClose: () => void
}

export function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  const { locale, t } = useLocale()
  const reduceMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useFocusTrap(true, dialogRef, onClose)
  useLockBodyScroll(true)

  useEffect(() => {
    const modalVideo = videoRef.current
    // Only one piece of video should ever play at a time. Pause any decorative
    // background preview when the preview dialog takes over.
    document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
      if (video !== modalVideo) video.pause()
    })

    return () => {
      modalVideo?.pause()
      if (modalVideo) modalVideo.currentTime = 0
    }
  }, [])

  useEffect(() => {
    if (!started || videoError) return
    // The custom play button is removed once playback starts. Keep keyboard
    // focus on the now-controllable video so tab order stays inside the dialog.
    videoRef.current?.focus()
  }, [started, videoError])

  const startVideo = () => {
    const video = videoRef.current
    if (!video) return
    setStarted(true)
    setLoading(true)
    void video
      .play()
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setVideoError(true)
      })
  }

  const closeOnBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  if (typeof document === 'undefined') return null

  const title = project.title[locale]
  const category = project.category[locale]
  const isLandscape = isLandscapeAspect(project.video.aspectRatio)
  const aspectStyle = { aspectRatio: toCssAspectRatio(project.video.aspectRatio) }

  return createPortal(
    <motion.div
      className="modal-backdrop"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
      onMouseDown={closeOnBackdrop}
    >
      <motion.div
        ref={dialogRef}
        className={`preview-modal${isLandscape ? ' preview-modal--landscape' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        aria-describedby="preview-description"
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          className="preview-modal__close"
          onClick={onClose}
          aria-label={t.modal.close}
          data-autofocus
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="preview-modal__media">
          <div className="preview-modal__media-chrome">
            <span className="hero-visual__live">
              <span className="status-dot status-dot--small" aria-hidden="true" />
              {t.modal.nowShowing}
            </span>
            <span className="mono-label">
              {project.video.aspectRatio} / {project.video.durationLabel}
            </span>
          </div>

          <div className="preview-modal__video-frame">
            {project.video.provider === 'embed' ? (
              <iframe
                src={project.video.src}
                title={`${title} — ${t.project.videoLabel}`}
                className="preview-modal__video"
                style={aspectStyle}
                allow="autoplay; fullscreen; picture-in-picture"
                loading="lazy"
              />
            ) : videoError ? (
              <div className="video-error" role="alert">
                <AlertCircle size={26} aria-hidden="true" />
                <h3>{t.modal.errorTitle}</h3>
                <p>{t.modal.errorBody}</p>
                <a
                  href={project.video.originalUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="button button--accent"
                >
                  <span>{t.modal.watchOriginal}</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="preview-modal__video"
                  style={aspectStyle}
                  poster={project.video.poster}
                  src={project.video.src}
                  controls={started}
                  playsInline
                  preload="metadata"
                  onPlaying={() => {
                    setLoading(false)
                    setStarted(true)
                  }}
                  onWaiting={() => setLoading(true)}
                  onError={() => {
                    setLoading(false)
                    setVideoError(true)
                  }}
                  aria-label={`${title} — ${t.project.videoLabel}`}
                >
                  {project.video.mimeType ? (
                    <source src={project.video.src} type={project.video.mimeType} />
                  ) : null}
                  <p>{t.common.videoErrorBody}</p>
                </video>

                {!started ? (
                  <button
                    type="button"
                    className="preview-modal__play"
                    onClick={startVideo}
                    aria-label={`${t.common.playVideo}: ${title}`}
                  >
                    <span>
                      <Play size={24} fill="currentColor" aria-hidden="true" />
                    </span>
                    <span>{t.common.playVideo}</span>
                  </button>
                ) : null}

                {loading ? (
                  <span className="preview-modal__loading mono-label" role="status">
                    {t.common.videoLoading}
                  </span>
                ) : null}
              </>
            )}
          </div>

          <p className="preview-modal__source-note">{t.common.videoOriginalNote}</p>
        </div>

        <div className="preview-modal__details">
          <span className="eyebrow">{t.modal.label} / {project.index}</span>
          <h2 id="preview-title">{title}</h2>
          <p className="preview-modal__category">{category}</p>
          <p className="preview-modal__summary" id="preview-description">
            {project.summary[locale]}
          </p>

          <dl className="preview-modal__meta">
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

          <div className="preview-modal__focus">
            {project.focus[locale].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="preview-modal__actions">
            <Link
              to={`/work/${project.slug}`}
              className="button button--accent"
              onClick={onClose}
            >
              <span>{t.modal.readCaseStudy}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <a
              href={project.video.originalUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-link"
            >
              <span>{t.modal.watchOriginal}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

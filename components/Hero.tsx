import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react'
import { featuredProject, projects } from '../data/projects'
import type { Project } from '../lib/types'
import { useLocale } from '../i18n/LocaleContext'
import { BrandGlyph } from './Brand'

interface HeroProps {
  onPreview: (project: Project) => void
}

interface SaveDataNavigator extends Navigator {
  connection?: {
    saveData?: boolean
  }
}

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero({ onPreview }: HeroProps) {
  const { locale, t } = useLocale()
  const reduceMotion = Boolean(useReducedMotion())
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const userPausedRef = useRef(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [autoplayAllowed, setAutoplayAllowed] = useState(false)

  const project = featuredProject
  const title = project.title[locale]
  const category = project.category[locale]
  const totalProjects = String(projects.length).padStart(2, '0')

  useEffect(() => {
    if (reduceMotion) {
      setAutoplayAllowed(false)
      videoRef.current?.pause()
      return
    }

    const connection = (navigator as SaveDataNavigator).connection
    const isCompact = window.matchMedia('(max-width: 767px)').matches
    setAutoplayAllowed(!connection?.saveData && !isCompact)
  }, [reduceMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoplayAllowed) return

    let cancelled = false
    const playPreview = async () => {
      if (userPausedRef.current) return
      try {
        await video.play()
        if (!cancelled) setVideoPlaying(true)
      } catch {
        if (!cancelled) setVideoPlaying(false)
      }
    }

    void playPreview()

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause()
      } else {
        void playPreview()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [autoplayAllowed])

  useEffect(() => {
    const video = videoRef.current
    const screen = screenRef.current
    if (!video || !screen) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause()
        } else if (autoplayAllowed && !userPausedRef.current && !document.hidden) {
          void video.play().catch(() => setVideoPlaying(false))
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(screen)
    return () => observer.disconnect()
  }, [autoplayAllowed])

  useEffect(() => {
    const video = videoRef.current
    return () => {
      video?.pause()
    }
  }, [])

  const toggleBackgroundPreview = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      userPausedRef.current = false
      void video
        .play()
        .then(() => setVideoPlaying(true))
        .catch(() => setVideoPlaying(false))
    } else {
      userPausedRef.current = true
      video.pause()
      setVideoPlaying(false)
    }
  }

  const heroStyle = {
    '--hero-project-accent': project.accent,
    '--hero-poster': `url(${project.video.poster})`,
  } as CSSProperties

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__watermark" aria-hidden="true">
        ZV
      </div>

      <div className="site-container hero__inner">
        <div className="hero__copy">
          <motion.div
            className="hero__eyebrow-row"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: EASE }}
          >
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <span className="hero__availability">
              <span className="status-dot" aria-hidden="true" />
              {t.hero.metaAvailability}
            </span>
          </motion.div>

          <motion.p
            className="hero__greeting"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, delay: 0.08, ease: EASE }}
          >
            <BrandGlyph className="hero__greeting-mark" />
            {t.hero.greeting}
          </motion.p>

          <h1 className="hero__title" id="hero-title">
            <span className="hero__title-mask">
              <motion.span
                className="hero__title-line"
                initial={reduceMotion ? false : { y: '112%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: reduceMotion ? 0 : 0.9,
                  delay: 0.12,
                  ease: EASE,
                }}
              >
                {t.hero.titleLineOne}
              </motion.span>
            </span>
            <span className="hero__title-mask">
              <motion.span
                className="hero__title-line hero__title-line--accent"
                initial={reduceMotion ? false : { y: '112%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: reduceMotion ? 0 : 0.95,
                  delay: 0.2,
                  ease: EASE,
                }}
              >
                {t.hero.titleLineTwo}
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="hero__body"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.42, ease: EASE }}
          >
            <p className="hero__supporting">{t.hero.supporting}</p>
            <p className="hero__secondary">{t.hero.supportingSecondary}</p>
          </motion.div>

          <motion.div
            className="hero__actions"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.5, ease: EASE }}
          >
            <Link to="/#work" className="button button--accent">
              <span>{t.hero.primaryCta}</span>
              <ArrowDown size={17} aria-hidden="true" />
            </Link>
            <Link to="/#contact" className="button button--ghost">
              <span>{t.hero.secondaryCta}</span>
              <ArrowUpRight size={17} className="icon-directional" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div
            className="hero__footnote"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, delay: 0.7, ease: EASE }}
          >
            <span className="hero__footnote-mark" aria-hidden="true">
              +
            </span>
            <span>{t.hero.frameIndicator}</span>
            <span className="hero__rule" aria-hidden="true" />
            <span className="mono-label">24 FPS / 9:16</span>
          </motion.div>
        </div>

        <motion.div
          className="hero__visual-wrap"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.25, ease: EASE }}
        >
          <figure className="hero-visual" style={heroStyle}>
            <div className="hero-visual__backdrop" aria-hidden="true" />
            <div className="hero-visual__frame">
              <div className="hero-visual__screen" ref={screenRef}>
                {videoError ? (
                  <img
                    src={project.video.poster}
                    alt=""
                    className="hero-visual__video"
                    width="540"
                    height="960"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    className="hero-visual__video"
                    src={project.previewLoop ?? project.video.src}
                    poster={project.video.poster}
                    muted
                    loop
                    playsInline
                    preload={autoplayAllowed ? 'metadata' : 'none'}
                    aria-hidden="true"
                    tabIndex={-1}
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                    onError={() => setVideoError(true)}
                  />
                )}

                <div className="hero-visual__shade" aria-hidden="true" />

                <div className="hero-visual__chrome hero-visual__chrome--top">
                  <span className="hero-visual__live">
                    <span className="status-dot status-dot--small" aria-hidden="true" />
                    {t.hero.nowScreening}
                  </span>
                  <button
                    type="button"
                    className="hero-visual__toggle"
                    onClick={toggleBackgroundPreview}
                    aria-label={
                      videoPlaying ? t.hero.pauseBackground : t.hero.playBackground
                    }
                  >
                    {videoPlaying ? (
                      <Pause size={13} aria-hidden="true" />
                    ) : (
                      <Play size={13} fill="currentColor" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  className="hero-visual__open"
                  onClick={() => onPreview(project)}
                  aria-label={`${t.hero.previewLabel}: ${title}`}
                >
                  <span className="hero-visual__play">
                    <Play size={20} fill="currentColor" aria-hidden="true" />
                  </span>
                  <span className="hero-visual__play-label">{t.common.preview}</span>
                </button>

                <div className="hero-visual__chrome hero-visual__chrome--bottom">
                  <div className="hero-visual__title-row">
                    <span className="mono-label">
                      {project.index} / {totalProjects}
                    </span>
                    <span className="mono-label">{project.video.durationLabel}</span>
                  </div>
                  <p className="hero-visual__project-title">{title}</p>
                  <p className="hero-visual__project-category">{category}</p>
                </div>
              </div>

              <figcaption className="hero-visual__caption">
                <span>{t.hero.videoCaption}</span>
                <span className="hero-visual__caption-arrow" aria-hidden="true">
                  ↗
                </span>
              </figcaption>
            </div>

            <div className="hero-visual__aside" aria-hidden="true">
              <span className="mono-label">{t.hero.featuredCut}</span>
              <span className="hero-visual__aside-line" />
              <span className="hero-visual__aside-index">{project.index}</span>
            </div>
          </figure>
        </motion.div>
      </div>

      <div className="site-container hero__bottom">
        <Link to="/#work" className="scroll-cue">
          <span className="scroll-cue__line" aria-hidden="true" />
          <span>{t.hero.scrollCue}</span>
          <ArrowDown size={14} aria-hidden="true" />
        </Link>
        <span className="hero__bottom-index mono-label">00 — {totalProjects}</span>
      </div>
    </section>
  )
}

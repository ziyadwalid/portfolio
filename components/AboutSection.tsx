import { Link } from 'react-router-dom'
import { ArrowUpRight, Download } from 'lucide-react'
import { useLocale } from '../i18n/LocaleContext'
import { Reveal } from './Reveal'

const clipLayout = [
  { start: 2, width: 38, variant: 'one' },
  { start: 43, width: 22, variant: 'two' },
  { start: 69, width: 27, variant: 'three' },
]

export function AboutSection() {
  const { t } = useLocale()

  return (
    <section className="about section-shell" id="about" aria-labelledby="about-title">
      <div className="site-container">
        <div className="about__head">
          <Reveal>
            <span className="eyebrow">
              <span className="section-heading__marker" aria-hidden="true" />
              {t.about.eyebrow}
            </span>
            <h2 className="about__title" id="about-title">
              <span>{t.about.titleA}</span>{' '}
              <span className="about__title-accent">{t.about.titleB}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="about__lead-wrap">
            <p className="about__lead">{t.about.lead}</p>
            <div className="about__availability">
              <span className="status-dot" aria-hidden="true" />
              <span>{t.hero.metaAvailability}</span>
            </div>
          </Reveal>
        </div>

        <div className="about__body">
          <Reveal className="about__narrative">
            <p>{t.about.body}</p>
            <p className="about__signature">{t.about.signature}</p>
            <div className="about__narrative-actions">
              <Link to="/cv" className="button button--ghost">
                <Download size={15} aria-hidden="true" />
                <span>{t.about.cvCta}</span>
              </Link>
            </div>

            <div className="about__skills">
              <span className="eyebrow">{t.about.skillsTitle}</span>
              <ul>
                {t.about.skills.map((skill) => (
                  <li key={skill}>
                    <span aria-hidden="true">+</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="about__timeline-wrap">
            <div className="edit-timeline">
              <div className="edit-timeline__head">
                <span className="eyebrow">{t.about.timeline.label}</span>
                <span className="mono-label">{t.about.timeline.tag}</span>
              </div>

              <div className="edit-timeline__ruler" aria-hidden="true">
                {Array.from({ length: 13 }, (_, index) => (
                  <span key={index} />
                ))}
              </div>

              <div className="edit-timeline__workspace" aria-hidden="true">
                <div className="edit-timeline__gutter">
                  <span>V3</span>
                  <span>V2</span>
                  <span>V1</span>
                  <span>A1</span>
                </div>
                <div className="edit-timeline__tracks">
                  {clipLayout.map((clip, index) => (
                    <div className="edit-timeline__track" key={t.about.timeline.clips[index]}>
                      <span
                        className={`edit-timeline__clip edit-timeline__clip--${clip.variant}`}
                        style={{ insetInlineStart: `${clip.start}%`, width: `${clip.width}%` }}
                      >
                        {t.about.timeline.clips[index]}
                      </span>
                      <span
                        className="edit-timeline__ghost"
                        style={{ insetInlineStart: `${index === 0 ? 55 : index === 1 ? 20 : 48}%` }}
                      />
                    </div>
                  ))}
                  <div className="edit-timeline__track edit-timeline__track--audio">
                    <span className="edit-timeline__wave" />
                  </div>
                  <div className="edit-timeline__playhead">
                    <span />
                  </div>
                </div>
              </div>

              <div className="edit-timeline__foot">
                <span className="mono-label">{t.about.timeline.foot}</span>
                <span className="edit-timeline__timecode mono-label">00:00:24:12</span>
              </div>
            </div>
            <div className="about__timeline-caption">
              <span className="about__caption-mark" aria-hidden="true">
                ✦
              </span>
              <span>{t.about.timeline.caption}</span>
            </div>
          </Reveal>
        </div>

        <div className="about__principles">
          <Reveal className="about__principles-label">
            <span className="eyebrow">{t.about.principlesTitle}</span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </Reveal>
          {t.about.principles.map((principle, index) => (
            <Reveal
              key={principle.title}
              delay={0.08 + index * 0.06}
              className="principle"
            >
              <span className="principle__number mono-label">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLocale } from '../i18n/LocaleContext'
import { BrandGlyph } from '../components/Brand'

export function NotFoundContent() {
  const { t } = useLocale()

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="site-container not-found__inner">
        <BrandGlyph className="not-found__mark" />
        <span className="eyebrow">{t.notFound.eyebrow}</span>
        <div className="not-found__code" aria-hidden="true">
          404
        </div>
        <h1 id="not-found-title">{t.notFound.title}</h1>
        <p>{t.notFound.body}</p>
        <div className="not-found__actions">
          <Link to="/" className="button button--accent">
            <ArrowLeft size={16} className="icon-directional" aria-hidden="true" />
            <span>{t.notFound.home}</span>
          </Link>
          <Link to="/#work" className="button button--ghost">
            <span>{t.notFound.work}</span>
            <ArrowUpRight size={16} className="icon-directional" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function NotFoundPage() {
  const { locale, t } = useLocale()

  usePageMeta({
    title: t.meta.notFoundTitle,
    description: t.notFound.body,
    noIndex: true,
  })

  return (
    <div lang={locale}>
      <NotFoundContent />
    </div>
  )
}

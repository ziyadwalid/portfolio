import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleContext'
import { cn } from '../lib/utils'

export function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={cn('brand-glyph', className)}
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1.25"
        y="5.25"
        width="29.5"
        height="21.5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M9 11.5h7.1L9 20.5h7.1"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
      <circle cx="24" cy="11.4" r="1.55" fill="var(--accent)" />
    </svg>
  )
}

interface BrandProps {
  onNavigate?: () => void
  className?: string
}

export function Brand({ onNavigate, className }: BrandProps) {
  const { t } = useLocale()

  return (
    <Link
      to="/"
      className={cn('brand', className)}
      aria-label={t.nav.home}
      onClick={onNavigate}
      dir="ltr"
    >
      <BrandGlyph className="brand__glyph" />
      <span className="brand__name">
        ZIAD <span className="brand__suffix">V.D</span>
      </span>
    </Link>
  )
}

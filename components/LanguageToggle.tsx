import { useLocale } from '../i18n/LocaleContext'
import { cn } from '../lib/utils'

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      className={cn('language-toggle', className)}
      role="group"
      aria-label={t.nav.languageLabel}
    >
      <button
        type="button"
        className={cn('language-toggle__option', locale === 'en' && 'is-active')}
        aria-pressed={locale === 'en'}
        aria-label={locale === 'en' ? 'EN — English' : `EN — ${t.nav.switchToEnglish}`}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
      <span className="language-toggle__divider" aria-hidden="true" />
      <button
        type="button"
        className={cn('language-toggle__option', locale === 'ar' && 'is-active')}
        aria-pressed={locale === 'ar'}
        aria-label={locale === 'ar' ? 'AR — العربية' : `AR — ${t.nav.switchToArabic}`}
        onClick={() => setLocale('ar')}
        lang="ar"
      >
        AR
      </button>
    </div>
  )
}

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronDown,
  LoaderCircle,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react'
import { projectTypeIds } from '../data/services'
import { siteConfig } from '../data/siteConfig'
import { useLocale } from '../i18n/LocaleContext'
import {
  buildInquiryMessage,
  buildInquirySubject,
  buildMailtoHref,
  createEmptyInquiry,
  hasInquiryErrors,
  sanitizeValues,
  validateInquiry,
  type InquiryFieldErrors,
  type InquiryMessageLabels,
  type InquiryValues,
} from '../lib/inquiry'
import { copyText, todayISODate } from '../lib/utils'
import { Reveal } from './Reveal'

type FormStatus = 'idle' | 'submitting' | 'handoff' | 'success' | 'error'

interface ContactSectionProps {
  initialService?: string
}

interface FieldErrorProps {
  id: string
  message?: string
}

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null
  return (
    <p className="field__error" id={id} role="alert">
      {message}
    </p>
  )
}

const socialKeys = ['whatsapp', 'instagram', 'tiktok'] as const

export function ContactSection({ initialService }: ContactSectionProps) {
  const { locale, t } = useLocale()
  const endpoint = siteConfig.contactFormEndpoint
  const noProvider = !endpoint
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const previousLocaleRef = useRef(locale)
  const [values, setValues] = useState<InquiryValues>(() => createEmptyInquiry(locale))
  const [errors, setErrors] = useState<InquiryFieldErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [preparedBrief, setPreparedBrief] = useState('')
  const [preparedSubject, setPreparedSubject] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const [formError, setFormError] = useState('')

  const isSubmitting = status === 'submitting'
  const minDate = todayISODate()

  useEffect(() => {
    if (previousLocaleRef.current !== locale) {
      setValues((current) => ({
        ...current,
        language:
          current.language === previousLocaleRef.current ? locale : current.language,
      }))
      previousLocaleRef.current = locale
    }
  }, [locale])

  useEffect(() => {
    if (!initialService) return
    setValues((current) => ({ ...current, projectType: initialService }))
    setErrors((current) => {
      if (!current.projectType) return current
      const next = { ...current }
      delete next.projectType
      return next
    })
    setStatus((current) => (current === 'handoff' || current === 'success' ? 'idle' : current))
  }, [initialService])

  useEffect(() => {
    if (status !== 'success' && status !== 'handoff' && status !== 'error') return
    const frame = window.requestAnimationFrame(() => {
      const statusElement = document.querySelector<HTMLElement>(
        '.contact-form-card .form-status',
      )
      if (!statusElement) return
      statusElement.focus({ preventScroll: true })
      statusElement.scrollIntoView({
        block: 'center',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [status])

  const updateField = <K extends keyof InquiryValues>(
    field: K,
    value: InquiryValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!(field in current)) return current
      const next = { ...current }
      delete next[field as keyof InquiryFieldErrors]
      return next
    })
    setFormError('')
    if (status === 'handoff' || status === 'success' || status === 'error') {
      setStatus('idle')
      setPreparedBrief('')
      setPreparedSubject('')
      setCopyMessage('')
      setFormError('')
    }
  }

  const buildLabels = (): InquiryMessageLabels => ({
    intro: t.contact.formTitle,
    name: t.contact.fields.name,
    email: t.contact.fields.email,
    company: t.contact.fields.company,
    preferredContact: t.contact.fields.contactMethod,
    contactHandle: t.contact.fields.contactHandle,
    projectType: t.contact.fields.projectType,
    message: t.contact.fields.message,
    budget: t.contact.fields.budget,
    deadline: t.contact.fields.deadline,
    duration: t.contact.fields.duration,
    references: t.contact.fields.references,
    preferredLanguage: t.contact.fields.language,
    projectTypes: t.contact.projectTypes,
    contactMethods: t.contact.contactMethods,
    languages: {
      en: t.contact.fields.languageEnglish,
      ar: t.contact.fields.languageArabic,
      either: t.contact.fields.languageEither,
    },
    locale,
  })

  const prepareFallback = (cleanValues: InquiryValues) => {
    const brief = buildInquiryMessage(cleanValues, buildLabels())
    const subject = buildInquirySubject(
      cleanValues,
      t.contact.projectTypes,
      t.contact.formTitle,
    )
    setPreparedBrief(brief)
    setPreparedSubject(subject)
    return { brief, subject }
  }

  const focusFirstError = () => {
    window.setTimeout(() => {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus()
    }, 40)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    if (honeypotRef.current?.value) {
      return
    }

    const cleanValues = sanitizeValues(values)
    const nextErrors = validateInquiry(cleanValues, t.contact.errors)
    setErrors(nextErrors)

    if (hasInquiryErrors(nextErrors)) {
      setFormError(t.contact.errors.summary)
      setStatus('idle')
      focusFirstError()
      return
    }

    setFormError('')
    setCopyMessage('')
    setValues(cleanValues)
    const { brief, subject } = prepareFallback(cleanValues)

    if (!endpoint) {
      setStatus('handoff')
      return
    }

    setStatus('submitting')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15_000)

    try {
      const payload = {
        name: cleanValues.name,
        email: cleanValues.email,
        company: cleanValues.company,
        preferredContact:
          t.contact.contactMethods[
            cleanValues.contactMethod as keyof typeof t.contact.contactMethods
          ] ?? cleanValues.contactMethod,
        contactHandle: cleanValues.contactHandle,
        projectType:
          t.contact.projectTypes[
            cleanValues.projectType as keyof typeof t.contact.projectTypes
          ] ?? cleanValues.projectType,
        preferredLanguage: t.contact.fields.language,
        projectLanguage:
          cleanValues.language === 'en'
            ? t.contact.fields.languageEnglish
            : cleanValues.language === 'ar'
              ? t.contact.fields.languageArabic
              : t.contact.fields.languageEither,
        message: cleanValues.message,
        brief,
        budget: cleanValues.budget,
        deadline: cleanValues.deadline,
        duration: cleanValues.duration,
        references: cleanValues.references,
        locale,
        _subject: subject,
        _gotcha: '',
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Inquiry endpoint returned ${response.status}`)
      }

      setStatus('success')
      setValues(createEmptyInquiry(locale))
      setPreparedBrief('')
      setPreparedSubject('')
      setErrors({})
      formRef.current?.reset()
    } catch {
      setStatus('error')
    } finally {
      window.clearTimeout(timeout)
    }
  }

  const handleWhatsApp = () => {
    if (!preparedBrief) return
    void copyText(preparedBrief).then((copied) => {
      setCopyMessage(copied ? t.contact.copied : t.contact.copyFailed)
    })
  }

  const mailtoHref = preparedBrief
    ? buildMailtoHref(siteConfig.email, preparedSubject, preparedBrief)
    : `mailto:${siteConfig.email}`

  const showFallback = Boolean(preparedBrief) && (status === 'handoff' || status === 'error')

  const handleAsideLinkClick = () => {
    // The anchor itself navigates/opens correctly; this just dismisses any stale
    // status so a returning visitor always sees the form in its clean state.
    if (status === 'error') {
      setFormError('')
    }
  }

  return (
    <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
      <div className="contact__glow" aria-hidden="true" />
      <div className="site-container">
        <Reveal>
          <header className="contact__head">
            <span className="eyebrow">
              <span className="section-heading__marker" aria-hidden="true" />
              {t.contact.eyebrow}
            </span>
            <h2 id="contact-title" className="contact__title">
              <span>{t.contact.titleA}</span>{' '}
              <span className="contact__title-accent">{t.contact.titleB}</span>
            </h2>
            <p className="contact__intro">{t.contact.intro}</p>
          </header>
        </Reveal>

        <div className="contact__layout">
          <Reveal className="contact__direct">
            <div className="contact__direct-head">
              <span className="eyebrow">{t.contact.directTitle}</span>
              <p>{t.contact.directIntro}</p>
            </div>

            <div className="contact-channels">
              {socialKeys.map((key, index) => (
                <a
                  key={key}
                  href={siteConfig.socials[key]}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="contact-channel"
                  onClick={handleAsideLinkClick}
                >
                  <span className="contact-channel__index mono-label">
                    0{index + 1}
                  </span>
                  <span className="contact-channel__label">{t.contact[key]}</span>
                  <span className="contact-channel__icon">
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </span>
                </a>
              ))}

              <a href={`mailto:${siteConfig.email}`} className="contact-channel">
                <span className="contact-channel__index mono-label">04</span>
                <span className="contact-channel__label contact-channel__label--email">
                  <span>{t.contact.email}</span>
                  <small>{siteConfig.email}</small>
                </span>
                <span className="contact-channel__icon">
                  <Mail size={18} aria-hidden="true" />
                </span>
              </a>
            </div>

            <div className="contact__direct-note">
              <span className="status-dot" aria-hidden="true" />
              <span>{t.hero.metaAvailability}</span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="contact__form-wrap">
            <div className="contact-form-card">
              <div className="contact-form-card__head">
                <div>
                  <span className="eyebrow">{t.contact.eyebrow}</span>
                  <h3>{t.contact.formTitle}</h3>
                </div>
                <span className="mono-label">FORM / 01</span>
              </div>
              <p className="contact-form-card__intro">{t.contact.formIntro}</p>

              {noProvider ? (
                <div className="form-notice">
                  <AlertCircle size={17} aria-hidden="true" />
                  <p>{t.contact.noProviderNote}</p>
                </div>
              ) : null}

              {status === 'success' ? (
                <div
                  className="form-status form-status--success"
                  role="status"
                  tabIndex={-1}
                >
                  <span className="form-status__icon">
                    <Check size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <h4>{t.contact.successTitle}</h4>
                    <p>{t.contact.successBody}</p>
                  </div>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => {
                      setStatus('idle')
                      setValues(createEmptyInquiry(locale))
                      window.setTimeout(
                        () => document.getElementById('inquiry-name')?.focus(),
                        50,
                      )
                    }}
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : status === 'handoff' ? (
                <div
                  className="form-status form-status--handoff"
                  role="status"
                  tabIndex={-1}
                >
                  <div className="form-status__heading">
                    <span className="form-status__icon">
                      <Mail size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <h4>{t.contact.handoffTitle}</h4>
                      <p>{t.contact.handoffBody}</p>
                    </div>
                  </div>

                  <div className="handoff-actions">
                    <a href={mailtoHref} className="button button--accent">
                      <Mail size={16} aria-hidden="true" />
                      <span>{t.contact.emailDraft}</span>
                    </a>
                    <a
                      href={siteConfig.socials.whatsapp}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="button button--ghost"
                      onClick={handleWhatsApp}
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      <span>{t.contact.whatsappSend}</span>
                    </a>
                  </div>
                  <p className="handoff-hint">{t.contact.whatsappHint}</p>
                  <p className="form-copy-status" role="status" aria-live="polite">
                    {copyMessage}
                  </p>

                  <details className="brief-preview">
                    <summary>
                      <ChevronDown size={14} aria-hidden="true" />
                      {t.contact.previewMessage}
                    </summary>
                    <pre>{preparedBrief}</pre>
                  </details>

                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setStatus('idle')
                      window.setTimeout(
                        () => document.getElementById('inquiry-name')?.focus(),
                        50,
                      )
                    }}
                  >
                    {t.contact.editBrief}
                  </button>
                </div>
              ) : (
                <>
                  {status === 'error' ? (
                    <div
                      className="form-status form-status--error"
                      role="alert"
                      tabIndex={-1}
                    >
                      <AlertCircle size={19} aria-hidden="true" />
                      <div>
                        <h4>{t.contact.providerErrorTitle}</h4>
                        <p>{t.contact.providerErrorBody}</p>
                      </div>
                    </div>
                  ) : null}

                  <form
                    ref={formRef}
                    className="inquiry-form"
                    onSubmit={handleSubmit}
                    noValidate
                    aria-busy={isSubmitting}
                    aria-describedby="contact-required-note"
                  >
                    {formError ? (
                      <div className="form-error-summary" role="alert">
                        <AlertCircle size={16} aria-hidden="true" />
                        <span>{formError}</span>
                      </div>
                    ) : null}

                    <div className="form-grid">
                      <div className={`field ${errors.name ? 'is-invalid' : ''}`}>
                        <label htmlFor="inquiry-name">
                          {t.contact.fields.name}
                          <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="inquiry-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={values.name}
                          onChange={(event) => updateField('name', event.target.value)}
                          placeholder={t.contact.fields.namePlaceholder}
                          maxLength={80}
                          required
                          aria-required="true"
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'inquiry-name-error' : undefined}
                        />
                        <FieldError id="inquiry-name-error" message={errors.name} />
                      </div>

                      <div className={`field ${errors.email ? 'is-invalid' : ''}`}>
                        <label htmlFor="inquiry-email">
                          {t.contact.fields.email}
                          <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="inquiry-email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={values.email}
                          onChange={(event) => updateField('email', event.target.value)}
                          placeholder={t.contact.fields.emailPlaceholder}
                          required
                          aria-required="true"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'inquiry-email-error' : undefined}
                        />
                        <FieldError id="inquiry-email-error" message={errors.email} />
                      </div>

                      <div className="field">
                        <label htmlFor="inquiry-company">{t.contact.fields.company}</label>
                        <input
                          id="inquiry-company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          value={values.company}
                          onChange={(event) => updateField('company', event.target.value)}
                          placeholder={t.contact.fields.companyPlaceholder}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="inquiry-contact-method">
                          {t.contact.fields.contactMethod}
                        </label>
                        <div className="select-wrap">
                          <select
                            id="inquiry-contact-method"
                            name="contactMethod"
                            value={values.contactMethod}
                            onChange={(event) => {
                              const method = event.target
                                .value as InquiryValues['contactMethod']
                              updateField('contactMethod', method)
                              if (method === 'email') {
                                updateField('contactHandle', '')
                              }
                            }}
                          >
                            <option value="">
                              {t.contact.fields.contactMethodPlaceholder}
                            </option>
                            <option value="whatsapp">{t.contact.contactMethods.whatsapp}</option>
                            <option value="email">{t.contact.contactMethods.email}</option>
                            <option value="other">{t.contact.contactMethods.other}</option>
                          </select>
                          <ChevronDown size={16} aria-hidden="true" />
                        </div>
                      </div>

                      {values.contactMethod === 'whatsapp' ||
                      values.contactMethod === 'other' ? (
                        <div className="field form-grid__full">
                          <label htmlFor="inquiry-contact-handle">
                            {t.contact.fields.contactHandle}
                          </label>
                          <input
                            id="inquiry-contact-handle"
                            name="contactHandle"
                            type="text"
                            autoComplete="tel"
                            value={values.contactHandle}
                            onChange={(event) =>
                              updateField('contactHandle', event.target.value)
                            }
                            placeholder={t.contact.fields.contactHandlePlaceholder}
                          />
                        </div>
                      ) : null}

                      <div
                        className={`field form-grid__full ${errors.projectType ? 'is-invalid' : ''}`}
                      >
                        <label htmlFor="inquiry-project-type">
                          {t.contact.fields.projectType}
                          <span aria-hidden="true">*</span>
                        </label>
                        <div className="select-wrap">
                          <select
                            id="inquiry-project-type"
                            name="projectType"
                            value={values.projectType}
                            onChange={(event) =>
                              updateField('projectType', event.target.value)
                            }
                            required
                            aria-required="true"
                            aria-invalid={Boolean(errors.projectType)}
                            aria-describedby={
                              errors.projectType ? 'inquiry-project-type-error' : undefined
                            }
                          >
                            <option value="">
                              {t.contact.fields.projectTypePlaceholder}
                            </option>
                            {projectTypeIds.map((projectTypeId) => (
                              <option key={projectTypeId} value={projectTypeId}>
                                {t.contact.projectTypes[projectTypeId]}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={16} aria-hidden="true" />
                        </div>
                        <FieldError
                          id="inquiry-project-type-error"
                          message={errors.projectType}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="inquiry-language">
                          {t.contact.fields.language}
                        </label>
                        <div className="select-wrap">
                          <select
                            id="inquiry-language"
                            name="language"
                            value={values.language}
                            onChange={(event) =>
                              updateField(
                                'language',
                                event.target.value as InquiryValues['language'],
                              )
                            }
                          >
                            <option value="en">{t.contact.fields.languageEnglish}</option>
                            <option value="ar">{t.contact.fields.languageArabic}</option>
                            <option value="either">{t.contact.fields.languageEither}</option>
                          </select>
                          <ChevronDown size={16} aria-hidden="true" />
                        </div>
                      </div>

                      <div
                        className={`field form-grid__full ${errors.message ? 'is-invalid' : ''}`}
                      >
                        <label htmlFor="inquiry-message">
                          {t.contact.fields.message}
                          <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="inquiry-message"
                          name="message"
                          rows={5}
                          value={values.message}
                          onChange={(event) => updateField('message', event.target.value)}
                          placeholder={t.contact.fields.messagePlaceholder}
                          maxLength={2000}
                          required
                          aria-required="true"
                          aria-invalid={Boolean(errors.message)}
                          aria-describedby={errors.message ? 'inquiry-message-error' : undefined}
                        />
                        <div className="field__meta">
                          <FieldError id="inquiry-message-error" message={errors.message} />
                          <span className="field__count" aria-hidden="true">
                            {values.message.length}/2000
                          </span>
                        </div>
                      </div>
                    </div>

                    <details className="form-advanced">
                      <summary>
                        <span>
                          {t.contact.fields.moreDetails}
                          <small>{t.contact.fields.moreDetailsHint}</small>
                        </span>
                        <ChevronDown size={16} aria-hidden="true" />
                      </summary>
                      <div className="form-grid form-wide">
                        <div className="field">
                          <label htmlFor="inquiry-budget">{t.contact.fields.budget}</label>
                          <input
                            id="inquiry-budget"
                            name="budget"
                            type="text"
                            value={values.budget}
                            onChange={(event) => updateField('budget', event.target.value)}
                            placeholder={t.contact.fields.budgetPlaceholder}
                          />
                        </div>
                        <div className={`field ${errors.deadline ? 'is-invalid' : ''}`}>
                          <label htmlFor="inquiry-deadline">
                            {t.contact.fields.deadline}
                          </label>
                          <input
                            id="inquiry-deadline"
                            name="deadline"
                            type="date"
                            min={minDate}
                            value={values.deadline}
                            onChange={(event) => updateField('deadline', event.target.value)}
                            aria-invalid={Boolean(errors.deadline)}
                            aria-describedby={
                              errors.deadline ? 'inquiry-deadline-error' : undefined
                            }
                          />
                          <FieldError id="inquiry-deadline-error" message={errors.deadline} />
                        </div>
                        <div className="field">
                          <label htmlFor="inquiry-duration">
                            {t.contact.fields.duration}
                          </label>
                          <input
                            id="inquiry-duration"
                            name="duration"
                            type="text"
                            value={values.duration}
                            onChange={(event) => updateField('duration', event.target.value)}
                            placeholder={t.contact.fields.durationPlaceholder}
                          />
                        </div>
                        <div
                          className={`field ${errors.references ? 'is-invalid' : ''}`}
                        >
                          <label htmlFor="inquiry-references">
                            {t.contact.fields.references}
                          </label>
                          <textarea
                            id="inquiry-references"
                            name="references"
                            rows={3}
                            value={values.references}
                            onChange={(event) =>
                              updateField('references', event.target.value)
                            }
                            placeholder={t.contact.fields.referencesPlaceholder}
                            aria-invalid={Boolean(errors.references)}
                            aria-describedby={
                              errors.references ? 'inquiry-references-error' : undefined
                            }
                          />
                          <FieldError
                            id="inquiry-references-error"
                            message={errors.references}
                          />
                        </div>
                      </div>
                    </details>

                    <input
                      ref={honeypotRef}
                      type="text"
                      name="_gotcha"
                      className="hp-field"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    <div className="form-footer">
                      <p id="contact-required-note" className="form-required-note">
                        {t.contact.fields.requiredNote}
                      </p>
                      <button
                        type="submit"
                        className="button button--accent form-submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <LoaderCircle
                            size={17}
                            className="spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Send size={16} className="icon-directional" aria-hidden="true" />
                        )}
                        <span>
                          {isSubmitting
                            ? t.contact.submitting
                            : noProvider
                              ? t.contact.submitLocal
                              : t.contact.submitConfigured}
                        </span>
                      </button>
                    </div>
                    <p className="form-privacy">{t.contact.privacyNote}</p>
                  </form>

                  {showFallback ? (
                    <div className="form-status form-status--fallback">
                      <p className="form-status__eyebrow eyebrow">
                        {t.contact.directFallbackNote}
                      </p>
                      <div className="handoff-actions">
                        <a href={mailtoHref} className="button button--accent">
                          <Mail size={16} aria-hidden="true" />
                          <span>{t.contact.emailDraft}</span>
                        </a>
                        <a
                          href={siteConfig.socials.whatsapp}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="button button--ghost"
                          onClick={handleWhatsApp}
                        >
                          <MessageCircle size={16} aria-hidden="true" />
                          <span>{t.contact.whatsappSend}</span>
                        </a>
                      </div>
                      <p className="handoff-hint">{t.contact.whatsappHint}</p>
                      <p className="form-copy-status" role="status" aria-live="polite">
                        {copyMessage}
                      </p>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

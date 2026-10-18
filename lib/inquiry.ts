export type ContactMethod = '' | 'whatsapp' | 'email' | 'other'
export type InquiryLanguage = 'en' | 'ar' | 'either'

export interface InquiryValues {
  name: string
  email: string
  company: string
  contactMethod: ContactMethod
  contactHandle: string
  projectType: string
  message: string
  budget: string
  deadline: string
  duration: string
  references: string
  language: InquiryLanguage
}

export interface InquiryFieldErrors {
  name?: string
  email?: string
  projectType?: string
  message?: string
  references?: string
  deadline?: string
}

export interface InquiryErrorMessages {
  nameRequired: string
  nameTooLong: string
  emailRequired: string
  emailInvalid: string
  projectTypeRequired: string
  messageRequired: string
  messageShort: string
  messageTooLong: string
  referencesInvalid: string
  dateInvalid: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export function createEmptyInquiry(language: InquiryLanguage = 'en'): InquiryValues {
  return {
    name: '',
    email: '',
    company: '',
    contactMethod: '',
    contactHandle: '',
    projectType: '',
    message: '',
    budget: '',
    deadline: '',
    duration: '',
    references: '',
    language,
  }
}

export function splitReferences(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function isValidReference(value: string): boolean {
  if (!value) return false
  const normalised = /^https?:\/\//i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(normalised)
    return Boolean(
      url.hostname.includes('.') &&
        !url.hostname.startsWith('.') &&
        !url.hostname.endsWith('.'),
    )
  } catch {
    return false
  }
}

function isPastDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return true
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}

export function validateInquiry(
  values: InquiryValues,
  messages: InquiryErrorMessages,
): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()
  const references = splitReferences(values.references)

  if (!name) {
    errors.name = messages.nameRequired
  } else if (name.length > 80) {
    errors.name = messages.nameTooLong
  }

  if (!email) {
    errors.email = messages.emailRequired
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = messages.emailInvalid
  }

  if (!values.projectType) {
    errors.projectType = messages.projectTypeRequired
  }

  if (!message) {
    errors.message = messages.messageRequired
  } else if (message.length < 20) {
    errors.message = messages.messageShort
  } else if (message.length > 2000) {
    errors.message = messages.messageTooLong
  }

  if (references.some((reference) => !isValidReference(reference))) {
    errors.references = messages.referencesInvalid
  }

  if (values.deadline && isPastDate(values.deadline)) {
    errors.deadline = messages.dateInvalid
  }

  return errors
}

export function hasInquiryErrors(errors: InquiryFieldErrors): boolean {
  return Object.keys(errors).length > 0
}

export function sanitizeValues(values: InquiryValues): InquiryValues {
  const trim = (value: string) =>
    value.trim().split(String.fromCharCode(0)).join('')
  return {
    name: trim(values.name),
    email: trim(values.email).toLowerCase(),
    company: trim(values.company),
    contactMethod: values.contactMethod,
    contactHandle: trim(values.contactHandle),
    projectType: values.projectType,
    message: trim(values.message),
    budget: trim(values.budget),
    deadline: values.deadline,
    duration: trim(values.duration),
    references: trim(values.references),
    language: values.language,
  }
}

export interface InquiryMessageLabels {
  intro: string
  name: string
  email: string
  company: string
  preferredContact: string
  contactHandle: string
  projectType: string
  message: string
  budget: string
  deadline: string
  duration: string
  references: string
  preferredLanguage: string
  projectTypes: Record<string, string>
  contactMethods: Record<string, string>
  languages: Record<InquiryLanguage, string>
  locale: 'en' | 'ar'
}

function localisedDate(value: string, locale: 'en' | 'ar'): string {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    dateStyle: 'medium',
  }).format(date)
}

export function buildInquiryMessage(
  rawValues: InquiryValues,
  labels: InquiryMessageLabels,
): string {
  const values = sanitizeValues(rawValues)
  const lines: string[] = [labels.intro, '', `${labels.name}: ${values.name}`]
  lines.push(`${labels.email}: ${values.email}`)

  if (values.company) lines.push(`${labels.company}: ${values.company}`)
  if (values.contactMethod) {
    const method = labels.contactMethods[values.contactMethod] ?? values.contactMethod
    lines.push(`${labels.preferredContact}: ${method}`)
  }
  if (values.contactHandle) lines.push(`${labels.contactHandle}: ${values.contactHandle}`)

  const projectType = labels.projectTypes[values.projectType] ?? values.projectType
  lines.push(`${labels.projectType}: ${projectType}`)
  lines.push(`${labels.preferredLanguage}: ${labels.languages[values.language]}`)
  lines.push('', `${labels.message}:`, values.message)

  if (values.budget) lines.push('', `${labels.budget}: ${values.budget}`)
  if (values.deadline) {
    lines.push(`${labels.deadline}: ${localisedDate(values.deadline, labels.locale)}`)
  }
  if (values.duration) lines.push(`${labels.duration}: ${values.duration}`)
  if (values.references) {
    lines.push('', `${labels.references}:`, ...splitReferences(values.references))
  }

  return lines.join('\n')
}

export function buildInquirySubject(
  values: InquiryValues,
  projectTypes: Record<string, string>,
  title: string,
): string {
  const projectType = projectTypes[values.projectType] ?? values.projectType
  return `${title} — ${values.name.trim()}${projectType ? ` / ${projectType}` : ''}`
}

export function buildMailtoHref(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

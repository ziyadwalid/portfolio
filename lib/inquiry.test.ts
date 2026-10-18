import { describe, expect, it } from 'vitest'
import {
  buildInquiryMessage,
  buildMailtoHref,
  createEmptyInquiry,
  sanitizeValues,
  splitReferences,
  validateInquiry,
  type InquiryMessageLabels,
  type InquiryValues,
} from './inquiry'

const messages = {
  nameRequired: 'name required',
  nameTooLong: 'name too long',
  emailRequired: 'email required',
  emailInvalid: 'email invalid',
  projectTypeRequired: 'project type required',
  messageRequired: 'message required',
  messageShort: 'message too short',
  messageTooLong: 'message too long',
  referencesInvalid: 'references invalid',
  dateInvalid: 'date invalid',
}

const validValues: InquiryValues = {
  ...createEmptyInquiry('en'),
  name: '  Ziad  ',
  email: 'HELLO@EXAMPLE.COM',
  projectType: 'reels-shorts',
  message: 'A short campaign edit for a new product launch.',
  contactMethod: 'whatsapp',
  contactHandle: '+20 100 000 0000',
  deadline: '2099-06-15',
  budget: 'A range in USD',
  duration: '45 seconds',
  references: 'https://example.com/inspiration',
}

const labels: InquiryMessageLabels = {
  intro: 'Project inquiry',
  name: 'Name',
  email: 'Email',
  company: 'Company',
  preferredContact: 'Preferred contact',
  contactHandle: 'Handle',
  projectType: 'Project type',
  message: 'Project',
  budget: 'Budget',
  deadline: 'Deadline',
  duration: 'Duration',
  references: 'References',
  preferredLanguage: 'Language',
  projectTypes: { 'reels-shorts': 'Reels & Shorts' },
  contactMethods: {
    whatsapp: 'WhatsApp',
    email: 'Email',
    other: 'Other',
  },
  languages: {
    en: 'English',
    ar: 'Arabic',
    either: 'Either',
  },
  locale: 'en',
}

describe('validateInquiry', () => {
  it('accepts a complete, valid inquiry', () => {
    expect(validateInquiry(validValues, messages)).toEqual({})
  })

  it('reports missing required fields', () => {
    const errors = validateInquiry(createEmptyInquiry(), messages)
    expect(errors.name).toBe('name required')
    expect(errors.email).toBe('email required')
    expect(errors.projectType).toBe('project type required')
    expect(errors.message).toBe('message required')
  })

  it('rejects malformed email, short message, and bad reference URLs', () => {
    const errors = validateInquiry(
      {
        ...validValues,
        email: 'not-an-email',
        message: 'Too short',
        references: 'not a real domain',
      },
      messages,
    )

    expect(errors.email).toBe('email invalid')
    expect(errors.message).toBe('message too short')
    expect(errors.references).toBe('references invalid')
  })

  it('rejects past delivery dates', () => {
    const errors = validateInquiry({ ...validValues, deadline: '2000-01-01' }, messages)
    expect(errors.deadline).toBe('date invalid')
  })
})

describe('inquiry helpers', () => {
  it('sanitises whitespace and normalises email casing', () => {
    const clean = sanitizeValues(validValues)
    expect(clean.name).toBe('Ziad')
    expect(clean.email).toBe('hello@example.com')
  })

  it('splits comma- and newline-separated references', () => {
    expect(splitReferences('https://a.example, https://b.example\nhttps://c.example')).toEqual([
      'https://a.example',
      'https://b.example',
      'https://c.example',
    ])
  })

  it('builds a clear plain-text brief with the selected labels', () => {
    const text = buildInquiryMessage(validValues, labels)
    expect(text).toContain('Name: Ziad')
    expect(text).toContain('Email: hello@example.com')
    expect(text).toContain('Project type: Reels & Shorts')
    expect(text).toContain('Preferred contact: WhatsApp')
    expect(text).toContain('Project:')
    expect(text).toContain('A short campaign edit')
  })

  it('encodes a mailto fallback correctly', () => {
    const href = buildMailtoHref('hello@example.com', 'A brief & a question', 'Line one\nLine two')
    expect(href.startsWith('mailto:hello@example.com?')).toBe(true)
    expect(href).toContain('subject=A%20brief%20%26%20a%20question')
    expect(href).toContain('body=Line%20one%0ALine%20two')
  })
})

/**
 * SITE & CONTACT SETTINGS
 * -----------------------
 * Edit social destinations, contact details, and integration settings here.
 * Nothing secret belongs in this file: it is bundled into client-side code.
 */
const emailFromEnv = import.meta.env.VITE_CONTACT_EMAIL?.trim() ?? ''
const endpointFromEnv = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim() ?? ''
const siteUrlFromEnv = import.meta.env.VITE_SITE_URL?.trim() ?? ''

export const siteConfig = {
  name: 'Ziad V.D',
  displayName: 'ZIAD V.D',
  role: {
    en: 'Creative Video Editor & Motion Designer',
    ar: 'محرر فيديو إبداعي ومصمم موشن جرافيك',
  },
  tagline: {
    en: 'Every Frame. A Purpose.',
    ar: 'كل كادر له هدف.',
  },
  supportingStatement: {
    en: 'I turn ideas into compelling visual stories.',
    ar: 'أحوّل الأفكار إلى قصص بصرية مؤثرة.',
  },
  /** Confirmed contact email. VITE_CONTACT_EMAIL can override it if needed. */
  email: emailFromEnv || 'zeadwalid56@gmail.com',
  /** Public form endpoint only. Never place a private API key in VITE_* vars. */
  contactFormEndpoint: endpointFromEnv,
  siteUrl: siteUrlFromEnv.replace(/\/$/, ''),
  localeStorageKey: 'ziad-vd-locale',
  socials: {
    whatsapp: 'https://wa.me/ziyadwalid395?s=t',
    instagram:
      'https://www.instagram.com/ziad_walid__video_editor?vrfl=eXo5enQ2MzVkejA3',
    tiktok:
      'https://www.tiktok.com/@ziyadwalid72?is_from_webapp=1&sender_device=pc',
  },
  cvPdf: {
    en: '/cv/ziad-vd-cv-en.pdf',
    ar: '/cv/ziad-vd-cv-ar.pdf',
  },
} as const

export type SocialKey = keyof typeof siteConfig.socials

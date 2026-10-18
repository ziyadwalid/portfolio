import type { Localized } from '../lib/types'

export interface Service {
  id: string
  number: string
  title: Localized
  description: Localized
  relatedProjectSlugs: string[]
}

/**
 * SERVICES
 * --------
 * Keep this list honest: only offer work you are ready to take on. The optional
 * relatedProjectSlugs connect a service to a real piece in projects.ts.
 */
export const services: Service[] = [
  {
    id: 'reels-shorts',
    number: '01',
    title: {
      en: 'Reels & Shorts Editing',
      ar: 'مونتاج الريلز والشورتس',
    },
    description: {
      en: 'Vertical edits built around a strong opening, clean pacing, and a payoff worth staying for.',
      ar: 'مونتاج عمودي يبدأ بخطّاف قوي، بإيقاع نظيف، ونهاية تستحق المشاهدة حتى آخرها.',
    },
    relatedProjectSlugs: ['before-after', 'white-minimal'],
  },
  {
    id: 'talking-head',
    number: '02',
    title: {
      en: 'Talking-Head Editing',
      ar: 'مونتاج فيديو التوكينج هيد',
    },
    description: {
      en: 'Conversations shaped into watchable stories with thoughtful framing, punch-ins, and visual emphasis.',
      ar: 'حوارات تتحول إلى قصص مشاهَدة، بتأطير مدروس وتقريب ولمسات بصرية تخدم الكلام.',
    },
    relatedProjectSlugs: ['before-after'],
  },
  {
    id: 'motion-graphics',
    number: '03',
    title: {
      en: 'Motion Graphics',
      ar: 'موشن جرافيك',
    },
    description: {
      en: 'Type, shape, and 3D-led systems that make an idea clearer and give the edit its own signature.',
      ar: 'أنظمة من الخطوط والأشكال والعناصر ثلاثية الأبعاد توضّح الفكرة وتمنح المونتاج بصمته الخاصة.',
    },
    relatedProjectSlugs: ['isometric-style'],
  },
  {
    id: 'commercial-video',
    number: '04',
    title: {
      en: 'Commercial Video Editing',
      ar: 'مونتاج الفيديو التجاري',
    },
    description: {
      en: 'Product and brand stories paced for clarity, cut to the message, and finished for delivery.',
      ar: 'قصص منتجات وعلامات تجارية بإيقاع واضح، مقطوعة لخدمة الرسالة، ومنتهية وجاهزة للتسليم.',
    },
    relatedProjectSlugs: [],
  },
  {
    id: 'youtube-long-form',
    number: '05',
    title: {
      en: 'YouTube Long-form Editing',
      ar: 'مونتاج فيديوهات يوتيوب الطويلة',
    },
    description: {
      en: 'Long-form structure that holds attention through chaptering, pacing, and a clean narrative thread.',
      ar: 'بناء طويل يحافظ على الانتباه عبر التقسيم والإيقاع وخيط سردي نظيف.',
    },
    relatedProjectSlugs: [],
  },
  {
    id: 'color-grading',
    number: '06',
    title: {
      en: 'Color Grading',
      ar: 'تدريج الألوان',
    },
    description: {
      en: 'A considered look that unifies the footage and sets the emotional temperature of the piece.',
      ar: 'معالجة لونية مدروسة توحّد الصورة وتضبط الحالة الشعورية للعمل.',
    },
    relatedProjectSlugs: ['before-after', 'white-minimal'],
  },
  {
    id: 'ui-motion',
    number: '07',
    title: {
      en: 'UI Motion & Animated Interfaces',
      ar: 'موشن الواجهات والأنظمة المتحركة',
    },
    description: {
      en: 'Interface-led motion built around clear hierarchy, controlled playback states, and a calm visual rhythm.',
      ar: 'موشن قائم على الواجهات، بتدرّج واضح وحركة تشغيل محسوبة وإيقاع بصري هادئ.',
    },
    relatedProjectSlugs: ['ui-motion-study'],
  },
]

export const projectTypeIds = [
  'reels-shorts',
  'talking-head',
  'motion-graphics',
  'commercial-video',
  'youtube-long-form',
  'color-grading',
  'ui-motion',
  'other',
] as const

export type ProjectTypeId = (typeof projectTypeIds)[number]

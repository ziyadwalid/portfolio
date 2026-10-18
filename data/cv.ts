import type { Localized } from '../lib/types'

export interface CvExperienceEntry {
  role: Localized
  organisation?: Localized
  period: Localized
  summary: Localized
}

export interface CvEducationEntry {
  qualification: Localized
  institution?: Localized
  period?: string
  status?: Localized
}

export interface CvCollaboration {
  name: string
  type: Localized
  url: string
}

export interface CvLanguage {
  name: Localized
  proficiency: Localized | null
}

/**
 * CV CONTENT
 * ----------
 * Facts below are confirmed by Ziad. Keep employment dates, formal job titles,
 * education dates, certifications, language proficiency, and achievements as
 * clearly marked placeholders unless they are verified.
 *
 * The Faculty of Commerce entry intentionally omits a university name and dates
 * because they were not supplied.
 */
export const cvData = {
  summary: {
    en: 'Creative Video Editor & Motion Designer with approximately one year of experience creating engaging short-form content, storytelling edits, motion graphics, and visually polished social media videos. Experienced in working with brands and content creators, with a focus on clear visual communication, pacing, and purposeful design.',
    ar: 'محرر فيديو ومصمم موشن جرافيك بخبرة تقارب سنة في إنتاج محتوى قصير جذاب، ومونتاج قائم على السرد القصصي، والموشن جرافيك، وفيديوهات السوشيال ميديا. لدي خبرة في التعاون مع براندات وصنّاع محتوى، مع التركيز على وضوح الرسالة، وإيقاع المونتاج، والتصميم البصري الهادف.',
  },
  skills: {
    en: [
      'Story structure & pacing',
      'Short-form editing — Reels & Shorts',
      'Talking-head editing',
      'Motion graphics & animated typography',
      'UI-style visual editing',
      'Colour grading',
      'Sound design & SFX',
      'AI-assisted video production',
      'Delivery-ready workflows',
    ],
    ar: [
      'بناء القصة والإيقاع',
      'مونتاج المحتوى القصير — ريلز وشورتس',
      'مونتاج التوكينج هيد',
      'موشن جرافيك وتايبوغرافي متحرك',
      'تحرير بصري بأسلوب الواجهات',
      'تدريج الألوان',
      'تصميم صوتي ومؤثرات',
      'إنتاج فيديو بمساعدة الذكاء الاصطناعي',
      'تسليم جاهز للنشر',
    ],
  },
  tools: [
    {
      name: 'DaVinci Resolve',
      detail: {
        en: 'Editing, colour, and finishing',
        ar: 'المونتاج، التلوين، والمعالجة النهائية',
      },
    },
  ],
  selectedProjectSlugs: [
    'before-after',
    'white-minimal',
    'isometric-style',
    'ui-motion-study',
    'creative-editing-study',
  ],
  experience: [
    {
      role: {
        en: 'Creative Video Editor & Motion Designer',
        ar: 'محرر فيديو إبداعي ومصمم موشن جرافيك',
      },
      period: {
        en: 'Approx. 1 year',
        ar: 'حوالي سنة',
      },
      summary: {
        en: 'Short-form content, storytelling edits, motion graphics, and polished social media videos for brands and content creators.',
        ar: 'محتوى قصير، ومونتاج قصصي، وموشن جرافيك، وفيديوهات سوشيال ميديا مصقولة لعلامات تجارية وصنّاع محتوى.',
      },
    },
  ] as CvExperienceEntry[],
  collaborations: [
    {
      name: 'Estabraq',
      type: {
        en: 'Home & lifestyle brand',
        ar: 'علامة منزل وأسلوب حياة',
      },
      url: 'https://www.instagram.com/estabraq.home/',
    },
    {
      name: 'Dr. Ahmed Elshabrawy',
      type: {
        en: 'Content creator',
        ar: 'صانع محتوى',
      },
      url: 'https://www.instagram.com/dr.ahmed.elshabrawy/',
    },
  ] as CvCollaboration[],
  education: [
    {
      qualification: {
        en: 'Faculty of Commerce',
        ar: 'كلية التجارة',
      },
      status: {
        en: 'First-year student',
        ar: 'طالب في السنة الأولى',
      },
    },
  ] as CvEducationEntry[],
  languages: [
    {
      name: { en: 'Arabic', ar: 'العربية' },
      proficiency: null,
    },
    {
      name: { en: 'English', ar: 'English' },
      proficiency: null,
    },
  ] as CvLanguage[],
}

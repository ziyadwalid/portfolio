import type { Project } from '../lib/types'

/**
 * THE WORK INDEX
 * --------------
 * Add, remove, or edit projects here. The homepage and detail pages read from
 * this file. Only supply information you can verify — no invented clients,
 * results, awards, or measurements.
 *
 * Video providers supported by the player:
 *   provider: 'file'  -> src is a direct MP4/WebM URL (local or remote).
 *   provider: 'embed' -> src is an embeddable preview URL (e.g. Drive /preview).
 *
 * The supplied Google Drive originals are linked in every project as a backup.
 */
export const projects: Project[] = [
  {
    id: 'before-after',
    slug: 'before-after',
    index: '01',
    featured: true,
    title: {
      en: 'Before / After',
      ar: 'قبل / بعد',
    },
    category: {
      en: 'Talking Head',
      ar: 'توكينج هيد',
    },
    summary: {
      en: 'A vertical talking-head edit staged as a living before/after: raw take on the left, finished frame on the right.',
      ar: 'مونتاج عمودي لفيديو توكينج هيد في صورة «قبل / بعد» حية: اللقطة الخام على اليسار، والكادر النهائي على اليمين.',
    },
    overview: {
      en: 'A short-form study in transformation. The piece puts the unedited take beside the finished cut, making the craft visible: framing, rhythm, typography, and colour all working inside one vertical frame.',
      ar: 'دراسة قصيرة عن التحوّل البصري. يضع العمل اللقطة غير المونتجة بجوار النسخة النهائية، فتصبح الصنعة مرئية: التأطير، الإيقاع، الخطوط، واللون داخل كادر عمودي واحد.',
    },
    approach: {
      en: 'Contrast is built into the structure: a quieter raw frame against a more saturated finished one. Split-screen staging, punch-ins, and short typographic beats keep the comparison legible without covering the speaker.',
      ar: 'التضاد جزء من البناء: لقطة خام أهدأ أمام نسخة نهائية أكثر تشبّعًا. تقسيم الشاشة، والتقريب، واللمحات الخطية القصيرة تحافظ على وضوح المقارنة دون أن تحجب المتحدث.',
    },
    role: {
      en: 'Editing & post-production',
      ar: 'المونتاج والمعالجة النهائية',
    },
    format: {
      en: 'Vertical / 9:16',
      ar: 'عمودي / 9:16',
    },
    focus: {
      en: ['Pacing', 'Split-screen', 'Typography'],
      ar: ['الإيقاع', 'تقسيم الشاشة', 'التايبوغرافي'],
    },
    poster: '/media/posters/before-after.jpg',
    hoverPoster: '/media/posters/before-after-alt.jpg',
    accent: '#d21753',
    relatedSlugs: ['white-minimal', 'isometric-style'],
    // A short muted loop keeps the hero light. Replace if this project changes.
    previewLoop: '/media/videos/hero-loop.mp4',
    video: {
      provider: 'file',
      src: '/media/videos/before-after.mp4',
      mimeType: 'video/mp4',
      originalUrl:
        'https://drive.google.com/file/d/1rPN5-vXfqszu0yt2CuLUClKx5K7KfUqc/view?usp=drivesdk',
      poster: '/media/posters/before-after.jpg',
      aspectRatio: '9:16',
      durationLabel: '00:53',
    },
  },
  {
    id: 'white-minimal',
    slug: 'white-minimal',
    index: '02',
    featured: false,
    title: {
      en: 'White Minimal',
      ar: 'وايت مينيمال',
    },
    category: {
      en: 'Editorial / Typography',
      ar: 'تحرير بصري / تايبوغرافي',
    },
    summary: {
      en: 'An Arabic thought piece reduced to monochrome, expressive type, and room to breathe.',
      ar: 'عمل فكري بالعربية، مختزل إلى الأبيض والأسود وتايبوغرافي معبّر ومساحة تسمح للفكرة بالتنفس.',
    },
    overview: {
      en: 'A restrained visual essay about the brain and how ideas move through it. Black-and-white imagery, Arabic type, and deliberate negative space carry the narration instead of competing with it.',
      ar: 'مقال بصري هادئ عن العقل وكيف تمرّ الأفكار داخله. الصور بالأبيض والأسود، والخط العربي، والفراغ المقصود تحمل السرد بدلًا من أن تنافسه.',
    },
    approach: {
      en: 'The edit leans on pace and contrast. Graphic stills, macro inserts, and short type animations create rhythm while leaving the Arabic copy room to land. White space is treated as a cut, not an empty gap.',
      ar: 'يعتمد المونتاج على الإيقاع والتضاد. الصور الجرافيكية، واللقطات القريبة، وحركات الخط القصيرة تصنع الإيقاع وتترك للنص العربي مساحة ليصل. المساحة البيضاء هنا قطعٌ مقصود، وليست فراغًا.',
    },
    role: {
      en: 'Editing & visual assembly',
      ar: 'المونتاج والتجميع البصري',
    },
    format: {
      en: 'Vertical / 9:16',
      ar: 'عمودي / 9:16',
    },
    focus: {
      en: ['Monochrome', 'Visual rhythm', 'Arabic type'],
      ar: ['أبيض وأسود', 'الإيقاع البصري', 'الخط العربي'],
    },
    poster: '/media/posters/white-minimal.jpg',
    hoverPoster: '/media/posters/white-minimal-alt.jpg',
    accent: '#cfcfc8',
    relatedSlugs: ['before-after', 'isometric-style'],
    video: {
      provider: 'file',
      src: '/media/videos/white-minimal.mp4',
      mimeType: 'video/mp4',
      originalUrl:
        'https://drive.google.com/file/d/1WAViUNn41DAHfpU95XGNg3csvd0BLpOh/view?usp=drivesdk',
      poster: '/media/posters/white-minimal.jpg',
      aspectRatio: '9:16',
      durationLabel: '00:23',
    },
  },
  {
    id: 'isometric-style',
    slug: 'isometric-style',
    index: '03',
    featured: false,
    title: {
      en: 'Isometric Style',
      ar: 'ستايل آيزومتريك',
    },
    category: {
      en: 'Motion Graphics',
      ar: 'موشن جرافيك',
    },
    summary: {
      en: 'A playful 3D world built around a tiny restaurant, warm light, and a very big sense of place.',
      ar: 'عالم ثلاثي الأبعاد مبني حول مطعم صغير، بإضاءة دافئة وشعور كبير بالمكان.',
    },
    overview: {
      en: 'A short isometric motion piece that places a tiny restaurant on its own map. Soft 3D forms, warm light, and a clean typographic build give the story a little world to live in.',
      ar: 'عمل موشن قصير بالأسلوب الآيزومتريك يضع مطعمًا صغيرًا على خريطته الخاصة. الأشكال ثلاثية الأبعاد الناعمة، والإضاءة الدافئة، وبناء الخطوط النظيف يمنحان القصة عالمًا صغيرًا تعيش فيه.',
    },
    approach: {
      en: 'The motion is paced as a short reveal: establish the location, introduce the visual system, then let the details arrive. Graphic elements and type share the same isometric logic so the whole piece feels constructed, not decorated.',
      ar: 'إيقاع الحركة مبني ككشف قصير: نُثبّت المكان، ثم نقدّم النظام البصري، ثم نترك التفاصيل تصل. العناصر الجرافيكية والخطوط تشترك في المنطق الآيزومتريك نفسه، فيبدو العمل مبنيًا لا مزيّنًا.',
    },
    role: {
      en: 'Edit, motion assembly & finishing',
      ar: 'المونتاج وتجميع الموشن والمعالجة النهائية',
    },
    format: {
      en: 'Vertical / 9:16',
      ar: 'عمودي / 9:16',
    },
    focus: {
      en: ['3D composition', 'Graphic transitions', 'Type reveals'],
      ar: ['التكوين ثلاثي الأبعاد', 'الانتقالات الجرافيكية', 'ظهور الخطوط'],
    },
    poster: '/media/posters/isometric-style-card.jpg',
    hoverPoster: '/media/posters/isometric-style-hover.jpg',
    accent: '#e8dd52',
    relatedSlugs: ['before-after', 'white-minimal'],
    video: {
      provider: 'file',
      src: '/media/videos/isometric-style.mp4',
      mimeType: 'video/mp4',
      originalUrl:
        'https://drive.google.com/file/d/1kdDXTt28Iu_o9Zq_iOdr8hcnktMYYYJi/view?usp=drivesdk',
      poster: '/media/posters/isometric-style-video.jpg',
      aspectRatio: '9:16',
      durationLabel: '00:10',
    },
  },
  {
    id: 'ui-motion-study',
    slug: 'ui-motion-study',
    index: '04',
    featured: false,
    title: {
      en: 'UI Motion Study',
      ar: 'تجربة موشن جرافيك للواجهات',
    },
    category: {
      en: 'UI Motion',
      ar: 'موشن واجهات',
    },
    summary: {
      en: 'A wide-format UI study built around a music-player interface, where hierarchy, artwork, and quiet playback motion do the work.',
      ar: 'دراسة واجهات أفقية تتمحور حول مشغّل موسيقى، حيث يقوم العمل على تسلسل العناصر والغلاف وحركة التشغيل الهادئة.',
    },
    overview: {
      en: 'A landscape interface study centred on a single music-player screen. The composition keeps the artwork and typographic hierarchy at the front, while the progress state and transport controls move just enough to keep the interface alive.',
      ar: 'دراسة واجهة أفقية تدور حول شاشة مشغّل موسيقى واحدة. يحافظ التكوين على الغلاف وتسلسل الخطوط في المقدمة، بينما تتحرك حالة التقدم وأزرار التحكم بقدر يكفي لإبقاء الواجهة حيّة.',
    },
    approach: {
      en: 'The piece gives the interface room to breathe: stable framing, clean type, and minimal overlap. Motion is kept restrained so the viewer reads the interface rather than watching effects.',
      ar: 'يمنح العمل الواجهة مساحة للتنفس: تأطير ثابت، وخطوط نظيفة، وتداخل بصري محدود. الحركة محسوبة بهدوء لقراءة الواجهة بدلًا من الانشغال بالمؤثرات.',
    },
    role: {
      en: 'UI motion & editing',
      ar: 'موشن الواجهة والمونتاج',
    },
    format: {
      en: 'Landscape / 16:9',
      ar: 'أفقي / 16:9',
    },
    focus: {
      en: ['UI hierarchy', 'Playback motion', 'Composition'],
      ar: ['تسلسل الواجهة', 'حركة التشغيل', 'التكوين'],
    },
    poster: '/media/posters/ui-motion-study-card.jpg',
    hoverPoster: '/media/posters/ui-motion-study-card-alt.jpg',
    accent: '#22c77a',
    relatedSlugs: ['isometric-style', 'creative-editing-study'],
    video: {
      provider: 'file',
      src: '/media/videos/ui-motion-study.mp4',
      mimeType: 'video/mp4',
      originalUrl:
        'https://drive.google.com/file/d/1ps5d1tG2LcdVdEJi01Ouuyr1Kf-sie1c/view?usp=drive_link',
      poster: '/media/posters/ui-motion-study.jpg',
      aspectRatio: '16:9',
      durationLabel: '00:56',
    },
  },
  {
    id: 'creative-editing-study',
    slug: 'creative-editing-study',
    index: '05',
    featured: false,
    title: {
      en: 'Creative Editing Study',
      ar: 'تجربة مونتاج إبداعية',
    },
    category: {
      en: 'Talking Head / Before & After',
      ar: 'توكينج هيد / قبل وبعد',
    },
    summary: {
      en: 'A vertical before/after edit that contrasts a raw talking-head take with a finished, caption-led cut.',
      ar: 'مونتاج عمودي «قبل / بعد» يقارن لقطة توكينج هيد خام بنسخة نهائية مصقولة تعتمد على الترجمة.',
    },
    overview: {
      en: 'A short comparison piece built around a single talking-head performance. The raw frame and the finished treatment sit side by side, with colour, scale, and captions doing the visible work.',
      ar: 'عمل مقارنة قصير مبني حول أداء واحد أمام الكاميرا. تظهر اللقطة الخام والنسخة النهائية جنبًا إلى جنب، مع معالجة لونية وتغيير في الحجم وترجمة تقوم بالعمل البصري.',
    },
    approach: {
      en: 'The edit treats the split as a rhythm: a paired performance, a more saturated background, and concise Arabic captions pull the eye toward the finished version without losing the raw reference.',
      ar: 'يتعامل المونتاج مع تقسيم الشاشة كإيقاع: أداء متقابل، وخلفية أكثر تشبّعًا، وترجمة عربية موجزة توجّه العين إلى النسخة النهائية دون فقدان المرجع الخام.',
    },
    role: {
      en: 'Editing & post-production',
      ar: 'المونتاج والمعالجة النهائية',
    },
    format: {
      en: 'Vertical / 9:16',
      ar: 'عمودي / 9:16',
    },
    focus: {
      en: ['Before / after', 'Arabic captions', 'Colour contrast'],
      ar: ['قبل / بعد', 'الترجمة العربية', 'تباين الألوان'],
    },
    poster: '/media/posters/creative-editing-study-card.jpg',
    hoverPoster: '/media/posters/creative-editing-study-card-alt.jpg',
    accent: '#2834a8',
    relatedSlugs: ['before-after', 'ui-motion-study'],
    video: {
      provider: 'file',
      src: '/media/videos/creative-editing-study.mp4',
      mimeType: 'video/mp4',
      originalUrl:
        'https://drive.google.com/file/d/1c-3IEsBmsMZVjGHUF-rZ-wtSo5FqR8Tp/view?usp=drive_link',
      poster: '/media/posters/creative-editing-study.jpg',
      aspectRatio: '9:16',
      durationLabel: '00:27',
    },
  },
]

export const featuredProject = projects.find((project) => project.featured) ?? projects[0]

export const supportingProjects = projects.filter((project) => project.id !== featuredProject.id)

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getRelatedProjects(project: Project): Project[] {
  return project.relatedSlugs
    .map((slug) => projects.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is Project => Boolean(candidate))
    .slice(0, 2)
}

export type Locale = 'en' | 'ar'

export type Localized = Record<Locale, string>

export type LocalizedList = Record<Locale, readonly string[]>

export type VideoProvider = 'file' | 'embed'

export interface ProjectVideo {
  /** Direct browser-playable file, or an embeddable preview URL. */
  provider: VideoProvider
  src: string
  mimeType?: string
  originalUrl: string
  poster: string
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5'
  durationLabel: string
}

export interface Project {
  id: string
  slug: string
  index: string
  featured: boolean
  title: Localized
  category: Localized
  summary: Localized
  overview: Localized
  approach: Localized
  role: Localized
  format: Localized
  focus: LocalizedList
  poster: string
  hoverPoster: string
  accent: string
  relatedSlugs: string[]
  video: ProjectVideo
  /** Optional lightweight, muted loop used by the homepage hero. */
  previewLoop?: string
}

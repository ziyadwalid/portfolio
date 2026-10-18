import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { en } from '../i18n/en'
import { ar } from '../i18n/ar'
import { cvData } from './cv'
import { projects } from './projects'
import { services } from './services'
import { siteConfig } from './siteConfig'

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return [`${prefix}[]`]
  }

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, child]) =>
      flattenKeys(child, prefix ? `${prefix}.${key}` : key),
    )
  }

  return [prefix]
}

describe('bilingual content', () => {
  it('keeps the Arabic dictionary structurally aligned with English', () => {
    expect(flattenKeys(ar).sort()).toEqual(flattenKeys(en).sort())
  })

  it('has an English and Arabic value for every project field', () => {
    for (const project of projects) {
      expect(project.title.en.length).toBeGreaterThan(0)
      expect(project.title.ar.length).toBeGreaterThan(0)
      expect(project.summary.en.length).toBeGreaterThan(0)
      expect(project.summary.ar.length).toBeGreaterThan(0)
      expect(project.overview.en.length).toBeGreaterThan(0)
      expect(project.overview.ar.length).toBeGreaterThan(0)
      expect(project.focus.en.length).toBeGreaterThan(0)
      expect(project.focus.ar.length).toBe(project.focus.en.length)
    }
  })

  it('keeps project slugs and IDs unique', () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length)
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length)
  })

  it('preserves the three original projects and adds both new studies', () => {
    expect(projects.map((project) => project.slug)).toEqual([
      'before-after',
      'white-minimal',
      'isometric-style',
      'ui-motion-study',
      'creative-editing-study',
    ])
  })

  it('links every service to a valid project slug', () => {
    const slugs = new Set(projects.map((project) => project.slug))
    for (const service of services) {
      for (const slug of service.relatedProjectSlugs) {
        expect(slugs.has(slug)).toBe(true)
      }
    }
  })
})

describe('media integrity', () => {
  it('has local posters and videos for every project', () => {
    for (const project of projects) {
      expect(existsSync(path.join(process.cwd(), 'public', project.poster))).toBe(true)
      expect(existsSync(path.join(process.cwd(), 'public', project.hoverPoster))).toBe(true)
      expect(existsSync(path.join(process.cwd(), 'public', project.video.src))).toBe(true)
    }
  })

  it('keeps backup links pointed at the supplied public Google Drive files', () => {
    for (const project of projects) {
      expect(project.video.originalUrl).toMatch(
        /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view/,
      )
    }
  })
})

describe('contact configuration', () => {
  it('uses the exact supplied social destinations', () => {
    expect(siteConfig.socials.whatsapp).toBe('https://wa.me/ziyadwalid395?s=t')
    expect(siteConfig.socials.instagram).toBe(
      'https://www.instagram.com/ziad_walid__video_editor?vrfl=eXo5enQ2MzVkejA3',
    )
    expect(siteConfig.socials.tiktok).toBe(
      'https://www.tiktok.com/@ziyadwalid72?is_from_webapp=1&sender_device=pc',
    )
  })

  it('uses the confirmed contact email by default', () => {
    if (!import.meta.env.VITE_CONTACT_EMAIL) {
      expect(siteConfig.email).toBe('zeadwalid56@gmail.com')
    }
  })
})

describe('CV content', () => {
  it('lists every current project in the selected work section', () => {
    expect(cvData.selectedProjectSlugs).toEqual(projects.map((project) => project.slug))
    expect(cvData.selectedProjectSlugs).toHaveLength(5)
  })

  it('uses the confirmed experience, education, and collaboration facts', () => {
    expect(cvData.summary.en).toContain('approximately one year')
    expect(cvData.summary.ar).toContain('تقارب سنة')
    expect(cvData.experience).toHaveLength(1)
    expect(cvData.experience[0].period.en).toMatch(/1 year/i)
    expect(cvData.education[0].qualification.en).toBe('Faculty of Commerce')
    expect(cvData.education[0].status?.en).toBe('First-year student')
    expect(cvData.collaborations.map((item) => item.url)).toEqual([
      'https://www.instagram.com/estabraq.home/',
      'https://www.instagram.com/dr.ahmed.elshabrawy/',
    ])
    expect(cvData.languages.every((language) => language.proficiency === null)).toBe(true)
  })
})

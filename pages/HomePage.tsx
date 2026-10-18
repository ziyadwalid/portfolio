import { useCallback, useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLocale } from '../i18n/LocaleContext'
import type { Project } from '../lib/types'
import { scrollToSection } from '../lib/utils'
import { AboutSection } from '../components/AboutSection'
import { ContactSection } from '../components/ContactSection'
import { Hero } from '../components/Hero'
import { ProjectPreviewModal } from '../components/ProjectPreviewModal'
import { ServicesSection } from '../components/ServicesSection'
import { WorkSection } from '../components/WorkSection'

export default function HomePage() {
  const { t } = useLocale()
  const [previewProject, setPreviewProject] = useState<Project | null>(null)
  const [requestedService, setRequestedService] = useState('')

  usePageMeta({
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
  })

  const openPreview = useCallback((project: Project) => {
    setPreviewProject(project)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewProject(null)
  }, [])

  const startBrief = useCallback((serviceId: string) => {
    setRequestedService(serviceId)
    scrollToSection('contact')
  }, [])

  return (
    <>
      <Hero onPreview={openPreview} />
      <WorkSection onPreview={openPreview} />
      <AboutSection />
      <ServicesSection onStartBrief={startBrief} />
      <ContactSection initialService={requestedService} />
      {previewProject ? (
        <ProjectPreviewModal project={previewProject} onClose={closePreview} />
      ) : null}
    </>
  )
}

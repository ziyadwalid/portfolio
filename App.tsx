import { Suspense, lazy, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ScrollManager } from './components/ScrollManager'
import { useLocale } from './i18n/LocaleContext'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const CVPage = lazy(() => import('./pages/CVPage'))

function PageLoader() {
  const { t } = useLocale()
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader__line" aria-hidden="true" />
      <span>{t.common.loading}</span>
    </div>
  )
}

export default function App() {
  const { t } = useLocale()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const mainRef = useRef<HTMLElement>(null)
  const previousPathRef = useRef(location.pathname)

  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      mainRef.current?.focus({ preventScroll: true })
      previousPathRef.current = location.pathname
    }
  }, [location.pathname])

  return (
    <div className="site">
      <a href="#main" className="skip-link">
        {t.nav.skipToContent}
      </a>
      <ScrollManager />
      <Header />

      <motion.main
        ref={mainRef}
        id="main"
        className="site-main"
        tabIndex={-1}
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<Navigate to="/#work" replace />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="/cv" element={<CVPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.main>

      <Footer />
    </div>
  )
}

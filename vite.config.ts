import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

/**
 * When VITE_SITE_URL is configured, the production build gets a canonical URL,
 * absolute social image URLs, and generated sitemap/robots files. Without a
 * known domain, none of those are guessed.
 */
function siteSeoPlugin(rawSiteUrl: string): Plugin {
  const siteUrl = rawSiteUrl.trim().replace(/\/$/, '')

  return {
    name: 'ziad-vd-site-seo',
    apply: 'build',
    transformIndexHtml(html) {
      if (!siteUrl) return html

      let next = html.replaceAll(
        'content="/media/og-cover.jpg"',
        `content="${siteUrl}/media/og-cover.jpg"`,
      )
      next = next.replace(
        '<meta property="og:site_name" content="Ziad V.D" />',
        `<meta property="og:site_name" content="Ziad V.D" />\n    <meta property="og:url" content="${siteUrl}/" />`,
      )
      if (!next.includes('rel="canonical"')) {
        next = next.replace(
          '  </head>',
          `    <link rel="canonical" href="${siteUrl}/" />\n  </head>`,
        )
      }
      return next
    },
    closeBundle() {
      if (!siteUrl) return

      let projectSlugs: string[]
      try {
        const projectSource = readFileSync(
          path.resolve(process.cwd(), 'src/data/projects.ts'),
          'utf8',
        )
        projectSlugs = [...projectSource.matchAll(/slug:\s*'([^']+)'/g)].map(
          (match) => match[1],
        )
      } catch {
        projectSlugs = []
      }

      const routes = [
        '/',
        '/cv',
        ...projectSlugs.map((slug) => `/work/${slug}`),
      ]
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) =>
      `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`,
  )
  .join('\n')}
</urlset>
`
      writeFileSync(path.resolve(process.cwd(), 'dist/sitemap.xml'), sitemap)

      const robotsPath = path.resolve(process.cwd(), 'dist/robots.txt')
      let robots = readFileSync(robotsPath, 'utf8').trimEnd()
      if (!robots.includes('Sitemap:')) {
        robots += `\n\nSitemap: ${siteUrl}/sitemap.xml\n`
      }
      writeFileSync(robotsPath, robots)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL ?? process.env.VITE_SITE_URL ?? ''

  return {
    plugins: [react(), siteSeoPlugin(siteUrl)],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
    preview: {
      host: '127.0.0.1',
      port: 4173,
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
                priority: 2,
              },
              {
                name: 'motion-vendor',
                test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
                priority: 1,
              },
            ],
          },
        },
      },
    },
  }
})

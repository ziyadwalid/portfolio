/**
 * Generates the downloadable CV PDFs from the real CV route using local Chrome.
 * Requires the dev or preview server to be running.
 *
 * Run: node scripts/generate-cv-pdfs.mjs
 * Env: QA_URL (default http://127.0.0.1:5173), CHROME_PATH
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const chromePath =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.env.QA_URL ?? 'http://127.0.0.1:5173'
const projectRoot = process.cwd()
const outputDir = path.join(projectRoot, 'public', 'cv')
await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ executablePath: chromePath, headless: true })

for (const locale of ['en', 'ar']) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    locale: locale === 'ar' ? 'ar-EG' : 'en-US',
  })

  // Export-only text items keep internal project links from becoming dead
  // localhost annotations inside a shared PDF.
  await page.goto(`${baseUrl}/cv?lang=${locale}&export=pdf`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.cv-sheet').waitFor({ state: 'visible' })
  await page.waitForTimeout(300)

  await page.emulateMedia({ media: 'print' })
  const pdfPath = path.join(outputDir, `ziad-vd-cv-${locale}.pdf`)
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })

  console.log(`Generated ${path.relative(projectRoot, pdfPath)}`)
  await page.close()
}

await browser.close()

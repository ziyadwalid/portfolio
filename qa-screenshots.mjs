import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const chromePath =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.env.QA_URL ?? 'http://127.0.0.1:5173'
const outDir = path.join(process.cwd(), '.tmp', 'qa')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ executablePath: chromePath, headless: true })

const cases = [
  { name: 'home-en-1440', width: 1440, height: 1000, url: '/?lang=en' },
  { name: 'home-en-1024', width: 1024, height: 900, url: '/?lang=en' },
  { name: 'home-en-768', width: 768, height: 900, url: '/?lang=en' },
  { name: 'home-en-390', width: 390, height: 844, url: '/?lang=en' },
  { name: 'home-en-360', width: 360, height: 800, url: '/?lang=en' },
  { name: 'home-ar-1440', width: 1440, height: 1000, url: '/?lang=ar' },
  { name: 'home-ar-390', width: 390, height: 844, url: '/?lang=ar' },
  { name: 'project-en-1440', width: 1440, height: 1000, url: '/work/before-after?lang=en' },
  { name: 'project-ar-390', width: 390, height: 844, url: '/work/white-minimal?lang=ar' },
  {
    name: 'project-ui-en-1440',
    width: 1440,
    height: 1000,
    url: '/work/ui-motion-study?lang=en',
  },
  {
    name: 'project-creative-en-390',
    width: 390,
    height: 844,
    url: '/work/creative-editing-study?lang=en',
  },
  { name: 'cv-en-1440', width: 1440, height: 1000, url: '/cv?lang=en' },
  { name: 'cv-ar-390', width: 390, height: 844, url: '/cv?lang=ar' },
  { name: 'notfound-en-1440', width: 1440, height: 1000, url: '/nothing-here?lang=en' },
]

const results = []

for (const testCase of cases) {
  const page = await browser.newPage({
    viewport: { width: testCase.width, height: testCase.height },
    locale: 'en-US',
  })
  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('requestfailed', (request) => {
    if (!request.url().includes('favicon.ico')) {
      failedRequests.push(`${request.url()} :: ${request.failure()?.errorText}`)
    }
  })

  await page.goto(`${baseUrl}${testCase.url}`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)

  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const step = window.innerHeight * 0.75
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await delay(130)
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(650)

  const layout = await page.evaluate(() => {
    const html = document.documentElement
    return {
      lang: html.lang,
      dir: html.dir,
      title: document.title,
      scrollWidth: html.scrollWidth,
      clientWidth: html.clientWidth,
      overflow: html.scrollWidth > html.clientWidth + 1,
      bodyHeight: document.body.scrollHeight,
    }
  })

  await page.screenshot({
    path: path.join(outDir, `${testCase.name}.png`),
    fullPage: true,
  })

  await page.screenshot({
    path: path.join(outDir, `${testCase.name}-hero.png`),
    fullPage: false,
  })

  results.push({
    name: testCase.name,
    ...layout,
    consoleErrors,
    pageErrors,
    failedRequests,
  })

  await page.close()
}

await browser.close()

console.log(JSON.stringify(results, null, 2))

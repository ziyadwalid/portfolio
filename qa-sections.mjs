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
  { name: 'en-1440', width: 1440, height: 1000, lang: 'en' },
  { name: 'ar-1440', width: 1440, height: 1000, lang: 'ar' },
  { name: 'en-768', width: 768, height: 900, lang: 'en' },
  { name: 'en-390', width: 390, height: 844, lang: 'en' },
  { name: 'ar-390', width: 390, height: 844, lang: 'ar' },
]

const selectors = [
  ['hero', '.hero'],
  ['work', '#work'],
  ['about', '#about'],
  ['services', '#services'],
  ['contact', '#contact'],
  ['footer', '.site-footer'],
]

for (const testCase of cases) {
  const page = await browser.newPage({
    viewport: { width: testCase.width, height: testCase.height },
    locale: testCase.lang === 'ar' ? 'ar-EG' : 'en-US',
  })
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto(`${baseUrl}/?lang=${testCase.lang}`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(900)

  // Slow scroll so reveal states settle, then return to the first section.
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const step = Math.round(window.innerHeight * 0.55)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await delay(190)
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)

  for (const [name, selector] of selectors) {
    const locator = page.locator(selector).first()
    await locator.scrollIntoViewIfNeeded()
    await page.waitForTimeout(550)
    await locator.screenshot({
      path: path.join(outDir, `section-${name}-${testCase.name}.png`),
    })
  }

  console.log(`${testCase.name}: captured ${selectors.length} sections; errors=${errors.length}`)
  if (errors.length) console.log(errors)
  await page.close()
}

await browser.close()

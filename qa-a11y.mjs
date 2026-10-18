/**
 * Accessibility scan with axe-core against the real rendered pages.
 * Run: node scripts/qa-a11y.mjs
 * Env: QA_URL (default http://127.0.0.1:5173), CHROME_PATH
 */
import { chromium } from 'playwright-core'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const chromePath =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.env.QA_URL ?? 'http://127.0.0.1:5173'

const browser = await chromium.launch({ executablePath: chromePath, headless: true })
const pagesToScan = [
  { name: 'home-en', url: '/?lang=en', width: 1440, height: 1000 },
  { name: 'home-ar', url: '/?lang=ar', width: 1440, height: 1000 },
  { name: 'home-mobile', url: '/?lang=en', width: 390, height: 844 },
  { name: 'home-ar-mobile', url: '/?lang=ar', width: 390, height: 844 },
  { name: 'project-en', url: '/work/before-after?lang=en', width: 1440, height: 1000 },
  { name: 'project-ar', url: '/work/white-minimal?lang=ar', width: 1440, height: 1000 },
  { name: 'project-ui-en', url: '/work/ui-motion-study?lang=en', width: 1440, height: 1000 },
  {
    name: 'project-creative-ar',
    url: '/work/creative-editing-study?lang=ar',
    width: 1440,
    height: 1000,
  },
  { name: 'cv-en', url: '/cv?lang=en', width: 1440, height: 1000 },
  { name: 'cv-ar', url: '/cv?lang=ar', width: 1440, height: 1000 },
  { name: 'not-found', url: '/missing-page?lang=en', width: 1440, height: 1000 },
]

let totalViolations = 0
let contextsScanned = 0
const violationsByRule = new Map()

function collectViolations(name, results) {
  contextsScanned += 1
  if (results.violations.length) {
    console.log(`\n${name}: ${results.violations.length} violation(s)`)
    for (const violation of results.violations) {
      totalViolations += violation.nodes.length
      const current = violationsByRule.get(violation.id) ?? {
        rule: violation.id,
        impact: violation.impact,
        help: violation.help,
        pages: new Set(),
        nodes: [],
      }
      current.pages.add(name)
      for (const node of violation.nodes) {
        current.nodes.push({
          page: name,
          target: node.target,
          summary: node.failureSummary,
        })
      }
      violationsByRule.set(violation.id, current)
      console.log(
        `  - [${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`,
      )
    }
  } else {
    console.log(`${name}: no WCAG A/AA violations`)
  }
}

for (const scan of pagesToScan) {
  const context = await browser.newContext({
    viewport: { width: scan.width, height: scan.height },
    locale: scan.url.includes('lang=ar') ? 'ar-EG' : 'en-US',
  })
  const page = await context.newPage()
  await page.goto(`${baseUrl}${scan.url}`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(900)
  await page.addScriptTag({ path: axePath })

  const results = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    })
  })

  collectViolations(scan.name, results)
  await context.close()
}

async function scanInteractiveState({ name, width, height, url, open }) {
  const context = await browser.newContext({
    viewport: { width, height },
    locale: url.includes('lang=ar') ? 'ar-EG' : 'en-US',
  })
  const page = await context.newPage()
  await page.goto(`${baseUrl}${url}`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(700)
  await page.addScriptTag({ path: axePath })
  await open(page)
  await page.waitForTimeout(350)

  const results = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    })
  })

  collectViolations(name, results)
  await context.close()
}

await scanInteractiveState({
  name: 'preview-modal',
  width: 1440,
  height: 1000,
  url: '/?lang=en',
  open: async (page) => {
    await page.locator('.hero-visual__open').click()
    await page.locator('.preview-modal').waitFor({ state: 'visible' })
  },
})

await scanInteractiveState({
  name: 'preview-modal-ui-landscape',
  width: 1440,
  height: 1000,
  url: '/?lang=en',
  open: async (page) => {
    await page
      .locator('.work-tile')
      .filter({ hasText: 'UI Motion Study' })
      .locator('.project-media-button__control')
      .click()
    await page.locator('.preview-modal--landscape').waitFor({ state: 'visible' })
  },
})

await scanInteractiveState({
  name: 'mobile-menu',
  width: 390,
  height: 844,
  url: '/?lang=en',
  open: async (page) => {
    await page.locator('.menu-toggle').click()
    await page.locator('#mobile-menu').waitFor({ state: 'visible' })
  },
})

await browser.close()

if (totalViolations) {
  console.log('\nViolation details:')
  for (const violation of violationsByRule.values()) {
    console.log(`\n${violation.rule} — ${violation.help}`)
    console.log(`Pages: ${[...violation.pages].join(', ')}`)
    for (const node of violation.nodes.slice(0, 12)) {
      console.log(`  ${node.page}: ${JSON.stringify(node.target)}`)
      console.log(`    ${node.summary.replace(/\n/g, ' ')}`)
    }
  }
  process.exitCode = 1
} else {
  console.log(
    `\nAxe scan complete: no violations found across ${contextsScanned} rendered pages/states.`,
  )
}

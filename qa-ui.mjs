/**
 * Browser acceptance checks for the Ziad V.D portfolio.
 * Requires a running dev or preview server.
 *
 * Run: node scripts/qa-ui.mjs
 * Env: QA_URL (default http://127.0.0.1:5173), CHROME_PATH
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const chromePath =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.env.QA_URL ?? 'http://127.0.0.1:5173'
const shotDir = path.join(process.cwd(), '.tmp', 'qa', 'interactions')
await mkdir(shotDir, { recursive: true })

const browser = await chromium.launch({ executablePath: chromePath, headless: true })
const results = []
const pageProblems = []

function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

function observe(page, label) {
  page.on('console', (message) => {
    if (message.type() === 'error') {
      pageProblems.push(`${label}: console: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => {
    pageProblems.push(`${label}: page error: ${error.message}`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      pageProblems.push(`${label}: HTTP ${response.status()} ${response.url()}`)
    }
  })
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
}

let context

try {
  context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  observe(page, 'home-en')

  await page.goto(`${baseUrl}/?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  await page.locator('h1').waitFor()

  check(
    'English home renders with the correct title and H1',
    (await page.title()).includes('Ziad V.D') &&
      (await page.locator('h1').innerText()).includes('Every frame.'),
    await page.title(),
  )
  check(
    'Document language/direction are English/LTR',
    (await page.evaluate(() => [document.documentElement.lang, document.documentElement.dir])).join('/') ===
      'en/ltr',
  )
  check(
    'No horizontal overflow at 1440px',
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  )
  const heroVideo = await page.evaluate(() => {
    const video = document.querySelector('.hero-visual video')
    return video
      ? {
          hasPoster: Boolean(video.getAttribute('poster')),
          muted: video.muted,
          preload: video.preload,
        }
      : null
  })
  check(
    'Hero video is present with a poster and muted playback',
    Boolean(heroVideo?.hasPoster) && heroVideo?.muted === true,
    JSON.stringify(heroVideo),
  )
  check(
    'Main navigation exposes all required destinations',
    (await page.locator('.desktop-nav a').allInnerTexts()).map((text) => text.trim()).join(',') ===
      'Work,About,Services,Contact',
  )

  const socials = await page.evaluate(() => {
    const hrefs = Array.from(document.querySelectorAll('a[href]')).map((a) => a.href)
    return {
      whatsapp: hrefs.includes('https://wa.me/ziyadwalid395?s=t'),
      instagram: hrefs.includes(
        'https://www.instagram.com/ziad_walid__video_editor?vrfl=eXo5enQ2MzVkejA3',
      ),
      tiktok: hrefs.includes(
        'https://www.tiktok.com/@ziyadwalid72?is_from_webapp=1&sender_device=pc',
      ),
      safeExternal: Array.from(document.querySelectorAll('a[target="_blank"]')).every(
        (a) => a.rel.includes('noreferrer') || a.rel.includes('noopener'),
      ),
    }
  })
  check(
    'All supplied social destinations are present',
    socials.whatsapp && socials.instagram && socials.tiktok,
  )
  check('External links use safe rel attributes', socials.safeExternal)

  const homeIndex = await page.evaluate(() => {
    const allTitles = [
      ...document.querySelectorAll('.featured-work__title, .work-tile__title'),
    ].map((element) => element.textContent?.trim())
    const projectLinks = [
      ...document.querySelectorAll(
        '.featured-work__actions a[href^="/work/"], .work-tile__title a[href^="/work/"]',
      ),
    ].map((link) => link.getAttribute('href'))
    const emailLink = document.querySelector('.contact-channels a[href^="mailto:"]')
    return {
      supportingTiles: document.querySelectorAll('.work-tile').length,
      titles: allTitles,
      projectLinks: [...new Set(projectLinks)],
      workCount: document
        .querySelector('#work .section-heading__aside-meta .mono-label')
        ?.textContent?.trim(),
      heroCount: document.querySelector('.hero__bottom-index')?.textContent?.trim(),
      emailHref: emailLink?.getAttribute('href'),
      emailText: emailLink?.textContent?.replace(/\s+/g, ' ').trim(),
    }
  })
  check(
    'Home Work section exposes all five projects',
    homeIndex.supportingTiles === 4 &&
      homeIndex.projectLinks.length === 5 &&
      homeIndex.titles.some((title) => title === 'UI Motion Study') &&
      homeIndex.titles.some((title) => title === 'Creative Editing Study'),
    JSON.stringify(homeIndex.titles),
  )
  check(
    'Project counters report five across the home page',
    Boolean(homeIndex.workCount?.startsWith('05')) &&
      Boolean(homeIndex.heroCount?.includes('05')),
    `${homeIndex.workCount} / ${homeIndex.heroCount}`,
  )
  check(
    'The confirmed email is visible and linked in Contact',
    homeIndex.emailHref === 'mailto:zeadwalid56@gmail.com' &&
      Boolean(homeIndex.emailText?.includes('zeadwalid56@gmail.com')),
    `${homeIndex.emailHref} — ${homeIndex.emailText}`,
  )

  // Skip link keyboard path.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.keyboard.press('Tab')
  const skipFocused = await page.evaluate(
    () => document.activeElement?.classList.contains('skip-link') ?? false,
  )
  check('Skip link is the first keyboard target', skipFocused)
  if (skipFocused) {
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)
    const mainFocused = await page.evaluate(
      () => document.activeElement?.id === 'main' || window.location.hash === '#main',
    )
    check('Skip link reaches the main content', mainFocused)
  }

  // Modal: open, focus management, playback, escape.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.locator('.hero-visual__open').click()
  await page.locator('.preview-modal').waitFor({ state: 'visible' })
  await page.waitForTimeout(200)
  check(
    'Preview modal exposes an accessible dialog',
    (await page.locator('.preview-modal').getAttribute('role')) === 'dialog' &&
      (await page.locator('.preview-modal').getAttribute('aria-modal')) === 'true',
  )
  check(
    'Focus moves inside the preview dialog',
    await page.evaluate(() =>
      Boolean(document.querySelector('.preview-modal')?.contains(document.activeElement)),
    ),
  )
  await page.waitForTimeout(150)
  check(
    'Opening a preview pauses the decorative hero video',
    await page.evaluate(() => {
      const video = document.querySelector('.hero-visual video')
      return video ? video.paused : true
    }),
  )
  await page.screenshot({ path: path.join(shotDir, 'preview-modal-en.png') })

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press('Tab')
  }
  check(
    'Tab focus stays trapped inside the preview dialog',
    await page.evaluate(() =>
      Boolean(document.querySelector('.preview-modal')?.contains(document.activeElement)),
    ),
  )

  await page.locator('.preview-modal__play').click()
  await page.waitForTimeout(900)
  const playback = await page.evaluate(() => {
    const video = document.querySelector('.preview-modal video')
    return video
      ? {
          paused: video.paused,
          currentTime: video.currentTime,
          controls: video.controls,
        }
      : null
  })
  check(
    'Preview video can start and exposes play/pause controls',
    Boolean(playback) &&
      playback.currentTime > 0 &&
      playback.controls === true,
    JSON.stringify(playback),
  )

  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  check(
    'Escape closes the preview dialog',
    (await page.locator('.preview-modal').count()) === 0,
  )
  const focusRestoredToHero = await page.evaluate(
    () => document.activeElement?.classList.contains('hero-visual__open') ?? false,
  )
  check('Focus returns to the preview trigger after closing', focusRestoredToHero)

  await page.locator('.hero-visual__open').click()
  await page.locator('.preview-modal').waitFor({ state: 'visible' })
  await page.mouse.click(8, 8)
  await page.waitForTimeout(350)
  check(
    'Clicking outside the preview dialog closes it',
    (await page.locator('.preview-modal').count()) === 0,
  )

  await page.locator('#work').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.locator('.featured-work__media .project-media-button__control').click()
  await page.locator('.preview-modal').waitFor({ state: 'visible' })
  check(
    'Project cards open the matching preview',
    (await page.locator('#preview-title').innerText()).includes('Before / After'),
  )
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)

  const homeMeta = await page.evaluate(() => ({
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
  }))
  check(
    'Home exposes localized description and Open Graph metadata',
    Boolean(homeMeta.description?.includes('video editor')) &&
      Boolean(homeMeta.ogTitle?.includes('Ziad V.D')) &&
      Boolean(homeMeta.ogImage?.includes('og-cover.jpg')),
    JSON.stringify(homeMeta),
  )

  // Language switch without reload and persistence.
  await page.evaluate(() => {
    window.__languageSwitchMarker = 'still-here'
  })
  await page.locator('.site-header .language-toggle__option').last().click()
  await page.waitForTimeout(400)
  const switched = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    marker: window.__languageSwitchMarker,
    title: document.title,
    url: window.location.href,
    h1: document.querySelector('h1')?.textContent,
  }))
  check(
    'Language switch updates lang, dir, title, and copy without a reload',
    switched.lang === 'ar' &&
      switched.dir === 'rtl' &&
      switched.marker === 'still-here' &&
      switched.title.includes('زياد') &&
      Boolean(switched.h1?.includes('كل كادر')),
    JSON.stringify(switched),
  )
  check(
    'Selected language is reflected in the URL without navigation',
    switched.url.includes('lang=ar'),
  )

  await page.reload({ waitUntil: 'domcontentloaded' })
  await settle(page)
  check(
    'Language choice persists after reload',
    (await page.evaluate(() => document.documentElement.lang)) === 'ar',
  )

  // Switch back and test contact validation + honest fallback.
  await page.locator('.site-header .language-toggle__option').first().click()
  await page.waitForTimeout(300)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.locator('.contact-form-card').scrollIntoViewIfNeeded()
  const submitButton = page.locator('.inquiry-form button[type="submit"]')
  await submitButton.click()
  await page.locator('.form-error-summary').waitFor({ state: 'visible' })
  await page.waitForTimeout(150)
  const validation = await page.evaluate(() => ({
    invalidCount: document.querySelectorAll('[aria-invalid="true"]').length,
    activeId: document.activeElement?.id,
    summary: document.querySelector('.form-error-summary')?.textContent,
    handoffPresent: Boolean(document.querySelector('.form-status--handoff')),
    successPresent: Boolean(document.querySelector('.form-status--success')),
  }))
  check(
    'Empty form submission reports accessible field errors and does not fake success',
    validation.invalidCount >= 4 &&
      validation.handoffPresent === false &&
      validation.successPresent === false,
    JSON.stringify(validation),
  )
  check(
    'First invalid field receives focus',
    validation.activeId === 'inquiry-name',
    `focused: ${validation.activeId}`,
  )

  await page.locator('#inquiry-name').fill('Test Client')
  await page.locator('#inquiry-email').fill('client@example.org')
  await page.locator('#inquiry-project-type').selectOption('reels-shorts')
  await page
    .locator('#inquiry-message')
    .fill('A thoughtful short-form series for a new product launch.')
  await page.locator('#inquiry-contact-method').selectOption('whatsapp')
  await page.locator('#inquiry-contact-handle').fill('@test-client')
  await submitButton.click()
  await page.locator('.form-status--handoff').waitFor({ state: 'visible' })
  await page.waitForTimeout(300)
  const handoff = await page.evaluate(() => {
    const mailto = document.querySelector(
      '.form-status--handoff a[href^="mailto:"]',
    )
    return {
      title: document.querySelector('.form-status--handoff h4')?.textContent,
      body: document.querySelector('.form-status--handoff p')?.textContent,
      mailto: mailto?.getAttribute('href'),
      brief: document.querySelector('.brief-preview pre')?.textContent,
      successPresent: Boolean(document.querySelector('.form-status--success')),
      selectedType: null,
    }
  })
  check(
    'Valid submission prepares a transparent manual handoff (no provider configured)',
    Boolean(handoff.title?.includes('ready')) &&
      Boolean(handoff.brief?.includes('Test Client')) &&
      Boolean(handoff.mailto?.startsWith('mailto:zeadwalid56@gmail.com')) &&
      handoff.successPresent === false,
    handoff.title,
  )
  check(
    'The prepared brief contains the submitted detail and encoded email fallback',
    Boolean(handoff.brief?.includes('A thoughtful short-form series')) &&
      Boolean(handoff.mailto?.includes('subject=')) &&
      Boolean(handoff.mailto?.includes('body=')),
  )
  await page.screenshot({ path: path.join(shotDir, 'contact-handoff.png'), fullPage: false })

  // Service CTA prefills the inquiry type.
  await page.locator('#services').scrollIntoViewIfNeeded()
  const serviceButton = page.locator('.service-row__action').first()
  await serviceButton.click()
  await page.waitForTimeout(700)
  const prefilled = await page.locator('#inquiry-project-type').inputValue()
  check('A service CTA prefills the correct project type', prefilled === 'reels-shorts', prefilled)

  // Project routes, reloads, browser history, and locale preservation.
  await page.goto(`${baseUrl}/work/before-after?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  check(
    'Project detail route renders real project copy',
    (await page.locator('.project-hero h1').innerText()).includes('Before / After'),
  )
  await page.reload({ waitUntil: 'domcontentloaded' })
  await settle(page)
  check(
    'Project detail route survives a direct refresh',
    (await page.locator('.project-hero h1').innerText()).includes('Before / After'),
  )
  await page.locator('.site-header .language-toggle__option').last().click()
  await page.waitForTimeout(300)
  check(
    'Language switch preserves the project route',
    new URL(page.url()).pathname === '/work/before-after' &&
      new URL(page.url()).searchParams.get('lang') === 'ar',
    page.url(),
  )

  await page.goto(`${baseUrl}/?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  await page.locator('.featured-work__actions a').first().click()
  await page.waitForURL('**/work/before-after')
  await settle(page)
  await page.goBack()
  await page.waitForURL(`${baseUrl}/**`)
  await settle(page)
  const backHome = await page.locator('h1').innerText()
  await page.goForward()
  await page.waitForURL('**/work/before-after')
  await settle(page)
  check(
    'SPA project navigation participates in browser back/forward history',
    backHome.includes('Every frame.') &&
      (await page.locator('.project-hero h1').innerText()).includes('Before / After'),
  )

  const projectSequence = [
    ['before-after', 'Before / After'],
    ['white-minimal', 'White Minimal'],
    ['isometric-style', 'Isometric Style'],
    ['ui-motion-study', 'UI Motion Study'],
    ['creative-editing-study', 'Creative Editing Study'],
  ]
  const playbackResults = []
  for (const [slug, expectedTitle] of projectSequence) {
    await page.goto(`${baseUrl}/work/${slug}?lang=en`, { waitUntil: 'domcontentloaded' })
    await settle(page)
    const playback = await page.evaluate(async () => {
      const video = document.querySelector('.project-player video')
      if (!video) return { present: false }
      if (video.readyState < 1) {
        await new Promise((resolve) => {
          video.addEventListener('loadedmetadata', resolve, { once: true })
          window.setTimeout(resolve, 8000)
        })
      }
      video.muted = true
      let playError = null
      try {
        await video.play()
      } catch (error) {
        playError = String(error)
      }
      await new Promise((resolve) => window.setTimeout(resolve, 450))
      const result = {
        present: true,
        title: document.querySelector('.project-hero h1')?.textContent?.trim(),
        width: video.videoWidth,
        height: video.videoHeight,
        duration: Number(video.duration.toFixed(2)),
        currentTime: Number(video.currentTime.toFixed(2)),
        paused: video.paused,
        mediaError: video.error?.code ?? null,
        playError,
      }
      video.pause()
      return result
    })
    playbackResults.push({ slug, expectedTitle, ...playback })
  }
  check(
    'All five project pages load and play their local video',
    playbackResults.every(
      (item) =>
        item.present &&
        item.title?.includes(item.expectedTitle) &&
        item.width > 0 &&
        item.height > 0 &&
        item.duration > 1 &&
        item.currentTime > 0.1 &&
        item.paused === false &&
        item.mediaError === null &&
        item.playError === null,
    ),
    JSON.stringify(playbackResults),
  )
  const aspectResults = Object.fromEntries(
    playbackResults.map((item) => [
      item.slug,
      item.height ? Number((item.width / item.height).toFixed(3)) : null,
    ]),
  )
  check(
    'New projects retain their native landscape and portrait frames',
    aspectResults['ui-motion-study'] === 1.778 &&
      aspectResults['creative-editing-study'] === 0.563,
    JSON.stringify(aspectResults),
  )

  // UI preview uses the wide player treatment rather than cropping into 9:16.
  await page.goto(`${baseUrl}/?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  const uiTile = page.locator('.work-tile').filter({ hasText: 'UI Motion Study' })
  await uiTile.scrollIntoViewIfNeeded()
  await uiTile.locator('.project-media-button__control').click()
  await page.locator('.preview-modal--landscape').waitFor({ state: 'visible' })
  await page.locator('.preview-modal__play').click()
  await page.waitForTimeout(500)
  const landscapePreview = await page.evaluate(() => {
    const modal = document.querySelector('.preview-modal')
    const video = modal?.querySelector('video')
    const rect = video?.getBoundingClientRect()
    return {
      landscapeClass: modal?.classList.contains('preview-modal--landscape') ?? false,
      ratio: rect ? Number((rect.width / rect.height).toFixed(3)) : null,
      currentTime: video?.currentTime ?? 0,
      paused: video?.paused ?? true,
    }
  })
  check(
    'UI Motion Study opens and plays in a 16:9 landscape preview',
    landscapePreview.landscapeClass &&
      landscapePreview.ratio === 1.778 &&
      landscapePreview.currentTime > 0 &&
      landscapePreview.paused === false,
    JSON.stringify(landscapePreview),
  )
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)

  // CV page + downloadable PDF files + print action.
  await page.goto(`${baseUrl}/cv?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  const cvFacts = await page.evaluate(() => {
    const sheet = document.querySelector('.cv-sheet')
    const email = document.querySelector('.cv-sheet__contact-links a[href^="mailto:"]')
    return {
      sheets: document.querySelectorAll('.cv-sheet').length,
      workItems: document.querySelectorAll('.cv-work-list__item').length,
      collaborations: document.querySelectorAll('.cv-collaboration').length,
      emailHref: email?.getAttribute('href'),
      text: sheet?.textContent ?? '',
      collaborationLinks: [...document.querySelectorAll('.cv-collaboration')].map((link) =>
        link.getAttribute('href'),
      ),
    }
  })
  check(
    'CV page renders the bilingual print sheet with all five projects',
    cvFacts.sheets === 1 && cvFacts.workItems === 5,
  )
  check(
    'CV includes the confirmed facts, email, and collaborations',
    cvFacts.emailHref === 'mailto:zeadwalid56@gmail.com' &&
      cvFacts.collaborations === 2 &&
      cvFacts.collaborationLinks.includes('https://www.instagram.com/estabraq.home/') &&
      cvFacts.collaborationLinks.includes(
        'https://www.instagram.com/dr.ahmed.elshabrawy/',
      ) &&
      cvFacts.text.includes('Approx. 1 year') &&
      cvFacts.text.includes('Faculty of Commerce') &&
      cvFacts.text.includes('First-year student') &&
      cvFacts.text.includes('UI Motion Study') &&
      cvFacts.text.includes('Creative Editing Study'),
    JSON.stringify({
      emailHref: cvFacts.emailHref,
      collaborations: cvFacts.collaborations,
      workItems: cvFacts.workItems,
    }),
  )
  const pdfHrefs = await page
    .locator('.cv-page a[download]')
    .evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href')))])
  const pdfChecks = []
  for (const href of pdfHrefs) {
    const response = await context.request.get(new URL(href, baseUrl).href)
    const bytes = await response.body()
    pdfChecks.push({
      href,
      status: response.status(),
      type: response.headers()['content-type'],
      header: bytes.subarray(0, 5).toString('utf8'),
      bytes: bytes.byteLength,
    })
  }
  check(
    'Both CV PDF downloads resolve to real PDF files',
    pdfChecks.length === 2 &&
      pdfChecks.every(
        (pdf) =>
          pdf.status === 200 &&
          pdf.header === '%PDF-' &&
          pdf.bytes > 40_000 &&
          String(pdf.type).includes('pdf'),
      ),
    JSON.stringify(pdfChecks),
  )
  await page.evaluate(() => {
    window.__printCalled = false
    window.print = () => {
      window.__printCalled = true
    }
  })
  await page.getByRole('button', { name: /Print \/ Save as PDF/i }).click()
  check(
    "CV 'Print / Save as PDF' control invokes the browser print flow",
    await page.evaluate(() => window.__printCalled === true),
  )

  const profileSection = page.locator('.cv-section').first()
  await profileSection.scrollIntoViewIfNeeded()
  const profileBox = await profileSection.boundingBox()
  if (profileBox) {
    await page.mouse.move(
      profileBox.x + profileBox.width * 0.55,
      profileBox.y + Math.min(profileBox.height * 0.5, 100),
    )
  }
  await page.waitForTimeout(500)
  const pointerState = await page.evaluate(() => {
    const sheet = document.querySelector('.cv-sheet')
    const profile = document.querySelector('.cv-section')
    return {
      active: sheet?.classList.contains('is-pointer-active') ?? false,
      x: sheet?.style.getPropertyValue('--cv-pointer-x') ?? '',
      y: sheet?.style.getPropertyValue('--cv-pointer-y') ?? '',
      spotlightOpacity: sheet ? getComputedStyle(sheet, '::before').opacity : null,
      profileBackground: profile ? getComputedStyle(profile).backgroundColor : null,
    }
  })
  check(
    'CV pointer light and restrained section hover respond to a mouse',
    pointerState.active &&
      Boolean(pointerState.x) &&
      Boolean(pointerState.y) &&
      Number(pointerState.spotlightOpacity) > 0.5 &&
      pointerState.profileBackground !== 'rgba(0, 0, 0, 0)',
    JSON.stringify(pointerState),
  )

  // 404.
  await page.goto(`${baseUrl}/not-a-real-page?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  check(
    'Unknown routes render a designed 404 with a way home',
    (await page.locator('.not-found').count()) === 1 &&
      (await page.locator('.not-found a').count()) >= 2,
  )

  await context.close()

  // Browser-language detection in a clean context.
  const arabicContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: 'ar-EG',
  })
  const arabicPage = await arabicContext.newPage()
  observe(arabicPage, 'home-ar-default')
  await arabicPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' })
  await settle(arabicPage)
  const browserLanguageOk =
    (await arabicPage.evaluate(() => document.documentElement.lang)) === 'ar' &&
    (await arabicPage.locator('h1').innerText()).includes('كل كادر')
  check('An Arabic browser locale defaults to the Arabic experience', browserLanguageOk)
  await arabicContext.close()

  // Mobile menu and focus handling.
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: 'en-US',
    hasTouch: true,
  })
  const mobilePage = await mobileContext.newPage()
  observe(mobilePage, 'mobile-en')
  await mobilePage.goto(`${baseUrl}/?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(mobilePage)
  const menuButton = mobilePage.locator('.menu-toggle')
  await menuButton.click()
  await mobilePage.locator('#mobile-menu').waitFor({ state: 'visible' })
  await mobilePage.waitForTimeout(250)
  check(
    'Mobile menu exposes expanded state and moves focus inside',
    (await menuButton.getAttribute('aria-expanded')) === 'true' &&
      (await mobilePage.evaluate(() =>
        Boolean(document.querySelector('#mobile-menu')?.contains(document.activeElement)),
      )),
  )
  await mobilePage.screenshot({ path: path.join(shotDir, 'mobile-menu-en.png') })
  await mobilePage.keyboard.press('Escape')
  await mobilePage.waitForTimeout(700)
  check(
    'Escape closes the mobile menu and restores focus to its trigger',
    (await mobilePage.locator('#mobile-menu').count()) === 0 &&
      (await menuButton.getAttribute('aria-expanded')) === 'false' &&
      (await mobilePage.evaluate(
        () => document.activeElement?.classList.contains('menu-toggle') ?? false,
      )),
  )

  // Mobile preview modal layout.
  await mobilePage.evaluate(() => window.scrollTo(0, 0))
  await mobilePage.locator('.hero-visual__open').click()
  await mobilePage.locator('.preview-modal').waitFor({ state: 'visible' })
  await mobilePage.waitForTimeout(250)
  const modalBox = await mobilePage.locator('.preview-modal').boundingBox()
  check(
    'Mobile preview fits the viewport without horizontal overflow',
    Boolean(modalBox) &&
      modalBox.width <= 390 + 1 &&
      (await mobilePage.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
      )),
    JSON.stringify(modalBox),
  )
  await mobilePage.screenshot({ path: path.join(shotDir, 'preview-modal-mobile.png') })
  await mobilePage.keyboard.press('Escape')
  await mobilePage.goto(`${baseUrl}/cv?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(mobilePage)
  await mobilePage.locator('.cv-sheet').scrollIntoViewIfNeeded()
  await mobilePage.locator('.cv-sheet').evaluate((sheet) => {
    const rect = sheet.getBoundingClientRect()
    sheet.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'touch',
        clientX: rect.left + rect.width * 0.5,
        clientY: rect.top + Math.min(rect.height * 0.25, 220),
      }),
    )
  })
  await mobilePage.waitForTimeout(400)
  check(
    'CV pointer light stays disabled for touch input',
    (await mobilePage.locator('.cv-sheet').evaluate((sheet) => ({
      active: sheet.classList.contains('is-pointer-active'),
      opacity: getComputedStyle(sheet, '::before').opacity,
    }))).active === false &&
      (await mobilePage.locator('.cv-sheet').evaluate(
        (sheet) => getComputedStyle(sheet, '::before').opacity,
      )) === '0',
  )
  await mobileContext.close()

  // Responsive overflow sweep.
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    const sweepContext = await browser.newContext({
      viewport: { width, height: 900 },
      locale: 'en-US',
    })
    const sweepPage = await sweepContext.newPage()
    observe(sweepPage, `overflow-${width}`)
    await sweepPage.goto(`${baseUrl}/?lang=en`, { waitUntil: 'domcontentloaded' })
    await settle(sweepPage)
    const layout = await sweepPage.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    check(`No horizontal overflow at ${width}px`, layout.scrollWidth <= layout.clientWidth + 1)
    await sweepContext.close()
  }

  // A blocked video must show the explicit fallback and original-file link.
  const errorContext = await browser.newContext({
    viewport: { width: 1200, height: 900 },
    locale: 'en-US',
  })
  const errorPage = await errorContext.newPage()
  await errorPage.route('**/media/videos/before-after.mp4', (route) => route.abort())
  await errorPage.goto(`${baseUrl}/?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(errorPage)
  await errorPage.locator('.hero-visual__open').click()
  await errorPage.locator('.preview-modal').waitFor({ state: 'visible' })
  const retryPlay = errorPage.locator('.preview-modal__play')
  if ((await retryPlay.count()) > 0) {
    await retryPlay.click()
  }
  await errorPage.locator('.preview-modal .video-error').waitFor({ state: 'visible' })
  const videoFallback = await errorPage.evaluate(() => ({
    text: document.querySelector('.preview-modal .video-error')?.textContent,
    driveHref: document
      .querySelector('.preview-modal .video-error a')
      ?.getAttribute('href'),
  }))
  check(
    'Blocked video playback shows a clear fallback to the original file',
    Boolean(videoFallback.text?.includes('could not load')) &&
      Boolean(videoFallback.driveHref?.includes('drive.google.com')),
    JSON.stringify(videoFallback),
  )
  await errorContext.close()

  // Reduced motion disables the decorative autoplay.
  const reducedContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    locale: 'en-US',
  })
  const reducedPage = await reducedContext.newPage()
  observe(reducedPage, 'reduced-motion')
  await reducedPage.goto(`${baseUrl}/?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(reducedPage)
  await reducedPage.waitForTimeout(600)
  const reduced = await reducedPage.evaluate(() => {
    const video = document.querySelector('.hero-visual video')
    return {
      videoPaused: video ? video.paused : null,
      heroVisible: Boolean(document.querySelector('.hero__title')),
      aboutOpacity: Boolean(document.querySelector('#about')),
    }
  })
  check(
    'Reduced motion keeps content visible and does not autoplay the hero video',
    reduced.videoPaused === true && reduced.heroVisible && reduced.aboutOpacity,
    JSON.stringify(reduced),
  )
  await reducedPage.screenshot({
    path: path.join(shotDir, 'reduced-motion-home.png'),
    fullPage: false,
  })
  await reducedPage.goto(`${baseUrl}/cv?lang=en`, { waitUntil: 'domcontentloaded' })
  await settle(reducedPage)
  const reducedSheet = reducedPage.locator('.cv-sheet')
  await reducedSheet.scrollIntoViewIfNeeded()
  const reducedBox = await reducedSheet.boundingBox()
  if (reducedBox) {
    await reducedPage.mouse.move(
      reducedBox.x + reducedBox.width * 0.5,
      reducedBox.y + Math.min(reducedBox.height * 0.2, 180),
    )
  }
  await reducedPage.waitForTimeout(400)
  const reducedCv = await reducedPage.evaluate(() => {
    const sheet = document.querySelector('.cv-sheet')
    return {
      active: sheet?.classList.contains('is-pointer-active') ?? false,
      opacity: sheet ? getComputedStyle(sheet, '::before').opacity : null,
    }
  })
  check(
    'Reduced motion disables the CV pointer light',
    reducedCv.active === false && reducedCv.opacity === '0',
    JSON.stringify(reducedCv),
  )
  await reducedContext.close()
} catch (error) {
  check('QA script completed without a fatal error', false, error.message)
  console.error(error)
} finally {
  await browser.close()
}

if (pageProblems.length === 0) {
  check('No console errors, page errors, or missing document responses', true)
} else {
  check(
    'No console errors, page errors, or missing document responses',
    false,
    pageProblems.join(' | '),
  )
}

const failed = results.filter((result) => !result.ok)
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed.`,
)
if (failed.length) {
  console.log(JSON.stringify(failed, null, 2))
  process.exitCode = 1
}

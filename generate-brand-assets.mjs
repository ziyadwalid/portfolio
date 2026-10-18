/**
 * Rebuilds the social share card and the Apple touch icon from local assets.
 * Run: node scripts/generate-brand-assets.mjs
 */
import { chromium } from 'playwright-core'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const chromePath =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const toDataUri = async (relativePath, mimeType) => {
  const bytes = await readFile(path.join(projectRoot, relativePath))
  return `data:${mimeType};base64,${bytes.toString('base64')}`
}

const fontPath = await toDataUri(
  'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
  'font/woff2',
)
const posterPath = await toDataUri('public/media/posters/before-after.jpg', 'image/jpeg')
const secondaryPosterPath = await toDataUri(
  'public/media/posters/isometric-style.jpg',
  'image/jpeg',
)

await mkdir(path.join(projectRoot, 'public/media'), { recursive: true })

const browser = await chromium.launch({ executablePath: chromePath, headless: true })

const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})

await page.setContent(
  `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <style>
        @font-face {
          font-family: 'Manrope';
          src: url('${fontPath}') format('woff2-variations');
          font-weight: 200 800;
          font-display: block;
        }
        * { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
        body {
          position: relative;
          padding: 44px 48px 38px;
          background: #09090b;
          color: #f4f4f7;
          font-family: 'Manrope', sans-serif;
        }
        .bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 88% 44%, rgba(210, 23, 83, 0.18), transparent 37%),
            radial-gradient(circle at 64% 120%, rgba(204, 255, 0, 0.06), transparent 36%);
        }
        .grain {
          position: absolute; inset: 0; opacity: .055; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        header, main, .side { position: relative; z-index: 2; }
        header {
          display: flex; align-items: center; gap: 12px;
          padding-bottom: 22px; border-bottom: 1px solid #26262b;
        }
        .logo {
          width: 31px; height: 31px;
        }
        .brand {
          font-size: 13px; font-weight: 700; letter-spacing: .17em;
        }
        .brand em { color: #797983; font-style: normal; }
        header .label {
          margin-left: auto; color: #777781; font-size: 10px;
          letter-spacing: .13em; text-transform: uppercase;
        }
        main { display: flex; height: calc(100% - 54px); flex-direction: column; justify-content: center; }
        .eyebrow {
          margin: 0 0 24px; color: #ccff00; font-size: 11px;
          font-weight: 600; letter-spacing: .17em; text-transform: uppercase;
        }
        h1 {
          max-width: 700px; margin: 0; font-size: 92px; font-weight: 580;
          letter-spacing: -.075em; line-height: .89;
        }
        h1 em { color: #ccff00; font-style: normal; }
        .sub {
          max-width: 430px; margin: 25px 0 0; color: #adadb6;
          font-size: 17px; letter-spacing: -.01em; line-height: 1.55;
        }
        .foot {
          display: flex; align-items: center; gap: 18px; margin-top: 38px;
          color: #797983; font-size: 10px; letter-spacing: .1em; text-transform: uppercase;
        }
        .foot span { display: inline-flex; align-items: center; gap: 9px; }
        .foot span::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: #ccff00; }
        .side {
          position: absolute; z-index: 1; right: 0; top: 0; width: 39%; height: 100%;
          overflow: hidden; border-left: 1px solid rgba(255,255,255,.11);
        }
        .side::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, #09090b 0%, rgba(9,9,11,.12) 34%, rgba(9,9,11,.06) 100%),
                      linear-gradient(0deg, rgba(9,9,11,.7), transparent 40%, rgba(9,9,11,.15));
        }
        .side img {
          width: 100%; height: 100%; object-fit: cover; object-position: 50% 35%;
          filter: saturate(.92) contrast(1.03);
        }
        .secondary {
          position: absolute; z-index: 2; right: 29px; bottom: 26px;
          width: 86px; height: 142px; padding: 5px;
          border: 1px solid rgba(255,255,255,.25); background: #101013;
          box-shadow: 0 14px 35px rgba(0,0,0,.5);
        }
        .secondary img { width: 100%; height: 100%; object-fit: cover; object-position: center 40%; }
        .vertical {
          position: absolute; z-index: 3; right: 19px; top: 44%;
          color: rgba(255,255,255,.55); font-size: 9px; letter-spacing: .16em;
          transform: rotate(90deg); transform-origin: right center; text-transform: uppercase;
        }
        .frame-mark {
          position: absolute; z-index: 3; right: 28px; top: 26px;
          color: rgba(255,255,255,.72); font-size: 9px; letter-spacing: .13em;
        }
      </style>
    </head>
    <body>
      <div class="bg"></div>
      <div class="grain"></div>
      <header>
        <svg class="logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.25" y="5.25" width="29.5" height="21.5" rx="1.25" stroke="#f4f4f7" stroke-width="1.3"/>
          <path d="M9 11.5h7.1L9 20.5h7.1" stroke="#ccff00" stroke-width="1.8" stroke-linecap="square"/>
          <circle cx="24" cy="11.4" r="1.55" fill="#ccff00"/>
        </svg>
        <span class="brand">ZIAD <em>V.D</em></span>
        <span class="label">Creative video editor & visual storyteller</span>
      </header>
      <main>
        <p class="eyebrow">Portfolio / selected work</p>
        <h1>Every frame.<br /><em>A purpose.</em></h1>
        <p class="sub">Creative editing, motion, and visual storytelling for ideas worth watching.</p>
        <div class="foot">
          <span>Short-form</span>
          <span>Talking-head</span>
          <span>Motion</span>
          <span>Editorial</span>
        </div>
      </main>
      <div class="side">
        <img src="${posterPath}" alt="" />
        <span class="frame-mark">FRAME / 01</span>
        <span class="vertical">Before / After — 00:53</span>
      </div>
      <div class="secondary"><img src="${secondaryPosterPath}" alt="" /></div>
    </body>
  </html>`,
  { waitUntil: 'load' },
)

await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(250)
await page.screenshot({
  path: path.join(projectRoot, 'public/media/og-cover.jpg'),
  type: 'jpeg',
  quality: 92,
})

const iconPage = await browser.newPage({
  viewport: { width: 180, height: 180 },
  deviceScaleFactor: 1,
})
await iconPage.setContent(
  `<!doctype html>
  <style>
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
    body { display: grid; place-items: center; background: #09090b; }
    svg { width: 180px; height: 180px; }
  </style>
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="10" fill="#09090b"/>
    <rect x="10.5" y="16.5" width="43" height="31" rx="2.5" fill="none" stroke="#f4f4f7" stroke-width="2.4"/>
    <path d="M23 28h12.5L23 39.5h12.5" fill="none" stroke="#ccff00" stroke-width="3.2" stroke-linecap="square"/>
    <circle cx="45.5" cy="27.5" r="2.5" fill="#ccff00"/>
  </svg>`,
)
await iconPage.screenshot({
  path: path.join(projectRoot, 'public/apple-touch-icon.png'),
  type: 'png',
})

await browser.close()
console.log('Generated public/media/og-cover.jpg and public/apple-touch-icon.png')

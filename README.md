# ZIAD V.D — Creative Video Editor & Motion Designer

A cinematic, fully bilingual portfolio for **Ziad V.D**, built around five real edits. The presentation stays in a cutting-room language: editorial typography, real frames, timeline details, restrained lime accents, and motion that serves the work rather than hiding it.

**Live deployment status:** not deployed. This is a verified local production build, ready for a static host.

## Preview

![English homepage hero](docs/screenshots/home-desktop.jpg)

![Arabic homepage at desktop width](docs/screenshots/home-arabic.jpg)

![Mobile homepage](docs/screenshots/home-mobile.jpg)

![UI Motion Study case study](docs/screenshots/project-ui.jpg)

![Creative Editing Study case study](docs/screenshots/project-creative.jpg)

![CV screen](docs/screenshots/cv-desktop.jpg)

More evidence shots are in [`docs/screenshots`](docs/screenshots).

---

## 1. Stack & key decisions

- **React 19 + TypeScript 5.9 + Vite 8**
- **React Router 7** for shareable project URLs (`/work/:slug`) and browser back/forward
- **Framer Motion 14** for intentional entrances, page transitions, menu, and preview dialog motion
- **Custom CSS design system** for the editorial type scale, responsive compositions, CV interaction, and print styles
- **Local self-hosted fonts** via Fontsource: Manrope for English, IBM Plex Sans Arabic for Arabic, IBM Plex Mono for technical labels
- **No backend, no paid API, no tracking.** The contact form is provider-ready and falls back to a prepared email/WhatsApp handoff when no form provider is configured.
- **Local, web-optimised copies** of all five supplied videos with the original Google Drive files retained as explicit fallback links.
- **Aspect-aware media layouts:** portrait 9:16 work keeps the established player, while the 16:9 UI study gets a native landscape stage and preview.

Tested with **Node 24.21.0** and **pnpm 11.28.5**. Vite 8 requires Node `20.19+` or `22.12+`; `.nvmrc` requests Node 22.

---

## 2. Run it locally

```bash
pnpm install
pnpm dev
```

Open **http://127.0.0.1:5173**.

If your shell does not have pnpm installed:

```bash
corepack enable
corepack prepare pnpm@11.28.5 --activate
pnpm install
pnpm dev
```

Production build and local preview:

```bash
pnpm build
pnpm preview
```

The production output is written to `dist/`.

### Useful commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm build` | Type-check, then build the static production site |
| `pnpm preview` | Preview the production build locally |
| `pnpm typecheck` | TypeScript checks only |
| `pnpm lint` | ESLint |
| `pnpm test` | 19 Vitest content/data/validation checks |
| `pnpm qa:ui` | Browser acceptance suite (needs a running server) |
| `pnpm qa:a11y` | axe-core WCAG A/AA scan (needs a running server) |
| `pnpm qa:screens` | Capture full-page screenshots to `.tmp/qa` |
| `pnpm qa:sections` | Capture individual section screenshots |
| `pnpm brand:assets` | Regenerate the social card and Apple icon |
| `pnpm cv:pdf` | Regenerate both CV PDFs (needs a running server) |

The browser QA scripts use installed Chrome. On a non-Windows machine set `CHROME_PATH`, for example:

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" pnpm qa:ui
```

`QA_URL` changes the target URL (default `http://127.0.0.1:5173`); for the production preview use `QA_URL=http://127.0.0.1:4173`.

---

## 3. Routes

| Route | Content |
| --- | --- |
| `/` | Home, hero, selected work, about, services, contact |
| `/?lang=ar` | Same page in Arabic (RTL) |
| `/work/before-after` | Talking-head before/after case study |
| `/work/white-minimal` | Arabic editorial/typographic case study |
| `/work/isometric-style` | Isometric motion case study |
| `/work/ui-motion-study` | 16:9 UI motion study |
| `/work/creative-editing-study` | 9:16 before/after creative editing study |
| `/cv` | Bilingual dark CV sheet, PDF downloads, print flow |
| `/404` (any unknown route) | Designed not-found page |

Project routes are direct-linkable. `public/_redirects` provides the SPA fallback for Cloudflare Pages/Netlify-style hosts. Arabic is parsed from `?lang=ar`, then persisted in `localStorage`; project URLs are not duplicated per language.

The original three projects remain in their original order and keep their original source links and categories. The new studies are appended as projects 04 and 05.

---

## 4. Content without touching layout

### Site details, socials, contact

`src/data/siteConfig.ts`

- Confirmed contact email: `zeadwalid56@gmail.com`. It is visible in Contact, used by the `mailto:` links, and included in both CV PDFs. It is not a placeholder.
- Exact supplied social destinations:
  - TikTok: `https://www.tiktok.com/@ziyadwalid72?is_from_webapp=1&sender_device=pc`
  - WhatsApp: `https://wa.me/ziyadwalid395?s=t`
  - Instagram: `https://www.instagram.com/ziad_walid__video_editor?vrfl=eXo5enQ2MzVkejA3`
- `VITE_CONTACT_EMAIL` is an optional override; the confirmed address is the default when it is unset.
- `VITE_CONTACT_FORM_ENDPOINT` enables real form delivery. It is not configured here.
- `VITE_SITE_URL` enables canonical URLs, absolute social images, and generated sitemap/robots files at build time.
- The CV PDF paths are in `cvPdf`.

Do not add secret keys to any `VITE_*` value: everything prefixed with `VITE_` is bundled publicly.

### Projects

`src/data/projects.ts`

Each object supports:

- `id`, `slug`, `index`, `featured`
- `title`, `category`, `summary`, `overview`, `approach`, `role`, `format` — all `{ en, ar }`
- `focus` — an array for each language
- `poster`, `hoverPoster`, optional `previewLoop`
- `accent` — used only as a restrained contextual hue
- `relatedSlugs`
- `video.provider`, `video.src`, `video.mimeType`, `video.originalUrl`, `video.poster`, `video.aspectRatio`, `video.durationLabel`

**To add a project:**

1. Put an optimised MP4 in `public/media/videos/`.
2. Extract a real poster (and optional hover still) from the same work into `public/media/posters/`.
3. Add an object to `projects` following the existing shape. Use truthful copy only.
4. Add the new slug to related projects and, if relevant, `src/data/cv.ts`.
5. Run `pnpm test && pnpm build`.

The layout now understands more than one aspect ratio. In data, `aspectRatio` accepts `9:16`, `16:9`, `1:1`, and `4:5`; the project stage and preview modal switch to a landscape treatment when the ratio is wider than tall. Portrait projects retain the original presentation.

**To remove a project:** delete its object, remove its slug from any `relatedSlugs` and from `cvData.selectedProjectSlugs`, and remove or update any service references. The data test verifies that all service references resolve.

**To mark a project featured:** set `featured: true`. The first featured project drives the homepage hero and the large work feature. Give that project a suitable `previewLoop` if you create a lightweight muted loop; otherwise the full project video is referenced only when the preview opens.

**Video sources:**

- Local file (`provider: "file"`) is the current, most reliable path.
- The player also supports an embeddable URL (`provider: "embed"`), e.g. `https://drive.google.com/file/d/FILE_ID/preview`. The supplied Drive web-view URLs are **not** treated as direct video URLs. Local copies are used instead.
- If adding Google Drive preview embeds, test the file's sharing and viewer behavior in the browser; Drive embedding can change and is outside this project's control.
- If a poster or video fails, the UI shows a normal visual fallback and a link to the original Drive file instead of pretending playback succeeded.

### Services

`src/data/services.ts`

There are seven service rows. The new **UI Motion & Animated Interfaces** service links to `ui-motion-study`. Only offer services that are confirmed for Ziad; commercial video and YouTube long-form still have no dedicated project example.

### Arabic & English interface copy

- `src/i18n/en.ts`
- `src/i18n/ar.ts`
- Shared locale behavior: `src/i18n/LocaleContext.tsx`

Both dictionaries are structurally typed. If you add a string or object key to one language, add the same key to the other; the content test will fail until the shapes match. The site updates `lang`/`dir`, titles, descriptions, errors, labels, and UI copy without reloading.

The first visit uses URL preference → saved preference → browser language. Manual choices are saved. `?lang=ar` and `?lang=en` make language links explicit.

### Contact workflow

With no form endpoint configured:

1. Client-side validation runs.
2. A valid brief is **prepared locally** — it is never claimed to have been sent.
3. The visitor is offered a prefilled email draft to `zeadwalid56@gmail.com` or a “copy brief & open WhatsApp” action.
4. The interface states plainly that nothing was sent automatically.

To enable real submission, create a form endpoint (for example Formspree) and add to `.env.local`:

```dotenv
VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form-id
# Optional: override the confirmed default contact email
# VITE_CONTACT_EMAIL=zeadwalid56@gmail.com
# Optional: public site origin when deployed
# VITE_SITE_URL=https://your-real-domain.com
```

The client POSTs JSON to that endpoint. Provider-side validation and spam checks apply; a honeypot field is also included. Never place a private token in this variable. Rebuild/redeploy after changing environment variables (Vite variables are build-time values).

No real provider or automated inbox delivery is configured in this repository. The email address is real and the mailto handoff works; automatic form delivery was not tested against a live provider in this pass.

---

## 5. CV content and PDFs

`src/data/cv.ts` + `src/pages/CVPage.tsx`

Confirmed content:

- Professional title: **Creative Video Editor & Motion Designer**
- Approximately one year of video editing experience
- First-year student, **Faculty of Commerce** (no institution, graduation date, GPA, or dates invented)
- Collaborations: **Estabraq** (home & lifestyle) and **Dr. Ahmed Elshabrawy** (content creator), linked to the supplied Instagram profiles
- Five selected projects
- Email: `zeadwalid56@gmail.com`
- Verified tool: **DaVinci Resolve** only
- Skills cover short-form and Reels/Shorts, storytelling/talking-head editing, motion graphics and animated typography, UI-style editing, colour grading, sound design/SFX, and AI-assisted production

No formal employment dates, job titles beyond the confirmed professional role, testimonials, results, certifications, grade averages, or language proficiency levels were added. The two language entries retain an explicit “Proficiency details pending” marker.

The on-screen CV uses the site’s dark surface system (`#111114` on `#0A0A0C`), off-white type, lime section labels and markers, and fine `#303035` dividers. A restrained lime spotlight follows a fine mouse pointer and sections lift very subtly on hover. The effect is disabled for touch, coarse pointers, and `prefers-reduced-motion`; content stays fully readable without it, and print media removes every screen effect.

### Regenerate the PDFs

```bash
pnpm dev
# in another terminal
pnpm cv:pdf
```

The generator opens `/cv?lang=en&export=pdf` and `/cv?lang=ar&export=pdf` in print media using local Chrome. The export route renders selected-work rows as text so the downloadable PDFs contain no dead local project links; the on-screen CV keeps those links.

Output:

- `public/cv/ziad-vd-cv-en.pdf`
- `public/cv/ziad-vd-cv-ar.pdf`

Both are one-page A4 PDFs. They were rendered to images and checked for clipping, section breaks, RTL ordering, the confirmed email, the new project entries, collaborations, and education. Regenerate after any CV content or print-style change.

---

## 6. Media supplied & verified

All five supplied Google Drive files were accessible, downloadable, and valid H.264/AAC videos. The new videos were inspected before copy was written:

| Source file | Content | Original format | Runtime | Local web copy |
| --- | --- | --- | --- | --- |
| `Timeline 1.mov` | `before-after` — talking-head before/after | 1080×1920, 9:16 | 00:53.23 | `public/media/videos/before-after.mp4` (720×1280) |
| `نسخة من White Minimal Stayl 2.mov` | `white-minimal` — Arabic editorial | 1080×1920, 9:16 | 00:23.30 | `public/media/videos/white-minimal.mp4` (720×1280) |
| `Isometric Style.mov` | `isometric-style` — 3D motion | 1080×1920, 9:16 | 00:10.01 | `public/media/videos/isometric-style.mp4` (720×1280) |
| `spotify` | `ui-motion-study` — 16:9 music-player UI study | 1920×1080, 16:9 | 00:56.00 | `public/media/videos/ui-motion-study.mp4` (1440×810) |
| `نسخة من Timeline 1-1.mov` | `creative-editing-study` — before/after talking-head study | 1080×1920, 9:16 | 00:26.56 | `public/media/videos/creative-editing-study.mp4` (720×1280) |

The two new local copies are H.264/AAC with `+faststart`; both include their source audio. The UI study keeps its native 16:9 shape in project and preview views. The creative editing study stays 9:16.

Real frames were extracted for every poster. The UI study's 4:5 card is composed from its own footage (a real interface frame over a blurred frame from the same clip); no stock imagery or fabricated interface was used. The creative editing card is a crop of the real before/after split.

The original Drive links are stored in each project's `video.originalUrl` and are available as backup links in preview and case-study views. They were **not** used as direct `<video>` URLs.

**Project 05 title and category:** the footage is a vertical, split-screen before/after talking-head edit. The neutral working title **Creative Editing Study** was retained, and the category was confirmed from the footage as **Talking Head / Before & After**. No client, campaign, or result is claimed.

The audio exists, but **captions/transcripts were not supplied**, so the site cannot yet claim full WCAG media accessibility. See remaining items.

### Rebuilding media

`pnpm brand:assets` regenerates only the social card and app icon. Media compression and poster extraction were done from the supplied source files; replace assets manually when the work changes. Keep a poster in the same ratio or a designed card crop so the layout stays stable.

---

## 7. Accessibility & performance built in

- Semantic landmarks, one main region, skip link, logical headings, form labels, and video labels
- Keyboard-accessible mobile menu and preview dialog, Escape handling, focus trapping, focus return, and visible focus states
- Dialog background scroll lock, outside-click close, and an explicit video-error fallback
- Auto-playing hero preview is muted, opt-out via a visible pause control, paused when off-screen or when the preview opens
- Reduced-motion support disables autoplay, collapses CSS animation, skips transform-heavy entrances, and disables the CV pointer light
- CV spotlight respects `(hover: hover) and (pointer: fine)`, uses `requestAnimationFrame`, and never intercepts clicks
- Touch input cannot activate the CV spotlight; the screen CV remains fully readable with no mouse and no JavaScript effect
- Print CSS resets the dark surface, effects, hover states, and spotlight so PDFs stay light and clean
- Local fonts, lazy-loaded route chunks, lazy poster loading, stable aspect-ratio containers
- Full video files are only mounted in the modal/player; the homepage hero uses a small muted loop with a poster
- axe-core WCAG A/AA scan returns **0 violations across 14 rendered pages/states**, on both the dev server and the production preview

**Known media accessibility gap:** no caption tracks or transcripts are present because none were supplied/verified. Add WebVTT captions and transcripts for spoken work before claiming full media accessibility.

---

## 8. Tests actually performed

All checks were run against the finished workspace in this environment (headless Chrome via Playwright):

| Check | Result |
| --- | --- |
| `pnpm typecheck` | Pass |
| `pnpm lint` | Pass, no warnings/errors |
| `pnpm test` | **19/19** tests pass (bilingual structure, five-project/media integrity, CV facts, validation, brief building, mailto encoding, exact socials, confirmed email) |
| `pnpm build` | Pass; production bundle and assets written to `dist/` |
| Browser acceptance, dev server | **58/58** checks pass |
| Browser acceptance, production preview (`:4173`) | **58/58** checks pass |
| axe-core, dev server | **0 violations across 14 rendered pages/states** |
| axe-core, production preview | **0 violations across 14 rendered pages/states** |
| Responsive widths | 360, 390, 768, 1024, 1440, 1920 px — no horizontal overflow |
| Arabic browser default | Pass (`ar-EG` context resolves RTL Arabic) |
| Manual language switch | Pass; no reload; title/lang/dir update; route preserved; preference persists |
| Project routes | Five detail routes render; direct refresh, SPA navigation, back/forward pass |
| Video playback | **All five** local videos reach metadata, play, and advance; new UI video is 1440×810 (16:9), creative study is 720×1280 (9:16) |
| New landscape preview | UI Motion Study opens in `.preview-modal--landscape`, plays at a measured 1.778 ratio |
| Video fallback | Blocked local file shows a clear message and the original Drive link |
| CV screen | Five works, two collaborations, confirmed email, experience, education all present |
| CV interactions | Pointer spotlight and section hover pass with a mouse; disabled for touch; disabled under reduced motion |
| CV PDFs | Both downloads return `200 application/pdf` + `%PDF-`; both are **1-page A4**, rendered and visually inspected; correct email/facts present; no dead local project links |
| Contact | Validation, first-invalid focus, prepared handoff, exact mailto, WhatsApp link, and no false success all pass |
| Console/network | No console errors, page errors, or missing document responses in the normal browser pass |
| Deployment | **Not performed**; the production preview is local only |

Axe states scanned: home EN/AR desktop and mobile, project before/after EN, white-minimal AR, UI motion EN, creative editing AR, CV EN/AR, 404, preview modal (portrait featured), preview modal (landscape UI), and mobile menu.

Not covered: real provider/inbox delivery, real mobile Safari/Firefox testing, physical device testing, caption accuracy, or production deployment. Those are environment or account-dependent.

### Exact QA commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build

# with pnpm dev running in another terminal
pnpm qa:ui
pnpm qa:a11y

# with pnpm preview running in another terminal
QA_URL=http://127.0.0.1:4173 pnpm qa:ui
QA_URL=http://127.0.0.1:4173 pnpm qa:a11y
```

Screenshots from the live QA run go to `.tmp/qa/` and are not part of the deliverable. Curated, checked evidence shots live in `docs/screenshots/`.

---

## 9. Deployment

**Cloudflare Pages is the recommended target** because the app uses BrowserRouter and Cloudflare supports both SPA redirects and `_headers`.

1. Push the repository to GitHub/GitLab.
2. In Cloudflare Pages, create a project and connect the repository.
3. Use:
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Node version:** 22 (`.nvmrc` is included; configure `NODE_VERSION=22` if necessary).
4. Add optional build environment variables in Pages:
   - `VITE_SITE_URL` — the real public origin, once known
   - `VITE_CONTACT_EMAIL` — only if you intentionally want to override the confirmed default
   - `VITE_CONTACT_FORM_ENDPOINT` — public form endpoint, if enabled
5. Deploy.
6. Add the custom domain in Cloudflare Pages. Then make sure `VITE_SITE_URL` matches the final domain and redeploy so canonical metadata, absolute OG image URLs, and the generated sitemap are correct.

Included hosting helpers:

- `public/_redirects` → `/* /index.html 200` for direct project URLs and refreshes
- `public/_headers` → basic security headers and cache rules (hashed `/assets/*` long cache; media/PDF week cache; HTML no-cache)
- Build-time sitemap and robots generation when `VITE_SITE_URL` is set
- `VITE_SITE_URL` unset → no guessed canonical, no sitemap URL. This is intentional until a real domain exists.

**Deployment was not performed in this environment.** The instructions above describe the path, not a completed deployment.

Alternative hosts: any free static host that supports SPA fallback works. GitHub Pages requires extra handling for client-side deep links and repository base paths; Cloudflare Pages is simpler for this codebase.

---

## 10. Remaining items before launch

1. **Language proficiency** — the CV deliberately says “Proficiency details pending.” Confirm levels (or omit the language levels entirely), then regenerate the PDFs.
2. **Project 05 naming** — the title remains the neutral working title “Creative Editing Study.” The category is confirmed from the footage; rename the title only if Ziad wants a more specific editorial title.
3. **Contact form delivery** — set `VITE_CONTACT_FORM_ENDPOINT` for automatic submission. Until then, the honest manual email/WhatsApp handoff is the intended behavior.
4. **Captions/transcripts** — add WebVTT tracks and readable transcripts if the spoken content needs full WCAG media support.
5. **Public domain** — deploy, connect the custom domain, and set `VITE_SITE_URL`. This also enables the generated sitemap and absolute canonical/OG URLs.
6. **Offered services** — confirm whether commercial video and YouTube long-form should remain offered while they have no dedicated case study.
7. **CV PDF refresh** — rerun `pnpm cv:pdf` after any CV content change, language-level decision, or print-style adjustment.

---

## 11. Source map

```
src/
  data/
    projects.ts       five projects + video sources
    services.ts       seven services + contact project-type options
    siteConfig.ts     brand/socials/confirmed email/form endpoint/CV PDFs
    cv.ts             confirmed CV content, collaborations, intentional language placeholders
  i18n/
    en.ts, ar.ts      complete UI dictionaries
    LocaleContext.tsx locale detection, persistence, document dir/lang
  components/         header, hero, work, about, services, contact,
                      preview modal, mobile menu, footer, CTAs
  pages/
    HomePage.tsx
    ProjectPage.tsx   direct-route case studies, aspect-aware player
    CVPage.tsx
    NotFoundPage.tsx
  lib/
    inquiry.ts        typed values, validation, mailto/brief helpers
    types.ts          shared content types
    utils.ts          shared class/aspect helpers
  styles/
    base.css          reset, tokens, type, utilities
    site.css          core composition and components
    pages.css         project/404/contact-banner styles
    cv.css            CV screen interactions + light print layout
public/
  media/videos/       five optimised supplied works + hero loop
  media/posters/      real extracted frames and designed card crops
  cv/                 verified downloadable PDFs
  _headers, _redirects, favicon.svg, og-cover.jpg, robots.txt, manifest
scripts/
  qa-ui.mjs
  qa-a11y.mjs
  qa-screenshots.mjs
  qa-sections.mjs
  generate-cv-pdfs.mjs
  generate-brand-assets.mjs
docs/
  screenshots/        curated current evidence shots
```

### Content truthfulness

The site shows the five works supplied by Ziad. No fabricated client logos, testimonials, performance figures, awards, employment history, or results were added. Metrics visible inside the original footage are not presented as Ziad's results. Unknown personal, client, education, and CV information is omitted or clearly marked (currently only language proficiency levels). Project 05's client and campaign context are not claimed because they were not supplied.

# Handover — Homepage section picker

Written 2026-11-03 for whoever picks this project up next. Read this first, then [README.md](README.md) for the feature-level detail and the design rationale. [CLAUDE.md](CLAUDE.md) is the short version for AI coding assistants.

---

## 1. What this is

A single-page tool that lets a client assemble their homepage from an approved catalogue of sections. They can:

- reorder, swap, add and remove sections
- pick each section's design from the drawn Figma set
- fill in its copy and images
- watch the result build live in a browser-chrome preview

**Build my homepage** opens the finished page full-width in a second window.

There's also an optional analyser that reads the client's current website (brand colour, logo, nav, hero copy and image) and drops that content into the previews. It's built and working, but the panel is **switched off** for now (see [Known issues](#8-known-issues-and-open-items)).

| | |
| --- | --- |
| Stack | Next.js 15.5 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Swiper 14, `openai` SDK |
| Backend | Two route handlers, `POST /api/analyze` and `POST /api/generate`. There's no database and no auth. All other state lives in React and `localStorage` |
| Repo | `https://github.com/Levi271997/homepage-section-picker` (branch `main`) |
| Live (static) | GitHub Pages, built by `.github/workflows/pages.yml` on every push to `main` |
| Tests | None |
| Lint | `npm run lint` exists, but ESLint isn't installed or configured |

## 2. Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (server mode, analyser included)
npm start        # serve that build
```

The analyser needs an OpenAI key in `.env.local`, which is git-ignored, and the AI designer needs a DeepSeek one. Everything else works without them.

```
OPENAI_API_KEY=sk-proj-...
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat   # optional; this is the default
```

**Static build (GitHub Pages).** Set `NEXT_PUBLIC_STATIC_BUILD=true` and delete `src/app/api` first. Only the CI workflow does this. The flag switches `next.config.mjs` to `output: 'export'` with `basePath: '/homepage-section-picker'`, and it hides the analyser UI. **Never move the model call into the browser:** the API key would ship in the bundle. If you want the analyser live, host on something that runs Node (Vercel works) and set the key as a server env var.

## 3. Folder structure

```
homepage-section-picker/
├── .github/
│   └── workflows/
│       └── pages.yml              CI: static export → GitHub Pages
├── public/                        Served as-is from the site root
│   ├── design-sets/               Figma exports (SVG), names kept exactly as exported
│   │   ├── section-cogs/          One folder per section's design set  ← used at runtime
│   │   │   ├── accordions/        FAQ V1–V5
│   │   │   ├── blogs/             V1–V6
│   │   │   ├── contact form/      V1–V6
│   │   │   ├── content card/      V1–V22 × Rows=1/2/3 (66 files)
│   │   │   ├── content section/   V1–V10, V13, V15–V23 (20 files, "Style=" prefix)
│   │   │   ├── cta/               V1–V10
│   │   │   ├── footer/            V1–V8 ("Style=" prefix)
│   │   │   ├── header/            V1–V11 + Variant12  ← exported but NOT wired yet
│   │   │   ├── hero/              23 designs, V1–V28 with gaps
│   │   │   ├── logo strips/       V1–V3
│   │   │   ├── pricing/           V1–V6
│   │   │   ├── stats/             V1–V4
│   │   │   ├── team members/      V1–V3
│   │   │   └── testimonials/      V1–V6
│   │   ├── checkbox/              ┐
│   │   ├── color-presets/         │
│   │   ├── color-tokens/          │  Design-system reference sheets.
│   │   ├── effects/               │  Never loaded by the app; the code transcribes
│   │   ├── font-style/            │  them (type scale, form field states, etc.)
│   │   ├── input-fields/          │
│   │   ├── links/                 │
│   │   └── radiobuttons/          ┘
│   └── fonts/
│       └── recoleta/              Drop licensed Recoleta .woff2 files here (README inside)
├── src/
│   ├── app/                       Next.js App Router: routes, layout, global CSS
│   │   ├── api/analyze/route.ts   POST /api/analyze (server only)
│   │   ├── api/generate/route.ts  POST /api/generate (server only)
│   │   ├── fonts/satoshi/         Self-hosted Satoshi 400/500/700/900 .woff2
│   │   ├── preview/               /preview, the pop-out "finished page" window
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               /, the editor
│   ├── components/                React UI
│   │   ├── previews/              One wireframe renderer per section + shared parts
│   │   └── *.tsx / *.ts           Editor shell, rows, menus, pickers, page views
│   └── lib/                       Plain TypeScript: data, schemas, helpers (no JSX)
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── package.json / package-lock.json
├── .gitignore
├── README.md
├── HANDOVER.md                    This file
└── CLAUDE.md                      Context for AI coding assistants
```

**Generated or ignored (don't commit):** `node_modules/`, `.next/`, `out/` (the static export), `next-env.d.ts`, `tsconfig.tsbuildinfo`, and `.env*.local` / `.env`.

## 4. Folder definitions

| Folder | What it's for | What's in it |
| --- | --- | --- |
| `.github/workflows/` | CI/CD | `pages.yml`: on push to `main` (or a manual run), installs, deletes `src/app/api`, builds with `NEXT_PUBLIC_STATIC_BUILD=true`, adds `.nojekyll` and deploys `out/` to Pages |
| `public/` | Static files served at the site root (under `/homepage-section-picker/` on Pages) | Design artwork and the Recoleta font slot |
| `public/design-sets/section-cogs/` | The finished design for every section variant, shown wherever a design is being **chosen** (picker cards, row thumbnails, swap/add menus) | SVGs named exactly as Figma exported them, e.g. `Type=Hero V1.svg`. The spaces and `=` are intentional, so don't rename them. Paths are built in `src/lib/previewImages.ts` |
| `public/design-sets/` (other subfolders) | Reference sheets from the design system: colour tokens and presets, type scale, form field and control states, links, effects | Never fetched. Their values are copied by hand into `globals.css` (type scale) and `previews/parts.tsx` (field states) |
| `public/fonts/recoleta/` | Slot for the licensed heading font | Just a README listing the four expected filenames. `@font-face` rules in `globals.css` already point here |
| `src/app/` | Routes and app-wide setup | Root layout (fonts, metadata), global CSS and theme tokens, the editor route `/`, the pop-out route `/preview`, the API route |
| `src/app/api/analyze/` | Server-side site analyser | `route.ts`. Removed from the static build |
| `src/app/api/generate/` | Server-side AI designer: theme, then one HTML/CSS section per outline, joined into a sandboxed document that carries one hash-pinned slider script | `route.ts`. Removed from the static build |
| `src/app/fonts/satoshi/` | Body/UI font, free licence, committed | Four `.woff2` weights, loaded through `next/font/local` in `layout.tsx` |
| `src/app/preview/` | The second window that shows the finished page full-width | Reads the page from `localStorage` and re-renders on every change |
| `src/components/` | The editor UI | Shell, list rows, menus, option picker, content editor, in-app and pop-out page renderers, icons |
| `src/components/previews/` | Live wireframes of every section, used on the assembled page | One `XxxPreview.tsx` per section, dispatched by `SectionPreview.tsx`. Shared building blocks are in `parts.tsx`, heights in `aspect.ts`, carousel behaviour in `useCarousel.ts`, static vs interactive in `mode.tsx` |
| `src/lib/` | Framework-free data and logic | The section catalogue and option groups, content schemas and placeholders, artwork mapping, site-analysis types and parsing, cross-window sharing, asset URL helper |

## 5. File reference

### Root and config

| File | Purpose |
| --- | --- |
| `package.json` | Scripts (`dev`, `build`, `start`, `lint`) and dependencies |
| `package-lock.json` | Locked dependency tree. CI uses `npm ci`, so commit it whenever dependencies change |
| `next.config.mjs` | Empty config for dev and server builds. When `NEXT_PUBLIC_STATIC_BUILD=true` it switches to `output: 'export'`, sets `basePath`/`assetPrefix` to `/homepage-section-picker` and `trailingSlash`, and turns off image optimisation |
| `postcss.config.mjs` | Loads `@tailwindcss/postcss` (Tailwind v4, so there's no `tailwind.config.js`) |
| `tsconfig.json` | TypeScript settings. Defines the `@/*` → `src/*` path alias used in every import |
| `.gitignore` | Ignores build output, `node_modules`, env files, TS build info |
| `README.md` | The feature tour and the "why" behind each design decision: windows, markup rules, design sets, content model, analyser split |
| `public/fonts/recoleta/README.md` | Which Recoleta files to drop in and under what names |

### `src/app/`

| File | Purpose |
| --- | --- |
| `layout.tsx` | Root `<html>`/`<body>`. Loads Satoshi through `next/font/local` (sets `--font-satoshi`), imports `globals.css`, sets the default page title |
| `page.tsx` | The `/` route. Just a `<main>` wrapping `<SectionPicker />` |
| `globals.css` | Imports Tailwind. Holds the Recoleta `@font-face` rules (two URLs each, dev root and Pages sub-path), the `@theme` tokens (all colours and the `--font-sans`/`--font-display` families, so restyle here), and the `.page-view [data-role=…]` rules that make the assembled page behave like a website (hover states, nav underline, dropdowns). Also the slide/skeleton animations and the `@layer base` heading scale transcribed from `Font Style.svg` |
| `preview/layout.tsx` | Sets the pop-out window's tab title ("Your homepage") |
| `preview/page.tsx` | The pop-out route. Paints a skeleton straight away, then reads the shared page (`readPage`), subscribes to `storage` events (`subscribeToPage`) and renders it full-width through `PageBody` |
| `api/analyze/route.ts` | `POST { url }` → `SiteProfile`. Fetches and extracts signals (`extractPage.ts`), asks OpenAI (`gpt-5.6`, structured JSON schema) which candidate is the brand colour, logo, hero and so on, then re-validates every value (URLs must come from the candidate list, colours must be hex). Any failure gives back a profile with `error` set rather than a crash |

### `src/lib/`

| File | Purpose |
| --- | --- |
| `sections.ts` | **The heart of the app.** `CATALOG` lists the 14 sections (id, label, icon, `required`, `pinned`, option groups). It also has the `*_GROUPS` option axes for each section, the shared corner groups (`buttonRadius`, `imageRadius`, `cardRadius`) with their `appliesTo` visibility rules, `SUGGESTED_IDS` (default order), and the helpers `byId`, `defaultChoice`, `choiceOf`, `activeGroups`, `describeChoice` |
| `content.ts` | What a section *contains*, as opposed to how it's arranged. `CONTENT` maps each section id to its editable fields and placeholder defaults. `profileToContent` turns analyser output into content overrides. Also helpers: `contentOf`, `fieldsOf` (respects a field's `appliesTo`), `linesOf`, `itemAt` (wrapping lists), `splitOnDot`/`splitStat` (the `A · B` pair convention) |
| `placeholder.ts` | Generates placeholder images as inline SVG data URIs, so nothing is fetched. Shapes: landscape, portrait, square, wide, logo (a "Logo" wordmark). `isPlaceholder` tells them apart from real images |
| `previewImages.ts` | `PREVIEW_IMAGES` maps section id → design option → SVG path under `public/design-sets/section-cogs/`. `imageFor()` resolves the current choice. Watch for Figma's naming quirks (`Style=` vs `Type=`, "Logo Strips", "Team members", "Accordion") |
| `asset.ts` | `asset(path)`: adds the Pages `basePath` and percent-encodes each path segment. Use it for **every** file from `public/`, because images are plain `<img>` tags and Next won't rewrite them. `Type=Hero V1.svg` 404s unless the `=` is encoded |
| `share.ts` | Cross-window handoff. `publishPage` writes `{ids, layouts, contentStore, address, spec, brand}` to `localStorage` under `homepage-section-picker:page` and returns false if the quota is exceeded. `readPage` validates what it reads back. `subscribeToPage` listens for `storage` events |
| `siteProfile.ts` | The `SiteProfile` type (analyser output). `brandVariables()` turns a brand colour into the `--brand*` CSS custom properties, with tints mixed via `color-mix()`. Also the guards that keep model output honest: `hexOrNull`, `urlOrNull`, `textOrNull`, `normalizeUrl` |
| `extractPage.ts` | The deterministic half of the analyser. `fetchPage` (browser UA, 15s timeout, HTML only) and `extractSignals` (title, meta, icons and logos, images, hex colours by frequency with greys removed, visible text) |

### `src/components/`

| File | Purpose |
| --- | --- |
| `SectionPicker.tsx` | **The editor shell and all its state.** That covers section order (`ids`), layout choices (`layouts`), edited content (`contentStore`), which menus are open, drag state, and analyser state. It holds swap/add/remove/move logic (pinned rows never move), publishes to `share.ts` on every change, opens the pop-out window (falling back to `PageView` if pop-ups are blocked), and builds the one-line `spec`. Holds the `SHOW_SITE_AUDIT` switch |
| `PagePreview.tsx` | The left-hand live preview in fake browser chrome. Highlights and scrolls to the section being edited. Has a "New window" button |
| `PageBody.tsx` | The assembled page "behaving like a website". Shared by `PageView` and `/preview` so they can't drift apart. Sets `page-view` class and interactive preview mode, and swallows `#` link clicks. `width: 'page' \| 'full'` |
| `PageView.tsx` | Full-screen in-app dialog version of the finished page (the pop-up-blocked fallback). Top bar with copy-spec and close, Esc to close, locks body scroll |
| `SectionRow.tsx` | One row in the list. Shows a grip (drag and ↑/↓ keys), thumbnail, label, layout caption, Swap/Remove or a "Required" badge. Expands inline into Layout (`OptionPicker`) and Content (`ContentEditor`) side by side |
| `SectionMenu.tsx` | The overlay list used by both **Swap for** and **Add a section**. Shows thumbnails and flags "trade places" when a section is already on the page |
| `OptionPicker.tsx` | Renders a section's option groups as radiogroups: preview cards (`display: 'cards'`) or chips (`'chips'`). Hides groups whose `appliesTo` is false |
| `ContentEditor.tsx` | The Content panel. One input per field (text, paragraph, lines, image, images). Images take a URL or a local file (stored as a data URI). Per-section reset |
| `icons.tsx` | Inline SVG icon set (`<Icon name="…" />`). `IconName` is the union of available names; no icon library |
| `useScrolled.ts` | Hook that sets `data-scrolled` on a scroller (with hysteresis) so the sticky site header compacts. Styled in `globals.css` |

### `src/components/previews/`

| File | Purpose |
| --- | --- |
| `SectionPreview.tsx` | Dispatcher: section id → the right `XxxPreview`. With `screenshot` it shows the Figma SVG from `previewImages.ts` instead of the wireframe. Choosers pass it; the assembled page doesn't |
| `parts.tsx` | Shared building blocks. `PreviewFrame` (container-query frame; the `decorative` prop makes thumbnails `inert`/`aria-hidden`), `ImageBlock`, `FilledButton`/`OutlineButton`, `HeadlineLine`/`BodyLine` (real text or grey wireframe bar), `Eyebrow`, `LogoMark`/`LogoRow`, `Dots`, `SOCIAL_GLYPHS`, form field styles, and the corner-radius maps plus `cornersOf()` |
| `aspect.ts` | `aspectFor(sectionId, choice)` gives each design's height ratio from its 1440-wide artboard. Ratios are **literal class names** (`'aspect-[1440/613]'`) because Tailwind only generates classes it can read in the source |
| `mode.tsx` | `PreviewModeProvider` / `usePreviewMode`: `'static'` (thumbnails, side preview) or `'interactive'` (full page; carousels run) |
| `useCarousel.ts` | Autoplay, pause on hover, drag-to-change and slide animation for the hand-rolled carousels. Only active in interactive mode. Respects `prefers-reduced-motion` |
| `HeroPreview.tsx` | Hero, 23 designs. `SPECS` table over three frames: copy beside media, copy above media, copy over a background image. V23/V24 use a Swiper background slider. V18/V28 hold forms |
| `HeaderPreview.tsx` | Site header. Still built from **combinable axes** (structure × nav × band × CTA), not a design set |
| `ContentCardPreview.tsx` | Content cards, 22 designs × 1/2/3 rows |
| `ContentSectionPreview.tsx` | Content section, 20 designs over four frames |
| `TestimonialsPreview.tsx` | Testimonials, 6 designs (grid, arrow carousel, portrait beside) |
| `LogoStripPreview.tsx` | Logo strip, 3 designs. V1/V2 page on Swiper |
| `TeamPreview.tsx` | Team members, 3 designs |
| `StatsPreview.tsx` | Stats, 4 designs |
| `PricingPreview.tsx` | Pricing, 6 designs |
| `BlogsPreview.tsx` | Blogs, 6 designs |
| `FaqPreview.tsx` | FAQ accordion, 5 designs (real `<details>`/`<summary>`) |
| `CtaPreview.tsx` | Call to action, 10 designs over three frames |
| `ContactFormPreview.tsx` | Contact form, 6 designs (same five-field form, different holders) |
| `FooterPreview.tsx` | Site footer, 8 designs over three frames |

## 6. How it fits together

```
sections.ts (CATALOG, option groups)   content.ts (fields, placeholders)
            │                                   │
            ▼                                   ▼
   SectionPicker.tsx  ── state: ids · layouts · contentStore · profile
     │        │                │
     │        │                └─ publishPage() ──► localStorage ──► /preview (PageBody, full width)
     │        └─ SectionRow ─► OptionPicker / ContentEditor / SectionMenu
     │                           (thumbnails = SectionPreview screenshot → Figma SVG)
     └─ PagePreview ─► SectionPreview (wireframe) ─► XxxPreview ─► parts.tsx

Brand colour: profile → brandVariables() → --brand* CSS vars on the shell → every preview reads var(--brand, #3f6b30)
Analyser:     /api/analyze → extractPage.ts (parse) → OpenAI (judge) → siteProfile guards → profileToContent()
```

Key ideas to keep:

- **Choice vs content.** `Choice` (from `sections.ts`) is how a section is arranged. `SectionContent` (from `content.ts`) is what's in it. Both are flat `Record<string, string>` maps.
- **Two renderings of each design.** Choosers show the Figma SVG. The assembled page shows a wireframe that fills with the client's content. `SectionPreview`'s `screenshot` prop is the switch.
- **Everything is sized in `cqw`**, so one renderer scales from a 64px thumbnail to a full-width window.
- **Content conventions.** Lists are one item per line and wrap to fill a grid. Paired lists line up by position. `A · B` splits a pair within one line.
- **Required vs pinned.** `required` means it can't be removed or swapped. `pinned` also fixes its position. Header, hero and footer are pinned. The contact form is required but draggable.

## 7. Common tasks

**Add a newly exported design to an existing set** (e.g. Hero V29):

1. Drop the SVG into `public/design-sets/section-cogs/<set>/` with Figma's name unchanged.
2. Add an option to the section's `*_GROUPS` in `src/lib/sections.ts`, and update any `appliesTo` lists for the corner groups.
3. Map it in `PREVIEW_IMAGES` in `src/lib/previewImages.ts`.
4. Add its artboard ratio, as a literal class, in `src/components/previews/aspect.ts`.
5. Add a row to the `SPECS` table in the section's `XxxPreview.tsx`.
6. If it shows a field the others don't, add that field in `content.ts` with an `appliesTo`.

**Add a whole new section type:** add an `XxxPreview.tsx`, a `*_GROUPS` and a `CATALOG` entry (plus `SUGGESTED_IDS` if it's in the default page), a `CONTENT` schema, `PREVIEW_IMAGES` entries, `aspect.ts` ratios, a case in `SectionPreview.tsx`, and an icon in `icons.tsx` if needed.

**Restyle the app:** edit the `@theme` block in `globals.css`. The section previews take their greens from the `--brand*` variables, with fallbacks hard-coded in each preview file.

**Turn the site analyser back on:** set `SHOW_SITE_AUDIT = true` in `src/components/SectionPicker.tsx` and provide `OPENAI_API_KEY`. It still won't appear on the Pages build.

**Install Recoleta:** see `public/fonts/recoleta/README.md`. No code change is needed.

## 8. Known issues and open items

1. **Site analyser panel is hidden.** `SHOW_SITE_AUDIT = false` in `SectionPicker.tsx`. The README still describes "Read my site" as live, and the route, state and handler are all intact.
2. **Header design set not wired.** `public/design-sets/section-cogs/header/` has 12 exported designs (`Type=Header V1–V11.svg`, plus `Type=Variant12.svg`, which is probably a misnamed V12). But `HEADER_GROUPS` and `HeaderPreview.tsx` still use the older combinable axes, and the header has no `PREVIEW_IMAGES` entry. Every other section has moved to a flat `design` axis. This is the obvious next job.
3. **Stale comments:**
   - The top doc comment in `api/analyze/route.ts` says "Claude", but the route calls OpenAI (`gpt-5.6`).
   - The `@theme` comment in `globals.css` says Recoleta's `@font-face` is in `layout.tsx`. It's actually at the top of `globals.css`.
4. **Recoleta isn't licensed or committed**, so headings render in the fallback serif until the files are added.
5. **No tests and no ESLint setup.** Check changes by hand with `npm run build` (type-checks) and in the browser.
6. **Touch devices can't drag to reorder** (HTML5 drag events don't fire on touch). Keyboard ↑/↓ on the grip is the only alternative.
7. **`localStorage` quota.** Uploaded images are stored as data URIs, so a few large ones can stop the page reaching the second window. The UI shows a warning when that happens.
8. **"Reset to suggested"** resets order and layouts, but keeps edited content (content is reset per section in the editor).
9. Nothing is saved between sessions. Refreshing the editor drops all choices. There's no export beyond the copy-spec button.

## 9. Handover context files

| File | Who it's for | What it holds |
| --- | --- | --- |
| `HANDOVER.md` (this file) | The next developer | Structure, file map, data flow, recipes, open items |
| `README.md` | Anyone | Feature tour and design rationale, in depth |
| `CLAUDE.md` | AI coding assistants (Claude Code reads it automatically) | Condensed rules and gotchas for editing this repo |
| `public/fonts/recoleta/README.md` | Whoever buys the font | Expected filenames |

**Repo conventions so far:**

- Commits go straight to `main`.
- Commit messages are one plain sentence in the imperative, e.g. "Add the card corner setting to …".
- Commits have been authored as `Levi271997`.
- Pushing to `main` deploys the static site automatically.
- Code comments explain *why*, in full sentences. New code should match that density and tone.

**Accounts and secrets to transfer:**

- GitHub repo access (`Levi271997/homepage-section-picker`)
- GitHub Pages settings (Source = GitHub Actions)
- The OpenAI API key (never committed; lives in each developer's `.env.local`)
- The Figma file the design sets were exported from (not linked in the repo; ask the previous owner for it)

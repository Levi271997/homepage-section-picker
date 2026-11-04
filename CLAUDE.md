# CLAUDE.md

Context for AI coding assistants working in this repo. The full handover is [HANDOVER.md](HANDOVER.md), and the design rationale is in [README.md](README.md).

## Project

This is a Next.js 15 (App Router), React 19, TypeScript and Tailwind v4 tool. A client assembles a homepage from 14 approved sections, picks each section's Figma design, edits its content, and sees it live. `/preview` is the finished page in a second window, synced via `localStorage`. `POST /api/analyze` reads a client's existing site with OpenAI, but its UI is hidden (`SHOW_SITE_AUDIT = false` in `src/components/SectionPicker.tsx`).

## Commands

- `npm run dev`: dev server on :3000.
- `npm run build`: production build, and the only automated check (type-checks). There are no tests and no ESLint.
- Static Pages build: CI sets `NEXT_PUBLIC_STATIC_BUILD=true` and deletes `src/app/api` (see `.github/workflows/pages.yml`).

## Where things live

- `src/lib/sections.ts` is the section catalogue (`CATALOG`), each section's option groups (`*_GROUPS`), corner-radius groups with `appliesTo`, and the default order (`SUGGESTED_IDS`).
- `src/lib/content.ts` has the editable fields and placeholder copy per section (`CONTENT`).
- `src/lib/previewImages.ts` maps each design option to its Figma SVG in `public/design-sets/section-cogs/`.
- `src/components/previews/aspect.ts` holds each design's artboard height ratio.
- `src/components/previews/XxxPreview.tsx` is the live wireframe per section, driven by a `SPECS` table.
- `src/components/previews/parts.tsx` has the shared preview building blocks.
- `src/components/SectionPicker.tsx` holds all editor state and the swap/add/remove/move logic.
- `src/lib/outline.tsx` renders the chosen sections off-screen at 1440px and measures each into a text outline; `POST /api/generate` (DeepSeek) designs a fresh page that follows those outlines, shown by `AiDesignPreview` in a sandboxed iframe, and full-size at `/ai-preview` (handed over through `localStorage`, like `/preview`). It never edits the layouts, previews or content.
- **The AI design's iframe runs one script, and it is ours.** The frame has `sandbox="allow-scripts"` and no `allow-same-origin`, so it is an opaque origin that can't reach the editor; the document's CSP admits only the `SLIDER` in `route.ts` by sha256 hash, and `cleanHtml` still strips anything the model writes. Carousels in the generated page use `.carousel > .track > .slide` with `.carousel-prev`/`.carousel-next`/`.carousel-dots`, and the dots are built by that script. Don't widen the sandbox or loosen `script-src`.
- **Colours the model picks are contrast-checked, not trusted.** `readable()` in `route.ts` replaces `headerText` and `onPrimary` when they fall below 4.5:1 against what they sit on.
- `src/app/globals.css` has the theme tokens (`@theme`), the `.page-view [data-role]` behaviour, and the heading scale.

## Rules and gotchas

- **Adding a design** touches five places: an option in `sections.ts`, an entry in `previewImages.ts`, a ratio in `aspect.ts`, a `SPECS` row in the preview, and an `appliesTo` update on the corner groups if needed.
- **Tailwind arbitrary values must be literal strings** in the source, e.g. `'aspect-[1440/613]'`. Never build them by interpolation: Tailwind can't see the class, so it never exists.
- **Every `public/` path goes through `asset()`** from `src/lib/asset.ts`. It adds the Pages basePath and percent-encodes `=` and spaces in Figma filenames. Never rename the Figma SVGs.
- **Images are plain `<img>`**, not `next/image`.
- **Square corners need `rounded-none!`**, because `ImageBlock` brings its own `rounded-xs`.
- **Colours on previews come from CSS variables**, e.g. `var(--brand, #3f6b30)` and `--brand-soft`, `--brand-accent`. Don't pass colours as props. Use the `@theme` tokens for app chrome.
- **`SectionPreview` has two renderings.** `screenshot` shows the Figma SVG, used in choosers. Without it you get the wireframe, used on the assembled page. Thumbnails must be wrapped in `PreviewFrame decorative` (inert, aria-hidden).
- **Previews use real semantic markup:** landmarks, one `h1` in the hero, `h2` for sections, `h3` for cards, plus lists, `details`, `form` and `label`. Wireframe bars are `aria-hidden`.
- **Content conventions:** lists are one item per line and wrap to fill a grid; paired lists line up by index; `A · B` splits a pair within one line.
- **Size inside previews in `cqw`**, never px, so a preview scales from a thumbnail to full width.
- **Carousels only move in interactive mode** (`usePreviewMode`), and must respect `prefers-reduced-motion`.
- **Never call the model from the browser.** The API key has to stay server-side.

## Style

- Match the existing code: no semicolons, single quotes, 2-space indent, and the `@/` import alias.
- Comments explain *why* in full sentences, at the density of the surrounding code.
- UI copy uses British spelling ("colour", "centred").

## Git

- Work on `main`. Pushing to `main` deploys to GitHub Pages.
- Commit messages are one plain imperative sentence, matching `git log`.
- The author is `Levi271997`, and messages have no `Co-Authored-By` trailer.

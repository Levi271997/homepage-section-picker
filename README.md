# Homepage section picker

Next.js 15 (App Router) + Tailwind CSS v4 recreation of the "Your homepage, as we'd build it" card.

```bash
npm run dev     # http://localhost:3000
npm run build
```

Reading a client's existing site needs an API key in `.env.local` (git-ignored):

```
OPENAI_API_KEY=sk-proj-...
```

Without it every other feature works; the analyser reports that the key is missing and the previews stay as wireframes.

## Fonts

**Satoshi** carries the interface and body copy, **Recoleta** the headings. Both are design tokens — `--font-sans` and `--font-display` in `globals.css` — so either can be retargeted in one place, and `font-sans`/`font-display` work as Tailwind utilities.

Satoshi is free under the ITF Free Font Licence and is committed in `src/app/fonts/satoshi/` (400/500/700/900), loaded through `next/font/local` so it's hashed, preloaded and prefixed correctly for the Pages sub-path.

Recoleta is a licensed Latinotype font, so its files can't be committed. Its `@font-face` rules are already in place: buy a webfont licence and drop the woff2s into `public/fonts/recoleta/` (see the README there for the filenames) and headings pick it up with no code change. Until then they render in the serif fallback stack.

## Deploying to GitHub Pages

`.github/workflows/pages.yml` builds a static export on every push to `main` and publishes it to `https://ivelnaj.github.io/homepage-section-picker/`. Enable it once under **Settings → Pages → Source → GitHub Actions**.

Pages has no server, so that build drops `src/app/api` and hides the **Read my site** button — the picker, the previews and the live page all work, but the analyser doesn't. `next.config.mjs` only switches to `output: 'export'` when `NEXT_PUBLIC_STATIC_BUILD=true`, which nothing but the workflow sets, so local development is unaffected.

Never move the model call into the browser to work around this: the API key would ship inside the JavaScript bundle. A full deployment needs a host that runs Node (Vercel's free tier fits, with the key as an encrypted environment variable).

## What it does

- **Live page preview on the left.** The whole homepage is assembled from the current order and layout choices, so every pick on the right updates it immediately. The section being edited is ringed and scrolled into view; hovering any section names it. Each section gets a ratio roughly matching its real height (a header is 16:5, a full content block 16:10) so the stack reads like a page. It sticks to the top of the viewport on wide screens and drops above the card on narrow ones.
- **The finished page opens in its own window.** **Build my homepage** — and **New window** in the preview's chrome — open the assembled page on `/preview`, sized to the screen and running the full width of it, so it reads as the site rather than as a preview of one. It follows along: every change republishes, and the window re-renders. See [Two windows](#two-windows).
- **Reads the client's existing site.** The card asks for their current address up front — no yes/no question first, and blank means building from scratch. Enter it and **Read my site** pulls their brand colour, logo, navigation, hero copy and hero image into the live preview — their own content, in the layouts we propose. The contrast is the pitch, so copy is used verbatim and never rewritten. Anything we can't read falls back to the wireframe, section by section.
- **Every section carries editable content.** Opening a row gives **Layout** and **Content** tabs: layout arranges the section, content fills it. Each section declares its own fields — headings, body copy, button labels, list items, images — pre-filled with placeholder copy and locally generated placeholder artwork, so a page looks finished before anyone types anything. Images take a URL or a local file, and every section has a reset that restores its placeholders.
- Lists the suggested sections; `required` ones show a badge instead of buttons.
- **Drag to reorder** (native HTML5 drag events, no library). A blue line shows where it will land. Two flags govern a row: `required` hides its Swap/Remove buttons in favour of a badge, and `pinned` makes it an anchor that never moves and that nothing can be dropped onto — so the header and hero stay first and the footer stays last. The contact form is required but not pinned: it can't be removed, but it can still be dragged anywhere.
- Keyboard equivalent: focus a row's grip handle (<kbd>Tab</kbd>) and press <kbd>↑</kbd>/<kbd>↓</kbd>. Note that HTML5 drag events don't fire on touchscreens; the grip keys are the fallback there.
- Sections that declare `options` show a **live thumbnail of the chosen layout** in place of their icon, plus its name as a caption — so the current choice is visible without opening anything. **Change** expands the alternatives inline under that row (the list above and below stays put); the selected one is ringed and marked. Picking keeps the panel open so choices can be compared; **Done** collapses it.
- Options are grouped into independent **axes** (`OptionGroup`). A group renders either as preview cards (`display: 'cards'`) or a compact chip row (`display: 'chips'`), and every preview card renders its option combined with the section's *other* current choices. A group can declare `appliesTo(choice)` so axes the current layout doesn't use are hidden from both the picker and the caption — e.g. "Image on" disappears when the content section isn't a split layout. Sections configured so far:

  | Section | Axes |
  | --- | --- |
  | Site header | Structure (4) × Nav position (3) × Nav band (3) × Button (3) |
  | Hero | Design: the 23-strong V1…V28 set — see [Design sets](#design-sets) |
  | Logo strip | Design: the 3-strong V1…V3 set — see [Design sets](#design-sets) |
  | Content card | Design: the 22-strong V1…V22 set × Rows (3) — see [Design sets](#design-sets) |
  | Content section | Design: the 20-strong V1…V23 set — see [Design sets](#design-sets) |
  | Testimonials | Design: the 6-strong V1…V6 set — see [Design sets](#design-sets) |
  | Team members | Portrait (2) × Card (2) × Align (2) × Columns (2) |
  | FAQ accordion | Row style (3) × Layout (2) × Columns (2) × Header (2) × Questions (3) |
  | Stats | Stat (2) × Header (3) × Band (2) × Columns (2) |
  | Call to action | Layout (2) × Background (3) × Shape (2) × Image side (2) × Copy (3) × List (2) |
  | Pricing | Plan card (3) × Ticks (2) × Card (2) × Best plan (3) |
  | Blogs | Card content (3) × Card (2) × Header (3) × Rows (3) × Load more (2) |
  | Contact form | Layout (3) × Form side (2) × Copy list (2) × Fields (3) |
  | Site footer | Layout (4) × Bar contents (4) × Columns (3) × Sign-up (2) |
- **Swap** opens a picker of every other optional section, each shown with its own preview thumbnail and caption. If the section picked isn't on the page, the row becomes it; if it already is, the two rows **trade places** (tagged as such in the menu) rather than duplicating.
- **Remove** drops the row; the footer count and the "…" menu update accordingly. Removed sections reappear under "Add a section", still previewing the layout they were last given.
- The "…" menu adds a section back (inserted above the pinned rows that close the page) or resets to the audit's suggestion.
- Clicking outside the card or pressing <kbd>Esc</kbd> closes any open menu.

## Layout

| Path | Purpose |
| --- | --- |
| [src/lib/sections.ts](src/lib/sections.ts) | The approved sections, their option groups, and the suggested default order |
| [src/components/SectionPicker.tsx](src/components/SectionPicker.tsx) | Two-column shell, state, swap/add/remove logic |
| [src/components/PagePreview.tsx](src/components/PagePreview.tsx) | The assembled page on the left, in browser chrome |
| [src/components/PageBody.tsx](src/components/PageBody.tsx) | The page behaving like a website — shared by the full-screen view and the second window |
| [src/app/preview/page.tsx](src/app/preview/page.tsx) | The page on its own, for a second window or screen |
| [src/lib/share.ts](src/lib/share.ts) | Hands the page between windows through `localStorage` |
| [src/components/SectionRow.tsx](src/components/SectionRow.tsx) | One row: icon, label, badge or buttons |
| [src/components/SectionMenu.tsx](src/components/SectionMenu.tsx) | Overlay list used by both swap and add |
| [src/components/OptionPicker.tsx](src/components/OptionPicker.tsx) | Inline radiogroups — preview cards and chip rows — for a section's option axes |
| [src/components/previews/](src/components/previews/) | Miniature page wireframes — shared `parts.tsx`, one file per section, dispatched by `SectionPreview.tsx` |
| [src/components/icons.tsx](src/components/icons.tsx) | Inline SVG icon set (no icon dependency) |
| [src/app/api/analyze/route.ts](src/app/api/analyze/route.ts) | `POST { url }` → `SiteProfile`; fetches the page, then asks the model for the judgement calls |
| [src/lib/extractPage.ts](src/lib/extractPage.ts) | Deterministic half: fetch, strip, and pull out titles, icons, images and candidate colours |
| [src/lib/siteProfile.ts](src/lib/siteProfile.ts) | The `SiteProfile` shape plus the guards that keep model output honest |
| [src/lib/content.ts](src/lib/content.ts) | Per-section content fields, their placeholder copy, and the list helpers |
| [src/lib/placeholder.ts](src/lib/placeholder.ts) | Placeholder artwork, generated as SVG data URIs — nothing is fetched |
| [src/lib/previewImages.ts](src/lib/previewImages.ts) | Maps a chosen design to its artwork under `public/design-sets/` |
| [src/lib/asset.ts](src/lib/asset.ts) | URLs for our own files in `public/` — basePath and percent-encoding |
| [src/components/ContentEditor.tsx](src/components/ContentEditor.tsx) | The Content tab: one input per field, image URL or upload, reset |
| [src/app/globals.css](src/app/globals.css) | Theme colors as Tailwind v4 `@theme` tokens |

Colors live entirely in the `@theme` block — `--color-row`, `--color-go`, etc. — so restyling means editing that one block.

## Two windows

The editing view keeps the shape it always had — preview left, picker right — and the finished page lives in a second window at `/preview`. **Build my homepage** opens it; so does **New window** in the preview's chrome. Both reuse one named window, so clicking again brings the existing one forward rather than opening a second.

That window runs the page at the full width of the screen, where the in-app view caps it at a page-width column (`PageBody`'s `width` prop). Everything inside a section is sized in `cqw`, so the wider column scales the whole page rather than reflowing it.

Pop-up blockers are common enough that **Build my homepage** checks: if the window is refused, it falls back to the full-screen in-app view, so the button always does something.

The picker's state lives in React, which another window can't reach, so the editing window publishes the page to `localStorage` on every change and the second window reads it and listens for `storage` events. That event fires in every *other* document on the origin, which is the direction needed here: the window doing the editing doesn't need telling what it just did. Publishing happens on every change rather than only while a window is open, so one opened later starts on the current state instead of an empty page.

Both the window and the in-app fallback render through the same [PageBody](src/components/PageBody.tsx), so they can't drift apart. It also carries the `page-view` class the behaving-like-a-website rules in `globals.css` hang off — hover states, the nav underline, keeping dropdowns shut until they're pointed at — so neither caller can render the page without them.

The one failure worth knowing about: uploaded images are stored as data URIs, and a few large ones will exhaust the storage quota. [share.ts](src/lib/share.ts) reports that rather than throwing, and the picker says so under the preview — otherwise a second window would sit frozen on old content with nothing to explain why.

## Markup

The previews are written as documents, not as drawings. Each section returns a real landmark — `<header>`, `<section>`, `<footer>` — with a heading outline under it: the hero carries the page's one `<h1>`, section headings are `<h2>`, and card and column titles are `<h3>`. Card grids, tick lists, nav, footer columns and pricing features are `<ul>`/`<li>`; blog cards are `<article>` with a `<time>`; testimonials are `<figure>`/`<blockquote>`/`<cite>`; the FAQ is `<details>`/`<summary>`, so it actually opens rather than miming it; forms are `<form>` with `<label>`-attached inputs; buttons are `<button>` and links are `<a>`.

Two rules keep that from causing trouble:

**A wireframe bar is not content.** Where a field has no words yet the preview draws a grey bar. Those are `aria-hidden`, because a heading with no text or a button with no name is a drawing of one — there is nothing to announce.

**A picture of a page is not a page.** The same components render at 64px in a row thumbnail and across the picker cards, where a dozen `<h1>`s and a tab stop for every button would wreck the editing screen. `PreviewFrame` takes a `decorative` prop that sets `inert` and `aria-hidden` on the whole subtree, and the thumbnail, menu, card and sidebar callers all pass it. Only [PageBody](src/components/PageBody.tsx) — the assembled page — renders without it.

The effect, measured in the browser: the editor page exposes no stray headings at all (59 headings and buttons sit inside `inert` subtrees) and only its own 50 controls are reachable by keyboard, while the page itself comes out with one `h1`, ten `h2`s, thirteen `h3`s, header/nav/section/footer landmarks, 13 lists, 3 articles, 3 blockquotes and 6 labelled inputs.

Preflight strips the browser's default heading and list styling, so the tags are structural only — changing a heading level never changes how a preview looks. Links point at a placeholder `#`; `PageBody` swallows the click so the page doesn't jump.

## Design sets

`public/design-sets/` holds the artwork exported from Figma, keeping the names it exported them with — `section-cogs/hero/Type=Hero V1.svg` and so on. Five sections are wired to their sets, and each lists the drawn designs on a `design` axis rather than the combinable axes the rest still use, because a design set is a fixed set and listing it verbatim keeps the picker and the design file describing the same thing:

- **Hero** — the 23 drawn heroes (V1…V8, V13…V26, V28).
- **Content cards** — 22 designs (V1…V22) × the rows axis, since the file draws each one at 1, 2 and 3 rows. Both axes are read together, so all 66 combinations have artwork behind them.
- **Content section** — 20 designs (V1…V10, V13, V15…V23; V11, V12 and V14 were never drawn). Exported under `Style=` rather than `Type=`, so that prefix differs on purpose.
- **Testimonials** — the six drawn designs (V1…V6).
- **Logo strip** — three designs (V1…V3). Figma pluralised this one: the folder and the files both read "Logo Strips".

Each design appears twice over, and the two are not the same picture:

- **Choosing one** — the picker cards, the row thumbnail, the swap and add menus — shows the exported SVG. That's the finished design, at full fidelity.
- **The assembled page** shows a wireframe rebuilt from the same design — [HeroPreview.tsx](src/components/previews/HeroPreview.tsx), [ContentCardPreview.tsx](src/components/previews/ContentCardPreview.tsx), [ContentSectionPreview.tsx](src/components/previews/ContentSectionPreview.tsx), [TestimonialsPreview.tsx](src/components/previews/TestimonialsPreview.tsx), [LogoStripPreview.tsx](src/components/previews/LogoStripPreview.tsx). Only the wireframe fills with the client's own colour, logo, copy and photography, and that contrast is the pitch; the SVG is fixed lorem ipsum with a green button.

`SectionPreview`'s `screenshot` prop is what separates the two, so a caller picks a side rather than the artwork leaking onto the page.

Each set is variations on a handful of frames, so every rebuilt preview describes its designs in a `SPECS` table and renders from that — the heroes over three frames (copy beside media, copy above media, copy over a full-width image), the cards over one grid, the content sections over four, the testimonials over three (a grid of quote cards, one quote paged by arrows, a portrait beside each quote), the logo strips over one row of six. A newly exported design is usually one row in that table, one entry in [previewImages.ts](src/lib/previewImages.ts), one option in the section's groups, and its artboard ratio in [aspect.ts](src/components/previews/aspect.ts) so the page stands it at the height it was drawn at. Those ratios are written out as whole class names rather than built from the numbers: Tailwind only generates an arbitrary value it can read literally in the source, so an `aspect-[1440/${n}]` would name a class that never exists.

Two details the artwork settles, and the wireframes follow: the card and column links are drawn in the same warm ink as the labels (#563F3D), not green — the set keeps its greens for buttons, ticks and numerals; and a square-cornered image needs `rounded-none!`, because `ImageBlock` brings its own `rounded-xs` and Tailwind emits the radius utilities alphabetically, so plain `rounded-none` lands earlier in the stylesheet and loses whatever the class order says.

Paths into `public/` go through [asset.ts](src/lib/asset.ts) rather than being written inline. Every image here renders through a plain `<img>` (see `parts.tsx`), so nothing else would apply the Pages `basePath`, and the Figma names need percent-encoding — Next serves `Type%3DHero%20V1.svg` but 404s on `Type=Hero%20V1.svg`, which `encodeURI` alone would leave as-is.

## How content works

A section's `Choice` says how it is arranged; its `SectionContent` says what it contains. Both are flat string maps, which keeps them easy to store, prefill and reset.

Three conventions run through every section:

- **Lists are one item per line**, and they **wrap**. Four card titles in a six-card grid fill all six by cycling, rather than leaving two blanks — so a client can type three services without the layout looking broken.
- **Paired lists line up by position.** Quotes with names and roles, plans with prices, names with job titles.
- **A `·` separates a pair inside one line** — `200+ · Projects delivered` for a figure and its label, `Insights · 12 March` for a category and date. One rule rather than a convention per section.

Repeated blocks share a single body field rather than exposing one per card. Nine textareas for a nine-card grid would bury the editor, and at preview scale the repetition reads correctly as a layout.

Everything degrades field by field: clear a field and that element goes back to its wireframe bar while the rest of the section keeps its content.

## How the site analysis is split

A parser does the extraction and the model does the judging. `extractPage.ts` finds what a regex can find reliably — `<title>`, meta tags, icon links, `<img>` sources, every hex colour and its frequency, and the visible text with tags stripped. The model then answers only the questions that need judgement: which candidate colour is *the* brand colour, which heading is the hero, which image is the hero image, what the nav labels are.

The model call is confined to the route handler, so swapping providers touches one file — everything either side of it is provider-agnostic.

**Brand colour reaches every section through CSS variables, not props.** Each preview draws its greens from `var(--brand, #3f6b30)` and friends, and `brandVariables()` declares those on the shell once the site has been read — so all fourteen sections, the row thumbnails and the picker cards recolour together. The tints (`--brand-band`, `--brand-figure`, `--brand-dim`, `--brand-soft`) are mixed from the single colour the analyser is confident about, via `color-mix()`. With no site analysed the variables are absent and every fallback is the template's own palette, so nothing changes.

Two rules keep the output trustworthy:

- **URLs are picked from candidates, never generated.** The route re-checks every URL the model returns against the list it was given, so a hallucinated address can't reach an `<img>` tag.
- **Copy is verbatim.** The model is told not to rewrite, improve or summarise — a client has to recognise their own words for the comparison to land.

Failures are not error states: an unreachable site, a missing key, or a field the model wasn't sure about all resolve to `null`, and the affected preview simply draws its wireframe. Only the large left-hand preview receives real content — at 64 px a row thumbnail would render real text as illegible mush, so those stay abstract.

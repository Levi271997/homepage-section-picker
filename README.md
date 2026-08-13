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

## What it does

- **Live page preview on the left.** The whole homepage is assembled from the current order and layout choices, so every pick on the right updates it immediately. The section being edited is ringed and scrolled into view; hovering any section names it. Each section gets a ratio roughly matching its real height (a header is 16:5, a full content block 16:10) so the stack reads like a page. It sticks to the top of the viewport on wide screens and drops above the card on narrow ones.
- **Reads the client's existing site.** Answer "yes" to the existing-website question, enter the address, and **Read my site** pulls their brand colour, logo, navigation, hero copy and hero image into the live preview — their own content, in the layouts we propose. The contrast is the pitch, so copy is used verbatim and never rewritten. Anything we can't read falls back to the wireframe, section by section.
- Lists the suggested sections; `required` ones show a badge instead of buttons.
- **Drag to reorder** (native HTML5 drag events, no library). A blue line shows where it will land. Two flags govern a row: `required` hides its Swap/Remove buttons in favour of a badge, and `pinned` makes it an anchor that never moves and that nothing can be dropped onto — so the header and hero stay first and the footer stays last. The contact form is required but not pinned: it can't be removed, but it can still be dragged anywhere.
- Keyboard equivalent: focus a row's grip handle (<kbd>Tab</kbd>) and press <kbd>↑</kbd>/<kbd>↓</kbd>. Note that HTML5 drag events don't fire on touchscreens; the grip keys are the fallback there.
- Sections that declare `options` show a **live thumbnail of the chosen layout** in place of their icon, plus its name as a caption — so the current choice is visible without opening anything. **Change** expands the alternatives inline under that row (the list above and below stays put); the selected one is ringed and marked. Picking keeps the panel open so choices can be compared; **Done** collapses it.
- Options are grouped into independent **axes** (`OptionGroup`). A group renders either as preview cards (`display: 'cards'`) or a compact chip row (`display: 'chips'`), and every preview card renders its option combined with the section's *other* current choices. A group can declare `appliesTo(choice)` so axes the current layout doesn't use are hidden from both the picker and the caption — e.g. "Image on" disappears when the content section isn't a split layout. Sections configured so far:

  | Section | Axes |
  | --- | --- |
  | Site header | Structure (4) × Nav position (3) × Nav band (3) × Button (3) |
  | Hero | Layout: centred / image left / image right |
  | Logo strip | Layout: carousel / headed grid / headed carousel |
  | Content card | Card style (9) × Header (2) × Rows (3) |
  | Content section | Layout (8) × Image side (2) × Image (2) × Header (2) × Items (3) |
  | Testimonials | Layout (3) × Mark (2) × Card (3) × Header (2) × Rows (2) |
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
| [src/components/SectionRow.tsx](src/components/SectionRow.tsx) | One row: icon, label, badge or buttons |
| [src/components/SectionMenu.tsx](src/components/SectionMenu.tsx) | Overlay list used by both swap and add |
| [src/components/OptionPicker.tsx](src/components/OptionPicker.tsx) | Inline radiogroups — preview cards and chip rows — for a section's option axes |
| [src/components/previews/](src/components/previews/) | Miniature page wireframes — shared `parts.tsx`, one file per section, dispatched by `SectionPreview.tsx` |
| [src/components/icons.tsx](src/components/icons.tsx) | Inline SVG icon set (no icon dependency) |
| [src/app/api/analyze/route.ts](src/app/api/analyze/route.ts) | `POST { url }` → `SiteProfile`; fetches the page, then asks the model for the judgement calls |
| [src/lib/extractPage.ts](src/lib/extractPage.ts) | Deterministic half: fetch, strip, and pull out titles, icons, images and candidate colours |
| [src/lib/siteProfile.ts](src/lib/siteProfile.ts) | The `SiteProfile` shape plus the guards that keep model output honest |
| [src/app/globals.css](src/app/globals.css) | Theme colors as Tailwind v4 `@theme` tokens |

Colors live entirely in the `@theme` block — `--color-row`, `--color-go`, etc. — so restyling means editing that one block.

## How the site analysis is split

A parser does the extraction and the model does the judging. `extractPage.ts` finds what a regex can find reliably — `<title>`, meta tags, icon links, `<img>` sources, every hex colour and its frequency, and the visible text with tags stripped. The model then answers only the questions that need judgement: which candidate colour is *the* brand colour, which heading is the hero, which image is the hero image, what the nav labels are.

The model call is confined to the route handler, so swapping providers touches one file — everything either side of it is provider-agnostic.

Two rules keep the output trustworthy:

- **URLs are picked from candidates, never generated.** The route re-checks every URL the model returns against the list it was given, so a hallucinated address can't reach an `<img>` tag.
- **Copy is verbatim.** The model is told not to rewrite, improve or summarise — a client has to recognise their own words for the comparison to land.

Failures are not error states: an unreachable site, a missing key, or a field the model wasn't sure about all resolve to `null`, and the affected preview simply draws its wireframe. Only the large left-hand preview receives real content — at 64 px a row thumbnail would render real text as illegible mush, so those stay abstract.

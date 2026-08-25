import { byId } from '@/lib/sections'
import { asset } from '@/lib/asset'
import type { Choice } from '@/lib/sections'

/**
 * Real design artwork, shown in place of the drawn wireframe.
 *
 * Keyed by section id, then by the option the artwork illustrates — that's the
 * selected value of the section's first `cards` group, since that's the axis
 * that changes the layout wholesale. A `default` key covers a section whose
 * artwork doesn't vary.
 *
 * These stand in only where a design is being *chosen* — picker cards, row
 * thumbnails, the swap and add menus. The assembled page keeps the wireframe,
 * because the wireframe is what fills with the client's own colour, logo and
 * copy; the artwork here is fixed lorem ipsum. `SectionPreview` decides which
 * of the two applies, via its `screenshot` prop.
 *
 * Files live under `public/design-sets/`, keeping the names Figma exported
 * them with. `asset()` handles the spaces and the Pages basePath.
 */
const HERO = (v: string) => asset(`/design-sets/section-cogs/hero/Type=Hero ${v}.svg`)

const CARDS = (v: string, rows: string) =>
  asset(`/design-sets/section-cogs/content card/Type=Content Cards ${v}, Rows=${rows}.svg`)

// This set was exported under `Style=` rather than `Type=`; the names are kept
// exactly as Figma wrote them, so the prefix differs here on purpose.
const SECTION = (v: string) => asset(`/design-sets/section-cogs/content section/Style=Content Section ${v}.svg`)

const QUOTES = (v: string) => asset(`/design-sets/section-cogs/testimonials/Type=Testimonials ${v}.svg`)

// Figma pluralised this one — the folder and the files both read "Logo Strips".
const LOGOS = (v: string) => asset(`/design-sets/section-cogs/logo strips/Type=Logo Strips ${v}.svg`)

// Lower-case "members", as Figma wrote it.
const TEAM = (v: string) => asset(`/design-sets/section-cogs/team members/Type=Team members ${v}.svg`)

const STATS = (v: string) => asset(`/design-sets/section-cogs/stats/Type=Stats ${v}.svg`)

const PRICING = (v: string) => asset(`/design-sets/section-cogs/pricing/Type=Pricing ${v}.svg`)

const BLOGS = (v: string) => asset(`/design-sets/section-cogs/blogs/Type=Blogs ${v}.svg`)

/**
 * The artwork for one option: a file, or a function of the whole choice where
 * a second axis picks between several drawings of the same design — the content
 * cards are exported once per row count, so both axes have to be read.
 */
type Artwork = string | ((choice: Choice) => string)

export const PREVIEW_IMAGES: Record<string, Record<string, Artwork>> = {
  'hero-logo': {
    v1: HERO('V1'),
    v2: HERO('V2'),
    v3: HERO('V3'),
    v4: HERO('V4'),
    v5: HERO('V5'),
    v6: HERO('V6'),
    v7: HERO('V7'),
    v8: HERO('V8'),
    v13: HERO('V13'),
    v14: HERO('V14'),
    v15: HERO('V15'),
    v16: HERO('V16'),
    v17: HERO('V17'),
    v18: HERO('V18'),
    v19: HERO('V19'),
    v20: HERO('V20'),
    v21: HERO('V21'),
    v22: HERO('V22'),
    v23: HERO('V23'),
    v24: HERO('V24'),
    v25: HERO('V25'),
    v26: HERO('V26'),
    v28: HERO('V28'),
  },

  // Drawn once per row count, so each entry reads the rows axis back out of the
  // choice. Rows only ever holds '1', '2' or '3' — the axis that sets it lists
  // no other option — so every combination resolves to a file that exists.
  'content-card': Object.fromEntries(
    Array.from({ length: 22 }, (_, i) => [`v${i + 1}`, (choice: Choice) => CARDS(`V${i + 1}`, choice.rows ?? '1')]),
  ),

  // V11, V12 and V14 were never drawn, so the set skips them.
  'content-section': Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((v) => [`v${v}`, SECTION(`V${v}`)]),
  ),

  'client-quote': Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`v${i + 1}`, QUOTES(`V${i + 1}`)])),

  'logo-strip': Object.fromEntries(Array.from({ length: 3 }, (_, i) => [`v${i + 1}`, LOGOS(`V${i + 1}`)])),

  'about-team': Object.fromEntries(Array.from({ length: 3 }, (_, i) => [`v${i + 1}`, TEAM(`V${i + 1}`)])),

  stats: Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`v${i + 1}`, STATS(`V${i + 1}`)])),

  pricing: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`v${i + 1}`, PRICING(`V${i + 1}`)])),

  blogs: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`v${i + 1}`, BLOGS(`V${i + 1}`)])),
}

/** The artwork for this choice, or null to draw the wireframe instead. */
export function imageFor(sectionId: string, choice: Choice): string | null {
  const byOption = PREVIEW_IMAGES[sectionId]
  if (!byOption) return null

  const primary = byId(sectionId).options?.find((group) => group.display === 'cards')
  const key = primary ? choice[primary.id] : undefined
  const artwork = (key ? byOption[key] : undefined) ?? byOption.default
  if (!artwork) return null
  return typeof artwork === 'function' ? artwork(choice) : artwork
}

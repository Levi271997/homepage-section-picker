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

export const PREVIEW_IMAGES: Record<string, Record<string, string>> = {
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
}

/** The artwork for this choice, or null to draw the wireframe instead. */
export function imageFor(sectionId: string, choice: Choice): string | null {
  const byOption = PREVIEW_IMAGES[sectionId]
  if (!byOption) return null

  const primary = byId(sectionId).options?.find((group) => group.display === 'cards')
  const key = primary ? choice[primary.id] : undefined
  return (key ? byOption[key] : undefined) ?? byOption.default ?? null
}

import { byId } from '@/lib/sections'
import type { Choice } from '@/lib/sections'

/**
 * Real template screenshots, replacing the drawn wireframe for a section.
 *
 * Keyed by section id, then by the option the screenshot illustrates — that's
 * the selected value of the section's first `cards` group, since that's the
 * axis that changes the layout wholesale. A `default` key covers a section
 * whose screenshot doesn't vary.
 *
 * Files live in `public/previews/<section-id>/`, so a path here is
 * `/previews/<section-id>/<file>`. Anything not listed falls back to the
 * wireframe, so this can be filled in one section at a time.
 */
export const PREVIEW_IMAGES: Record<string, Record<string, string>> = {
  // 'content-card': {
  //   plain: '/previews/content-card/plain.png',
  //   bordered: '/previews/content-card/bordered.png',
  // },
}

/** The screenshot for this choice, or null to draw the wireframe instead. */
export function imageFor(sectionId: string, choice: Choice): string | null {
  const byOption = PREVIEW_IMAGES[sectionId]
  if (!byOption) return null

  const primary = byId(sectionId).options?.find((group) => group.display === 'cards')
  const key = primary ? choice[primary.id] : undefined
  return (key ? byOption[key] : undefined) ?? byOption.default ?? null
}

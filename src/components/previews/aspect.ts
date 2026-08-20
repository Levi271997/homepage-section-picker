import type { Choice } from '@/lib/sections'

/**
 * Roughly how tall each section stands relative to its width.
 *
 * Shared by the sidebar preview and the full-page view so the two can't drift:
 * everything inside a preview is sized in `cqw`, so the same ratio scales from a
 * 700px column to a 1200px page without any other change.
 */
/**
 * Hero heights, taken from the artboards the designs were exported at — all
 * 1440 wide, so the second number is the only thing that varies. A design not
 * listed here falls back to the shape of the plain split hero.
 */
const HERO_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/613]',
  v2: 'aspect-[1440/613]',
  v3: 'aspect-[1440/1005]',
  v4: 'aspect-[1440/1125]',
  v5: 'aspect-[1440/1125]',
  v6: 'aspect-[1440/643]',
  v7: 'aspect-[1440/643]',
  v8: 'aspect-[1440/1050]',
  v13: 'aspect-[1440/613]',
  v14: 'aspect-[1440/613]',
  v15: 'aspect-[1440/613]',
  v16: 'aspect-[1440/613]',
  v17: 'aspect-[1440/613]',
  v18: 'aspect-[1440/648]',
  v19: 'aspect-[1440/652]',
  v20: 'aspect-[1440/652]',
  v21: 'aspect-[1440/1081]',
  v22: 'aspect-[1440/892]',
  v23: 'aspect-[1440/768]',
  v24: 'aspect-[1440/768]',
  v25: 'aspect-[1440/526]',
  v26: 'aspect-[1440/542]',
  v28: 'aspect-[1440/648]',
}

export function aspectFor(id: string, choice: Choice): string {
  switch (id) {
    case 'hero-logo':
      return HERO_RATIOS[choice.design] ?? 'aspect-[1440/613]'
    case 'site-header':
      // A single bar is a thin strip; the two-tier and stacked ones need room.
      return choice.structure === 'single' ? 'aspect-16/3' : 'aspect-16/5'
    case 'logo-strip':
      return choice.layout === 'carousel' ? 'aspect-16/4' : 'aspect-16/7'
    case 'stats':
      return choice.header === 'none' ? 'aspect-16/5' : 'aspect-16/9'
    case 'cta':
      return choice.layout === 'banner' ? 'aspect-16/6' : 'aspect-16/9'
    case 'site-footer':
      // A legal bar or a lone logo is a strip; link columns need the height.
      return choice.layout === 'bar' || choice.layout === 'logo-only' ? 'aspect-16/3' : 'aspect-16/7'
    default:
      return 'aspect-16/10'
  }
}

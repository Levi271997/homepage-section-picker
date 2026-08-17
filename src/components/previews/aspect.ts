import type { Choice } from '@/lib/sections'

/**
 * Roughly how tall each section stands relative to its width.
 *
 * Shared by the sidebar preview and the full-page view so the two can't drift:
 * everything inside a preview is sized in `cqw`, so the same ratio scales from a
 * 700px column to a 1200px page without any other change.
 */
export function aspectFor(id: string, choice: Choice): string {
  switch (id) {
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

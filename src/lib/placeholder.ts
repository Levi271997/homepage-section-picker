/**
 * Placeholder artwork, generated locally as SVG data URIs.
 *
 * Nothing is fetched: a preview must render identically offline, in the static
 * GitHub Pages build, and in a client meeting on bad hotel wifi. Each shape is
 * a soft neutral panel with a mountain-and-sun glyph, so a page of them reads
 * as "photo goes here" rather than as broken images.
 */

type Shape = 'landscape' | 'portrait' | 'square' | 'wide' | 'logo'

const SIZES: Record<Shape, [number, number]> = {
  landscape: [640, 400],
  portrait: [480, 640],
  square: [480, 480],
  wide: [1200, 420],
  logo: [120, 56],
}

/**
 * Neutrals that sit behind the previews without competing with brand colour.
 *
 * More than one because a slideshow of placeholders has to look like it is
 * moving. Anywhere a single placeholder is asked for it is the first of these,
 * so nothing that only ever shows one picture changes.
 */
const TONES: [panel: string, glyph: string][] = [
  ['#eceae7', '#c3bdb6'],
  ['#e6e8ea', '#bcc1c6'],
  ['#ece9e4', '#c6bdaf'],
  ['#e5e9e6', '#b8c3bb'],
]

/**
 * The logo placeholder: the word "Logo" and nothing behind it, so it sits on
 * whatever the header or footer is filled with. Pinned to its box with
 * `textLength`, because the font is whatever the viewer's system substitutes
 * and an unpinned word could run past the edge.
 */
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="56" viewBox="0 0 120 56"><text x="0" y="43" textLength="116" lengthAdjust="spacingAndGlyphs" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#2b2421">Logo</text></svg>`

function svg(shape: Shape, tone: number): string {
  if (shape === 'logo') return LOGO_SVG
  const [PANEL, GLYPH] = TONES[tone % TONES.length]
  const [w, h] = SIZES[shape]

  // The glyph is drawn relative to the shorter edge so it stays centred and
  // proportional whatever the aspect ratio.
  const unit = Math.min(w, h)
  const cx = w / 2
  const cy = h / 2
  const s = unit * 0.22

  const body = `<circle cx="${cx + s * 0.55}" cy="${cy - s * 0.5}" r="${s * 0.28}" fill="${GLYPH}"/>
         <path d="M ${cx - s} ${cy + s * 0.7} L ${cx - s * 0.25} ${cy - s * 0.15} L ${cx + s * 0.35} ${cy + s * 0.45} L ${cx + s * 0.7} ${cy + s * 0.1} L ${cx + s * 1.1} ${cy + s * 0.7} Z" fill="${GLYPH}"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${PANEL}"/>${body}</svg>`
}

/**
 * Data URI for the given shape. Encoded, not base64 — smaller and readable in
 * devtools. `tone` picks one of the neutrals, for the places that show several
 * placeholders at once and need them telling apart.
 */
export const placeholderImage = (shape: Shape = 'landscape', tone = 0): string =>
  `data:image/svg+xml,${encodeURIComponent(svg(shape, tone).replace(/\s+/g, ' ').trim())}`

/** True when the value is one of ours, so previews can style it differently if needed. */
export const isPlaceholder = (src: string | null | undefined): boolean =>
  typeof src === 'string' && src.startsWith('data:image/svg+xml,')

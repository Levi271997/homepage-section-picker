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
  logo: [320, 96],
}

/** A neutral that sits behind the previews without competing with brand colour. */
const PANEL = '#eceae7'
const GLYPH = '#c3bdb6'

function svg(shape: Shape): string {
  const [w, h] = SIZES[shape]

  // The glyph is drawn relative to the shorter edge so it stays centred and
  // proportional whatever the aspect ratio.
  const unit = Math.min(w, h)
  const cx = w / 2
  const cy = h / 2
  const s = unit * 0.22

  const body =
    shape === 'logo'
      ? `<rect x="${cx - s * 1.6}" y="${cy - s * 0.35}" width="${s * 3.2}" height="${s * 0.7}" rx="${s * 0.14}" fill="${GLYPH}"/>`
      : `<circle cx="${cx + s * 0.55}" cy="${cy - s * 0.5}" r="${s * 0.28}" fill="${GLYPH}"/>
         <path d="M ${cx - s} ${cy + s * 0.7} L ${cx - s * 0.25} ${cy - s * 0.15} L ${cx + s * 0.35} ${cy + s * 0.45} L ${cx + s * 0.7} ${cy + s * 0.1} L ${cx + s * 1.1} ${cy + s * 0.7} Z" fill="${GLYPH}"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${PANEL}"/>${body}</svg>`
}

/** Data URI for the given shape. Encoded, not base64 — smaller and readable in devtools. */
export const placeholderImage = (shape: Shape = 'landscape'): string =>
  `data:image/svg+xml,${encodeURIComponent(svg(shape).replace(/\s+/g, ' ').trim())}`

/** True when the value is one of ours, so previews can style it differently if needed. */
export const isPlaceholder = (src: string | null | undefined): boolean =>
  typeof src === 'string' && src.startsWith('data:image/svg+xml,')

import { urlOrNull } from '@/lib/siteProfile'

/**
 * Deterministic half of the site analysis: fetch the page and pull out the
 * things a parser can find reliably — title, meta tags, icons, images and
 * candidate brand colours. Judgement (which colour is *the* brand colour,
 * which heading is the hero) is left to the model.
 */

export type PageSignals = {
  finalUrl: string
  title: string | null
  description: string | null
  siteName: string | null
  /** Colours the page declares, most frequent first, greys removed. */
  colors: string[]
  /** Icon and logo-ish image URLs, best guess first. */
  logos: string[]
  /** Content images, largest-looking first. */
  images: string[]
  /** Visible text, tags stripped and whitespace collapsed. */
  text: string
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

/** Fetches the page as a browser would, with a hard timeout. */
export async function fetchPage(url: string): Promise<{ html: string; finalUrl: string }> {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(15_000),
    headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
  })

  if (!response.ok) throw new Error(`The site returned ${response.status} ${response.statusText}.`)

  const type = response.headers.get('content-type') ?? ''
  if (!type.includes('html')) throw new Error(`That address returned ${type || 'a non-HTML file'}.`)

  return { html: await response.text(), finalUrl: response.url || url }
}

/** All matches of a capturing regex, deduped in document order. */
const allMatches = (html: string, pattern: RegExp): string[] => {
  const found = new Set<string>()
  for (const match of html.matchAll(pattern)) if (match[1]) found.add(match[1])
  return [...found]
}

/** `<meta name|property="key" content="...">`, either attribute order. */
function meta(html: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`<meta[^>]+(?:name|property)=["']${escaped}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${escaped}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]?.trim()) return decodeEntities(match[1].trim())
  }
  return null
}

/** Expands #abc to #aabbcc and drops the alpha channel. */
const normalizeHex = (hex: string): string | null => {
  const value = hex.slice(1).toLowerCase()
  if (value.length === 3) return `#${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`
  if (value.length === 6 || value.length === 8) return `#${value.slice(0, 6)}`
  return null
}

/** Near-white, near-black and unsaturated greys aren't brand colours. */
function isBrandish(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max > 240 && min > 240) return false // white-ish
  if (max < 24) return false // black-ish
  return max - min > 24 // has some saturation
}

/** Brand-colour candidates, most used first. */
function extractColors(html: string): string[] {
  const counts = new Map<string, number>()
  for (const match of html.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    const hex = normalizeHex(match[0])
    if (!hex || !isBrandish(hex)) continue
    counts.set(hex, (counts.get(hex) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([hex]) => hex)
}

/** The handful of entities that actually show up in headings and titles. */
const decodeEntities = (value: string): string =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&rsquo;|&lsquo;|&apos;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    // Ampersand last, so "&amp;quot;" can't decode twice into a stray quote.
    .replace(/&amp;/g, '&')

/** Strips scripts, styles and tags, leaving readable page text. */
function extractText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      // Keep block boundaries so headings don't run into body copy.
      .replace(/<\/(h[1-6]|p|div|li|section|header|footer|br)>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim()
}

export function extractSignals(html: string, finalUrl: string): PageSignals {
  const absolute = (value: string) => urlOrNull(value, finalUrl)

  const icons = allMatches(html, /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/gi)
  const ogImage = meta(html, 'og:image')
  // Images whose path or alt text mentions "logo" are the best logo guess.
  const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])
  const srcOf = (tag: string) => tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? null
  const looksLikeLogo = (tag: string) => /logo|brand|wordmark/i.test(tag)

  const logos = [
    ...imgTags.filter(looksLikeLogo).map(srcOf),
    ...icons,
  ]
    .map((value) => (value ? absolute(value) : null))
    .filter((value): value is string => Boolean(value))

  const images = [ogImage, ...imgTags.filter((tag) => !looksLikeLogo(tag)).map(srcOf)]
    .map((value) => (value ? absolute(value) : null))
    .filter((value): value is string => Boolean(value))
    // Sprites, tracking pixels and data URIs are never hero images.
    .filter((value) => !/\.svg($|\?)/i.test(value))
    .slice(0, 12)

  const themeColor = meta(html, 'theme-color')

  return {
    finalUrl,
    title: (() => {
      const raw = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()
      return raw ? decodeEntities(raw) : null
    })(),
    description: meta(html, 'description') ?? meta(html, 'og:description'),
    siteName: meta(html, 'og:site_name'),
    colors: [...new Set([...(themeColor ? [themeColor] : []), ...extractColors(html)])],
    logos: [...new Set(logos)].slice(0, 6),
    images: [...new Set(images)],
    // 24k characters is comfortably inside one Claude request and covers a homepage.
    text: extractText(html).slice(0, 24_000),
  }
}

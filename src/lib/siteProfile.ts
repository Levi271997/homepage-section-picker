/**
 * What we learn from a client's existing website, and feed back into the
 * previews so they see their own content in the layouts we propose.
 *
 * Everything is optional: a site we couldn't read, or a field the model
 * wasn't confident about, leaves the preview drawing its wireframe.
 */
export type SiteProfile = {
  /** The address we analysed, normalised. */
  url: string
  brand: {
    /** The business name as it appears on the site. */
    name: string | null
    /** Brand colour, as a hex string. Drives buttons, eyebrows and accents. */
    primary: string | null
    /** Secondary/accent colour, where the site clearly has one. */
    accent: string | null
    /** Absolute URL of the logo, if we found one. */
    logoUrl: string | null
  }
  nav: string[]
  hero: {
    eyebrow: string | null
    headline: string | null
    subcopy: string | null
    ctaLabel: string | null
    /** Absolute URL of the main hero image. */
    imageUrl: string | null
  }
  /** Sections the model recognised on the existing page, in order. */
  detected: string[]
  /** Set when the site couldn't be read; previews fall back to wireframes. */
  error?: string
}

/** The subset a preview needs. Null means "draw the wireframe". */
export type SiteContent = SiteProfile | null

/**
 * Brand colours as CSS variables. Every preview reads `var(--brand, <template
 * green>)`, so declaring these on any ancestor recolours all fourteen sections
 * at once — and omitting them leaves the template's own palette untouched.
 * The tints are mixed from the single colour the analyser is confident about.
 */
export function brandVariables(profile: SiteContent): Record<string, string> | undefined {
  const brand = profile?.brand.primary
  if (!brand) return undefined
  return {
    '--brand': brand,
    '--brand-band': `color-mix(in srgb, ${brand} 92%, white)`,
    '--brand-figure': `color-mix(in srgb, ${brand} 80%, white)`,
    '--brand-dim': `color-mix(in srgb, ${brand} 50%, white)`,
    '--brand-soft': `color-mix(in srgb, ${brand} 18%, white)`,
    ...(profile?.brand.accent ? { '--brand-accent': profile.brand.accent } : {}),
  }
}

/** A usable hex colour, or null — guards against the model inventing a value. */
export const hexOrNull = (value: unknown): string | null =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim().toLowerCase() : null

/** Trims a model-supplied string and treats blanks as missing. */
export const textOrNull = (value: unknown, max = 200): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed ? trimmed.slice(0, max) : null
}

/** Absolute http(s) URL, or null. Relative paths are resolved against the page. */
export const urlOrNull = (value: unknown, base?: string): string | null => {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const resolved = new URL(value.trim(), base)
    return resolved.protocol === 'http:' || resolved.protocol === 'https:' ? resolved.href : null
  } catch {
    return null
  }
}

/** Adds a scheme when the client typed a bare domain. */
export const normalizeUrl = (input: string): string | null => {
  const trimmed = input.trim()
  if (!trimmed) return null
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(withScheme)
    // A hostname with no dot ("localhost", a typo) isn't a site we can fetch.
    return parsed.hostname.includes('.') ? parsed.href : null
  } catch {
    return null
  }
}

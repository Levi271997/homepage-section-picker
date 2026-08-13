import Anthropic from '@anthropic-ai/sdk'
import { extractSignals, fetchPage } from '@/lib/extractPage'
import { hexOrNull, normalizeUrl, textOrNull, urlOrNull } from '@/lib/siteProfile'
import type { SiteProfile } from '@/lib/siteProfile'

/**
 * POST /api/analyze  { url }  ->  SiteProfile
 *
 * Two halves: a parser pulls the facts out of the HTML (see extractPage.ts),
 * then Claude makes the judgement calls a parser can't — which colour is the
 * brand, which heading is the hero, which of the candidate images to use.
 */

const SITE_PROFILE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    brandName: { type: ['string', 'null'], description: 'The business name as it appears on the site.' },
    primaryColor: {
      type: ['string', 'null'],
      description: 'The dominant brand colour as #rrggbb. Choose from the candidates unless none is plausible.',
    },
    accentColor: { type: ['string', 'null'], description: 'A secondary brand colour as #rrggbb, or null.' },
    logoUrl: { type: ['string', 'null'], description: 'Whichever candidate is the logo, copied exactly. Null if none is.' },
    nav: {
      type: 'array',
      items: { type: 'string' },
      description: 'Main navigation labels in order, at most 6. Empty if unclear.',
    },
    heroEyebrow: { type: ['string', 'null'], description: 'Short kicker line above the headline, if there is one.' },
    heroHeadline: { type: ['string', 'null'], description: 'The main headline, verbatim.' },
    heroSubcopy: { type: ['string', 'null'], description: 'The supporting sentence under the headline, verbatim.' },
    heroCta: { type: ['string', 'null'], description: 'The primary button label, verbatim.' },
    heroImageUrl: { type: ['string', 'null'], description: 'Whichever candidate is the main hero image, copied exactly.' },
    detected: {
      type: 'array',
      items: { type: 'string' },
      description: 'Sections you can tell exist on the page, in order, named plainly (e.g. "services", "testimonials").',
    },
  },
  required: [
    'brandName',
    'primaryColor',
    'accentColor',
    'logoUrl',
    'nav',
    'heroEyebrow',
    'heroHeadline',
    'heroSubcopy',
    'heroCta',
    'heroImageUrl',
    'detected',
  ],
} as const

const SYSTEM = `You read a business's existing website and report what is actually there.

Rules:
- Copy text verbatim. Never rewrite, improve, translate or summarise the client's words — the point is that they recognise their own site.
- Pick URLs only from the candidate lists you are given, copied character for character. Never invent or guess a URL.
- Colours must be #rrggbb. Prefer a candidate; a colour used for buttons and links beats one used once.
- Null is a correct answer. If the page has no eyebrow, or you can't tell which image is the hero, say null rather than picking something plausible.`

const failure = (url: string, error: string): SiteProfile => ({
  url,
  brand: { name: null, primary: null, accent: null, logoUrl: null },
  nav: [],
  hero: { eyebrow: null, headline: null, subcopy: null, ctaLabel: null, imageUrl: null },
  detected: [],
  error,
})

export async function POST(request: Request) {
  let url: string | null = null

  try {
    const body = (await request.json()) as { url?: unknown }
    url = typeof body.url === 'string' ? normalizeUrl(body.url) : null
  } catch {
    url = null
  }

  if (!url) {
    return Response.json(failure('', 'That doesn’t look like a web address.'), { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(failure(url, 'ANTHROPIC_API_KEY is not set on the server.'), { status: 500 })
  }

  let signals
  try {
    const { html, finalUrl } = await fetchPage(url)
    signals = extractSignals(html, finalUrl)
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'The site could not be reached.'
    // A site we can't read isn't an error state for the client — the previews
    // simply stay as wireframes.
    return Response.json(failure(url, reason), { status: 200 })
  }

  const client = new Anthropic()

  try {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      system: SYSTEM,
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: SITE_PROFILE_SCHEMA },
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: [
                `Page: ${signals.finalUrl}`,
                `Title: ${signals.title ?? '(none)'}`,
                `Meta description: ${signals.description ?? '(none)'}`,
                `og:site_name: ${signals.siteName ?? '(none)'}`,
                '',
                `Colour candidates (most used first): ${signals.colors.join(', ') || '(none found)'}`,
                '',
                'Logo candidates:',
                signals.logos.map((value) => `- ${value}`).join('\n') || '- (none found)',
                '',
                'Image candidates:',
                signals.images.map((value) => `- ${value}`).join('\n') || '- (none found)',
                '',
                'Visible page text follows.',
                '---',
                signals.text,
              ].join('\n'),
            },
          ],
        },
      ],
    })

    const text = response.content.find((block) => block.type === 'text')
    const parsed = text && text.type === 'text' ? (JSON.parse(text.text) as Record<string, unknown>) : {}

    // The model is asked to copy URLs from the candidates; enforce it, so a
    // hallucinated address can never reach an <img> tag.
    const fromCandidates = (value: unknown, allowed: string[]) => {
      const resolved = urlOrNull(value, signals.finalUrl)
      return resolved && allowed.includes(resolved) ? resolved : null
    }

    const profile: SiteProfile = {
      url: signals.finalUrl,
      brand: {
        name: textOrNull(parsed.brandName, 80),
        primary: hexOrNull(parsed.primaryColor),
        accent: hexOrNull(parsed.accentColor),
        logoUrl: fromCandidates(parsed.logoUrl, signals.logos),
      },
      nav: Array.isArray(parsed.nav)
        ? parsed.nav.map((item) => textOrNull(item, 24)).filter((item): item is string => Boolean(item)).slice(0, 6)
        : [],
      hero: {
        eyebrow: textOrNull(parsed.heroEyebrow, 60),
        headline: textOrNull(parsed.heroHeadline, 120),
        subcopy: textOrNull(parsed.heroSubcopy, 240),
        ctaLabel: textOrNull(parsed.heroCta, 24),
        imageUrl: fromCandidates(parsed.heroImageUrl, signals.images),
      },
      detected: Array.isArray(parsed.detected)
        ? parsed.detected.map((item) => textOrNull(item, 40)).filter((item): item is string => Boolean(item)).slice(0, 20)
        : [],
    }

    return Response.json(profile)
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'The analysis failed.'
    return Response.json(failure(url, reason), { status: 200 })
  }
}

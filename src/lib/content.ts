import { placeholderImage } from '@/lib/placeholder'
import type { SiteProfile } from '@/lib/siteProfile'

/**
 * The words and pictures inside a section, as opposed to its arrangement.
 *
 * A section's `Choice` says how it is laid out; its `SectionContent` says what
 * it contains. Both are plain string maps so they stay easy to store, diff and
 * prefill — the content is seeded with placeholders, overwritten by whatever we
 * read from the client's existing site, and editable by hand after that.
 */

export type ContentFieldKind =
  /** One line of copy. */
  | 'text'
  /** A short paragraph. */
  | 'paragraph'
  /** A list, one item per line. */
  | 'lines'
  /** An image URL, or a data URI from a local file. */
  | 'image'

export type ContentField = {
  id: string
  label: string
  kind: ContentFieldKind
  /** Shown under the input when the field needs explaining. */
  hint?: string
}

/** Field values keyed by field id. */
export type SectionContent = Record<string, string>

type Schema = { fields: ContentField[]; defaults: SectionContent }

const LANDSCAPE = placeholderImage('landscape')
const PORTRAIT = placeholderImage('portrait')
const WIDE = placeholderImage('wide')
const LOGO = placeholderImage('logo')

/** Fields shared by most sections, so the labels stay consistent. */
const heading = (label = 'Heading'): ContentField => ({ id: 'heading', label, kind: 'text' })
const body = (label = 'Body copy'): ContentField => ({ id: 'body', label, kind: 'paragraph' })
const eyebrow: ContentField = { id: 'eyebrow', label: 'Eyebrow', kind: 'text' }
const image = (label = 'Image'): ContentField => ({ id: 'image', label, kind: 'image' })
const cta = (label = 'Button label'): ContentField => ({ id: 'cta', label, kind: 'text' })

/**
 * Per-section fields and their placeholder values. Only what actually shows at
 * preview scale is editable — a field nobody can see in the miniature is noise
 * in the editor.
 */
export const CONTENT: Record<string, Schema> = {
  'site-header': {
    fields: [
      image('Logo'),
      {
        id: 'nav',
        label: 'Navigation',
        kind: 'lines',
        hint: 'One link per line. The first shows as the current page; end a line with ^ to give it a dropdown arrow.',
      },
      {
        id: 'navMenu',
        label: 'Dropdown links',
        kind: 'lines',
        hint: 'Shown on hover under any nav item marked with ^.',
      },
      cta('Button label'),
      { id: 'phone', label: 'Phone number', kind: 'text', hint: 'Shown by the phone utility bar and the stacked header.' },
      { id: 'email', label: 'Email address', kind: 'text', hint: 'Shown by the social utility bar.' },
      {
        id: 'socialLinks',
        label: 'Social links',
        kind: 'lines',
        hint: 'Facebook, Instagram, X, LinkedIn — one URL per line, in that order.',
      },
    ],
    defaults: {
      image: LOGO,
      nav: 'Home\nServices^\nAbout Us\nPricing',
      navMenu: 'Strategy\nDesign\nBuild\nSupport',
      cta: 'Get in touch',
      phone: '(123) 456-7890',
      email: 'hello@yourcompany.com',
      socialLinks:
        'https://facebook.com/yourcompany\nhttps://instagram.com/yourcompany\nhttps://x.com/yourcompany\nhttps://linkedin.com/company/yourcompany',
    },
  },

  'hero-logo': {
    fields: [
      eyebrow,
      heading('Headline'),
      body('Supporting sentence'),
      cta('Primary button'),
      { id: 'cta2', label: 'Secondary button', kind: 'text' },
      image('Hero image'),
      {
        id: 'image2',
        label: 'Second image',
        kind: 'image',
        hint: 'The paired designs (V4, V5, V6, V7) and the carousel (V22) show a second picture.',
      },
      { id: 'items', label: 'Tick list', kind: 'lines', hint: 'One per line. Shown by V14, V15, V18, V19 and V20.' },
      { id: 'breadcrumb', label: 'Breadcrumb', kind: 'lines', hint: 'One crumb per line. Shown by V25 and V26.' },
      { id: 'date', label: 'Date', kind: 'text', hint: 'Beside the enquiry form in V28.' },
      { id: 'location', label: 'Location', kind: 'text', hint: 'Beside the enquiry form in V28.' },
      { id: 'formCta', label: 'Form button', kind: 'text', hint: 'The enquiry form in V18 and V28.' },
      { id: 'note', label: 'Small print', kind: 'text', hint: 'Under the email field in V13.' },
    ],
    defaults: {
      eyebrow: 'Welcome',
      heading: 'A headline that says what you do',
      body: 'One or two lines explaining who you help and what changes for them.',
      cta: 'Get started',
      cta2: 'Learn more',
      image: LANDSCAPE,
      image2: LANDSCAPE,
      items: 'Something they get\nSomething else they get\nAnd one more',
      breadcrumb: 'Home\nProduct\nProduct sub page',
      date: 'Date here',
      location: 'Location here',
      formCta: 'Get in touch',
      note: '7 day free trial. No card required.',
    },
  },

  'logo-strip': {
    fields: [
      eyebrow,
      heading('Heading'),
      body(),
      cta(),
      { id: 'items', label: 'Client names', kind: 'lines', hint: 'One per logo. Shown as wordmarks in the strip.' },
    ],
    defaults: {
      eyebrow: 'Our clients',
      heading: 'Trusted by teams like yours',
      body: 'A short line of reassurance about the company you keep.',
      cta: 'See our clients',
      // Eighteen, because V3 draws three rows of six and a repeated name reads
      // as a mistake rather than as a placeholder.
      items:
        'Halden Group\nNorthlight\nBasis Co\nOkafor & Sons\nMeridian\nWestbrook\nCaldwell\nAtlas Bay\nRowan & Fern\nPine Harbour\nKestrel\nLumen\nBrightwater\nSilverbeck\nAshcroft\nDunmore\nFairhaven\nGreystone',
    },
  },

  'content-card': {
    fields: [
      heading(),
      body(),
      cta('Header button'),
      { id: 'items', label: 'Card titles', kind: 'lines', hint: 'One per card. Extra lines are ignored when the grid is smaller.' },
      image('Card image'),
      { id: 'itemBody', label: 'Card copy', kind: 'paragraph' },
    ],
    defaults: {
      heading: 'What we do',
      body: 'A sentence introducing the range of services below.',
      cta: 'View all',
      items: 'Strategy\nDesign\nBuild\nSupport\nTraining\nResearch',
      image: LANDSCAPE,
      itemBody: 'A line or two on what this involves and who it suits.',
    },
  },

  'content-section': {
    fields: [
      eyebrow,
      heading(),
      body(),
      cta('Primary button'),
      {
        id: 'cta2',
        label: 'Secondary button',
        kind: 'text',
        hint: 'Also the column link in V17 and V18.',
      },
      {
        id: 'items',
        label: 'List items',
        kind: 'lines',
        hint: 'One per line — the ticks, the media rows or the card titles, depending on the design.',
      },
      {
        id: 'stats',
        label: 'Figures',
        kind: 'lines',
        hint: 'One per line, as "200+ · Projects delivered". Shown by V15 and V16.',
      },
      image(),
      { id: 'note', label: 'Small print', kind: 'text', hint: 'Under the email field in V13 and V23.' },
    ],
    defaults: {
      eyebrow: 'How we work',
      heading: 'The part of the page that explains itself',
      body: 'Two or three sentences carrying the argument, with the picture doing the rest of the work.',
      cta: 'Read more',
      cta2: 'Talk to us',
      // Six lines, because V5 and V6 draw a list that long.
      items:
        'Something worth ticking\nA second point\nA third point\nOne more\nAnd another\nThe last one',
      stats: '200+ · Projects delivered\n15 · Years running\n98% · Would recommend\n40 · Countries reached',
      image: LANDSCAPE,
      note: '7 day free trial. No card required.',
    },
  },

  'client-quote': {
    fields: [
      eyebrow,
      heading(),
      body(),
      cta(),
      { id: 'items', label: 'Quotes', kind: 'lines', hint: 'One quote per line.' },
      { id: 'names', label: 'Names', kind: 'lines', hint: 'One per line, matching the quotes above.' },
      { id: 'roles', label: 'Roles', kind: 'lines', hint: 'One per line, matching the names.' },
      {
        id: 'image',
        label: 'Portrait',
        kind: 'image',
        hint: 'A small avatar beside the name in most designs; the tall picture beside each quote in V4.',
      },
    ],
    defaults: {
      eyebrow: 'Testimonials',
      heading: 'What our clients say',
      body: 'A short line framing the testimonials below.',
      cta: 'Read case studies',
      // Six of each, because V6 draws two rows of three.
      roles:
        'Operations Director, Halden Group\nFounder, Northlight\nMarketing Lead, Basis Co\nOwner, Okafor & Sons\nHead of Digital, Meridian\nManaging Partner, Westbrook',
      items:
        'They understood the brief immediately and the result speaks for itself.\nClear communication from start to finish, and delivered early.\nThe work has paid for itself twice over.\nEasily the smoothest project we have run.\nThey asked the questions nobody else thought to ask.\nWe send everyone we know to them now.',
      names: 'Sarah Whitfield\nTom Nakamura\nPriya Raman\nDaniel Okafor\nGrace Bell\nMartin Voss',
      image: PORTRAIT,
    },
  },

  blogs: {
    fields: [
      eyebrow,
      heading(),
      body(),
      cta(),
      { id: 'items', label: 'Post titles', kind: 'lines' },
      { id: 'meta', label: 'Category and date', kind: 'text', hint: 'Written as "Insights · 12 March".' },
      { id: 'itemBody', label: 'Excerpt', kind: 'paragraph' },
      { id: 'authors', label: 'Authors', kind: 'lines', hint: 'One per line, matching the posts above.' },
      { id: 'more', label: 'Load-more button', kind: 'text' },
      image('Post image'),
    ],
    defaults: {
      eyebrow: 'Writing',
      itemBody: 'A sentence or two of the opening, enough to make the click worthwhile.',
      authors: 'Sarah Whitfield\nTom Nakamura\nPriya Raman',
      more: 'Load more',
      heading: 'From the blog',
      body: 'Notes on the work, published when we have something worth saying.',
      cta: 'Read all posts',
      items:
        'How to brief a web project properly\nFive things we changed after launch\nWhat a homepage is actually for\nThe case for fewer sections\nWriting copy before design\nMeasuring what matters',
      meta: 'Insights · 12 March',
      image: LANDSCAPE,
    },
  },

  'contact-form': {
    fields: [
      eyebrow,
      heading(),
      body(),
      { id: 'items', label: 'Ticked points', kind: 'lines' },
      { id: 'fieldLabels', label: 'Form fields', kind: 'lines', hint: 'One label per line. The last one becomes the message box.' },
      { id: 'consent', label: 'Consent line', kind: 'paragraph' },
      cta('Submit button'),
      { id: 'cta2', label: 'Secondary button', kind: 'text', hint: 'Only shown when the form sits on its own panel.' },
      image(),
    ],
    defaults: {
      eyebrow: 'Contact',
      consent: 'I agree to be contacted about my enquiry and have read the privacy policy.',
      cta2: 'Call us instead',
      heading: 'Get in touch',
      body: 'Tell us what you need and we will come back to you within a working day.',
      items: 'No obligation quote\nReply within 24 hours\nSpeak to the person doing the work',
      fieldLabels: 'Name\nEmail\nCompany\nPhone\nMessage',
      cta: 'Send message',
      image: LANDSCAPE,
    },
  },

  'site-footer': {
    fields: [
      image('Logo'),
      { id: 'body', label: 'Tagline', kind: 'paragraph' },
      { id: 'items', label: 'Link columns', kind: 'lines', hint: 'One heading per line; the links under them are drawn for you.' },
      { id: 'links', label: 'Column links', kind: 'lines', hint: 'Shared by every column, so one list fills them all.' },
      { id: 'legal', label: 'Legal line', kind: 'text' },
      { id: 'legalLinks', label: 'Legal links', kind: 'lines' },
      { id: 'newsletter', label: 'Newsletter copy', kind: 'paragraph' },
      cta('Sign-up button'),
    ],
    defaults: {
      image: LOGO,
      body: 'A short line about the company, sitting under the logo.',
      items: 'Services\nCompany\nResources\nLegal',
      links: 'Overview\nPricing\nCase studies\nContact\nCareers',
      legal: '© 2026 Your Company. All rights reserved.',
      legalLinks: 'Terms and conditions\nPrivacy policy',
      newsletter: 'Occasional notes on the work. No more than once a month.',
      cta: 'Subscribe',
    },
  },

  'about-team': {
    fields: [
      eyebrow,
      heading(),
      body(),
      cta(),
      { id: 'items', label: 'Names', kind: 'lines' },
      { id: 'roles', label: 'Roles', kind: 'lines', hint: 'One per line, matching the names above.' },
      image('Portrait'),
    ],
    defaults: {
      eyebrow: 'Our team',
      cta: 'Meet the team',
      heading: 'The people you will work with',
      body: 'Small team, no account managers, everyone you meet does the work.',
      items: 'Sarah Whitfield\nTom Nakamura\nPriya Raman\nDaniel Okafor',
      roles: 'Founder\nDesign lead\nEngineering\nStrategy',
      image: PORTRAIT,
    },
  },

  stats: {
    fields: [
      eyebrow,
      heading(),
      body(),
      cta(),
      { id: 'items', label: 'Figures', kind: 'lines', hint: 'One per line, as "200+ · Projects delivered".' },
      { id: 'itemBody', label: 'Figure copy', kind: 'paragraph', hint: 'Shown under each figure on the "With copy" layout.' },
    ],
    defaults: {
      eyebrow: 'By the numbers',
      heading: 'Results we can point at',
      body: 'A line of context so the figures below mean something.',
      cta: 'See case studies',
      items: '200+ · Projects delivered\n15 · Years running\n98% · Would recommend\n40 · Countries reached',
      itemBody: 'A sentence of context that makes the number mean something.',
    },
  },

  cta: {
    fields: [
      eyebrow,
      heading(),
      body(),
      cta('Primary button'),
      { id: 'cta2', label: 'Secondary button', kind: 'text' },
      { id: 'items', label: 'Ticked points', kind: 'lines' },
      image(),
    ],
    defaults: {
      eyebrow: 'Ready when you are',
      heading: 'Let us build the version of this that works',
      body: 'A closing line that makes the next step obvious.',
      cta: 'Book a call',
      cta2: 'See pricing',
      items: 'Fixed price, agreed up front\nLive in weeks, not months\nYours to edit afterwards',
      image: LANDSCAPE,
    },
  },

  pricing: {
    fields: [
      eyebrow,
      heading(),
      body(),
      { id: 'items', label: 'Plan names', kind: 'lines' },
      { id: 'prices', label: 'Prices', kind: 'lines', hint: 'One per line, matching the plans above.' },
      { id: 'period', label: 'Billing period', kind: 'text' },
      { id: 'planBody', label: 'Plan summary', kind: 'paragraph' },
      { id: 'features', label: 'Feature list', kind: 'lines' },
      cta('Plan button'),
      { id: 'badge', label: 'Best-plan badge', kind: 'text' },
    ],
    defaults: {
      eyebrow: 'Pricing',
      heading: 'Simple pricing',
      body: 'Pick the level of help you want. Change it whenever you like.',
      items: 'Starter\nStandard\nComplete',
      prices: '£1,200\n£2,400\n£4,800',
      period: 'per project',
      planBody: 'A line on who this suits and what is included.',
      features: 'Everything in the tier below\nUnlimited revisions\nPriority support\nQuarterly review\nDedicated contact',
      cta: 'Choose plan',
      badge: 'Best plan',
    },
  },

  faq: {
    fields: [
      eyebrow,
      heading(),
      body(),
      { id: 'items', label: 'Questions', kind: 'lines' },
      { id: 'answer', label: 'Answer copy', kind: 'paragraph', hint: 'Shown under the first question, which starts open.' },
      { id: 'points', label: 'Ticked points', kind: 'lines', hint: 'Only used by the "Copy beside" layout.' },
      cta('Primary button'),
      { id: 'cta2', label: 'Secondary button', kind: 'text' },
    ],
    defaults: {
      eyebrow: 'FAQ',
      points: 'Straight answers, no jargon\nSomeone who knows the work\nReply within a day',
      cta: 'Ask a question',
      cta2: 'See pricing',
      heading: 'Questions we get asked',
      body: 'If yours is not here, ask us directly.',
      items:
        'How long does a project take?\nWhat do you need from us?\nCan we edit the site ourselves?\nWhat happens after launch?\nDo you host the site?\nHow do payments work?\nCan you work with our brand?\nWhat if we need changes later?',
      answer: 'A short, direct answer that settles the question without selling.',
    },
  },
}

/**
 * Turns an analysed site into content overrides, so reading a client's page
 * replaces the placeholders it can and leaves the rest alone. Only fields the
 * analyser was confident about are written — a null stays a placeholder.
 */
export function profileToContent(profile: SiteProfile): Record<string, SectionContent> {
  const put = (target: SectionContent, key: string, value: string | null | undefined) => {
    if (value) target[key] = value
  }

  const header: SectionContent = {}
  put(header, 'image', profile.brand.logoUrl)
  if (profile.nav.length) header.nav = profile.nav.join('\n')

  const hero: SectionContent = {}
  put(hero, 'eyebrow', profile.hero.eyebrow)
  put(hero, 'heading', profile.hero.headline)
  put(hero, 'body', profile.hero.subcopy)
  put(hero, 'cta', profile.hero.ctaLabel)
  put(hero, 'image', profile.hero.imageUrl)

  const footer: SectionContent = {}
  put(footer, 'image', profile.brand.logoUrl)
  if (profile.brand.name) footer.legal = `© ${new Date().getFullYear()} ${profile.brand.name}. All rights reserved.`

  const out: Record<string, SectionContent> = {}
  if (Object.keys(header).length) out['site-header'] = header
  if (Object.keys(hero).length) out['hero-logo'] = hero
  if (Object.keys(footer).length) out['site-footer'] = footer
  return out
}

/** The placeholder values for a section, or an empty map for sections with no fields. */
export const defaultContent = (sectionId: string): SectionContent => ({ ...(CONTENT[sectionId]?.defaults ?? {}) })

/** Current values for a section, falling back to placeholders field by field. */
export const contentOf = (sectionId: string, store: Record<string, SectionContent>): SectionContent => ({
  ...defaultContent(sectionId),
  ...store[sectionId],
})

/** Fields a section exposes for editing. */
export const fieldsOf = (sectionId: string): ContentField[] => CONTENT[sectionId]?.fields ?? []

/** Splits a `lines` field into items, dropping blanks. */
export const linesOf = (value: string | undefined): string[] =>
  (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

/**
 * Splits "A · B" into its two halves. The separator is how every paired field
 * in the editor is written, so one rule covers figures, categories and dates.
 * Without it the whole string is the second half.
 */
export function splitOnDot(value: string): [string, string] {
  const [first, ...rest] = value.split('·')
  return rest.length ? [first.trim(), rest.join('·').trim()] : ['', value.trim()]
}

/** "200+ · Projects delivered" becomes { figure: '200+', label: 'Projects delivered' }. */
export function splitStat(value: string): { figure: string; label: string } {
  const [figure, label] = splitOnDot(value)
  return { figure, label }
}

/** The nth item of a `lines` field, wrapping so short lists still fill a grid. */
export const itemAt = (value: string | undefined, index: number, fallback = ''): string => {
  const items = linesOf(value)
  return items.length ? items[index % items.length] : fallback
}

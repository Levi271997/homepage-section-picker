import type { IconName } from '@/components/icons'

export type LayoutOption = {
  id: string
  name: string
  blurb?: string
}

/**
 * One axis of a section's layout. Most sections have a single group ("Layout");
 * richer ones split independent decisions apart so the options stay comparable
 * instead of multiplying into every combination.
 */
export type OptionGroup = {
  id: string
  label: string
  /** 'cards' renders previews of each option, 'chips' a compact row of labels. */
  display: 'cards' | 'chips'
  options: LayoutOption[]
  /** Starting option, when it isn't the first one listed. */
  defaultId?: string
  /** Hides the group when the current choice makes it meaningless. */
  appliesTo?: (choice: Choice) => boolean
}

/** The selected option per group, keyed by group id. */
export type Choice = Record<string, string>

/**
 * The hero design set, as exported from Figma.
 *
 * One flat axis rather than the combinable axes other sections use: these are
 * drawn designs, and the set is the set — listing V1…V28 keeps the picker and
 * the design file describing the same thing. `previewImages.ts` maps each id to
 * its artwork, and `HeroPreview` rebuilds each one as a live wireframe.
 */
export const HERO_GROUPS: OptionGroup[] = [
  {
    id: 'design',
    label: 'Design',
    display: 'cards',
    options: [
      { id: 'v1', name: 'V1 · Image right', blurb: 'Copy left, one image beside it' },
      { id: 'v2', name: 'V2 · Image left', blurb: 'One image, copy to the right of it' },
      { id: 'v3', name: 'V3 · Centred', blurb: 'Centred copy, one image below' },
      { id: 'v4', name: 'V4 · Pair, right lead', blurb: 'Centred copy over two offset images' },
      { id: 'v5', name: 'V5 · Pair, left lead', blurb: 'Centred copy over two offset images' },
      { id: 'v6', name: 'V6 · Pair right', blurb: 'Copy left, two overlapping images' },
      { id: 'v7', name: 'V7 · Pair left', blurb: 'Two overlapping images, copy right' },
      { id: 'v8', name: 'V8 · Centred, full-bleed', blurb: 'Centred copy, image edge to edge below' },
      { id: 'v13', name: 'V13 · Email capture', blurb: 'Copy and an inline email field, image right' },
      { id: 'v14', name: 'V14 · Ticks, image right', blurb: 'Copy and a tick list beside the image' },
      { id: 'v15', name: 'V15 · Ticks, image left', blurb: 'Image first, copy and a tick list beside it' },
      { id: 'v16', name: 'V16 · Eyebrow, image right', blurb: 'Kicker above the headline, image beside' },
      { id: 'v17', name: 'V17 · Eyebrow, image left', blurb: 'Image first, kicker above the headline' },
      { id: 'v18', name: 'V18 · Contact form', blurb: 'Copy and ticks beside an enquiry form' },
      { id: 'v19', name: 'V19 · Full-bleed right', blurb: 'Copy left, image running off the right edge' },
      { id: 'v20', name: 'V20 · Full-bleed left', blurb: 'Image off the left edge, copy beside it' },
      { id: 'v21', name: 'V21 · Panel', blurb: 'Centred copy on a tinted panel, image overlapping' },
      { id: 'v22', name: 'V22 · Carousel', blurb: 'Centred copy above a paged row of images' },
      { id: 'v23', name: 'V23 · Background, left', blurb: 'Copy over a full-bleed background image' },
      { id: 'v24', name: 'V24 · Background, centred', blurb: 'Centred copy over a full-bleed image' },
      { id: 'v25', name: 'V25 · Breadcrumb', blurb: 'Breadcrumb and copy, image right' },
      { id: 'v26', name: 'V26 · Page header', blurb: 'Breadcrumb and centred copy, no image' },
      { id: 'v28', name: 'V28 · Form with details', blurb: 'Copy, date and location beside a form' },
    ],
  },
]

/**
 * The logo strip design set, as exported from Figma.
 *
 * Three drawn designs on a flat `design` axis, like every other set that has
 * artwork. The same six-across row in all of them; what a design decides is
 * whether it opens with a heading block, how many rows it runs to, and whether
 * it pages.
 */
export const LOGO_GROUPS: OptionGroup[] = [
  {
    id: 'design',
    label: 'Design',
    display: 'cards',
    options: [
      { id: 'v1', name: 'V1 · Headed, paged', blurb: 'Centred header above one row of six, with paging dots' },
      { id: 'v2', name: 'V2 · Bare strip', blurb: 'One paged row on its own — no heading, no button' },
      { id: 'v3', name: 'V3 · Headed grid', blurb: 'Centred header above three rows of six, standing still' },
    ],
  },
]

/**
 * The content card design set, as exported from Figma.
 *
 * Like the hero, a flat axis of the drawn designs rather than the combinable
 * axes it used to invent — the header treatment and the card style aren't free
 * choices, they're part of each design. Rows stays its own axis because the
 * design file draws all three, so every combination here has artwork behind it.
 */
export const CONTENT_CARD_GROUPS: OptionGroup[] = [
  {
    id: 'design',
    label: 'Design',
    display: 'cards',
    options: [
      { id: 'v1', name: 'V1 · Button CTA', blurb: 'Centred header, thumbnail and a solid green button' },
      { id: 'v2', name: 'V2 · Plain', blurb: 'Left header, thumbnail and a quiet text link' },
      { id: 'v3', name: 'V3 · Bordered, button', blurb: 'Outlined cards closing on a green button' },
      { id: 'v4', name: 'V4 · Bordered, plain', blurb: 'Left header over outlined cards' },
      { id: 'v5', name: 'V5 · Thumbnail', blurb: 'Centred header, thumbnail above each label' },
      { id: 'v6', name: 'V6 · Tinted', blurb: 'Soft green cards under a left header' },
      { id: 'v7', name: 'V7 · Centred text', blurb: 'Thumbnail and copy centred in each column' },
      { id: 'v8', name: 'V8 · Bordered, centred', blurb: 'Outlined cards with everything centred' },
      { id: 'v9', name: 'V9 · Wide image, centred', blurb: 'Landscape image above centred copy' },
      { id: 'v10', name: 'V10 · Bordered wide, centred', blurb: 'Outlined card around a landscape image' },
      { id: 'v11', name: 'V11 · Wide image', blurb: 'Landscape image above left-aligned copy' },
      { id: 'v12', name: 'V12 · Bordered wide', blurb: 'Left header, outlined cards, landscape image' },
      { id: 'v13', name: 'V13 · Wide image, square', blurb: 'As V11 with square-cornered images' },
      { id: 'v14', name: 'V14 · Tinted, image top', blurb: 'Image filling the top of a tinted card' },
      { id: 'v15', name: 'V15 · Image beside, two up', blurb: 'Two columns, tall image next to the copy' },
      { id: 'v16', name: 'V16 · Bordered, image beside', blurb: 'Two outlined cards, image against the edge' },
      { id: 'v17', name: 'V17 · Thumbnail beside', blurb: 'Small image to the left of each label' },
      { id: 'v18', name: 'V18 · Bordered, thumb beside', blurb: 'Outlined cards, image left of the text' },
      { id: 'v19', name: 'V19 · Numbered', blurb: 'Large green numeral in place of an image' },
      { id: 'v20', name: 'V20 · Numbered, grey', blurb: 'Numerals on warm grey cards' },
      { id: 'v21', name: 'V21 · Number footer', blurb: 'Number and arrow ruled off below the link' },
      { id: 'v22', name: 'V22 · Grey, number footer', blurb: 'Numbered footer on warm grey cards' },
    ],
  },
  {
    id: 'rows',
    label: 'Rows',
    display: 'chips',
    options: [
      { id: '1', name: '1 row' },
      { id: '2', name: '2 rows' },
      { id: '3', name: '3 rows' },
    ],
  },
]

/**
 * The content section design set, as exported from Figma.
 *
 * A flat axis of the 20 drawn designs, like the hero and the content cards.
 * The axes this used to combine weren't free choices — how many ticks a design
 * lists, whether its image bleeds, which side it sits on — they're all part of
 * the design, so listing the set verbatim keeps the picker and the design file
 * describing the same thing.
 */
export const CONTENT_SECTION_GROUPS: OptionGroup[] = [
  {
    id: 'design',
    label: 'Design',
    display: 'cards',
    options: [
      { id: 'v1', name: 'V1 · Copy, image right', blurb: 'Eyebrow, heading, paragraph and two buttons' },
      { id: 'v2', name: 'V2 · Copy, image left', blurb: 'The same, with the picture leading' },
      { id: 'v3', name: 'V3 · Ticks, image right', blurb: 'Three ticked points under the paragraph' },
      { id: 'v4', name: 'V4 · Ticks, image left', blurb: 'Picture first, three ticked points beside it' },
      { id: 'v5', name: 'V5 · Six ticks, image right', blurb: 'A longer list of ticked points' },
      { id: 'v6', name: 'V6 · Six ticks, image left', blurb: 'Picture first, six ticked points beside it' },
      { id: 'v7', name: 'V7 · Full-bleed right', blurb: 'Ticks beside an image running off the right edge' },
      { id: 'v8', name: 'V8 · Full-bleed left', blurb: 'Image off the left edge, ticks beside it' },
      { id: 'v9', name: 'V9 · Media list, bleed right', blurb: 'Thumbnail-and-text rows, image off the edge' },
      { id: 'v10', name: 'V10 · Media list, bleed left', blurb: 'Image off the left edge, media rows beside it' },
      { id: 'v13', name: 'V13 · Email capture, image left', blurb: 'Picture beside an inline email field' },
      { id: 'v15', name: 'V15 · Stats, image right', blurb: 'A 2×2 grid of “200+” figures' },
      { id: 'v16', name: 'V16 · Stats, image left', blurb: 'Picture first, figures beside it' },
      { id: 'v17', name: 'V17 · Wide image, centred', blurb: 'Centred header, full-width image, three columns' },
      { id: 'v18', name: 'V18 · Wide image, left', blurb: 'Left header and button over the same' },
      { id: 'v19', name: 'V19 · Cards right', blurb: 'Copy facing a 2×2 block of small cards' },
      { id: 'v20', name: 'V20 · Cards left', blurb: 'The card block first, copy beside it' },
      { id: 'v21', name: 'V21 · Flanked', blurb: 'One upright picture with a pair of cards each side' },
      { id: 'v22', name: 'V22 · Banner', blurb: 'Heading, a sentence and two buttons — no picture' },
      { id: 'v23', name: 'V23 · Email capture, image right', blurb: 'Inline email field, picture to the right' },
    ],
  },
]

/**
 * The site header. Structure, where the nav sits, what the nav band looks like
 * and which call to action it carries are all independent.
 */
export const HEADER_GROUPS: OptionGroup[] = [
  {
    id: 'structure',
    label: 'Structure',
    display: 'cards',
    options: [
      { id: 'single', name: 'Single bar', blurb: 'Logo, navigation and button on one row' },
      { id: 'utility-social', name: 'Social utility bar', blurb: 'Email, centred logo and social icons above the nav' },
      { id: 'utility-phone', name: 'Phone utility bar', blurb: 'Logo and “Call us” number above the nav' },
      { id: 'stacked', name: 'Stacked', blurb: 'Nav under the logo, number and button on the right' },
    ],
  },
  {
    id: 'nav',
    label: 'Nav',
    display: 'chips',
    options: [
      { id: 'left', name: 'Left' },
      { id: 'center', name: 'Centred' },
      { id: 'right', name: 'Right' },
    ],
  },
  {
    id: 'band',
    label: 'Nav band',
    display: 'chips',
    // The stacked header has no separate nav band to colour.
    appliesTo: (choice) => choice.structure !== 'stacked',
    options: [
      { id: 'white', name: 'White' },
      { id: 'dark', name: 'Dark brown' },
      { id: 'green', name: 'Light green' },
    ],
  },
  {
    id: 'cta',
    label: 'Button',
    display: 'chips',
    options: [
      { id: 'solid', name: 'Solid green' },
      { id: 'outline', name: 'Outlined' },
      { id: 'none', name: 'None' },
    ],
  },
]

/** The call to action — a closing pitch, with or without an image. */
export const CTA_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Layout',
    display: 'cards',
    options: [
      { id: 'split', name: 'Image + copy', blurb: 'Image beside the pitch' },
      { id: 'banner', name: 'Copy only', blurb: 'Just the pitch and its buttons' },
    ],
  },
  {
    id: 'band',
    label: 'Background',
    display: 'chips',
    options: [
      { id: 'white', name: 'White' },
      { id: 'green', name: 'Green' },
      { id: 'photo', name: 'Photo' },
    ],
  },
  {
    id: 'shape',
    label: 'Shape',
    display: 'chips',
    appliesTo: (choice) => choice.band !== 'white',
    options: [
      { id: 'full', name: 'Full width' },
      { id: 'panel', name: 'Rounded panel' },
    ],
  },
  {
    id: 'side',
    label: 'Image on',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'split',
    options: [
      { id: 'left', name: 'Left' },
      { id: 'right', name: 'Right' },
    ],
  },
  {
    id: 'align',
    label: 'Copy',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'banner',
    options: [
      { id: 'left', name: 'Left' },
      { id: 'apart', name: 'Buttons right' },
      { id: 'center', name: 'Centred' },
    ],
  },
  {
    id: 'list',
    label: 'Copy list',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'split',
    options: [
      { id: 'checks', name: 'Ticked points' },
      { id: 'none', name: 'None' },
    ],
  },
]

/**
 * The stats design set, as exported from Figma.
 *
 * Four drawn designs on a flat `design` axis. Whether the row of figures
 * carries a header, whether each figure gets a paragraph, and whether the whole
 * thing sits on the green band aren't free choices — they're what tells the
 * four designs apart. The columns axis goes with them: the set is four across
 * throughout, so a three-up was offering a count nobody drew.
 */
export const STATS_GROUPS: OptionGroup[] = [
  {
    id: 'design',
    label: 'Design',
    display: 'cards',
    options: [
      { id: 'v1', name: 'V1 · Centred header', blurb: 'Header over four figures, each with a paragraph' },
      { id: 'v2', name: 'V2 · Left header', blurb: 'The same, with the header set left' },
      { id: 'v3', name: 'V3 · Bare row', blurb: 'Just the four figures and their labels' },
      { id: 'v4', name: 'V4 · Green band', blurb: 'The same row, reversed out of the brand green' },
    ],
  },
]

/** The FAQ accordion — collapsible question rows, optionally beside copy. */
export const FAQ_GROUPS: OptionGroup[] = [
  {
    id: 'style',
    label: 'Row style',
    display: 'cards',
    options: [
      { id: 'rules', name: 'Rules', blurb: 'Questions separated by hairlines' },
      { id: 'bordered', name: 'Bordered', blurb: 'Each question in an outlined box' },
      { id: 'raised', name: 'Raised', blurb: 'Each question on a card with a soft shadow' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    display: 'chips',
    options: [
      { id: 'stacked', name: 'Header above' },
      { id: 'split', name: 'Copy beside' },
    ],
  },
  {
    id: 'columns',
    label: 'Columns',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'stacked',
    options: [
      { id: '1', name: '1' },
      { id: '2', name: '2' },
    ],
  },
  {
    id: 'header',
    label: 'Header',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'stacked',
    options: [
      { id: 'centered', name: 'Centred' },
      { id: 'left', name: 'Left' },
    ],
  },
  {
    id: 'items',
    label: 'Questions',
    display: 'chips',
    options: [
      { id: '4', name: '4' },
      { id: '6', name: '6' },
      { id: '8', name: '8' },
    ],
  },
]

/**
 * The team members design set, as exported from Figma.
 *
 * Three drawn designs on a flat `design` axis. The portrait shape, the outline
 * and where the name sits aren't free choices, and the set is four across in all
 * three — so the columns axis goes too, rather than offering a three-up nobody
 * drew.
 */
export const TEAM_GROUPS: OptionGroup[] = [
  {
    id: 'design',
    label: 'Design',
    display: 'cards',
    options: [
      { id: 'v1', name: 'V1 · Thumbnail', blurb: 'Small square portrait above a centred name' },
      { id: 'v2', name: 'V2 · Outlined', blurb: 'The same in an outlined card' },
      { id: 'v3', name: 'V3 · Landscape', blurb: 'Wide portrait filling the column, name set left' },
    ],
  },
]

/**
 * The testimonials design set, as exported from Figma.
 *
 * A flat axis of the six drawn designs, like the hero, the cards and the content
 * section. The axes this used to combine weren't free choices — whether a quote
 * opens on stars or the green speech bubble, what encloses it, how many rows the
 * grid runs to — they're all part of the design, so listing the set verbatim
 * keeps the picker and the design file describing the same thing.
 */
export const TESTIMONIAL_GROUPS: OptionGroup[] = [
  {
    id: 'design',
    label: 'Design',
    display: 'cards',
    options: [
      { id: 'v1', name: 'V1 · Outlined, three up', blurb: 'Centred header over three outlined quote cards' },
      { id: 'v2', name: 'V2 · Carousel', blurb: 'One quote on a tinted panel, an arrow either side' },
      { id: 'v3', name: 'V3 · Plain, three up', blurb: 'Left header, three quotes with no card around them' },
      { id: 'v4', name: 'V4 · Portrait beside', blurb: 'A tall portrait next to each quote, four in all' },
      { id: 'v5', name: 'V5 · Raised, three up', blurb: 'Quote-mark cards lifted off the page' },
      { id: 'v6', name: 'V6 · Outlined, six up', blurb: 'Two rows of three outlined quote cards' },
    ],
  },
]

/**
 * The pricing design set, as exported from Figma.
 *
 * Six drawn designs on a flat `design` axis. Whether a plan sits in an outlined
 * card, whether the middle one is tinted, which side of a feature its tick sits
 * on and where the gold pill goes aren't free choices — they're what tells the
 * six apart. The plan count goes with them: the set is three across throughout.
 */
export const PRICING_GROUPS: OptionGroup[] = [
  {
    id: 'design',
    label: 'Design',
    display: 'cards',
    options: [
      { id: 'v1', name: 'V1 · Bare columns', blurb: 'No card, ticks left, pill out at the column edge' },
      { id: 'v2', name: 'V2 · Outlined, tinted', blurb: 'Cards with the middle plan on the pale green' },
      { id: 'v3', name: 'V3 · Ticks right', blurb: 'Bare columns with the ticks on the right, pill beside the name' },
      { id: 'v4', name: 'V4 · Outlined', blurb: 'Three white cards, ticks right' },
      { id: 'v5', name: 'V5 · Picture on top', blurb: 'A square above the price, the plan name under it' },
      { id: 'v6', name: 'V6 · Price only', blurb: 'Name, price and summary — no feature list' },
    ],
  },
]

/** The blog grid — post cards, optionally under a heading. */
export const BLOGS_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Card content',
    display: 'cards',
    options: [
      { id: 'author', name: 'Author', blurb: 'Category, date, title and the author’s name' },
      { id: 'excerpt', name: 'Excerpt', blurb: 'Category, date, title and a summary' },
      { id: 'meta-bottom', name: 'Meta below', blurb: 'Title and summary, category and date under a rule' },
    ],
  },
  {
    id: 'card',
    label: 'Card',
    display: 'chips',
    options: [
      { id: 'bordered', name: 'Bordered' },
      { id: 'plain', name: 'Plain' },
    ],
  },
  {
    id: 'header',
    label: 'Header',
    display: 'chips',
    options: [
      { id: 'centered', name: 'Centred' },
      { id: 'left', name: 'Left' },
      { id: 'none', name: 'None' },
    ],
  },
  {
    id: 'rows',
    label: 'Rows',
    display: 'chips',
    options: [
      { id: '1', name: '1' },
      { id: '2', name: '2' },
      { id: '3', name: '3' },
    ],
  },
  {
    id: 'more',
    label: 'Load more',
    display: 'chips',
    options: [
      { id: 'hide', name: 'Hide' },
      { id: 'show', name: 'Show' },
    ],
  },
]

/**
 * The contact form — copy paired with a form panel, or copy and form together
 * beside an image.
 */
export const CONTACT_FORM_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Layout',
    display: 'cards',
    options: [
      { id: 'green-card', name: 'Green panel', blurb: 'Form on a soft green panel with white fields' },
      { id: 'white-card', name: 'White card', blurb: 'Form on a raised white card with grey fields' },
      { id: 'plain-form', name: 'Inline + image', blurb: 'Form under the copy, image alongside' },
    ],
  },
  {
    id: 'side',
    label: 'Form on',
    display: 'chips',
    options: [
      { id: 'right', name: 'Right' },
      { id: 'left', name: 'Left' },
    ],
  },
  {
    id: 'list',
    label: 'Copy list',
    display: 'chips',
    options: [
      { id: 'checks', name: 'Ticked points' },
      { id: 'none', name: 'None' },
    ],
  },
  {
    id: 'fields',
    label: 'Fields',
    display: 'chips',
    defaultId: '5',
    options: [
      { id: '3', name: '3' },
      { id: '4', name: '4' },
      { id: '5', name: '5' },
    ],
  },
]

/** Layouts of the footer that stack link columns above a bottom bar. */
const COLUMN_FOOTERS = ['columns', 'newsletter']

/**
 * The site footer — from a single legal bar up to a full column block with a
 * newsletter sign-up.
 */
export const FOOTER_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Layout',
    display: 'cards',
    options: [
      { id: 'bar', name: 'Single bar', blurb: 'One row of copyright, links and icons' },
      { id: 'columns', name: 'Link columns', blurb: 'Brand block and link columns above a legal bar' },
      { id: 'newsletter', name: 'Newsletter', blurb: 'Link columns with an email sign-up on the right' },
      { id: 'logo-only', name: 'Logo only', blurb: 'Just a centred logo' },
    ],
  },
  {
    id: 'content',
    label: 'Bar shows',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'bar',
    options: [
      { id: 'links', name: 'Links' },
      { id: 'links-social', name: 'Links + social' },
      { id: 'logo-links', name: 'Logo + links' },
      { id: 'logo-social', name: 'Logo + social' },
    ],
  },
  {
    id: 'columns',
    label: 'Columns',
    display: 'chips',
    appliesTo: (choice) => COLUMN_FOOTERS.includes(choice.layout),
    options: [
      { id: '2', name: '2' },
      { id: '3', name: '3' },
      { id: '4', name: '4' },
    ],
  },
  {
    id: 'subscribe',
    label: 'Sign-up',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'newsletter',
    options: [
      { id: 'button', name: 'Button below' },
      { id: 'inline', name: 'Inline arrow' },
    ],
  },
]

export type Section = {
  id: string
  label: string
  icon: IconName
  /** Required sections can't be swapped or removed. */
  required?: boolean
  /** Pinned sections are also fixed in place — no dragging, nothing lands on them. */
  pinned?: boolean
  /** Sections with options get a layout picker instead of a fixed arrangement. */
  options?: OptionGroup[]
}

/** The approved sections a homepage can be assembled from. */
export const CATALOG: Section[] = [
  { id: 'site-header', label: 'Site header', icon: 'header', required: true, pinned: true, options: HEADER_GROUPS },
  { id: 'hero-logo', label: 'Hero with your logo', icon: 'layout', required: true, pinned: true, options: HERO_GROUPS },
  { id: 'content-card', label: 'Content card', icon: 'image', options: CONTENT_CARD_GROUPS },
  { id: 'content-section', label: 'Content section', icon: 'split', options: CONTENT_SECTION_GROUPS },
  { id: 'client-quote', label: 'Testimonials', icon: 'quote', options: TESTIMONIAL_GROUPS },
  { id: 'logo-strip', label: 'Logo strip', icon: 'building', options: LOGO_GROUPS },
  { id: 'blogs', label: 'Blogs', icon: 'file', options: BLOGS_GROUPS },
  { id: 'contact-form', label: 'Contact form', icon: 'form', required: true, options: CONTACT_FORM_GROUPS },
  { id: 'site-footer', label: 'Site footer', icon: 'footer', required: true, pinned: true, options: FOOTER_GROUPS },
  { id: 'about-team', label: 'Team members', icon: 'users', options: TEAM_GROUPS },
  { id: 'stats', label: 'Stats', icon: 'stats', options: STATS_GROUPS },
  { id: 'cta', label: 'Call to action', icon: 'arrow', options: CTA_GROUPS },
  { id: 'pricing', label: 'Pricing', icon: 'tag', options: PRICING_GROUPS },
  { id: 'faq', label: 'FAQ accordion', icon: 'help', options: FAQ_GROUPS },
]

/** What the audit suggested, in order. */
export const SUGGESTED_IDS = [
  'site-header',
  'hero-logo',
  'content-card',
  'content-section',
  'client-quote',
  'logo-strip',
  'about-team',
  'stats',
  'pricing',
  'blogs',
  'faq',
  'cta',
  'contact-form',
  'site-footer',
]

export const byId = (id: string) => CATALOG.find((s) => s.id === id)!

/** Every group's first option — what a section starts on. */
export const defaultChoice = (section: Section): Choice =>
  Object.fromEntries((section.options ?? []).map((group) => [group.id, group.defaultId ?? group.options[0].id]))

/** The section's current selection, falling back to defaults for untouched groups. */
export const choiceOf = (section: Section, chosen: Record<string, Choice>): Choice => ({
  ...defaultChoice(section),
  ...chosen[section.id],
})

/** The groups that currently matter, given what's selected elsewhere. */
export const activeGroups = (section: Section, choice: Choice) =>
  (section.options ?? []).filter((group) => group.appliesTo?.(choice) ?? true)

/** Human-readable summary of a choice, e.g. "Bordered · Left + View all · 2 rows". */
export const describeChoice = (section: Section, choice: Choice) =>
  activeGroups(section, choice)
    .map((group) => group.options.find((o) => o.id === choice[group.id])?.name)
    .filter(Boolean)
    .join(' · ')

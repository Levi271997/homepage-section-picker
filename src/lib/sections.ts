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

/** Layouts of the content section that pair copy with something beside it. */
const SPLIT_LAYOUTS = ['copy', 'checklist', 'media-list', 'stats', 'mini-cards']

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

/** The arrangements the logo strip can be built in. */
export const LOGO_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Layout',
    display: 'cards',
    options: [
      { id: 'carousel', name: 'Carousel', blurb: 'One row of logos with paging dots, no heading' },
      { id: 'headed-grid', name: 'Headed grid', blurb: 'Intro copy and button above three rows of logos' },
      { id: 'headed-carousel', name: 'Headed carousel', blurb: 'Intro copy and button above one paged row' },
    ],
  },
]

/**
 * The content card grid. Three independent axes — card style, header treatment
 * and how many rows — rather than one flat list of every combination.
 */
export const CONTENT_CARD_GROUPS: OptionGroup[] = [
  {
    id: 'style',
    label: 'Card style',
    display: 'cards',
    options: [
      { id: 'plain', name: 'Plain', blurb: 'No container, small image above the label' },
      { id: 'wide-image', name: 'Wide image', blurb: 'Full-width image above the label' },
      { id: 'centered', name: 'Centered text', blurb: 'Image and copy centred in each column' },
      { id: 'bordered', name: 'Bordered', blurb: 'Outlined card around each item' },
      { id: 'tinted', name: 'Tinted', blurb: 'Soft green fill behind each item' },
      { id: 'horizontal', name: 'Image left', blurb: 'Image beside the text, not above it' },
      { id: 'numbered', name: 'Numbered', blurb: 'Large green numeral instead of an image' },
      { id: 'numbered-footer', name: 'Number footer', blurb: 'Number and arrow below a divider' },
      { id: 'button', name: 'Button CTA', blurb: 'Solid green button in place of the text link' },
    ],
  },
  {
    id: 'header',
    label: 'Header',
    display: 'chips',
    options: [
      { id: 'centered', name: 'Centred + button' },
      { id: 'left', name: 'Left + View all' },
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
 * The content section — copy paired with an image, a list, stats or cards.
 * `side` and `image` only bite on the split layouts; `header` on the stacked
 * ones; `items` on whichever list or column count the layout shows.
 */
export const CONTENT_SECTION_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Layout',
    display: 'cards',
    options: [
      { id: 'copy', name: 'Copy + image', blurb: 'Heading, paragraph and buttons beside an image' },
      { id: 'checklist', name: 'Checklist + image', blurb: 'Green ticked points under the paragraph' },
      { id: 'media-list', name: 'Media list + image', blurb: 'Stacked thumbnail-and-text items beside an image' },
      { id: 'stats', name: 'Stats + image', blurb: 'A grid of “200+” figures beside an image' },
      { id: 'mini-cards', name: 'Cards + copy', blurb: 'A 2×2 block of small cards facing the copy' },
      { id: 'image-band', name: 'Header + image', blurb: 'Heading above one full-width image' },
      { id: 'image-columns', name: 'Image + columns', blurb: 'Heading, wide image, then text columns' },
      { id: 'card-columns', name: 'Card columns', blurb: 'Heading above a row of image cards' },
    ],
  },
  {
    id: 'side',
    label: 'Image on',
    display: 'chips',
    appliesTo: (choice) => SPLIT_LAYOUTS.includes(choice.layout),
    options: [
      { id: 'left', name: 'Left' },
      { id: 'right', name: 'Right' },
    ],
  },
  {
    id: 'image',
    label: 'Image',
    display: 'chips',
    appliesTo: (choice) => SPLIT_LAYOUTS.includes(choice.layout) && choice.layout !== 'mini-cards',
    options: [
      { id: 'inset', name: 'Inset' },
      { id: 'bleed', name: 'Full bleed' },
    ],
  },
  {
    id: 'header',
    label: 'Header',
    display: 'chips',
    appliesTo: (choice) => !SPLIT_LAYOUTS.includes(choice.layout),
    options: [
      { id: 'centered', name: 'Centred' },
      { id: 'left', name: 'Left + button' },
    ],
  },
  {
    id: 'items',
    label: 'Items',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'checklist' || choice.layout === 'card-columns',
    options: [
      { id: '3', name: '3' },
      { id: '4', name: '4' },
      { id: '6', name: '6' },
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

/** The stats band — a row of headline figures. */
export const STATS_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Stat',
    display: 'cards',
    options: [
      { id: 'full', name: 'With copy', blurb: 'Figure, label and a short paragraph' },
      { id: 'compact', name: 'Figure only', blurb: 'Just the figure and its label' },
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
    id: 'band',
    label: 'Band',
    display: 'chips',
    options: [
      { id: 'white', name: 'White' },
      { id: 'green', name: 'Green' },
    ],
  },
  {
    id: 'columns',
    label: 'Columns',
    display: 'chips',
    defaultId: '4',
    options: [
      { id: '3', name: '3' },
      { id: '4', name: '4' },
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

/** The team grid — a portrait, name and role per person. */
export const TEAM_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Portrait',
    display: 'cards',
    options: [
      { id: 'thumb', name: 'Small', blurb: 'Compact square portrait above the name' },
      { id: 'wide', name: 'Large', blurb: 'Full-width portrait filling the column' },
    ],
  },
  {
    id: 'card',
    label: 'Card',
    display: 'chips',
    options: [
      { id: 'plain', name: 'Plain' },
      { id: 'bordered', name: 'Bordered' },
    ],
  },
  {
    id: 'align',
    label: 'Align',
    display: 'chips',
    options: [
      { id: 'center', name: 'Centred' },
      { id: 'left', name: 'Left' },
    ],
  },
  {
    id: 'columns',
    label: 'Columns',
    display: 'chips',
    defaultId: '4',
    options: [
      { id: '3', name: '3' },
      { id: '4', name: '4' },
    ],
  },
]

/** Testimonials — quote cards, a carousel, or quotes beside portraits. */
export const TESTIMONIAL_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Layout',
    display: 'cards',
    options: [
      { id: 'grid', name: 'Card grid', blurb: 'A row of quote cards' },
      { id: 'carousel', name: 'Carousel', blurb: 'One large quote with arrows and paging dots' },
      { id: 'media', name: 'Image + quote', blurb: 'Portrait beside each quote, two per row' },
    ],
  },
  {
    id: 'mark',
    label: 'Mark',
    display: 'chips',
    options: [
      { id: 'stars', name: 'Star rating' },
      { id: 'quote', name: 'Quote icon' },
    ],
  },
  {
    id: 'card',
    label: 'Card',
    display: 'chips',
    appliesTo: (choice) => choice.layout === 'grid',
    options: [
      { id: 'bordered', name: 'Bordered' },
      { id: 'plain', name: 'Plain' },
      { id: 'shadow', name: 'Raised' },
    ],
  },
  {
    id: 'header',
    label: 'Header',
    display: 'chips',
    options: [
      { id: 'centered', name: 'Centred' },
      { id: 'left', name: 'Left' },
    ],
  },
  {
    id: 'rows',
    label: 'Rows',
    display: 'chips',
    appliesTo: (choice) => choice.layout !== 'carousel',
    options: [
      { id: '1', name: '1' },
      { id: '2', name: '2' },
    ],
  },
]

/** The pricing table — a row of plan cards under a heading. */
export const PRICING_GROUPS: OptionGroup[] = [
  {
    id: 'layout',
    label: 'Plan card',
    display: 'cards',
    options: [
      { id: 'simple', name: 'Price only', blurb: 'Label, price, summary and a button' },
      { id: 'features', name: 'With features', blurb: 'A ticked feature list above the button' },
      { id: 'icon', name: 'Icon + price', blurb: 'Icon above the price, label underneath' },
    ],
  },
  {
    id: 'ticks',
    label: 'Ticks',
    display: 'chips',
    defaultId: 'right',
    appliesTo: (choice) => choice.layout !== 'simple',
    options: [
      { id: 'left', name: 'Left' },
      { id: 'right', name: 'Right' },
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
    id: 'highlight',
    label: 'Best plan',
    display: 'chips',
    options: [
      { id: 'fill', name: 'Fill + badge' },
      { id: 'badge', name: 'Badge only' },
      { id: 'none', name: 'None' },
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

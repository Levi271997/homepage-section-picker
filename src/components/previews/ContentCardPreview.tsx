import type { CSSProperties } from 'react'
import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v22'. */
export type ContentCardDesign = string

export type ContentCardChoice = {
  design: ContentCardDesign
  /** Rows of cards the grid runs to: '1', '2' or '3'. The design set draws all three. */
  rows: string
}

const GREEN = 'var(--brand,#3f6b30)'
const TINT = 'var(--brand-soft,#f2f8ed)'
/** The warm grey and tan the drawn cards are built from, straight off the design. */
const GREY = '#f5f3f1'
const HAIRLINE = '#d0c3b8'

/**
 * What each design is made of.
 *
 * The 22 designs are variations on one grid, so they're described here as data
 * rather than written out as 22 components — a new export from the design file
 * is usually one more line in this table. Read off the artwork itself: the
 * container fills (#F5F3F1 grey, #F2F8ED tint), the #D0C3B8 card borders and
 * the media boxes are all measured from the SVGs in `public/design-sets`.
 */
type Spec = {
  /** Title left with a View All button, or centred above a Button Text. */
  header: 'left' | 'centered'
  /** What encloses each card. */
  card?: 'bordered' | 'tinted' | 'grey'
  /** What the card leads with. 'panel' is the tall block the two-column designs set beside the copy. */
  media?: 'thumb' | 'wide' | 'panel'
  /** Puts a thumb to the left of the copy rather than above it. */
  beside?: boolean
  /** Media squared off against the card's edges instead of sitting inside its padding. */
  bleed?: boolean
  /** Square corners on the card and its media, as V13 and V14 draw them. */
  sharp?: boolean
  /** Copy centred within the card. */
  align?: 'center'
  /** Where the position numeral sits, on the numbered designs. */
  numeral?: 'top' | 'footer'
  /** The card's call to action. A text link with an arrow unless stated. */
  link?: 'plain' | 'button'
  /** Columns in the grid. Three unless the design says otherwise. */
  cols?: 2
}

const SPECS: Record<string, Spec> = {
  v1: { header: 'centered', media: 'thumb', link: 'button' },
  v2: { header: 'left', media: 'thumb', link: 'plain' },
  v3: { header: 'centered', card: 'bordered', media: 'thumb', link: 'button' },
  v4: { header: 'left', card: 'bordered', media: 'thumb', link: 'plain' },
  v5: { header: 'centered', media: 'thumb' },
  v6: { header: 'left', card: 'tinted', media: 'thumb' },
  v7: { header: 'centered', media: 'thumb', align: 'center' },
  v8: { header: 'centered', card: 'bordered', media: 'thumb', align: 'center' },
  v9: { header: 'centered', media: 'wide', align: 'center' },
  v10: { header: 'centered', card: 'bordered', media: 'wide', align: 'center' },
  v11: { header: 'centered', media: 'wide' },
  v12: { header: 'left', card: 'bordered', media: 'wide' },
  v13: { header: 'centered', media: 'wide', sharp: true },
  v14: { header: 'left', card: 'tinted', media: 'wide', bleed: true, sharp: true },
  v15: { header: 'centered', media: 'panel', cols: 2 },
  v16: { header: 'left', card: 'bordered', media: 'panel', bleed: true, cols: 2 },
  v17: { header: 'centered', media: 'thumb', beside: true },
  v18: { header: 'left', card: 'bordered', media: 'thumb', beside: true },
  v19: { header: 'centered', numeral: 'top' },
  v20: { header: 'left', card: 'grey', numeral: 'top' },
  v21: { header: 'centered', numeral: 'footer' },
  v22: { header: 'left', card: 'grey', numeral: 'footer' },
}

function Label({ text }: { text?: string }) {
  if (text) {
    return <h3 className="text-[1.8cqw] leading-tight font-semibold text-neutral-900">{text}</h3>
  }
  return <span aria-hidden="true" className="block h-[1.5cqw] w-[42%] rounded-full bg-neutral-800" />
}

function Copy({ centered, text }: { centered?: boolean; text?: string }) {
  if (text) {
    return <p className={`text-[1.4cqw] leading-[1.45] text-neutral-600 ${centered ? 'text-center' : ''}`}>{text}</p>
  }
  return (
    <span aria-hidden="true" className={`flex w-full flex-col gap-[0.8cqw] ${centered ? 'items-center' : ''}`}>
      <span className="h-[0.9cqw] w-full rounded-full bg-neutral-300" />
      <span className="h-[0.9cqw] w-[82%] rounded-full bg-neutral-300" />
    </span>
  )
}

/**
 * The "Learn More" text link. Most designs set an arrow after it; V2 and V4 don't.
 *
 * Dark rather than green: the design set draws this link in the same warm ink as
 * the labels (#563F3D), and keeps its greens for the numerals and the buttons.
 */
function LinkLine({ text, arrow }: { text?: string; arrow?: boolean }) {
  if (text) {
    return (
      <a href="#" data-role="link" className="text-[1.4cqw] leading-none font-medium text-neutral-800">
        {text}
        {arrow && <> &rarr;</>}
      </a>
    )
  }
  return <span aria-hidden="true" className="block h-[1cqw] w-[34%] rounded-full bg-neutral-500" />
}

/** The solid green "Learn More" button V1 and V3 close their cards with. */
function CardButton({ text }: { text?: string }) {
  if (text) {
    return (
      <button
        type="button"
        data-role="button"
        className="inline-flex h-[3.2cqw] items-center rounded-xs px-[2cqw] text-[1.4cqw] leading-none font-medium text-white"
        style={{ background: GREEN }}
      >
        {text}
      </button>
    )
  }
  return (
    <span aria-hidden="true" data-role="button" className="block h-[2.8cqw] w-[42%] rounded-xs" style={{ background: GREEN }} />
  )
}

/** The card's position, drawn large. Decoration — the order is already in the list. */
function Numeral({ index, small }: { index: number; small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`font-bold leading-none ${small ? 'text-[2.2cqw]' : 'text-[3.2cqw]'}`}
      style={{ color: GREEN }}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  )
}

/** The numeral-and-arrow row V21 and V22 rule off below the link. */
function NumeralFooter({ index }: { index: number }) {
  return (
    <>
      <span aria-hidden="true" className="mt-[0.5cqw] h-px w-full" style={{ background: HAIRLINE }} />
      <span aria-hidden="true" className="flex w-full items-center justify-between">
        <Numeral index={index} small />
        <span className="text-[2.2cqw] leading-none" style={{ color: GREEN }}>
          &rarr;
        </span>
      </span>
    </>
  )
}

/** Background, border and corners of the box a design sets its cards in. */
function container(spec: Spec): { className: string; style?: CSSProperties } {
  const corners = spec.sharp ? '' : 'rounded-xs'
  switch (spec.card) {
    case 'bordered':
      return { className: `border ${corners}`, style: { borderColor: HAIRLINE } }
    case 'tinted':
      return { className: corners, style: { background: TINT } }
    case 'grey':
      return { className: `border ${corners}`, style: { background: GREY, borderColor: HAIRLINE } }
    default:
      return { className: '' }
  }
}

function Item({
  spec,
  index,
  title,
  copy,
  link,
  src,
}: {
  spec: Spec
  index: number
  title?: string
  copy?: string
  link?: string
  src?: string
}) {
  const centered = spec.align === 'center'
  const box = container(spec)
  // A bleeding design pads the copy instead of the card, so the media can reach
  // the card's own edges; everything else pads the card and lets the copy fill it.
  const cardPad = spec.card && !spec.bleed ? 'p-[1.6cqw]' : ''
  const copyPad = spec.card && spec.bleed ? 'p-[1.6cqw]' : ''
  // `rounded-none!`, not `rounded-none`: ImageBlock brings its own `rounded-xs`,
  // and Tailwind emits the radius utilities alphabetically — so plain
  // `rounded-none` lands *earlier* in the stylesheet and loses, whatever the
  // class order says. (`border-0` needs no such help; it sorts after `border`.)
  const sharp = spec.sharp ? 'rounded-none!' : ''

  const stack = `flex min-w-0 flex-col gap-[1cqw] ${centered ? 'items-center text-center' : 'items-start'}`

  const copyBlock = (
    <div className={`${stack} ${copyPad} flex-1`}>
      {spec.numeral === 'top' && <Numeral index={index} />}
      <Label text={title} />
      <Copy centered={centered} text={copy} />
      {spec.link === 'button' ? <CardButton text={link} /> : <LinkLine text={link} arrow={spec.link !== 'plain'} />}
      {spec.numeral === 'footer' && <NumeralFooter index={index} />}
    </div>
  )

  // Media beside the copy: the tall panel of the two-column designs, or a thumb
  // moved to the left of the text.
  if (spec.media === 'panel' || (spec.media === 'thumb' && spec.beside)) {
    const panel = spec.media === 'panel'
    return (
      <li
        className={`flex items-stretch gap-[1.6cqw] overflow-hidden ${cardPad} ${box.className}`}
        style={box.style}
      >
        <ImageBlock
          className={
            panel
              ? // Bleeding, it fills the card's left edge top to bottom — squared off,
                // and left to the card's own overflow to round it back where the
                // corners meet. Free-standing, it keeps the near-square the design
                // draws it at.
                `w-[29%] shrink-0 ${spec.bleed ? 'self-stretch rounded-none! border-0' : 'aspect-[0.87]'}`
              : 'size-[5cqw] shrink-0'
          }
          src={src}
        />
        {copyBlock}
      </li>
    )
  }

  return (
    <li className={`flex flex-col gap-[1cqw] overflow-hidden ${cardPad} ${box.className}`} style={box.style}>
      {spec.media === 'wide' && (
        // 373×195 as drawn, so the block stays the same landscape at any width.
        <ImageBlock className={`aspect-[1.9] w-full ${sharp} ${spec.bleed ? 'border-0' : ''}`} src={src} />
      )}
      {spec.media === 'thumb' && <ImageBlock className={`size-[5cqw] ${sharp} ${centered ? 'self-center' : ''}`} src={src} />}
      {copyBlock}
    </li>
  )
}

/** Miniature of what the content card grid will look like on the page. */
export default function ContentCardPreview({
  design,
  rows,
  content,
}: ContentCardChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const cols = spec.cols ?? 3
  const count = Number(rows) * cols
  const titles = linesOf(content?.items)
  // "Learn more" is the card link; the header button carries its own label.
  const link = titles.length ? 'Learn more' : undefined

  return (
    <section aria-label="What we do" className="flex h-full flex-col gap-[3cqw] px-[5cqw] py-[4cqw]">
      {spec.header === 'left' ? (
        <div className="flex flex-col gap-[1.2cqw]">
          <div className="flex items-center justify-between gap-[2cqw]">
            <HeadlineLine className={content?.heading ? 'w-[60%]' : 'w-[22%]'} text={content?.heading} />
            <OutlineButton label={content?.cta} />
          </div>
          <BodyLine className="w-[54%]" text={content?.body} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-[1.2cqw] text-center">
          <HeadlineLine className={content?.heading ? 'w-[70%]' : 'w-[30%]'} text={content?.heading} />
          <BodyLine className="w-[60%]" text={content?.body} />
          <div className="mt-[0.5cqw]">
            <OutlineButton label={content?.cta} />
          </div>
        </div>
      )}

      <ul
        className={`grid gap-x-[2.8cqw] gap-y-[2.8cqw] ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
      >
        {Array.from({ length: count }, (_, i) => (
          <Item
            key={i}
            spec={spec}
            index={i}
            title={titles.length ? itemAt(content?.items, i) : undefined}
            copy={content?.itemBody}
            link={link}
            src={content?.image}
          />
        ))}
      </ul>
    </section>
  )
}

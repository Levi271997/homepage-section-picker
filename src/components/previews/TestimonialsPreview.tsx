'use client'

import type { CSSProperties } from 'react'
import { useCarousel } from '@/components/previews/useCarousel'
import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v6'. */
export type TestimonialsDesign = string

export type TestimonialsChoice = {
  design: TestimonialsDesign
}

const GREEN = 'var(--brand,#3f6b30)'
const DIM_GREEN = 'var(--brand-dim,#82b764)'
const PANEL = 'var(--brand-soft,#f2f8ed)'
const TAN = 'var(--brand-accent,#a1806a)'
/** The warm tan the drawn cards are outlined in, straight off the artwork. */
const HAIRLINE = '#b59f8f'
const GOLD = '#ffd245'
const GREY_STAR = '#d0c3b8'

/**
 * What each design is made of.
 *
 * The six designs are variations on three frames — a grid of quote cards, one
 * quote paged by arrows, and a portrait beside each quote — so they're described
 * here as data rather than written out as six components. A new export from the
 * design file is usually one more line in this table.
 *
 * Read off the artwork itself: the #B59F8F card outlines, the #F2F8ED carousel
 * panel, the four-gold-one-grey star row, the 48px avatar and the 200×278
 * portrait are all measured from the SVGs in `public/design-sets`.
 */
type Spec = {
  /** cards in a grid | one quote paged by arrows | a portrait beside each quote */
  frame: 'grid' | 'carousel' | 'media'
  /** Header centred over the section, or set left against the margin. */
  header: 'centered' | 'left'
  /** What opens each quote — a star rating, or the green speech bubble. */
  mark: 'stars' | 'quote'
  /** What encloses each quote. The grid designs each pick one. */
  card?: 'bordered' | 'raised' | 'plain'
  /** Columns across, and how many rows of them. */
  columns?: number
  rows?: number
}

const SPECS: Record<string, Spec> = {
  v1: { frame: 'grid', header: 'centered', mark: 'stars', card: 'bordered', columns: 3, rows: 1 },
  v2: { frame: 'carousel', header: 'centered', mark: 'quote' },
  v3: { frame: 'grid', header: 'left', mark: 'stars', card: 'plain', columns: 3, rows: 1 },
  v4: { frame: 'media', header: 'left', mark: 'stars', columns: 2, rows: 2 },
  v5: { frame: 'grid', header: 'centered', mark: 'quote', card: 'raised', columns: 3, rows: 1 },
  v6: { frame: 'grid', header: 'centered', mark: 'stars', card: 'bordered', columns: 3, rows: 2 },
}

/**
 * Four gold stars and one grey, as every starred design draws them.
 *
 * The rating is the same in all of them, so it's stated once here rather than
 * being made a choice the picker would have to carry.
 */
function Stars() {
  return (
    <p className="flex gap-[0.3cqw] text-[2.2cqw] leading-none">
      <span className="sr-only">Rated 4 out of 5</span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true" style={{ color: i < 4 ? GOLD : GREY_STAR }}>
          ★
        </span>
      ))}
    </p>
  )
}

/**
 * The green speech bubble the carousel and the raised cards open with.
 *
 * Traced from the artwork — one path with the two quote glyphs wound the other
 * way, so the default non-zero fill leaves them as holes.
 */
function QuoteMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[2.6cqw] w-[2.6cqw]" fill={GREEN} aria-hidden="true">
      <path d="M0 0H32V26H19L10 32V26H0V0ZM15 7H8V14H12V16H9V19H15V7ZM24 7H17V14H21V16H18V19H24V7Z" />
    </svg>
  )
}

function Mark({ spec }: { spec: Spec }) {
  return spec.mark === 'quote' ? <QuoteMark /> : <Stars />
}

/** The arrow inside a carousel button — a rule with a head, as drawn. */
function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 12" className="h-[1.4cqw] w-[1.9cqw]" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M15 6H1m5-5L1 6l5 5' : 'M1 6h14m-5-5l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** The four lines of quote each design sets, or the client's own words. */
function Quote({ centered, text }: { centered?: boolean; text?: string }) {
  if (text) {
    return (
      <p className={`block text-[1.7cqw] leading-normal text-neutral-700 ${centered ? 'text-center' : ''}`}>
        &ldquo;{text}&rdquo;
      </p>
    )
  }
  return (
    <span aria-hidden="true" className={`flex flex-col gap-[0.9cqw] ${centered ? 'items-center' : ''}`}>
      <BodyLine className="w-full" />
      <BodyLine className="w-[95%]" />
      <BodyLine className={centered ? 'w-[70%]' : 'w-[85%]'} />
      <BodyLine className={centered ? 'w-[40%]' : 'w-[55%]'} />
    </span>
  )
}

/** The name and the "Position at Company Name" under it. */
function Named({ name, role, centered }: { name?: string; role?: string; centered?: boolean }) {
  return (
    <span className={`flex min-w-0 flex-col gap-[0.7cqw] ${centered ? 'items-center' : ''}`}>
      {name ? (
        <cite className="text-[1.6cqw] leading-none font-semibold text-neutral-900 not-italic">{name}</cite>
      ) : (
        <span aria-hidden="true" className="h-[1.3cqw] w-[13cqw] rounded-full bg-neutral-900" />
      )}
      {role ? (
        <span className="text-[1.4cqw] leading-none" style={{ color: TAN }}>
          {role}
        </span>
      ) : (
        <span aria-hidden="true" className="h-[1cqw] w-[18cqw] rounded-full" style={{ background: TAN }} />
      )}
    </span>
  )
}

/**
 * Avatar, name and role. 48px square in every design that draws one, beside the
 * name in the grids and above it in the carousel.
 */
function Attribution({
  stacked,
  name,
  role,
  src,
}: {
  stacked?: boolean
  name?: string
  role?: string
  src?: string
}) {
  return stacked ? (
    <figcaption className="flex flex-col items-center gap-[1.4cqw]">
      <ImageBlock className="size-[3.4cqw]" src={src} />
      <Named name={name} role={role} centered />
    </figcaption>
  ) : (
    <figcaption className="flex items-center gap-[1.6cqw]">
      <ImageBlock className="size-[3.4cqw] shrink-0" src={src} />
      <Named name={name} role={role} />
    </figcaption>
  )
}

/** Background, border and corners of the box a design sets its quotes in. */
function container(spec: Spec): { className: string; style?: CSSProperties } {
  switch (spec.card) {
    case 'bordered':
      return { className: 'rounded-xs border p-[1.6cqw]', style: { borderColor: HAIRLINE } }
    case 'raised':
      return { className: 'rounded-sm bg-white p-[1.6cqw] shadow-[0_1.2cqw_2.2cqw_rgba(62,52,69,0.10)]' }
    default:
      return { className: '' }
  }
}

/** One quote in a grid: the mark, the words, and who said them. */
function QuoteCard({
  spec,
  quote,
  name,
  role,
  src,
}: {
  spec: Spec
  quote?: string
  name?: string
  role?: string
  src?: string
}) {
  const box = container(spec)
  return (
    <li>
      {/* Justified, so the attribution sits on the card's floor however long
          the quote above it runs — as the artwork lines them up across a row. */}
      <figure className={`flex h-full flex-col gap-[1.8cqw] ${box.className}`} style={box.style}>
        <Mark spec={spec} />
        <blockquote className="flex-1">
          <Quote text={quote} />
        </blockquote>
        <Attribution name={name} role={role} src={src} />
      </figure>
    </li>
  )
}

/** A tall portrait with the quote beside it, as V4 pairs them. */
function MediaQuote({
  spec,
  quote,
  name,
  role,
  src,
}: {
  spec: Spec
  quote?: string
  name?: string
  role?: string
  src?: string
}) {
  return (
    <li>
      <figure className="flex items-stretch gap-[2.3cqw]">
        {/* 200×278 as drawn — upright, and the full height of the row. */}
        <ImageBlock className="w-[35%] shrink-0 self-stretch" src={src} />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-[1.6cqw]">
          <div className="flex flex-col gap-[1.6cqw]">
            <Mark spec={spec} />
            <blockquote>
              <Quote text={quote} />
            </blockquote>
          </div>
          {/* No avatar here: the portrait is already the picture of the person. */}
          <figcaption>
            <Named name={name} role={role} />
          </figcaption>
        </div>
      </figure>
    </li>
  )
}

/** Eyebrow, heading, sentence and button — centred, or set against the margin. */
function Header({ spec, content }: { spec: Spec; content?: SectionContent }) {
  const centered = spec.header === 'centered'
  return (
    <div className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine
        className={content?.heading ? (centered ? 'w-[70%]' : 'w-[60%]') : centered ? 'w-[34%]' : 'w-[30%]'}
        text={content?.heading}
      />
      <BodyLine className={centered ? 'w-[64%]' : 'w-[70%]'} text={content?.body} />
      <div className="mt-[0.5cqw]">
        <FilledButton label={content?.cta} />
      </div>
    </div>
  )
}

/** Miniature of what the testimonials will look like on the page. */
export default function TestimonialsPreview({
  design,
  content,
}: TestimonialsChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const quotes = linesOf(content?.items)

  /** Everything one testimonial needs, wrapping so short lists still fill a grid. */
  const at = (i: number) => ({
    quote: quotes.length ? itemAt(content?.items, i) : undefined,
    name: itemAt(content?.names, i) || undefined,
    role: itemAt(content?.roles, i) || undefined,
    src: content?.image,
  })

  // One slide per quote. With no quotes typed the wireframe still shows the
  // design's five dots, so the carousel reads as a carousel either way.
  const slides = quotes.length || 5
  const { slide, setSlide, containerProps, motion } = useCarousel({
    slides,
    enabled: spec.frame === 'carousel',
  })

  if (spec.frame === 'carousel') {
    // Square 40px buttons, outlined in green. The drawing greys the left one to
    // show the first slide; this one wraps, so neither arrow is ever a dead end.
    const arrowButton =
      'flex size-[2.8cqw] shrink-0 items-center justify-center border transition-colors hover:bg-[color:var(--brand-soft,#f2f8ed)]'

    return (
      <section aria-label="Testimonials" className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
        <Header spec={spec} content={content} />

        <div {...containerProps} className={`flex flex-col items-center gap-[2.8cqw] ${containerProps.className}`}>
          {/* The arrows sit inside the section's own margin and the panel is
              narrower again — 176.5 and 276 of 1440 as drawn, which is what the
              extra padding and the wide gap add up to. */}
          <div className="flex w-full items-center gap-[4.15cqw] px-[7.25cqw]">
            <button
              type="button"
              data-role="control"
              aria-label="Previous testimonial"
              onClick={() => setSlide((n) => (n - 1 + slides) % slides)}
              className={arrowButton}
              style={{ borderColor: GREEN, color: GREEN }}
            >
              <Arrow direction="left" />
            </button>

            <div
              className="flex flex-1 flex-col items-center gap-[2cqw] overflow-hidden rounded-sm px-[4cqw] py-[3cqw]"
              style={{ background: PANEL }}
            >
              {/* Keyed on the slide so the transition replays each time it changes. */}
              <figure key={slide} {...motion} className={`${motion.className} flex flex-col items-center gap-[2cqw]`}>
                <Mark spec={spec} />
                <blockquote>
                  <Quote centered text={at(slide).quote} />
                </blockquote>
                <Attribution stacked name={at(slide).name} role={at(slide).role} src={at(slide).src} />
              </figure>
            </div>

            <button
              type="button"
              data-role="control"
              aria-label="Next testimonial"
              onClick={() => setSlide((n) => (n + 1) % slides)}
              className={arrowButton}
              style={{ borderColor: GREEN, color: GREEN }}
            >
              <Arrow direction="right" />
            </button>
          </div>

          <div className="flex items-center gap-[1.2cqw]">
            {Array.from({ length: slides }, (_, i) => (
              <button
                key={i}
                type="button"
                data-role="control"
                aria-label={`Testimonial ${i + 1}`}
                aria-current={i === slide || undefined}
                onClick={() => setSlide(i)}
                className="size-[0.9cqw] rounded-full"
                style={{ background: i === slide ? GREEN : DIM_GREEN }}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const columns = spec.columns ?? 3
  const count = columns * (spec.rows ?? 1)

  return (
    <section aria-label="Testimonials" className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      <Header spec={spec} content={content} />

      <ul
        className={`grid items-stretch gap-x-[2.8cqw] gap-y-[2.8cqw] ${
          columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {Array.from({ length: count }, (_, i) =>
          spec.frame === 'media' ? (
            <MediaQuote key={i} spec={spec} {...at(i)} />
          ) : (
            <QuoteCard key={i} spec={spec} {...at(i)} />
          ),
        )}
      </ul>
    </section>
  )
}

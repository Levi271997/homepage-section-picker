'use client'

import { useCarousel } from '@/components/previews/useCarousel'
import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine } from '@/components/previews/parts'

export type TestimonialsChoice = {
  layout: string
  mark: string
  card: string
  header: string
  rows: string
}

const GREEN = 'var(--brand,#3f6b30)'
const GOLD = '#f5c02c'
const TAN = 'var(--brand-accent,#a1806a)'
const AVATAR = '#d7e9fb'

/** Four gold stars and one grey, as in the design. */
function Stars() {
  return (
    <span className="flex gap-[0.6cqw] text-[2.6cqw] leading-none">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < 4 ? GOLD : '#cfcfcf' }}>
          ★
        </span>
      ))}
    </span>
  )
}

/** The solid green quote badge. */
function QuoteMark() {
  return <span className="block size-[4cqw] rounded-xs rounded-bl-none" style={{ background: GREEN }} />
}

function Mark({ mark }: { mark: string }) {
  return mark === 'quote' ? <QuoteMark /> : <Stars />
}

/** The chevron inside a carousel arrow button. */
function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 10 14" className="h-[2cqw] w-[1.6cqw]" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M7 1L2 7l5 6' : 'M3 1l5 6-5 6'}
        stroke={GREEN}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function QuoteLines({ centered, text }: { centered?: boolean; text?: string }) {
  if (text) {
    return (
      <span className={`block text-[1.7cqw] leading-normal text-neutral-700 ${centered ? 'text-center' : ''}`}>
        &ldquo;{text}&rdquo;
      </span>
    )
  }
  return (
    <span className={`flex flex-col gap-[0.9cqw] ${centered ? 'items-center' : ''}`}>
      <BodyLine className="w-full" />
      <BodyLine className="w-[95%]" />
      <BodyLine className={centered ? 'w-[70%]' : 'w-[80%]'} />
      <BodyLine className={centered ? 'w-[40%]' : 'w-[55%]'} />
    </span>
  )
}

/** The portrait square — the client's own image when they've supplied one. */
function Avatar({ src, className }: { src?: string; className: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary URL or data URI
      <img src={src} alt="" loading="lazy" className={`${className} rounded-xs object-cover`} />
    )
  }
  return <span className={`${className} rounded-xs`} style={{ background: AVATAR }} />
}

/** Avatar, name and "Position at Company Name". */
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
  const text = (
    <span className={`flex flex-col gap-[0.7cqw] ${stacked ? 'items-center' : ''}`}>
      {name ? (
        <span className="text-[1.6cqw] leading-none font-semibold text-neutral-900">{name}</span>
      ) : (
        <span className="h-[1.3cqw] w-[13cqw] rounded-full bg-neutral-900" />
      )}
      {role ? (
        <span className="text-[1.4cqw] leading-none" style={{ color: TAN }}>
          {role}
        </span>
      ) : (
        <span className="h-[1cqw] w-[18cqw] rounded-full" style={{ background: TAN }} />
      )}
    </span>
  )

  return stacked ? (
    <span className="flex flex-col items-center gap-[1.4cqw]">
      <Avatar src={src} className="size-[6cqw]" />
      {text}
    </span>
  ) : (
    <span className="flex items-center gap-[1.6cqw]">
      <Avatar src={src} className="size-[6cqw] shrink-0" />
      {text}
    </span>
  )
}

function QuoteCard({
  mark,
  card,
  quote,
  name,
  role,
  src,
}: {
  mark: string
  card: string
  quote?: string
  name?: string
  role?: string
  src?: string
}) {
  const shell =
    card === 'bordered'
      ? 'rounded-[3px] border border-neutral-200 p-[2.5cqw]'
      : card === 'shadow'
        ? 'rounded-[3px] bg-white p-[2.5cqw] shadow-md'
        : ''

  return (
    <span className={`flex flex-col gap-[1.8cqw] ${shell}`}>
      <Mark mark={mark} />
      <QuoteLines text={quote} />
      <span className="mt-[0.5cqw]">
        <Attribution name={name} role={role} src={src} />
      </span>
    </span>
  )
}

/** Portrait block beside the quote. */
function MediaQuote({
  mark,
  quote,
  name,
  role,
  src,
}: {
  mark: string
  quote?: string
  name?: string
  role?: string
  src?: string
}) {
  return (
    <span className="flex items-start gap-[2.5cqw]">
      <Avatar src={src} className="h-[26cqw] w-[32%] shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
        <Mark mark={mark} />
        <QuoteLines text={quote} />
        <span className="flex flex-col gap-[0.7cqw]">
          {name ? (
            <span className="text-[1.6cqw] leading-none font-semibold text-neutral-900">{name}</span>
          ) : (
            <span className="h-[1.3cqw] w-[35%] rounded-full bg-neutral-900" />
          )}
          {role ? (
            <span className="text-[1.4cqw] leading-none" style={{ color: TAN }}>
              {role}
            </span>
          ) : (
            <span className="h-[1cqw] w-[52%] rounded-full" style={{ background: TAN }} />
          )}
        </span>
      </span>
    </span>
  )
}

/** Miniature of what the testimonials will look like on the page. */
export default function TestimonialsPreview({
  layout,
  mark,
  card,
  header,
  rows,
  content,
}: TestimonialsChoice & { content?: SectionContent }) {
  const centered = header === 'centered'
  const quotes = linesOf(content?.items)

  // One slide per quote. With no quotes typed the wireframe still shows the
  // design's five dots, so the carousel reads as a carousel either way.
  const slides = quotes.length || 5

  // Only the carousel moves. The grid and the image-and-quote pairs are static
  // blocks of text, and text that reshuffles itself is hard to read.
  const isCarousel = layout === 'carousel'
  const { slide, setSlide, step, containerProps, motion } = useCarousel({
    slides,
    enabled: isCarousel,
  })

  /** Everything one testimonial needs, wrapping so short lists still fill a grid. */
  const at = (i: number) => ({
    quote: quotes.length ? itemAt(content?.items, i) : undefined,
    name: itemAt(content?.names, i) || undefined,
    role: itemAt(content?.roles, i) || undefined,
    src: content?.image,
  })

  const heading = (
    <span className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine className={content?.heading ? 'w-[70%]' : centered ? 'w-[34%]' : 'w-[30%]'} text={content?.heading} />
      <BodyLine className={centered ? 'w-[64%]' : 'w-[58%]'} text={content?.body} />
      <span className="mt-[0.5cqw]">
        <FilledButton label={content?.cta} />
      </span>
    </span>
  )

  return (
    <div className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      {heading}

      {layout === 'carousel' && (
        <div {...containerProps} className={`flex flex-col items-center gap-[2.5cqw] ${containerProps.className}`}>
          <span className="flex w-full items-center gap-[2.5cqw]">
            <span
              data-role="control"
              aria-label="Previous testimonial"
              onClick={() => setSlide((n) => (n - 1 + slides) % slides)}
              className="flex size-[5cqw] shrink-0 items-center justify-center rounded-xs border"
              style={{ borderColor: GREEN }}
            >
              <Arrow direction="left" />
            </span>

            <span
              className="flex flex-1 flex-col items-center gap-[2cqw] overflow-hidden rounded-sm px-[8cqw] py-[3.5cqw]"
              style={{ background: 'var(--brand-soft,#eef4ea)' }}
            >
              {/* Keyed on the slide so the transition replays each time it changes. */}
              <span
                key={slide}
                {...motion}
                className={`${motion.className} flex flex-col items-center gap-[2cqw]`}
              >
                <Mark mark={mark} />
                <QuoteLines centered text={at(slide).quote} />
                <Attribution stacked name={at(slide).name} role={at(slide).role} src={at(slide).src} />
              </span>
            </span>

            <span
              data-role="control"
              aria-label="Next testimonial"
              onClick={() => setSlide((n) => (n + 1) % slides)}
              className="flex size-[5cqw] shrink-0 items-center justify-center rounded-xs border"
              style={{ borderColor: GREEN }}
            >
              <Arrow direction="right" />
            </span>
          </span>

          <span className="flex items-center gap-[1.2cqw]">
            {Array.from({ length: slides }, (_, i) => (
              <span
                key={i}
                data-role="control"
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setSlide(i)}
                className="size-[1.3cqw] rounded-full"
                style={{ background: i === slide ? GREEN : 'var(--brand-dim,#8cbb7c)' }}
              />
            ))}
          </span>
        </div>
      )}

      {layout === 'grid' && (
        <div className="grid grid-cols-3 items-start gap-x-[3cqw] gap-y-[3cqw]">
          {Array.from({ length: Number(rows) * 3 }, (_, i) => (
            <QuoteCard key={i} mark={mark} card={card} {...at(i)} />
          ))}
        </div>
      )}

      {layout === 'media' && (
        <div className="grid grid-cols-2 items-start gap-x-[4cqw] gap-y-[3.5cqw]">
          {Array.from({ length: Number(rows) * 2 }, (_, i) => (
            <MediaQuote key={i} mark={mark} {...at(i)} />
          ))}
        </div>
      )}
    </div>
  )
}

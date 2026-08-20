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
    <p className="flex gap-[0.6cqw] text-[2.6cqw] leading-none">
      <span className="sr-only">Rated 4 out of 5</span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true" style={{ color: i < 4 ? GOLD : '#cfcfcf' }}>
          ★
        </span>
      ))}
    </p>
  )
}

/** The solid green quote badge. */
function QuoteMark() {
  return <span aria-hidden="true" className="block size-[4cqw] rounded-xs rounded-bl-none" style={{ background: GREEN }} />
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
      <p className={`block text-[1.7cqw] leading-normal text-neutral-700 ${centered ? 'text-center' : ''}`}>
        &ldquo;{text}&rdquo;
      </p>
    )
  }
  return (
    <span aria-hidden="true" className={`flex flex-col gap-[0.9cqw] ${centered ? 'items-center' : ''}`}>
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
  return <span aria-hidden="true" className={`${className} rounded-xs`} style={{ background: AVATAR }} />
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

  return stacked ? (
    <figcaption className="flex flex-col items-center gap-[1.4cqw]">
      <Avatar src={src} className="size-[6cqw]" />
      {text}
    </figcaption>
  ) : (
    <figcaption className="flex items-center gap-[1.6cqw]">
      <Avatar src={src} className="size-[6cqw] shrink-0" />
      {text}
    </figcaption>
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
    <li>
      <figure className={`flex flex-col gap-[1.8cqw] ${shell}`}>
        <Mark mark={mark} />
        <blockquote>
          <QuoteLines text={quote} />
        </blockquote>
        <div className="mt-[0.5cqw]">
          <Attribution name={name} role={role} src={src} />
        </div>
      </figure>
    </li>
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
    <li>
      <figure className="flex items-start gap-[2.5cqw]">
        <Avatar src={src} className="h-[26cqw] w-[32%] shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
          <Mark mark={mark} />
          <blockquote>
            <QuoteLines text={quote} />
          </blockquote>
          <figcaption className="flex flex-col gap-[0.7cqw]">
            {name ? (
              <cite className="text-[1.6cqw] leading-none font-semibold text-neutral-900 not-italic">{name}</cite>
            ) : (
              <span aria-hidden="true" className="h-[1.3cqw] w-[35%] rounded-full bg-neutral-900" />
            )}
            {role ? (
              <span className="text-[1.4cqw] leading-none" style={{ color: TAN }}>
                {role}
              </span>
            ) : (
              <span aria-hidden="true" className="h-[1cqw] w-[52%] rounded-full" style={{ background: TAN }} />
            )}
          </figcaption>
        </div>
      </figure>
    </li>
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
    <div className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine className={content?.heading ? 'w-[70%]' : centered ? 'w-[34%]' : 'w-[30%]'} text={content?.heading} />
      <BodyLine className={centered ? 'w-[64%]' : 'w-[58%]'} text={content?.body} />
      <div className="mt-[0.5cqw]">
        <FilledButton label={content?.cta} />
      </div>
    </div>
  )

  return (
    <section aria-label="Testimonials" className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      {heading}

      {layout === 'carousel' && (
        <div {...containerProps} className={`flex flex-col items-center gap-[2.5cqw] ${containerProps.className}`}>
          <div className="flex w-full items-center gap-[2.5cqw]">
            <button
              type="button"
              data-role="control"
              aria-label="Previous testimonial"
              onClick={() => setSlide((n) => (n - 1 + slides) % slides)}
              className="flex size-[5cqw] shrink-0 items-center justify-center rounded-xs border"
              style={{ borderColor: GREEN }}
            >
              <Arrow direction="left" />
            </button>

            <div
              className="flex flex-1 flex-col items-center gap-[2cqw] overflow-hidden rounded-sm px-[8cqw] py-[3.5cqw]"
              style={{ background: 'var(--brand-soft,#eef4ea)' }}
            >
              {/* Keyed on the slide so the transition replays each time it changes. */}
              <figure key={slide} {...motion} className={`${motion.className} flex flex-col items-center gap-[2cqw]`}>
                <Mark mark={mark} />
                <blockquote>
                  <QuoteLines centered text={at(slide).quote} />
                </blockquote>
                <Attribution stacked name={at(slide).name} role={at(slide).role} src={at(slide).src} />
              </figure>
            </div>

            <button
              type="button"
              data-role="control"
              aria-label="Next testimonial"
              onClick={() => setSlide((n) => (n + 1) % slides)}
              className="flex size-[5cqw] shrink-0 items-center justify-center rounded-xs border"
              style={{ borderColor: GREEN }}
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
                className="size-[1.3cqw] rounded-full"
                style={{ background: i === slide ? GREEN : 'var(--brand-dim,#8cbb7c)' }}
              />
            ))}
          </div>
        </div>
      )}

      {layout === 'grid' && (
        <ul className="grid grid-cols-3 items-start gap-x-[3cqw] gap-y-[3cqw]">
          {Array.from({ length: Number(rows) * 3 }, (_, i) => (
            <QuoteCard key={i} mark={mark} card={card} {...at(i)} />
          ))}
        </ul>
      )}

      {layout === 'media' && (
        <ul className="grid grid-cols-2 items-start gap-x-[4cqw] gap-y-[3.5cqw]">
          {Array.from({ length: Number(rows) * 2 }, (_, i) => (
            <MediaQuote key={i} mark={mark} {...at(i)} />
          ))}
        </ul>
      )}
    </section>
  )
}

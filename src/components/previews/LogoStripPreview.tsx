'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import 'swiper/css'

import { linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Dots, Eyebrow, FilledButton, HeadlineLine, LogoMark, LogoRow } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v3'. */
export type LogoStripDesign = string

export type LogoStripChoice = {
  design: LogoStripDesign
}

/** How many logos fit on one row — six across, as all three designs are drawn. */
const PER_PAGE = 6

/**
 * The gutter between logos, as a share of the strip's width.
 *
 * The set draws 40 between them and `px-[5cqw]` leaves the strip 1296 wide, so
 * 40/1296. A percentage rather than the pixels Swiper usually takes, because
 * everything in a preview is sized against the container and a fixed gutter
 * would be wrong at every width but one.
 */
const GUTTER = '3.09%'

/**
 * What each design is made of.
 *
 * Three variations on one strip — six logos across at 166.667×78 on a 40px
 * gutter, which is the same row in all of them. What differs is whether the
 * strip opens with a heading block, how many rows it runs to, and whether it
 * pages. Described here as data so a new export is one more line.
 */
type Spec = {
  /** The eyebrow, heading, sentence and button block above the logos. */
  header?: boolean
  /** Rows of logos. One row pages through the list; three stand still. */
  rows: number
  /** Paging dots under the strip. */
  dots?: boolean
}

const SPECS: Record<string, Spec> = {
  v1: { header: true, rows: 1, dots: true },
  v2: { rows: 1, dots: true },
  v3: { header: true, rows: 3 },
}

/**
 * Eyebrow, heading, one line of copy and a single button, centred as drawn.
 *
 * The block carries its own width — 62%, which is what the drawn sentence spans
 * — rather than each line taking a fraction of it. Under `items-center` the
 * wrapper is otherwise sized by its widest child, so a `w-4/5` heading would be
 * four fifths of itself and wrap for no reason.
 */
function Header({ content }: { content?: SectionContent }) {
  return (
    <div className="flex w-[62%] flex-col items-center gap-[1.5cqw] text-center">
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine className="w-full" text={content?.heading} />
      <BodyLine className="w-full" text={content?.body} />
      <div className="mt-[1cqw]">
        <FilledButton label={content?.cta} />
      </div>
    </div>
  )
}

/** Miniature of what the logo strip will look like on the page. */
export default function LogoStripPreview({
  design,
  content,
}: LogoStripChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const names = linesOf(content?.items)
  const logos = names.length ? names : undefined

  // Only the one-row designs page. Three rows is a block of text standing still,
  // and a grid that reshuffles itself is hard to read.
  const pages = names.length ? Math.max(1, Math.ceil(names.length / PER_PAGE)) : 5

  /*
   * V1 and V2 page on Swiper. A slide is one logo, six of them in view, so the
   * strip moves a logo at a time — `slidesPerGroup` is already 1, which is what
   * makes that the default behaviour once the slides are cut per logo.
   *
   * The dots stay ours: Swiper's own pagination is off by default and the set
   * draws these in the brand green. They still step a whole row, because the
   * design draws a handful of them and one dot per logo would be thirteen. So
   * they say which sixth of the list you're in — `slideTo` on the way in,
   * `activeIndex` on the way back, floored to its page.
   */
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [index, setIndex] = useState(0)
  const slide = Math.min(Math.floor(index / PER_PAGE), pages - 1)

  /**
   * Dots page through the strip; without names they're the design's inert five.
   * The working ones are real buttons, since they do something when clicked.
   */
  const paging = (
    <div className="flex items-center gap-[1.2cqw]">
      {names.length ? (
        Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            data-role="control"
            aria-label={`Logos, page ${i + 1}`}
            aria-current={i === slide || undefined}
            onClick={() => swiper?.slideTo(i * PER_PAGE)}
            className="size-[1.3cqw] rounded-full"
            style={{ background: i === slide ? 'var(--brand,#3f6b30)' : 'var(--brand-dim,#8cbb7c)' }}
          />
        ))
      ) : (
        <Dots />
      )}
    </div>
  )

  const strip = (
    // `wrapperTag`/`tag` keep the list markup Swiper would otherwise take over:
    // a strip of logos is a list, whether or not it happens to slide.
    <Swiper
      className="w-full"
      wrapperTag="ul"
      slidesPerView={PER_PAGE}
      spaceBetween={GUTTER}
      onSwiper={setSwiper}
      onSlideChange={(s) => setIndex(s.activeIndex)}
    >
      {Array.from({ length: names.length || PER_PAGE }, (_, i) => (
        <SwiperSlide key={i} tag="li">
          <LogoMark name={logos?.[i]} />
        </SwiperSlide>
      ))}
    </Swiper>
  )

  // 80px of margin top and bottom and 120 either side, as all three are drawn.
  const frame = 'flex h-full flex-col items-center justify-center gap-[4cqw] px-[5cqw] py-[5.5cqw]'

  // No heading at all: the bare strip is the shortest design in the set.
  if (!spec.header) {
    return (
      <section aria-label="Client logos" className={`${frame} overflow-hidden`}>
        {strip}
        {paging}
      </section>
    )
  }

  return (
    <section aria-label="Client logos" className={frame}>
      <Header content={content} />

      {spec.rows > 1 ? (
        // Each row starts further along the list, so the grid isn't three
        // identical rows. 64px between them, wider than the 40px gutter.
        <div className="flex w-full flex-col gap-[4.4cqw]">
          {Array.from({ length: spec.rows }, (_, row) => (
            <LogoRow key={row} names={logos} offset={row * PER_PAGE} />
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-[4cqw] overflow-hidden">
          {strip}
          {spec.dots && paging}
        </div>
      )}
    </section>
  )
}

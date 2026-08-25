'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'
import 'swiper/css'

import { linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { usePreviewMode } from '@/components/previews/mode'
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

/** How long a logo holds before the strip moves on. */
const DELAY = 3000

/**
 * It rewinds rather than loops.
 *
 * Looping is the obvious way to give autoplay somewhere to go at the end, and
 * it doesn't survive here. Swiper reorders the slides to fake the seam, and
 * with six of them in view over a list of eighteen it runs out of slides to
 * move: watched for 75 seconds untouched, `activeIndex` stopped tracking the
 * real one around the thirteenth logo and the instance wedged with
 * `animating` stuck true, where it stayed. `loopAdditionalSlides` made it
 * worse — the headroom comes out of the same eighteen.
 *
 * Rewinding reorders nothing. The strip runs to the last full row and sweeps
 * back to the first, which is a movement you can see rather than a seam you
 * can't, and it doesn't stop.
 */
const AUTOPLAY = {
  delay: DELAY,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
  /*
   * Autoplay normally pauses as a move begins and waits for the wrapper's
   * `transitionend` before restarting its timer. Watched for 75 seconds it
   * stopped on a move whose event never arrived and stayed paused for the
   * remaining 45. Not waiting removes the dependency: the timer restarts as
   * the move begins, 300ms earlier and on nothing but the clock.
   */
  waitForTransition: false,
} as const

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
   * draws these in the brand green. They step a whole row, because the design
   * draws a handful of them and one per logo would be eighteen.
   *
   * Which row each one lands on is `STOPS`, not `i * 6`. The strip stops with
   * the last six still filling the row, so the final page starts wherever that
   * leaves it: eight logos can only reach index 2, and dividing by six floors
   * that to the first dot, so the second one never lit. Reading the stop back
   * marks whichever page the strip has actually reached.
   */
  const mode = usePreviewMode()
  const movable = names.length > PER_PAGE
  // The codebase's rule for every carousel: nothing moves outside the page
  // view, where fourteen quietly animating thumbnails would be a distraction.
  const live = mode === 'interactive' && movable

  /** Where each dot sends the strip — a row apart, up against the end. */
  const last = Math.max(0, names.length - PER_PAGE)
  const stops = Array.from({ length: pages }, (_, i) => Math.min(i * PER_PAGE, last))

  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [index, setIndex] = useState(0)
  const slide = stops.reduce((best, stop, i) => (index >= stop ? i : best), 0)

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
            onClick={() => swiper?.slideTo(stops[i])}
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
      modules={[Autoplay]}
      slidesPerView={PER_PAGE}
      spaceBetween={GUTTER}
      rewind
      allowTouchMove={mode === 'interactive'}
      autoplay={live ? AUTOPLAY : false}
      onSwiper={(s) => {
        setSwiper(s)
        // Read once here rather than through state: the reduced-motion setting
        // doesn't change under us, and stopping the instance beats re-creating
        // it with a different `autoplay` param.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) s.autoplay?.stop()
      }}
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

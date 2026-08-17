'use client'

import { linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { useCarousel } from '@/components/previews/useCarousel'
import { BodyLine, Dots, Eyebrow, FilledButton, HeadlineLine, LogoRow } from '@/components/previews/parts'

export type LogoLayout = 'carousel' | 'headed-grid' | 'headed-carousel'

/** How many logos fit on one row, and therefore one page of the carousel. */
const PER_PAGE = 6

/** Eyebrow, heading, one line of copy and a single button — shared by both headed variants. */
function Heading({ content }: { content?: SectionContent }) {
  return (
    <div className="flex flex-col items-center gap-[1.5cqw] text-center">
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine className={content?.heading ? 'w-4/5' : 'w-3/5'} text={content?.heading} />
      <BodyLine className="w-4/5" text={content?.body} />
      <span className="mt-[1cqw]">
        <FilledButton label={content?.cta} />
      </span>
    </div>
  )
}

/** Miniature of what the logo strip will look like on the page. */
export default function LogoStripPreview({
  layout,
  content,
}: {
  layout: LogoLayout
  content?: SectionContent
}) {
  const names = linesOf(content?.items)
  const logos = names.length ? names : undefined

  // The headed grid is a static block; the other two page through the list.
  const isCarousel = layout !== 'headed-grid'
  const pages = names.length ? Math.max(1, Math.ceil(names.length / PER_PAGE)) : 5
  const { slide, setSlide, live, containerProps, motion } = useCarousel({
    slides: pages,
    enabled: isCarousel,
  })

  /** Dots page through the strip; without names they're the design's inert five. */
  const paging = (
    <span className="flex items-center gap-[1.2cqw]">
      {names.length ? (
        Array.from({ length: pages }, (_, i) => (
          <span
            key={i}
            data-role="control"
            aria-label={`Logos, page ${i + 1}`}
            onClick={() => setSlide(i)}
            className="size-[1.3cqw] rounded-full"
            style={{ background: i === slide ? 'var(--brand,#3f6b30)' : 'var(--brand-dim,#8cbb7c)' }}
          />
        ))
      ) : (
        <Dots />
      )}
    </span>
  )

  /** One page of logos, keyed on the page so it animates in. */
  const strip = (
    <span key={slide} {...motion} className={`${motion.className} block w-full`}>
      <LogoRow names={logos} offset={slide * PER_PAGE} />
    </span>
  )

  if (layout === 'carousel') {
    return (
      <div
        {...containerProps}
        className={`flex h-full flex-col items-center justify-center gap-[5cqw] overflow-hidden px-[4cqw] ${containerProps.className}`}
      >
        {strip}
        {paging}
      </div>
    )
  }

  if (layout === 'headed-grid') {
    return (
      <div className="flex h-full flex-col items-center gap-[3cqw] p-[4cqw]">
        <Heading content={content} />
        <span className="flex w-full flex-col gap-[1.5cqw]">
          {/* Each row starts further along the list so the grid isn't three identical rows. */}
          {[0, 6, 12].map((offset) => (
            <LogoRow key={offset} names={logos} offset={offset} />
          ))}
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center gap-[3cqw] p-[4cqw]">
      <Heading content={content} />
      <span
        {...containerProps}
        className={`flex w-full flex-col items-center gap-[3cqw] overflow-hidden ${containerProps.className}`}
      >
        {strip}
        {paging}
      </span>
    </div>
  )
}

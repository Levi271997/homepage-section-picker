import { linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Dots, Eyebrow, FilledButton, HeadlineLine, LogoRow } from '@/components/previews/parts'

export type LogoLayout = 'carousel' | 'headed-grid' | 'headed-carousel'

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

  if (layout === 'carousel') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-[5cqw] px-[4cqw]">
        <LogoRow names={logos} />
        <Dots />
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
      <LogoRow names={logos} />
      <Dots />
    </div>
  )
}

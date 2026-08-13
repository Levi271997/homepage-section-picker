import { BodyLine, Dots, Eyebrow, FilledButton, HeadlineLine, LogoRow } from '@/components/previews/parts'

export type LogoLayout = 'carousel' | 'headed-grid' | 'headed-carousel'

/** Eyebrow, heading, one line of copy and a single button — shared by both headed variants. */
function Heading() {
  return (
    <div className="flex flex-col items-center gap-[1.5cqw]">
      <Eyebrow />
      <HeadlineLine className="w-3/5" />
      <BodyLine className="w-4/5" />
      <span className="mt-[1cqw]">
        <FilledButton />
      </span>
    </div>
  )
}

/** Miniature of what the logo strip will look like on the page. */
export default function LogoStripPreview({ layout }: { layout: LogoLayout }) {
  if (layout === 'carousel') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-[5cqw] px-[4cqw]">
        <LogoRow />
        <Dots />
      </div>
    )
  }

  if (layout === 'headed-grid') {
    return (
      <div className="flex h-full flex-col items-center gap-[3cqw] p-[4cqw]">
        <Heading />
        <span className="flex w-full flex-col gap-[1.5cqw]">
          <LogoRow />
          <LogoRow />
          <LogoRow />
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center gap-[3cqw] p-[4cqw]">
      <Heading />
      <LogoRow />
      <Dots />
    </div>
  )
}

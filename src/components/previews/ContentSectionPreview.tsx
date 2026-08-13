import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

export type ContentSectionChoice = {
  layout: string
  side: string
  image: string
  header: string
  items: string
}

const GREEN = '#3f6b30'
const TAN = '#a1806a'

const SPLIT_LAYOUTS = ['copy', 'checklist', 'media-list', 'stats', 'mini-cards']

function Buttons() {
  return (
    <span className="mt-[1cqw] flex gap-[1.5cqw]">
      <FilledButton />
      <OutlineButton />
    </span>
  )
}

/** Green tick followed by a line of text. */
function CheckRow() {
  return (
    <span className="flex items-center gap-[1.5cqw]">
      <span className="size-[2cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
      <span className="h-[1cqw] w-[70%] rounded-full bg-neutral-400" />
    </span>
  )
}

/** Thumbnail beside a label and two lines of copy. */
function MediaRow() {
  return (
    <span className="flex items-start gap-[1.8cqw]">
      <ImageBlock className="size-[7cqw] shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col gap-[0.8cqw] pt-[0.5cqw]">
        <span className="h-[1.4cqw] w-[30%] rounded-full bg-neutral-800" />
        <BodyLine className="w-full" />
        <BodyLine className="w-[75%]" />
      </span>
    </span>
  )
}

/** A "200+ / Successful Projects" figure. */
function Stat() {
  return (
    <span className="flex flex-col gap-[0.8cqw]">
      <span className="h-[3cqw] w-[45%] rounded-[1px] bg-neutral-900" />
      <span className="h-[1.1cqw] w-[75%] rounded-full" style={{ background: TAN }} />
    </span>
  )
}

/** One of the small cards in the 2×2 block. */
function MiniCard() {
  return (
    <span className="flex flex-col gap-[1cqw]">
      <ImageBlock className="size-[7cqw]" />
      <span className="h-[1.4cqw] w-[45%] rounded-full bg-neutral-800" />
      <BodyLine className="w-full" />
      <BodyLine className="w-[80%]" />
    </span>
  )
}

/** A text column under a wide image or header. */
function TextColumn({ withImage }: { withImage?: boolean }) {
  return (
    <span className="flex flex-col gap-[1cqw]">
      {withImage && <ImageBlock className="h-[9cqw] w-full" />}
      <span className="h-[1.5cqw] w-[42%] rounded-full bg-neutral-800" />
      <BodyLine className="w-full" />
      <BodyLine className="w-[80%]" />
      <span className="h-[1cqw] w-[34%] rounded-full bg-neutral-500" />
    </span>
  )
}

/** The heading block used by the stacked layouts. */
function Header({ mode }: { mode: string }) {
  if (mode === 'left') {
    return (
      <span className="flex flex-col gap-[1.5cqw]">
        <span className="flex items-center justify-between gap-[3cqw]">
          <HeadlineLine className="w-[45%]" />
          <OutlineButton />
        </span>
        <BodyLine className="w-[70%]" />
      </span>
    )
  }
  return (
    <span className="flex flex-col items-center gap-[1.5cqw]">
      <HeadlineLine className="w-[45%]" />
      <BodyLine className="w-[70%]" />
      <span className="mt-[0.5cqw]">
        <OutlineButton />
      </span>
    </span>
  )
}

/** The copy column of a split layout — what fills it depends on the layout. */
function Copy({ layout, items }: { layout: string; items: number }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
      <Eyebrow />
      <HeadlineLine className="w-[80%]" />
      <HeadlineLine className="w-[45%]" />

      {layout !== 'media-list' && (
        <>
          <BodyLine className="mt-[0.5cqw] w-full" />
          <BodyLine className="w-[85%]" />
        </>
      )}

      {layout === 'checklist' && (
        <span className="mt-[0.8cqw] flex flex-col gap-[1.2cqw]">
          {Array.from({ length: items }, (_, i) => (
            <CheckRow key={i} />
          ))}
        </span>
      )}

      {layout === 'media-list' && (
        <span className="mt-[0.5cqw] flex flex-col gap-[1.8cqw]">
          {Array.from({ length: 3 }, (_, i) => (
            <MediaRow key={i} />
          ))}
        </span>
      )}

      {layout === 'stats' && (
        <span className="mt-[1cqw] grid grid-cols-2 gap-x-[3cqw] gap-y-[2cqw]">
          {Array.from({ length: 4 }, (_, i) => (
            <Stat key={i} />
          ))}
        </span>
      )}

      <Buttons />
    </span>
  )
}

/** Miniature of what the content section will look like on the page. */
export default function ContentSectionPreview({ layout, side, image, header, items }: ContentSectionChoice) {
  const count = Number(items)

  if (SPLIT_LAYOUTS.includes(layout)) {
    const bleed = image === 'bleed' && layout !== 'mini-cards'

    const visual =
      layout === 'mini-cards' ? (
        <span className="grid w-[46%] shrink-0 grid-cols-2 gap-x-[3cqw] gap-y-[3cqw]">
          {Array.from({ length: 4 }, (_, i) => (
            <MiniCard key={i} />
          ))}
        </span>
      ) : bleed ? (
        <ImageBlock className="h-full w-[46%] shrink-0 rounded-none border-0" />
      ) : (
        <ImageBlock className="h-[78%] w-[46%] shrink-0" />
      )

    const imageFirst = side === 'left'

    return (
      <div
        className={`flex h-full items-center gap-[5cqw] py-[5cqw] ${
          bleed ? (imageFirst ? 'pr-[5cqw]' : 'pl-[5cqw]') : 'px-[5cqw]'
        }`}
      >
        {imageFirst && visual}
        <Copy layout={layout} items={count} />
        {!imageFirst && visual}
      </div>
    )
  }

  // Stacked layouts: a heading, then an image and/or columns beneath it.
  return (
    <div className="flex h-full flex-col gap-[4cqw] px-[5cqw] py-[5cqw]">
      <Header mode={header} />

      {layout === 'image-band' && <ImageBlock className="h-[55%] w-full" />}

      {layout === 'image-columns' && (
        <>
          <ImageBlock className="h-[34%] w-full" />
          <span className="grid grid-cols-3 gap-[3cqw]">
            {Array.from({ length: 3 }, (_, i) => (
              <TextColumn key={i} />
            ))}
          </span>
        </>
      )}

      {layout === 'card-columns' && (
        <span
          className="grid gap-[3cqw]"
          style={{ gridTemplateColumns: `repeat(${count === 6 ? 3 : count}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: count === 6 ? 3 : count }, (_, i) => (
            <TextColumn key={i} withImage />
          ))}
        </span>
      )}
    </div>
  )
}

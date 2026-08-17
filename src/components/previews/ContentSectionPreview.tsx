import { itemAt, linesOf, splitStat } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

export type ContentSectionChoice = {
  layout: string
  side: string
  image: string
  header: string
  items: string
}

const GREEN = 'var(--brand,#3f6b30)'
const TAN = 'var(--brand-accent,#a1806a)'

const SPLIT_LAYOUTS = ['copy', 'checklist', 'media-list', 'stats', 'mini-cards']

function Buttons({ primary, secondary }: { primary?: string; secondary?: string }) {
  return (
    <span className="mt-[1cqw] flex items-center gap-[1.5cqw]">
      <FilledButton label={primary} />
      <OutlineButton label={secondary} />
    </span>
  )
}

/** Green tick followed by a line of text. */
function CheckRow({ text }: { text?: string }) {
  return (
    <span className="flex items-center gap-[1.5cqw]">
      <span className="size-[2cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
      {text ? (
        <span className="text-[1.7cqw] leading-tight text-neutral-700">{text}</span>
      ) : (
        <span className="h-[1cqw] w-[70%] rounded-full bg-neutral-400" />
      )}
    </span>
  )
}

/** Thumbnail beside a label and two lines of copy. */
function MediaRow({ title, body, src }: { title?: string; body?: string; src?: string }) {
  return (
    <span className="flex items-start gap-[1.8cqw]">
      <ImageBlock className="size-[7cqw] shrink-0" src={src} />
      <span className="flex min-w-0 flex-1 flex-col gap-[0.8cqw] pt-[0.5cqw]">
        {title ? (
          <span className="text-[1.9cqw] leading-tight font-semibold text-neutral-900">{title}</span>
        ) : (
          <span className="h-[1.4cqw] w-[30%] rounded-full bg-neutral-800" />
        )}
        <BodyLine className="w-full" text={body} />
        {!body && <BodyLine className="w-[75%]" />}
      </span>
    </span>
  )
}

/** A "200+ / Successful Projects" figure. */
function Stat({ value }: { value?: string }) {
  if (!value) {
    return (
      <span className="flex flex-col gap-[0.8cqw]">
        <span className="h-[3cqw] w-[45%] rounded-[1px] bg-neutral-900" />
        <span className="h-[1.1cqw] w-[75%] rounded-full" style={{ background: TAN }} />
      </span>
    )
  }
  const { figure, label } = splitStat(value)
  return (
    <span className="flex flex-col gap-[0.6cqw]">
      {figure && <span className="text-[3.2cqw] leading-none font-bold text-neutral-900">{figure}</span>}
      <span className="text-[1.5cqw] leading-tight" style={{ color: TAN }}>
        {label}
      </span>
    </span>
  )
}

/** One of the small cards in the 2×2 block. */
function MiniCard({ title, body, src }: { title?: string; body?: string; src?: string }) {
  return (
    <span className="flex flex-col gap-[1cqw]">
      <ImageBlock className="size-[7cqw]" src={src} />
      {title ? (
        <span className="text-[1.8cqw] leading-tight font-semibold text-neutral-900">{title}</span>
      ) : (
        <span className="h-[1.4cqw] w-[45%] rounded-full bg-neutral-800" />
      )}
      <BodyLine className="w-full" text={body} />
      {!body && <BodyLine className="w-[80%]" />}
    </span>
  )
}

/** A text column under a wide image or header. */
function TextColumn({
  withImage,
  title,
  body,
  src,
  link,
}: {
  withImage?: boolean
  title?: string
  body?: string
  src?: string
  link?: string
}) {
  return (
    <span className="flex flex-col gap-[1cqw]">
      {withImage && <ImageBlock className="h-[9cqw] w-full" src={src} />}
      {title ? (
        <span className="text-[1.9cqw] leading-tight font-semibold text-neutral-900">{title}</span>
      ) : (
        <span className="h-[1.5cqw] w-[42%] rounded-full bg-neutral-800" />
      )}
      <BodyLine className="w-full" text={body} />
      {!body && <BodyLine className="w-[80%]" />}
      {link ? (
        <span className="text-[1.5cqw] leading-none font-medium" style={{ color: GREEN }}>
          {link}
        </span>
      ) : (
        <span className="h-[1cqw] w-[34%] rounded-full bg-neutral-500" />
      )}
    </span>
  )
}

/** The heading block used by the stacked layouts. */
function Header({ mode, content }: { mode: string; content?: SectionContent }) {
  const heading = content?.heading
  const body = content?.body

  if (mode === 'left') {
    return (
      <span className="flex flex-col gap-[1.5cqw]">
        <span className="flex items-center justify-between gap-[3cqw]">
          <HeadlineLine className={heading ? 'w-[62%]' : 'w-[45%]'} text={heading} />
          <OutlineButton label={content?.cta} />
        </span>
        <BodyLine className="w-[70%]" text={body} />
      </span>
    )
  }

  return (
    <span className="flex flex-col items-center gap-[1.5cqw] text-center">
      <HeadlineLine className={heading ? 'w-[70%]' : 'w-[45%]'} text={heading} />
      <BodyLine className="w-[70%]" text={body} />
      <span className="mt-[0.5cqw]">
        <OutlineButton label={content?.cta} />
      </span>
    </span>
  )
}

/** The copy column of a split layout — what fills it depends on the layout. */
function Copy({ layout, items, content }: { layout: string; items: number; content?: SectionContent }) {
  const list = linesOf(content?.items)
  const heading = content?.heading

  return (
    <span className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine className={heading ? 'w-full' : 'w-[80%]'} text={heading} />
      {!heading && <HeadlineLine className="w-[45%]" />}

      {layout !== 'media-list' && (
        <>
          <BodyLine className="mt-[0.5cqw] w-full" text={content?.body} />
          {!content?.body && <BodyLine className="w-[85%]" />}
        </>
      )}

      {layout === 'checklist' && (
        <span className="mt-[0.8cqw] flex flex-col gap-[1.2cqw]">
          {Array.from({ length: items }, (_, i) => (
            <CheckRow key={i} text={list.length ? itemAt(content?.items, i) : undefined} />
          ))}
        </span>
      )}

      {layout === 'media-list' && (
        <span className="mt-[0.5cqw] flex flex-col gap-[1.8cqw]">
          {Array.from({ length: 3 }, (_, i) => (
            <MediaRow
              key={i}
              title={list.length ? itemAt(content?.items, i) : undefined}
              body={content?.body}
              src={content?.image}
            />
          ))}
        </span>
      )}

      {layout === 'stats' && (
        <span className="mt-[1cqw] grid grid-cols-2 gap-x-[3cqw] gap-y-[2cqw]">
          {Array.from({ length: 4 }, (_, i) => (
            <Stat key={i} value={list.length ? itemAt(content?.items, i) : undefined} />
          ))}
        </span>
      )}

      <Buttons primary={content?.cta} secondary={content?.cta2} />
    </span>
  )
}

/** Miniature of what the content section will look like on the page. */
export default function ContentSectionPreview({
  layout,
  side,
  image,
  header,
  items,
  content,
}: ContentSectionChoice & { content?: SectionContent }) {
  const count = Number(items)
  const list = linesOf(content?.items)
  const src = content?.image

  if (SPLIT_LAYOUTS.includes(layout)) {
    const bleed = image === 'bleed' && layout !== 'mini-cards'

    const visual =
      layout === 'mini-cards' ? (
        <span className="grid w-[46%] shrink-0 grid-cols-2 gap-x-[3cqw] gap-y-[3cqw]">
          {Array.from({ length: 4 }, (_, i) => (
            <MiniCard
              key={i}
              title={list.length ? itemAt(content?.items, i) : undefined}
              body={content?.body}
              src={src}
            />
          ))}
        </span>
      ) : bleed ? (
        <ImageBlock className="h-full w-[46%] shrink-0 rounded-none border-0" src={src} />
      ) : (
        <ImageBlock className="h-[78%] w-[46%] shrink-0" src={src} />
      )

    const imageFirst = side === 'left'

    return (
      <div
        className={`flex h-full items-center gap-[5cqw] py-[5cqw] ${
          bleed ? (imageFirst ? 'pr-[5cqw]' : 'pl-[5cqw]') : 'px-[5cqw]'
        }`}
      >
        {imageFirst && visual}
        <Copy layout={layout} items={count} content={content} />
        {!imageFirst && visual}
      </div>
    )
  }

  // Stacked layouts: a heading, then an image and/or columns beneath it.
  return (
    <div className="flex h-full flex-col gap-[4cqw] px-[5cqw] py-[5cqw]">
      <Header mode={header} content={content} />

      {layout === 'image-band' && <ImageBlock className="h-[55%] w-full" src={src} />}

      {layout === 'image-columns' && (
        <>
          <ImageBlock className="h-[34%] w-full" src={src} />
          <span className="grid grid-cols-3 gap-[3cqw]">
            {Array.from({ length: 3 }, (_, i) => (
              <TextColumn
                key={i}
                title={list.length ? itemAt(content?.items, i) : undefined}
                body={content?.body}
                link={content?.cta}
              />
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
            <TextColumn
              key={i}
              withImage
              title={list.length ? itemAt(content?.items, i) : undefined}
              body={content?.body}
              src={src}
              link={content?.cta}
            />
          ))}
        </span>
      )}
    </div>
  )
}

import { itemAt, linesOf, splitStat } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v23'. */
export type ContentSectionDesign = string

export type ContentSectionChoice = {
  design: ContentSectionDesign
}

const GREEN = 'var(--brand,#3f6b30)'
const TAN = 'var(--brand-accent,#a1806a)'
const PANEL = 'var(--brand-soft,#eef4ea)'

/**
 * What each design is made of.
 *
 * The 20 designs are variations on four frames — copy beside media, a heading
 * above a wide image, copy flanked by cards, and a bare banner — so they're
 * described here as data rather than written out as 20 components. A new export
 * from the design file is usually one more line in this table.
 *
 * Read off the artwork itself: how many ticks a design draws, whether its image
 * is inset or runs off the edge, and which of the lists fills the copy column
 * are all measured from the SVGs in `public/design-sets`.
 */
type Spec = {
  /** copy beside media | heading above media | copy between cards | copy alone */
  frame: 'split' | 'stacked' | 'flanked' | 'banner'
  /** Which side the media sits on, for split designs. */
  side?: 'left' | 'right'
  /** What sits under the paragraph in the copy column. */
  list?: 'ticks' | 'media' | 'stats'
  /** How many ticks the design draws — three of them, or a full six. */
  ticks?: number
  /** Media runs off the frame edge instead of sitting inside the margin. */
  bleed?: boolean
  /** Email capture in place of the two buttons. */
  actions?: 'email'
  /** A 2×2 block of small cards stands where the image would be. */
  cards?: boolean
  /** Text columns under the wide image, on the stacked designs. */
  columns?: number
  /** Heading centred over the section, or set left with the button beside it. */
  header?: 'centered' | 'left'
}

const SPECS: Record<string, Spec> = {
  v1: { frame: 'split', side: 'right' },
  v2: { frame: 'split', side: 'left' },
  v3: { frame: 'split', side: 'right', list: 'ticks', ticks: 3 },
  v4: { frame: 'split', side: 'left', list: 'ticks', ticks: 3 },
  v5: { frame: 'split', side: 'right', list: 'ticks', ticks: 6 },
  v6: { frame: 'split', side: 'left', list: 'ticks', ticks: 6 },
  v7: { frame: 'split', side: 'right', list: 'ticks', ticks: 3, bleed: true },
  v8: { frame: 'split', side: 'left', list: 'ticks', ticks: 3, bleed: true },
  v9: { frame: 'split', side: 'right', list: 'media', bleed: true },
  v10: { frame: 'split', side: 'left', list: 'media', bleed: true },
  v13: { frame: 'split', side: 'left', actions: 'email' },
  v15: { frame: 'split', side: 'right', list: 'stats' },
  v16: { frame: 'split', side: 'left', list: 'stats' },
  v17: { frame: 'stacked', header: 'centered', columns: 3 },
  v18: { frame: 'stacked', header: 'left', columns: 3 },
  v19: { frame: 'split', side: 'right', cards: true },
  v20: { frame: 'split', side: 'left', cards: true },
  v21: { frame: 'flanked', header: 'centered' },
  v22: { frame: 'banner' },
  v23: { frame: 'split', side: 'right', actions: 'email' },
}

function Buttons({ primary, secondary }: { primary?: string; secondary?: string }) {
  return (
    <div className="mt-[1cqw] flex items-center gap-[1.5cqw]">
      <FilledButton label={primary} />
      <OutlineButton label={secondary} />
    </div>
  )
}

/** Green tick followed by a line of text. */
function CheckRow({ text }: { text?: string }) {
  return (
    <li className="flex items-center gap-[1.5cqw]">
      <span aria-hidden="true" className="size-[2cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
      {text ? (
        <span className="text-[1.7cqw] leading-tight text-neutral-700">{text}</span>
      ) : (
        <span aria-hidden="true" className="h-[1cqw] w-[70%] rounded-full bg-neutral-400" />
      )}
    </li>
  )
}

/** Email field and submit sharing one row, with the reassurance under it. */
function EmailCapture({ content }: { content?: SectionContent }) {
  return (
    <form className="mt-[1cqw] flex w-full flex-col gap-[1.2cqw]" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-stretch gap-[1.2cqw]">
        <label className="flex h-[4cqw] min-w-0 flex-1 items-center rounded-xs px-[1.8cqw]" style={{ background: PANEL }}>
          <span className="sr-only">Email address</span>
          <input
            type="email"
            readOnly
            placeholder="Enter your email address"
            className="w-full bg-transparent text-[1.5cqw] text-neutral-500 placeholder:text-neutral-500"
          />
        </label>
        <FilledButton label={content?.cta} />
      </div>
      {content?.note && (
        <p className="flex items-center gap-[1cqw]">
          <span aria-hidden="true" className="size-[1.6cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
          <span className="text-[1.3cqw] leading-none text-neutral-500">{content.note}</span>
        </p>
      )}
    </form>
  )
}

/** Thumbnail beside a label and two lines of copy. */
function MediaRow({ title, body, src }: { title?: string; body?: string; src?: string }) {
  return (
    <li className="flex items-start gap-[1.8cqw]">
      <ImageBlock className="size-[7cqw] shrink-0" src={src} />
      <div className="flex min-w-0 flex-1 flex-col gap-[0.8cqw] pt-[0.5cqw]">
        {title ? (
          <h3 className="text-[1.9cqw] leading-tight font-semibold text-neutral-900">{title}</h3>
        ) : (
          <span aria-hidden="true" className="h-[1.4cqw] w-[30%] rounded-full bg-neutral-800" />
        )}
        <BodyLine className="w-full" text={body} />
        {!body && <BodyLine className="w-[75%]" />}
      </div>
    </li>
  )
}

/** A "200+ / Successful Projects" figure. */
function Stat({ value }: { value?: string }) {
  if (!value) {
    return (
      <li aria-hidden="true" className="flex flex-col gap-[0.8cqw]">
        <span className="h-[3cqw] w-[45%] rounded-[1px] bg-neutral-900" />
        <span className="h-[1.1cqw] w-[75%] rounded-full" style={{ background: TAN }} />
      </li>
    )
  }
  const { figure, label } = splitStat(value)
  return (
    <li className="flex flex-col gap-[0.6cqw]">
      {figure && <p className="text-[3.2cqw] leading-none font-bold text-neutral-900">{figure}</p>}
      <p className="text-[1.5cqw] leading-tight" style={{ color: TAN }}>
        {label}
      </p>
    </li>
  )
}

/**
 * One of the small cards in the 2×2 blocks.
 *
 * `centered` is what the flanked design does with the pairs either side of its
 * picture; the facing blocks set theirs left.
 */
function MiniCard({
  title,
  body,
  src,
  centered,
}: {
  title?: string
  body?: string
  src?: string
  centered?: boolean
}) {
  return (
    <li className={`flex flex-col gap-[1cqw] ${centered ? 'items-center text-center' : ''}`}>
      <ImageBlock className="size-[7cqw]" src={src} />
      {title ? (
        <h3 className="text-[1.8cqw] leading-tight font-semibold text-neutral-900">{title}</h3>
      ) : (
        <span aria-hidden="true" className="h-[1.4cqw] w-[45%] rounded-full bg-neutral-800" />
      )}
      <BodyLine className="w-full" text={body} />
      {!body && <BodyLine className="w-[80%]" />}
    </li>
  )
}

/**
 * A text column under the wide image.
 *
 * The link is dark rather than green: the design set draws it in the same warm
 * ink as the labels, and keeps its greens for the buttons and the ticks.
 */
function TextColumn({ title, body, link }: { title?: string; body?: string; link?: string }) {
  return (
    <li className="flex flex-col gap-[1cqw]">
      {title ? (
        <h3 className="text-[1.9cqw] leading-tight font-semibold text-neutral-900">{title}</h3>
      ) : (
        <span aria-hidden="true" className="h-[1.5cqw] w-[42%] rounded-full bg-neutral-800" />
      )}
      <BodyLine className="w-full" text={body} />
      {!body && <BodyLine className="w-[80%]" />}
      {link ? (
        <a href="#" data-role="link" className="text-[1.5cqw] leading-none font-medium text-neutral-800">
          {link} &rarr;
        </a>
      ) : (
        <span aria-hidden="true" className="h-[1cqw] w-[34%] rounded-full bg-neutral-500" />
      )}
    </li>
  )
}

/** The heading block the stacked and flanked designs open with. */
function Header({ spec, content }: { spec: Spec; content?: SectionContent }) {
  const heading = content?.heading
  const body = content?.body

  if (spec.header === 'left') {
    return (
      <div className="flex flex-col gap-[1.5cqw]">
        <div className="flex items-center justify-between gap-[3cqw]">
          <HeadlineLine className={heading ? 'w-[62%]' : 'w-[45%]'} text={heading} />
          <OutlineButton label={content?.cta} />
        </div>
        <BodyLine className="w-[70%]" text={body} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-[1.5cqw] text-center">
      <HeadlineLine className={heading ? 'w-[70%]' : 'w-[45%]'} text={heading} />
      <BodyLine className="w-[70%]" text={body} />
      <div className="mt-[0.5cqw]">
        <OutlineButton label={content?.cta} />
      </div>
    </div>
  )
}

/** The copy column of a split design — what fills it depends on the design. */
function Copy({ spec, content }: { spec: Spec; content?: SectionContent }) {
  const list = linesOf(content?.items)
  const heading = content?.heading
  const named = list.length > 0

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine className={heading ? 'w-full' : 'w-[80%]'} text={heading} />
      {!heading && <HeadlineLine className="w-[45%]" />}

      {spec.list !== 'media' && (
        <>
          <BodyLine className="mt-[0.5cqw] w-full" text={content?.body} />
          {!content?.body && <BodyLine className="w-[85%]" />}
        </>
      )}

      {spec.list === 'ticks' && (
        <ul className="mt-[0.8cqw] flex flex-col gap-[1.2cqw]">
          {Array.from({ length: spec.ticks ?? 3 }, (_, i) => (
            <CheckRow key={i} text={named ? itemAt(content?.items, i) : undefined} />
          ))}
        </ul>
      )}

      {spec.list === 'media' && (
        <ul className="mt-[0.5cqw] flex flex-col gap-[1.8cqw]">
          {Array.from({ length: 3 }, (_, i) => (
            <MediaRow
              key={i}
              title={named ? itemAt(content?.items, i) : undefined}
              body={content?.body}
              src={content?.image}
            />
          ))}
        </ul>
      )}

      {/* Figures read their own field: they're written "200+ · Projects
          delivered", which the tick list isn't. */}
      {spec.list === 'stats' && (
        <ul className="mt-[1cqw] grid grid-cols-2 gap-x-[3cqw] gap-y-[2cqw]">
          {Array.from({ length: 4 }, (_, i) => (
            <Stat key={i} value={linesOf(content?.stats).length ? itemAt(content?.stats, i) : undefined} />
          ))}
        </ul>
      )}

      {spec.actions === 'email' ? (
        <EmailCapture content={content} />
      ) : (
        <Buttons primary={content?.cta} secondary={content?.cta2} />
      )}
    </div>
  )
}

/** Miniature of what the content section will look like on the page. */
export default function ContentSectionPreview({
  design,
  content,
}: ContentSectionChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const list = linesOf(content?.items)
  const named = list.length > 0
  const src = content?.image

  const card = (i: number, centered?: boolean) => (
    <MiniCard
      key={i}
      title={named ? itemAt(content?.items, i) : undefined}
      body={content?.body}
      src={src}
      centered={centered}
    />
  )

  if (spec.frame === 'banner') {
    // No image and no eyebrow: the shortest design in the set is a heading,
    // a sentence and the two buttons.
    return (
      <section className="flex h-full flex-col justify-center gap-[1.6cqw] px-[5cqw] py-[5cqw]">
        <HeadlineLine className={content?.heading ? 'w-[70%]' : 'w-[45%]'} text={content?.heading} />
        <BodyLine className="w-[70%]" text={content?.body} />
        <Buttons primary={content?.cta} secondary={content?.cta2} />
      </section>
    )
  }

  if (spec.frame === 'flanked') {
    return (
      <section className="flex h-full flex-col gap-[4cqw] px-[5cqw] py-[5cqw]">
        <Header spec={spec} content={content} />
        <div className="flex min-h-0 flex-1 items-center gap-[4cqw]">
          <ul className="flex w-[28%] shrink-0 flex-col gap-[3cqw]">{[0, 1].map((i) => card(i, true))}</ul>
          {/* The picture the pairs face across — drawn upright, so it takes the
              height the frame leaves rather than a ratio of its own. */}
          <ImageBlock className="h-full min-w-0 flex-1" src={src} />
          <ul className="flex w-[28%] shrink-0 flex-col gap-[3cqw]">{[2, 3].map((i) => card(i, true))}</ul>
        </div>
      </section>
    )
  }

  if (spec.frame === 'stacked') {
    return (
      <section className="flex h-full flex-col gap-[4cqw] px-[5cqw] py-[5cqw]">
        <Header spec={spec} content={content} />
        <ImageBlock className="min-h-0 w-full flex-1" src={src} />
        <ul className="grid shrink-0 grid-cols-3 gap-[3cqw]">
          {Array.from({ length: spec.columns ?? 3 }, (_, i) => (
            <TextColumn
              key={i}
              title={named ? itemAt(content?.items, i) : undefined}
              body={content?.body}
              link={content?.cta2}
            />
          ))}
        </ul>
      </section>
    )
  }

  // Split: copy one side, media the other.
  const visual = spec.cards ? (
    <ul className="grid w-[46%] shrink-0 grid-cols-2 gap-x-[3cqw] gap-y-[3cqw]">{[0, 1, 2, 3].map((i) => card(i))}</ul>
  ) : (
    <ImageBlock
      className={spec.bleed ? 'h-full w-[46%] shrink-0 rounded-none! border-0' : 'h-[78%] w-[46%] shrink-0'}
      src={src}
    />
  )

  const imageFirst = spec.side === 'left'
  // A bleeding image runs to three edges of the frame — the side it sits on, and
  // top and bottom. So the padding comes off the section entirely and goes on
  // the copy alone; leaving `py` on the section would box the image in.
  const frame = spec.bleed ? 'gap-[5cqw]' : 'gap-[5cqw] px-[5cqw] py-[5cqw]'
  const copyPad = spec.bleed ? (imageFirst ? 'py-[5cqw] pr-[5cqw]' : 'py-[5cqw] pl-[5cqw]') : ''

  return (
    <section className={`flex h-full items-center ${frame}`}>
      {imageFirst && visual}
      <div className={`flex min-w-0 flex-1 ${copyPad}`}>
        <Copy spec={spec} content={content} />
      </div>
      {!imageFirst && visual}
    </section>
  )
}

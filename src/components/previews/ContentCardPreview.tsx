import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

export type ContentCardChoice = {
  style: string
  header: string
  rows: string
}

const GREEN = 'var(--brand,#3f6b30)'
const NUMERAL = '#5f8f4e'

function Label({ text }: { text?: string }) {
  if (text) {
    return <h3 className="text-[1.8cqw] leading-tight font-semibold text-neutral-900">{text}</h3>
  }
  return <span aria-hidden="true" className="block h-[1.5cqw] w-[42%] rounded-full bg-neutral-800" />
}

function Copy({ centered, text }: { centered?: boolean; text?: string }) {
  if (text) {
    return <p className={`text-[1.4cqw] leading-[1.45] text-neutral-600 ${centered ? 'text-center' : ''}`}>{text}</p>
  }
  return (
    <span aria-hidden="true" className={`flex flex-col gap-[0.8cqw] ${centered ? 'items-center' : ''}`}>
      <span className="h-[0.9cqw] w-full rounded-full bg-neutral-300" />
      <span className="h-[0.9cqw] w-[82%] rounded-full bg-neutral-300" />
    </span>
  )
}

/** The "Learn More →" text link. */
function LinkLine({ text }: { text?: string }) {
  if (text) {
    return (
      <a href="#" data-role="link" className="text-[1.4cqw] leading-none font-medium" style={{ color: GREEN }}>
        {text} &rarr;
      </a>
    )
  }
  return <span aria-hidden="true" className="block h-[1cqw] w-[34%] rounded-full bg-neutral-500" />
}

/** The solid green "Learn More" button. */
function ButtonBlock({ text }: { text?: string }) {
  if (text) {
    return (
      <button
        type="button"
        data-role="button"
        className="inline-flex h-[3.2cqw] items-center self-start rounded-xs px-[2cqw] text-[1.4cqw] leading-none font-medium text-white"
        style={{ background: GREEN }}
      >
        {text}
      </button>
    )
  }
  return <span aria-hidden="true" data-role="button" className="block h-[2.8cqw] w-[42%] rounded-xs" style={{ background: GREEN }} />
}

/** The card's position, drawn large. Decoration — the order is already in the list. */
function Numeral({ index, small }: { index: number; small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`font-bold leading-none ${small ? 'text-[2.6cqw]' : 'text-[4.4cqw]'}`}
      style={{ color: NUMERAL }}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  )
}

function Item({
  style,
  index,
  title,
  copy,
  link,
  src,
}: {
  style: string
  index: number
  title?: string
  copy?: string
  link?: string
  src?: string
}) {
  const stack = 'flex flex-col gap-[1cqw]'

  const body = (centered?: boolean) => (
    <>
      <Label text={title} />
      <Copy centered={centered} text={copy} />
      {style === 'button' ? <ButtonBlock text={link} /> : <LinkLine text={link} />}
    </>
  )

  if (style === 'numbered') {
    return (
      <li className={stack}>
        <Numeral index={index} />
        {body()}
      </li>
    )
  }

  if (style === 'numbered-footer') {
    return (
      <li className={stack}>
        <Label text={title} />
        <Copy text={copy} />
        <LinkLine text={link} />
        <span aria-hidden="true" className="mt-[0.5cqw] h-px w-full bg-neutral-200" />
        <span aria-hidden="true" className="flex items-center justify-between">
          <Numeral index={index} small />
          <span className="text-[2.2cqw] leading-none" style={{ color: NUMERAL }}>
            →
          </span>
        </span>
      </li>
    )
  }

  if (style === 'horizontal') {
    return (
      <li className="flex items-start gap-[1.5cqw]">
        <ImageBlock className="aspect-square w-[36%] shrink-0" src={src} />
        <div className={`min-w-0 flex-1 ${stack}`}>{body()}</div>
      </li>
    )
  }

  if (style === 'wide-image') {
    return (
      <li className={stack}>
        <ImageBlock className="h-[7cqw] w-full" src={src} />
        {body()}
      </li>
    )
  }

  if (style === 'centered') {
    return (
      <li className={`${stack} items-center text-center`}>
        <ImageBlock className="size-[7cqw]" src={src} />
        {body(true)}
      </li>
    )
  }

  if (style === 'bordered' || style === 'tinted') {
    return (
      <li
        className={`${stack} rounded-[3px] p-[2cqw] ${style === 'bordered' ? 'border border-neutral-200' : ''}`}
        style={style === 'tinted' ? { background: 'var(--brand-soft,#eef4ea)' } : undefined}
      >
        <ImageBlock className="size-[6cqw]" src={src} />
        {body()}
      </li>
    )
  }

  // 'plain' and 'button'
  return (
    <li className={stack}>
      <ImageBlock className="size-[7cqw]" src={src} />
      {body()}
    </li>
  )
}

/** Miniature of what the content card grid will look like on the page. */
export default function ContentCardPreview({
  style,
  header,
  rows,
  content,
}: ContentCardChoice & { content?: SectionContent }) {
  const count = Number(rows) * 3
  const titles = linesOf(content?.items)
  // "Learn more" is the card link; the header button carries its own label.
  const link = titles.length ? 'Learn more' : undefined

  return (
    <section aria-label="What we do" className="flex h-full flex-col gap-[3cqw] p-[4cqw]">
      {header === 'left' ? (
        <div className="flex flex-col gap-[1.2cqw]">
          <div className="flex items-center justify-between gap-[2cqw]">
            <HeadlineLine className={content?.heading ? 'w-[60%]' : 'w-[22%]'} text={content?.heading} />
            <OutlineButton label={content?.cta} />
          </div>
          <BodyLine className="w-[54%]" text={content?.body} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-[1.2cqw] text-center">
          <HeadlineLine className={content?.heading ? 'w-[70%]' : 'w-[30%]'} text={content?.heading} />
          <BodyLine className="w-[60%]" text={content?.body} />
          <div className="mt-[0.5cqw]">
            <OutlineButton label={content?.cta} />
          </div>
        </div>
      )}

      <ul className="grid grid-cols-3 gap-x-[3cqw] gap-y-[2.5cqw]">
        {Array.from({ length: count }, (_, i) => (
          <Item
            key={i}
            style={style}
            index={i}
            title={titles.length ? itemAt(content?.items, i) : undefined}
            copy={content?.itemBody}
            link={link}
            src={content?.image}
          />
        ))}
      </ul>
    </section>
  )
}

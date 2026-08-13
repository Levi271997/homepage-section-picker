import { BodyLine, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

export type ContentCardChoice = {
  style: string
  header: string
  rows: string
}

const GREEN = 'var(--brand,#3f6b30)'
const NUMERAL = '#5f8f4e'

function Label() {
  return <span className="h-[1.5cqw] w-[42%] rounded-full bg-neutral-800" />
}

function Copy({ centered }: { centered?: boolean }) {
  return (
    <span className={`flex flex-col gap-[0.8cqw] ${centered ? 'items-center' : ''}`}>
      <span className="h-[0.9cqw] w-full rounded-full bg-neutral-300" />
      <span className="h-[0.9cqw] w-[82%] rounded-full bg-neutral-300" />
    </span>
  )
}

/** The "Learn More →" text link. */
function LinkLine() {
  return <span className="h-[1cqw] w-[34%] rounded-full bg-neutral-500" />
}

/** The solid green "Learn More" button. */
function ButtonBlock() {
  return <span className="h-[2.8cqw] w-[42%] rounded-[2px]" style={{ background: GREEN }} />
}

function Numeral({ index, small }: { index: number; small?: boolean }) {
  return (
    <span
      className={`font-bold leading-none ${small ? 'text-[2.6cqw]' : 'text-[4.4cqw]'}`}
      style={{ color: NUMERAL }}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  )
}

function Item({ style, index }: { style: string; index: number }) {
  const stack = 'flex flex-col gap-[1cqw]'

  const body = (centered?: boolean) => (
    <>
      <Label />
      <Copy centered={centered} />
      {style === 'button' ? <ButtonBlock /> : <LinkLine />}
    </>
  )

  if (style === 'numbered') {
    return (
      <span className={stack}>
        <Numeral index={index} />
        {body()}
      </span>
    )
  }

  if (style === 'numbered-footer') {
    return (
      <span className={stack}>
        <Label />
        <Copy />
        <LinkLine />
        <span className="mt-[0.5cqw] h-px w-full bg-neutral-200" />
        <span className="flex items-center justify-between">
          <Numeral index={index} small />
          <span className="text-[2.2cqw] leading-none" style={{ color: NUMERAL }}>
            →
          </span>
        </span>
      </span>
    )
  }

  if (style === 'horizontal') {
    return (
      <span className="flex items-start gap-[1.5cqw]">
        <ImageBlock className="aspect-square w-[36%] shrink-0" />
        <span className={`min-w-0 flex-1 ${stack}`}>{body()}</span>
      </span>
    )
  }

  if (style === 'wide-image') {
    return (
      <span className={stack}>
        <ImageBlock className="h-[7cqw] w-full" />
        {body()}
      </span>
    )
  }

  if (style === 'centered') {
    return (
      <span className={`${stack} items-center text-center`}>
        <ImageBlock className="size-[7cqw]" />
        {body(true)}
      </span>
    )
  }

  if (style === 'bordered' || style === 'tinted') {
    return (
      <span
        className={`${stack} rounded-[3px] p-[2cqw] ${style === 'bordered' ? 'border border-neutral-200' : ''}`}
        style={style === 'tinted' ? { background: '#eef4ea' } : undefined}
      >
        <ImageBlock className="size-[6cqw]" />
        {body()}
      </span>
    )
  }

  // 'plain' and 'button'
  return (
    <span className={stack}>
      <ImageBlock className="size-[7cqw]" />
      {body()}
    </span>
  )
}

/** Miniature of what the content card grid will look like on the page. */
export default function ContentCardPreview({ style, header, rows }: ContentCardChoice) {
  const count = Number(rows) * 3

  return (
    <div className="flex h-full flex-col gap-[3cqw] p-[4cqw]">
      {header === 'left' ? (
        <div className="flex flex-col gap-[1.2cqw]">
          <div className="flex items-center justify-between gap-[2cqw]">
            <HeadlineLine className="w-[22%]" />
            <OutlineButton />
          </div>
          <BodyLine className="w-[54%]" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-[1.2cqw]">
          <HeadlineLine className="w-[30%]" />
          <BodyLine className="w-[60%]" />
          <span className="mt-[0.5cqw]">
            <OutlineButton />
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-x-[3cqw] gap-y-[2.5cqw]">
        {Array.from({ length: count }, (_, i) => (
          <Item key={i} style={style} index={i} />
        ))}
      </div>
    </div>
  )
}

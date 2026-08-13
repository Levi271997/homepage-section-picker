import { BodyLine, Eyebrow, FilledButton, HeadlineLine, OutlineButton } from '@/components/previews/parts'

export type FaqChoice = {
  style: string
  layout: string
  columns: string
  header: string
  items: string
}

const GREEN = 'var(--brand,#3f6b30)'

/** One question row: the question and its green plus. */
function QuestionRow({ style }: { style: string }) {
  const shell =
    style === 'bordered'
      ? 'rounded-[3px] border border-neutral-200 px-[2.5cqw] py-[2.2cqw]'
      : style === 'raised'
        ? 'rounded-[3px] bg-white px-[2.5cqw] py-[2.2cqw] shadow-sm'
        : 'border-b border-neutral-200 pb-[2cqw]'

  return (
    <span className={`flex items-center justify-between gap-[2cqw] ${shell}`}>
      <span className="h-[1.6cqw] w-[52%] rounded-full bg-neutral-900" />
      <span className="text-[3cqw] leading-none font-medium" style={{ color: GREEN }}>
        +
      </span>
    </span>
  )
}

function QuestionList({ style, count, columns }: { style: string; count: number; columns: number }) {
  return (
    <span
      className="grid gap-x-[3cqw] gap-y-[2cqw]"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }, (_, i) => (
        <QuestionRow key={i} style={style} />
      ))}
    </span>
  )
}

/** Green tick followed by a line of text. */
function CheckRow() {
  return (
    <span className="flex items-center gap-[1.5cqw]">
      <span className="size-[2cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
      <span className="h-[1cqw] w-[65%] rounded-full bg-neutral-400" />
    </span>
  )
}

/** Miniature of what the FAQ accordion will look like on the page. */
export default function FaqPreview({ style, layout, columns, header, items }: FaqChoice) {
  const count = Number(items)

  if (layout === 'split') {
    return (
      <div className="flex h-full items-start gap-[5cqw] px-[5cqw] py-[4cqw]">
        <span className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
          <Eyebrow />
          <HeadlineLine className="w-[80%]" />
          <BodyLine className="mt-[0.5cqw] w-full" />
          <BodyLine className="w-[85%]" />
          <span className="mt-[0.8cqw] flex flex-col gap-[1.2cqw]">
            {Array.from({ length: 3 }, (_, i) => (
              <CheckRow key={i} />
            ))}
          </span>
          <span className="mt-[1cqw] flex gap-[1.5cqw]">
            <FilledButton />
            <OutlineButton />
          </span>
        </span>

        <span className="w-[48%] shrink-0">
          <QuestionList style={style} count={count} columns={1} />
        </span>
      </div>
    )
  }

  const centered = header === 'centered'

  return (
    <div className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      <span className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center' : 'items-start'}`}>
        <Eyebrow />
        <HeadlineLine className={centered ? 'w-[38%]' : 'w-[34%]'} />
        <BodyLine className={centered ? 'w-[64%]' : 'w-[58%]'} />
      </span>

      <QuestionList style={style} count={count} columns={Number(columns)} />
    </div>
  )
}

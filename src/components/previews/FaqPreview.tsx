import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, OutlineButton } from '@/components/previews/parts'

export type FaqChoice = {
  style: string
  layout: string
  columns: string
  header: string
  items: string
}

const GREEN = 'var(--brand,#3f6b30)'

/** One question row: the question and its green plus. The first one starts open. */
function QuestionRow({
  style,
  question,
  answer,
  open,
}: {
  style: string
  question?: string
  answer?: string
  open?: boolean
}) {
  const shell =
    style === 'bordered'
      ? 'rounded-[3px] border border-neutral-200 px-[2.5cqw] py-[2.2cqw]'
      : style === 'raised'
        ? 'rounded-[3px] bg-white px-[2.5cqw] py-[2.2cqw] shadow-sm'
        : 'border-b border-neutral-200 pb-[2cqw]'

  const showAnswer = open && answer

  return (
    <span className={`flex flex-col gap-[1.4cqw] ${shell}`}>
      <span className="flex items-start justify-between gap-[2cqw]">
        {question ? (
          <span className="text-[1.7cqw] leading-tight font-medium text-neutral-900">{question}</span>
        ) : (
          <span className="h-[1.6cqw] w-[52%] rounded-full bg-neutral-900" />
        )}
        <span className="shrink-0 text-[3cqw] leading-none font-medium" style={{ color: GREEN }}>
          {showAnswer ? '−' : '+'}
        </span>
      </span>

      {showAnswer && <span className="text-[1.4cqw] leading-[1.45] text-neutral-600">{answer}</span>}
    </span>
  )
}

function QuestionList({
  style,
  count,
  columns,
  content,
}: {
  style: string
  count: number
  columns: number
  content?: SectionContent
}) {
  const questions = linesOf(content?.items)

  return (
    <span
      className="grid items-start gap-x-[3cqw] gap-y-[2cqw]"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }, (_, i) => (
        <QuestionRow
          key={i}
          style={style}
          question={questions.length ? itemAt(content?.items, i) : undefined}
          answer={content?.answer}
          open={i === 0}
        />
      ))}
    </span>
  )
}

/** Green tick followed by a line of text. */
function CheckRow({ text }: { text?: string }) {
  return (
    <span className="flex items-center gap-[1.5cqw]">
      <span className="size-[2cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
      {text ? (
        <span className="text-[1.6cqw] leading-tight text-neutral-700">{text}</span>
      ) : (
        <span className="h-[1cqw] w-[65%] rounded-full bg-neutral-400" />
      )}
    </span>
  )
}

/** Miniature of what the FAQ accordion will look like on the page. */
export default function FaqPreview({
  style,
  layout,
  columns,
  header,
  items,
  content,
}: FaqChoice & { content?: SectionContent }) {
  const count = Number(items)

  if (layout === 'split') {
    const points = linesOf(content?.points)

    return (
      <div className="flex h-full items-start gap-[5cqw] px-[5cqw] py-[4cqw]">
        <span className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
          <Eyebrow text={content?.eyebrow} />
          <HeadlineLine className={content?.heading ? 'w-full' : 'w-[80%]'} text={content?.heading} />
          <BodyLine className="mt-[0.5cqw] w-full" text={content?.body} />
          {!content?.body && <BodyLine className="w-[85%]" />}
          <span className="mt-[0.8cqw] flex flex-col gap-[1.2cqw]">
            {Array.from({ length: 3 }, (_, i) => (
              <CheckRow key={i} text={points.length ? itemAt(content?.points, i) : undefined} />
            ))}
          </span>
          <span className="mt-[1cqw] flex items-center gap-[1.5cqw]">
            <FilledButton label={content?.cta} />
            <OutlineButton label={content?.cta2} />
          </span>
        </span>

        <span className="w-[48%] shrink-0">
          <QuestionList style={style} count={count} columns={1} content={content} />
        </span>
      </div>
    )
  }

  const centered = header === 'centered'

  return (
    <div className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      <span
        className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : 'items-start'}`}
      >
        <Eyebrow text={content?.eyebrow} />
        <HeadlineLine
          className={content?.heading ? 'w-[60%]' : centered ? 'w-[38%]' : 'w-[34%]'}
          text={content?.heading}
        />
        <BodyLine className={centered ? 'w-[64%]' : 'w-[58%]'} text={content?.body} />
      </span>

      <QuestionList style={style} count={count} columns={Number(columns)} content={content} />
    </div>
  )
}

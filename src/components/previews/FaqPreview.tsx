import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, OutlineButton } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v5'. */
export type FaqDesign = string

export type FaqChoice = {
  design: FaqDesign
}

const GREEN = 'var(--brand,#4b7b35)'
const HAIRLINE = '#d0c3b8'
/** The heavier rule the bare designs separate their questions with. */
const ROW_RULE = '#b59f8f'
const INK = '#1e1515'
const BODY = '#563f3d'

/** The green plus a closed question carries, traced at its drawn 16×16. */
const PLUS =
  'M8.7 0.9C8.7 0.401 8.3 0 7.8 0C7.3 0 6.9 0.401 6.9 0.9V6.9H0.9C0.4 6.9 0 7.301 0 7.8C0 8.299 0.4 8.7 0.9 8.7H6.9V14.7C6.9 15.199 7.3 15.6 7.8 15.6C8.3 15.6 8.7 15.199 8.7 14.7V8.7H14.7C15.2 8.7 15.6 8.299 15.6 7.8C15.6 7.301 15.2 6.9 14.7 6.9H8.7V0.9Z'

/** The dark chevron the artwork gives the one open question. */
const CHEVRON =
  'M7.46 8.738C7.81 9.09 8.38 9.09 8.73 8.738L15.94 1.538C16.29 1.185 16.29 0.615 15.94 0.266C15.58 -0.082 15.01 -0.086 14.67 0.266L8.1 6.829L1.54 0.263C1.18 -0.09 0.61 -0.09 0.27 0.263C-0.08 0.615 -0.09 1.185 0.27 1.534L7.46 8.738Z'

/** The circled check beside a point on the design that sets copy alongside. */
const CHECK =
  'M8 16C10.122 16 12.157 15.157 13.657 13.657C15.157 12.157 16 10.122 16 8C16 5.878 15.157 3.843 13.657 2.343C12.157 0.843 10.122 0 8 0C5.878 0 3.843 0.843 2.343 2.343C0.843 3.843 0 5.878 0 8C0 10.122 0.843 12.157 2.343 13.657C3.843 15.157 5.878 16 8 16ZM11.531 6.531L7.531 10.531C7.238 10.825 6.763 10.825 6.472 10.531L4.472 8.531C4.178 8.238 4.178 7.763 4.472 7.472C4.766 7.181 5.241 7.178 5.531 7.472L7 8.941L10.469 5.469C10.762 5.175 11.238 5.175 11.528 5.469C11.819 5.762 11.822 6.237 11.528 6.528L11.531 6.531Z'

/**
 * What each design is made of.
 *
 * Every question is the same 56-tall row with the same 24px question and the
 * same green plus out at its right edge. What a design decides is whether that
 * row sits in an outlined box or hangs off a hairline, how many columns of them
 * there are, how many questions each column runs to, and where the heading goes
 * — above the list, or in the half beside it.
 *
 * The one-column designs don't run the full width: the list is drawn 800 wide,
 * centred, which is two thirds of what the margins leave.
 */
type Spec = {
  /** Above the list, or in the left half beside it. */
  header: 'centered' | 'left' | 'aside'
  /** An outlined box around each question, rather than a hairline under it. */
  card?: boolean
  /** Columns of questions. */
  columns: number
  /** Questions per column. */
  rows: number
  /**
   * The gap between rows, as a literal class — the set draws 13 between boxed
   * rows in one column, 25 in two, and 12 between hairline rows.
   */
  gap: string
}

const SPECS: Record<string, Spec> = {
  v1: { header: 'centered', card: true, columns: 1, rows: 4, gap: 'gap-[0.9cqw]' },
  v2: { header: 'centered', columns: 1, rows: 4, gap: 'gap-[0.83cqw]' },
  v3: { header: 'centered', card: true, columns: 2, rows: 4, gap: 'gap-[1.74cqw]' },
  v4: { header: 'left', card: true, columns: 2, rows: 4, gap: 'gap-[1.74cqw]' },
  v5: { header: 'aside', columns: 1, rows: 7, gap: 'gap-[0.83cqw]' },
}

/**
 * One question row: the question and its mark.
 *
 * A real `<details>`, so the accordion actually opens on the page instead of
 * miming it — and the mark follows the open state through CSS rather than a
 * prop. The browser's own disclosure triangle is turned off; the plus and the
 * chevron are the two the artwork draws.
 */
function QuestionRow({
  spec,
  question,
  answer,
  open,
}: {
  spec: Spec
  question?: string
  answer?: string
  open?: boolean
}) {
  return (
    <li>
      {/* Not a flex column: a closed `details` still lays its hidden content out
          as a box, so a flex gap would show as dead space under every collapsed
          question. The answer carries its own top margin instead. */}
      <details
        open={open}
        data-role="row"
        // 16px in on the left and 20 on the right where there's a box; flush to
        // the column where there isn't.
        className={`group ${
          spec.card ? 'rounded-[0.28cqw] border py-[0.9cqw] pl-[1.11cqw] pr-[1.39cqw]' : 'border-b py-[0.9cqw] pr-[0.28cqw]'
        }`}
        style={{ borderColor: spec.card ? HAIRLINE : ROW_RULE }}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-[1.4cqw] [&::-webkit-details-marker]:hidden">
          {question ? (
            <span className="text-[1.67cqw] leading-tight font-semibold" style={{ color: INK }}>
              {question}
            </span>
          ) : (
            <span aria-hidden="true" className="h-[1.5cqw] w-[52%] rounded-full" style={{ background: INK }} />
          )}
          <span aria-hidden="true" className="shrink-0">
            <svg viewBox="0 0 15.6 15.6" className="size-[1.11cqw] group-open:hidden" fill={GREEN}>
              <path d={PLUS} />
            </svg>
            <svg
              viewBox="-0.2 -0.2 16.8 9.6"
              className="hidden h-[0.64cqw] w-[1.11cqw] group-open:block"
              fill={INK}
            >
              <path d={CHEVRON} />
            </svg>
          </span>
        </summary>

        {answer && (
          <p className="mt-[1.1cqw] text-[1.15cqw] leading-[1.45]" style={{ color: BODY }}>
            {answer}
          </p>
        )}
      </details>
    </li>
  )
}

function QuestionList({ spec, content }: { spec: Spec; content?: SectionContent }) {
  const questions = linesOf(content?.items)

  return (
    <ul
      className={`grid items-start gap-x-[1.67cqw] ${spec.gap} ${spec.columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
    >
      {Array.from({ length: spec.rows * spec.columns }, (_, i) => (
        <QuestionRow
          key={i}
          spec={spec}
          question={questions.length ? itemAt(content?.items, i) : undefined}
          answer={content?.answer}
          open={i === 0}
        />
      ))}
    </ul>
  )
}

/** A circled check followed by a line of copy, at the drawn 20×20. */
function CheckRow({ text }: { text?: string }) {
  return (
    <li className="flex items-center gap-[0.76cqw]">
      <svg viewBox="0 0 16 16" className="size-[1.39cqw] shrink-0" fill={GREEN} aria-hidden="true">
        <path d={CHECK} />
      </svg>
      {text ? (
        <span className="text-[1.39cqw] leading-tight" style={{ color: BODY }}>
          {text}
        </span>
      ) : (
        <span aria-hidden="true" className="h-[1cqw] w-[65%] rounded-full" style={{ background: BODY }} />
      )}
    </li>
  )
}

/** Miniature of what the FAQ accordion will look like on the page. */
export default function FaqPreview({ design, content }: FaqChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1

  if (spec.header === 'aside') {
    const points = linesOf(content?.points)

    return (
      // Both halves start at the same 80px margin — this design hangs no header
      // above the list, so there's nothing for the questions to sit under.
      <section
        aria-label="Frequently asked questions"
        className="grid h-full grid-cols-2 items-start gap-[2.8cqw] px-[8.3cqw] py-[5.5cqw]"
      >
        <div className="flex flex-col gap-[1.4cqw]">
          <Eyebrow text={content?.eyebrow} />
          <HeadlineLine text={content?.heading} />
          <BodyLine text={content?.body} />
          <ul className="mt-[1.4cqw] flex flex-col gap-[0.83cqw]">
            {Array.from({ length: 3 }, (_, i) => (
              <CheckRow key={i} text={points.length ? itemAt(content?.points, i) : undefined} />
            ))}
          </ul>
          <div className="mt-[2.9cqw] flex items-center gap-[1.1cqw]">
            <FilledButton label={content?.cta} />
            <OutlineButton label={content?.cta2} />
          </div>
        </div>

        <QuestionList spec={spec} content={content} />
      </section>
    )
  }

  const centered = spec.header === 'centered'

  return (
    // 80px of margin top and bottom, 120 either side, as all five are drawn.
    <section
      aria-label="Frequently asked questions"
      className="flex h-full flex-col gap-[2.9cqw] px-[8.3cqw] py-[5.5cqw]"
    >
      {/* The sentence spans 62% of the frame — 74% of what the margins leave. */}
      <div className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
        <Eyebrow text={content?.eyebrow} />
        <HeadlineLine className="w-[74%]" text={content?.heading} />
        <BodyLine className="w-[74%]" text={content?.body} />
      </div>

      {/* The one-column designs draw their list 800 wide and centred, not full. */}
      <div className={spec.columns === 1 ? 'mx-auto w-[66.7%]' : ''}>
        <QuestionList spec={spec} content={content} />
      </div>
    </section>
  )
}

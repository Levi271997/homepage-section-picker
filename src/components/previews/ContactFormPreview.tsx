import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

export type ContactFormChoice = {
  layout: string
  side: string
  list: string
  fields: string
}

const GREEN = 'var(--brand,#3f6b30)'
const PANEL_GREEN = 'var(--brand-soft,#e3edd8)'
const FIELD_GREY = '#f1efec'

/** One labelled input — the label above the space where the answer goes. */
function Field({ fill, tall, label }: { fill: string; tall?: boolean; label?: string }) {
  return (
    <span
      className={`flex flex-col justify-center gap-[0.8cqw] rounded-xs px-[1.5cqw] ${
        tall ? 'h-[8cqw]' : 'h-[6cqw]'
      }`}
      style={{ background: fill }}
    >
      {label ? (
        <span className="text-[1.3cqw] leading-none text-neutral-500">{label}</span>
      ) : (
        <span className="h-[0.9cqw] w-[18%] rounded-full bg-neutral-400" />
      )}
      <span className="h-[1.1cqw] w-[45%] rounded-full bg-neutral-400" />
    </span>
  )
}

/** Consent checkbox and its small print. */
function ConsentRow({ text }: { text?: string }) {
  return (
    <span className="flex items-start gap-[1.5cqw]">
      <span
        className="mt-[0.3cqw] size-[2.4cqw] shrink-0 rounded-xs border"
        style={{ borderColor: '#b9d3a6', background: 'var(--brand-soft,#eef4ea)' }}
      />
      {text ? (
        <span className="min-w-0 flex-1 text-[1.2cqw] leading-[1.45] text-neutral-500">{text}</span>
      ) : (
        <span className="flex min-w-0 flex-1 flex-col gap-[0.7cqw]">
          <BodyLine className="w-full" />
          <BodyLine className="w-[55%]" />
        </span>
      )}
    </span>
  )
}

/** The stack of fields, consent row and submit button. */
function FormBody({
  count,
  fieldFill,
  content,
}: {
  count: number
  fieldFill: string
  content?: SectionContent
}) {
  const labels = linesOf(content?.fieldLabels)

  return (
    <span className="flex flex-col gap-[1.5cqw]">
      {Array.from({ length: count }, (_, i) => (
        <Field
          key={i}
          fill={fieldFill}
          // The last field is the message box, so it gets the extra height.
          tall={i === count - 1}
          label={labels.length ? itemAt(content?.fieldLabels, i) : undefined}
        />
      ))}
      <ConsentRow text={content?.consent} />
      <span className="mt-[0.5cqw]">
        <FilledButton label={content?.cta} />
      </span>
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

/** Miniature of what the contact form will look like on the page. */
export default function ContactFormPreview({
  layout,
  side,
  list,
  fields,
  content,
}: ContactFormChoice & { content?: SectionContent }) {
  const count = Number(fields)
  const formFirst = side === 'left'
  const points = linesOf(content?.items)

  // The copy column, shared by every layout.
  const copy = (
    <span className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine className={content?.heading ? 'w-full' : 'w-[75%]'} text={content?.heading} />
      <BodyLine className="mt-[0.5cqw] w-full" text={content?.body} />
      {!content?.body && <BodyLine className="w-[85%]" />}

      {list === 'checks' && (
        <span className="mt-[0.8cqw] flex flex-col gap-[1.2cqw]">
          {Array.from({ length: 3 }, (_, i) => (
            <CheckRow key={i} text={points.length ? itemAt(content?.items, i) : undefined} />
          ))}
        </span>
      )}

      {layout === 'plain-form' ? (
        <span className="mt-[1cqw]">
          <FormBody count={count} fieldFill={FIELD_GREY} content={content} />
        </span>
      ) : (
        <span className="mt-[1cqw] flex items-center gap-[1.5cqw]">
          <FilledButton label={content?.cta} />
          <OutlineButton label={content?.cta2} />
        </span>
      )}
    </span>
  )

  // What sits opposite the copy: an image, or the form on its own panel.
  const panel =
    layout === 'plain-form' ? (
      <ImageBlock className="h-[80%] w-[45%] shrink-0" src={content?.image} />
    ) : (
      <span
        className={`w-[45%] shrink-0 rounded-[3px] p-[3cqw] ${
          layout === 'white-card' ? 'border border-neutral-200 shadow-sm' : ''
        }`}
        style={{ background: layout === 'green-card' ? PANEL_GREEN : '#ffffff' }}
      >
        <FormBody
          count={count}
          fieldFill={layout === 'green-card' ? '#ffffff' : FIELD_GREY}
          content={content}
        />
      </span>
    )

  return (
    <div className="flex h-full items-center gap-[5cqw] px-[5cqw] py-[4cqw]">
      {formFirst && panel}
      {copy}
      {!formFirst && panel}
    </div>
  )
}

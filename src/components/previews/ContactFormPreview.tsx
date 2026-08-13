import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

export type ContactFormChoice = {
  layout: string
  side: string
  list: string
  fields: string
}

const GREEN = 'var(--brand,#3f6b30)'
const PANEL_GREEN = '#e3edd8'
const FIELD_GREY = '#f1efec'

/** One labelled input — a caption bar over a value bar inside the field. */
function Field({ fill, tall }: { fill: string; tall?: boolean }) {
  return (
    <span
      className={`flex flex-col justify-center gap-[0.8cqw] rounded-[2px] px-[1.5cqw] ${
        tall ? 'h-[8cqw]' : 'h-[6cqw]'
      }`}
      style={{ background: fill }}
    >
      <span className="h-[0.9cqw] w-[18%] rounded-full bg-neutral-400" />
      <span className="h-[1.1cqw] w-[45%] rounded-full bg-neutral-500" />
    </span>
  )
}

/** Consent checkbox and its two lines of small print. */
function ConsentRow() {
  return (
    <span className="flex items-start gap-[1.5cqw]">
      <span
        className="mt-[0.3cqw] size-[2.4cqw] shrink-0 rounded-[2px] border"
        style={{ borderColor: '#b9d3a6', background: '#eef4ea' }}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-[0.7cqw]">
        <BodyLine className="w-full" />
        <BodyLine className="w-[55%]" />
      </span>
    </span>
  )
}

/** The stack of fields, consent row and submit button. */
function FormBody({ count, fieldFill }: { count: number; fieldFill: string }) {
  return (
    <span className="flex flex-col gap-[1.5cqw]">
      {Array.from({ length: count }, (_, i) => (
        <Field key={i} fill={fieldFill} tall={i === count - 1} />
      ))}
      <ConsentRow />
      <span className="mt-[0.5cqw] h-[5cqw] w-[30%] rounded-[2px]" style={{ background: GREEN }} />
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

/** Miniature of what the contact form will look like on the page. */
export default function ContactFormPreview({ layout, side, list, fields }: ContactFormChoice) {
  const count = Number(fields)
  const formFirst = side === 'left'

  // The copy column, shared by every layout.
  const copy = (
    <span className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
      <Eyebrow />
      <HeadlineLine className="w-[75%]" />
      <BodyLine className="mt-[0.5cqw] w-full" />
      <BodyLine className="w-[85%]" />

      {list === 'checks' && (
        <span className="mt-[0.8cqw] flex flex-col gap-[1.2cqw]">
          {Array.from({ length: 3 }, (_, i) => (
            <CheckRow key={i} />
          ))}
        </span>
      )}

      {layout === 'plain-form' ? (
        <span className="mt-[1cqw]">
          <FormBody count={count} fieldFill={FIELD_GREY} />
        </span>
      ) : (
        <span className="mt-[1cqw] flex gap-[1.5cqw]">
          <FilledButton />
          <OutlineButton />
        </span>
      )}
    </span>
  )

  // What sits opposite the copy: an image, or the form on its own panel.
  const panel =
    layout === 'plain-form' ? (
      <ImageBlock className="h-[80%] w-[45%] shrink-0" />
    ) : (
      <span
        className={`w-[45%] shrink-0 rounded-[3px] p-[3cqw] ${
          layout === 'white-card' ? 'border border-neutral-200 shadow-sm' : ''
        }`}
        style={{ background: layout === 'green-card' ? PANEL_GREEN : '#ffffff' }}
      >
        <FormBody count={count} fieldFill={layout === 'green-card' ? '#ffffff' : FIELD_GREY} />
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

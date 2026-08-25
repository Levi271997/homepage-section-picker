import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FIELD_SHELL, HeadlineLine, ImageBlock } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v6'. */
export type ContactFormDesign = string

export type ContactFormChoice = {
  design: ContactFormDesign
}

const GREEN = 'var(--brand,#4b7b35)'
/** The pale green the panel and the checkbox are filled with. */
const TINT = 'var(--brand-soft,#e1efd8)'
/** The warm grey a field takes when it isn't sitting on the tint. */
const FIELD_GREY = '#f5f3f1'
const TAN = 'var(--brand-accent,#917061)'
const INK = '#1e1515'
const BODY = '#563f3d'
const LIGHT = '#f5f3f1'

/** The circled check beside a point, the same glyph the rest of the sets use. */
const CHECK =
  'M8 16C10.122 16 12.157 15.157 13.657 13.657C15.157 12.157 16 10.122 16 8C16 5.878 15.157 3.843 13.657 2.343C12.157 0.843 10.122 0 8 0C5.878 0 3.843 0.843 2.343 2.343C0.843 3.843 0 5.878 0 8C0 10.122 0.843 12.157 2.343 13.657C3.843 15.157 5.878 16 8 16ZM11.531 6.531L7.531 10.531C7.238 10.825 6.763 10.825 6.472 10.531L4.472 8.531C4.178 8.238 4.178 7.763 4.472 7.472C4.766 7.181 5.241 7.178 5.531 7.472L7 8.941L10.469 5.469C10.762 5.175 11.238 5.175 11.528 5.469C11.819 5.762 11.822 6.237 11.528 6.528L11.531 6.531Z'

/**
 * What each design is made of.
 *
 * Every one is the same five-field form — 58-tall boxes on an 8px gap, a
 * consent checkbox and a green submit — set beside the same copy. What a design
 * decides is what holds that form: a pale green panel, a raised white card, or
 * nothing at all, in which case the form runs under the copy and a picture takes
 * the other half. And which side any of it sits on.
 *
 * The panel designs carry ticked points and a second button under the copy; the
 * two with a picture don't, because the form is already there.
 */
type Spec = {
  /** What holds the form: the pale green panel, a raised white card, or nothing. */
  form: 'green' | 'white' | 'inline'
  /** Which side the panel — or, where the form is inline, the picture — sits on. */
  side: 'left' | 'right'
  /** Ticked points and a second button under the copy. */
  points?: boolean
  /** The message drawn as a taller box carrying only its placeholder. */
  textarea?: boolean
}

const SPECS: Record<string, Spec> = {
  v1: { form: 'green', side: 'right', points: true },
  v2: { form: 'green', side: 'left', points: true },
  v3: { form: 'white', side: 'right', points: true },
  v4: { form: 'white', side: 'left', points: true },
  v5: { form: 'inline', side: 'right', textarea: true },
  v6: { form: 'inline', side: 'left' },
}

/** Five in all six designs — the set draws no other count. */
const FIELDS = 5
const POINTS = 3

/**
 * A button at the 154×46 the set draws — smaller than the shared `FilledButton`,
 * the same as the call to action's.
 */
function FormButton({ label, outline, submit }: { label?: string | null; outline?: boolean; submit?: boolean }) {
  const style = outline
    ? { background: '#ffffff', color: BODY, borderColor: GREEN }
    : { background: GREEN, color: LIGHT, borderColor: GREEN }

  if (!label) {
    return (
      <span
        aria-hidden="true"
        data-role="button"
        className="block h-[3.2cqw] w-[10.7cqw] shrink-0 rounded-[0.28cqw] border"
        style={style}
      />
    )
  }
  return (
    <button
      type={submit ? 'submit' : 'button'}
      data-role="button"
      className="inline-flex h-[3.2cqw] shrink-0 items-center rounded-[0.28cqw] border px-[1.74cqw] text-[1.11cqw] leading-none font-medium"
      style={style}
    >
      {label}
    </button>
  )
}

/**
 * One field: its label over the example the artwork fills it with.
 *
 * A real control, not a picture of one — on the assembled page the form can be
 * filled in. Safe everywhere because `PreviewFrame` marks the row thumbnails,
 * picker cards and swap menus `decorative`, which puts `inert` on the whole
 * subtree; only the full-page view renders without it.
 *
 * The example the artwork shows inside each box becomes the placeholder, in the
 * tan it's drawn in. What someone types takes the body ink instead, so their
 * own answer doesn't read as more placeholder — which is exactly what
 * `design-sets/input-fields` draws for its default and selected states.
 *
 * The box itself follows that set too, through `FIELD_SHELL`: no edge at rest,
 * a 1px #563F3D edge on focus. The fill stays whatever the section draws — the
 * white of a green panel, or the warm grey everywhere else.
 */
const TYPED = 'w-full bg-transparent outline-none placeholder:text-[color:var(--brand-accent,#917061)]'

function Field({ label, hint, tall, onTint }: { label?: string; hint?: string; tall?: boolean; onTint: boolean }) {
  const shell = { background: onTint ? '#ffffff' : FIELD_GREY }

  // The one design that draws a taller message box carries no label above it.
  if (tall) {
    return (
      <label className={`${FIELD_SHELL} flex h-[6.1cqw] px-[1.18cqw] py-[0.9cqw]`} style={shell}>
        <span className="sr-only">{label || 'Message'}</span>
        <textarea
          placeholder={hint}
          className={`${TYPED} h-full resize-none text-[1.39cqw] leading-[1.35]`}
          style={{ color: BODY }}
        />
      </label>
    )
  }

  return (
    <label
      // 58 tall with 17 of padding, as the section draws it; the 4px radius and
      // the focus edge come from the shared field shell.
      className={`${FIELD_SHELL} flex h-[4.03cqw] flex-col justify-center gap-[0.42cqw] px-[1.18cqw]`}
      style={shell}
    >
      {label ? (
        <span className="text-[0.9cqw] leading-none" style={{ color: TAN }}>
          {label}
        </span>
      ) : (
        <span aria-hidden="true" className="block h-[0.7cqw] w-[3cqw] rounded-full" style={{ background: TAN }} />
      )}
      <input
        type="text"
        placeholder={hint}
        className={`${TYPED} text-[1.39cqw] leading-none`}
        style={{ color: BODY }}
      />
    </label>
  )
}

/** The five fields, the consent line and the submit — the form itself. */
function Form({ spec, content }: { spec: Spec; content?: SectionContent }) {
  const onTint = spec.form === 'green'
  const labels = linesOf(content?.fieldLabels)
  const hints = linesOf(content?.fieldHints)

  return (
    // A real form, so a stray Enter in a field doesn't navigate the window away.
    <form aria-label="Contact" onSubmit={(e) => e.preventDefault()} className="flex flex-col">
      <div className="flex flex-col gap-[0.55cqw]">
        {Array.from({ length: FIELDS }, (_, i) => (
          <Field
            key={i}
            onTint={onTint}
            tall={spec.textarea && i === FIELDS - 1}
            label={labels.length ? itemAt(content?.fieldLabels, i) : undefined}
            hint={hints.length ? itemAt(content?.fieldHints, i) : undefined}
          />
        ))}
      </div>

      {/* 19px square, filled with the tint and edged in green, as it's drawn.
          The colours are classes rather than inline style so the checked state
          can win — an inline background would outrank the utility. */}
      <label className="mt-[1.46cqw] flex items-start gap-[0.63cqw]">
        <span className="relative mt-[0.2cqw] flex shrink-0">
          <input
            type="checkbox"
            className="peer size-[1.32cqw] appearance-none rounded-[0.14cqw] border border-[color:var(--brand,#4b7b35)] bg-[color:var(--brand-soft,#e1efd8)] outline-none checked:bg-[color:var(--brand,#4b7b35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand,#4b7b35)]"
          />
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden size-[1.32cqw] peer-checked:block"
            fill="none"
          >
            <path d="M3.5 8.4l3 3 6-6.4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {content?.consent ? (
          <span className="text-[1.11cqw] leading-[1.35]" style={{ color: INK }}>
            {content.consent}
          </span>
        ) : (
          <span aria-hidden="true" className="mt-[0.3cqw] block h-[0.9cqw] w-full rounded-full bg-neutral-300" />
        )}
      </label>

      <div className="mt-[1.74cqw]">
        <FormButton label={content?.cta} submit />
      </div>
    </form>
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

/** Eyebrow, heading and body — the pitch that sits beside or above the form. */
function Copy({ content }: { content?: SectionContent }) {
  return (
    <>
      <Eyebrow text={content?.eyebrow} color={TAN} />
      <HeadlineLine text={content?.heading} color={INK} />
      <BodyLine text={content?.body} color={BODY} />
    </>
  )
}

/** Miniature of what the contact form will look like on the page. */
export default function ContactFormPreview({
  design,
  content,
}: ContactFormChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const points = linesOf(content?.items)
  const right = spec.side === 'right'

  if (spec.form === 'inline') {
    // The picture stretches to whatever the copy and form come to — that's why
    // the two artboards differ in height by exactly their pictures.
    return (
      <section
        aria-label="Contact form"
        className={`grid h-full items-stretch gap-[4.44cqw] px-[8.3cqw] py-[5.5cqw] ${
          right ? 'grid-cols-[556fr_580fr]' : 'grid-cols-[580fr_556fr]'
        }`}
      >
        <div className={`flex flex-col gap-[1.4cqw] ${right ? '' : 'order-2'}`}>
          <Copy content={content} />
          <div className="mt-[2.2cqw]">
            <Form spec={spec} content={content} />
          </div>
        </div>
        <ImageBlock className="h-full w-full" src={content?.image} />
      </section>
    )
  }

  // 686 of copy, 64 of gutter, 450 of panel — the 1200 the margins leave.
  return (
    <section
      aria-label="Contact form"
      className={`grid h-full items-center gap-[4.44cqw] px-[8.3cqw] py-[5.5cqw] ${
        right ? 'grid-cols-[686fr_450fr]' : 'grid-cols-[450fr_686fr]'
      }`}
    >
      <div className={`flex flex-col gap-[1.4cqw] ${right ? '' : 'order-2'}`}>
        <Copy content={content} />
        {spec.points && (
          <ul className="mt-[1.46cqw] flex flex-col gap-[0.83cqw]">
            {Array.from({ length: POINTS }, (_, i) => (
              <CheckRow key={i} text={points.length ? itemAt(content?.items, i) : undefined} />
            ))}
          </ul>
        )}
        <div className="mt-[1.6cqw] flex items-center gap-[1.11cqw]">
          <FormButton label={content?.cta2} />
          <FormButton label={content?.cta3} outline />
        </div>
      </div>

      {/* 20px of padding and an 8px radius, as both panels are drawn. */}
      <div
        className={`rounded-[0.55cqw] p-[1.39cqw] ${spec.form === 'white' ? 'shadow-[0_0.15cqw_0.6cqw_rgba(30,21,21,0.12)]' : ''}`}
        style={{ background: spec.form === 'green' ? TINT : '#ffffff' }}
      >
        <Form spec={spec} content={content} />
      </div>
    </section>
  )
}

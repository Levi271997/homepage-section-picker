import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, HeadlineLine, ImageBlock } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v10'. */
export type CtaDesign = string

export type CtaChoice = {
  design: CtaDesign
}

const GREEN = 'var(--brand,#4b7b35)'
/** The same green, through the token the big flat areas share with the stats band. */
const BAND_GREEN = 'var(--brand-band,#4b7b35)'
const TAN = 'var(--brand-accent,#917061)'
const INK = '#1e1515'
const BODY = '#563f3d'
/** The near-white the set sets its light copy and its button labels in. */
const LIGHT = '#f5f3f1'
/** The pale green edge the secondary button takes on the green band. */
const ON_GREEN_EDGE = '#e1efd8'

/** The circled check beside a point on the two designs that draw a list. */
const CHECK =
  'M8 16C10.122 16 12.157 15.157 13.657 13.657C15.157 12.157 16 10.122 16 8C16 5.878 15.157 3.843 13.657 2.343C12.157 0.843 10.122 0 8 0C5.878 0 3.843 0.843 2.343 2.343C0.843 3.843 0 5.878 0 8C0 10.122 0.843 12.157 2.343 13.657C3.843 15.157 5.878 16 8 16ZM11.531 6.531L7.531 10.531C7.238 10.825 6.763 10.825 6.472 10.531L4.472 8.531C4.178 8.238 4.178 7.763 4.472 7.472C4.766 7.181 5.241 7.178 5.531 7.472L7 8.941L10.469 5.469C10.762 5.175 11.238 5.175 11.528 5.469C11.819 5.762 11.822 6.237 11.528 6.528L11.531 6.531Z'

/**
 * What each design is made of.
 *
 * Ten drawn designs over three frames. A `band` runs the copy across the full
 * width; a `split` sets it beside a picture; a `panel` puts the whole thing on a
 * rounded green card. Behind any of them the set draws nothing, a photograph
 * under a 60% black wash, or the brand green.
 *
 * The buttons are drawn at 154×46 and 121×47 — smaller than the shared
 * `FilledButton`, and the green designs need a white one with dark text, which
 * the shared pair can't express. So this preview draws its own.
 */
type Spec = {
  /** Full-width copy, copy beside a picture, or a rounded green card. */
  frame: 'band' | 'split' | 'panel'
  /** What sits behind: a photograph under a dark wash, or the brand green. */
  ground?: 'photo' | 'green'
  /** Where a band's copy sits. */
  align?: 'left' | 'center'
  /** A band's buttons out at the right rather than under the copy. */
  buttonsRight?: boolean
  /** The picture on the right rather than the left. */
  imageRight?: boolean
  /** A ticked list under the body — only the two split designs draw one. */
  points?: boolean
  /** One button rather than two. */
  single?: boolean
}

const SPECS: Record<string, Spec> = {
  v1: { frame: 'band', align: 'left' },
  v2: { frame: 'band', align: 'left', buttonsRight: true },
  v3: { frame: 'band', align: 'left', ground: 'photo' },
  v4: { frame: 'band', align: 'left', ground: 'photo', buttonsRight: true },
  v5: { frame: 'split', imageRight: true, points: true },
  v6: { frame: 'split', points: true },
  v7: { frame: 'panel', ground: 'green', imageRight: true, single: true },
  v8: { frame: 'panel', ground: 'green', single: true },
  v9: { frame: 'band', align: 'center', ground: 'photo' },
  v10: { frame: 'band', align: 'center', ground: 'green' },
}

/** True where the copy is set light — on the wash or on the green. */
function isDark(spec: Spec) {
  return spec.ground === 'photo' || spec.ground === 'green'
}

/**
 * A button at the 154×46 the set draws, in the three forms it uses: the green
 * fill, the outlined white one beside it, and the white fill the green grounds
 * take instead.
 */
function CtaButton({ label, kind }: { label?: string | null; kind: 'fill' | 'outline' | 'white' | 'whiteEdge' }) {
  const style =
    kind === 'fill'
      ? { background: GREEN, color: LIGHT }
      : kind === 'outline'
        ? { background: '#ffffff', color: BODY, borderColor: GREEN }
        : kind === 'white'
          ? { background: '#ffffff', color: BODY, borderColor: '#ffffff' }
          : { background: '#ffffff', color: BODY, borderColor: ON_GREEN_EDGE }

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
      type="button"
      data-role="button"
      className="inline-flex h-[3.2cqw] shrink-0 items-center rounded-[0.28cqw] border px-[1.74cqw] text-[1.11cqw] leading-none font-medium"
      style={style}
    >
      {label}
    </button>
  )
}

function Buttons({ spec, content }: { spec: Spec; content?: SectionContent }) {
  const onGreen = spec.ground === 'green'
  return (
    // 16px between them, as every pair in the set is drawn.
    <div className="flex items-center gap-[1.11cqw]">
      <CtaButton label={content?.cta} kind={onGreen ? 'white' : 'fill'} />
      {!spec.single && <CtaButton label={content?.cta2} kind={onGreen ? 'whiteEdge' : 'outline'} />}
    </div>
  )
}

/** A circled check followed by a line of copy, at the drawn 20×20. */
function CheckRow({ text, dark }: { text?: string; dark: boolean }) {
  const color = dark ? LIGHT : BODY
  return (
    <li className="flex items-center gap-[0.76cqw]">
      <svg viewBox="0 0 16 16" className="size-[1.39cqw] shrink-0" fill={dark ? '#ffffff' : GREEN} aria-hidden="true">
        <path d={CHECK} />
      </svg>
      {text ? (
        <span className="text-[1.39cqw] leading-tight" style={{ color }}>
          {text}
        </span>
      ) : (
        <span aria-hidden="true" className="h-[1cqw] w-[65%] rounded-full" style={{ background: color }} />
      )}
    </li>
  )
}

/** Eyebrow, heading, body — and, where the design draws them, the ticked points. */
function Copy({
  spec,
  content,
  headingWidth = '',
  bodyWidth = '',
}: {
  spec: Spec
  content?: SectionContent
  headingWidth?: string
  bodyWidth?: string
}) {
  const dark = isDark(spec)
  const points = linesOf(content?.items)

  return (
    <>
      <Eyebrow text={content?.eyebrow} color={dark ? LIGHT : TAN} />
      <HeadlineLine className={headingWidth} text={content?.heading} color={dark ? '#ffffff' : INK} />
      <BodyLine className={bodyWidth} text={content?.body} color={dark ? LIGHT : BODY} />
      {spec.points && (
        <ul className="mt-[1.46cqw] flex flex-col gap-[0.83cqw]">
          {Array.from({ length: 3 }, (_, i) => (
            <CheckRow key={i} dark={dark} text={points.length ? itemAt(content?.items, i) : undefined} />
          ))}
        </ul>
      )}
    </>
  )
}

/** The photograph and the 60% black wash the three photo designs sit on. */
function PhotoGround({ src }: { src?: string }) {
  return (
    <>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary URL or data URI
        <img src={src} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 bg-neutral-400" />
      )}
      <span aria-hidden="true" className="absolute inset-0" style={{ background: 'rgba(17,17,17,0.6)' }} />
    </>
  )
}

/** Miniature of what the closing pitch will look like on the page. */
export default function CtaPreview({ design, content }: CtaChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1

  if (spec.frame === 'panel') {
    // 1200×513 with a 24px radius and 56 of padding, as both panels are drawn.
    return (
      <section aria-label="Get in touch" className="flex h-full flex-col px-[8.3cqw] py-[5.5cqw]">
        <div
          className={`grid h-full items-center gap-[6.25cqw] rounded-[1.67cqw] p-[3.9cqw] ${
            spec.imageRight ? 'grid-cols-[553fr_445fr]' : 'grid-cols-[445fr_553fr]'
          }`}
          style={{ background: BAND_GREEN }}
        >
          <div className={`flex flex-col gap-[1.4cqw] ${spec.imageRight ? '' : 'order-2'}`}>
            <Copy spec={spec} content={content} />
            <div className="mt-[1.6cqw]">
              <Buttons spec={spec} content={content} />
            </div>
          </div>
          {/* 445×401 with an 8px radius. */}
          <ImageBlock className="aspect-[445/401] w-full rounded-[0.55cqw]" src={content?.image} />
        </div>
      </section>
    )
  }

  if (spec.frame === 'split') {
    // 556 of copy, 64 of gutter, 580 of picture — the 1200 the margins leave.
    return (
      <section
        aria-label="Get in touch"
        className={`grid h-full items-center gap-[4.44cqw] px-[8.3cqw] py-[5.5cqw] ${
          spec.imageRight ? 'grid-cols-[556fr_580fr]' : 'grid-cols-[580fr_556fr]'
        }`}
      >
        <div className={`flex flex-col gap-[1.4cqw] ${spec.imageRight ? '' : 'order-2'}`}>
          <Copy spec={spec} content={content} />
          <div className="mt-[1.6cqw]">
            <Buttons spec={spec} content={content} />
          </div>
        </div>
        <ImageBlock className="aspect-[580/452] w-full" src={content?.image} />
      </section>
    )
  }

  const centered = spec.align === 'center'

  return (
    <section
      aria-label="Get in touch"
      className="relative flex h-full flex-col overflow-hidden px-[8.3cqw] py-[5.5cqw]"
      style={spec.ground === 'green' ? { background: BAND_GREEN } : undefined}
    >
      {spec.ground === 'photo' && <PhotoGround src={content?.image} />}

      {spec.buttonsRight ? (
        // The pair sits at the top margin, out at the right edge. The copy
        // carries the 771 the set leaves it — without that width the buttons
        // have nothing to be pushed against and run past the margin.
        <div className="relative flex items-start justify-between gap-[2.8cqw]">
          <div className="flex w-[64%] flex-col gap-[1.4cqw]">
            <Copy spec={spec} content={content} headingWidth="w-full" bodyWidth="w-full" />
          </div>
          <div className="shrink-0">
            <Buttons spec={spec} content={content} />
          </div>
        </div>
      ) : (
        <div className={`relative flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : ''}`}>
          <Copy spec={spec} content={content} headingWidth="w-[74%]" bodyWidth="w-[74%]" />
          <div className="mt-[1.6cqw]">
            <Buttons spec={spec} content={content} />
          </div>
        </div>
      )}
    </section>
  )
}

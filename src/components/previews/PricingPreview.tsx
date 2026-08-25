import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v6'. */
export type PricingDesign = string

export type PricingChoice = {
  design: PricingDesign
}

const GREEN = 'var(--brand,#4b7b35)'
/** The price is drawn in the lighter green the stats figures use. */
const PRICE_GREEN = 'var(--brand-figure,#639c46)'
const TAN = 'var(--brand-accent,#917061)'
/** The muted tan a feature the plan doesn't include is drawn in. */
const MUTED_TICK = '#b59f8f'
const MUTED_TEXT = '#a0816f'
const BODY = '#563f3d'
const HAIRLINE = '#d0c3b8'
const TINT = 'var(--brand-soft,#f2f8ed)'
const BADGE = '#fcba13'

/**
 * The circled check, traced as the single path Figma exported: an outer circle
 * with the check wound the other way, so non-zero fill leaves it as a hole.
 */
const CHECK =
  'M8 16C10.122 16 12.157 15.157 13.657 13.657C15.157 12.157 16 10.122 16 8C16 5.878 15.157 3.843 13.657 2.343C12.157 0.843 10.122 0 8 0C5.878 0 3.843 0.843 2.343 2.343C0.843 3.843 0 5.878 0 8C0 10.122 0.843 12.157 2.343 13.657C3.843 15.157 5.878 16 8 16ZM11.531 6.531L7.531 10.531C7.238 10.825 6.763 10.825 6.472 10.531L4.472 8.531C4.178 8.238 4.178 7.763 4.472 7.472C4.766 7.181 5.241 7.178 5.531 7.472L7 8.941L10.469 5.469C10.762 5.175 11.238 5.175 11.528 5.469C11.819 5.762 11.822 6.237 11.528 6.528L11.531 6.531Z'

/**
 * What each design is made of.
 *
 * Three plans across in all six — 373 wide on a 40px gutter, inside the same
 * 120px margins as the rest of the sets, under the same centred header. What a
 * design decides is whether a plan sits in an outlined card, whether the middle
 * one is tinted, whether a picture opens the card, which side of a feature the
 * tick sits on, and where the gold pill goes.
 *
 * A design with no `ticks` draws no feature list at all — V6 goes straight from
 * the summary to the button.
 */
type Spec = {
  /** An outlined card around each plan, rather than a bare column. */
  card?: boolean
  /** The middle plan filled with the pale green tint. */
  tint?: boolean
  /** A picture above the price, which moves the plan name below it. */
  image?: boolean
  /** Which side of a feature its tick sits on. Unset draws no features. */
  ticks?: 'left' | 'right'
  /** The gold pill beside the plan name, or out at the column's far edge. */
  badge: 'inline' | 'end'
}

const SPECS: Record<string, Spec> = {
  v1: { ticks: 'left', badge: 'end' },
  v2: { card: true, tint: true, ticks: 'left', badge: 'end' },
  v3: { ticks: 'right', badge: 'inline' },
  v4: { card: true, ticks: 'right', badge: 'end' },
  v5: { card: true, image: true, ticks: 'right', badge: 'end' },
  v6: { card: true, tint: true, badge: 'end' },
}

/** Three plans across in all six designs, and five features where there are any. */
const PLANS = 3
const FEATURES = 5
/** The last two features are drawn muted — what the plan doesn't include. */
const INCLUDED = 3

/** The gold "BEST PLAN" pill. */
function BestPlanBadge({ label }: { label?: string }) {
  if (label) {
    return (
      <span
        className="inline-flex h-[1.5cqw] shrink-0 items-center rounded-full px-[0.8cqw] text-[0.85cqw] leading-none font-semibold tracking-[0.06em] text-neutral-900 uppercase"
        style={{ background: BADGE }}
      >
        {label}
      </span>
    )
  }
  return <span aria-hidden="true" className="block h-[1.5cqw] w-[5.5cqw] shrink-0 rounded-full" style={{ background: BADGE }} />
}

/** "$19  per month", the period set on the price's baseline. */
function Price({ amount, period }: { amount?: string; period?: string }) {
  return (
    <p className="flex items-baseline gap-[0.8cqw]">
      <span className="text-[3.5cqw] leading-none font-bold" style={{ color: PRICE_GREEN }}>
        {amount || '$19'}
      </span>
      {period ? (
        <span className="text-[1.2cqw] leading-none" style={{ color: TAN }}>
          {period}
        </span>
      ) : (
        <span aria-hidden="true" className="h-[1cqw] w-[6cqw] rounded-full" style={{ background: TAN }} />
      )}
    </p>
  )
}

/** The plan name — above the price, or under it on the design that opens with a picture. */
function PlanName({ name }: { name?: string }) {
  if (name) {
    return (
      <h3 className="text-[1.25cqw] leading-tight font-semibold" style={{ color: TAN }}>
        {name}
      </h3>
    )
  }
  return <span aria-hidden="true" className="block h-[1.1cqw] w-[30%] rounded-full" style={{ background: TAN }} />
}

/** One feature row. The last two fade to tan, as the set draws them. */
function FeatureRow({ side, muted, text }: { side: 'left' | 'right'; muted: boolean; text?: string }) {
  const tick = (
    <svg viewBox="0 0 16 16" className="size-[1.1cqw] shrink-0" fill={muted ? MUTED_TICK : GREEN} aria-hidden="true">
      <path d={CHECK} />
    </svg>
  )
  const label = text ? (
    <span
      className={`min-w-0 flex-1 truncate text-[1.2cqw] leading-tight ${side === 'right' ? 'text-right' : ''}`}
      style={{ color: muted ? MUTED_TEXT : BODY }}
    >
      {text}
    </span>
  ) : (
    <span
      aria-hidden="true"
      className="h-[0.9cqw] w-[70%] rounded-full"
      style={{ background: muted ? MUTED_TEXT : BODY }}
    />
  )

  return (
    <li className={`flex items-center gap-[1cqw] ${side === 'right' ? 'justify-between' : ''}`}>
      {side === 'right' ? (
        <>
          {label}
          {tick}
        </>
      ) : (
        <>
          {tick}
          {label}
        </>
      )}
    </li>
  )
}

/**
 * The plan's own button, drawn at the 126×36 the set gives it. Smaller than the
 * header's, so it doesn't borrow the shared `FilledButton`.
 */
function PlanButton({ label }: { label?: string }) {
  if (label) {
    return (
      <span
        data-role="button"
        className="inline-flex h-[2.5cqw] items-center rounded-xs px-[1.25cqw] text-[1.1cqw] leading-none font-medium text-white"
        style={{ background: GREEN }}
      >
        {label}
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      data-role="button"
      className="block h-[2.5cqw] w-[8.75cqw] rounded-xs"
      style={{ background: GREEN }}
    />
  )
}

function Plan({
  spec,
  best,
  index,
  content,
}: {
  spec: Spec
  best: boolean
  index: number
  content?: SectionContent
}) {
  const names = linesOf(content?.items)
  const name = names.length ? itemAt(content?.items, index) : undefined
  const price = itemAt(content?.prices, index) || undefined
  const features = linesOf(content?.features)
  const badge = content?.badge || undefined
  const tinted = best && !!spec.tint

  return (
    <li
      // 24px of padding, as every card in the set is drawn.
      className={`flex flex-col ${spec.card ? 'rounded-xs border p-[1.65cqw]' : ''}`}
      style={{
        borderColor: spec.card ? HAIRLINE : undefined,
        background: tinted ? TINT : undefined,
      }}
    >
      {spec.image ? (
        <>
          <div className="flex items-start justify-between gap-[1cqw]">
            {/* 64px square, in the pale blue the set uses for a picture. */}
            <span aria-hidden="true" className="size-[4.4cqw] rounded-xs" style={{ background: '#d6ecff' }} />
            {best && <BestPlanBadge label={badge} />}
          </div>
          <div className="mt-[1.5cqw]">
            <Price amount={price} period={content?.period} />
          </div>
          <div className="mt-[0.7cqw]">
            <PlanName name={name} />
          </div>
        </>
      ) : (
        <>
          <div className={`flex items-center gap-[1cqw] ${spec.badge === 'end' ? 'justify-between' : ''}`}>
            <PlanName name={name} />
            {best && <BestPlanBadge label={badge} />}
          </div>
          <div className="mt-[0.15cqw]">
            <Price amount={price} period={content?.period} />
          </div>
        </>
      )}

      <div className="mt-[0.55cqw]">
        {content?.planBody ? (
          <p className="text-[1.15cqw] leading-[1.45]" style={{ color: BODY }}>
            {content.planBody}
          </p>
        ) : (
          <span className="flex flex-col gap-[0.7cqw]">
            <BodyLine className="w-full" />
            <BodyLine className="w-[85%]" />
          </span>
        )}
      </div>

      <span aria-hidden="true" className="mt-[1.25cqw] h-px w-full" style={{ background: HAIRLINE }} />

      {spec.ticks && (
        <ul className="mt-[1.25cqw] flex flex-col gap-[0.4cqw]">
          {Array.from({ length: FEATURES }, (_, i) => (
            <FeatureRow
              key={i}
              side={spec.ticks!}
              muted={i >= INCLUDED}
              text={features.length ? itemAt(content?.features, i) : undefined}
            />
          ))}
        </ul>
      )}

      <div className="mt-[1.8cqw]">
        <PlanButton label={content?.cta} />
      </div>
    </li>
  )
}

/** Miniature of what the pricing table will look like on the page. */
export default function PricingPreview({ design, content }: PricingChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1

  return (
    // 80px of margin top and bottom, 120 either side, as all six are drawn —
    // which leaves the 1200 the three 373-wide plans and their 40px gutters need.
    <section aria-label="Pricing" className="flex h-full flex-col gap-[4.5cqw] px-[8.3cqw] py-[5.5cqw]">
      {/* The sentence spans 62% of the frame — 74% of what the margins leave. */}
      <div className="flex flex-col items-center gap-[1.4cqw] text-center">
        <Eyebrow text={content?.eyebrow} />
        <HeadlineLine className="w-[74%]" text={content?.heading} />
        <BodyLine className="w-[74%]" text={content?.body} />
        <div className="mt-[0.5cqw]">
          <FilledButton label={content?.headerCta} />
        </div>
      </div>

      <ul className="grid grid-cols-3 gap-[2.8cqw]">
        {Array.from({ length: PLANS }, (_, i) => (
          <Plan key={i} spec={spec} best={i === 1} index={i} content={content} />
        ))}
      </ul>
    </section>
  )
}

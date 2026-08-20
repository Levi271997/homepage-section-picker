import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine } from '@/components/previews/parts'

export type PricingChoice = {
  layout: string
  ticks: string
  card: string
  highlight: string
}

const GREEN = 'var(--brand,#3f6b30)'
const PRICE_GREEN = 'var(--brand-figure,#5f9147)'
const TAN = 'var(--brand-accent,#a1806a)'
const BADGE = '#f0b323'
const FILL = 'var(--brand-soft,#eef4ea)'

/** The yellow "BEST PLAN" pill. */
function BestPlanBadge({ label }: { label?: string }) {
  if (label) {
    return (
      <span
        className="inline-flex h-[2.4cqw] items-center rounded-full px-[1.4cqw] text-[1.2cqw] leading-none font-semibold tracking-[0.06em] text-neutral-900 uppercase"
        style={{ background: BADGE }}
      >
        {label}
      </span>
    )
  }
  return <span aria-hidden="true" className="block h-[2.2cqw] w-[9cqw] rounded-full" style={{ background: BADGE }} />
}

/** "$19  per month" */
function Price({ amount, period }: { amount?: string; period?: string }) {
  return (
    <p className="flex items-end gap-[1.2cqw]">
      <span className="text-[4.4cqw] leading-none font-bold" style={{ color: PRICE_GREEN }}>
        {amount || '$19'}
      </span>
      {period ? (
        <span className="mb-[0.3cqw] text-[1.4cqw] leading-none" style={{ color: TAN }}>
          {period}
        </span>
      ) : (
        <span aria-hidden="true" className="mb-[0.4cqw] h-[1.1cqw] w-[8cqw] rounded-full" style={{ background: TAN }} />
      )}
    </p>
  )
}

/** The plan name above or below the price. */
function PlanName({ name }: { name?: string }) {
  if (name) {
    return (
      <h3 className="text-[1.7cqw] leading-none font-semibold tracking-[0.06em] uppercase" style={{ color: TAN }}>
        {name}
      </h3>
    )
  }
  return <span aria-hidden="true" className="block h-[1.4cqw] w-[24%] rounded-full" style={{ background: TAN }} />
}

/** One feature row. Inactive rows fade to tan, as in the design. */
function FeatureRow({ side, muted, text }: { side: string; muted?: boolean; text?: string }) {
  const tick = (
    <span
      aria-hidden="true"
      className="size-[1.9cqw] shrink-0 rounded-full"
      style={{ background: muted ? '#cdbcb2' : GREEN }}
    />
  )
  const label = text ? (
    <span
      className={`min-w-0 flex-1 truncate text-[1.4cqw] leading-tight ${side === 'right' ? 'text-right' : ''}`}
      style={{ color: muted ? '#cdbcb2' : '#5b5b5b' }}
    >
      {text}
    </span>
  ) : (
    <span aria-hidden="true" className="h-[1cqw] w-[70%] rounded-full" style={{ background: muted ? '#cdbcb2' : '#5b5b5b' }} />
  )

  return side === 'right' ? (
    <li className="flex items-center justify-between gap-[1.5cqw]">
      {label}
      {tick}
    </li>
  ) : (
    <li className="flex items-center gap-[1.5cqw]">
      {tick}
      {label}
    </li>
  )
}

function PlanCard({
  layout,
  ticks,
  card,
  highlight,
  best,
  content,
  index,
}: PricingChoice & { best: boolean; content?: SectionContent; index: number }) {
  const bordered = card === 'bordered'
  const showBadge = best && highlight !== 'none'
  const filled = best && highlight === 'fill'

  const names = linesOf(content?.items)
  const name = names.length ? itemAt(content?.items, index) : undefined
  const price = itemAt(content?.prices, index) || undefined
  const features = linesOf(content?.features)
  const badge = content?.badge || undefined

  return (
    <li
      className={`flex flex-col gap-[1.6cqw] ${bordered ? 'rounded-[3px] border border-neutral-200 p-[2.5cqw]' : ''}`}
      style={filled ? { background: FILL } : undefined}
    >
      {layout === 'icon' ? (
        <>
          <div className="flex items-start justify-between">
            <span aria-hidden="true" className="size-[7cqw] rounded-xs" style={{ background: '#d9e8f8' }} />
            {showBadge && <BestPlanBadge label={badge} />}
          </div>
          <Price amount={price} period={content?.period} />
          <PlanName name={name} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-[2cqw]">
            <PlanName name={name} />
            {showBadge && <BestPlanBadge label={badge} />}
          </div>
          <Price amount={price} period={content?.period} />
        </>
      )}

      <div className="flex flex-col gap-[0.8cqw]">
        <BodyLine className="w-full" text={content?.planBody} />
        {!content?.planBody && <BodyLine className="w-[85%]" />}
      </div>

      <span aria-hidden="true" className="h-px w-full bg-neutral-200" />

      {layout !== 'simple' && (
        <ul className="flex flex-col gap-[1.1cqw]">
          {Array.from({ length: 5 }, (_, i) => (
            <FeatureRow
              key={i}
              side={ticks}
              muted={i >= 3}
              text={features.length ? itemAt(content?.features, i) : undefined}
            />
          ))}
        </ul>
      )}

      <div className="mt-[0.4cqw]">
        <FilledButton label={content?.cta} />
      </div>
    </li>
  )
}

/** Miniature of what the pricing table will look like on the page. */
export default function PricingPreview({
  layout,
  ticks,
  card,
  highlight,
  content,
}: PricingChoice & { content?: SectionContent }) {
  return (
    <section aria-label="Pricing" className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      <div className="flex flex-col items-center gap-[1.4cqw] text-center">
        <Eyebrow text={content?.eyebrow} />
        <HeadlineLine className={content?.heading ? 'w-[60%]' : 'w-[32%]'} text={content?.heading} />
        <BodyLine className="w-[64%]" text={content?.body} />
      </div>

      <ul className="grid grid-cols-3 items-start gap-[3cqw]">
        {Array.from({ length: 3 }, (_, i) => (
          <PlanCard
            key={i}
            layout={layout}
            ticks={ticks}
            card={card}
            highlight={highlight}
            best={i === 1}
            index={i}
            content={content}
          />
        ))}
      </ul>
    </section>
  )
}

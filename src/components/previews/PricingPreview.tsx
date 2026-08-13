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
const FILL = '#eef4ea'

/** The yellow "BEST PLAN" pill. */
function BestPlanBadge() {
  return <span className="h-[2.2cqw] w-[9cqw] rounded-full" style={{ background: BADGE }} />
}

/** "$19  per month" */
function Price() {
  return (
    <span className="flex items-end gap-[1.2cqw]">
      <span className="text-[4.4cqw] leading-none font-bold" style={{ color: PRICE_GREEN }}>
        $19
      </span>
      <span className="mb-[0.4cqw] h-[1.1cqw] w-[8cqw] rounded-full" style={{ background: TAN }} />
    </span>
  )
}

/** One feature row. Inactive rows fade to tan, as in the design. */
function FeatureRow({ side, muted }: { side: string; muted?: boolean }) {
  const tick = <span className="size-[1.9cqw] shrink-0 rounded-full" style={{ background: muted ? '#cdbcb2' : GREEN }} />
  const text = (
    <span
      className="h-[1cqw] w-[70%] rounded-full"
      style={{ background: muted ? '#cdbcb2' : '#5b5b5b' }}
    />
  )

  return side === 'right' ? (
    <span className="flex items-center justify-between gap-[1.5cqw]">
      {text}
      {tick}
    </span>
  ) : (
    <span className="flex items-center gap-[1.5cqw]">
      {tick}
      {text}
    </span>
  )
}

function PlanCard({
  layout,
  ticks,
  card,
  highlight,
  best,
}: PricingChoice & { best: boolean }) {
  const bordered = card === 'bordered'
  const showBadge = best && highlight !== 'none'
  const filled = best && highlight === 'fill'

  return (
    <span
      className={`flex flex-col gap-[1.6cqw] ${bordered ? 'rounded-[3px] border border-neutral-200 p-[2.5cqw]' : ''}`}
      style={filled ? { background: FILL } : undefined}
    >
      {layout === 'icon' ? (
        <>
          <span className="flex items-start justify-between">
            <span className="size-[7cqw] rounded-[2px]" style={{ background: '#d9e8f8' }} />
            {showBadge && <BestPlanBadge />}
          </span>
          <Price />
          <span className="h-[1.4cqw] w-[24%] rounded-full" style={{ background: TAN }} />
        </>
      ) : (
        <>
          <span className="flex items-center justify-between gap-[2cqw]">
            <span className="h-[1.4cqw] w-[24%] rounded-full" style={{ background: TAN }} />
            {showBadge && <BestPlanBadge />}
          </span>
          <Price />
        </>
      )}

      <span className="flex flex-col gap-[0.8cqw]">
        <BodyLine className="w-full" />
        <BodyLine className="w-[85%]" />
      </span>

      <span className="h-px w-full bg-neutral-200" />

      {layout !== 'simple' && (
        <span className="flex flex-col gap-[1.1cqw]">
          {Array.from({ length: 5 }, (_, i) => (
            <FeatureRow key={i} side={ticks} muted={i >= 3} />
          ))}
        </span>
      )}

      <span className="mt-[0.4cqw] h-[4cqw] w-[52%] rounded-[2px]" style={{ background: GREEN }} />
    </span>
  )
}

/** Miniature of what the pricing table will look like on the page. */
export default function PricingPreview({ layout, ticks, card, highlight }: PricingChoice) {
  return (
    <div className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      <span className="flex flex-col items-center gap-[1.4cqw]">
        <Eyebrow />
        <HeadlineLine className="w-[32%]" />
        <BodyLine className="w-[64%]" />
        <span className="mt-[0.5cqw]">
          <FilledButton />
        </span>
      </span>

      <div className="grid grid-cols-3 items-start gap-[3cqw]">
        {Array.from({ length: 3 }, (_, i) => (
          <PlanCard key={i} layout={layout} ticks={ticks} card={card} highlight={highlight} best={i === 1} />
        ))}
      </div>
    </div>
  )
}

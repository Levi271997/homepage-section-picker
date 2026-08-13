import { BodyLine, Eyebrow, FilledButton, HeadlineLine } from '@/components/previews/parts'

export type TestimonialsChoice = {
  layout: string
  mark: string
  card: string
  header: string
  rows: string
}

const GREEN = 'var(--brand,#3f6b30)'
const GOLD = '#f5c02c'
const TAN = 'var(--brand-accent,#a1806a)'
const AVATAR = '#d7e9fb'

/** Four gold stars and one grey, as in the design. */
function Stars() {
  return (
    <span className="flex gap-[0.6cqw] text-[2.6cqw] leading-none">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < 4 ? GOLD : '#cfcfcf' }}>
          ★
        </span>
      ))}
    </span>
  )
}

/** The solid green quote badge. */
function QuoteMark() {
  return <span className="block size-[4cqw] rounded-[2px] rounded-bl-none" style={{ background: GREEN }} />
}

function Mark({ mark }: { mark: string }) {
  return mark === 'quote' ? <QuoteMark /> : <Stars />
}

function QuoteLines({ centered }: { centered?: boolean }) {
  return (
    <span className={`flex flex-col gap-[0.9cqw] ${centered ? 'items-center' : ''}`}>
      <BodyLine className="w-full" />
      <BodyLine className="w-[95%]" />
      <BodyLine className={centered ? 'w-[70%]' : 'w-[80%]'} />
      <BodyLine className={centered ? 'w-[40%]' : 'w-[55%]'} />
    </span>
  )
}

/** Avatar, name and "Position at Company Name". */
function Attribution({ stacked }: { stacked?: boolean }) {
  const text = (
    <span className={`flex flex-col gap-[0.7cqw] ${stacked ? 'items-center' : ''}`}>
      <span className="h-[1.3cqw] w-[13cqw] rounded-full bg-neutral-900" />
      <span className="h-[1cqw] w-[18cqw] rounded-full" style={{ background: TAN }} />
    </span>
  )

  return stacked ? (
    <span className="flex flex-col items-center gap-[1.4cqw]">
      <span className="size-[6cqw] rounded-[2px]" style={{ background: AVATAR }} />
      {text}
    </span>
  ) : (
    <span className="flex items-center gap-[1.6cqw]">
      <span className="size-[6cqw] shrink-0 rounded-[2px]" style={{ background: AVATAR }} />
      {text}
    </span>
  )
}

function QuoteCard({ mark, card }: { mark: string; card: string }) {
  const shell =
    card === 'bordered'
      ? 'rounded-[3px] border border-neutral-200 p-[2.5cqw]'
      : card === 'shadow'
        ? 'rounded-[3px] bg-white p-[2.5cqw] shadow-md'
        : ''

  return (
    <span className={`flex flex-col gap-[1.8cqw] ${shell}`}>
      <Mark mark={mark} />
      <QuoteLines />
      <span className="mt-[0.5cqw]">
        <Attribution />
      </span>
    </span>
  )
}

/** Portrait block beside the quote. */
function MediaQuote({ mark }: { mark: string }) {
  return (
    <span className="flex items-start gap-[2.5cqw]">
      <span className="h-[26cqw] w-[32%] shrink-0 rounded-[2px]" style={{ background: AVATAR }} />
      <span className="flex min-w-0 flex-1 flex-col gap-[1.6cqw]">
        <Mark mark={mark} />
        <QuoteLines />
        <span className="flex flex-col gap-[0.7cqw]">
          <span className="h-[1.3cqw] w-[35%] rounded-full bg-neutral-900" />
          <span className="h-[1cqw] w-[52%] rounded-full" style={{ background: TAN }} />
        </span>
      </span>
    </span>
  )
}

/** Miniature of what the testimonials will look like on the page. */
export default function TestimonialsPreview({ layout, mark, card, header, rows }: TestimonialsChoice) {
  const centered = header === 'centered'

  const heading = (
    <span className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center' : 'items-start'}`}>
      <Eyebrow />
      <HeadlineLine className={centered ? 'w-[34%]' : 'w-[30%]'} />
      <BodyLine className={centered ? 'w-[64%]' : 'w-[58%]'} />
      <span className="mt-[0.5cqw]">
        <FilledButton />
      </span>
    </span>
  )

  return (
    <div className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      {heading}

      {layout === 'carousel' && (
        <div className="flex flex-col items-center gap-[2.5cqw]">
          <span className="flex w-full items-center gap-[2.5cqw]">
            <span className="size-[5cqw] shrink-0 rounded-[2px] border" style={{ borderColor: GREEN }} />
            <span
              className="flex flex-1 flex-col items-center gap-[2cqw] rounded-[4px] px-[8cqw] py-[3.5cqw]"
              style={{ background: '#eef4ea' }}
            >
              <Mark mark={mark} />
              <QuoteLines centered />
              <Attribution stacked />
            </span>
            <span className="size-[5cqw] shrink-0 rounded-[2px] border" style={{ borderColor: GREEN }} />
          </span>
          <span className="flex items-center gap-[1.2cqw]">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className="size-[1.3cqw] rounded-full"
                style={{ background: i === 0 ? GREEN : 'var(--brand-dim,#8cbb7c)' }}
              />
            ))}
          </span>
        </div>
      )}

      {layout === 'grid' && (
        <div className="grid grid-cols-3 items-start gap-x-[3cqw] gap-y-[3cqw]">
          {Array.from({ length: Number(rows) * 3 }, (_, i) => (
            <QuoteCard key={i} mark={mark} card={card} />
          ))}
        </div>
      )}

      {layout === 'media' && (
        <div className="grid grid-cols-2 items-start gap-x-[4cqw] gap-y-[3.5cqw]">
          {Array.from({ length: Number(rows) * 2 }, (_, i) => (
            <MediaQuote key={i} mark={mark} />
          ))}
        </div>
      )}
    </div>
  )
}

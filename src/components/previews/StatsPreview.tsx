import { itemAt, linesOf, splitStat } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine } from '@/components/previews/parts'

export type StatsChoice = {
  layout: string
  header: string
  band: string
  columns: string
}

const FIGURE_GREEN = 'var(--brand-figure,#5f9147)'
const BAND_GREEN = 'var(--brand-band,#4d7c35)'

function Stat({
  layout,
  onGreen,
  value,
  description,
}: {
  layout: string
  onGreen: boolean
  value?: string
  description?: string
}) {
  const parsed = value ? splitStat(value) : null

  return (
    <span className="flex flex-col gap-[1.3cqw]">
      <span className="text-[5cqw] leading-none font-bold" style={{ color: onGreen ? '#ffffff' : FIGURE_GREEN }}>
        {parsed ? (
          parsed.figure || parsed.label
        ) : (
          <>
            200<span className="ml-[1cqw] text-[3.4cqw]">+</span>
          </>
        )}
      </span>

      {parsed?.figure ? (
        <span
          className="text-[1.8cqw] leading-tight font-semibold"
          style={{ color: onGreen ? '#ffffff' : '#1c1c1c' }}
        >
          {parsed.label}
        </span>
      ) : (
        !parsed && (
          <span
            className="h-[1.6cqw] w-[30%] rounded-full"
            style={{ background: onGreen ? '#ffffff' : '#1c1c1c' }}
          />
        )
      )}

      {layout === 'full' &&
        (description ? (
          <span
            className="mt-[0.4cqw] text-[1.4cqw] leading-[1.45]"
            style={{ color: onGreen ? 'rgba(255,255,255,0.8)' : '#6b6b6b' }}
          >
            {description}
          </span>
        ) : (
          <span className="mt-[0.4cqw] flex flex-col gap-[0.8cqw]">
            <BodyLine className="w-full" />
            <BodyLine className="w-[88%]" />
            <BodyLine className="w-[62%]" />
          </span>
        ))}
    </span>
  )
}

/** Miniature of what the stats band will look like on the page. */
export default function StatsPreview({
  layout,
  header,
  band,
  columns,
  content,
}: StatsChoice & { content?: SectionContent }) {
  const onGreen = band === 'green'
  const count = Number(columns)
  const centered = header === 'centered'
  const figures = linesOf(content?.items)

  const row = (
    <div
      className="grid gap-[3cqw] px-[5cqw] py-[4cqw]"
      style={{
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        background: onGreen ? BAND_GREEN : undefined,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Stat
          key={i}
          layout={layout}
          onGreen={onGreen}
          value={figures.length ? itemAt(content?.items, i) : undefined}
          description={content?.itemBody}
        />
      ))}
    </div>
  )

  if (header === 'none') {
    return <div className="flex h-full flex-col justify-center">{row}</div>
  }

  return (
    <div className="flex h-full flex-col justify-center gap-[2cqw]">
      <span
        className={`flex flex-col gap-[1.4cqw] px-[5cqw] ${centered ? 'items-center text-center' : 'items-start'}`}
      >
        <Eyebrow text={content?.eyebrow} />
        <HeadlineLine
          className={content?.heading ? (centered ? 'w-[70%]' : 'w-[60%]') : centered ? 'w-[44%]' : 'w-[40%]'}
          text={content?.heading}
        />
        <BodyLine className={centered ? 'w-[64%]' : 'w-[58%]'} text={content?.body} />
        <span className="mt-[0.5cqw]">
          <FilledButton label={content?.cta} />
        </span>
      </span>

      {row}
    </div>
  )
}

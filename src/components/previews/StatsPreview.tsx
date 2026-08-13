import { BodyLine, Eyebrow, FilledButton, HeadlineLine } from '@/components/previews/parts'

export type StatsChoice = {
  layout: string
  header: string
  band: string
  columns: string
}

const FIGURE_GREEN = '#5f9147'
const BAND_GREEN = '#4d7c35'

function Stat({ layout, onGreen }: { layout: string; onGreen: boolean }) {
  return (
    <span className="flex flex-col gap-[1.3cqw]">
      <span className="text-[5cqw] leading-none font-bold" style={{ color: onGreen ? '#ffffff' : FIGURE_GREEN }}>
        200<span className="ml-[1cqw] text-[3.4cqw]">+</span>
      </span>
      <span
        className="h-[1.6cqw] w-[30%] rounded-full"
        style={{ background: onGreen ? '#ffffff' : '#1c1c1c' }}
      />
      {layout === 'full' && (
        <span className="mt-[0.4cqw] flex flex-col gap-[0.8cqw]">
          <BodyLine className="w-full" />
          <BodyLine className="w-[88%]" />
          <BodyLine className="w-[62%]" />
        </span>
      )}
    </span>
  )
}

/** Miniature of what the stats band will look like on the page. */
export default function StatsPreview({ layout, header, band, columns }: StatsChoice) {
  const onGreen = band === 'green'
  const count = Number(columns)
  const centered = header === 'centered'

  const row = (
    <div
      className="grid gap-[3cqw] px-[5cqw] py-[4cqw]"
      style={{
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        background: onGreen ? BAND_GREEN : undefined,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Stat key={i} layout={layout} onGreen={onGreen} />
      ))}
    </div>
  )

  if (header === 'none') {
    return <div className="flex h-full flex-col justify-center">{row}</div>
  }

  return (
    <div className="flex h-full flex-col justify-center gap-[2cqw]">
      <span className={`flex flex-col gap-[1.4cqw] px-[5cqw] ${centered ? 'items-center' : 'items-start'}`}>
        <Eyebrow />
        <HeadlineLine className={centered ? 'w-[44%]' : 'w-[40%]'} />
        <BodyLine className={centered ? 'w-[64%]' : 'w-[58%]'} />
        <span className="mt-[0.5cqw]">
          <FilledButton />
        </span>
      </span>

      {row}
    </div>
  )
}

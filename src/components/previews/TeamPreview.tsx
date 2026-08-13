import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock } from '@/components/previews/parts'

export type TeamChoice = {
  layout: string
  card: string
  align: string
  columns: string
}

const TAN = 'var(--brand-accent,#a1806a)'

function Member({ layout, card, align }: { layout: string; card: string; align: string }) {
  const centered = align === 'center'

  return (
    <span
      className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center' : 'items-start'} ${
        card === 'bordered' ? 'rounded-[3px] border border-neutral-200 p-[2.5cqw]' : ''
      }`}
    >
      {layout === 'wide' ? (
        <ImageBlock className="h-[13cqw] w-full" />
      ) : (
        <ImageBlock className="size-[8cqw]" />
      )}
      <span className={`flex flex-col gap-[0.9cqw] ${centered ? 'items-center' : 'items-start'}`}>
        <span className="h-[1.8cqw] w-[11cqw] rounded-full bg-neutral-900" />
        <span className="h-[1.2cqw] w-[13cqw] rounded-full" style={{ background: TAN }} />
      </span>
    </span>
  )
}

/** Miniature of what the team grid will look like on the page. */
export default function TeamPreview({ layout, card, align, columns }: TeamChoice) {
  const count = Number(columns)

  return (
    <div className="flex h-full flex-col gap-[4cqw] px-[5cqw] py-[4cqw]">
      <span className="flex flex-col items-center gap-[1.4cqw]">
        <Eyebrow />
        <HeadlineLine className="w-[36%]" />
        <BodyLine className="w-[64%]" />
        <span className="mt-[0.5cqw]">
          <FilledButton />
        </span>
      </span>

      <div
        className="grid items-start gap-[3cqw]"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: count }, (_, i) => (
          <Member key={i} layout={layout} card={card} align={align} />
        ))}
      </div>
    </div>
  )
}

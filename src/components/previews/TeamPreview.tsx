import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock } from '@/components/previews/parts'

export type TeamChoice = {
  layout: string
  card: string
  align: string
  columns: string
}

const TAN = 'var(--brand-accent,#a1806a)'

function Member({
  layout,
  card,
  align,
  name,
  role,
  src,
}: {
  layout: string
  card: string
  align: string
  name?: string
  role?: string
  src?: string
}) {
  const centered = align === 'center'

  return (
    <span
      className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center' : 'items-start'} ${
        card === 'bordered' ? 'rounded-[3px] border border-neutral-200 p-[2.5cqw]' : ''
      }`}
    >
      {layout === 'wide' ? (
        <ImageBlock className="h-[13cqw] w-full" src={src} />
      ) : (
        <ImageBlock className="size-[8cqw]" src={src} />
      )}
      <span
        className={`flex flex-col gap-[0.9cqw] ${centered ? 'items-center text-center' : 'items-start'}`}
      >
        {name ? (
          <span className="text-[1.9cqw] leading-tight font-semibold text-neutral-900">{name}</span>
        ) : (
          <span className="h-[1.8cqw] w-[11cqw] rounded-full bg-neutral-900" />
        )}
        {role ? (
          <span className="text-[1.5cqw] leading-tight" style={{ color: TAN }}>
            {role}
          </span>
        ) : (
          <span className="h-[1.2cqw] w-[13cqw] rounded-full" style={{ background: TAN }} />
        )}
      </span>
    </span>
  )
}

/** Miniature of what the team grid will look like on the page. */
export default function TeamPreview({
  layout,
  card,
  align,
  columns,
  content,
}: TeamChoice & { content?: SectionContent }) {
  const count = Number(columns)
  const names = linesOf(content?.items)

  return (
    <div className="flex h-full flex-col gap-[4cqw] px-[5cqw] py-[4cqw]">
      <span className="flex flex-col items-center gap-[1.4cqw] text-center">
        <Eyebrow text={content?.eyebrow} />
        <HeadlineLine className={content?.heading ? 'w-[70%]' : 'w-[36%]'} text={content?.heading} />
        <BodyLine className="w-[64%]" text={content?.body} />
        <span className="mt-[0.5cqw]">
          <FilledButton label={content?.cta} />
        </span>
      </span>

      <div
        className="grid items-start gap-[3cqw]"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: count }, (_, i) => (
          <Member
            key={i}
            layout={layout}
            card={card}
            align={align}
            name={names.length ? itemAt(content?.items, i) : undefined}
            role={itemAt(content?.roles, i) || undefined}
            src={content?.image}
          />
        ))}
      </div>
    </div>
  )
}

import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v3'. */
export type TeamDesign = string

export type TeamChoice = {
  design: TeamDesign
}

const TAN = 'var(--brand-accent,#a1806a)'
/** The warm tan the drawn cards are outlined in. */
const HAIRLINE = '#d0c3b8'

/**
 * What each design is made of.
 *
 * Three variations on one grid — four across at 270 wide on a 40px gutter, under
 * the same centred header. What a design decides is the shape of the portrait,
 * whether the member sits in an outlined box, and whether the name is centred
 * under the picture or set against the column's left edge.
 *
 * Measured off the SVGs: the 64px thumbnail, the 270×195 landscape, the #D0C3B8
 * outline and the 32px the card pads it with.
 */
type Spec = {
  /** A small square above the name, or a landscape one filling the column. */
  portrait: 'thumb' | 'wide'
  /** An outlined box around each member. */
  card?: boolean
  /** Copy centred under the portrait, or set against the column's left edge. */
  align: 'center' | 'left'
}

const SPECS: Record<string, Spec> = {
  v1: { portrait: 'thumb', align: 'center' },
  v2: { portrait: 'thumb', card: true, align: 'center' },
  v3: { portrait: 'wide', align: 'left' },
}

/** Four across in all three designs — the set draws no other count. */
const COLUMNS = 4

function Member({
  spec,
  name,
  role,
  src,
}: {
  spec: Spec
  name?: string
  role?: string
  src?: string
}) {
  const centered = spec.align === 'center'

  return (
    <li
      className={`flex flex-col gap-[2.2cqw] ${centered ? 'items-center' : 'items-start'} ${
        spec.card ? 'rounded-xs border p-[2.2cqw]' : ''
      }`}
      style={spec.card ? { borderColor: HAIRLINE } : undefined}
    >
      {spec.portrait === 'wide' ? (
        // 270×195 as drawn, so the picture keeps its landscape at any width.
        <ImageBlock className="aspect-[270/195] w-full" src={src} />
      ) : (
        <ImageBlock className="size-[4.4cqw]" src={src} />
      )}

      <div className={`flex flex-col gap-[1cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
        {name ? (
          <h3 className="text-[1.9cqw] leading-tight font-semibold text-neutral-900">{name}</h3>
        ) : (
          <span aria-hidden="true" className="h-[1.8cqw] w-[11cqw] rounded-full bg-neutral-900" />
        )}
        {role ? (
          <p className="text-[1.5cqw] leading-tight" style={{ color: TAN }}>
            {role}
          </p>
        ) : (
          <span aria-hidden="true" className="h-[1.2cqw] w-[13cqw] rounded-full" style={{ background: TAN }} />
        )}
      </div>
    </li>
  )
}

/** Miniature of what the team grid will look like on the page. */
export default function TeamPreview({ design, content }: TeamChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const names = linesOf(content?.items)

  return (
    // 80px of margin top and bottom, 120 either side, as all three are drawn —
    // which leaves the 1200 the four 270-wide columns and their 40px gutters need.
    <section aria-label="Team members" className="flex h-full flex-col gap-[4.7cqw] px-[8.3cqw] py-[5.5cqw]">
      {/* The sentence spans 62% of the frame in all three — 74% of what the
          margins leave — which is what keeps the heading above it on one line. */}
      <div className="flex flex-col items-center gap-[1.4cqw] text-center">
        <Eyebrow text={content?.eyebrow} />
        <HeadlineLine className="w-[74%]" text={content?.heading} />
        <BodyLine className="w-[74%]" text={content?.body} />
        <div className="mt-[0.5cqw]">
          <FilledButton label={content?.cta} />
        </div>
      </div>

      {/* Stretched, not top-aligned: a real name is longer than the drawn "Name
          here" and wraps, and the outlined designs read wrong when one card in
          the row is taller than the rest. */}
      <ul className="grid grid-cols-4 gap-[2.8cqw]">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <Member
            key={i}
            spec={spec}
            name={names.length ? itemAt(content?.items, i) : undefined}
            role={itemAt(content?.roles, i) || undefined}
            src={content?.image}
          />
        ))}
      </ul>
    </section>
  )
}

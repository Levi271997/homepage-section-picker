import { itemAt, linesOf, splitStat } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v4'. */
export type StatsDesign = string

export type StatsChoice = {
  design: StatsDesign
}

/**
 * The figures are drawn in a lighter green than the buttons — #639C46 against
 * the brand #4B7B35 — so they read as numerals rather than as another call to
 * action.
 */
const FIGURE_GREEN = 'var(--brand-figure,#639c46)'
const BAND_GREEN = 'var(--brand-band,#4b7b35)'
/** The label under a figure on the green band, a pale tint of it. */
const ON_BAND = '#e1efd8'
const LABEL = '#1e1515'
const BLURB = '#563f3d'

/**
 * What each design is made of.
 *
 * One row of four figures throughout — 270 wide on a 40px gutter, inside the
 * same 120px margins as the rest of the sets. What a design decides is whether
 * the row carries a header, which side that header sits on, whether each figure
 * gets a paragraph under its label, and whether the whole thing sits on the
 * green band.
 *
 * V1 and V2 are the tall ones at 1440×619; V3 and V4 are 252-tall strips.
 */
type Spec = {
  /** Where the header sits. The two strips carry none at all. */
  header?: 'centered' | 'left'
  /** A short paragraph under the label — only the two headed designs have one. */
  blurb?: boolean
  /** The green band, which turns the figures and their labels light. */
  band?: boolean
}

const SPECS: Record<string, Spec> = {
  v1: { header: 'centered', blurb: true },
  v2: { header: 'left', blurb: true },
  v3: {},
  v4: { band: true },
}

/** Four across in all four designs — the set draws no other count. */
const COLUMNS = 4

function Stat({
  spec,
  value,
  description,
}: {
  spec: Spec
  value?: string
  description?: string
}) {
  const parsed = value ? splitStat(value) : null
  const onBand = !!spec.band

  return (
    <li className="flex flex-col">
      {/* 40px as drawn, and the '+' set smaller beside it. */}
      <p className="text-[2.9cqw] leading-none font-bold" style={{ color: onBand ? '#ffffff' : FIGURE_GREEN }}>
        {parsed ? (
          parsed.figure || parsed.label
        ) : (
          <>
            200<span className="ml-[0.5cqw] text-[1.9cqw]">+</span>
          </>
        )}
      </p>

      {parsed?.figure ? (
        <p
          className="mt-[1.8cqw] text-[1.45cqw] leading-tight font-semibold"
          style={{ color: onBand ? ON_BAND : LABEL }}
        >
          {parsed.label}
        </p>
      ) : (
        !parsed && (
          <span
            aria-hidden="true"
            className="mt-[1.8cqw] h-[1.1cqw] w-[45%] rounded-full"
            style={{ background: onBand ? ON_BAND : LABEL }}
          />
        )
      )}

      {spec.blurb &&
        (description ? (
          <p className="mt-[0.9cqw] text-[1cqw] leading-[1.45]" style={{ color: BLURB }}>
            {description}
          </p>
        ) : (
          <span className="mt-[1.2cqw] flex flex-col gap-[0.7cqw]">
            <BodyLine className="w-full" />
            <BodyLine className="w-[88%]" />
            <BodyLine className="w-[62%]" />
          </span>
        ))}
    </li>
  )
}

/** Miniature of what the stats row will look like on the page. */
export default function StatsPreview({ design, content }: StatsChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const figures = linesOf(content?.items)
  const centered = spec.header === 'centered'

  return (
    // 80px of margin top and bottom, 120 either side, as all four are drawn —
    // which leaves the 1200 the four 270-wide columns and their 40px gutters
    // need. The band, where there is one, runs the full width behind them.
    <section
      aria-label="By the numbers"
      className="flex h-full flex-col gap-[4.6cqw] px-[8.3cqw] py-[5.5cqw]"
      style={spec.band ? { background: BAND_GREEN } : undefined}
    >
      {spec.header && (
        // The sentence spans 62% of the frame — 74% of what the margins leave —
        // whether it's centred under the heading or set against the left edge.
        <div className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
          <Eyebrow text={content?.eyebrow} />
          <HeadlineLine className="w-[74%]" text={content?.heading} />
          <BodyLine className="w-[74%]" text={content?.body} />
          <div className="mt-[0.5cqw]">
            <FilledButton label={content?.cta} />
          </div>
        </div>
      )}

      <ul className="grid grid-cols-4 gap-[2.8cqw]">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <Stat
            key={i}
            spec={spec}
            value={figures.length ? itemAt(content?.items, i) : undefined}
            description={content?.itemBody}
          />
        ))}
      </ul>
    </section>
  )
}

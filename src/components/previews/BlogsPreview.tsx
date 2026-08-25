import { itemAt, linesOf, splitOnDot } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v6'. */
export type BlogsDesign = string

export type BlogsChoice = {
  design: BlogsDesign
}

const GREEN = 'var(--brand,#4b7b35)'
/** The pale green the category pill is filled with, and the green it's set in. */
const CHIP = 'var(--brand-soft,#e1efd8)'
const CHIP_TEXT = 'var(--brand,#4b7b35)'
const TAN = 'var(--brand-accent,#917061)'
const HAIRLINE = '#d0c3b8'
/** The heavier rule under a post on the design that puts its meta at the foot. */
const FOOT_RULE = '#b59f8f'
const TITLE = '#1e1515'
const BODY = '#563f3d'

/** The person mark beside a byline, traced from the artwork at its drawn 20×22. */
const PERSON =
  'M9.8 11.2C11.285 11.2 12.71 10.61 13.76 9.56C14.81 8.51 15.4 7.085 15.4 5.6C15.4 4.115 14.81 2.69 13.76 1.64C12.71 0.59 11.285 0 9.8 0C8.315 0 6.891 0.59 5.84 1.64C4.79 2.69 4.2 4.115 4.2 5.6C4.2 7.085 4.79 8.51 5.84 9.56C6.891 10.61 8.315 11.2 9.8 11.2ZM7.801 13.3C3.491 13.3 0 16.791 0 21.101C0 21.818 0.582 22.4 1.3 22.4H18.301C19.018 22.4 19.6 21.818 19.6 21.101C19.6 16.791 16.109 13.3 11.8 13.3H7.801Z'

/**
 * What each design is made of.
 *
 * Three posts across in all six — 373 wide on a 40px gutter, inside the same
 * 120px margins as the rest of the sets, each opening with the same 195-tall
 * picture. What a design decides is whether the post sits in an outlined card,
 * where the header goes, what closes the post, and whether the category and
 * date sit above the title or below a rule at the foot.
 *
 * V6 is the odd one: no header at all, three rows of three, and a "load more"
 * button under the grid.
 */
type Spec = {
  /** Where the header sits. V6 carries none. */
  header?: 'centered' | 'left'
  /** An outlined card around each post, rather than a bare column. */
  card?: boolean
  /** What follows the title — a summary, or the author's name. */
  foot: 'excerpt' | 'byline'
  /** The byline's mark: the drawn person glyph, or a round avatar. */
  mark?: 'glyph' | 'avatar'
  /** The category and date moved below a rule, with the date set right. */
  metaBelow?: boolean
  /** Rows of three. */
  rows: number
  /** A "load more" button under the grid. */
  more?: boolean
}

const SPECS: Record<string, Spec> = {
  v1: { header: 'centered', card: true, foot: 'excerpt', rows: 1 },
  v2: { header: 'centered', foot: 'excerpt', rows: 1 },
  v3: { header: 'centered', foot: 'excerpt', metaBelow: true, rows: 1 },
  v4: { header: 'centered', foot: 'byline', mark: 'glyph', rows: 1 },
  v5: { header: 'left', card: true, foot: 'byline', mark: 'avatar', rows: 1 },
  v6: { card: true, foot: 'byline', mark: 'avatar', rows: 3, more: true },
}

/** Three across in all six designs — the set draws no other count. */
const COLUMNS = 3

/** The pale green "Category" pill, 72×27 as drawn. */
function CategoryChip({ label }: { label?: string }) {
  if (label) {
    return (
      <span
        className="inline-flex h-[1.9cqw] shrink-0 items-center rounded-[0.28cqw] px-[0.55cqw] text-[1.15cqw] leading-none"
        style={{ background: CHIP, color: CHIP_TEXT }}
      >
        {label}
      </span>
    )
  }
  return (
    <span aria-hidden="true" className="block h-[1.9cqw] w-[5cqw] shrink-0 rounded-[0.28cqw]" style={{ background: CHIP }} />
  )
}

/** "Jan 24, 2024" */
function DateLine({ text }: { text?: string }) {
  if (text) {
    return (
      <time className="text-[1.05cqw] leading-none" style={{ color: TAN }}>
        {text}
      </time>
    )
  }
  return <span aria-hidden="true" className="block h-[0.9cqw] w-[5.7cqw] rounded-full" style={{ background: TAN }} />
}

/**
 * The author's name, behind the drawn person glyph or a round avatar. The
 * avatar stays a plain circle: the schema carries no author photo, and the
 * design draws one too.
 */
function Byline({ mark, name }: { mark?: 'glyph' | 'avatar'; name?: string }) {
  return (
    <p className="flex items-center gap-[0.95cqw]">
      {mark === 'glyph' ? (
        <svg viewBox="0 0 19.6 22.4" className="h-[1.55cqw] w-[1.36cqw] shrink-0" fill={BODY} aria-hidden="true">
          <path d={PERSON} />
        </svg>
      ) : (
        <span aria-hidden="true" className="size-[1.95cqw] shrink-0 rounded-full" style={{ background: HAIRLINE }} />
      )}
      {name ? (
        <span className="text-[1cqw] leading-none" style={{ color: TAN }}>
          {name}
        </span>
      ) : (
        <span aria-hidden="true" className="h-[0.9cqw] w-[5.6cqw] rounded-full" style={{ background: TAN }} />
      )}
    </p>
  )
}

function Post({
  spec,
  title,
  category,
  date,
  excerpt,
  author,
  src,
}: {
  spec: Spec
  title?: string
  category?: string
  date?: string
  excerpt?: string
  author?: string
  src?: string
}) {
  const meta = (
    <div className={`flex items-center gap-[0.75cqw] ${spec.metaBelow ? 'justify-between' : ''}`}>
      <CategoryChip label={category} />
      <DateLine text={date} />
    </div>
  )

  const heading = title ? (
    <h3 className="text-[1.67cqw] leading-tight font-semibold" style={{ color: TITLE }}>
      <a href="#" data-role="link">
        {title}
      </a>
    </h3>
  ) : (
    <span aria-hidden="true" className="block h-[1.5cqw] w-[62%] rounded-full" style={{ background: TITLE }} />
  )

  const summary = excerpt ? (
    <p className="text-[1.15cqw] leading-[1.45]" style={{ color: BODY }}>
      {excerpt}
    </p>
  ) : (
    <span aria-hidden="true" className="flex flex-col gap-[0.7cqw]">
      <BodyLine className="w-full" />
      <BodyLine className="w-[80%]" />
    </span>
  )

  return (
    <li>
      <article
        // 16px of padding and an 8px radius, as the outlined designs are drawn.
        className={`flex h-full flex-col ${spec.card ? 'rounded-[0.55cqw] border p-[1.1cqw]' : ''}`}
        style={spec.card ? { borderColor: HAIRLINE } : undefined}
      >
        {/* 195 tall in all six, whatever the column does around it. */}
        <ImageBlock className="h-[13.5cqw] w-full" src={src} />

        {spec.metaBelow ? (
          <>
            <div className="mt-[1.25cqw]">{heading}</div>
            <div className="mt-[0.55cqw]">{summary}</div>
            {/* The 2px rule this design closes on, heavier than a card's hairline. */}
            <span aria-hidden="true" className="mt-[0.85cqw] h-[0.14cqw] w-full" style={{ background: FOOT_RULE }} />
            <div className="mt-[1.4cqw]">{meta}</div>
          </>
        ) : (
          <>
            <div className="mt-[1.6cqw]">{meta}</div>
            <div className="mt-[1.25cqw]">{heading}</div>
            {spec.foot === 'excerpt' ? (
              <div className="mt-[0.55cqw]">{summary}</div>
            ) : (
              <div className="mt-[1.2cqw]">
                <Byline mark={spec.mark} name={author} />
              </div>
            )}
          </>
        )}
      </article>
    </li>
  )
}

/** The "Load more" button under the paged grid, at the 101×36 it's drawn. */
function MoreButton({ label }: { label?: string }) {
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
  return <span aria-hidden="true" data-role="button" className="block h-[2.5cqw] w-[7cqw] rounded-xs" style={{ background: GREEN }} />
}

/** Miniature of what the blog grid will look like on the page. */
export default function BlogsPreview({ design, content }: BlogsChoice & { content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const count = spec.rows * COLUMNS
  const titles = linesOf(content?.items)
  // "Insights · 12 March" — one field carrying both halves of the meta line.
  const [category, date] = content?.meta ? splitOnDot(content.meta) : ['', '']
  const centered = spec.header === 'centered'

  return (
    // 80px of margin top and bottom, 120 either side, as all six are drawn —
    // which leaves the 1200 the three 373-wide posts and their 40px gutters need.
    // The gaps are set on the children rather than the column, because the drawn
    // 65 under the header isn't the drawn 40 above the "load more" button.
    <section aria-label="From the blog" className="flex h-full flex-col px-[8.3cqw] py-[5.5cqw]">
      {spec.header && (
        // The sentence spans 62% of the frame — 74% of what the margins leave.
        <div className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
          <Eyebrow text={content?.eyebrow} />
          <HeadlineLine className="w-[74%]" text={content?.heading} />
          <BodyLine className="w-[74%]" text={content?.body} />
          <div className="mt-[0.5cqw]">
            <FilledButton label={content?.cta} />
          </div>
        </div>
      )}

      <ul className={`grid grid-cols-3 gap-[2.8cqw] ${spec.header ? 'mt-[4.5cqw]' : ''}`}>
        {Array.from({ length: count }, (_, i) => (
          <Post
            key={i}
            spec={spec}
            title={titles.length ? itemAt(content?.items, i) : undefined}
            category={category || undefined}
            date={date || undefined}
            excerpt={content?.itemBody}
            author={itemAt(content?.authors, i) || undefined}
            src={content?.image}
          />
        ))}
      </ul>

      {spec.more && (
        <div className="mt-[2.8cqw] flex justify-center">
          <MoreButton label={content?.more} />
        </div>
      )}
    </section>
  )
}

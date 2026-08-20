import { itemAt, linesOf, splitOnDot } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock } from '@/components/previews/parts'

export type BlogsChoice = {
  layout: string
  card: string
  header: string
  rows: string
  more: string
}

const CHIP = 'var(--brand-soft,#dcecd2)'
const MUTED = '#a89890'

/** The pale green "Category" pill. */
function CategoryChip({ label }: { label?: string }) {
  if (label) {
    return (
      <span
        className="inline-flex h-[2.4cqw] items-center rounded-xs px-[1.2cqw] text-[1.2cqw] leading-none font-medium text-neutral-700"
        style={{ background: CHIP }}
      >
        {label}
      </span>
    )
  }
  return <span aria-hidden="true" className="block h-[2.4cqw] w-[9cqw] rounded-xs" style={{ background: CHIP }} />
}

/** "Jan 24, 2024" */
function DateLine({ text }: { text?: string }) {
  if (text) {
    return (
      <time className="text-[1.2cqw] leading-none" style={{ color: MUTED }}>
        {text}
      </time>
    )
  }
  return <span aria-hidden="true" className="block h-[1.1cqw] w-[8cqw] rounded-full" style={{ background: MUTED }} />
}

/** Round avatar beside the author's name. */
function AuthorRow({ name, src }: { name?: string; src?: string }) {
  return (
    <p className="flex items-center gap-[1.4cqw]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary URL or data URI
        <img src={src} alt="" loading="lazy" className="size-[2.8cqw] rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="size-[2.8cqw] rounded-full" style={{ background: '#c9b8ae' }} />
      )}
      {name ? (
        <span className="text-[1.3cqw] leading-none" style={{ color: MUTED }}>
          {name}
        </span>
      ) : (
        <span aria-hidden="true" className="h-[1.1cqw] w-[12cqw] rounded-full" style={{ background: MUTED }} />
      )}
    </p>
  )
}

function Title({ text }: { text?: string }) {
  if (text) {
    return (
      <h3 className="text-[1.8cqw] leading-tight font-semibold text-neutral-900">
        <a href="#" data-role="link">
          {text}
        </a>
      </h3>
    )
  }
  return <span aria-hidden="true" className="block h-[1.8cqw] w-[62%] rounded-full bg-neutral-800" />
}

function Excerpt({ text }: { text?: string }) {
  if (text) {
    return <p className="text-[1.4cqw] leading-[1.45] text-neutral-600">{text}</p>
  }
  return (
    <span aria-hidden="true" className="flex flex-col gap-[0.8cqw]">
      <BodyLine className="w-full" />
      <BodyLine className="w-[80%]" />
    </span>
  )
}

function PostCard({
  layout,
  card,
  title,
  category,
  date,
  excerpt,
  author,
  src,
}: {
  layout: string
  card: string
  title?: string
  category?: string
  date?: string
  excerpt?: string
  author?: string
  src?: string
}) {
  const bordered = card === 'bordered'

  return (
    <li>
      <article
        className={`flex flex-col gap-[1.5cqw] ${
          bordered ? 'rounded-[3px] border border-neutral-200 p-[1.8cqw] shadow-sm' : ''
        }`}
      >
        <ImageBlock className="h-[9cqw] w-full" src={src} />

        {layout === 'meta-bottom' ? (
          <>
            <Title text={title} />
            <Excerpt text={excerpt} />
            <span aria-hidden="true" className="mt-[0.5cqw] h-px w-full bg-neutral-200" />
            <div className="flex items-center justify-between">
              <CategoryChip label={category} />
              <DateLine text={date} />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-[1.5cqw]">
              <CategoryChip label={category} />
              <DateLine text={date} />
            </div>
            <Title text={title} />
            {layout === 'author' ? <AuthorRow name={author} /> : <Excerpt text={excerpt} />}
          </>
        )}
      </article>
    </li>
  )
}

/** Eyebrow, heading, a line of copy and the green button. */
function Header({ mode, content }: { mode: string; content?: SectionContent }) {
  const centered = mode === 'centered'
  return (
    <div className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
      <Eyebrow text={content?.eyebrow} />
      <HeadlineLine
        className={content?.heading ? 'w-[60%]' : centered ? 'w-[26%]' : 'w-[22%]'}
        text={content?.heading}
      />
      <BodyLine className={centered ? 'w-[64%]' : 'w-[60%]'} text={content?.body} />
      <div className="mt-[0.5cqw]">
        <FilledButton label={content?.cta} />
      </div>
    </div>
  )
}

/** Miniature of what the blog grid will look like on the page. */
export default function BlogsPreview({
  layout,
  card,
  header,
  rows,
  more,
  content,
}: BlogsChoice & { content?: SectionContent }) {
  const count = Number(rows) * 3
  const titles = linesOf(content?.items)
  // "Insights · 12 March" — one field carrying both halves of the meta line.
  const [category, date] = content?.meta ? splitOnDot(content.meta) : ['', '']

  return (
    <section aria-label="From the blog" className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      {header !== 'none' && <Header mode={header} content={content} />}

      <ul className="grid grid-cols-3 gap-x-[3cqw] gap-y-[3cqw]">
        {Array.from({ length: count }, (_, i) => (
          <PostCard
            key={i}
            layout={layout}
            card={card}
            title={titles.length ? itemAt(content?.items, i) : undefined}
            category={category || undefined}
            date={date || undefined}
            excerpt={content?.itemBody}
            author={itemAt(content?.authors, i) || undefined}
            src={content?.image}
          />
        ))}
      </ul>

      {more === 'show' && (
        <div className="flex justify-center">
          <FilledButton label={content?.more} />
        </div>
      )}
    </section>
  )
}

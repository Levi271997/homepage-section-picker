import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock } from '@/components/previews/parts'

export type BlogsChoice = {
  layout: string
  card: string
  header: string
  rows: string
  more: string
}

const GREEN = 'var(--brand,#3f6b30)'
const CHIP = '#dcecd2'
const MUTED = '#a89890'

/** The pale green "Category" pill. */
function CategoryChip() {
  return <span className="h-[2.4cqw] w-[9cqw] rounded-[2px]" style={{ background: CHIP }} />
}

/** "Jan 24, 2024" */
function DateLine() {
  return <span className="h-[1.1cqw] w-[8cqw] rounded-full" style={{ background: MUTED }} />
}

/** Round avatar beside the author's name. */
function AuthorRow() {
  return (
    <span className="flex items-center gap-[1.4cqw]">
      <span className="size-[2.8cqw] rounded-full" style={{ background: '#c9b8ae' }} />
      <span className="h-[1.1cqw] w-[12cqw] rounded-full" style={{ background: MUTED }} />
    </span>
  )
}

function Title() {
  return <span className="h-[1.8cqw] w-[62%] rounded-full bg-neutral-800" />
}

function Excerpt() {
  return (
    <span className="flex flex-col gap-[0.8cqw]">
      <BodyLine className="w-full" />
      <BodyLine className="w-[80%]" />
    </span>
  )
}

function PostCard({ layout, card }: { layout: string; card: string }) {
  const bordered = card === 'bordered'

  return (
    <span
      className={`flex flex-col gap-[1.5cqw] ${
        bordered ? 'rounded-[3px] border border-neutral-200 p-[1.8cqw] shadow-sm' : ''
      }`}
    >
      <ImageBlock className="h-[9cqw] w-full" />

      {layout === 'meta-bottom' ? (
        <>
          <Title />
          <Excerpt />
          <span className="mt-[0.5cqw] h-px w-full bg-neutral-200" />
          <span className="flex items-center justify-between">
            <CategoryChip />
            <DateLine />
          </span>
        </>
      ) : (
        <>
          <span className="flex items-center gap-[1.5cqw]">
            <CategoryChip />
            <DateLine />
          </span>
          <Title />
          {layout === 'author' ? <AuthorRow /> : <Excerpt />}
        </>
      )}
    </span>
  )
}

/** Eyebrow, heading, a line of copy and the green button. */
function Header({ mode }: { mode: string }) {
  const centered = mode === 'centered'
  return (
    <span className={`flex flex-col gap-[1.4cqw] ${centered ? 'items-center' : 'items-start'}`}>
      <Eyebrow />
      <HeadlineLine className={centered ? 'w-[26%]' : 'w-[22%]'} />
      <BodyLine className={centered ? 'w-[64%]' : 'w-[60%]'} />
      <span className="mt-[0.5cqw]">
        <FilledButton />
      </span>
    </span>
  )
}

/** Miniature of what the blog grid will look like on the page. */
export default function BlogsPreview({ layout, card, header, rows, more }: BlogsChoice) {
  const count = Number(rows) * 3

  return (
    <div className="flex h-full flex-col gap-[3.5cqw] px-[5cqw] py-[4cqw]">
      {header !== 'none' && <Header mode={header} />}

      <div className="grid grid-cols-3 gap-x-[3cqw] gap-y-[3cqw]">
        {Array.from({ length: count }, (_, i) => (
          <PostCard key={i} layout={layout} card={card} />
        ))}
      </div>

      {more === 'show' && (
        <span className="flex justify-center">
          <span className="h-[4cqw] w-[14cqw] rounded-[2px]" style={{ background: GREEN }} />
        </span>
      )}
    </div>
  )
}

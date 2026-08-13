import type { ReactNode } from 'react'

/**
 * Shared building blocks for the miniature page previews.
 *
 * Everything is sized in `cqw` (percent of the frame's width) rather than pixels,
 * so the same preview reads correctly at 56px in a row and at 220px in a picker card.
 */

/**
 * Fixed-ratio canvas the miniatures are drawn on. Establishes the container the
 * cqw units resolve against. `aspect` replaces the default ratio rather than
 * being appended to it — two aspect utilities on one element would let CSS
 * order, not class order, decide the winner.
 */
export function PreviewFrame({
  children,
  className = '',
  aspect = 'aspect-16/10',
}: {
  children: ReactNode
  className?: string
  aspect?: string
}) {
  return <div className={`@container ${aspect} w-full overflow-hidden bg-white ${className}`}>{children}</div>
}

/** Checkerboard standing in for a photo, as the placeholders appear in the design file. */
export function ImageBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xs border border-neutral-200 ${className}`}
      style={{
        backgroundImage: 'repeating-conic-gradient(#e9e9e9 0% 25%, #fafafa 0% 50%)',
        backgroundSize: '4cqw 4cqw',
      }}
    />
  )
}

/** A row of flat grey rectangles standing in for client logos. */
export function LogoRow({ count = 6 }: { count?: number }) {
  return (
    <span className="grid w-full grid-cols-6 gap-[1.5cqw]">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="h-[3.4cqw] rounded-[1px] bg-neutral-300" />
      ))}
    </span>
  )
}

/** Carousel paging dots — first one active. */
export function Dots({ count = 5 }: { count?: number }) {
  return (
    <span className="flex items-center gap-[1.2cqw]">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="size-[1.3cqw] rounded-full"
          style={{ background: i === 0 ? '#3f6b30' : '#8cbb7c' }}
        />
      ))}
    </span>
  )
}

export function FilledButton() {
  return <span className="h-[3.4cqw] w-[11cqw] rounded-xs bg-[#3f6b30]" />
}

export function OutlineButton() {
  return <span className="h-[3.4cqw] w-[11cqw] rounded-xs border border-[#3f6b30] bg-white" />
}

/** Small tan kicker above a heading ("Some text here"). */
export function Eyebrow() {
  return <span className="h-[1cqw] w-[13cqw] rounded-full" style={{ background: '#a1806a' }} />
}

export function HeadlineLine({ className = '' }: { className?: string }) {
  return <span className={`h-[1.9cqw] rounded-full bg-neutral-800 ${className}`} />
}

export function BodyLine({ className = '' }: { className?: string }) {
  return <span className={`h-[1cqw] rounded-full bg-neutral-300 ${className}`} />
}

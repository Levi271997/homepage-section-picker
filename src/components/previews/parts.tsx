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
  clip = true,
}: {
  children: ReactNode
  className?: string
  aspect?: string
  /** Set false where something is meant to escape the frame — a header's dropdown. */
  clip?: boolean
}) {
  return (
    <div
      className={`@container ${aspect} w-full ${clip ? 'overflow-hidden' : 'overflow-visible'} bg-white ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Checkerboard standing in for a photo, as the placeholders appear in the
 * design file — or the client's own image once we've read their site.
 */
export function ImageBlock({ className = '', src }: { className?: string; src?: string | null }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a third-party URL from the client's own site; next/image would need every client domain whitelisted
      <img
        src={src}
        alt=""
        loading="lazy"
        // Hotlink protection and dead URLs are common; fall back to the checkerboard.
        onError={(e) => {
          const el = e.currentTarget
          el.style.display = 'none'
          el.insertAdjacentHTML(
            'afterend',
            `<div class="${el.className}" style="background-image:repeating-conic-gradient(#e9e9e9 0% 25%,#fafafa 0% 50%);background-size:4cqw 4cqw"></div>`,
          )
        }}
        className={`rounded-xs border border-neutral-200 object-cover ${className}`}
      />
    )
  }

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

/**
 * A row of client logos — flat grey rectangles, or the client names set as
 * wordmarks once they've been typed in. `offset` walks further down the list so
 * a three-row grid doesn't repeat the same six names.
 */
export function LogoRow({ count = 6, names, offset = 0 }: { count?: number; names?: string[]; offset?: number }) {
  return (
    <span className="grid w-full grid-cols-6 items-center gap-[1.5cqw]">
      {Array.from({ length: count }, (_, i) =>
        names?.length ? (
          <span
            key={i}
            className="truncate text-center text-[1.5cqw] leading-none font-semibold tracking-[0.06em] text-neutral-400 uppercase"
          >
            {names[(offset + i) % names.length]}
          </span>
        ) : (
          <span key={i} className="h-[3.4cqw] rounded-[1px] bg-neutral-300" />
        ),
      )}
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
          style={{ background: i === 0 ? 'var(--brand,#3f6b30)' : 'var(--brand-dim,#8cbb7c)' }}
        />
      ))}
    </span>
  )
}

/**
 * The bars below take an optional label or colour so the same preview can
 * render either the wireframe or the client's own words and brand colour.
 */
const GREEN = 'var(--brand,#3f6b30)'

export function FilledButton({ label, color = GREEN }: { label?: string | null; color?: string }) {
  if (label) {
    return (
      <span
        data-role="button"
        className="inline-flex h-[4cqw] items-center rounded-xs px-[2.5cqw] text-[1.9cqw] leading-none font-medium text-white"
        style={{ background: color }}
      >
        {label}
      </span>
    )
  }
  return <span data-role="button" className="h-[3.4cqw] w-[11cqw] rounded-xs" style={{ background: color }} />
}

export function OutlineButton({ label, color = GREEN }: { label?: string | null; color?: string }) {
  if (label) {
    return (
      <span
        data-role="button"
        className="inline-flex h-[4cqw] items-center rounded-xs border bg-white px-[2.5cqw] text-[1.9cqw] leading-none font-medium"
        style={{ borderColor: color, color }}
      >
        {label}
      </span>
    )
  }
  return <span data-role="button" className="h-[3.4cqw] w-[11cqw] rounded-xs border bg-white" style={{ borderColor: color }} />
}

/** Small tan kicker above a heading ("Some text here"). */
export function Eyebrow({ text, color = 'var(--brand-accent,#a1806a)' }: { text?: string | null; color?: string }) {
  if (text) {
    return (
      <span className="text-[1.6cqw] leading-none font-medium tracking-[0.12em] uppercase" style={{ color }}>
        {text}
      </span>
    )
  }
  return <span className="h-[1cqw] w-[13cqw] rounded-full" style={{ background: color }} />
}

export function HeadlineLine({ className = '', text }: { className?: string; text?: string | null }) {
  if (text) {
    return (
      <span className={`block text-[3.4cqw] leading-[1.15] font-semibold text-neutral-900 ${className}`}>{text}</span>
    )
  }
  return <span className={`h-[1.9cqw] rounded-full bg-neutral-800 ${className}`} />
}

export function BodyLine({ className = '', text }: { className?: string; text?: string | null }) {
  if (text) {
    return <span className={`block text-[1.8cqw] leading-[1.45] text-neutral-600 ${className}`}>{text}</span>
  }
  return <span className={`h-[1cqw] rounded-full bg-neutral-300 ${className}`} />
}

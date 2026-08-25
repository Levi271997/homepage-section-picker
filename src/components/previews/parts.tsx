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
  decorative = false,
}: {
  children: ReactNode
  className?: string
  aspect?: string
  /** Set false where something is meant to escape the frame — a header's dropdown. */
  clip?: boolean
  /**
   * This frame is a picture of a page, not the page.
   *
   * The previews are properly marked up — headings, buttons, nav, forms — which
   * is right on the assembled page and wrong in a 64px row thumbnail, where it
   * would put a dozen `h1`s and a tab-stop for every button into the editing
   * screen. `inert` and `aria-hidden` take the whole subtree back out of the
   * accessibility tree and the tab order, leaving the markup meaningful in the
   * one place it's read as a document.
   */
  decorative?: boolean
}) {
  return (
    <div
      aria-hidden={decorative || undefined}
      inert={decorative || undefined}
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
 *
 * Six across at 166.667×78 on a 40px gutter, straight off the drawn strips.
 */
export function LogoRow({ count = 6, names, offset = 0 }: { count?: number; names?: string[]; offset?: number }) {
  return (
    <ul className="grid w-full grid-cols-6 items-center gap-[2.8cqw]">
      {Array.from({ length: count }, (_, i) =>
        names?.length ? (
          <li
            key={i}
            className="truncate text-center text-[1.5cqw] leading-none font-semibold tracking-[0.06em] text-neutral-400 uppercase"
          >
            {names[(offset + i) % names.length]}
          </li>
        ) : (
          <li key={i} className="h-[5.4cqw] bg-neutral-300" />
        ),
      )}
    </ul>
  )
}

/**
 * Carousel paging dots — first one active.
 *
 * Hidden from assistive tech: they report a position in a carousel that doesn't
 * really page, so announcing them would describe a control that isn't there.
 */
export function Dots({ count = 5 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-[1.2cqw]">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="size-[1.3cqw] rounded-full"
          style={{ background: i === 0 ? 'var(--brand,#3f6b30)' : 'var(--brand-dim,#8cbb7c)' }}
        />
      ))}
    </div>
  )
}

/**
 * The bars below take an optional label or colour so the same preview can
 * render either the wireframe or the client's own words and brand colour.
 */
const GREEN = 'var(--brand,#3f6b30)'

/**
 * A real `<button>`, so the thing that looks pressable is pressable — reachable
 * by keyboard and announced as a control. `type="button"` because these sit
 * inside the mocked-up forms and must not submit them.
 *
 * An unlabelled button is a bar with no accessible name, so it's hidden from
 * assistive tech: at that point it's a wireframe of a button, not one.
 */
export function FilledButton({ label, color = GREEN }: { label?: string | null; color?: string }) {
  if (label) {
    return (
      <button
        type="button"
        data-role="button"
        className="inline-flex h-[4cqw] items-center rounded-xs px-[2.5cqw] text-[1.9cqw] leading-none font-medium text-white"
        style={{ background: color }}
      >
        {label}
      </button>
    )
  }
  return <span aria-hidden="true" data-role="button" className="block h-[3.4cqw] w-[11cqw] rounded-xs" style={{ background: color }} />
}

export function OutlineButton({ label, color = GREEN }: { label?: string | null; color?: string }) {
  if (label) {
    return (
      <button
        type="button"
        data-role="button"
        className="inline-flex h-[4cqw] items-center rounded-xs border bg-white px-[2.5cqw] text-[1.9cqw] leading-none font-medium"
        style={{ borderColor: color, color }}
      >
        {label}
      </button>
    )
  }
  return (
    <span
      aria-hidden="true"
      data-role="button"
      className="block h-[3.4cqw] w-[11cqw] rounded-xs border bg-white"
      style={{ borderColor: color }}
    />
  )
}

/** Small tan kicker above a heading ("Some text here"). */
export function Eyebrow({ text, color = 'var(--brand-accent,#a1806a)' }: { text?: string | null; color?: string }) {
  if (text) {
    return (
      <p className="text-[1.6cqw] leading-none font-medium tracking-[0.12em] uppercase" style={{ color }}>
        {text}
      </p>
    )
  }
  return <span aria-hidden="true" className="block h-[1cqw] w-[13cqw] rounded-full" style={{ background: color }} />
}

/** Heading levels a preview can ask for. */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

/**
 * A section's heading.
 *
 * `as` sets the level, so the assembled page comes out with one `h1` (the hero)
 * and a sensible outline under it rather than fourteen equal shouts. Preflight
 * strips the browser's own heading sizing, so the level is purely structural —
 * changing it never changes how the preview looks.
 */
export function HeadlineLine({
  className = '',
  text,
  as: Tag = 'h2',
  color,
}: {
  className?: string
  text?: string | null
  as?: HeadingLevel
  /** Overrides the near-black, for a section that sets its copy on a dark ground. */
  color?: string
}) {
  if (text) {
    return (
      <Tag
        className={`block text-[3.4cqw] leading-[1.15] font-semibold ${color ? '' : 'text-neutral-900'} ${className}`}
        style={color ? { color } : undefined}
      >
        {text}
      </Tag>
    )
  }
  // No words yet: a bar standing in for a heading, with nothing to announce.
  return (
    <span
      aria-hidden="true"
      className={`block h-[1.9cqw] rounded-full ${color ? '' : 'bg-neutral-800'} ${className}`}
      style={color ? { background: color } : undefined}
    />
  )
}

export function BodyLine({
  className = '',
  text,
  color,
}: {
  className?: string
  text?: string | null
  /** Overrides the grey, for a section that sets its copy on a dark ground. */
  color?: string
}) {
  if (text) {
    return (
      <p
        className={`block text-[1.8cqw] leading-[1.45] ${color ? '' : 'text-neutral-600'} ${className}`}
        style={color ? { color } : undefined}
      >
        {text}
      </p>
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`block h-[1cqw] rounded-full ${color ? '' : 'bg-neutral-300'} ${className}`}
      style={color ? { background: color } : undefined}
    />
  )
}

/**
 * The four social marks, drawn as simple glyphs rather than brand logos —
 * recognisable at this size without shipping icon assets.
 *
 * Shared because the header and the footer both draw them, in different inks:
 * the header sets them in its own near-black, the footer in the brand green.
 * The order is the one `content.ts` asks for the links in.
 */
export const SOCIAL_GLYPHS: { name: string; path: (ink: string) => ReactNode }[] = [
  {
    name: 'Facebook',
    path: (ink) => (
      <>
        <circle cx="8" cy="8" r="8" fill={ink} />
        <path
          d="M9.4 8.3h1.2l.2-1.7H9.4V5.6c0-.5.1-.8.8-.8h.7V3.3h-1.3c-1.5 0-2.1.8-2.1 2.1v1.2H6.3v1.7h1.2v4.4h1.9z"
          fill="#fff"
        />
      </>
    ),
  },
  {
    name: 'Instagram',
    path: (ink) => (
      <>
        <rect x="0.8" y="0.8" width="14.4" height="14.4" rx="4.2" fill={ink} />
        <circle cx="8" cy="8" r="3.4" fill="none" stroke="#fff" strokeWidth="1.3" />
        <circle cx="12.1" cy="4" r="1" fill="#fff" />
      </>
    ),
  },
  {
    name: 'X',
    path: (ink) => (
      <path d="M1.5 1.5l5.6 7.2-5.4 5.8h1.8l4.5-4.8 3.7 4.8h4.3L10 7.6l5-5.4h-1.8L9.2 6.6 5.8 1.5z" fill={ink} />
    ),
  },
  {
    name: 'LinkedIn',
    path: (ink) => (
      <>
        <rect x="0.5" y="0.5" width="15" height="15" rx="2.4" fill={ink} />
        <circle cx="4.2" cy="4.2" r="1.2" fill="#fff" />
        <rect x="3.2" y="6.2" width="2" height="6.6" fill="#fff" />
        <path
          d="M6.6 6.2h1.9v.9c.3-.6 1-1.1 2-1.1 1.6 0 2.4 1 2.4 2.9v3.9h-2V9.3c0-.9-.3-1.4-1.1-1.4-.7 0-1.2.5-1.2 1.5v3.4h-2z"
          fill="#fff"
        />
      </>
    ),
  },
]

/**
 * How a form field looks, from `design-sets/input-fields`.
 *
 * That set draws one field in four states, all on a 4px radius with the label
 * over the value and 17px of padding:
 *
 * - default   no edge at all
 * - selected  a 1px #563F3D edge — what focus looks like
 * - error     a 1px #BF1140 edge over a #FFF1F2 fill
 * - success   a 1px #047850 edge over a #ECFDF4 fill
 *
 * The edge is an outline pulled inside rather than a border, so turning it on
 * doesn't move the text by a pixel — and an outline keeps its own colour, where
 * an arbitrary `shadow-` loses it to Tailwind's shadow-colour variable. The
 * fill has to be a class rather than an inline style, or the error and success
 * fills can't win against it.
 */
export const FIELD_SHELL =
  'rounded-[0.28cqw] focus-within:outline-1 focus-within:-outline-offset-1 focus-within:outline-[#563f3d]'

/**
 * The error and success halves of the same set, for a field that can actually
 * be judged — an `email` input, say. `:user-invalid` and `:user-valid` only
 * apply once someone has typed and moved on, so nothing turns red while it's
 * still being filled in.
 *
 * Left off fields with no constraint on purpose: a plain text box is neither
 * right nor wrong, and colouring it green for having any content at all would
 * be saying something the design doesn't.
 */
export const FIELD_JUDGED = [
  'has-[:user-invalid]:bg-[#fff1f2] has-[:user-invalid]:outline-1 has-[:user-invalid]:-outline-offset-1 has-[:user-invalid]:outline-[#bf1140]',
  'has-[:user-valid]:bg-[#ecfdf4] has-[:user-valid]:outline-1 has-[:user-valid]:-outline-offset-1 has-[:user-valid]:outline-[#047850]',
].join(' ')

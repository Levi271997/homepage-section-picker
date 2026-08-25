import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { ImageBlock, SOCIAL_GLYPHS } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v8'. */
export type FooterDesign = string

export type FooterChoice = {
  design: FooterDesign
}

const GREEN = 'var(--brand,#4b7b35)'
/** The pale green the sign-up field is filled with. */
const FIELD = 'var(--brand-soft,#f2f8ed)'
const TAN = 'var(--brand-accent,#917061)'
const BODY = '#563f3d'
const HAIRLINE = '#d0c3b8'
const LIGHT = '#f5f3f1'

/** The circled check beside the sign-up note, the same glyph the rest of the sets use. */
const CHECK =
  'M8 16C10.122 16 12.157 15.157 13.657 13.657C15.157 12.157 16 10.122 16 8C16 5.878 15.157 3.843 13.657 2.343C12.157 0.843 10.122 0 8 0C5.878 0 3.843 0.843 2.343 2.343C0.843 3.843 0 5.878 0 8C0 10.122 0.843 12.157 2.343 13.657C3.843 15.157 5.878 16 8 16ZM11.531 6.531L7.531 10.531C7.238 10.825 6.763 10.825 6.472 10.531L4.472 8.531C4.178 8.238 4.178 7.763 4.472 7.472C4.766 7.181 5.241 7.178 5.531 7.472L7 8.941L10.469 5.469C10.762 5.175 11.238 5.175 11.528 5.469C11.819 5.762 11.822 6.237 11.528 6.528L11.531 6.531Z'

/**
 * What each design is made of.
 *
 * Three frames. `columns` is the tall footer at 1440×338 — the logo, a tagline
 * and the social marks on the left, link columns beside them, a hairline, then
 * a bottom row of copyright and legal links. `strip` keeps the logo but drops
 * everything above the bottom row. `bar` drops the logo too, down to a single
 * line of type.
 *
 * What varies inside those: how many link columns, whether the last of them is
 * a newsletter sign-up and which form it takes, and what a strip or a bar
 * carries beside its copyright.
 */
type Spec = {
  /** The tall footer, a strip built round the logo, or a bare line of type. */
  frame: 'columns' | 'strip' | 'bar'
  /** How many link columns the tall footer runs to. */
  columns?: number
  /** A sign-up block in place of the last column: behind an arrow, or over a button. */
  signup?: 'inline' | 'stacked'
  /** What a strip or a bar carries besides its copyright. */
  ends?: 'social' | 'legal' | 'both' | 'none'
}

const SPECS: Record<string, Spec> = {
  v1: { frame: 'columns', columns: 4 },
  v2: { frame: 'strip', ends: 'social' },
  v3: { frame: 'strip', ends: 'legal' },
  v4: { frame: 'strip', ends: 'none' },
  v5: { frame: 'columns', columns: 2, signup: 'inline' },
  v6: { frame: 'columns', columns: 2, signup: 'stacked' },
  v7: { frame: 'bar', ends: 'legal' },
  v8: { frame: 'bar', ends: 'both' },
}

/** Five under every heading, as the set draws them. */
const LINKS_PER_COLUMN = 5

/** The logo, at the 172×54 the set gives it — or the taller lockup V4 stands alone on. */
function Logo({ className = 'h-[3.75cqw] w-[11.94cqw]', src }: { className?: string; src?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary URL or data URI
      <img src={src} alt="" loading="lazy" className={`${className} object-contain object-left`} />
    )
  }
  return <ImageBlock className={className} />
}

/** "Copyright © 2024 Digitalfeet | All Rights Reserved" */
function Copyright({ text }: { text?: string }) {
  if (text) {
    return (
      <p className="truncate text-[1.25cqw] leading-none" style={{ color: TAN }}>
        {text}
      </p>
    )
  }
  return <span aria-hidden="true" className="block h-[1cqw] w-[21cqw] rounded-full" style={{ background: TAN }} />
}

/** "Terms and Conditions   Privacy Policy" */
function LegalLinks({ items }: { items?: string[] }) {
  if (items?.length) {
    return (
      <nav aria-label="Legal">
        <ul className="flex items-center gap-[2.4cqw]">
          {items.slice(0, 3).map((label) => (
            <li key={label}>
              <a
                href="#"
                data-role="link"
                className="text-[1.25cqw] leading-none whitespace-nowrap"
                style={{ color: BODY }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
  return (
    <span aria-hidden="true" className="flex items-center gap-[2.4cqw]">
      <span className="h-[1cqw] w-[11cqw] rounded-full" style={{ background: BODY }} />
      <span className="h-[1cqw] w-[7cqw] rounded-full" style={{ background: BODY }} />
    </span>
  )
}

/**
 * The four marks, in the brand green the footer draws them in.
 *
 * Decorative rather than linked: the footer schema carries no social URLs —
 * those live on the header, which is where the client hands them over.
 */
function Socials() {
  return (
    <ul aria-hidden="true" className="flex items-center gap-[1.07cqw]">
      {SOCIAL_GLYPHS.map((glyph) => (
        <li key={glyph.name} className="flex">
          <svg viewBox="0 0 16 16" className="size-[1.39cqw]">
            {glyph.path(GREEN)}
          </svg>
        </li>
      ))}
    </ul>
  )
}

/** A "Label" heading over five item links. */
function LinkColumn({ heading, links }: { heading?: string; links?: string[] }) {
  return (
    <nav className="flex flex-col gap-[1.18cqw]" aria-label={heading || undefined}>
      {heading ? (
        <h3 className="text-[1.11cqw] leading-none font-semibold" style={{ color: TAN }}>
          {heading}
        </h3>
      ) : (
        <span aria-hidden="true" className="h-[1.1cqw] w-[50%] rounded-full" style={{ background: TAN }} />
      )}

      <ul className="flex flex-col gap-[0.73cqw]">
        {Array.from({ length: LINKS_PER_COLUMN }, (_, i) =>
          links?.length ? (
            <li key={i}>
              <a
                href="#"
                data-role="link"
                className="block truncate text-[0.97cqw] leading-none"
                style={{ color: BODY }}
              >
                {links[i % links.length]}
              </a>
            </li>
          ) : (
            <li key={i} aria-hidden="true" className="h-[0.8cqw] w-[62%] rounded-full" style={{ background: BODY }} />
          ),
        )}
      </ul>
    </nav>
  )
}

/** Logo, the tagline under it, and the social marks. */
function BrandColumn({ src, tagline }: { src?: string; tagline?: string }) {
  return (
    <div className="flex flex-col">
      <Logo src={src} />
      {tagline ? (
        <p className="mt-[2cqw] text-[0.97cqw] leading-[1.45]" style={{ color: TAN }}>
          {tagline}
        </p>
      ) : (
        <span aria-hidden="true" className="mt-[2cqw] flex flex-col gap-[0.6cqw]">
          <span className="h-[0.8cqw] w-full rounded-full" style={{ background: TAN }} />
          <span className="h-[0.8cqw] w-[70%] rounded-full" style={{ background: TAN }} />
        </span>
      )}
      <div className="mt-[2.5cqw]">
        <Socials />
      </div>
    </div>
  )
}

/** The sign-up block that takes the last column on the two designs that draw one. */
function Signup({ spec, content }: { spec: Spec; content?: SectionContent }) {
  const inline = spec.signup === 'inline'
  /**
   * A real field, not a picture of one: on the assembled page the footer
   * behaves like a footer, so an address can be typed into it.
   *
   * Safe to leave writable everywhere because `PreviewFrame` marks the row
   * thumbnails `decorative`, which puts `inert` on the whole subtree — the
   * field can't be reached or focused in the 64px miniatures.
   */
  const field = (
    <input
      type="email"
      autoComplete="email"
      aria-label="Email address"
      placeholder={content?.newsletterHint || undefined}
      // 48 tall as drawn, and the placeholder is set in the same tan as the copy.
      className="h-[3.33cqw] w-full rounded-[0.28cqw] px-[1.18cqw] text-[1.04cqw] leading-none outline-none placeholder:text-[color:var(--brand-accent,#917061)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand,#4b7b35)]"
      style={{ background: FIELD, color: BODY }}
    />
  )

  return (
    <form aria-label="Newsletter" onSubmit={(e) => e.preventDefault()} className="flex flex-col">
      {content?.newsletter ? (
        <p className="text-[0.97cqw] leading-[1.45]" style={{ color: TAN }}>
          {content.newsletter}
        </p>
      ) : (
        <span aria-hidden="true" className="flex flex-col gap-[0.6cqw]">
          <span className="h-[0.8cqw] w-full rounded-full" style={{ background: TAN }} />
          <span className="h-[0.8cqw] w-[75%] rounded-full" style={{ background: TAN }} />
        </span>
      )}

      {inline ? (
        <>
          {/* The field stops 8px short of the edge and a 48-square button closes it. */}
          <span className="mt-[1.25cqw] flex items-stretch gap-[0.55cqw]">
            {field}
            <button
              type="submit"
              data-role="button"
              aria-label={content?.cta || 'Subscribe'}
              className="flex size-[3.33cqw] shrink-0 items-center justify-center rounded-[0.28cqw]"
              style={{ background: GREEN }}
            >
              <svg viewBox="0 0 16 16" className="size-[0.97cqw]" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" stroke={LIGHT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </span>

          <p className="mt-[1.25cqw] flex items-center gap-[0.7cqw]">
            <svg viewBox="0 0 16 16" className="size-[1.11cqw] shrink-0" fill={GREEN} aria-hidden="true">
              <path d={CHECK} />
            </svg>
            {content?.newsletterNote ? (
              <span className="text-[0.9cqw] leading-none" style={{ color: BODY }}>
                {content.newsletterNote}
              </span>
            ) : (
              <span aria-hidden="true" className="h-[0.8cqw] w-[60%] rounded-full" style={{ background: BODY }} />
            )}
          </p>
        </>
      ) : (
        <>
          <span className="mt-[1.25cqw] block">{field}</span>
          <button
            type="submit"
            data-role="button"
            // 108×46, its own size rather than the header button's.
            className="mt-[0.83cqw] inline-flex h-[3.2cqw] w-fit items-center rounded-[0.28cqw] px-[1.45cqw] text-[1.11cqw] leading-none font-medium"
            style={{ background: GREEN, color: LIGHT }}
          >
            {content?.cta || 'Subscribe'}
          </button>
        </>
      )}
    </form>
  )
}

/** Miniature of what the site footer will look like on the page. */
export default function FooterPreview({ design, copy }: FooterChoice & { copy?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const src = copy?.image
  const legal = copy?.legal
  const legalLinks = linesOf(copy?.legalLinks)
  const columnLinks = linesOf(copy?.links)

  if (spec.frame === 'strip' || spec.frame === 'bar') {
    // A strip pads 24 above and below its logo; a bar is just the line of type.
    const strip = spec.frame === 'strip'

    if (spec.ends === 'none') {
      return (
        <footer className="flex h-full items-center justify-center px-[8.3cqw] py-[1.67cqw]">
          <Logo className="h-[6.2cqw] w-[11.94cqw] object-center" src={src} />
        </footer>
      )
    }

    return (
      <footer className="flex h-full items-center justify-between gap-[2.8cqw] px-[8.3cqw] py-[1.67cqw]">
        {strip && <Logo src={src} />}
        <Copyright text={legal} />
        {(spec.ends === 'legal' || spec.ends === 'both') && <LegalLinks items={legalLinks} />}
        {(spec.ends === 'social' || spec.ends === 'both') && <Socials />}
      </footer>
    )
  }

  const headings = linesOf(copy?.items)
  const columns = spec.columns ?? 4

  return (
    // 56 above, 120 either side, and a shallower 22 below the legal line.
    <footer className="flex h-full flex-col px-[8.3cqw] pt-[3.9cqw] pb-[1.5cqw]">
      {/* 350 of brand against link columns of 172 or 181, all on a 40px gutter —
          the 1200 the margins leave. The sign-up takes 367 where there is one. */}
      <div
        className={`grid gap-[2.8cqw] ${
          spec.signup ? 'grid-cols-[350fr_181fr_181fr_367fr]' : 'grid-cols-[350fr_repeat(4,172fr)]'
        }`}
      >
        <BrandColumn src={src} tagline={copy?.body} />
        {Array.from({ length: columns }, (_, i) => (
          <LinkColumn
            key={i}
            heading={headings.length ? itemAt(copy?.items, i) : undefined}
            links={columnLinks.length ? columnLinks : undefined}
          />
        ))}
        {spec.signup && <Signup spec={spec} content={copy} />}
      </div>

      <span aria-hidden="true" className="mt-[2.9cqw] h-px w-full" style={{ background: HAIRLINE }} />

      <div className="mt-[1.7cqw] flex items-center gap-[4cqw]">
        <Copyright text={legal} />
        <LegalLinks items={legalLinks} />
      </div>
    </footer>
  )
}

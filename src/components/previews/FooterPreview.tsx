import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import type { ReactNode } from 'react'
import { FilledButton, ImageBlock } from '@/components/previews/parts'

export type FooterChoice = {
  layout: string
  content: string
  columns: string
  subscribe: string
}

const GREEN = 'var(--brand,#3f6b30)'
const TAN = 'var(--brand-accent,#a1806a)'
const MUTED = '#b3a7a1'

function Logo({ className = 'h-[5cqw] w-[17cqw]', src }: { className?: string; src?: string }) {
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
      <p className="truncate text-[1.3cqw] leading-none" style={{ color: MUTED }}>
        {text}
      </p>
    )
  }
  return <span aria-hidden="true" className="block h-[1.2cqw] w-[26cqw] rounded-full" style={{ background: MUTED }} />
}

/** "Terms and Conditions   Privacy Policy" */
function LegalLinks({ items }: { items?: string[] }) {
  if (items?.length) {
    return (
      <nav aria-label="Legal">
        <ul className="flex items-center gap-[3cqw]">
          {items.slice(0, 3).map((label) => (
            <li key={label}>
              <a href="#" data-role="link" className="text-[1.3cqw] leading-none whitespace-nowrap text-neutral-700">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
  return (
    <span aria-hidden="true" className="flex items-center gap-[3cqw]">
      <span className="h-[1.2cqw] w-[13cqw] rounded-full bg-neutral-700" />
      <span className="h-[1.2cqw] w-[9cqw] rounded-full bg-neutral-700" />
    </span>
  )
}

/** The four social marks. Drawn as plain discs at this size. */
function Socials() {
  return (
    <span aria-hidden="true" className="flex items-center gap-[1.6cqw]">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="size-[2.2cqw] rounded-full" style={{ background: GREEN }} />
      ))}
    </span>
  )
}

/** A "Label" heading over five item links. */
function LinkColumn({ heading, links }: { heading?: string; links?: string[] }) {
  return (
    <nav className="flex flex-col gap-[1.4cqw]" aria-label={heading || undefined}>
      {heading ? (
        <h3 className="text-[1.5cqw] leading-none font-semibold" style={{ color: TAN }}>
          {heading}
        </h3>
      ) : (
        <span aria-hidden="true" className="h-[1.3cqw] w-[50%] rounded-full" style={{ background: TAN }} />
      )}

      <ul className="flex flex-col gap-[1.4cqw]">
        {Array.from({ length: 5 }, (_, i) =>
          links?.length ? (
            <li key={i}>
              <a href="#" data-role="link" className="block truncate text-[1.3cqw] leading-none text-neutral-600">
                {links[i % links.length]}
              </a>
            </li>
          ) : (
            <li key={i} aria-hidden="true" className="h-[1cqw] w-[62%] rounded-full bg-neutral-600" />
          ),
        )}
      </ul>
    </nav>
  )
}

/** Logo, a line of copy and the social icons. */
function BrandColumn({ src, tagline }: { src?: string; tagline?: string }) {
  return (
    <div className="flex flex-col gap-[2cqw]">
      <Logo src={src} />
      {tagline ? (
        <p className="text-[1.3cqw] leading-[1.45]" style={{ color: MUTED }}>
          {tagline}
        </p>
      ) : (
        <span aria-hidden="true" className="flex flex-col gap-[0.9cqw]">
          <span className="h-[1cqw] w-full rounded-full" style={{ background: MUTED }} />
          <span className="h-[1cqw] w-[70%] rounded-full" style={{ background: MUTED }} />
        </span>
      )}
      <Socials />
    </div>
  )
}

function Newsletter({ subscribe, copy }: { subscribe: string; copy?: SectionContent }) {
  const blurb = copy?.newsletter

  return (
    <form aria-label="Newsletter" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-[1.6cqw]">
      {blurb ? (
        <p className="text-[1.3cqw] leading-[1.45]" style={{ color: MUTED }}>
          {blurb}
        </p>
      ) : (
        <span aria-hidden="true" className="flex flex-col gap-[0.9cqw]">
          <span className="h-[1cqw] w-full rounded-full" style={{ background: MUTED }} />
          <span className="h-[1cqw] w-[75%] rounded-full" style={{ background: MUTED }} />
        </span>
      )}

      {subscribe === 'inline' ? (
        <>
          <span className="flex items-stretch">
            <input
              type="email"
              readOnly
              aria-label="Email address"
              className="h-[5cqw] flex-1 rounded-l-xs"
              style={{ background: 'var(--brand-soft,#eef4ea)' }}
            />
            <button
              type="submit"
              data-role="button"
              aria-label="Subscribe"
              className="h-[5cqw] w-[6cqw] rounded-r-xs"
              style={{ background: GREEN }}
            />
          </span>
          <span aria-hidden="true" className="flex items-center gap-[1.2cqw]">
            <span className="size-[1.8cqw] rounded-full" style={{ background: GREEN }} />
            <span className="h-[1cqw] w-[60%] rounded-full bg-neutral-600" />
          </span>
        </>
      ) : (
        <>
          <input
            type="email"
            readOnly
            aria-label="Email address"
            className="h-[5cqw] w-full rounded-xs"
            style={{ background: 'var(--brand-soft,#eef4ea)' }}
          />
          <FilledButton label={copy?.cta} />
        </>
      )}
    </form>
  )
}

/** Miniature of what the site footer will look like on the page. */
export default function FooterPreview({
  layout,
  content,
  columns,
  subscribe,
  copy,
}: FooterChoice & { copy?: SectionContent }) {
  const src = copy?.image
  const legal = copy?.legal
  const legalLinks = linesOf(copy?.legalLinks)
  const columnLinks = linesOf(copy?.links)

  if (layout === 'logo-only') {
    return (
      <footer className="flex h-full items-center justify-center px-[5cqw] py-[6cqw]">
        <Logo className="h-[9cqw] w-[24cqw]" src={src} />
      </footer>
    )
  }

  if (layout === 'bar') {
    // What sits at each end (and in the middle, when there are three things).
    const slots: Record<string, ReactNode[]> = {
      links: [<Copyright key="c" text={legal} />, <LegalLinks key="l" items={legalLinks} />],
      'links-social': [
        <Copyright key="c" text={legal} />,
        <LegalLinks key="l" items={legalLinks} />,
        <Socials key="s" />,
      ],
      'logo-links': [
        <Logo key="g" src={src} />,
        <Copyright key="c" text={legal} />,
        <LegalLinks key="l" items={legalLinks} />,
      ],
      'logo-social': [<Logo key="g" src={src} />, <Copyright key="c" text={legal} />, <Socials key="s" />],
    }

    return (
      <footer className="flex h-full items-center justify-between gap-[3cqw] px-[5cqw] py-[5cqw]">
        {slots[content] ?? slots.links}
      </footer>
    )
  }

  // Column layouts: brand block, link columns, optional newsletter, then a legal bar.
  const linkCount = Number(columns)
  const headings = linesOf(copy?.items)

  return (
    <footer className="flex h-full flex-col justify-center">
      <div className="flex flex-col gap-[3.5cqw] px-[5cqw] pt-[4cqw] pb-[3cqw]">
        <div
          className="grid gap-[4cqw]"
          style={{
            gridTemplateColumns: `1.5fr repeat(${linkCount}, 1fr)${layout === 'newsletter' ? ' 1.6fr' : ''}`,
          }}
        >
          <BrandColumn src={src} tagline={copy?.body} />
          {Array.from({ length: linkCount }, (_, i) => (
            <LinkColumn
              key={i}
              heading={headings.length ? itemAt(copy?.items, i) : undefined}
              links={columnLinks.length ? columnLinks : undefined}
            />
          ))}
          {layout === 'newsletter' && <Newsletter subscribe={subscribe} copy={copy} />}
        </div>

        <span aria-hidden="true" className="h-px w-full bg-neutral-200" />

        <div className="flex items-center gap-[5cqw]">
          <Copyright text={legal} />
          <LegalLinks items={legalLinks} />
        </div>
      </div>
    </footer>
  )
}

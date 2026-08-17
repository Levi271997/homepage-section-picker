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
      <span className="truncate text-[1.3cqw] leading-none" style={{ color: MUTED }}>
        {text}
      </span>
    )
  }
  return <span className="h-[1.2cqw] w-[26cqw] rounded-full" style={{ background: MUTED }} />
}

/** "Terms and Conditions   Privacy Policy" */
function LegalLinks({ items }: { items?: string[] }) {
  if (items?.length) {
    return (
      <span className="flex items-center gap-[3cqw]">
        {items.slice(0, 3).map((label) => (
          <span key={label} className="text-[1.3cqw] leading-none whitespace-nowrap text-neutral-700">
            {label}
          </span>
        ))}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-[3cqw]">
      <span className="h-[1.2cqw] w-[13cqw] rounded-full bg-neutral-700" />
      <span className="h-[1.2cqw] w-[9cqw] rounded-full bg-neutral-700" />
    </span>
  )
}

function Socials() {
  return (
    <span className="flex items-center gap-[1.6cqw]">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="size-[2.2cqw] rounded-full" style={{ background: GREEN }} />
      ))}
    </span>
  )
}

/** A "Label" heading over five item links. */
function LinkColumn({ heading, links }: { heading?: string; links?: string[] }) {
  return (
    <span className="flex flex-col gap-[1.4cqw]">
      {heading ? (
        <span className="text-[1.5cqw] leading-none font-semibold" style={{ color: TAN }}>
          {heading}
        </span>
      ) : (
        <span className="h-[1.3cqw] w-[50%] rounded-full" style={{ background: TAN }} />
      )}

      {Array.from({ length: 5 }, (_, i) =>
        links?.length ? (
          <span key={i} className="truncate text-[1.3cqw] leading-none text-neutral-600">
            {links[i % links.length]}
          </span>
        ) : (
          <span key={i} className="h-[1cqw] w-[62%] rounded-full bg-neutral-600" />
        ),
      )}
    </span>
  )
}

/** Logo, a line of copy and the social icons. */
function BrandColumn({ src, tagline }: { src?: string; tagline?: string }) {
  return (
    <span className="flex flex-col gap-[2cqw]">
      <Logo src={src} />
      {tagline ? (
        <span className="text-[1.3cqw] leading-[1.45]" style={{ color: MUTED }}>
          {tagline}
        </span>
      ) : (
        <span className="flex flex-col gap-[0.9cqw]">
          <span className="h-[1cqw] w-full rounded-full" style={{ background: MUTED }} />
          <span className="h-[1cqw] w-[70%] rounded-full" style={{ background: MUTED }} />
        </span>
      )}
      <Socials />
    </span>
  )
}

function Newsletter({ subscribe, copy }: { subscribe: string; copy?: SectionContent }) {
  const blurb = copy?.newsletter

  return (
    <span className="flex flex-col gap-[1.6cqw]">
      {blurb ? (
        <span className="text-[1.3cqw] leading-[1.45]" style={{ color: MUTED }}>
          {blurb}
        </span>
      ) : (
        <span className="flex flex-col gap-[0.9cqw]">
          <span className="h-[1cqw] w-full rounded-full" style={{ background: MUTED }} />
          <span className="h-[1cqw] w-[75%] rounded-full" style={{ background: MUTED }} />
        </span>
      )}

      {subscribe === 'inline' ? (
        <>
          <span className="flex items-stretch">
            <span
              className="h-[5cqw] flex-1 rounded-l-xs"
              style={{ background: 'var(--brand-soft,#eef4ea)' }}
            />
            <span className="h-[5cqw] w-[6cqw] rounded-r-xs" style={{ background: GREEN }} />
          </span>
          <span className="flex items-center gap-[1.2cqw]">
            <span className="size-[1.8cqw] rounded-full" style={{ background: GREEN }} />
            <span className="h-[1cqw] w-[60%] rounded-full bg-neutral-600" />
          </span>
        </>
      ) : (
        <>
          <span className="h-[5cqw] w-full rounded-xs" style={{ background: 'var(--brand-soft,#eef4ea)' }} />
          <FilledButton label={copy?.cta} />
        </>
      )}
    </span>
  )
}

/** Faint suggestion of the page above, so the footer reads as a footer. */
function PageHint() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[2cqw] px-[10cqw] opacity-25">
      <span className="h-[2.4cqw] w-[45%] rounded-full bg-neutral-400" />
      <span className="h-[1.2cqw] w-[65%] rounded-full bg-neutral-300" />
    </div>
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
      <div className="flex h-full flex-col">
        <PageHint />
        <div className="flex justify-center px-[5cqw] py-[6cqw]">
          <Logo className="h-[9cqw] w-[24cqw]" src={src} />
        </div>
      </div>
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
      <div className="flex h-full flex-col">
        <PageHint />
        <div className="flex items-center justify-between gap-[3cqw] px-[5cqw] py-[5cqw]">
          {slots[content] ?? slots.links}
        </div>
      </div>
    )
  }

  // Column layouts: brand block, link columns, optional newsletter, then a legal bar.
  const linkCount = Number(columns)
  const headings = linesOf(copy?.items)

  return (
    <div className="flex h-full flex-col">
      <PageHint />

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

        <span className="h-px w-full bg-neutral-200" />

        <div className="flex items-center gap-[5cqw]">
          <Copyright text={legal} />
          <LegalLinks items={legalLinks} />
        </div>
      </div>
    </div>
  )
}

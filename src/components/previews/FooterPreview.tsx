import type { ReactNode } from 'react'
import { ImageBlock } from '@/components/previews/parts'

export type FooterChoice = {
  layout: string
  content: string
  columns: string
  subscribe: string
}

const GREEN = 'var(--brand,#3f6b30)'
const TAN = 'var(--brand-accent,#a1806a)'
const MUTED = '#b3a7a1'

function Logo({ className = 'h-[5cqw] w-[17cqw]' }: { className?: string }) {
  return <ImageBlock className={className} />
}

/** "Copyright © 2024 Digitalfeet | All Rights Reserved" */
function Copyright() {
  return <span className="h-[1.2cqw] w-[26cqw] rounded-full" style={{ background: MUTED }} />
}

/** "Terms and Conditions   Privacy Policy" */
function LegalLinks() {
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
function LinkColumn() {
  return (
    <span className="flex flex-col gap-[1.4cqw]">
      <span className="h-[1.3cqw] w-[50%] rounded-full" style={{ background: TAN }} />
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="h-[1cqw] w-[62%] rounded-full bg-neutral-600" />
      ))}
    </span>
  )
}

/** Logo, a line of copy and the social icons. */
function BrandColumn() {
  return (
    <span className="flex flex-col gap-[2cqw]">
      <Logo />
      <span className="flex flex-col gap-[0.9cqw]">
        <span className="h-[1cqw] w-full rounded-full" style={{ background: MUTED }} />
        <span className="h-[1cqw] w-[70%] rounded-full" style={{ background: MUTED }} />
      </span>
      <Socials />
    </span>
  )
}

function Newsletter({ subscribe }: { subscribe: string }) {
  return (
    <span className="flex flex-col gap-[1.6cqw]">
      <span className="flex flex-col gap-[0.9cqw]">
        <span className="h-[1cqw] w-full rounded-full" style={{ background: MUTED }} />
        <span className="h-[1cqw] w-[75%] rounded-full" style={{ background: MUTED }} />
      </span>

      {subscribe === 'inline' ? (
        <>
          <span className="flex items-stretch">
            <span className="h-[5cqw] flex-1 rounded-l-[2px]" style={{ background: '#eef4ea' }} />
            <span className="h-[5cqw] w-[6cqw] rounded-r-[2px]" style={{ background: GREEN }} />
          </span>
          <span className="flex items-center gap-[1.2cqw]">
            <span className="size-[1.8cqw] rounded-full" style={{ background: GREEN }} />
            <span className="h-[1cqw] w-[60%] rounded-full bg-neutral-600" />
          </span>
        </>
      ) : (
        <>
          <span className="h-[5cqw] w-full rounded-[2px]" style={{ background: '#eef4ea' }} />
          <span className="h-[4cqw] w-[40%] rounded-[2px]" style={{ background: GREEN }} />
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
export default function FooterPreview({ layout, content, columns, subscribe }: FooterChoice) {
  if (layout === 'logo-only') {
    return (
      <div className="flex h-full flex-col">
        <PageHint />
        <div className="flex justify-center px-[5cqw] py-[6cqw]">
          <Logo className="h-[9cqw] w-[24cqw]" />
        </div>
      </div>
    )
  }

  if (layout === 'bar') {
    // What sits at each end (and in the middle, when there are three things).
    const slots: Record<string, ReactNode[]> = {
      links: [<Copyright key="c" />, <LegalLinks key="l" />],
      'links-social': [<Copyright key="c" />, <LegalLinks key="l" />, <Socials key="s" />],
      'logo-links': [<Logo key="g" />, <Copyright key="c" />, <LegalLinks key="l" />],
      'logo-social': [<Logo key="g" />, <Copyright key="c" />, <Socials key="s" />],
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
          <BrandColumn />
          {Array.from({ length: linkCount }, (_, i) => (
            <LinkColumn key={i} />
          ))}
          {layout === 'newsletter' && <Newsletter subscribe={subscribe} />}
        </div>

        <span className="h-px w-full bg-neutral-200" />

        <div className="flex items-center gap-[5cqw]">
          <Copyright />
          <LegalLinks />
        </div>
      </div>
    </div>
  )
}

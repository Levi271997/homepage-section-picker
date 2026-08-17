import { linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'

export type HeaderChoice = {
  structure: string
  nav: string
  band: string
  cta: string
}

const GREEN = 'var(--brand,#3f6b30)'
const BROWN = '#553f39'
const TAN = 'var(--brand-accent,#a1806a)'

const BAND_FILL: Record<string, string | undefined> = {
  white: undefined,
  dark: BROWN,
  green: 'var(--brand-soft,#dceccf)',
}

function Logo({ src }: { src?: string | null }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a third-party URL from the client's own site
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden'
        }}
        className="block h-[4.5cqw] w-auto max-w-[24cqw] object-contain object-left"
      />
    )
  }
  return <span className="block h-[4cqw] w-[15cqw] rounded-[1px] bg-neutral-300" />
}

/** Four nav links; the first is "active" — darker with an underline. */
function Nav({ onDark, labels, accent = GREEN }: { onDark?: boolean; labels?: string[]; accent?: string }) {
  const link = onDark ? 'bg-neutral-100' : 'bg-neutral-600'

  if (labels?.length) {
    return (
      <span className="flex items-center gap-[2.6cqw]">
        {labels.map((label, i) => (
          <span key={label} className="flex flex-col items-center gap-[0.6cqw]">
            <span
              className="text-[1.7cqw] leading-none whitespace-nowrap"
              style={{ color: onDark ? '#ffffff' : i === 0 ? '#1c1c1c' : '#525252' }}
            >
              {label}
            </span>
            {i === 0 && (
              <span
                className="h-[0.5cqw] w-full rounded-full"
                style={{ background: onDark ? '#ffffff' : accent }}
              />
            )}
          </span>
        ))}
      </span>
    )
  }

  return (
    <span className="flex items-center gap-[3cqw]">
      <span className="flex flex-col items-center gap-[0.7cqw]">
        <span className={`h-[1.2cqw] w-[6cqw] rounded-full ${onDark ? 'bg-white' : 'bg-neutral-800'}`} />
        <span
          className="h-[0.5cqw] w-[6cqw] rounded-full"
          style={{ background: onDark ? '#ffffff' : accent }}
        />
      </span>
      <span className={`h-[1.2cqw] w-[7cqw] rounded-full ${link}`} />
      <span className={`h-[1.2cqw] w-[6.5cqw] rounded-full ${link}`} />
      <span className={`h-[1.2cqw] w-[5cqw] rounded-full ${link}`} />
    </span>
  )
}

function Cta({ kind, accent = GREEN, label }: { kind: string; accent?: string; label?: string }) {
  if (kind === 'none') return null

  if (label) {
    const shell =
      'inline-flex h-[4.4cqw] items-center justify-center rounded-xs px-[3cqw] text-[1.7cqw] leading-none font-medium whitespace-nowrap'
    return kind === 'solid' ? (
      <span className={shell} style={{ background: accent, color: '#ffffff' }}>
        {label}
      </span>
    ) : (
      <span className={`${shell} border`} style={{ borderColor: accent, color: accent }}>
        {label}
      </span>
    )
  }

  return kind === 'solid' ? (
    <span className="h-[4.4cqw] w-[16cqw] rounded-xs" style={{ background: accent }} />
  ) : (
    <span className="h-[4.4cqw] w-[16cqw] rounded-xs border" style={{ borderColor: accent }} />
  )
}

/** "contact@…" with its envelope. */
function EmailLine() {
  return (
    <span className="flex items-center gap-[1.2cqw]">
      <span className="h-[1.6cqw] w-[2.2cqw] rounded-[1px] bg-neutral-700" />
      <span className="h-[1.2cqw] w-[16cqw] rounded-full bg-neutral-700" />
    </span>
  )
}

function Socials() {
  return (
    <span className="flex items-center gap-[1.4cqw]">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="size-[2cqw] rounded-full bg-neutral-800" />
      ))}
    </span>
  )
}

/** The "CALL US / (123) 456-7890" block. */
function CallUs({ greenNumber, phone }: { greenNumber?: boolean; phone?: string }) {
  return (
    <span className="flex flex-col items-end gap-[0.9cqw]">
      <span className="text-[1.3cqw] leading-none tracking-[0.12em] uppercase" style={{ color: TAN }}>
        Call us
      </span>
      {phone ? (
        <span
          className="text-[2.2cqw] leading-none font-semibold"
          style={{ color: greenNumber ? GREEN : '#2b2b2b' }}
        >
          {phone}
        </span>
      ) : (
        <span
          className="h-[2cqw] w-[13cqw] rounded-full"
          style={{ background: greenNumber ? GREEN : '#2b2b2b' }}
        />
      )}
    </span>
  )
}

/** The nav row — used on its own or as the lower tier under a utility bar. */
function NavRow({
  nav,
  band,
  cta,
  ctaLabel,
  labels,
  accent,
}: {
  nav: string
  band: string
  cta: string
  ctaLabel?: string
  labels?: string[]
  accent?: string
}) {
  const fill = BAND_FILL[band]
  const onDark = band === 'dark'
  const shell = 'flex items-center px-[5cqw] py-[2.5cqw]'

  if (nav === 'center') {
    return (
      <div className={`${shell} grid grid-cols-3`} style={{ background: fill }}>
        <span />
        <span className="flex justify-center">
          <Nav onDark={onDark} labels={labels} accent={accent} />
        </span>
        <span className="flex justify-end">
          <Cta kind={cta} accent={accent} label={ctaLabel} />
        </span>
      </div>
    )
  }

  return (
    <div className={`${shell} justify-between gap-[3cqw]`} style={{ background: fill }}>
      {nav === 'right' ? <span /> : <Nav onDark={onDark} labels={labels} accent={accent} />}
      <span className="flex items-center gap-[3cqw]">
        {nav === 'right' && <Nav onDark={onDark} labels={labels} accent={accent} />}
        <Cta kind={cta} accent={accent} label={ctaLabel} />
      </span>
    </div>
  )
}

/** Faint suggestion of the page below, so the header reads as a header. */
function PageHint() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[2cqw] px-[10cqw] opacity-25">
      <span className="h-[2.4cqw] w-[45%] rounded-full bg-neutral-400" />
      <span className="h-[1.2cqw] w-[65%] rounded-full bg-neutral-300" />
    </div>
  )
}

/** Miniature of what the site header will look like on the page. */
export default function HeaderPreview({
  structure,
  nav,
  band,
  cta,
  content,
}: HeaderChoice & { content?: SectionContent }) {
  const logo = content?.image ?? null
  // Brand colour arrives through the --brand custom property, not as a prop.
  const accent = GREEN
  const ctaLabel = content?.cta || undefined
  // Four labels is what the wireframe shows; more would crowd the bar.
  const navLabels = linesOf(content?.nav).slice(0, 4)
  const labels = navLabels.length ? navLabels : undefined

  if (structure === 'stacked') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-[3cqw] px-[5cqw] pt-[4cqw] pb-[3cqw]">
          <span className="flex flex-col gap-[2.5cqw]">
            <Logo src={logo} />
            <Nav labels={labels} accent={accent} />
          </span>
          <span className="flex flex-col items-end gap-[2cqw]">
            <CallUs greenNumber phone={content?.phone} />
            <Cta kind={cta} accent={accent} label={ctaLabel} />
          </span>
        </div>
        <span className="h-px w-full bg-neutral-200" />
        <PageHint />
      </div>
    )
  }

  if (structure === 'single') {
    const onDark = band === 'dark'
    const fill = BAND_FILL[band]
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center px-[5cqw] py-[3cqw]" style={{ background: fill }}>
          {nav === 'center' ? (
            <span className="grid w-full grid-cols-3 items-center">
              <Logo src={logo} />
              <span className="flex justify-center">
                <Nav onDark={onDark} labels={labels} accent={accent} />
              </span>
              <span className="flex justify-end">
                <Cta kind={cta} accent={accent} label={ctaLabel} />
              </span>
            </span>
          ) : nav === 'left' ? (
            <span className="flex w-full items-center gap-[4cqw]">
              <Logo src={logo} />
              <Nav onDark={onDark} labels={labels} accent={accent} />
              <span className="ml-auto">
                <Cta kind={cta} accent={accent} label={ctaLabel} />
              </span>
            </span>
          ) : (
            <span className="flex w-full items-center">
              <Logo src={logo} />
              <span className="ml-auto flex items-center gap-[4cqw]">
                <Nav onDark={onDark} labels={labels} accent={accent} />
                <Cta kind={cta} accent={accent} label={ctaLabel} />
              </span>
            </span>
          )}
        </div>
        <span className="h-px w-full bg-neutral-200" />
        <PageHint />
      </div>
    )
  }

  // Two-tier: a white utility bar above the nav band.
  return (
    <div className="flex h-full flex-col">
      {structure === 'utility-social' ? (
        <div className="grid grid-cols-3 items-center px-[5cqw] py-[3cqw]">
          <EmailLine />
          <span className="flex justify-center">
            <Logo src={logo} />
          </span>
          <span className="flex justify-end">
            <Socials />
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between px-[5cqw] py-[3cqw]">
          <Logo src={logo} />
          <CallUs phone={content?.phone} />
        </div>
      )}

      <NavRow nav={nav} band={band} cta={cta} ctaLabel={ctaLabel} labels={labels} accent={accent} />
      <PageHint />
    </div>
  )
}

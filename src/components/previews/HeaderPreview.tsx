import { SOCIAL_GLYPHS } from '@/components/previews/parts'
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
  return <span aria-hidden="true" className="block h-[4cqw] w-[15cqw] rounded-[1px] bg-neutral-300" />
}

/** The small caret marking a nav item that opens a dropdown. */
function Caret({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 10 6" className="h-[1cqw] w-[1.6cqw]" fill="none" aria-hidden="true">
      <path d="M1 1l4 4 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Nav links; the first is "active" — darker with an underline. */
function Nav({
  onDark,
  labels,
  accent = GREEN,
  menu,
}: {
  onDark?: boolean
  labels?: string[]
  accent?: string
  /** Links shown under a nav item that has a dropdown. */
  menu?: string[]
}) {
  const link = onDark ? 'bg-neutral-100' : 'bg-neutral-600'

  if (labels?.length) {
    return (
      <nav aria-label="Main">
      <ul className="flex items-center gap-[2.6cqw]">
        {labels.map((raw, i) => {
          // A trailing caret in the field marks a link that opens a menu.
          const dropdown = raw.endsWith('^')
          const label = dropdown ? raw.slice(0, -1).trim() : raw
          const color = onDark ? '#ffffff' : i === 0 ? '#2b2320' : '#4a413d'

          return (
            <li
              key={`${label}-${i}`}
              data-role={dropdown ? 'nav-group' : undefined}
              className="relative flex flex-col items-center gap-[0.7cqw]"
            >
              {/* The anchor is what opens the menu on focus, so the group no
                  longer needs a tabindex of its own. */}
              <a
                href="#"
                data-role="nav"
                data-nav-index={i}
                aria-current={i === 0 ? 'page' : undefined}
                aria-haspopup={dropdown && menu?.length ? true : undefined}
                className="flex items-center gap-[0.8cqw]"
              >
                <span className="text-[1.8cqw] leading-none whitespace-nowrap" style={{ color }}>
                  {label}
                </span>
                {dropdown && <Caret color={color} />}
              </a>

              {i === 0 && (
                <span
                  aria-hidden="true"
                  className="h-[0.4cqw] w-full rounded-full"
                  style={{ background: onDark ? '#ffffff' : accent }}
                />
              )}

              {dropdown && menu?.length && (
                <ul
                  data-role="menu"
                  className="absolute top-full left-1/2 z-20 mt-[1.5cqw] flex -translate-x-1/2 flex-col gap-[1.4cqw] rounded-sm border border-neutral-200 bg-white px-[2.5cqw] py-[2cqw] shadow-lg"
                >
                  {menu.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        data-role="link"
                        className="block text-[1.6cqw] leading-none whitespace-nowrap text-neutral-700"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
      </nav>
    )
  }

  // Nothing typed in yet: bars standing in for links, with nothing to announce.
  return (
    <div aria-hidden="true" className="flex items-center gap-[3cqw]">
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
    </div>
  )
}

function Cta({ kind, accent = GREEN, label }: { kind: string; accent?: string; label?: string }) {
  if (kind === 'none') return null

  if (label) {
    // Every button in the design carries a trailing arrow.
    const shell =
      'inline-flex h-[5cqw] items-center justify-center gap-[1.2cqw] rounded-sm px-[3cqw] text-[1.8cqw] leading-none font-medium whitespace-nowrap'
    const inner = (color: string) => (
      <>
        {label}
        <svg viewBox="0 0 14 10" className="h-[1.4cqw] w-[2cqw]" fill="none" aria-hidden="true">
          <path
            d="M1 5h11M8.5 1.5L12 5l-3.5 3.5"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    )

    return kind === 'solid' ? (
      <button type="button" data-role="button" className={shell} style={{ background: accent, color: '#ffffff' }}>
        {inner('#ffffff')}
      </button>
    ) : (
      <button type="button" data-role="button" className={`${shell} border`} style={{ borderColor: accent, color: accent }}>
        {inner(accent)}
      </button>
    )
  }

  return kind === 'solid' ? (
    <span aria-hidden="true" data-role="button" className="block h-[4.4cqw] w-[16cqw] rounded-xs" style={{ background: accent }} />
  ) : (
    <span
      aria-hidden="true"
      data-role="button"
      className="block h-[4.4cqw] w-[16cqw] rounded-xs border"
      style={{ borderColor: accent }}
    />
  )
}

/** "contact@…" with its envelope, opening a mail client in the page view. */
function EmailLine({ text }: { text?: string }) {
  const ink = '#3f3330'
  const inner = (
    <>
      <svg viewBox="0 0 18 13" className="h-[1.8cqw] w-[2.5cqw]" aria-hidden="true">
        <rect x="0.5" y="0.5" width="17" height="12" rx="1.4" fill={ink} />
        <path d="M1.6 2L9 7.2 16.4 2" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      {text ? (
        <span className="text-[1.6cqw] leading-none whitespace-nowrap" style={{ color: ink }}>
          {text}
        </span>
      ) : (
        <span aria-hidden="true" className="h-[1.2cqw] w-[16cqw] rounded-full" style={{ background: ink }} />
      )}
    </>
  )

  if (!text) return <span aria-hidden="true" className="flex items-center gap-[1.2cqw]">{inner}</span>

  return (
    <a
      href={`mailto:${text}`}
      data-role="ext-link"
      className="flex items-center gap-[1.2cqw] no-underline"
    >
      {inner}
    </a>
  )
}

/**
 * The four social marks from the design, drawn as simple glyphs rather than
 * brand logos — recognisable at this size without shipping icon assets.
 */
function Socials({ links }: { links?: string[] }) {
  const ink = '#3f3330'

  return (
    <ul className="flex items-center gap-[1.4cqw]" style={{ color: ink }}>
      {SOCIAL_GLYPHS.map((glyph, i) => {
        const icon = (
          <svg viewBox="0 0 16 16" className="size-[2.2cqw]" aria-hidden="true">
            {glyph.path(ink)}
          </svg>
        )
        const href = links?.[i]

        return (
          <li key={glyph.name} className="flex">
            {href ? (
              <a href={href} data-role="ext-link" target="_blank" rel="noreferrer" aria-label={glyph.name} className="flex">
                {icon}
              </a>
            ) : (
              // A profile the client hasn't given us stays a plain mark.
              <span aria-hidden="true" className="flex">
                {icon}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** The "CALL US / (123) 456-7890" block. */
function CallUs({ greenNumber, phone }: { greenNumber?: boolean; phone?: string }) {
  return (
    <div className="flex flex-col items-end gap-[0.9cqw]">
      <span className="text-[1.3cqw] leading-none tracking-[0.12em] uppercase" style={{ color: TAN }}>
        Call us
      </span>
      {phone ? (
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          data-role="ext-link"
          className="text-[2.2cqw] leading-none font-semibold no-underline"
          style={{ color: greenNumber ? GREEN : '#2b2b2b' }}
        >
          {phone}
        </a>
      ) : (
        <span
          aria-hidden="true"
          className="h-[2cqw] w-[13cqw] rounded-full"
          style={{ background: greenNumber ? GREEN : '#2b2b2b' }}
        />
      )}
    </div>
  )
}

/** The nav row — used on its own or as the lower tier under a utility bar. */
function NavRow({
  nav,
  band,
  cta,
  ctaLabel,
  labels,
  menu,
  accent,
}: {
  nav: string
  band: string
  cta: string
  ctaLabel?: string
  labels?: string[]
  menu?: string[]
  accent?: string
}) {
  const fill = BAND_FILL[band]
  const onDark = band === 'dark'
  const shell = 'flex items-center px-[5cqw] py-[2.5cqw]'

  if (nav === 'center') {
    return (
      <div className={`${shell} grid grid-cols-3`} style={{ background: fill }}>
        <span />
        <div className="flex justify-center">
          <Nav onDark={onDark} labels={labels} accent={accent} menu={menu} />
        </div>
        <div className="flex justify-end">
          <Cta kind={cta} accent={accent} label={ctaLabel} />
        </div>
      </div>
    )
  }

  return (
    <div className={`${shell} justify-between gap-[3cqw]`} style={{ background: fill }}>
      {nav === 'right' ? <span /> : <Nav onDark={onDark} labels={labels} accent={accent} menu={menu} />}
      <div className="flex items-center gap-[3cqw]">
        {nav === 'right' && <Nav onDark={onDark} labels={labels} accent={accent} menu={menu} />}
        <Cta kind={cta} accent={accent} label={ctaLabel} />
      </div>
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
  // Five fits the centred nav in the design; more crowds the bar.
  const socials = linesOf(content?.socialLinks)
  const socialLinks = socials.length ? socials : undefined
  const menuItems = linesOf(content?.navMenu)
  const menu = menuItems.length ? menuItems : undefined
  const navLabels = linesOf(content?.nav).slice(0, 5)
  const labels = navLabels.length ? navLabels : undefined

  if (structure === 'stacked') {
    return (
      <header className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-[3cqw] px-[5cqw] pt-[4cqw] pb-[3cqw]">
          <div className="flex flex-col gap-[2.5cqw]">
            <Logo src={logo} />
            <Nav labels={labels} accent={accent} menu={menu} />
          </div>
          <div className="flex flex-col items-end gap-[2cqw]">
            <CallUs greenNumber phone={content?.phone} />
            <Cta kind={cta} accent={accent} label={ctaLabel} />
          </div>
        </div>
        <span aria-hidden="true" className="h-px w-full bg-neutral-200" />
      </header>
    )
  }

  if (structure === 'single') {
    const onDark = band === 'dark'
    const fill = BAND_FILL[band]
    return (
      <header className="flex h-full flex-col">
        <div className="flex items-center px-[5cqw] py-[3cqw]" style={{ background: fill }}>
          {nav === 'center' ? (
            <div className="grid w-full grid-cols-3 items-center">
              <Logo src={logo} />
              <div className="flex justify-center">
                <Nav onDark={onDark} labels={labels} accent={accent} menu={menu} />
              </div>
              <div className="flex justify-end">
                <Cta kind={cta} accent={accent} label={ctaLabel} />
              </div>
            </div>
          ) : nav === 'left' ? (
            <div className="flex w-full items-center gap-[4cqw]">
              <Logo src={logo} />
              <Nav onDark={onDark} labels={labels} accent={accent} menu={menu} />
              <div className="ml-auto">
                <Cta kind={cta} accent={accent} label={ctaLabel} />
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center">
              <Logo src={logo} />
              <div className="ml-auto flex items-center gap-[4cqw]">
                <Nav onDark={onDark} labels={labels} accent={accent} menu={menu} />
                <Cta kind={cta} accent={accent} label={ctaLabel} />
              </div>
            </div>
          )}
        </div>
        <span aria-hidden="true" className="h-px w-full bg-neutral-200" />
      </header>
    )
  }

  // Two-tier: a white utility bar above the nav band.
  return (
    <header className="flex h-full flex-col">
      {structure === 'utility-social' ? (
        <div className="grid grid-cols-3 items-center px-[5cqw] py-[3cqw]">
          <EmailLine text={content?.email} />
          <div className="flex justify-center">
            <Logo src={logo} />
          </div>
          <div className="flex justify-end">
            <Socials links={socialLinks} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-[5cqw] py-[3cqw]">
          <Logo src={logo} />
          <CallUs phone={content?.phone} />
        </div>
      )}

      <NavRow nav={nav} band={band} cta={cta} ctaLabel={ctaLabel} labels={labels} accent={accent} menu={menu} />
    </header>
  )
}

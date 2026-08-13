export type HeaderChoice = {
  structure: string
  nav: string
  band: string
  cta: string
}

const GREEN = '#3f6b30'
const BROWN = '#553f39'
const TAN = '#a1806a'

const BAND_FILL: Record<string, string | undefined> = {
  white: undefined,
  dark: BROWN,
  green: '#dceccf',
}

function Logo() {
  return <span className="block h-[4cqw] w-[15cqw] rounded-[1px] bg-neutral-300" />
}

/** Four nav links; the first is "active" — darker with an underline. */
function Nav({ onDark }: { onDark?: boolean }) {
  const link = onDark ? 'bg-neutral-100' : 'bg-neutral-600'
  return (
    <span className="flex items-center gap-[3cqw]">
      <span className="flex flex-col items-center gap-[0.7cqw]">
        <span className={`h-[1.2cqw] w-[6cqw] rounded-full ${onDark ? 'bg-white' : 'bg-neutral-800'}`} />
        <span
          className="h-[0.5cqw] w-[6cqw] rounded-full"
          style={{ background: onDark ? '#ffffff' : GREEN }}
        />
      </span>
      <span className={`h-[1.2cqw] w-[7cqw] rounded-full ${link}`} />
      <span className={`h-[1.2cqw] w-[6.5cqw] rounded-full ${link}`} />
      <span className={`h-[1.2cqw] w-[5cqw] rounded-full ${link}`} />
    </span>
  )
}

function Cta({ kind }: { kind: string }) {
  if (kind === 'none') return null
  return kind === 'solid' ? (
    <span className="h-[4.4cqw] w-[16cqw] rounded-[2px]" style={{ background: GREEN }} />
  ) : (
    <span className="h-[4.4cqw] w-[16cqw] rounded-[2px] border" style={{ borderColor: GREEN }} />
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
function CallUs({ greenNumber }: { greenNumber?: boolean }) {
  return (
    <span className="flex flex-col items-end gap-[0.9cqw]">
      <span className="h-[1.1cqw] w-[6cqw] rounded-full" style={{ background: TAN }} />
      <span
        className="h-[2cqw] w-[13cqw] rounded-full"
        style={{ background: greenNumber ? GREEN : '#2b2b2b' }}
      />
    </span>
  )
}

/** The nav row — used on its own or as the lower tier under a utility bar. */
function NavRow({ nav, band, cta }: { nav: string; band: string; cta: string }) {
  const fill = BAND_FILL[band]
  const onDark = band === 'dark'
  const shell = 'flex items-center px-[5cqw] py-[2.5cqw]'

  if (nav === 'center') {
    return (
      <div className={`${shell} grid grid-cols-3`} style={{ background: fill }}>
        <span />
        <span className="flex justify-center">
          <Nav onDark={onDark} />
        </span>
        <span className="flex justify-end">
          <Cta kind={cta} />
        </span>
      </div>
    )
  }

  return (
    <div className={`${shell} justify-between gap-[3cqw]`} style={{ background: fill }}>
      {nav === 'right' ? <span /> : <Nav onDark={onDark} />}
      <span className="flex items-center gap-[3cqw]">
        {nav === 'right' && <Nav onDark={onDark} />}
        <Cta kind={cta} />
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
export default function HeaderPreview({ structure, nav, band, cta }: HeaderChoice) {
  if (structure === 'stacked') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-[3cqw] px-[5cqw] pt-[4cqw] pb-[3cqw]">
          <span className="flex flex-col gap-[2.5cqw]">
            <Logo />
            <Nav />
          </span>
          <span className="flex flex-col items-end gap-[2cqw]">
            <CallUs greenNumber />
            <Cta kind={cta} />
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
              <Logo />
              <span className="flex justify-center">
                <Nav onDark={onDark} />
              </span>
              <span className="flex justify-end">
                <Cta kind={cta} />
              </span>
            </span>
          ) : nav === 'left' ? (
            <span className="flex w-full items-center gap-[4cqw]">
              <Logo />
              <Nav onDark={onDark} />
              <span className="ml-auto">
                <Cta kind={cta} />
              </span>
            </span>
          ) : (
            <span className="flex w-full items-center">
              <Logo />
              <span className="ml-auto flex items-center gap-[4cqw]">
                <Nav onDark={onDark} />
                <Cta kind={cta} />
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
            <Logo />
          </span>
          <span className="flex justify-end">
            <Socials />
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between px-[5cqw] py-[3cqw]">
          <Logo />
          <CallUs />
        </div>
      )}

      <NavRow nav={nav} band={band} cta={cta} />
      <PageHint />
    </div>
  )
}

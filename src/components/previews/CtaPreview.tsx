import { ImageBlock } from '@/components/previews/parts'

export type CtaChoice = {
  layout: string
  band: string
  shape: string
  side: string
  align: string
  list: string
}

const GREEN = '#3f6b30'
const BAND_GREEN = '#4d7c35'
const TAN = '#a1806a'

/** Bar colours flip on the dark backgrounds. */
function palette(band: string) {
  const onDark = band !== 'white'
  return {
    onDark,
    eyebrow: onDark ? '#ffffff' : TAN,
    headline: onDark ? '#ffffff' : '#1c1c1c',
    body: onDark ? 'rgba(255,255,255,0.75)' : '#c9c9c9',
    // On solid green the primary button goes white; over a photo it stays green.
    primary: band === 'green' ? '#ffffff' : GREEN,
    secondary: onDark ? '#ffffff' : 'transparent',
  }
}

function Buttons({ band }: { band: string }) {
  const c = palette(band)
  return (
    <span className="flex gap-[1.5cqw]">
      <span className="h-[4.4cqw] w-[14cqw] rounded-xs" style={{ background: c.primary }} />
      <span
        className="h-[4.4cqw] w-[14cqw] rounded-xs border"
        style={{ background: c.secondary, borderColor: c.onDark ? '#ffffff' : GREEN }}
      />
    </span>
  )
}

function CheckRow({ band }: { band: string }) {
  const c = palette(band)
  return (
    <span className="flex items-center gap-[1.5cqw]">
      <span className="size-[2cqw] shrink-0 rounded-full" style={{ background: c.onDark ? '#ffffff' : GREEN }} />
      <span className="h-[1cqw] w-[62%] rounded-full" style={{ background: c.body }} />
    </span>
  )
}

function Copy({
  band,
  centered,
  list,
  wide,
  hideButtons,
}: {
  band: string
  centered?: boolean
  list?: boolean
  wide?: boolean
  /** Set when the buttons sit outside the copy column, off to the right. */
  hideButtons?: boolean
}) {
  const c = palette(band)
  return (
    <span className={`flex min-w-0 flex-1 flex-col gap-[1.6cqw] ${centered ? 'items-center' : 'items-start'}`}>
      <span className="h-[1.3cqw] w-[13cqw] rounded-full" style={{ background: c.eyebrow }} />
      <span className="h-[2.6cqw] rounded-full" style={{ background: c.headline, width: wide ? '58%' : '85%' }} />
      {!wide && <span className="h-[2.6cqw] w-[45%] rounded-full" style={{ background: c.headline }} />}
      <span className="mt-[0.4cqw] flex w-full flex-col gap-[0.9cqw]" style={{ alignItems: centered ? 'center' : undefined }}>
        <span className="h-[1.1cqw] rounded-full" style={{ background: c.body, width: wide ? '70%' : '100%' }} />
        <span className="h-[1.1cqw] rounded-full" style={{ background: c.body, width: wide ? '45%' : '78%' }} />
      </span>

      {list && (
        <span className="mt-[0.6cqw] flex w-full flex-col gap-[1.2cqw]">
          {Array.from({ length: 3 }, (_, i) => (
            <CheckRow key={i} band={band} />
          ))}
        </span>
      )}

      {!hideButtons && (
        <span className="mt-[1cqw]">
          <Buttons band={band} />
        </span>
      )}
    </span>
  )
}

/** Miniature of what the call to action will look like on the page. */
export default function CtaPreview({ layout, band, shape, side, align, list }: CtaChoice) {
  const panel = band !== 'white' && shape === 'panel'

  const inner =
    layout === 'split' ? (
      <div className="flex h-full items-center gap-[5cqw]">
        {side === 'left' && <ImageBlock className="h-[78%] w-[45%] shrink-0" />}
        <Copy band={band} list={list === 'checks'} />
        {side === 'right' && <ImageBlock className="h-[78%] w-[45%] shrink-0" />}
      </div>
    ) : align === 'apart' ? (
      <div className="flex h-full items-center justify-between gap-[5cqw]">
        <Copy band={band} wide hideButtons />
        <span className="shrink-0">
          <Buttons band={band} />
        </span>
      </div>
    ) : (
      <div className={`flex h-full flex-col justify-center ${align === 'center' ? 'items-center' : ''}`}>
        <Copy band={band} centered={align === 'center'} wide />
      </div>
    )

  // The photo background is the same checkerboard placeholder under a dark scrim.
  const backdrop =
    band === 'photo' ? (
      <>
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-conic-gradient(#e9e9e9 0% 25%, #fafafa 0% 50%)',
            backgroundSize: '8cqw 8cqw',
          }}
        />
        <span className="absolute inset-0" style={{ background: 'rgba(40,40,40,0.62)' }} />
      </>
    ) : null

  const surface = (
    <div
      className={`relative h-full overflow-hidden px-[5cqw] py-[5cqw] ${panel ? 'rounded-md' : ''}`}
      style={{ background: band === 'green' ? BAND_GREEN : undefined }}
    >
      {backdrop}
      <div className="relative h-full">{inner}</div>
    </div>
  )

  return panel ? <div className="h-full p-[4cqw]">{surface}</div> : surface
}

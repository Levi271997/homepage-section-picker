import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { ImageBlock } from '@/components/previews/parts'

export type CtaChoice = {
  layout: string
  band: string
  shape: string
  side: string
  align: string
  list: string
}

const GREEN = 'var(--brand,#3f6b30)'
const BAND_GREEN = 'var(--brand-band,#4d7c35)'
const TAN = 'var(--brand-accent,#a1806a)'

/** Bar colours flip on the dark backgrounds. */
function palette(band: string) {
  const onDark = band !== 'white'
  return {
    onDark,
    eyebrow: onDark ? '#ffffff' : TAN,
    headline: onDark ? '#ffffff' : '#1c1c1c',
    /** For placeholder bars — deliberately pale. */
    body: onDark ? 'rgba(255,255,255,0.75)' : '#c9c9c9',
    /** For real copy, which needs to be readable rather than suggestive. */
    bodyText: onDark ? 'rgba(255,255,255,0.85)' : '#5b5b5b',
    // On solid green the primary button goes white; over a photo it stays green.
    primary: band === 'green' ? '#ffffff' : GREEN,
    secondary: onDark ? '#ffffff' : 'transparent',
  }
}

function Buttons({ band, primary, secondary }: { band: string; primary?: string; secondary?: string }) {
  const c = palette(band)
  const shell =
    'inline-flex h-[4.4cqw] items-center justify-center rounded-xs px-[2.5cqw] text-[1.7cqw] leading-none font-medium whitespace-nowrap'

  return (
    <span className="flex gap-[1.5cqw]">
      {primary ? (
        <span
          className={shell}
          style={{ background: c.primary, color: band === 'green' ? BAND_GREEN : '#ffffff' }}
        >
          {primary}
        </span>
      ) : (
        <span className="h-[4.4cqw] w-[14cqw] rounded-xs" style={{ background: c.primary }} />
      )}

      {secondary ? (
        <span
          className={`${shell} border`}
          style={{
            background: 'transparent',
            borderColor: c.onDark ? '#ffffff' : GREEN,
            color: c.onDark ? '#ffffff' : GREEN,
          }}
        >
          {secondary}
        </span>
      ) : (
        <span
          className="h-[4.4cqw] w-[14cqw] rounded-xs border"
          style={{ background: c.secondary, borderColor: c.onDark ? '#ffffff' : GREEN }}
        />
      )}
    </span>
  )
}

function CheckRow({ band, text }: { band: string; text?: string }) {
  const c = palette(band)
  return (
    <span className="flex items-center gap-[1.5cqw]">
      <span className="size-[2cqw] shrink-0 rounded-full" style={{ background: c.onDark ? '#ffffff' : GREEN }} />
      {text ? (
        <span className="text-[1.6cqw] leading-tight" style={{ color: c.bodyText }}>
          {text}
        </span>
      ) : (
        <span className="h-[1cqw] w-[62%] rounded-full" style={{ background: c.body }} />
      )}
    </span>
  )
}

function Copy({
  band,
  centered,
  list,
  wide,
  hideButtons,
  content,
}: {
  band: string
  centered?: boolean
  list?: boolean
  wide?: boolean
  /** Set when the buttons sit outside the copy column, off to the right. */
  hideButtons?: boolean
  content?: SectionContent
}) {
  const c = palette(band)
  const points = linesOf(content?.items)

  return (
    <span
      className={`flex min-w-0 flex-1 flex-col gap-[1.6cqw] ${
        centered ? 'items-center text-center' : 'items-start'
      }`}
    >
      {content?.eyebrow ? (
        <span
          className="text-[1.5cqw] leading-none font-medium tracking-[0.12em] uppercase"
          style={{ color: c.eyebrow }}
        >
          {content.eyebrow}
        </span>
      ) : (
        <span className="h-[1.3cqw] w-[13cqw] rounded-full" style={{ background: c.eyebrow }} />
      )}

      {content?.heading ? (
        <span className="text-[3cqw] leading-[1.15] font-semibold" style={{ color: c.headline }}>
          {content.heading}
        </span>
      ) : (
        <>
          <span className="h-[2.6cqw] rounded-full" style={{ background: c.headline, width: wide ? '58%' : '85%' }} />
          {!wide && <span className="h-[2.6cqw] w-[45%] rounded-full" style={{ background: c.headline }} />}
        </>
      )}

      {content?.body ? (
        <span
          className="text-[1.6cqw] leading-[1.45]"
          style={{ color: c.bodyText, maxWidth: wide ? '70%' : undefined }}
        >
          {content.body}
        </span>
      ) : (
        <span
          className="mt-[0.4cqw] flex w-full flex-col gap-[0.9cqw]"
          style={{ alignItems: centered ? 'center' : undefined }}
        >
          <span className="h-[1.1cqw] rounded-full" style={{ background: c.body, width: wide ? '70%' : '100%' }} />
          <span className="h-[1.1cqw] rounded-full" style={{ background: c.body, width: wide ? '45%' : '78%' }} />
        </span>
      )}

      {list && (
        <span className="mt-[0.6cqw] flex w-full flex-col gap-[1.2cqw]">
          {Array.from({ length: 3 }, (_, i) => (
            <CheckRow key={i} band={band} text={points.length ? itemAt(content?.items, i) : undefined} />
          ))}
        </span>
      )}

      {!hideButtons && (
        <span className="mt-[1cqw]">
          <Buttons band={band} primary={content?.cta} secondary={content?.cta2} />
        </span>
      )}
    </span>
  )
}

/** Miniature of what the call to action will look like on the page. */
export default function CtaPreview({
  layout,
  band,
  shape,
  side,
  align,
  list,
  content,
}: CtaChoice & { content?: SectionContent }) {
  const panel = band !== 'white' && shape === 'panel'
  const src = content?.image

  const inner =
    layout === 'split' ? (
      <div className="flex h-full items-center gap-[5cqw]">
        {side === 'left' && <ImageBlock className="h-[78%] w-[45%] shrink-0" src={src} />}
        <Copy band={band} list={list === 'checks'} content={content} />
        {side === 'right' && <ImageBlock className="h-[78%] w-[45%] shrink-0" src={src} />}
      </div>
    ) : align === 'apart' ? (
      <div className="flex h-full items-center justify-between gap-[5cqw]">
        <Copy band={band} wide hideButtons content={content} />
        <span className="shrink-0">
          <Buttons band={band} primary={content?.cta} secondary={content?.cta2} />
        </span>
      </div>
    ) : (
      <div className={`flex h-full flex-col justify-center ${align === 'center' ? 'items-center' : ''}`}>
        <Copy band={band} centered={align === 'center'} wide content={content} />
      </div>
    )

  // On the photo band the client's own image is the backdrop, under a scrim
  // dark enough to keep white text readable over anything.
  const backdrop =
    band === 'photo' ? (
      <>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary URL or data URI
          <img src={src} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-conic-gradient(#e9e9e9 0% 25%, #fafafa 0% 50%)',
              backgroundSize: '8cqw 8cqw',
            }}
          />
        )}
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

import { linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { BodyLine, Dots, Eyebrow, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v28'. */
export type HeroDesign = string

const GREEN = 'var(--brand,#3f6b30)'
const PANEL_GREEN = 'var(--brand-soft,#e3edd8)'

/**
 * What each design is made of.
 *
 * The 23 heroes are variations on three frames, so they're described here as
 * data rather than written out as 23 components — a new export from the design
 * file is usually one more line in this table.
 */
type Spec = {
  /** copy beside media | copy above media | copy over a full-width image */
  frame: 'split' | 'stacked' | 'background'
  /** Which side the media sits on, for split designs. */
  side?: 'left' | 'right'
  media?: 'single' | 'pair' | 'form' | 'carousel'
  /** Media runs off the edge of the section instead of sitting inside the margin. */
  bleed?: boolean
  /** What sits above the headline. */
  intro?: 'eyebrow' | 'breadcrumb'
  /** What sits under the body copy. */
  list?: 'ticks' | 'meta'
  /** Email capture in place of the two buttons. */
  actions?: 'email'
  align?: 'center'
  /** Centred copy on a tinted panel, with the image overlapping it. */
  panel?: boolean
  /** Carousel paging dots under the copy. */
  dots?: boolean
  /** Which of a pair sits in front. */
  lead?: 'left' | 'right'
}

const SPECS: Record<string, Spec> = {
  v1: { frame: 'split', side: 'right', media: 'single' },
  v2: { frame: 'split', side: 'left', media: 'single' },
  v3: { frame: 'stacked', media: 'single' },
  v4: { frame: 'stacked', media: 'pair', lead: 'right' },
  v5: { frame: 'stacked', media: 'pair', lead: 'left' },
  v6: { frame: 'split', side: 'right', media: 'pair' },
  v7: { frame: 'split', side: 'left', media: 'pair' },
  v8: { frame: 'stacked', media: 'single', bleed: true },
  v13: { frame: 'split', side: 'right', media: 'single', actions: 'email' },
  v14: { frame: 'split', side: 'right', media: 'single', list: 'ticks' },
  v15: { frame: 'split', side: 'left', media: 'single', list: 'ticks' },
  v16: { frame: 'split', side: 'right', media: 'single', intro: 'eyebrow' },
  v17: { frame: 'split', side: 'left', media: 'single', intro: 'eyebrow' },
  v18: { frame: 'split', side: 'right', media: 'form', intro: 'eyebrow', list: 'ticks' },
  v19: { frame: 'split', side: 'right', media: 'single', bleed: true, intro: 'eyebrow', list: 'ticks' },
  v20: { frame: 'split', side: 'left', media: 'single', bleed: true, intro: 'eyebrow', list: 'ticks' },
  v21: { frame: 'stacked', media: 'single', panel: true },
  v22: { frame: 'stacked', media: 'carousel' },
  v23: { frame: 'background', dots: true },
  v24: { frame: 'background', align: 'center', dots: true },
  v25: { frame: 'split', side: 'right', media: 'single', intro: 'breadcrumb' },
  v26: { frame: 'stacked', intro: 'breadcrumb' },
  v28: { frame: 'split', side: 'right', media: 'form', intro: 'eyebrow', list: 'meta' },
}

/** Crumbs separated by hairline pipes, as the page-header designs set them. */
function Breadcrumb({ items, centered }: { items: string[]; centered?: boolean }) {
  const crumbs = items.length ? items : ['Home', 'Product', 'Product sub page']
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-[1.2cqw] ${centered ? 'justify-center' : ''}`}>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-[1.2cqw]">
            {i > 0 && <span aria-hidden="true" className="h-[1.4cqw] w-px bg-neutral-300" />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-[1.4cqw] leading-none text-neutral-500">
                {crumb}
              </span>
            ) : (
              <a data-role="link" href="#" className="text-[1.4cqw] leading-none text-neutral-500">
                {crumb}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Green tick followed by a line of text. */
function CheckRow({ text }: { text?: string }) {
  return (
    <li className="flex items-center gap-[1.5cqw]">
      <span aria-hidden="true" className="size-[2cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
      {text ? (
        <span className="text-[1.7cqw] leading-tight text-neutral-700">{text}</span>
      ) : (
        <span aria-hidden="true" className="h-[1cqw] w-[70%] rounded-full bg-neutral-400" />
      )}
    </li>
  )
}

/** A date or a location, behind a small neutral glyph. */
function MetaRow({ text }: { text?: string }) {
  return (
    <li className="flex items-center gap-[1.5cqw]">
      <span aria-hidden="true" className="size-[2cqw] shrink-0 rounded-[0.4cqw] bg-neutral-700" />
      {text ? (
        <span className="text-[1.7cqw] leading-tight text-neutral-700">{text}</span>
      ) : (
        <span aria-hidden="true" className="h-[1cqw] w-[40%] rounded-full bg-neutral-400" />
      )}
    </li>
  )
}

/** Email field and submit sharing one row, with the reassurance under it. */
function EmailCapture({ content }: { content?: SectionContent }) {
  return (
    <form className="flex w-full flex-col gap-[1.4cqw]" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-stretch gap-[1.2cqw]">
        <label className="flex h-[5cqw] min-w-0 flex-1 items-center rounded-xs px-[2cqw]" style={{ background: PANEL_GREEN }}>
          <span className="sr-only">Email address</span>
          <input
            type="email"
            readOnly
            placeholder="Enter your email address"
            className="w-full bg-transparent text-[1.7cqw] text-neutral-500 placeholder:text-neutral-500"
          />
        </label>
        <FilledButton label={content?.cta} />
      </div>
      {content?.note && (
        <p className="flex items-center gap-[1.2cqw]">
          <span aria-hidden="true" className="size-[1.8cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
          <span className="text-[1.4cqw] leading-none text-neutral-500">{content.note}</span>
        </p>
      )}
    </form>
  )
}

/**
 * One labelled input in the enquiry form.
 *
 * The bar under the label is the input itself, sized down rather than drawn as
 * a separate shape — so the wireframe look survives, and the label is attached
 * to a real control instead of to nothing.
 */
function Field({ label, tall }: { label: string; tall?: boolean }) {
  return (
    <label
      className={`flex flex-col justify-center gap-[0.6cqw] rounded-xs bg-white px-[1.4cqw] ${
        tall ? 'h-[6cqw]' : 'h-[4.6cqw]'
      }`}
    >
      <span className="text-[1.1cqw] leading-none text-neutral-400">{label}</span>
      <input type="text" readOnly className="h-[0.9cqw] w-[45%] rounded-full bg-neutral-300" />
    </label>
  )
}

/**
 * The enquiry form that stands in for the image in V18 and V28.
 *
 * Five fields, a consent row and a button have to fit a frame drawn 1440×648,
 * so everything here is tighter than the equivalent in the contact section —
 * at these sizes the stack lands just inside its half of the hero.
 */
function FormCard({ content, className = '' }: { content?: SectionContent; className?: string }) {
  return (
    <form
      aria-label="Enquiry"
      onSubmit={(e) => e.preventDefault()}
      className={`flex flex-col gap-[1.1cqw] rounded-sm p-[2cqw] ${className}`}
      style={{ background: PANEL_GREEN }}
    >
      <Field label="Name" />
      <Field label="Email" />
      <Field label="Phone" />
      <Field label="Company" />
      <Field label="Message" tall />
      <label className="flex items-start gap-[1cqw]">
        <input type="checkbox" className="mt-[0.3cqw] size-[2cqw] shrink-0 rounded-xs border border-neutral-300 bg-white" />
        <span className="flex min-w-0 flex-1 flex-col gap-[0.5cqw]">
          <span className="sr-only">I agree to be contacted</span>
          <BodyLine className="w-full" />
          <BodyLine className="w-[55%]" />
        </span>
      </label>
      <div className="mt-[0.2cqw]">
        <FilledButton label={content?.formCta} />
      </div>
    </form>
  )
}

/** Two images overlapping, as the paired designs stage them. */
function PairSquares({ a, b, lead = 'right' }: { a?: string | null; b?: string | null; lead?: 'left' | 'right' }) {
  const front = 'z-10 shadow-[0_2cqw_4cqw_rgba(0,0,0,0.10)]'
  return (
    <div className="relative block h-full w-full">
      <ImageBlock className={`absolute top-0 left-0 h-[72%] w-[66%] ${lead === 'left' ? front : ''}`} src={a} />
      <ImageBlock className={`absolute right-0 bottom-0 h-[72%] w-[66%] ${lead === 'right' ? front : ''}`} src={b} />
    </div>
  )
}

/** A row of images running off both edges, with the middle ones whole. */
function CarouselRow({ src }: { src?: string | null }) {
  return (
    <ul className="flex h-full w-full items-stretch gap-[2cqw]">
      <li className="h-full w-[8%] shrink-0">
        <ImageBlock className="h-full w-full" src={src} />
      </li>
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-full min-w-0 flex-1">
          <ImageBlock className="h-full w-full" src={src} />
        </li>
      ))}
      <li className="h-full w-[8%] shrink-0">
        <ImageBlock className="h-full w-full" src={src} />
      </li>
    </ul>
  )
}

/**
 * Headline, body and whatever the design puts around them.
 * `onImage` flips the type to white for the background designs.
 */
function Copy({
  spec,
  content,
  centered,
  onImage,
}: {
  spec: Spec
  content?: SectionContent
  centered?: boolean
  onImage?: boolean
}) {
  const ticks = linesOf(content?.items)

  return (
    <div className={`flex flex-col gap-[1.6cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
      {spec.intro === 'breadcrumb' && <Breadcrumb items={linesOf(content?.breadcrumb)} centered={centered} />}
      {spec.intro === 'eyebrow' && content?.eyebrow && <Eyebrow text={content.eyebrow} />}

      {/* The hero carries the page's one h1. */}
      <HeadlineLine as="h1" className={`w-full ${onImage ? 'text-white!' : ''}`} text={content?.heading} />
      <BodyLine
        className={`${centered ? 'w-[85%]' : 'w-full'} ${onImage ? 'text-neutral-200!' : ''}`}
        text={content?.body}
      />

      {spec.list === 'ticks' && (
        <ul className="mt-[0.6cqw] flex w-full flex-col gap-[1.2cqw]">
          {(ticks.length ? ticks : [undefined, undefined, undefined]).slice(0, 3).map((item, i) => (
            <CheckRow key={i} text={item} />
          ))}
        </ul>
      )}

      {spec.list === 'meta' && (
        <ul className="mt-[0.6cqw] flex w-full flex-col gap-[1.2cqw]">
          <MetaRow text={content?.date} />
          <MetaRow text={content?.location} />
        </ul>
      )}

      {spec.actions === 'email' ? (
        <div className="mt-[1.5cqw] w-full">
          <EmailCapture content={content} />
        </div>
      ) : (
        <div className="mt-[1.5cqw] flex items-center gap-[1.5cqw]">
          <FilledButton label={content?.cta} />
          <OutlineButton label={content?.cta2} />
        </div>
      )}

      {spec.dots && (
        <div className="mt-[1.5cqw]">
          <Dots />
        </div>
      )}
    </div>
  )
}

/** Whatever fills the media half of a split design. */
function SplitMedia({ spec, content }: { spec: Spec; content?: SectionContent }) {
  const image = content?.image ?? null
  const second = content?.image2 ?? image

  if (spec.media === 'form') return <FormCard content={content} className="w-[44%] shrink-0" />

  if (spec.media === 'pair') {
    // Both paired splits put the front image at the bottom right, whichever
    // side of the copy the pair sits on.
    return (
      <div className="h-[80%] w-1/2 shrink-0">
        <PairSquares a={image} b={second} lead="right" />
      </div>
    )
  }

  // A bleeding image is squared off against the edge it runs into.
  return (
    <ImageBlock
      className={spec.bleed ? 'h-full w-1/2 shrink-0 rounded-none border-0' : 'h-[74%] w-1/2 shrink-0'}
      src={image}
    />
  )
}

/** Miniature of what the hero will look like on the page. */
export default function HeroPreview({ design, content }: { design: HeroDesign; content?: SectionContent }) {
  const spec = SPECS[design] ?? SPECS.v1
  const image = content?.image ?? null
  const second = content?.image2 ?? image

  if (spec.frame === 'background') {
    const centered = spec.align === 'center'
    return (
      <section aria-label="Hero" className="relative flex h-full w-full items-center">
        <ImageBlock className="absolute inset-0 size-full rounded-none border-0" src={image} />
        {/* Scrim, so the type stays readable whatever the photo is. */}
        <span aria-hidden="true" className="absolute inset-0 bg-black/45" />
        <div className={`relative z-10 flex w-full px-[6cqw] ${centered ? 'justify-center' : ''}`}>
          <div className={centered ? 'w-[70%]' : 'w-[58%]'}>
            <Copy spec={spec} content={content} centered={centered} onImage />
          </div>
        </div>
      </section>
    )
  }

  if (spec.frame === 'stacked') {
    // V21 sets the copy on a tinted panel that the image then overlaps.
    if (spec.panel) {
      return (
        <section aria-label="Hero" className="flex h-full w-full flex-col">
          {/* Panel and image are sized so the overlap still totals the frame:
              70% + 46% − 16% = 100%. */}
          <div
            className="flex h-[70%] shrink-0 justify-center rounded-sm px-[6cqw] pt-[6cqw]"
            style={{ background: PANEL_GREEN }}
          >
            <div className="w-[75%]">
              <Copy spec={spec} content={content} centered />
            </div>
          </div>
          <div className="mt-[-16%] flex h-[46%] shrink-0 justify-center px-[8cqw]">
            <ImageBlock className="h-full w-full shadow-[0_2cqw_5cqw_rgba(0,0,0,0.12)]" src={image} />
          </div>
        </section>
      )
    }

    // The copy takes the height it needs and the media absorbs the rest, so the
    // stack always fills its frame exactly whatever ratio the design was drawn at.
    return (
      <section
        aria-label="Hero"
        className={`flex h-full w-full flex-col items-center gap-[4cqw] ${spec.bleed ? 'pt-[5cqw]' : 'p-[5cqw]'}`}
      >
        <div className="w-4/5 shrink-0">
          <Copy spec={spec} content={content} centered />
        </div>

        {spec.media === 'single' && (
          <ImageBlock
            className={`w-full min-h-0 flex-1 ${spec.bleed ? 'rounded-none border-x-0 border-b-0' : ''}`}
            src={image}
          />
        )}

        {spec.media === 'pair' && (
          <div className="relative block min-h-0 w-full flex-1">
            <ImageBlock
              className={`absolute top-0 left-0 h-[80%] w-[54%] ${
                spec.lead === 'left' ? 'z-10 shadow-[0_2cqw_4cqw_rgba(0,0,0,0.10)]' : ''
              }`}
              src={image}
            />
            <ImageBlock
              className={`absolute right-0 bottom-0 h-[80%] w-[54%] ${
                spec.lead === 'right' ? 'z-10 shadow-[0_2cqw_4cqw_rgba(0,0,0,0.10)]' : ''
              }`}
              src={second}
            />
          </div>
        )}

        {/* Capped rather than filling, so the cards stay landscape: our
            wireframe type is smaller than the drawn design's, and the slack it
            leaves would otherwise stretch them into portraits. */}
        {spec.media === 'carousel' && (
          <div className="max-h-[26cqw] min-h-0 w-full flex-1">
            <CarouselRow src={image} />
          </div>
        )}
      </section>
    )
  }

  // Split: copy one side, media the other.
  const mediaFirst = spec.side === 'left'
  // A bleeding image reaches the frame edge, so the padding goes on the copy alone.
  const frame = spec.bleed ? 'gap-[5cqw]' : 'gap-[4cqw] p-[5cqw]'
  const copyPad = spec.bleed ? (mediaFirst ? 'py-[5cqw] pr-[5cqw]' : 'py-[5cqw] pl-[5cqw]') : ''

  return (
    <section aria-label="Hero" className={`flex h-full w-full items-center ${frame}`}>
      {mediaFirst && <SplitMedia spec={spec} content={content} />}
      <div className={`min-w-0 flex-1 ${copyPad}`}>
        <Copy spec={spec} content={content} />
      </div>
      {!mediaFirst && <SplitMedia spec={spec} content={content} />}
    </section>
  )
}

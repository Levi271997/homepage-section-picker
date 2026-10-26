'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'
import 'swiper/css'

import { itemAt, linesOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import { usePreviewMode } from '@/components/previews/mode'
import {
  BodyLine,
  BUTTON_RADII,
  Dots,
  Eyebrow,
  FIELD_SHELL,
  FilledButton,
  HeadlineLine,
  ImageBlock,
  IMAGE_RADII,
  OutlineButton,
} from '@/components/previews/parts'

/** The design set, by its Figma name — 'v1' … 'v28'. */
export type HeroDesign = string

/**
 * The two corner settings, resolved to classes once and carried down.
 *
 * One object rather than two props because almost everything in here needs
 * both or neither, and a tree this shallow reads better drilled than wrapped
 * in a context it would otherwise have no use for.
 */
type Corners = { button: string; image: string }

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

/**
 * Green tick followed by a line of text.
 *
 * 19.2 across with 11 beside it, which is what all five of the designs that
 * draw a tick list — V14, V15, V18, V19 and V20 — set it at; ours was 28.8
 * with 21.6, half as big again as drawn and pushed too far from its line.
 */
function CheckRow({ text }: { text?: string }) {
  return (
    <li className="flex items-center gap-[0.76cqw]">
      <span aria-hidden="true" className="size-[1.33cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
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

/**
 * Email field and submit sharing one row, with the reassurance under it.
 *
 * V13 draws the pair the same height — 48 each — so the field takes its height
 * from the row rather than setting one. `items-stretch` was already on the
 * container and had nothing to do while both children named their own size.
 * Stretching keeps them level through the shared button's two states, which
 * aren't the same height as each other.
 */
function EmailCapture({ content, corners }: { content?: SectionContent; corners: Corners }) {
  return (
    <form className="flex w-full flex-col gap-[1.4cqw]" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-stretch gap-[1.2cqw]">
        <label className="flex min-w-0 flex-1 items-center rounded-xs px-[2cqw]" style={{ background: PANEL_GREEN }}>
          <span className="sr-only">Email address</span>
          <input
            type="email"
            readOnly
            placeholder="Enter your email address"
            className="w-full bg-transparent text-[1.7cqw] text-neutral-500 placeholder:text-neutral-500"
          />
        </label>
        <FilledButton label={content?.cta} radius={corners.button} />
      </div>
      {/* 16 across, 10 from the line it sits beside, as V13 draws them. */}
      {content?.note && (
        <p className="flex items-center gap-[0.7cqw]">
          <span aria-hidden="true" className="size-[1.11cqw] shrink-0 rounded-full" style={{ background: GREEN }} />
          <span className="text-[1.4cqw] leading-none text-neutral-500">{content.note}</span>
        </p>
      )}
    </form>
  )
}

/** The five the set draws, in order, with the message box last. */
const FORM_FIELDS = ['Name', 'Email', 'Phone', 'Company', 'Message']

/** What someone types, and the example sitting there until they do. */
const TYPED =
  'w-full bg-transparent outline-none text-neutral-700 placeholder:text-neutral-400'

/**
 * One labelled input in the enquiry form.
 *
 * A real control rather than a picture of one: the grey bar under the label
 * used to be an input shrunk to 0.9cqw and set `readOnly`, which read as a
 * wireframe but couldn't be typed into. It now carries the example the set
 * draws inside each field, and what you type takes the body ink so your own
 * answer doesn't read as more placeholder.
 *
 * Safe to leave writable everywhere: `PreviewFrame` marks the row thumbnails,
 * picker cards and swap menus `decorative`, which puts `inert` on the whole
 * subtree. Only the full-page view renders without it.
 *
 * `FIELD_SHELL` brings the radius and the focus edge from
 * `design-sets/input-fields`, the same as the contact section's form.
 */
function Field({ label, hint, area }: { label: string; hint?: string; area?: boolean }) {
  return (
    <label className={`${FIELD_SHELL} flex h-[4.03cqw] flex-col justify-center gap-[0.4cqw] bg-white px-[1.18cqw]`}>
      <span className="text-[1.1cqw] leading-none text-neutral-400">{label}</span>
      {area ? (
        <textarea
          rows={1}
          placeholder={hint}
          className={`${TYPED} h-[1.39cqw] resize-none overflow-hidden border-0 p-0 text-[1.39cqw] leading-none`}
        />
      ) : (
        <input type="text" placeholder={hint} className={`${TYPED} text-[1.39cqw] leading-none`} />
      )}
    </label>
  )
}

/**
 * The enquiry form that stands in for the image in V18 and V28.
 *
 * Drawn 450 × 488 with an 8 corner and a 20 inset, holding five 58-tall
 * fields on a 66 pitch, then the consent row 21 below the last of them and
 * the button 25 below the consent copy. The gaps past the field stack are
 * margins on top of the flex gap rather than replacements for it.
 */
function FormCard({
  content,
  className = '',
  corners,
}: {
  content?: SectionContent
  className?: string
  corners: Corners
}) {
  return (
    <form
      aria-label="Enquiry"
      onSubmit={(e) => e.preventDefault()}
      className={`flex flex-col gap-[0.55cqw] rounded-[0.55cqw] p-[1.39cqw] ${className}`}
      style={{ background: PANEL_GREEN }}
    >
      {FORM_FIELDS.map((label, i) => (
        <Field
          key={label}
          label={label}
          hint={itemAt(content?.fieldHints, i) || undefined}
          area={i === FORM_FIELDS.length - 1}
        />
      ))}

      {/* 19 square filled with the tint and edged in green, 9 from its line, as
          V18 and V28 both draw it. The colours are classes rather than inline
          style so the checked state can win — an inline background would
          outrank the utility. */}
      <label className="mt-[0.9cqw] flex items-start gap-[0.63cqw]">
        <span className="relative flex shrink-0">
          <input
            type="checkbox"
            className="peer size-[1.32cqw] appearance-none rounded-[0.14cqw] border border-[color:var(--brand,#4b7b35)] bg-[color:var(--brand-soft,#e1efd8)] outline-none checked:bg-[color:var(--brand,#4b7b35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand,#4b7b35)]"
          />
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden size-[1.32cqw] peer-checked:block"
            fill="none"
          >
            <path d="M3.5 8.4l3 3 6-6.4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {content?.consent ? (
          <span className="min-w-0 flex-1 text-[0.9cqw] leading-[1.38] text-neutral-700">{content.consent}</span>
        ) : (
          <span aria-hidden="true" className="flex min-w-0 flex-1 flex-col gap-[0.5cqw]">
            <span className="sr-only">I agree to be contacted</span>
            <BodyLine className="w-full" />
            <BodyLine className="w-[55%]" />
          </span>
        )}
      </label>
      <div className="mt-[1.18cqw]">
        <FilledButton label={content?.formCta} radius={corners.button} />
      </div>
    </form>
  )
}

/** Two images overlapping, as the paired designs stage them. */
function PairSquares({
  a,
  b,
  lead = 'right',
  corners,
}: {
  a?: string | null
  b?: string | null
  lead?: 'left' | 'right'
  corners: Corners
}) {
  const front = 'z-10 shadow-[0_2cqw_4cqw_rgba(0,0,0,0.10)]'
  return (
    <div className="relative block h-full w-full">
      <ImageBlock
        className={`absolute top-0 left-0 h-[72%] w-[66%] ${lead === 'left' ? front : ''}`}
        radius={corners.image}
        src={a}
      />
      <ImageBlock
        className={`absolute right-0 bottom-0 h-[72%] w-[66%] ${lead === 'right' ? front : ''}`}
        radius={corners.image}
        src={b}
      />
    </div>
  )
}

/**
 * A row of images running off both edges, with the middle ones whole. As drawn,
 * the cards step up and down: the edge and centre cards sit 64px lower than the
 * two between them (380px cards in a 444px band, so 85.6% tall).
 */
function CarouselRow({ src, corners }: { src?: string | null; corners: Corners }) {
  const widths = ['w-[5.56cqw] shrink-0', 'min-w-0 flex-1', 'min-w-0 flex-1', 'min-w-0 flex-1', 'w-[5.56cqw] shrink-0']
  return (
    <ul className="flex h-full w-full gap-[1.39cqw]">
      {widths.map((width, i) => (
        <li key={i} className={`h-[85.6%] ${width} ${i % 2 ? 'self-start' : 'self-end'}`}>
          <ImageBlock className="h-full w-full" radius={corners.image} src={src} />
        </li>
      ))}
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
  corners,
  paging,
}: {
  spec: Spec
  content?: SectionContent
  centered?: boolean
  onImage?: boolean
  corners: Corners
  /** Working paging dots, where the design has something to page. */
  paging?: ReactNode
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

      {/*
        * Every line the client types, not the three the set happens to draw.
        * It used to slice to three, so a fourth tick went into the editor and
        * nowhere else — the field asks for one per line and has to mean it.
        * Three is only what stands in while the field is empty.
        */}
      {spec.list === 'ticks' && (
        <ul className="mt-[0.6cqw] flex w-full flex-col gap-[1.2cqw]">
          {(ticks.length ? ticks : [undefined, undefined, undefined]).map((item, i) => (
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
          <EmailCapture content={content} corners={corners} />
        </div>
      ) : (
        <div className="mt-[1.5cqw] flex items-center gap-[1.5cqw]">
          <FilledButton label={content?.cta} radius={corners.button} />
          <OutlineButton label={content?.cta2} radius={corners.button} />
        </div>
      )}

      {spec.dots && <div className="mt-[1.5cqw]">{paging ?? <Dots />}</div>}
    </div>
  )
}

/** Whatever fills the media half of a split design. */
function SplitMedia({ spec, content, corners }: { spec: Spec; content?: SectionContent; corners: Corners }) {
  const image = content?.image ?? null
  const second = content?.image2 ?? image

  if (spec.media === 'form') {
    // 450 wide and 48 clear of the row's own inset, which is where both sets
    // draw it: a percentage would hand it the frame's half instead, and at that
    // width the consent line stops wrapping to the two the sets draw.
    return <FormCard content={content} className="mr-[3.33cqw] w-[31.25cqw] shrink-0" corners={corners} />
  }

  if (spec.media === 'pair') {
    // Both paired splits put the front image at the bottom right, whichever
    // side of the copy the pair sits on.
    return (
      <div className="h-[80%] w-1/2 shrink-0">
        <PairSquares a={image} b={second} lead="right" corners={corners} />
      </div>
    )
  }

  // A bleeding image stays squared against the edge it runs into whatever the
  // section is set to — the corners a radius would round are off the frame.
  // Said through the prop rather than a class, so it doesn't have to out-rank
  // the default in a list Tailwind emits alphabetically.
  return (
    <ImageBlock
      className={spec.bleed ? 'h-full w-1/2 shrink-0 border-0' : 'h-[74%] w-1/2 shrink-0'}
      radius={spec.bleed ? 'rounded-none' : corners.image}
      src={image}
    />
  )
}

/** Miniature of what the hero will look like on the page. */
/** How long each background picture holds before the next slides in. */
const SLIDE_DELAY = 5000

/**
 * Autoplay for the background slider.
 *
 * `waitForTransition: false` for the same reason the logo strip sets it: the
 * timer restarts as a move begins rather than on a `transitionend` that has
 * been seen not to arrive, and a background that stops cycling is a bug nobody
 * reports because it just looks like a still photograph.
 */
const SLIDE_AUTOPLAY = {
  delay: SLIDE_DELAY,
  disableOnInteraction: false,
  waitForTransition: false,
} as const

/**
 * V23 and V24: copy over a full-bleed photograph, which the set draws with
 * paging dots under the buttons — so the photograph is a slideshow.
 *
 * One slide in view, one at a time, no arrows, and the dots the set draws are
 * the pagination: 16 filled in the lighter green for where you are, 15 hollow
 * on a pale edge for where you could go, 24 apart. Swiper's own pagination is
 * styled in fixed pixels, which would be the one thing in the preview not
 * sized against the container, so the dots stay ours and drive the instance
 * through `slideToLoop`.
 *
 * Its own component because it holds state, and the branch it replaced sat
 * inside `HeroPreview` where a hook can't go.
 */
function BackgroundHero({
  spec,
  content,
  corners,
}: {
  spec: Spec
  content?: SectionContent
  corners: Corners
}) {
  const centered = spec.align === 'center'

  // Blank rows are someone part-way through adding a picture in the editor;
  // the single hero image stands in if the list is emptied altogether.
  const slides = linesOf(content?.slides)
  const pictures = slides.length ? slides : [content?.image ?? null]

  const mode = usePreviewMode()
  // The codebase's rule for every carousel: nothing moves outside the page
  // view, where fourteen quietly animating thumbnails would be a distraction.
  const live = mode === 'interactive' && pictures.length > 1

  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [index, setIndex] = useState(0)

  const paging = pictures.length > 1 && (
    <div className="flex items-center gap-[0.56cqw]">
      {pictures.map((_, i) => (
        <button
          key={i}
          type="button"
          data-role="control"
          aria-label={`Background picture ${i + 1}`}
          aria-current={i === index || undefined}
          onClick={() => swiper?.slideToLoop(i)}
          className="size-[1.11cqw] rounded-full border"
          style={
            i === index
              ? { background: 'var(--brand-dim,#82b764)', borderColor: 'var(--brand-dim,#82b764)' }
              : { background: 'transparent', borderColor: 'var(--brand-soft,#e1efd8)' }
          }
        />
      ))}
    </div>
  )

  return (
    <section aria-label="Hero" className="relative flex h-full w-full items-center">
      {/*
        * The slider is positioned by a wrapper rather than by classes on the
        * Swiper itself. `swiper/css` arrives unlayered, so its own
        * `.swiper { position: relative }` outranks any Tailwind utility — an
        * `absolute inset-0` on the instance is silently ignored and the
        * slider shrinks to its content, 674 of the 1440 it should fill.
        */}
      <div className="absolute inset-0">
        <Swiper
          className="size-full"
          modules={[Autoplay]}
          slidesPerView={1}
          loop={pictures.length > 1}
          allowTouchMove={mode === 'interactive'}
          autoplay={live ? SLIDE_AUTOPLAY : false}
          onSwiper={(instance) => {
            setSwiper(instance)
            // Read once here rather than through state: the setting doesn't
            // change under us, and stopping the instance beats re-creating it
            // with a different `autoplay` param.
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) instance.autoplay?.stop()
          }}
          onSlideChange={(instance) => setIndex(instance.realIndex)}
        >
          {pictures.map((src, i) => (
            <SwiperSlide key={i} className="h-full">
              <ImageBlock className="size-full border-0" radius="rounded-none" src={src} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Scrim, so the type stays readable whatever the photo is. */}
      <span aria-hidden="true" className="absolute inset-0 z-10 bg-black/45" />

      <div className={`relative z-20 flex w-full px-[6cqw] ${centered ? 'justify-center' : ''}`}>
        <div className={centered ? 'w-[70%]' : 'w-[58%]'}>
          <Copy
            spec={spec}
            content={content}
            centered={centered}
            onImage
            corners={corners}
            paging={paging || undefined}
          />
        </div>
      </div>
    </section>
  )
}

export default function HeroPreview({
  design,
  buttonRadius = 'subtle',
  imageRadius = 'subtle',
  content,
}: {
  design: HeroDesign
  buttonRadius?: string
  imageRadius?: string
  content?: SectionContent
}) {
  const spec = SPECS[design] ?? SPECS.v1
  const image = content?.image ?? null
  const second = content?.image2 ?? image
  const corners: Corners = {
    button: BUTTON_RADII[buttonRadius] ?? BUTTON_RADII.subtle,
    image: IMAGE_RADII[imageRadius] ?? IMAGE_RADII.subtle,
  }

  if (spec.frame === 'background') {
    return <BackgroundHero spec={spec} content={content} corners={corners} />
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
              <Copy spec={spec} content={content} centered corners={corners} />
            </div>
          </div>
          <div className="mt-[-16%] flex h-[46%] shrink-0 justify-center px-[8cqw]">
            <ImageBlock
              className="h-full w-full shadow-[0_2cqw_5cqw_rgba(0,0,0,0.12)]"
              radius={corners.image}
              src={image}
            />
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
          <Copy spec={spec} content={content} centered corners={corners} />
        </div>

        {spec.media === 'single' && (
          <ImageBlock
            className={`w-full min-h-0 flex-1 ${spec.bleed ? 'border-x-0 border-b-0' : ''}`}
            radius={spec.bleed ? 'rounded-none' : corners.image}
            src={image}
          />
        )}

        {spec.media === 'pair' && (
          <div className="relative block min-h-0 w-full flex-1">
            <ImageBlock
              className={`absolute top-0 left-0 h-[80%] w-[54%] ${
                spec.lead === 'left' ? 'z-10 shadow-[0_2cqw_4cqw_rgba(0,0,0,0.10)]' : ''
              }`}
              radius={corners.image}
              src={image}
            />
            <ImageBlock
              className={`absolute right-0 bottom-0 h-[80%] w-[54%] ${
                spec.lead === 'right' ? 'z-10 shadow-[0_2cqw_4cqw_rgba(0,0,0,0.10)]' : ''
              }`}
              radius={corners.image}
              src={second}
            />
          </div>
        )}

        {/* Capped rather than filling, so the cards stay landscape: our
            wireframe type is smaller than the drawn design's, and the slack it
            leaves would otherwise stretch them into portraits. The row bleeds
            out through the side padding so the edge cards are cut by the frame. */}
        {spec.media === 'carousel' && (
          <div className="-mx-[5cqw] max-h-[30cqw] min-h-0 flex-1 self-stretch">
            <CarouselRow src={image} corners={corners} />
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
      {mediaFirst && <SplitMedia spec={spec} content={content} corners={corners} />}
      <div className={`min-w-0 flex-1 ${copyPad}`}>
        <Copy spec={spec} content={content} corners={corners} />
      </div>
      {!mediaFirst && <SplitMedia spec={spec} content={content} corners={corners} />}
    </section>
  )
}

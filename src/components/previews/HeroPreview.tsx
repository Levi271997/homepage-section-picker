import { BodyLine, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'
import type { SiteContent } from '@/lib/siteProfile'

export type HeroLayout = 'centered' | 'image-left' | 'image-right'

function Copy({ centered, content }: { centered?: boolean; content?: SiteContent }) {
  const hero = content?.hero
  const brand = content?.brand.primary ?? undefined

  // With the client's own copy there's one headline, not two placeholder bars.
  if (hero?.headline) {
    return (
      <div className={`flex flex-col gap-[1.6cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
        <HeadlineLine text={hero.headline} />
        {hero.subcopy && <BodyLine className={centered ? 'w-[85%]' : 'w-full'} text={hero.subcopy} />}
        <span className="mt-[1.5cqw] flex items-center gap-[1.5cqw]">
          <FilledButton label={hero.ctaLabel} color={brand} />
          <OutlineButton color={brand} />
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-[2cqw] ${centered ? 'items-center' : 'items-start'}`}>
      <HeadlineLine className="w-4/5" />
      <HeadlineLine className={centered ? 'w-2/5' : 'w-3/5'} />
      <BodyLine className="mt-[1cqw] w-full" />
      <BodyLine className={centered ? 'w-1/2' : 'w-3/4'} />
      <span className="mt-[1.5cqw] flex gap-[1.5cqw]">
        <FilledButton color={brand} />
        <OutlineButton color={brand} />
      </span>
    </div>
  )
}

/** Miniature of what the hero will look like on the page. */
export default function HeroPreview({ layout, content }: { layout: HeroLayout; content?: SiteContent }) {
  const image = content?.hero.imageUrl ?? null

  if (layout === 'centered') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-[4cqw] p-[4cqw]">
        <div className="w-4/5">
          <Copy centered content={content} />
        </div>
        <ImageBlock className="h-[42%] w-full" src={image} />
      </div>
    )
  }

  const imageFirst = layout === 'image-left'

  return (
    <div className="flex h-full items-center gap-[4cqw] p-[4cqw]">
      {imageFirst && <ImageBlock className="h-[70%] w-1/2 shrink-0" src={image} />}
      <div className="min-w-0 flex-1">
        <Copy content={content} />
      </div>
      {!imageFirst && <ImageBlock className="h-[70%] w-1/2 shrink-0" src={image} />}
    </div>
  )
}

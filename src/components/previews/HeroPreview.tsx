import { BodyLine, Eyebrow, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'
import type { SectionContent } from '@/lib/content'

export type HeroLayout = 'centered' | 'image-left' | 'image-right'

function Copy({ centered, content }: { centered?: boolean; content?: SectionContent }) {
  return (
    <div className={`flex flex-col gap-[1.6cqw] ${centered ? 'items-center text-center' : 'items-start'}`}>
      {content?.eyebrow && <Eyebrow text={content.eyebrow} />}
      <HeadlineLine className="w-full" text={content?.heading} />
      <BodyLine className={centered ? 'w-[85%]' : 'w-full'} text={content?.body} />
      <span className="mt-[1.5cqw] flex items-center gap-[1.5cqw]">
        <FilledButton label={content?.cta} />
        <OutlineButton label={content?.cta2} />
      </span>
    </div>
  )
}

/** Miniature of what the hero will look like on the page. */
export default function HeroPreview({ layout, content }: { layout: HeroLayout; content?: SectionContent }) {
  const image = content?.image ?? null

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

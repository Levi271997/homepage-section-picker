import { BodyLine, FilledButton, HeadlineLine, ImageBlock, OutlineButton } from '@/components/previews/parts'

export type HeroLayout = 'centered' | 'image-left' | 'image-right'

function Copy({ centered }: { centered?: boolean }) {
  return (
    <div className={`flex flex-col gap-[2cqw] ${centered ? 'items-center' : 'items-start'}`}>
      <HeadlineLine className="w-4/5" />
      <HeadlineLine className={centered ? 'w-2/5' : 'w-3/5'} />
      <BodyLine className="mt-[1cqw] w-full" />
      <BodyLine className={centered ? 'w-1/2' : 'w-3/4'} />
      <span className="mt-[1.5cqw] flex gap-[1.5cqw]">
        <FilledButton />
        <OutlineButton />
      </span>
    </div>
  )
}

/** Miniature of what the hero will look like on the page. */
export default function HeroPreview({ layout }: { layout: HeroLayout }) {
  if (layout === 'centered') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-[4cqw] p-[4cqw]">
        <div className="w-4/5">
          <Copy centered />
        </div>
        <ImageBlock className="h-[42%] w-full" />
      </div>
    )
  }

  const imageFirst = layout === 'image-left'

  return (
    <div className="flex h-full items-center gap-[4cqw] p-[4cqw]">
      {imageFirst && <ImageBlock className="h-[70%] w-1/2 shrink-0" />}
      <div className="min-w-0 flex-1">
        <Copy />
      </div>
      {!imageFirst && <ImageBlock className="h-[70%] w-1/2 shrink-0" />}
    </div>
  )
}

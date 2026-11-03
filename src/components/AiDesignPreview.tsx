'use client'

import { useEffect, useRef, useState } from 'react'
import { DESIGN_WIDTH } from '@/lib/aiDesign'
import type { AiDesign } from '@/lib/aiDesign'

type Props = {
  design: AiDesign
  onDiscard: () => void
}

/**
 * The AI-designed homepage, in browser chrome beside the live preview.
 *
 * The page is the model's own HTML, so it never shares a document with the
 * editor: it renders in an iframe with an empty `sandbox` — no scripts, no
 * same-origin access, no forms — on top of the CSP the document carries.
 *
 * It's designed at the 1440px the artboards were drawn at and scaled down to
 * fit the column, the way the wireframes scale with `cqw`, so what shows here
 * is the desktop design rather than a narrow reflow of it.
 */
export default function AiDesignPreview({ design, onDiscard }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / DESIGN_WIDTH))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const download = () => {
    const url = URL.createObjectURL(new Blob([design.html], { type: 'text/html' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${design.theme.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'ai-homepage'}.html`
    link.click()
    // Not straight away: some browsers start the download after the click returns.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const { colors } = design.theme
  const swatches = [colors.primary, colors.accent, colors.background, colors.surface, colors.text]

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-ink">
            AI design <span className="text-ink-muted">&mdash; {design.theme.name}</span>
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-muted">
            <span className="flex" aria-hidden="true">
              {swatches.map((colour, i) => (
                <span
                  key={i}
                  className="-ml-0.5 size-3 rounded-full border border-hairline first:ml-0"
                  style={{ background: colour }}
                />
              ))}
            </span>
            <span className="truncate">
              {design.theme.headingFont} &amp; {design.theme.bodyFont}
            </span>
          </p>
        </div>
        <span className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={download}
            className="rounded-lg border border-hairline bg-card px-2.5 py-1 text-xs text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
          >
            Download HTML
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-lg border border-hairline bg-card px-2.5 py-1 text-xs text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
          >
            Discard
          </button>
        </span>
      </div>

      {design.missing.length > 0 && (
        <p className="text-xs text-ink-muted">
          Left out because the model didn&rsquo;t return them: {design.missing.join(', ')}. Generate again to retry.
        </p>
      )}

      <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-hairline" />
            <span className="size-2.5 rounded-full bg-hairline" />
            <span className="size-2.5 rounded-full bg-hairline" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-md bg-row px-2.5 py-1 text-xs text-ink-faint">
            AI-designed homepage
          </span>
        </div>
        <div ref={box} className="relative h-[70vh] overflow-hidden bg-white">
          <iframe
            srcDoc={design.html}
            sandbox=""
            title="AI-designed homepage"
            className="absolute top-0 left-0 origin-top-left border-0"
            // Laid out at full design width and shrunk to the column, so the
            // frame's height is the box's divided by the same factor.
            style={{ width: DESIGN_WIDTH, height: `${100 / scale}%`, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  )
}

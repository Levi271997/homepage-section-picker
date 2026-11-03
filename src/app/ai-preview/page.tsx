'use client'

import { useEffect, useState } from 'react'
import { AiDesignFrame, downloadAiDesign } from '@/components/AiDesignPreview'
import { readAiDesign, subscribeToAiDesign } from '@/lib/aiDesign'
import type { AiDesign } from '@/lib/aiDesign'

/**
 * The AI-designed homepage in its own tab, filling the window.
 *
 * It holds no state: it renders whatever the editor last generated, and
 * follows along when the editor generates again or discards it.
 */
export default function AiPreviewTab() {
  // Read on mount rather than during render — localStorage doesn't exist on
  // the server, and this route is prerendered like every other.
  const [design, setDesign] = useState<AiDesign | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setDesign(readAiDesign())
    setReady(true)
    return subscribeToAiDesign(setDesign)
  }, [])

  useEffect(() => {
    // The router writes the layout's metadata title into the head on its own
    // schedule, sometimes after this effect has run, so the tab keeps putting
    // its own back rather than racing it once.
    const title = design ? `${design.theme.name} — AI design` : 'AI design'
    const apply = () => {
      if (document.title !== title) document.title = title
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.head, { subtree: true, childList: true, characterData: true })
    return () => observer.disconnect()
  }, [design])

  if (!ready) return <main className="min-h-screen bg-canvas" />

  if (!design) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas p-8">
        <p className="max-w-sm text-center text-sm text-ink-muted">
          No AI design yet. Use <strong className="text-ink">Generate with AI</strong> in the editor, then open it
          here with <strong className="text-ink">New tab</strong>.
        </p>
      </main>
    )
  }

  return (
    // A fixed height, so the frame fills the window and the page scrolls inside it.
    <div className="flex h-screen flex-col bg-canvas">
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline bg-card px-4 py-2">
        <span className="text-sm font-medium text-ink">{design.theme.name}</span>
        <span className="truncate text-sm text-ink-muted">
          AI design &middot; {design.theme.headingFont} &amp; {design.theme.bodyFont}
        </span>
        <span className="ml-auto shrink-0 text-xs text-ink-faint">Updates when you generate again</span>
        <button
          type="button"
          onClick={() => downloadAiDesign(design)}
          className="shrink-0 rounded-lg border border-hairline bg-card px-3 py-1.5 text-sm text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
        >
          Download HTML
        </button>
      </div>
      <AiDesignFrame html={design.html} className="min-h-0 flex-1" />
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import PageBody from '@/components/PageBody'
import { readPage, subscribeToPage } from '@/lib/share'
import type { SharedPage } from '@/lib/share'

/**
 * The shapes the window holds up while it works out what to draw.
 *
 * Whole sections rather than a spinner, at the ratios the artboards are drawn
 * at: a header strip, a tall opening, then bands. It isn't the real page —
 * this document can't know what that is yet — it just holds the space so the
 * window reads as a site loading rather than as a window that failed to open.
 */
const SKELETON = ['aspect-16/3', 'aspect-[1440/613]', 'aspect-[1440/648]', 'aspect-[1440/613]', 'aspect-[1440/648]']

/** The bars inside a band, standing in for an eyebrow, a heading and a line of copy. */
const BARS = ['h-2 w-[16%]', 'h-6 w-[40%]', 'h-3 w-[52%]']

/**
 * What the window paints before it knows anything.
 *
 * This route prerenders to nothing useful — the page lives in `localStorage`,
 * which exists only in the browser — so without this the window sits blank
 * through the whole JS download and hydration. The skeleton is in the HTML
 * itself, which means it appears as soon as the document does, before a line
 * of script has run.
 */
function Skeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas" role="status" aria-label="Loading your homepage">
      {/* The same slim bar the real window opens with, so nothing jumps when
          the page arrives and takes its place. */}
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline bg-card px-4 py-2">
        <span className="h-4 w-40 rounded bg-row-hover" />
        <span className="h-4 w-20 rounded bg-row" />
        <span className="ml-auto h-4 w-28 rounded bg-row" />
      </div>

      <div className="flex-1 bg-white" aria-hidden="true">
        {SKELETON.map((aspect, i) => (
          <div
            key={i}
            className={`skeleton-band ${aspect} flex w-full flex-col items-center justify-center gap-4 border-b border-neutral-200/80`}
          >
            {/* The first band is the site header — a bar, not a block of copy. */}
            {i === 0 ? (
              <span className="h-3 w-[70%] rounded-full bg-neutral-300/70" />
            ) : (
              BARS.map((bar) => <span key={bar} className={`${bar} rounded-full bg-neutral-300/70`} />)
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The finished homepage in its own window — what "Build my homepage" and the
 * preview's "New window" both open.
 *
 * Full width rather than the capped column the in-app view uses, so it reads as
 * the site itself rather than as a preview of one. It holds no state: it
 * renders whatever the editing window last published and re-renders as that
 * changes, so a choice made next door lands here immediately.
 */
export default function PreviewWindow() {
  // Read on mount rather than during render — localStorage doesn't exist on
  // the server, and this route is prerendered like every other.
  const [page, setPage] = useState<SharedPage | null>(null)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPage(readPage())
    setReady(true)
    return subscribeToPage(setPage)
  }, [])

  const domain = page?.address?.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '') ?? ''

  useEffect(() => {
    document.title = domain || 'Your homepage'
  }, [domain])

  const copySpec = async () => {
    if (!page?.spec) return
    try {
      await navigator.clipboard.writeText(page.spec)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be refused; the button simply doesn't confirm.
    }
  }

  // Not `null`: this is what the server prerenders and what the browser paints
  // first, so returning nothing here is what leaves the window blank.
  if (!ready) return <Skeleton />

  if (!page || page.ids.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas p-8">
        <p className="max-w-sm text-center text-sm text-ink-muted">
          Nothing to show yet. Open this window with <strong className="text-ink">Build my homepage</strong>, and keep
          the editing window open beside it.
        </p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* One slim bar, so the page below can be the whole width of the window. */}
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline bg-card px-4 py-2">
        <span className="text-sm font-medium text-ink">{domain || 'Your homepage'}</span>
        <span className="text-sm text-ink-muted">
          {page.ids.length} section{page.ids.length === 1 ? '' : 's'}
        </span>
        <span className="ml-auto text-xs text-ink-faint">Updates as you edit</span>
        {page.spec && (
          <button
            type="button"
            onClick={copySpec}
            className="rounded-lg border border-hairline bg-card px-3 py-1.5 text-sm text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
          >
            {copied ? 'Copied' : 'Copy the spec'}
          </button>
        )}
      </div>

      <PageBody
        ids={page.ids}
        layouts={page.layouts}
        contentStore={page.contentStore}
        brandStyle={page.brand as CSSProperties | undefined}
        className="flex-1"
        width="full"
      />
    </div>
  )
}

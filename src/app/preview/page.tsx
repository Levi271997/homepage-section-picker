'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import PageBody from '@/components/PageBody'
import { readPage, subscribeToPage } from '@/lib/share'
import type { SharedPage } from '@/lib/share'

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

  if (!ready) return null

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

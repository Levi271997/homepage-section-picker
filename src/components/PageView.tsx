'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import PageBody from '@/components/PageBody'
import { Icon } from '@/components/icons'
import type { Choice } from '@/lib/sections'
import type { SectionContent } from '@/lib/content'

type Props = {
  ids: string[]
  layouts: Record<string, Choice>
  contentStore: Record<string, SectionContent>
  /** Brand custom properties, so the page carries the client's colours. */
  brandStyle?: CSSProperties
  /** Shown in the header bar; falls back to a placeholder domain. */
  address?: string
  /** The one-line summary of the build, for the clipboard. */
  spec: string
  onClose: () => void
}

/**
 * The assembled homepage over the whole screen — what "Build my homepage"
 * opens. The page itself is [PageBody]; this adds the bar across the top and
 * the behaviour of being a dialog.
 */
export default function PageView({
  ids,
  layouts,
  contentStore,
  brandStyle,
  address = '',
  spec,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false)

  // Escape closes, and the page behind shouldn't scroll while this is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const copySpec = async () => {
    try {
      await navigator.clipboard.writeText(spec)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be refused; the button simply doesn't confirm.
    }
  }

  const domain = address.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '')

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your homepage"
      className="fixed inset-0 z-50 flex flex-col bg-canvas"
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline bg-card px-4 py-3">
        <span className="text-sm font-medium text-ink">{domain || 'Your homepage'}</span>
        <span className="text-sm text-ink-muted">
          {ids.length} section{ids.length === 1 ? '' : 's'}
        </span>

        <span className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={copySpec}
            className="rounded-lg border border-hairline bg-card px-3 py-1.5 text-sm text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
          >
            {copied ? 'Copied' : 'Copy the spec'}
          </button>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="flex items-center gap-1.5 rounded-lg bg-go px-3 py-1.5 text-sm font-medium text-go-ink transition-colors hover:bg-go-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-go-ink"
          >
            <Icon name="chevron" className="size-3.5 rotate-90" />
            Back to editing
          </button>
        </span>
      </div>

      {/* Everything below this point behaves rather than just being looked at. */}
      <PageBody
        ids={ids}
        layouts={layouts}
        contentStore={contentStore}
        brandStyle={brandStyle}
        className="flex-1"
      />
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import SectionPreview from '@/components/previews/SectionPreview'
import { PreviewFrame } from '@/components/previews/parts'
import { aspectFor } from '@/components/previews/aspect'
import { PreviewModeProvider } from '@/components/previews/mode'
import { Icon } from '@/components/icons'
import { byId, choiceOf } from '@/lib/sections'
import { contentOf } from '@/lib/content'
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
 * The assembled homepage at full width — what "Build my homepage" opens.
 *
 * The same preview components the sidebar uses, given a page-sized container.
 * Because every miniature is sized in `cqw`, widening the frame scales the
 * whole thing: nothing here knows it's being rendered larger.
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
  const sections = useRef(new Map<number, HTMLDivElement>())
  const scroller = useRef<HTMLDivElement>(null)

  const scrollTo = (index: number) => {
    if (index <= 0) {
      scroller.current?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    sections.current.get(index)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /**
   * Clicks are handled here rather than in each preview, so the sections stay
   * presentational: they mark what a thing *is* with `data-role`, and the page
   * view decides what that means.
   */
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement

    // A nav item goes to the section at its position; the first goes to the top.
    const nav = target.closest('[data-nav-index]')
    if (nav) {
      scrollTo(Number(nav.getAttribute('data-nav-index')))
      return
    }

    // Every other button behaves like a call to action: go to the contact form,
    // or the end of the page when there isn't one.
    if (target.closest('[data-role="button"]')) {
      const contact = ids.indexOf('contact-form')
      scrollTo(contact === -1 ? ids.length - 1 : contact)
    }
  }

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
      className="page-view fixed inset-0 z-50 flex flex-col bg-canvas"
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
      <PreviewModeProvider value="interactive">
      <div ref={scroller} className="flex-1 overflow-y-auto" style={brandStyle}>
        {/* A page-width column, so sections render at the proportions they'd have on a real site. */}
        <div onClick={onClick} className="mx-auto w-full max-w-300 bg-white shadow-2xl shadow-black/40">
          {ids.map((id, index) => {
            const section = byId(id)
            const choice = choiceOf(section, layouts)
            // The header's dropdown has to escape its frame and sit above what follows.
            const isHeader = id === 'site-header'
            return (
              <div
                key={id}
                ref={(el) => {
                  if (el) sections.current.set(index, el)
                  else sections.current.delete(index)
                }}
                className={isHeader ? 'relative z-10' : undefined}
              >
                <PreviewFrame aspect={aspectFor(id, choice)} clip={!isHeader}>
                  <SectionPreview sectionId={id} choice={choice} content={contentOf(id, contentStore)} />
                </PreviewFrame>
              </div>
            )
          })}
        </div>
      </div>
      </PreviewModeProvider>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import SectionPreview from '@/components/previews/SectionPreview'
import { PreviewFrame } from '@/components/previews/parts'
import { aspectFor } from '@/components/previews/aspect'
import { Icon } from '@/components/icons'
import { byId, choiceOf } from '@/lib/sections'
import type { Choice } from '@/lib/sections'
import { contentOf } from "@/lib/content"
import type { SectionContent } from "@/lib/content"

type Props = {
  ids: string[]
  layouts: Record<string, Choice>
  /** The section whose options are open — highlighted and scrolled to. */
  activeId: string | null
  /** Shown in the address bar; falls back to a placeholder domain. */
  address?: string
  /** The client's existing site, once analysed — previews render their content. */
  contentStore?: Record<string, SectionContent>
  /** Opens the same page in its own window. Omitted where that isn't offered. */
  onOpenWindow?: () => void
}

/** Bare domain for the address bar — no scheme, no trailing slash. */
const tidy = (address: string) => address.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '')

/** The whole homepage, assembled from the current order and layout choices. */
export default function PagePreview({
  ids,
  layouts,
  activeId,
  address = '',
  contentStore = {},
  onOpenWindow,
}: Props) {
  const rows = useRef(new Map<string, HTMLDivElement>())

  // Bring whatever is being edited into view, so the effect of a choice is visible.
  useEffect(() => {
    if (!activeId) return
    rows.current.get(activeId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeId])

  return (
    <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-2xl shadow-black/40 lg:max-h-[calc(100vh-4rem)]">
      {/* Browser chrome, so the stack reads as a page rather than a list. */}
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-hairline" />
          <span className="size-2.5 rounded-full bg-hairline" />
          <span className="size-2.5 rounded-full bg-hairline" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-md bg-row px-2.5 py-1 text-xs text-ink-faint">
          {tidy(address) || 'yoursite.com'}
        </span>
        <span className="text-xs text-ink-muted">Live preview</span>
        {onOpenWindow && (
          <button
            type="button"
            onClick={onOpenWindow}
            title="Open the page in its own window, which follows along as you edit"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline bg-card px-2.5 py-1 text-xs text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
          >
            <Icon name="external" className="size-3.5" />
            New window
          </button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto bg-white lg:max-h-none lg:flex-1">
        {ids.map((id) => {
          const section = byId(id)
          const choice = choiceOf(section, layouts)
          const active = activeId === id
          return (
            <div
              key={id}
              ref={(el) => {
                if (el) rows.current.set(id, el)
                else rows.current.delete(id)
              }}
              className="group/section relative"
            >
              <PreviewFrame aspect={aspectFor(id, choice)} decorative>
                <SectionPreview sectionId={id} choice={choice} content={contentOf(id, contentStore)} />
              </PreviewFrame>

              {/* Ring and label on the section currently being edited. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity ${
                  active ? 'opacity-100' : 'opacity-0 group-hover/section:opacity-100'
                }`}
              >
                <span
                  className={`absolute inset-0 border-2 ${active ? 'border-badge-ink' : 'border-badge-ink/30'}`}
                />
                <span className="absolute top-0 left-0 bg-badge-ink px-2 py-0.5 text-xs font-medium text-badge">
                  {section.label}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

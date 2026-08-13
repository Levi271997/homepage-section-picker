'use client'

import { useEffect, useRef } from 'react'
import SectionPreview from '@/components/previews/SectionPreview'
import { PreviewFrame } from '@/components/previews/parts'
import { byId, choiceOf } from '@/lib/sections'
import type { Choice } from '@/lib/sections'

/**
 * Roughly how tall each section stands relative to its width, so the stack
 * reads like a page rather than a run of identical panels. Sections that carry
 * a full block of content keep the 16:10 the thumbnails use.
 */
function aspectFor(id: string, choice: Choice) {
  switch (id) {
    case 'site-header':
      return 'aspect-16/5'
    case 'logo-strip':
      return choice.layout === 'carousel' ? 'aspect-16/4' : 'aspect-16/7'
    case 'stats':
      return choice.header === 'none' ? 'aspect-16/5' : 'aspect-16/9'
    case 'cta':
      return choice.layout === 'banner' ? 'aspect-16/6' : 'aspect-16/9'
    case 'site-footer':
      return choice.layout === 'bar' || choice.layout === 'logo-only' ? 'aspect-16/4' : 'aspect-16/8'
    default:
      return 'aspect-16/10'
  }
}

type Props = {
  ids: string[]
  layouts: Record<string, Choice>
  /** The section whose options are open — highlighted and scrolled to. */
  activeId: string | null
  /** Shown in the address bar; falls back to a placeholder domain. */
  address?: string
}

/** Bare domain for the address bar — no scheme, no trailing slash. */
const tidy = (address: string) => address.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '')

/** The whole homepage, assembled from the current order and layout choices. */
export default function PagePreview({ ids, layouts, activeId, address = '' }: Props) {
  const rows = useRef(new Map<string, HTMLDivElement>())

  // Bring whatever is being edited into view, so the effect of a choice is visible.
  useEffect(() => {
    if (!activeId) return
    rows.current.get(activeId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeId])

  return (
    <div className="flex min-w-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-2xl shadow-black/40 lg:sticky lg:top-8">
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
      </div>

      <div className="max-h-[60vh] overflow-y-auto bg-white lg:max-h-[calc(100vh-9rem)]">
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
              <PreviewFrame aspect={aspectFor(id, choice)}>
                <SectionPreview sectionId={id} choice={choice} />
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

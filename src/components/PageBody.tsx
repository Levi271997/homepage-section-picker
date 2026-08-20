'use client'

import { useRef } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import SectionPreview from '@/components/previews/SectionPreview'
import { PreviewFrame } from '@/components/previews/parts'
import { aspectFor } from '@/components/previews/aspect'
import { PreviewModeProvider } from '@/components/previews/mode'
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
  /** Applied to the scrolling element, which owns its own height. */
  className?: string
  /**
   * How wide the page column runs.
   *
   * `page` caps it the way a browser window sits inside the app's dark canvas.
   * `full` lets it fill the viewport, for the window that's meant to read as
   * the real site rather than as a preview of one. Everything inside is sized
   * in `cqw`, so a wider column scales the whole page rather than reflowing it.
   */
  width?: 'page' | 'full'
}

/**
 * The assembled homepage, behaving like a website.
 *
 * Shared by the in-app view and the popped-out window so the two can't drift.
 * Every miniature is sized in `cqw`, so widening the frame scales the whole
 * thing: nothing here knows how large it's being rendered.
 */
export default function PageBody({
  ids,
  layouts,
  contentStore,
  brandStyle,
  className = '',
  width = 'page',
}: Props) {
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
   * decides what that means.
   */
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement

    // The links are real anchors so they read as links, but they point at a
    // placeholder `#` — following it would jump to the top and leave a stray
    // hash in the address bar. Mail and social links are left alone.
    const placeholder = target.closest('a[href="#"]')
    if (placeholder) event.preventDefault()

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

  return (
    <PreviewModeProvider value="interactive">
      {/* `page-view` is what globals.css hangs the behaving-like-a-website rules
          off — hover states, the nav underline, and keeping dropdowns shut until
          they're pointed at. It belongs here rather than on either caller, so
          neither can render the page without it. */}
      <div ref={scroller} className={`page-view overflow-y-auto ${className}`} style={brandStyle}>
        <div
          onClick={onClick}
          className={`mx-auto w-full bg-white ${width === 'full' ? '' : 'max-w-300 shadow-2xl shadow-black/40'}`}
        >
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
  )
}

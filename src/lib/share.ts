import type { Choice } from '@/lib/sections'
import type { SectionContent } from '@/lib/content'

/**
 * The page as one serialisable object, so a second window can render it.
 *
 * The picker's state lives in React, which a separate window can't reach, so
 * the editing window publishes to `localStorage` and the popped-out window
 * reads it and listens for changes. A `storage` event fires in every *other*
 * document on the origin, which is exactly the direction needed here — the
 * window doing the editing doesn't need telling what it just did.
 */
export type SharedPage = {
  ids: string[]
  layouts: Record<string, Choice>
  contentStore: Record<string, SectionContent>
  /** Shown in the popped-out window's title bar. */
  address: string
  /** The one-line summary of the build, for the clipboard. */
  spec: string
  /** Brand custom properties, so the colours travel with the page. */
  brand?: Record<string, string>
}

const KEY = 'homepage-section-picker:page'

/**
 * Hands the current page to any other window.
 *
 * Returns false when the write is refused — uploaded images are stored as data
 * URIs and a few large ones will exhaust the storage quota. Callers should say
 * so rather than leaving a second window quietly frozen on old content.
 */
export function publishPage(page: SharedPage): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(page))
    return true
  } catch {
    return false
  }
}

/**
 * Anything stored under our key, forced into a shape the page can render.
 *
 * What comes back is whatever was in storage — an older version of this app, a
 * half-written value, a stored quota failure. The renderer spreads `layouts`
 * and `contentStore` without checking, so a missing one would throw rather than
 * show anything; filling the gaps here keeps that a rendering concern.
 */
function coerce(value: unknown): SharedPage | null {
  if (!value || typeof value !== 'object') return null
  const page = value as Partial<SharedPage>
  if (!Array.isArray(page.ids)) return null
  return {
    ids: page.ids.filter((id): id is string => typeof id === 'string'),
    layouts: page.layouts && typeof page.layouts === 'object' ? page.layouts : {},
    contentStore: page.contentStore && typeof page.contentStore === 'object' ? page.contentStore : {},
    address: typeof page.address === 'string' ? page.address : '',
    spec: typeof page.spec === 'string' ? page.spec : '',
    brand: page.brand && typeof page.brand === 'object' ? page.brand : undefined,
  }
}

/** The last published page, or null if nothing usable has been published yet. */
export function readPage(): SharedPage | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? coerce(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

/** Calls back whenever another window publishes a new version. Returns an unsubscribe. */
export function subscribeToPage(onChange: (page: SharedPage) => void): () => void {
  const handler = (event: StorageEvent) => {
    if (event.key !== KEY || !event.newValue) return
    try {
      const page = coerce(JSON.parse(event.newValue))
      if (page) onChange(page)
    } catch {
      // A half-written or foreign value; keep showing the last good one.
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

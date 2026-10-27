'use client'

import { useState } from 'react'
import type { UIEvent } from 'react'

/**
 * Whether a scrolling element has left the top, for the sticky header to
 * compact itself (globals.css keys off `data-scrolled`).
 *
 * Two thresholds rather than one: the header gets shorter as it compacts, which
 * moves the content under it, and a single cut-off would let that movement
 * flip it straight back near the top.
 */
export function useScrolled() {
  const [scrolled, setScrolled] = useState(false)

  const onScroll = (event: UIEvent<HTMLElement>) => {
    const top = event.currentTarget.scrollTop
    setScrolled((was) => (was ? top > 4 : top > 24))
  }

  return { 'data-scrolled': scrolled || undefined, onScroll }
}

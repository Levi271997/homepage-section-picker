'use client'

import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { usePreviewMode } from '@/components/previews/mode'

/**
 * The behaviour every carousel in a preview needs: autoplay, pause on hover,
 * drag to change slide, and the class that animates a slide arriving.
 *
 * All of it is inert unless the preview is in the full-page view. Two reasons:
 * a sidebar of fourteen quietly animating thumbnails is a distraction, and the
 * thumbnails live inside draggable list rows, where a second drag gesture would
 * make reordering nearly impossible.
 */
export function useCarousel({
  slides,
  enabled = true,
  intervalMs = 3000,
}: {
  /** How many positions there are to cycle through. */
  slides: number
  /** False for a layout that shouldn't move at all. */
  enabled?: boolean
  intervalMs?: number
}) {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragX, setDragX] = useState(0)
  const drag = useRef({ startX: 0, active: false })
  const mode = usePreviewMode()

  const live = mode === 'interactive' && enabled && slides > 1

  // A manual change is in the dependencies, so clicking restarts the countdown
  // rather than leaving a half-elapsed timer to cut the new slide short.
  useEffect(() => {
    if (!live || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setInterval(() => setSlide((n) => (n + 1) % slides), intervalMs)
    return () => clearInterval(timer)
  }, [live, paused, slides, slide, intervalMs])

  const step = (direction: 1 | -1) => setSlide((n) => (n + direction + slides) % slides)

  const dragging = dragX !== 0

  /** Spread onto the element that should respond to hover and dragging. */
  const containerProps = live
    ? {
        className: 'cursor-grab touch-pan-y select-none active:cursor-grabbing',
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
        onPointerDown: (e: PointerEvent<HTMLElement>) => {
          drag.current = { startX: e.clientX, active: true }
          setPaused(true)
          e.currentTarget.setPointerCapture(e.pointerId)
        },
        onPointerMove: (e: PointerEvent<HTMLElement>) => {
          if (drag.current.active) setDragX(e.clientX - drag.current.startX)
        },
        onPointerUp: (e: PointerEvent<HTMLElement>) => {
          if (!drag.current.active) return
          const travelled = e.clientX - drag.current.startX
          drag.current.active = false
          setDragX(0)
          setPaused(false)
          // Short drags are a click or a wobble, not an intent to move on.
          if (Math.abs(travelled) > 40) step(travelled < 0 ? 1 : -1)
        },
        onPointerCancel: () => {
          drag.current.active = false
          setDragX(0)
          setPaused(false)
        },
      }
    : { className: '' }

  /**
   * Spread onto the moving content, keyed on `slide` so the animation replays.
   * Static previews get nothing: otherwise every thumbnail would animate once on
   * mount, which reads as a flicker while the list is being rearranged.
   */
  const motion = {
    className: !live || dragging ? '' : 'preview-slide-left',
    style: dragging ? { transform: `translateX(${dragX}px)` } : undefined,
  }

  return { slide, setSlide, step, live, containerProps, motion }
}

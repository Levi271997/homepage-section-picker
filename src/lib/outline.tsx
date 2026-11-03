'use client'

import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import SectionPreview from '@/components/previews/SectionPreview'
import { PreviewFrame } from '@/components/previews/parts'
import { aspectFor } from '@/components/previews/aspect'
import { byId, choiceOf } from '@/lib/sections'
import { contentOf } from '@/lib/content'
import type { Choice } from '@/lib/sections'
import type { SectionContent } from '@/lib/content'

/**
 * Each section's structure, read off its wireframe, as text a model can follow.
 *
 * The AI designer is told to keep a section's arrangement exactly and change
 * everything else, so it needs the arrangement spelled out: how many columns,
 * which side the picture is on, how many cards, which fields a form has. The
 * wireframes already know all of that for every design, so rather than write
 * a second description of each one by hand — which would drift from the
 * previews the first time a design changed — the sections are rendered
 * off-screen at the 1440px the artboards were drawn at and measured.
 */

/** The artboard width every design was exported at, so the measurements read as the design file does. */
const ARTBOARD = 1440

/** Plenty for the busiest footer, and a ceiling on what one section can cost in prompt. */
const MAX_CHARS = 9000

/** Tags whose name says something about structure, kept in the outline rather than called a group. */
const SEMANTIC = new Set([
  'header', 'nav', 'footer', 'section', 'main', 'aside', 'article', 'ul', 'ol', 'li', 'form', 'fieldset',
  'details', 'summary', 'blockquote', 'figure', 'figcaption', 'dl', 'dt', 'dd',
])

/** Elements that are always one thing, however they're built inside. */
const ACTIONS = new Set(['a', 'button'])
const FIELDS = new Set(['input', 'textarea', 'select'])

const round = (n: number) => Math.round(n * 10) / 10

const quote = (text: string) => JSON.stringify(text.replace(/\s+/g, ' ').trim().slice(0, 140))

const visible = (el: Element, frame: DOMRect) => {
  const style = getComputedStyle(el)
  if (style.display === 'none' || style.visibility === 'hidden') return false
  const r = el.getBoundingClientRect()
  if (r.width < 1 || r.height < 1) return false
  // Carousel slides waiting off the edge are clipped by the frame and aren't part of what's drawn.
  return r.right > frame.left + 1 && r.left < frame.right - 1 && r.bottom > frame.top + 1 && r.top < frame.bottom - 1
}

/** Where a box sits, in percent of the section's width — the same unit the previews are drawn in. */
const boxOf = (el: Element, frame: DOMRect) => {
  const r = el.getBoundingClientRect()
  const unit = frame.width / 100
  return `[x${round((r.left - frame.left) / unit)} y${round((r.top - frame.top) / unit)} w${round(r.width / unit)} h${round(r.height / unit)}]`
}

const hasDirectText = (el: Element) =>
  Array.from(el.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())

const directText = (el: Element) =>
  Array.from(el.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? '')
    .join(' ')
    .trim()

/** A run of words with nothing structural inside it — a heading, a paragraph, a label. */
const isText = (el: Element) => {
  if (!el.textContent?.trim()) return false
  return Array.from(el.children).every((child) => {
    const tag = child.tagName.toLowerCase()
    if (tag === 'svg' || tag === 'img' || FIELDS.has(tag)) return false
    // Buttons are inline-flex, so without this a wrapper round one reads as a line of text.
    if (ACTIONS.has(tag) || child.getAttribute('data-role') === 'button') return false
    return getComputedStyle(child).display.startsWith('inline') || !child.textContent?.trim()
  })
}

/** Stands in for a photo: an `<img>`, or the checkerboard drawn as a background. */
const isPicture = (el: Element) => {
  if (el.tagName.toLowerCase() === 'img') return true
  if (el.children.length) return false
  const bg = getComputedStyle(el).backgroundImage
  return bg.includes('gradient') || bg.includes('url(')
}

/** Has a colour of its own, rather than showing the white of the frame through. */
const isFilled = (style: CSSStyleDeclaration) =>
  !['rgba(0, 0, 0, 0)', 'transparent', 'rgb(255, 255, 255)'].includes(style.backgroundColor)

const isBordered = (style: CSSStyleDeclaration) =>
  ['top', 'right', 'bottom', 'left'].some((side) => parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0)

/** A filled, bordered or raised box — a card or a panel, which a design has to keep as one. */
const isPanel = (style: CSSStyleDeclaration) => isFilled(style) || isBordered(style) || style.boxShadow !== 'none'

const layoutOf = (style: CSSStyleDeclaration) => {
  if (style.display.includes('grid')) {
    const cols = style.gridTemplateColumns.split(' ').filter((track) => track && track !== 'none').length
    return cols > 1 ? `grid ${cols} columns` : 'stack'
  }
  if (style.display.includes('flex')) {
    const row = style.flexDirection.startsWith('row')
    return `${row ? 'row' : 'column'}${style.flexWrap === 'wrap' ? ' wrapping' : ''}`
  }
  return ''
}

function walk(el: Element, frame: DOMRect, depth: number, lines: string[]) {
  if (!visible(el, frame)) return
  const tag = el.tagName.toLowerCase()
  const style = getComputedStyle(el)
  const pad = '  '.repeat(depth)
  const box = boxOf(el, frame)
  const centred = style.textAlign === 'center' ? ' centred' : style.textAlign === 'right' ? ' right-aligned' : ''

  if (tag === 'svg') {
    lines.push(`${pad}icon ${box}`)
    return
  }
  if (FIELDS.has(tag)) {
    const kind = tag === 'input' ? `input[${(el as HTMLInputElement).type}]` : tag
    const placeholder = (el as HTMLInputElement).placeholder
    lines.push(`${pad}field ${kind}${placeholder ? ` placeholder=${quote(placeholder)}` : ''} ${box}`)
    return
  }
  if (isPicture(el)) {
    lines.push(`${pad}image ${box}`)
    return
  }
  if (ACTIONS.has(tag) || el.getAttribute('data-role') === 'button') {
    const kind = el.getAttribute('data-role') === 'button' || tag === 'button' ? 'button' : 'link'
    const filled = isFilled(style) ? ' filled' : isBordered(style) ? ' outlined' : ''
    const icon = el.querySelector('svg') ? ' with icon' : ''
    const text = el.textContent?.trim()
    lines.push(`${pad}${kind}${filled}${icon}${text ? ` ${quote(text)}` : ''} ${box}`)
    return
  }
  if (isText(el)) {
    lines.push(`${pad}${/^h[1-6]$/.test(tag) ? tag : tag === 'li' ? 'li' : 'text'} ${quote(el.textContent ?? '')}${centred} ${box}`)
    return
  }

  // A menu that hangs below the frame is a dropdown, shut until it's pointed at.
  // Only its top would be measured, so it's named rather than drawn half-open.
  if ((style.position === 'absolute' || style.position === 'fixed') && el.getBoundingClientRect().bottom > frame.bottom + 1) {
    lines.push(`${pad}dropdown menu (closed until hovered — don't draw it open)`)
    return
  }

  const children = Array.from(el.children).filter((child) => visible(child, frame))
  if (!children.length) {
    // A bare block with no words: a wireframe bar, a logo placeholder, a divider.
    if (isPanel(style)) lines.push(`${pad}shape ${box}`)
    return
  }

  const semantic = SEMANTIC.has(tag) || /^h[1-6]$/.test(tag)
  const panel = isPanel(style)
  const overlay = style.position === 'absolute' || style.position === 'fixed'
  const carousel = el.classList.contains('swiper')
  const layout = layoutOf(style)

  // Wrappers that only hold one thing say nothing about structure; pass straight through them.
  if (!semantic && !panel && !overlay && !carousel && children.length === 1 && !hasDirectText(el)) {
    walk(children[0], frame, depth, lines)
    return
  }

  const words = [
    semantic ? tag : 'group',
    carousel ? 'carousel (slides sideways; the visible slides are shown)' : '',
    layout,
    panel ? 'panel' : '',
    overlay ? 'overlay' : '',
    centred.trim(),
  ].filter(Boolean)
  lines.push(`${pad}${words.join(' ')} ${box}`)
  if (hasDirectText(el)) lines.push(`${pad}  text ${quote(directText(el))}`)
  for (const child of children) walk(child, frame, depth + 1, lines)
}

/** One rendered frame, written out as an indented tree. */
function outlineFrame(frame: Element): string {
  const rect = frame.getBoundingClientRect()
  const lines = [`section, ${ARTBOARD}px wide, height ${round((rect.height / rect.width) * 100)}% of its width`]
  for (const child of Array.from(frame.children)) walk(child, rect, 1, lines)
  const text = lines.join('\n')
  return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}\n  …` : text
}

/**
 * Renders the given sections off-screen, exactly as the live preview draws
 * them, and returns each one's outline keyed by section id.
 */
export function outlineSections(
  ids: string[],
  layouts: Record<string, Choice>,
  contentStore: Record<string, SectionContent>,
): Record<string, string> {
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.inert = true
  // Off-screen rather than hidden: `visibility` and `display` would reach the
  // computed styles being read, and the measurements need a real layout.
  Object.assign(host.style, { position: 'fixed', top: '0', left: '-20000px', width: `${ARTBOARD}px`, pointerEvents: 'none' })
  document.body.appendChild(host)

  const root = createRoot(host)
  try {
    // Synchronous, so the sections are laid out by the time they're measured.
    flushSync(() => {
      root.render(
        ids.map((id) => {
          const choice = choiceOf(byId(id), layouts)
          return (
            <div key={id} data-outline={id}>
              <PreviewFrame aspect={aspectFor(id, choice)}>
                <SectionPreview sectionId={id} choice={choice} content={contentOf(id, contentStore)} />
              </PreviewFrame>
            </div>
          )
        }),
      )
    })

    const out: Record<string, string> = {}
    for (const id of ids) {
      const frame = host.querySelector(`[data-outline="${id}"] > div`)
      if (frame) out[id] = outlineFrame(frame)
    }
    return out
  } finally {
    root.unmount()
    host.remove()
  }
}

'use client'

import { useEffect, useRef, useState } from 'react'
import PagePreview from '@/components/PagePreview'
import SectionRow from '@/components/SectionRow'
import SectionMenu from '@/components/SectionMenu'
import { Icon } from '@/components/icons'
import { CATALOG, SUGGESTED_IDS, byId, choiceOf, describeChoice } from '@/lib/sections'
import type { Choice } from '@/lib/sections'

export default function SectionPicker() {
  const [ids, setIds] = useState<string[]>(SUGGESTED_IDS)
  const [layouts, setLayouts] = useState<Record<string, Choice>>({})
  const [choosingLayout, setChoosingLayout] = useState<string | null>(null)
  const [swapping, setSwapping] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [cardMenu, setCardMenu] = useState(false)
  const [built, setBuilt] = useState(false)
  const [hasSite, setHasSite] = useState<'yes' | 'no' | null>(null)
  const [siteUrl, setSiteUrl] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const closeAll = () => {
    setSwapping(null)
    setAdding(false)
    setCardMenu(false)
    setChoosingLayout(null)
  }

  // Any click outside the card, or Escape, dismisses whatever is open.
  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) closeAll()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const unused = CATALOG.filter((s) => !s.required && !ids.includes(s.id))

  /** Everything a row could become: any optional section other than itself. */
  const swapCandidates = (currentId: string) =>
    CATALOG.filter((s) => !s.required && s.id !== currentId)

  const swapFor = (index: number, nextId: string) => {
    setIds((prev) => {
      const at = prev.indexOf(nextId)
      // Not on the page yet — the row simply becomes that section.
      if (at === -1) return prev.map((id, i) => (i === index ? nextId : id))
      // Already on the page — the two rows trade places rather than duplicate.
      const next = [...prev]
      next[index] = nextId
      next[at] = prev[index]
      return next
    })
    setSwapping(null)
  }

  const remove = (id: string) => setIds((prev) => prev.filter((x) => x !== id))

  /** Reorder within the list. Pinned rows are anchors: they never move and nothing lands on them. */
  const move = (from: number, to: number) =>
    setIds((prev) => {
      if (from === to || to < 0 || to >= prev.length) return prev
      if (byId(prev[from]).pinned || byId(prev[to]).pinned) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })

  const endDrag = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  const add = (id: string) => {
    // New sections land above the pinned rows that close the page, since
    // nothing may sit below those.
    setIds((prev) => {
      let at = prev.length
      while (at > 0 && byId(prev[at - 1]).pinned) at--
      return [...prev.slice(0, at), id, ...prev.slice(at)]
    })
    setAdding(false)
  }

  return (
    <div ref={cardRef} className="flex w-full max-w-[1500px] flex-col items-start gap-6 lg:flex-row">
      {/* Left: the page as it currently stands. Right: what builds it. */}
      <PagePreview
        ids={ids}
        layouts={layouts}
        activeId={choosingLayout}
        address={hasSite === 'yes' ? siteUrl : ''}
      />

      <div className="w-full shrink-0 rounded-2xl border border-hairline bg-card p-5 shadow-2xl shadow-black/40 sm:p-6 lg:w-190">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-ink">Your homepage, as we&rsquo;d build it</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Chosen from {CATALOG.length} approved sections based on your audit. Swap anything you like.
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setSwapping(null)
              setAdding(false)
              setCardMenu((v) => !v)
            }}
            aria-label="More options"
            aria-expanded={cardMenu}
            className="-mt-1 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-row hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
          >
            <Icon name="dots" />
          </button>

          {cardMenu && (
            <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-hairline bg-row py-1 shadow-xl shadow-black/50">
              <button
                type="button"
                disabled={unused.length === 0}
                onClick={() => {
                  setCardMenu(false)
                  setAdding(true)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-row-hover disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-transparent"
              >
                <Icon name="plus" className="size-4" />
                Add a section
              </button>
              <button
                type="button"
                onClick={() => {
                  setIds(SUGGESTED_IDS)
                  setLayouts({})
                  setCardMenu(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-row-hover"
              >
                <Icon name="check" className="size-4" />
                Reset to suggested
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Asked before the sections, since an existing site changes what we carry over. */}
      <div className="mt-5 rounded-xl border border-hairline bg-row px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <span id="existing-site" className="text-sm text-ink">
            Do you have an existing website?
          </span>
          <div role="radiogroup" aria-labelledby="existing-site" className="flex gap-2">
            {(['yes', 'no'] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={hasSite === value}
                onClick={() => setHasSite(value)}
                className={`rounded-lg border px-4 py-1.5 text-sm capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink ${
                  hasSite === value
                    ? 'border-transparent bg-badge font-medium text-badge-ink'
                    : 'border-hairline bg-card text-ink hover:bg-row-hover'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {hasSite === 'yes' && (
          <div className="mt-3 border-t border-hairline pt-3">
            <label htmlFor="site-url" className="text-xs text-ink-muted">
              What&rsquo;s the address?
            </label>
            <input
              id="site-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="yoursite.com"
              className="mt-1.5 w-full rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:border-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
            />
            <p className="mt-1.5 text-xs text-ink-muted">
              We&rsquo;ll audit it first and carry over anything worth keeping.
            </p>
          </div>
        )}
      </div>

      <div className="relative mt-5">
        <ul
          onDragLeave={(e) => {
            // Only clear when the pointer actually leaves the list, not on child-to-child moves.
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverIndex(null)
          }}
          className="group/list divide-y divide-hairline overflow-hidden rounded-xl border border-hairline"
        >
          {ids.map((id, index) => {
            const section = byId(id)
            const isOver = overIndex === index && dragIndex !== null && dragIndex !== index
            return (
              <SectionRow
                key={id}
                section={section}
                index={index}
                swapOpen={swapping === id}
                choice={section.options ? choiceOf(section, layouts) : null}
                optionsOpen={choosingLayout === id}
                onToggleOptions={() => {
                  setCardMenu(false)
                  setAdding(false)
                  setSwapping(null)
                  setChoosingLayout((cur) => (cur === id ? null : id))
                }}
                // Stays open after picking so the choice can be compared against the alternatives.
                onPickOption={(groupId, optionId) =>
                  setLayouts((prev) => ({
                    ...prev,
                    [id]: { ...choiceOf(section, prev), [groupId]: optionId },
                  }))
                }
                dragging={dragIndex === index}
                dropEdge={isOver ? (dragIndex! < index ? 'below' : 'above') : null}
                onDragStart={() => {
                  closeAll()
                  setDragIndex(index)
                }}
                onDragEnter={() => {
                  if (dragIndex === null || section.pinned) return
                  setOverIndex(index)
                }}
                onDrop={() => {
                  if (dragIndex !== null) move(dragIndex, index)
                  endDrag()
                }}
                onDragEnd={endDrag}
                onNudge={(offset) => move(index, index + offset)}
                onSwap={() => {
                  setCardMenu(false)
                  setAdding(false)
                  setChoosingLayout(null)
                  setSwapping((cur) => (cur === id ? null : id))
                }}
                onRemove={() => remove(id)}
              />
            )
          })}
        </ul>

        {swapping && (
          <SectionMenu
            title="Swap for"
            options={swapCandidates(swapping)}
            emptyLabel="There's nothing else to swap in."
            layouts={layouts}
            onPage={ids}
            onPick={(nextId) => swapFor(ids.indexOf(swapping), nextId)}
            onClose={() => setSwapping(null)}
          />
        )}

        {adding && (
          <SectionMenu
            title="Add a section"
            options={unused}
            emptyLabel="Every approved section is already in use."
            layouts={layouts}
            onPick={add}
            onClose={() => setAdding(false)}
          />
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={() => setBuilt(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-go px-4 py-2.5 text-[15px] font-medium text-go-ink transition-colors hover:bg-go-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-go-ink"
        >
          Build my homepage
          <Icon name="arrow" className="size-4" />
        </button>
        <p className="text-sm text-ink-muted">
          {ids.length} section{ids.length === 1 ? '' : 's'} &middot; takes about a minute
        </p>
      </div>

      {built && (
        <p className="mt-4 rounded-lg border border-hairline bg-row px-3 py-2 text-sm text-ink-muted">
          {hasSite === 'yes' ? (
            <>Rebuilding {siteUrl.trim() || 'their existing site'}. </>
          ) : hasSite === 'no' ? (
            <>Building from scratch. </>
          ) : null}
          Sections:{' '}
          {ids
            .map((id) => {
              const section = byId(id)
              if (!section.options) return section.label
              return `${section.label} (${describeChoice(section, choiceOf(section, layouts))})`
            })
            .join(' → ')}
        </p>
      )}
      </div>
    </div>
  )
}

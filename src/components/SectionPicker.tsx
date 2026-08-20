'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import PagePreview from '@/components/PagePreview'
import PageView from '@/components/PageView'
import SectionRow from '@/components/SectionRow'
import SectionMenu from '@/components/SectionMenu'
import { Icon } from '@/components/icons'
import { CATALOG, SUGGESTED_IDS, byId, choiceOf, describeChoice } from '@/lib/sections'
import { brandVariables } from '@/lib/siteProfile'
import { asset } from '@/lib/asset'
import { publishPage } from '@/lib/share'
import { contentOf, profileToContent } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import type { Choice } from '@/lib/sections'
import type { SiteProfile } from '@/lib/siteProfile'

export default function SectionPicker() {
  const [ids, setIds] = useState<string[]>(SUGGESTED_IDS)
  const [layouts, setLayouts] = useState<Record<string, Choice>>({})
  const [choosingLayout, setChoosingLayout] = useState<string | null>(null)
  const [panelTab, setPanelTab] = useState<'layout' | 'content'>('layout')
  /** Edited words and pictures, per section. Unset fields fall back to placeholders. */
  const [contentStore, setContentStore] = useState<Record<string, SectionContent>>({})
  const [swapping, setSwapping] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [cardMenu, setCardMenu] = useState(false)
  const [built, setBuilt] = useState(false)
  const [hasSite, setHasSite] = useState<'yes' | 'no' | null>(null)
  const [siteUrl, setSiteUrl] = useState('')
  const [profile, setProfile] = useState<SiteProfile | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  /** Set when the page is too large to hand to another window. */
  const [shareFailed, setShareFailed] = useState(false)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  /** The analysed site, but only while it's relevant and was readable. */
  const activeProfile = hasSite === 'yes' && profile && !profile.error ? profile : null

  // The static GitHub Pages build has no server to run the analyser, so the
  // control is hidden there rather than offered and then failing.
  const canAnalyze = process.env.NEXT_PUBLIC_STATIC_BUILD !== 'true'

  /** The agreed build in one line — what the page view copies to the clipboard. */
  const spec = [
    hasSite === 'yes'
      ? `Rebuilding ${siteUrl.trim() || 'their existing site'}.`
      : hasSite === 'no'
        ? 'Building from scratch.'
        : '',
    'Sections: ' +
      ids
        .map((id) => {
          const section = byId(id)
          if (!section.options) return section.label
          return `${section.label} (${describeChoice(section, choiceOf(section, layouts))})`
        })
        .join(' → '),
  ]
    .filter(Boolean)
    .join(' ')

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

  const previewAddress = hasSite === 'yes' ? profile?.url || siteUrl : ''
  // Memoised because it's an effect dependency: `brandVariables` builds a fresh
  // object every call, which would republish on every render forever.
  const brand = useMemo(() => brandVariables(activeProfile), [activeProfile])

  /**
   * Hand the current page to any window opened from the preview.
   *
   * Published on every change rather than only when a window is open, so one
   * opened later starts on the current state rather than an empty page.
   */
  useEffect(() => {
    const ok = publishPage({ ids, layouts, contentStore, address: previewAddress, spec, brand })
    setShareFailed(!ok)
  }, [ids, layouts, contentStore, previewAddress, spec, brand])

  /**
   * Opens the finished page in its own window, sized to the screen so it reads
   * as a real site rather than a panel.
   *
   * Always the same named window, so clicking again brings the existing one
   * forward instead of opening a second. Returns false when the browser
   * refuses — pop-up blockers are common enough that the caller needs to know.
   */
  const openWindow = (): boolean => {
    const features = `width=${screen.availWidth},height=${screen.availHeight},left=0,top=0`
    const opened = window.open(asset('/preview/'), 'homepage-preview', features)
    opened?.focus()
    return Boolean(opened)
  }

  /**
   * "Build my homepage" shows the finished page in its own window. The
   * in-app view is the fallback for when a pop-up blocker gets in the way,
   * so the button always does something.
   */
  const build = () => {
    if (!openWindow()) setBuilt(true)
  }

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

  /** Reads the client's existing site and feeds its content into the preview. */
  const analyze = async () => {
    if (!siteUrl.trim() || analyzing) return
    setAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: siteUrl }),
      })
      const result = (await response.json()) as SiteProfile
      setProfile(result)
      // Whatever we could read overwrites the placeholders; the rest stays put,
      // and anything the client has already edited by hand is left alone.
      if (!result.error) {
        const fromSite = profileToContent(result)
        setContentStore((prev) => {
          const next = { ...prev }
          for (const [sectionId, values] of Object.entries(fromSite)) {
            next[sectionId] = { ...values, ...prev[sectionId] }
          }
          return next
        })
      }
    } catch {
      setProfile({
        url: siteUrl,
        brand: { name: null, primary: null, accent: null, logoUrl: null },
        nav: [],
        hero: { eyebrow: null, headline: null, subcopy: null, ctaLabel: null, imageUrl: null },
        detected: [],
        error: 'Couldn’t reach the analyser.',
      })
    } finally {
      setAnalyzing(false)
    }
  }

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
    <div
      ref={cardRef}
      // The client's brand colours cascade from here, so the row thumbnails and
      // the picker cards recolour along with the big preview.
      style={brand as CSSProperties | undefined}
      className="flex w-full max-w-[1500px] flex-col items-start gap-6 lg:flex-row"
    >
      {/* Left: the page as it currently stands. Right: what builds it. */}
      <div className="flex w-full min-w-0 flex-col gap-2 lg:sticky lg:top-8 lg:flex-1">
        <PagePreview
          ids={ids}
          layouts={layouts}
          activeId={choosingLayout}
          address={previewAddress}
          contentStore={contentStore}
          onOpenWindow={openWindow}
        />
        {shareFailed && (
          <p className="text-xs text-ink-muted">
            This page is now too large to hand to a second window — usually a large uploaded image. A window opened
            from here will show the last version that fitted.
          </p>
        )}
      </div>

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
            <div className="mt-1.5 flex gap-2">
              <input
                id="site-url"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canAnalyze) analyze()
                }}
                placeholder="yoursite.com"
                className="min-w-0 flex-1 rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:border-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
              />
              {canAnalyze && (
                <button
                  type="button"
                  onClick={analyze}
                  disabled={!siteUrl.trim() || analyzing}
                  className="shrink-0 rounded-lg border border-hairline bg-card px-3.5 py-2 text-sm text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-card"
                >
                  {analyzing ? 'Reading…' : 'Read my site'}
                </button>
              )}
            </div>

            {analyzing ? (
              <p className="mt-1.5 text-xs text-ink-muted">
                Fetching the page and pulling out your brand, copy and images&hellip;
              </p>
            ) : profile?.error ? (
              <p className="mt-1.5 text-xs text-ink-muted">
                Couldn&rsquo;t read it &mdash; {profile.error} The preview stays as an outline.
              </p>
            ) : profile ? (
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted">
                {profile.brand.primary && (
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full border border-hairline"
                    style={{ background: profile.brand.primary }}
                  />
                )}
                <span>
                  Using {profile.brand.name ?? 'your site'}&rsquo;s{' '}
                  {[
                    profile.brand.logoUrl && 'logo',
                    profile.brand.primary && 'colour',
                    profile.hero.headline && 'headline',
                    profile.hero.imageUrl && 'hero image',
                  ]
                    .filter(Boolean)
                    .join(', ') || 'details'}{' '}
                  in the preview.
                </span>
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-ink-muted">
                We&rsquo;ll audit it first and carry over anything worth keeping.
              </p>
            )}
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
                  // Opening a different row starts on Layout again.
                  setPanelTab('layout')
                  setChoosingLayout((cur) => (cur === id ? null : id))
                }}
                tab={panelTab}
                onTabChange={setPanelTab}
                content={contentOf(id, contentStore)}
                onEditContent={(fieldId, value) =>
                  setContentStore((prev) => ({ ...prev, [id]: { ...contentOf(id, prev), [fieldId]: value } }))
                }
                onResetContent={() =>
                  setContentStore((prev) => {
                    const next = { ...prev }
                    delete next[id]
                    return next
                  })
                }
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
          onClick={build}
          className="inline-flex items-center gap-1.5 rounded-xl bg-go px-4 py-2.5 text-[15px] font-medium text-go-ink transition-colors hover:bg-go-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-go-ink"
        >
          Build my homepage
          <Icon name="external" className="size-4" />
        </button>
        <p className="text-sm text-ink-muted">
          {ids.length} section{ids.length === 1 ? '' : 's'} &middot; takes about a minute
        </p>
      </div>

      </div>

      {built && (
        <PageView
          ids={ids}
          layouts={layouts}
          contentStore={contentStore}
          brandStyle={brand as CSSProperties | undefined}
          address={previewAddress}
          spec={spec}
          onClose={() => setBuilt(false)}
        />
      )}
    </div>
  )
}

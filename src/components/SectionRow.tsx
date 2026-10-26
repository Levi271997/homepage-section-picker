import type { DragEvent } from 'react'
import { Icon } from '@/components/icons'
import ContentEditor from '@/components/ContentEditor'
import OptionPicker from '@/components/OptionPicker'
import { fieldsOf } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import SectionPreview from '@/components/previews/SectionPreview'
import { PreviewFrame } from '@/components/previews/parts'
import { describeChoice } from '@/lib/sections'
import type { Choice, Section } from '@/lib/sections'

type Props = {
  section: Section
  index: number
  onSwap: () => void
  onRemove: () => void
  swapOpen: boolean
  /** The current selection, for sections that offer layout options. */
  choice: Choice | null
  optionsOpen: boolean
  onToggleOptions: () => void
  onPickOption: (groupId: string, optionId: string) => void
  /** The section's words and pictures, and the handlers that change them. */
  content: SectionContent
  onEditContent: (fieldId: string, value: string) => void
  onResetContent: () => void
  /** Set while this row is the one being dragged. */
  dragging: boolean
  /** 'above' | 'below' when the dragged row would land next to this one. */
  dropEdge: 'above' | 'below' | null
  onDragStart: () => void
  onDragEnter: () => void
  onDragEnd: () => void
  onDrop: () => void
  /** Keyboard reordering from the grip: -1 moves up, +1 moves down. */
  onNudge: (offset: number) => void
}

export default function SectionRow({
  section,
  index,
  onSwap,
  onRemove,
  swapOpen,
  choice,
  optionsOpen,
  onToggleOptions,
  onPickOption,
  content,
  onEditContent,
  onResetContent,
  dragging,
  dropEdge,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
  onNudge,
}: Props) {
  const movable = !section.pinned

  const handleDragStart = (e: DragEvent<HTMLLIElement>) => {
    if (!movable) return
    // Firefox only starts a drag once some data is set.
    e.dataTransfer.setData('text/plain', section.id)
    e.dataTransfer.effectAllowed = 'move'
    onDragStart()
  }

  const picker = section.options && choice && (
    <OptionPicker section={section} choice={choice} content={content} onPick={onPickOption} />
  )
  // Always built, never conditional: with no fields at all it is the one thing
  // that says so, which is better than an empty panel.
  const fields = fieldsOf(section.id, choice ?? undefined)
  const editor = (
    <ContentEditor
      sectionId={section.id}
      content={content}
      choice={choice ?? undefined}
      onChange={onEditContent}
      onReset={onResetContent}
    />
  )

  /*
   * Both at once, side by side, rather than a tab each.
   *
   * They answer different questions — how the section is arranged, and what it
   * says — and you change one to see what it does to the other. Behind tabs
   * that meant picking a layout, switching, typing, switching back to see it;
   * the option cards preview the section's real content, so the thing you were
   * checking was a tab away from the thing you were changing.
   *
   * Layout takes the wider column because it is a grid of preview cards and
   * the editor is a stack of text fields. One column when there is only one
   * pane to show, and one column on a narrow screen, where side by side would
   * leave the cards too small to read.
   */
  const panes =
    picker && fields.length ? (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6">
        <section aria-label={`${section.label} layout`} className="flex min-w-0 flex-col gap-3">
          <h4 className="text-xs font-medium tracking-wide text-ink-muted uppercase">Layout</h4>
          {picker}
        </section>
        <section
          aria-label={`${section.label} content`}
          className="flex min-w-0 flex-col gap-3 border-t border-hairline pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
        >
          <h4 className="text-xs font-medium tracking-wide text-ink-muted uppercase">Content</h4>
          {editor}
        </section>
      </div>
    ) : (
      picker || editor
    )

  return (
    <li
      draggable={movable}
      onDragStart={handleDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()} // without this the drop never fires
      onDrop={(e) => {
        e.preventDefault()
        onDrop()
      }}
      onDragEnd={onDragEnd}
      aria-grabbed={movable ? dragging : undefined}
      className={`relative bg-row ${dragging ? 'opacity-40' : ''}`}
    >
      {/* Insertion line showing where the dragged row will land. */}
      {dropEdge && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-badge-ink ${
            dropEdge === 'above' ? '-top-px' : '-bottom-px'
          }`}
        />
      )}

      <div className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-row-hover">
        {movable ? (
          <button
            type="button"
            aria-label={`Reorder ${section.label}. Use arrow up and arrow down to move.`}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
              e.preventDefault()
              onNudge(e.key === 'ArrowUp' ? -1 : 1)
            }}
            className="-ml-1.5 cursor-grab rounded-md p-1 text-ink-faint opacity-0 transition-opacity group-hover/list:opacity-100 hover:text-ink focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-badge-ink active:cursor-grabbing"
          >
            <Icon name="grip" className="size-4" />
          </button>
        ) : (
          <span aria-hidden="true" className="-ml-1.5 size-6" />
        )}

        {/* Sections with a layout show that layout; the rest show their icon. */}
        {section.options && choice ? (
          <span className="w-16 shrink-0 overflow-hidden rounded border border-hairline">
            <PreviewFrame decorative>
              <SectionPreview sectionId={section.id} choice={choice} content={content} screenshot />
            </PreviewFrame>
          </span>
        ) : (
          <span className="text-ink-faint">
            <Icon name={section.icon} />
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[15px] text-ink">{section.label}</span>
          {choice && <span className="truncate text-xs text-ink-muted">{describeChoice(section, choice)}</span>}
        </span>

        {(section.options || fieldsOf(section.id).length > 0) && (
          <button
            type="button"
            draggable={false}
            onClick={onToggleOptions}
            aria-expanded={optionsOpen}
            aria-label={`Edit the layout and content of ${section.label}`}
            className="mr-1 flex shrink-0 items-center gap-1 rounded-lg border border-hairline bg-card py-1.5 pr-2.5 pl-3.5 text-sm text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink aria-expanded:border-ink-faint"
          >
            {optionsOpen ? 'Done' : 'Change'}
            <Icon name="chevron" className={`size-3.5 transition-transform ${optionsOpen ? 'rotate-180' : ''}`} />
          </button>
        )}

        {section.required ? (
          <span className="shrink-0 rounded-full bg-badge px-2.5 py-0.5 text-xs font-medium text-badge-ink">
            required
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              draggable={false}
              onClick={onSwap}
              aria-expanded={swapOpen}
              aria-label={`Swap ${section.label}`}
              className="rounded-lg border border-hairline bg-card px-3.5 py-1.5 text-sm text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink aria-expanded:border-ink-faint"
            >
              Swap
            </button>
            <button
              type="button"
              draggable={false}
              onClick={onRemove}
              aria-label={`Remove ${section.label}`}
              className="rounded-lg border border-hairline bg-card px-3.5 py-1.5 text-sm text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
            >
              Remove
            </button>
          </span>
        )}
      </div>

      {/* Layout and content expand in place — the list above and below stays put. */}
      {optionsOpen && (
        <div className="border-t border-hairline bg-card/60 px-4 py-4">{panes}</div>
      )}

      <span className="sr-only">Position {index + 1}</span>
    </li>
  )
}

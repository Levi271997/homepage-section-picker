import { Icon } from '@/components/icons'
import SectionPreview from '@/components/previews/SectionPreview'
import { PreviewFrame } from '@/components/previews/parts'
import { choiceOf, describeChoice } from '@/lib/sections'
import type { Choice, Section } from '@/lib/sections'

type Props = {
  title: string
  options: Section[]
  emptyLabel: string
  /** Layouts picked so far, so a section returning to the list previews as it was left. */
  layouts: Record<string, Choice>
  /** Sections already in the list — picking one of those trades places instead of replacing. */
  onPage?: string[]
  onPick: (id: string) => void
  onClose: () => void
}

/** The list of alternatives shown when swapping or adding a section. */
export default function SectionMenu({ title, options, emptyLabel, layouts, onPage, onPick, onClose }: Props) {
  return (
    <div
      role="dialog"
      aria-label={title}
      className="absolute inset-x-0 top-0 z-10 max-h-96 overflow-y-auto rounded-xl border border-hairline bg-row shadow-2xl shadow-black/60"
    >
      <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-hairline bg-row px-4 py-2.5">
        <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">{title}</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-xs text-ink-muted transition-colors hover:bg-row-hover hover:text-ink"
        >
          Cancel
        </button>
      </div>

      {options.length === 0 ? (
        <p className="px-4 py-4 text-sm text-ink-muted">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-hairline">
          {options.map((option) => {
            // Same thumbnail the row will show once it's in the list.
            const choice = option.options ? choiceOf(option, layouts) : null
            return (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => onPick(option.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-badge-ink"
                >
                  {choice ? (
                    <span className="w-16 shrink-0 overflow-hidden rounded border border-hairline">
                      <PreviewFrame>
                        <SectionPreview sectionId={option.id} choice={choice} />
                      </PreviewFrame>
                    </span>
                  ) : (
                    <span className="text-ink-faint">
                      <Icon name={option.icon} />
                    </span>
                  )}

                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[15px] text-ink">{option.label}</span>
                    {choice && (
                      <span className="truncate text-xs text-ink-muted">{describeChoice(option, choice)}</span>
                    )}
                  </span>

                  {onPage?.includes(option.id) && (
                    <span className="shrink-0 rounded-full border border-hairline px-2 py-0.5 text-xs text-ink-muted">
                      trades places
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

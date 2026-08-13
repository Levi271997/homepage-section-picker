import SectionPreview from '@/components/previews/SectionPreview'
import { PreviewFrame } from '@/components/previews/parts'
import { Icon } from '@/components/icons'
import type { Choice, OptionGroup } from '@/lib/sections'
import type { Section } from '@/lib/sections'
import { activeGroups } from '@/lib/sections'

type Props = {
  section: Section
  choice: Choice
  onPick: (groupId: string, optionId: string) => void
}

/**
 * A section's layout options, opened inline underneath their row so the rest of
 * the list stays visible while comparing. Each preview card renders the option
 * combined with the section's other current choices, not in isolation.
 */
export default function OptionPicker({ section, choice, onPick }: Props) {
  const sectionId = section.id
  // Groups the current layout makes no use of are hidden rather than shown inert.
  const groups: OptionGroup[] = activeGroups(section, choice)

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) =>
        group.display === 'chips' ? (
          <div key={group.id} className="flex flex-wrap items-center gap-2">
            <span className="w-20 shrink-0 text-xs font-medium tracking-wide text-ink-muted uppercase">
              {group.label}
            </span>
            <span role="radiogroup" aria-label={group.label} className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const selected = option.id === choice[group.id]
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onPick(group.id, option.id)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink ${
                      selected
                        ? 'border-badge-ink bg-badge text-badge-ink'
                        : 'border-hairline text-ink-muted hover:border-ink-faint hover:text-ink'
                    }`}
                  >
                    {option.name}
                  </button>
                )
              })}
            </span>
          </div>
        ) : (
          <div key={group.id} role="radiogroup" aria-label={group.label} className="grid gap-3 sm:grid-cols-3">
            {group.options.map((option) => {
              const selected = option.id === choice[group.id]
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onPick(group.id, option.id)}
                  className={`flex flex-col overflow-hidden rounded-lg border-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink ${
                    selected ? 'border-badge-ink' : 'border-hairline hover:border-ink-faint'
                  }`}
                >
                  <span className="relative block">
                    <PreviewFrame>
                      {/* the option previewed against the section's other current choices */}
                      <SectionPreview sectionId={sectionId} choice={{ ...choice, [group.id]: option.id }} />
                    </PreviewFrame>
                    {selected && (
                      <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-badge-ink text-canvas">
                        <Icon name="check" className="size-3" />
                      </span>
                    )}
                  </span>
                  <span className={`flex flex-col gap-0.5 px-3 py-2.5 ${selected ? 'bg-row-hover' : 'bg-row'}`}>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      {option.name}
                      {selected && <span className="text-xs font-normal text-badge-ink">· selected</span>}
                    </span>
                    {option.blurb && <span className="text-xs leading-snug text-ink-muted">{option.blurb}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        ),
      )}
    </div>
  )
}

'use client'

import { useRef } from 'react'
import { Icon } from '@/components/icons'
import { fieldsOf } from '@/lib/content'
import { isPlaceholder } from '@/lib/placeholder'
import type { SectionContent } from '@/lib/content'

type Props = {
  sectionId: string
  content: SectionContent
  /**
   * What the section is currently set to, so fields that belong to one design
   * only stay out of the way of the rest. Left off, every field is offered.
   */
  choice?: Record<string, string>
  onChange: (fieldId: string, value: string) => void
  /** Drops every edit for this section, restoring the placeholders. */
  onReset: () => void
}

const inputClass =
  'w-full rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:border-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink'

const smallButton =
  'rounded-lg border border-hairline bg-card px-2.5 py-1 text-xs text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink'

/**
 * An image list is stored the way every other list is — one entry per line —
 * so it needs no new plumbing to save, diff or reset. Blanks are kept here and
 * dropped by the preview: an empty row is someone part-way through adding a
 * picture, and taking it away as they click would be the editor arguing.
 */
const rowsOf = (value: string): string[] => (value === '' ? [''] : value.split('\n'))

/** The words and pictures inside one section. */
export default function ContentEditor({ sectionId, content, choice, onChange, onReset }: Props) {
  const fields = fieldsOf(sectionId, choice)
  const filePicker = useRef<HTMLInputElement>(null)
  /** Which field the open file dialog belongs to, and which row of it. */
  const pickingFor = useRef<{ fieldId: string; row: number | null } | null>(null)

  if (!fields.length) {
    return <p className="text-sm text-ink-muted">This section has nothing to fill in.</p>
  }

  /** Reads a chosen file into a data URI so it survives without any upload. */
  const onFile = (file: File | undefined) => {
    const target = pickingFor.current
    if (!file || !target) return
    const reader = new FileReader()
    reader.onload = () => {
      const uri = String(reader.result)
      if (target.row === null) {
        onChange(target.fieldId, uri)
        return
      }
      const rows = rowsOf(content[target.fieldId] ?? '')
      rows[target.row] = uri
      onChange(target.fieldId, rows.join('\n'))
    }
    reader.readAsDataURL(file)
  }

  const pick = (fieldId: string, row: number | null) => {
    pickingFor.current = { fieldId, row }
    filePicker.current?.click()
  }

  return (
    <div className="flex flex-col gap-3.5">
      {fields.map((field) => {
        const value = content[field.id] ?? ''
        const id = `${sectionId}-${field.id}`

        return (
          <div key={field.id} className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-xs font-medium text-ink-muted">
              {field.label}
            </label>

            {field.kind === 'images' ? (
              <div className="flex flex-col gap-2">
                {rowsOf(value).map((row, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="size-12 shrink-0 overflow-hidden rounded border border-hairline bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary URL or data URI */}
                      <img src={row} alt="" className="size-full object-cover" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <input
                        id={i === 0 ? id : undefined}
                        type="text"
                        spellCheck={false}
                        value={isPlaceholder(row) ? '' : row}
                        onChange={(e) => {
                          const rows = rowsOf(value)
                          rows[i] = e.target.value
                          onChange(field.id, rows.join('\n'))
                        }}
                        placeholder={`Slide ${i + 1} — paste an image URL`}
                        aria-label={`${field.label}, slide ${i + 1}`}
                        className={inputClass}
                      />
                      <span className="flex items-center gap-1.5">
                        <button type="button" onClick={() => pick(field.id, i)} className={smallButton}>
                          Upload a file
                        </button>
                        {rowsOf(value).length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              onChange(
                                field.id,
                                rowsOf(value)
                                  .filter((_, at) => at !== i)
                                  .join('\n'),
                              )
                            }
                            className={smallButton}
                          >
                            Remove
                          </button>
                        )}
                      </span>
                    </span>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => onChange(field.id, [...rowsOf(value), ''].join('\n'))}
                  className={`${smallButton} self-start`}
                >
                  Add another image
                </button>
              </div>
            ) : field.kind === 'image' ? (
              <div className="flex items-start gap-2.5">
                <span className="size-12 shrink-0 overflow-hidden rounded border border-hairline bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary URL or data URI */}
                  <img src={value} alt="" className="size-full object-cover" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <input
                    id={id}
                    type="text"
                    spellCheck={false}
                    value={isPlaceholder(value) ? '' : value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    placeholder="Paste an image URL"
                    className={inputClass}
                  />
                  <button type="button" onClick={() => pick(field.id, null)} className={`${smallButton} self-start`}>
                    Upload a file
                  </button>
                </span>
              </div>
            ) : field.kind === 'text' ? (
              <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                className={inputClass}
              />
            ) : (
              <textarea
                id={id}
                rows={field.kind === 'lines' ? 4 : 2}
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                className={`${inputClass} resize-y`}
              />
            )}

            {field.hint && <p className="text-xs text-ink-faint">{field.hint}</p>}
          </div>
        )
      })}

      <input
        ref={filePicker}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0])
          // Clear it so choosing the same file twice still fires a change.
          e.target.value = ''
        }}
      />

      <button
        type="button"
        onClick={onReset}
        className="mt-0.5 flex items-center gap-1.5 self-start rounded-lg px-2 py-1 text-xs text-ink-muted transition-colors hover:bg-row-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
      >
        <Icon name="check" className="size-3.5" />
        Reset this section&rsquo;s content
      </button>
    </div>
  )
}

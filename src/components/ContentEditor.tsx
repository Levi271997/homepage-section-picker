'use client'

import { useRef } from 'react'
import { Icon } from '@/components/icons'
import { fieldsOf } from '@/lib/content'
import { isPlaceholder } from '@/lib/placeholder'
import type { SectionContent } from '@/lib/content'

type Props = {
  sectionId: string
  content: SectionContent
  onChange: (fieldId: string, value: string) => void
  /** Drops every edit for this section, restoring the placeholders. */
  onReset: () => void
}

const inputClass =
  'w-full rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:border-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink'

/** The words and pictures inside one section. */
export default function ContentEditor({ sectionId, content, onChange, onReset }: Props) {
  const fields = fieldsOf(sectionId)
  const filePicker = useRef<HTMLInputElement>(null)
  const pickingFor = useRef<string | null>(null)

  if (!fields.length) {
    return <p className="text-sm text-ink-muted">This section has nothing to fill in.</p>
  }

  /** Reads a chosen file into a data URI so it survives without any upload. */
  const onFile = (file: File | undefined) => {
    const fieldId = pickingFor.current
    if (!file || !fieldId) return
    const reader = new FileReader()
    reader.onload = () => onChange(fieldId, String(reader.result))
    reader.readAsDataURL(file)
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

            {field.kind === 'image' ? (
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
                  <button
                    type="button"
                    onClick={() => {
                      pickingFor.current = field.id
                      filePicker.current?.click()
                    }}
                    className="self-start rounded-lg border border-hairline bg-card px-2.5 py-1 text-xs text-ink transition-colors hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-badge-ink"
                  >
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

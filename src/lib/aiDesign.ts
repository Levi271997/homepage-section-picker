/**
 * What `POST /api/generate` sends back, shared with the editor.
 *
 * Kept out of the route file because the static Pages build deletes
 * `src/app/api`, and the editor still has to type-check without it.
 */

/** The look the model chose for the whole page, before any section is drawn. */
export type AiTheme = {
  name: string
  /** One sentence on the look, which every section is handed so they agree. */
  direction: string
  headingFont: string
  bodyFont: string
  colors: {
    background: string
    surface: string
    text: string
    muted: string
    primary: string
    onPrimary: string
    accent: string
    border: string
  }
}

export type AiDesign = {
  theme: AiTheme
  /** The whole page as one self-contained document, for a sandboxed `<iframe srcdoc>`. */
  html: string
  /** Labels of any sections the model couldn't draw, which the page leaves out. */
  missing: string[]
}

/** The width the document is designed at — the artboard width of every Figma design. */
export const DESIGN_WIDTH = 1440

/**
 * The AI design is handed to its own tab the way the page is handed to
 * `/preview` (see `share.ts`): through `localStorage`, which the other tab
 * reads on load and listens to, so generating again updates a tab already open.
 */
const KEY = 'homepage-section-picker:ai-design'

const coerce = (value: unknown): AiDesign | null => {
  if (!value || typeof value !== 'object') return null
  const design = value as Partial<AiDesign>
  if (typeof design.html !== 'string' || !design.theme || typeof design.theme !== 'object') return null
  return { theme: design.theme, html: design.html, missing: Array.isArray(design.missing) ? design.missing : [] }
}

/** Publishes the design for another tab, or clears it on `null`. Returns false when storage refuses it. */
export function publishAiDesign(design: AiDesign | null): boolean {
  try {
    if (design) localStorage.setItem(KEY, JSON.stringify(design))
    else localStorage.removeItem(KEY)
    return true
  } catch {
    return false
  }
}

export function readAiDesign(): AiDesign | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? coerce(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

/** Calls back with the new design, or `null` once it's discarded, whenever another tab changes it. */
export function subscribeToAiDesign(onChange: (design: AiDesign | null) => void): () => void {
  const handler = (event: StorageEvent) => {
    if (event.key !== KEY) return
    try {
      onChange(event.newValue ? coerce(JSON.parse(event.newValue)) : null)
    } catch {
      // A half-written value; keep showing the last good one.
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

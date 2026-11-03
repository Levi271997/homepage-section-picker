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

'use client'

import { createContext, useContext } from 'react'

/**
 * Whether a preview is being looked at or used.
 *
 * `static` is the default everywhere — row thumbnails, picker cards, the
 * sidebar preview — where a carousel that advanced itself would be fourteen
 * distractions at once. `interactive` is set only by the full-page view, where
 * the point is that it behaves like a website.
 */
export type PreviewMode = 'static' | 'interactive'

const PreviewModeContext = createContext<PreviewMode>('static')

export const PreviewModeProvider = PreviewModeContext.Provider

export const usePreviewMode = (): PreviewMode => useContext(PreviewModeContext)

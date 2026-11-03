import type { Metadata } from 'next'

/** The tab's title on a fresh load; the page replaces it with the design's name once it has one. */
export const metadata: Metadata = {
  title: 'AI design',
}

export default function AiPreviewLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'

/**
 * The window's own title, so the tab reads as the site rather than as the tool
 * that built it. The page itself replaces this with the client's domain once it
 * knows one; this is what a fresh load shows, and what the app router would
 * otherwise reassert from the root layout after hydration.
 */
export const metadata: Metadata = {
  title: 'Your homepage',
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children
}

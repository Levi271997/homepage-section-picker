import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

/**
 * Satoshi (Indian Type Foundry, via Fontshare) is self-hosted from
 * `fonts/satoshi` — its licence allows it, so nothing is fetched from a
 * third-party CDN at runtime and the static export works on its own.
 *
 * Through `next/font` rather than a plain `@font-face` because it hashes and
 * preloads the files and rewrites their URLs for `basePath`, none of which
 * happens to a `url()` sitting in globals.css.
 */
const satoshi = localFont({
  src: [
    { path: './fonts/satoshi/Satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/satoshi/Satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/satoshi/Satoshi-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/satoshi/Satoshi-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'Homepage section picker',
  description: 'Pick, swap and remove the sections of your homepage.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}

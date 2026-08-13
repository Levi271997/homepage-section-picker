import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Homepage section picker',
  description: 'Pick, swap and remove the sections of your homepage.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

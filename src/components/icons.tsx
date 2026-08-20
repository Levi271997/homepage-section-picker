import type { SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export type IconName =
  | 'layout'
  | 'grid'
  | 'quote'
  | 'building'
  | 'mail'
  | 'star'
  | 'users'
  | 'image'
  | 'list'
  | 'calendar'
  | 'tag'
  | 'help'
  | 'play'
  | 'pin'
  | 'file'
  | 'dots'
  | 'arrow'
  | 'plus'
  | 'check'
  | 'grip'
  | 'chevron'
  | 'header'
  | 'split'
  | 'footer'
  | 'form'
  | 'stats'
  | 'external'

const paths: Record<IconName, React.ReactNode> = {
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
    </>
  ),
  grid: (
    <>
      {[6, 12, 18].map((y) =>
        [6, 12, 18].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="currentColor" stroke="none" />),
      )}
    </>
  ),
  quote: (
    <>
      <path d="M7 15c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3c0 3-1.4 5-4 6" />
      <path d="M17 15c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3c0 3-1.4 5-4 6" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3 2.9-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
      <path d="M16 6.2a3 3 0 0 1 0 5.8M17.5 14.8c2 .6 3.3 2.1 3.7 4.2" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m5 18 4.5-4.5 3 3L16 13l3 3" />
    </>
  ),
  list: <path d="M4 7h1M4 12h1M4 17h1M9 7h11M9 12h11M9 17h11" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
    </>
  ),
  tag: (
    <>
      <path d="M11.5 3.5H20v8.5l-8.6 8.6a1.4 1.4 0 0 1-2 0l-6.5-6.5a1.4 1.4 0 0 1 0-2z" />
      <circle cx="16.2" cy="7.8" r="1.2" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.7 9.6a2.4 2.4 0 1 1 3.2 2.3c-.6.2-.9.8-.9 1.4v.4" />
      <path d="M12 17h.01" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10.4 8.8 5 3.2-5 3.2z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-5.6 6.5-10a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z" />
      <circle cx="12" cy="11" r="2.4" />
    </>
  ),
  file: (
    <>
      <path d="M14 3.5H7a1.5 1.5 0 0 0-1.5 1.5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8z" />
      <path d="M14 3.5V8h4.5M9 13h6M9 16.5h4" />
    </>
  ),
  dots: (
    <>
      <circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  arrow: <path d="M7 17 17 7M9 7h8v8" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  header: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M6.5 6.5h3" />
    </>
  ),
  stats: (
    <>
      <path d="M4 20V10M10 20V5M16 20v-7M22 20V8" />
    </>
  ),
  form: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M7.5 8h9M7.5 12h9M7.5 16h4" />
    </>
  ),
  footer: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 15h18M6.5 17.5h4" />
    </>
  ),
  split: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M11 5v14M14 10h4M14 13.5h3" />
    </>
  ),
  grip: (
    <>
      {[8, 12, 16].map((y) =>
        [9.5, 14.5].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.15" fill="currentColor" stroke="none" />),
      )}
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
}

export function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

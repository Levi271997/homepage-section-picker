/**
 * URL for a file we ship in `public/`.
 *
 * Two things this handles that a bare string doesn't:
 *
 * 1. The GitHub Pages build serves the site from `/homepage-section-picker/`,
 *    not the domain root. Next rewrites `basePath` for `next/image` and
 *    `next/link`, but every image here is a plain `<img>` (deliberately — see
 *    `parts.tsx`), so nothing would rewrite these paths for us.
 * 2. The design-set files keep the names Figma exported them with — spaces and
 *    an `=` in every one. Both have to be percent-encoded before the path
 *    reaches an `src`: Next serves `Type%3DHero%20V1.svg` but 404s on
 *    `Type=Hero%20V1.svg`, so `encodeURI` isn't enough — it leaves `=` alone as
 *    a reserved character. Encoding segment by segment covers the whole set of
 *    characters a file name can legally contain.
 *
 * Only for our own files. Client-site URLs from the analyser are absolute and
 * must be left alone.
 */
const BASE = process.env.NEXT_PUBLIC_STATIC_BUILD === 'true' ? '/homepage-section-picker' : ''

export const asset = (path: string): string =>
  BASE + path.split('/').map(encodeURIComponent).join('/')

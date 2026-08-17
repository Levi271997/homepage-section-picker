/**
 * The GitHub Pages build is a static export, so it has no server and no API
 * routes. `npm run dev` and any hosted deployment are unaffected — the export
 * settings only switch on when NEXT_PUBLIC_STATIC_BUILD is set, which the
 * Pages workflow does and nothing else does.
 */
const isStaticBuild = process.env.NEXT_PUBLIC_STATIC_BUILD === 'true'

// Project pages are served from /<repo>, not the domain root.
const repo = 'homepage-section-picker'

/** @type {import('next').NextConfig} */
const nextConfig = isStaticBuild
  ? {
      output: 'export',
      basePath: `/${repo}`,
      assetPrefix: `/${repo}/`,
      trailingSlash: true,
      // The export has no image optimiser to call.
      images: { unoptimized: true },
    }
  : {}

export default nextConfig

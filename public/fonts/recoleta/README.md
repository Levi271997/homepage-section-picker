# Recoleta

Recoleta is a licensed font from Latinotype, so its files aren't in this repo.
Buy a webfont licence (Latinotype/MyFonts, or use an Adobe Fonts web project)
and drop the woff2 files in here under exactly these names:

- `Recoleta-Regular.woff2` (400)
- `Recoleta-Medium.woff2` (500)
- `Recoleta-SemiBold.woff2` (600)
- `Recoleta-Bold.woff2` (700)

The `@font-face` rules are already declared in `src/app/globals.css`, so every
heading picks the font up as soon as the files are here — no code change. You
only need the weights you use; a missing one falls back to the serif stack.

Satoshi needs none of this: it's free under the ITF Free Font Licence and is
committed in `src/app/fonts/satoshi/`.

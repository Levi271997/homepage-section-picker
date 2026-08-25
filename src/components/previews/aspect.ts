import type { Choice } from '@/lib/sections'

/**
 * Roughly how tall each section stands relative to its width.
 *
 * Shared by the sidebar preview and the full-page view so the two can't drift:
 * everything inside a preview is sized in `cqw`, so the same ratio scales from a
 * 700px column to a 1200px page without any other change.
 */
/**
 * Hero heights, taken from the artboards the designs were exported at — all
 * 1440 wide, so the second number is the only thing that varies. A design not
 * listed here falls back to the shape of the plain split hero.
 */
const HERO_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/613]',
  v2: 'aspect-[1440/613]',
  v3: 'aspect-[1440/1005]',
  v4: 'aspect-[1440/1125]',
  v5: 'aspect-[1440/1125]',
  v6: 'aspect-[1440/643]',
  v7: 'aspect-[1440/643]',
  v8: 'aspect-[1440/1050]',
  v13: 'aspect-[1440/613]',
  v14: 'aspect-[1440/613]',
  v15: 'aspect-[1440/613]',
  v16: 'aspect-[1440/613]',
  v17: 'aspect-[1440/613]',
  v18: 'aspect-[1440/648]',
  v19: 'aspect-[1440/652]',
  v20: 'aspect-[1440/652]',
  v21: 'aspect-[1440/1081]',
  v22: 'aspect-[1440/892]',
  v23: 'aspect-[1440/768]',
  v24: 'aspect-[1440/768]',
  v25: 'aspect-[1440/526]',
  v26: 'aspect-[1440/542]',
  v28: 'aspect-[1440/648]',
}

/**
 * Content card heights, from the artboards the designs were exported at — again
 * all 1440 wide. Two axes here rather than the hero's one: the set is drawn once
 * per row count, and a row of cards is most of a card section's height.
 *
 * Written out as whole class names rather than built from the numbers, because
 * Tailwind generates an arbitrary value only where it can read it literally in
 * the source — an `aspect-[1440/${n}]` would name a class that never exists.
 */
const CARD_RATIOS: Record<string, Record<string, string>> = {
  v1: { '1': 'aspect-[1440/648]', '2': 'aspect-[1440/945]', '3': 'aspect-[1440/1242]' },
  v2: { '1': 'aspect-[1440/546]', '2': 'aspect-[1440/827]', '3': 'aspect-[1440/1108]' },
  v3: { '1': 'aspect-[1440/710]', '2': 'aspect-[1440/1053]', '3': 'aspect-[1440/1396]' },
  v4: { '1': 'aspect-[1440/608]', '2': 'aspect-[1440/935]', '3': 'aspect-[1440/1262]' },
  v5: { '1': 'aspect-[1440/632]', '2': 'aspect-[1440/913]', '3': 'aspect-[1440/1194]' },
  v6: { '1': 'aspect-[1440/604]', '2': 'aspect-[1440/927]', '3': 'aspect-[1440/1250]' },
  v7: { '1': 'aspect-[1440/632]', '2': 'aspect-[1440/913]', '3': 'aspect-[1440/1194]' },
  v8: { '1': 'aspect-[1440/686]', '2': 'aspect-[1440/1005]', '3': 'aspect-[1440/1324]' },
  v9: { '1': 'aspect-[1440/751]', '2': 'aspect-[1440/1151]', '3': 'aspect-[1440/1551]' },
  v10: { '1': 'aspect-[1440/809]', '2': 'aspect-[1440/1251]', '3': 'aspect-[1440/1693]' },
  v11: { '1': 'aspect-[1440/751]', '2': 'aspect-[1440/1151]', '3': 'aspect-[1440/1551]' },
  v12: { '1': 'aspect-[1440/723]', '2': 'aspect-[1440/1165]', '3': 'aspect-[1440/1607]' },
  v13: { '1': 'aspect-[1440/751]', '2': 'aspect-[1440/1151]', '3': 'aspect-[1440/1551]' },
  v14: { '1': 'aspect-[1440/707]', '2': 'aspect-[1440/1133]', '3': 'aspect-[1440/1559]' },
  v15: { '1': 'aspect-[1440/602]', '2': 'aspect-[1440/853]', '3': 'aspect-[1440/1104]' },
  v16: { '1': 'aspect-[1440/516]', '2': 'aspect-[1440/751]', '3': 'aspect-[1440/986]' },
  v17: { '1': 'aspect-[1440/547]', '2': 'aspect-[1440/743]', '3': 'aspect-[1440/939]' },
  v18: { '1': 'aspect-[1440/509]', '2': 'aspect-[1440/737]', '3': 'aspect-[1440/965]' },
  v19: { '1': 'aspect-[1440/595]', '2': 'aspect-[1440/839]', '3': 'aspect-[1440/1083]' },
  v20: { '1': 'aspect-[1440/561]', '2': 'aspect-[1440/841]', '3': 'aspect-[1440/1121]' },
  v21: { '1': 'aspect-[1440/583]', '2': 'aspect-[1440/815]', '3': 'aspect-[1440/1047]' },
  v22: { '1': 'aspect-[1440/537]', '2': 'aspect-[1440/793]', '3': 'aspect-[1440/1049]' },
}

/**
 * Content section heights, from the artboards the designs were exported at.
 * The banner is a strip at 1440×351; the flanked and stacked designs are the
 * tall ones. Same literal-class rule as the cards above.
 */
const SECTION_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/613]',
  v2: 'aspect-[1440/613]',
  v3: 'aspect-[1440/613]',
  v4: 'aspect-[1440/613]',
  v5: 'aspect-[1440/660]',
  v6: 'aspect-[1440/660]',
  v7: 'aspect-[1440/652]',
  v8: 'aspect-[1440/652]',
  v9: 'aspect-[1440/652]',
  v10: 'aspect-[1440/652]',
  v13: 'aspect-[1440/613]',
  v15: 'aspect-[1440/696]',
  v16: 'aspect-[1440/688]',
  v17: 'aspect-[1440/1053]',
  v18: 'aspect-[1440/967]',
  v19: 'aspect-[1440/614]',
  v20: 'aspect-[1440/614]',
  v21: 'aspect-[1440/941]',
  v22: 'aspect-[1440/351]',
  v23: 'aspect-[1440/613]',
}

/**
 * Testimonial heights, from the artboards the designs were exported at. The
 * three-up grids are the short ones; V4's two rows of portraits and V6's two
 * rows of cards are the tall ones. Same literal-class rule as above.
 */
const QUOTE_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/731]',
  v2: 'aspect-[1440/849]',
  v3: 'aspect-[1440/655]',
  v4: 'aspect-[1440/1047]',
  v5: 'aspect-[1440/751]',
  v6: 'aspect-[1440/1051]',
}

/**
 * Logo strip heights, from the artboards the designs were exported at. The bare
 * strip is a band at 1440×314; the three-row grid is the tall one.
 */
const LOGO_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/609]',
  v2: 'aspect-[1440/314]',
  v3: 'aspect-[1440/817]',
}

/**
 * Team member heights, from the artboards the designs were exported at. The
 * landscape portraits make V3 the tall one.
 */
const TEAM_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/614]',
  v2: 'aspect-[1440/670]',
  v3: 'aspect-[1440/733]',
}

/**
 * Stats heights, from the artboards the designs were exported at. The two
 * headed designs stand at 619; the bare rows of figures are 252-tall strips.
 */
const STATS_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/619]',
  v2: 'aspect-[1440/619]',
  v3: 'aspect-[1440/252]',
  v4: 'aspect-[1440/252]',
}

/**
 * Pricing heights, from the artboards the designs were exported at. The one
 * that opens each plan with a picture is the tall one; the one with no feature
 * list is the short one.
 */
const PRICING_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/805]',
  v2: 'aspect-[1440/875]',
  v3: 'aspect-[1440/809]',
  v4: 'aspect-[1440/879]',
  v5: 'aspect-[1440/965]',
  v6: 'aspect-[1440/727]',
}

/**
 * Blog heights, from the artboards the designs were exported at. The paged grid
 * is the tall one — three rows of three and no header at all.
 */
const BLOG_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/850]',
  v2: 'aspect-[1440/792]',
  v3: 'aspect-[1440/808]',
  v4: 'aspect-[1440/784]',
  v5: 'aspect-[1440/820]',
  v6: 'aspect-[1440/1423]',
}

/**
 * FAQ heights, from the artboards the designs were exported at. The two-column
 * designs stand at 649; the one that sets its copy alongside is 631.
 */
const FAQ_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/613]',
  v2: 'aspect-[1440/613]',
  v3: 'aspect-[1440/649]',
  v4: 'aspect-[1440/649]',
  v5: 'aspect-[1440/631]',
}

/**
 * Call-to-action heights, from the artboards the designs were exported at. The
 * bands are strips; the two on a rounded green panel are the tall ones.
 */
const CTA_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/391]',
  v2: 'aspect-[1440/330]',
  v3: 'aspect-[1440/391]',
  v4: 'aspect-[1440/330]',
  v5: 'aspect-[1440/613]',
  v6: 'aspect-[1440/613]',
  v7: 'aspect-[1440/673]',
  v8: 'aspect-[1440/673]',
  v9: 'aspect-[1440/383]',
  v10: 'aspect-[1440/383]',
}

/**
 * Contact form heights, from the artboards the designs were exported at. The
 * four that set the form on a panel all stand at 648; the two with a picture
 * are taller, and differ from each other by exactly their pictures.
 */
const CONTACT_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/648]',
  v2: 'aspect-[1440/648]',
  v3: 'aspect-[1440/648]',
  v4: 'aspect-[1440/648]',
  v5: 'aspect-[1440/820]',
  v6: 'aspect-[1440/790]',
}

/**
 * Footer heights, from the artboards the designs were exported at. The three
 * with link columns stand at 338; the rest are strips and bars, down to the
 * 68 of a single legal line.
 */
const FOOTER_RATIOS: Record<string, string> = {
  v1: 'aspect-[1440/338]',
  v2: 'aspect-[1440/102]',
  v3: 'aspect-[1440/102]',
  v4: 'aspect-[1440/137]',
  v5: 'aspect-[1440/338]',
  v6: 'aspect-[1440/338]',
  v7: 'aspect-[1440/68]',
  v8: 'aspect-[1440/76]',
}

export function aspectFor(id: string, choice: Choice): string {
  switch (id) {
    case 'hero-logo':
      return HERO_RATIOS[choice.design] ?? 'aspect-[1440/613]'
    case 'content-card':
      return CARD_RATIOS[choice.design]?.[choice.rows] ?? 'aspect-16/10'
    case 'content-section':
      return SECTION_RATIOS[choice.design] ?? 'aspect-[1440/613]'
    case 'client-quote':
      return QUOTE_RATIOS[choice.design] ?? 'aspect-[1440/731]'
    case 'site-header':
      // A single bar is a thin strip; the two-tier and stacked ones need room.
      return choice.structure === 'single' ? 'aspect-16/3' : 'aspect-16/5'
    case 'logo-strip':
      return LOGO_RATIOS[choice.design] ?? 'aspect-[1440/609]'
    case 'about-team':
      return TEAM_RATIOS[choice.design] ?? 'aspect-[1440/614]'
    case 'stats':
      return STATS_RATIOS[choice.design] ?? 'aspect-[1440/619]'
    case 'pricing':
      return PRICING_RATIOS[choice.design] ?? 'aspect-[1440/805]'
    case 'blogs':
      return BLOG_RATIOS[choice.design] ?? 'aspect-[1440/850]'
    case 'faq':
      return FAQ_RATIOS[choice.design] ?? 'aspect-[1440/613]'
    case 'cta':
      return CTA_RATIOS[choice.design] ?? 'aspect-[1440/391]'
    case 'contact-form':
      return CONTACT_RATIOS[choice.design] ?? 'aspect-[1440/648]'
    case 'site-footer':
      return FOOTER_RATIOS[choice.design] ?? 'aspect-[1440/338]'
    default:
      return 'aspect-16/10'
  }
}

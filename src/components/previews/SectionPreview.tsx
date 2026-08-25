import HeroPreview from '@/components/previews/HeroPreview'
import LogoStripPreview from '@/components/previews/LogoStripPreview'
import ContentCardPreview from '@/components/previews/ContentCardPreview'
import HeaderPreview from '@/components/previews/HeaderPreview'
import ContentSectionPreview from '@/components/previews/ContentSectionPreview'
import FooterPreview from '@/components/previews/FooterPreview'
import ContactFormPreview from '@/components/previews/ContactFormPreview'
import BlogsPreview from '@/components/previews/BlogsPreview'
import PricingPreview from '@/components/previews/PricingPreview'
import TestimonialsPreview from '@/components/previews/TestimonialsPreview'
import TeamPreview from '@/components/previews/TeamPreview'
import FaqPreview from '@/components/previews/FaqPreview'
import StatsPreview from '@/components/previews/StatsPreview'
import CtaPreview from '@/components/previews/CtaPreview'
import { imageFor } from '@/lib/previewImages'
import { defaultContent } from '@/lib/content'
import type { SectionContent } from '@/lib/content'
import type { Choice } from '@/lib/sections'

/**
 * Picks the right miniature for a section's current choice.
 * The option ids live in the catalog as plain strings, so this is the one
 * place where they're narrowed back to a section's own layout union.
 */
export default function SectionPreview({
  sectionId,
  choice,
  content,
  screenshot = false,
}: {
  sectionId: string
  choice: Choice
  /** The section's words and pictures; placeholders when not supplied. */
  content?: SectionContent
  /**
   * Show the design artwork instead of the wireframe, where one exists.
   *
   * Set where a design is being *chosen* — picker cards, row thumbnails, the
   * swap and add menus. Left off for the assembled page, which keeps the
   * wireframe because that's what fills with the client's own colour, logo and
   * copy; the artwork is fixed lorem ipsum.
   */
  screenshot?: boolean
}) {
  // The drawn design wins over the wireframe wherever one has been supplied.
  const image = screenshot ? imageFor(sectionId, choice) : null
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element -- static asset in a fixed-ratio frame, no layout shift to guard against
    return <img src={image} alt="" className="h-full w-full object-cover object-top" />
  }

  const c = content ?? defaultContent(sectionId)

  switch (sectionId) {
    case 'site-header':
      return (
        <HeaderPreview
          structure={choice.structure}
          nav={choice.nav}
          band={choice.band}
          cta={choice.cta}
          content={c}
        />
      )
    case 'hero-logo':
      return <HeroPreview design={choice.design} content={c} />
    case 'logo-strip':
      return <LogoStripPreview design={choice.design} content={c} />
    case 'cta':
      return <CtaPreview design={choice.design} content={c} />
    case 'stats':
      return <StatsPreview design={choice.design} content={c} />
    case 'faq':
      return <FaqPreview design={choice.design} content={c} />
    case 'about-team':
      return <TeamPreview design={choice.design} content={c} />
    case 'client-quote':
      return <TestimonialsPreview design={choice.design} content={c} />
    case 'pricing':
      return <PricingPreview design={choice.design} content={c} />
    case 'blogs':
      return <BlogsPreview design={choice.design} content={c} />
    case 'contact-form':
      return <ContactFormPreview design={choice.design} content={c} />
    case 'site-footer':
      return <FooterPreview design={choice.design} copy={c} />
    case 'content-section':
      return <ContentSectionPreview design={choice.design} content={c} />
    case 'content-card':
      return <ContentCardPreview design={choice.design} rows={choice.rows} content={c} />
    default:
      return <div className="h-full bg-white" />
  }
}

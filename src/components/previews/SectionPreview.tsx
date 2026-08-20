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
import type { LogoLayout } from '@/components/previews/LogoStripPreview'
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
      return <LogoStripPreview layout={choice.layout as LogoLayout} content={c} />
    case 'cta':
      return (
        <CtaPreview
          layout={choice.layout}
          band={choice.band}
          shape={choice.shape}
          side={choice.side}
          align={choice.align}
          list={choice.list}
          content={c}
        />
      )
    case 'stats':
      return (
        <StatsPreview
          layout={choice.layout}
          header={choice.header}
          band={choice.band}
          columns={choice.columns}
          content={c}
        />
      )
    case 'faq':
      return (
        <FaqPreview
          style={choice.style}
          layout={choice.layout}
          columns={choice.columns}
          header={choice.header}
          items={choice.items}
          content={c}
        />
      )
    case 'about-team':
      return (
        <TeamPreview
          layout={choice.layout}
          card={choice.card}
          align={choice.align}
          columns={choice.columns}
          content={c}
        />
      )
    case 'client-quote':
      return (
        <TestimonialsPreview
          layout={choice.layout}
          mark={choice.mark}
          card={choice.card}
          header={choice.header}
          rows={choice.rows}
          content={c}
        />
      )
    case 'pricing':
      return (
        <PricingPreview
          layout={choice.layout}
          ticks={choice.ticks}
          card={choice.card}
          highlight={choice.highlight}
          content={c}
        />
      )
    case 'blogs':
      return (
        <BlogsPreview
          layout={choice.layout}
          card={choice.card}
          header={choice.header}
          rows={choice.rows}
          more={choice.more}
          content={c}
        />
      )
    case 'contact-form':
      return (
        <ContactFormPreview
          layout={choice.layout}
          side={choice.side}
          list={choice.list}
          fields={choice.fields}
          content={c}
        />
      )
    case 'site-footer':
      return (
        <FooterPreview
          layout={choice.layout}
          content={choice.content}
          columns={choice.columns}
          subscribe={choice.subscribe}
          copy={c}
        />
      )
    case 'content-section':
      return (
        <ContentSectionPreview
          layout={choice.layout}
          side={choice.side}
          image={choice.image}
          header={choice.header}
          items={choice.items}
          content={c}
        />
      )
    case 'content-card':
      return <ContentCardPreview style={choice.style} header={choice.header} rows={choice.rows} content={c} />
    default:
      return <div className="h-full bg-white" />
  }
}

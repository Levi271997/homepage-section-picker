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
import type { HeroLayout } from '@/components/previews/HeroPreview'
import type { LogoLayout } from '@/components/previews/LogoStripPreview'
import { imageFor } from '@/lib/previewImages'
import type { Choice } from '@/lib/sections'
import type { SiteContent } from '@/lib/siteProfile'

/**
 * Picks the right miniature for a section's current choice.
 * The option ids live in the catalog as plain strings, so this is the one
 * place where they're narrowed back to a section's own layout union.
 */
export default function SectionPreview({
  sectionId,
  choice,
  content,
}: {
  sectionId: string
  choice: Choice
  /** The client's own site, when we've read it. Only the large preview passes this. */
  content?: SiteContent
}) {
  // A real screenshot wins over the wireframe wherever one has been supplied.
  const image = imageFor(sectionId, choice)
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element -- static asset in a fixed-ratio frame, no layout shift to guard against
    return <img src={image} alt="" className="h-full w-full object-cover object-top" />
  }

  switch (sectionId) {
    case 'site-header':
      return (
        <HeaderPreview
          structure={choice.structure}
          nav={choice.nav}
          band={choice.band}
          cta={choice.cta}
          content={content}
        />
      )
    case 'hero-logo':
      return <HeroPreview layout={choice.layout as HeroLayout} content={content} />
    case 'logo-strip':
      return <LogoStripPreview layout={choice.layout as LogoLayout} />
    case 'cta':
      return (
        <CtaPreview
          layout={choice.layout}
          band={choice.band}
          shape={choice.shape}
          side={choice.side}
          align={choice.align}
          list={choice.list}
        />
      )
    case 'stats':
      return (
        <StatsPreview layout={choice.layout} header={choice.header} band={choice.band} columns={choice.columns} />
      )
    case 'faq':
      return (
        <FaqPreview
          style={choice.style}
          layout={choice.layout}
          columns={choice.columns}
          header={choice.header}
          items={choice.items}
        />
      )
    case 'about-team':
      return (
        <TeamPreview layout={choice.layout} card={choice.card} align={choice.align} columns={choice.columns} />
      )
    case 'client-quote':
      return (
        <TestimonialsPreview
          layout={choice.layout}
          mark={choice.mark}
          card={choice.card}
          header={choice.header}
          rows={choice.rows}
        />
      )
    case 'pricing':
      return (
        <PricingPreview
          layout={choice.layout}
          ticks={choice.ticks}
          card={choice.card}
          highlight={choice.highlight}
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
        />
      )
    case 'contact-form':
      return (
        <ContactFormPreview
          layout={choice.layout}
          side={choice.side}
          list={choice.list}
          fields={choice.fields}
        />
      )
    case 'site-footer':
      return (
        <FooterPreview
          layout={choice.layout}
          content={choice.content}
          columns={choice.columns}
          subscribe={choice.subscribe}
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
        />
      )
    case 'content-card':
      return <ContentCardPreview style={choice.style} header={choice.header} rows={choice.rows} />
    default:
      return <div className="h-full bg-white" />
  }
}

import { createHash } from 'node:crypto'
import OpenAI from 'openai'
import { byId, choiceOf, describeChoice } from '@/lib/sections'
import { DESIGN_WIDTH } from '@/lib/aiDesign'
import type { AiDesign, AiTheme } from '@/lib/aiDesign'
import type { Choice } from '@/lib/sections'

/**
 * POST /api/generate  { ids, layouts, outlines, business }  ->  AiDesign | { error }
 *
 * Designs the homepage from scratch on the layout the client has assembled.
 * The structure is fixed and the look is not: the sections, their order and
 * each design's arrangement come from the editor, and the model chooses the
 * colours, the type, the decoration and the words.
 *
 * Two steps. One call settles a design direction for the whole page — palette,
 * font pair, mood — so the sections agree with each other. Then every section
 * is drawn in parallel as its own HTML and CSS, from the outline the editor
 * measured off its wireframe (`src/lib/outline.ts`). The pieces are joined into
 * one self-contained document that the editor shows in a sandboxed iframe.
 *
 * DeepSeek is OpenAI-compatible, so the SDK is the same one `/api/analyze`
 * uses; only the base URL and the model change.
 */

/**
 * The fonts the model may choose from.
 *
 * A fixed list rather than any Google font, because the css2 API fails the
 * whole request when one family lacks a weight it was asked for. Every family
 * here has 400 to 700, so the link below always loads.
 */
const FONTS = [
  'Archivo', 'Barlow', 'Bitter', 'Bricolage Grotesque', 'Cormorant Garamond', 'Crimson Pro', 'DM Sans',
  'EB Garamond', 'Epilogue', 'Figtree', 'Fraunces', 'IBM Plex Sans', 'Instrument Sans', 'Inter', 'Josefin Sans',
  'Karla', 'Lexend', 'Libre Franklin', 'Lora', 'Manrope', 'Montserrat', 'Nunito', 'Outfit', 'Playfair Display',
  'Plus Jakarta Sans', 'Poppins', 'Raleway', 'Roboto Slab', 'Rubik', 'Sora', 'Source Sans 3', 'Space Grotesk',
  'Spectral', 'Syne', 'Unbounded', 'Urbanist', 'Work Sans',
]

const COLOR_KEYS = [
  'background', 'surface', 'text', 'muted', 'primary', 'onPrimary', 'accent', 'border',
  'headerBackground', 'headerText',
] as const

const THEME_SYSTEM = `You are an art director setting the visual direction for a small business's new homepage. You reply with json.

Invent a distinctive, modern look that suits the business — not a generic template. Be bold where the business allows it: a confident palette, an interesting font pairing, a clear mood.

Reply with json only, in exactly this shape:
{
  "name": "two or three words naming the look",
  "direction": "two sentences describing the look: mood, how colour is used, how sections alternate, decorative motifs, corner style, spacing",
  "headingFont": "one font from the list",
  "bodyFont": "one font from the list",
  "colors": {
    "background": "#hex, the page background",
    "surface": "#hex, cards and alternate section bands",
    "text": "#hex, body text, readable on background and surface",
    "muted": "#hex, secondary text",
    "primary": "#hex, the brand colour, used for buttons and highlights",
    "onPrimary": "#hex, text on primary, with strong contrast",
    "accent": "#hex, a second colour that works with primary",
    "border": "#hex, hairlines and dividers",
    "headerBackground": "#hex, the bar behind the site header",
    "headerText": "#hex, the logo and nav links on that bar, with strong contrast against it"
  }
}

Fonts must be chosen from this list, spelled exactly: ${FONTS.join(', ')}.`

const SECTION_SYSTEM = `You are a senior web designer building one section of a homepage as HTML and CSS. You reply with json.

You are given the section's STRUCTURE as an outline measured from the approved wireframe. Each line is one element, indented under its parent, with its box as [x y w h] in percent of the 1440px section width. The structure is fixed and you must follow it strictly:
- Keep every element in the outline, in the same order and the same nesting, and add no new content blocks.
- Keep the arrangement: the same number of columns, the same side for images, the same count of cards, list items, logos, fields and buttons, the same alignment, and overlays stay layered over what they sit on.
- Keep the proportions close to the boxes: widths, the image sizes, where things sit, and the section's overall height.
- A "shape" is a decorative block or placeholder; an "icon" is a small inline SVG you draw.
- A "carousel" stays a working carousel. Build it with exactly this markup, because the page's own slider script drives it:
  <div class="carousel"><div class="track"><div class="slide">…</div><div class="slide">…</div></div><button class="carousel-prev" aria-label="Previous">…</button><button class="carousel-next" aria-label="Next">…</button><div class="carousel-dots"></div></div>
  Write about twice as many slides as fit across at once, so there is something to slide to, and give .slide the width one slide should take. Leave .carousel-dots empty: the dots are built and kept in step for you. Include the arrows only where the outline shows them. Style all of it to match the design.

The VISUAL DESIGN is entirely yours, within the page's design direction: colour, typography, type scale, weights, spacing, backgrounds, borders, shadows, gradients, decorative details and corner radii. Make it look like a polished, premium, real website — not a wireframe.

The COPY is yours too: rewrite every piece of text for the business, keeping each piece's role and roughly its length. British spelling. Never write lorem ipsum.

Technical rules:
- Reply with json only: {"html": "...", "css": "..."}.
- The html is one root element: <header> for a site header, <footer> for a site footer, otherwise <section>. Use semantic markup — h1 only in the hero, h2 for section headings, h3 for cards, real lists, labels on fields.
- There are no photos. Draw every image as <div class="img" role="img" aria-label="what the photo would show"></div> sized to its box, and style it with CSS gradients or shapes from the palette. Never use <img>, url(), or any external resource.
- Links use href="#". No scripts, no event attributes, no inline style attributes — all styling goes in the css.
- The css is nested inside the section's own scope automatically, so write plain selectors (".card", "h2", "& > header") and never target html, body or :root. Design for a 1440px-wide desktop viewport. No media queries, no @import, no @font-face.
- Use the page's custom properties: var(--background), var(--surface), var(--text), var(--muted), var(--primary), var(--on-primary), var(--accent), var(--border), var(--font-heading), var(--font-body).
- A site header sits on var(--header-bg), and its logo, navigation links, dropdown carets and plain icons use var(--header-text), which is guaranteed to read against it. Never leave the header transparent, never let the section below decide its contrast, and never put the logo or a nav link in a colour close to the bar behind them. A solid button in the header may use primary with on-primary.`

/** How many times a section is asked for before the page goes ahead without it. */
const ATTEMPTS = 2

const HEX = /^#[0-9a-f]{6}$/i

/** WCAG relative luminance, which is what a contrast ratio is built from. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((value) => {
    const v = value / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

/**
 * The model's text colour if it can actually be read on `background`, and
 * otherwise black or white, whichever reads better.
 *
 * 4.5:1 is the WCAG AA threshold for body-sized text.
 */
const readable = (background: string, preferred: string): string => {
  if (contrast(background, preferred) >= 4.5) return preferred
  return contrast(background, '#ffffff') >= contrast(background, '#111111') ? '#ffffff' : '#111111'
}

type Brief = { id: string; label: string; design: string; outline: string }

const clientFor = () =>
  new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    // Overridable so the route can be pointed at a proxy or a local stub.
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  })

async function ask(client: OpenAI, system: string, user: string, temperature: number, maxTokens: number) {
  const response = await client.chat.completions.create({
    // The alias tracks DeepSeek's current chat model; overridable so a change
    // of model doesn't need a change of code.
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    response_format: { type: 'json_object' },
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })
  return JSON.parse(response.choices[0]?.message?.content || '{}') as Record<string, unknown>
}

/**
 * The model's theme, with anything unusable replaced.
 *
 * The values end up inside a stylesheet, so a colour has to be a hex and a
 * font has to be on the list — nothing else is let through.
 */
function themeFrom(raw: Record<string, unknown>): AiTheme {
  const str = (value: unknown, fallback: string, limit: number) =>
    typeof value === 'string' && value.trim() ? value.trim().slice(0, limit) : fallback
  const font = (value: unknown, fallback: string) => FONTS.find((f) => f.toLowerCase() === String(value).toLowerCase()) ?? fallback
  const colors = (raw.colors && typeof raw.colors === 'object' ? raw.colors : {}) as Record<string, unknown>
  const fallback: AiTheme['colors'] = {
    background: '#fbfaf7',
    surface: '#f1eee6',
    text: '#1d1c1a',
    muted: '#6b675f',
    primary: '#1f4d3a',
    onPrimary: '#ffffff',
    accent: '#d98e3f',
    border: '#e2ddd2',
    headerBackground: '#fbfaf7',
    headerText: '#1d1c1a',
  }
  const chosen = Object.fromEntries(
    COLOR_KEYS.map((key) => [key, typeof colors[key] === 'string' && HEX.test(colors[key] as string) ? colors[key] : fallback[key]]),
  ) as AiTheme['colors']

  // The model picks colours by eye and will happily pair two light ones, which
  // leaves a header's nav links or a button's label unreadable. The two
  // colours that sit directly on another are checked and replaced if they fail.
  chosen.headerText = readable(chosen.headerBackground, chosen.headerText)
  chosen.onPrimary = readable(chosen.primary, chosen.onPrimary)

  return {
    name: str(raw.name, 'AI design', 60),
    direction: str(raw.direction, 'Clean and confident, with generous spacing.', 500),
    headingFont: font(raw.headingFont, 'Fraunces'),
    bodyFont: font(raw.bodyFont, 'Inter'),
    colors: chosen,
  }
}

/**
 * Takes out anything in the model's markup that could run, load or navigate.
 *
 * Belt and braces: the iframe is sandboxed with no permissions and the
 * document carries a CSP that blocks scripts and remote loads, so this is the
 * second line, not the only one. It also keeps a downloaded copy safe to open.
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe|object|embed|noscript|template)\b[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<\/?(script|style|iframe|object|embed|link|meta|base|frame|frameset|noscript|template|img)\b[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/\s(href|src|action|formaction|srcset|xlink:href)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (match, attr: string, value: string) => {
      const url = value.replace(/^["']|["']$/g, '').trim()
      // Same-page anchors, mail and phone links are all a homepage needs.
      return attr.toLowerCase() === 'href' && /^(#|mailto:|tel:)/i.test(url) ? match : attr.toLowerCase() === 'href' ? ' href="#"' : ''
    })
}

/** The same for the stylesheet: no imports, no remote resources, no way out of the `<style>` element. */
function cleanCss(css: string): string {
  return css
    .replace(/<\/?style[^>]*>/gi, '')
    .replace(/@import[^;]*;?/gi, '')
    .replace(/@font-face\s*\{[^}]*\}/gi, '')
    .replace(/url\s*\([^)]*\)/gi, 'none')
    .replace(/expression\s*\(/gi, '(')
    .replace(/<\//g, '')
}

const describeTheme = (theme: AiTheme) =>
  [
    `Design direction: "${theme.name}". ${theme.direction}`,
    `Heading font: ${theme.headingFont}. Body font: ${theme.bodyFont}.`,
    `Palette: ${COLOR_KEYS.map((key) => `${key} ${theme.colors[key]}`).join(', ')}.`,
  ].join('\n')

/** Draws one section. Returns null rather than throwing, so one failure only costs its own section. */
async function drawSection(
  client: OpenAI,
  business: string,
  theme: AiTheme,
  brief: Brief,
  position: string,
): Promise<{ html: string; css: string } | null> {
  const prompt = [
    `The business: ${business}`,
    '',
    describeTheme(theme),
    '',
    `This section: ${brief.label}${brief.design ? ` (${brief.design})` : ''}, ${position}.`,
    '',
    'STRUCTURE:',
    brief.outline,
  ].join('\n')

  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    try {
      const raw = await ask(client, SECTION_SYSTEM, prompt, 0.8, 8000)
      const html = typeof raw.html === 'string' ? cleanHtml(raw.html).trim() : ''
      const css = typeof raw.css === 'string' ? cleanCss(raw.css).trim() : ''
      if (html) return { html, css }
    } catch {
      // A truncated or refused reply; the second attempt usually lands.
    }
  }
  return null
}

const fontLink = (theme: AiTheme) => {
  const families = [...new Set([theme.headingFont, theme.bodyFont])]
    .map((font) => `family=${font.replace(/ /g, '+')}:wght@400;500;600;700`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

/**
 * The slider behind every `.carousel` the model draws.
 *
 * Ours, not the model's: the document still strips any script the model writes
 * and the CSP below only admits this one by hash, so enabling scripts in the
 * frame doesn't mean running generated code. It drives the track by scrolling,
 * which keeps it honest whatever slide width the design chose, and holds still
 * when the viewer would rather it did — the same rule the wireframe carousels
 * follow.
 */
const SLIDER = `(function(){
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches
Array.prototype.forEach.call(document.querySelectorAll('.carousel'),function(carousel){
var track=carousel.querySelector('.track')
if(!track||track.children.length<2)return
var pages=function(){return Math.max(1,Math.ceil(track.scrollWidth/track.clientWidth-0.02))}
var at=function(){return Math.round(track.scrollLeft/track.clientWidth)}
var timer=null
var stop=function(){clearInterval(timer);timer=null}
var play=function(){if(!reduced&&!timer&&pages()>1)timer=setInterval(function(){go(at()+1>=pages()?0:at()+1)},5000)}
var hold=function(){stop();play()}
var go=function(i){track.scrollTo({left:Math.min(Math.max(i,0),pages()-1)*track.clientWidth,behavior:reduced?'auto':'smooth'})}
var dots=carousel.querySelector('.carousel-dots')
var buttons=[]
if(dots){for(var i=0;i<pages();i++){(function(n){var dot=document.createElement('button')
dot.type='button';dot.setAttribute('aria-label','Go to slide '+(n+1))
dot.addEventListener('click',function(){go(n);hold()})
dots.appendChild(dot);buttons.push(dot)})(i)}}
var mark=function(){var now=at();buttons.forEach(function(dot,i){dot.setAttribute('aria-current',i===now?'true':'false')})}
mark();track.addEventListener('scroll',mark,{passive:true})
var prev=carousel.querySelector('.carousel-prev'),next=carousel.querySelector('.carousel-next')
if(prev)prev.addEventListener('click',function(){go(at()-1);hold()})
if(next)next.addEventListener('click',function(){go(at()+1);hold()})
carousel.addEventListener('mouseenter',stop);carousel.addEventListener('mouseleave',play)
play()})})()`

/** The CSP admits the slider by hash, so nothing else inline can run even if it slips past `cleanHtml`. */
const SLIDER_HASH = `'sha256-${createHash('sha256').update(SLIDER).digest('base64')}'`

/** The page as one document: theme, base styles, then each section scoped under its own id. */
function documentFor(theme: AiTheme, business: string, sections: { id: string; html: string; css: string }[]) {
  const c = theme.colors
  const base = `
:root{--background:${c.background};--surface:${c.surface};--text:${c.text};--muted:${c.muted};--primary:${c.primary};--on-primary:${c.onPrimary};--accent:${c.accent};--border:${c.border};--header-bg:${c.headerBackground};--header-text:${c.headerText};--font-heading:'${theme.headingFont}',Georgia,serif;--font-body:'${theme.bodyFont}',system-ui,sans-serif}
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0}
body{min-width:${DESIGN_WIDTH}px;background:var(--background);color:var(--text);font-family:var(--font-body);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4,h5,h6{margin:0;font-family:var(--font-heading);line-height:1.15}
p,ul,ol,dl,dd,figure,blockquote{margin:0}
ul,ol{padding:0;list-style:none}
a{color:inherit;text-decoration:none}
svg{display:block}
button,input,textarea,select{font:inherit;color:inherit}
.img{display:block;background:linear-gradient(135deg,var(--primary),var(--accent))}
/* Defaults for the carousels the slider drives. The model's own rules are
   scoped under an id, so anything it sets here still wins. */
.carousel{position:relative}
.carousel .track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none}
.carousel .track::-webkit-scrollbar{display:none}
.carousel .track>*{flex:0 0 auto;scroll-snap-align:start}
.carousel-dots{display:flex;gap:8px;justify-content:center}
.carousel-dots button{width:10px;height:10px;padding:0;border:1px solid var(--border);border-radius:50%;background:none;cursor:pointer}
.carousel-dots button[aria-current="true"]{background:var(--primary);border-color:var(--primary)}
.carousel-prev,.carousel-next{cursor:pointer;background:none;border:0;padding:0}`

  const body = sections
    .map((s) => `<style>#s-${s.id}{${s.css}}</style>\n<div id="s-${s.id}">${s.html}</div>`)
    .join('\n')

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data:; script-src ${SLIDER_HASH}">
<meta name="viewport" content="width=${DESIGN_WIDTH}">
<title>${business.replace(/[<>&"]/g, '').slice(0, 80) || 'AI homepage'}</title>
<link rel="stylesheet" href="${fontLink(theme)}">
<style>${base}</style>
</head>
<body>
${body}
<script>${SLIDER}</script>
</body>
</html>`
}

export async function POST(request: Request) {
  let ids: string[] = []
  let layouts: Record<string, Choice> = {}
  let outlines: Record<string, unknown> = {}
  let business = ''

  try {
    const body = (await request.json()) as { ids?: unknown; layouts?: unknown; outlines?: unknown; business?: unknown }
    ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === 'string') : []
    layouts = body.layouts && typeof body.layouts === 'object' ? (body.layouts as Record<string, Choice>) : {}
    outlines = body.outlines && typeof body.outlines === 'object' ? (body.outlines as Record<string, unknown>) : {}
    business = typeof body.business === 'string' ? body.business.trim().slice(0, 400) : ''
  } catch {
    return Response.json({ error: 'That request didn’t arrive in one piece.' }, { status: 400 })
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ error: 'DEEPSEEK_API_KEY is not set on the server.' }, { status: 500 })
  }

  // The label and design name come from the catalogue, not the request; only
  // the measured outline has to be taken on trust, and it's capped in length.
  const briefs: Brief[] = ids.flatMap((id) => {
    const section = byId(id)
    const outline = outlines[id]
    if (!section || typeof outline !== 'string' || !outline.trim()) return []
    return [
      {
        id,
        label: section.label,
        design: section.options ? describeChoice(section, choiceOf(section, layouts)) : '',
        outline: outline.slice(0, 10000),
      },
    ]
  })
  if (!briefs.length) {
    return Response.json({ error: 'There are no sections on the page to design.' }, { status: 400 })
  }

  const client = clientFor()
  const described =
    business || 'A small professional services business. Choose a plausible trade and stay consistent across every section.'

  let theme: AiTheme
  try {
    // Hot, because this is the step that should differ every time it's asked.
    const raw = await ask(
      client,
      THEME_SYSTEM,
      `The business: ${described}\n\nThe homepage runs: ${briefs.map((b) => b.label).join(', ')}.`,
      1.3,
      800,
    )
    theme = themeFrom(raw)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'The designer didn’t answer.' })
  }

  const drawn = await Promise.all(
    briefs.map((brief, i) => {
      const before = briefs[i - 1]?.label
      const after = briefs[i + 1]?.label
      const position = [
        `section ${i + 1} of ${briefs.length}`,
        before ? `after the ${before}` : 'at the top of the page',
        after ? `before the ${after}` : 'at the bottom of the page',
      ].join(', ')
      return drawSection(client, described, theme, brief, position)
    }),
  )

  const sections = briefs.flatMap((brief, i) => (drawn[i] ? [{ id: brief.id, ...drawn[i] }] : []))
  if (!sections.length) {
    return Response.json({ error: 'The model returned nothing usable.' })
  }

  const design: AiDesign = {
    theme,
    html: documentFor(theme, business, sections),
    missing: briefs.filter((_, i) => !drawn[i]).map((brief) => brief.label),
  }
  return Response.json(design)
}

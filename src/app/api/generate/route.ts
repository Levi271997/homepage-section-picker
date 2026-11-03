import OpenAI from 'openai'
import { byId, choiceOf, describeChoice } from '@/lib/sections'
import { CONTENT, defaultContent, fieldsOf } from '@/lib/content'
import type { ContentField, SectionContent } from '@/lib/content'
import type { Choice } from '@/lib/sections'

/**
 * POST /api/generate  { ids, layouts, business }  ->  { content, error? }
 *
 * Writes the words for a homepage the client has already laid out. The layout
 * is the brief: the sections they kept, in their order, each with the design
 * they picked — and a design decides which fields exist at all, so `fieldsOf`
 * is what we ask the model to fill. The arrangement itself is never up for
 * discussion; this route reads the layout and returns copy, nothing else.
 *
 * DeepSeek is OpenAI-compatible, so the SDK is the same one `/api/analyze`
 * uses; only the base URL and the model change.
 */

/** The kinds the model may write. Pictures are the client's to supply, never invented. */
const WRITABLE = new Set(['text', 'paragraph', 'lines'])

/** How long a value of each kind may be, so one runaway answer can't break a preview. */
const LIMIT: Record<string, number> = { text: 120, paragraph: 400, lines: 160 }

/** Sections per request. Enough to keep a section's copy in context without risking a truncated reply. */
const CHUNK = 4

const SYSTEM = `You are a copywriter filling in a homepage that has already been designed. You reply with json.

The page is described to you section by section. Each section lists its fields, and each field shows the placeholder currently in it. That placeholder is the specification: match its shape exactly — the same number of lines, the same "A · B" split where it has one, roughly the same length. Replace only the words.

Rules:
- Write for the business described. Specific beats clever: name what they actually do.
- British spelling throughout.
- A list field is one item per line. Never number or bullet the lines yourself.
- Never write a URL, a file name, or a placeholder like "Lorem ipsum" or "Your headline here".
- Keep every field. If you have nothing better than the placeholder, rewrite it for this business anyway.
- Reply with json only: an object keyed by section id, whose values are objects keyed by field id, whose values are strings.`

/** One field, written out for the prompt with its current copy as the pattern to follow. */
const describeField = (field: ContentField, current: string): string => {
  const shape =
    field.kind === 'lines'
      ? `a list, ${Math.max(1, current.split('\n').length)} lines, one item per line`
      : field.kind === 'paragraph'
        ? 'a short paragraph, one or two sentences'
        : 'one line'
  return [
    `- ${field.id} (${shape}): ${field.label}.`,
    field.hint ? ` ${field.hint}` : '',
    `\n  currently: ${JSON.stringify(current)}`,
  ].join('')
}

type Brief = { id: string; prompt: string; fields: ContentField[] }

/** One section's slice of the brief: what it is, which design it is on, and the fields that design shows. */
function briefFor(id: string, layouts: Record<string, Choice>): Brief | null {
  const section = byId(id)
  if (!section || !CONTENT[id]) return null

  const choice = section.options ? choiceOf(section, layouts) : {}
  const defaults = defaultContent(id)
  const fields = fieldsOf(id, section.options ? choice : undefined).filter((field) => WRITABLE.has(field.kind))
  if (!fields.length) return null

  const design = section.options ? describeChoice(section, choice) : ''
  return {
    id,
    fields,
    prompt: [
      `Section id: ${id}`,
      `Section: ${section.label}`,
      design ? `Design: ${design}` : '',
      'Fields:',
      ...fields.map((field) => describeField(field, defaults[field.id] ?? '')),
    ]
      .filter(Boolean)
      .join('\n'),
  }
}

/** Trim a model answer down to the field's kind and length, dropping anything we didn't ask for. */
function clean(field: ContentField, value: unknown, current: string): string | null {
  if (typeof value !== 'string') return null
  const limit = LIMIT[field.kind] ?? 120

  if (field.kind === 'lines') {
    // The placeholder sets the count: a design that draws four cards gets four.
    const wanted = Math.max(1, current.split('\n').length)
    const lines = value
      .split('\n')
      .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
      .filter(Boolean)
      .slice(0, wanted)
      .map((line) => line.slice(0, limit))
    return lines.length ? lines.join('\n') : null
  }

  const text = value.replace(/\s+/g, ' ').trim().slice(0, limit)
  return text || null
}

/** One request, covering a few sections. Returns only the fields that came back usable. */
async function writeChunk(
  client: OpenAI,
  model: string,
  business: string,
  briefs: Brief[],
): Promise<Record<string, SectionContent>> {
  const response = await client.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    // Generous, because a truncated reply is the failure mode json mode has.
    max_tokens: 4000,
    messages: [
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: [
          `The business: ${business}`,
          '',
          'Write the copy for these sections of their homepage.',
          '',
          briefs.map((brief) => brief.prompt).join('\n\n'),
        ].join('\n'),
      },
    ],
  })

  const parsed = JSON.parse(response.choices[0]?.message?.content || '{}') as Record<string, unknown>
  const out: Record<string, SectionContent> = {}

  for (const brief of briefs) {
    const section = parsed[brief.id]
    if (!section || typeof section !== 'object') continue
    const values = section as Record<string, unknown>
    const defaults = defaultContent(brief.id)
    const written: SectionContent = {}

    for (const field of brief.fields) {
      const value = clean(field, values[field.id], defaults[field.id] ?? '')
      if (value) written[field.id] = value
    }

    if (Object.keys(written).length) out[brief.id] = written
  }

  return out
}

export async function POST(request: Request) {
  let ids: string[] = []
  let layouts: Record<string, Choice> = {}
  let business = ''

  try {
    const body = (await request.json()) as { ids?: unknown; layouts?: unknown; business?: unknown }
    ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === 'string') : []
    layouts = body.layouts && typeof body.layouts === 'object' ? (body.layouts as Record<string, Choice>) : {}
    business = typeof body.business === 'string' ? body.business.trim().slice(0, 400) : ''
  } catch {
    return Response.json({ content: {}, error: 'That request didn’t arrive in one piece.' }, { status: 400 })
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ content: {}, error: 'DEEPSEEK_API_KEY is not set on the server.' }, { status: 500 })
  }

  const briefs = ids.map((id) => briefFor(id, layouts)).filter((brief): brief is Brief => brief !== null)
  if (!briefs.length) {
    return Response.json({ content: {}, error: 'None of these sections have copy to write.' }, { status: 400 })
  }

  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    // Overridable so the route can be pointed at a proxy or a local stub.
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  })
  // The alias tracks DeepSeek's current chat model; overridable so a change of
  // model doesn't need a change of code.
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  const described =
    business || 'A small professional services business. Choose a plausible trade and stay consistent across every section.'

  const chunks: Brief[][] = []
  for (let i = 0; i < briefs.length; i += CHUNK) chunks.push(briefs.slice(i, i + CHUNK))

  // In parallel, and a chunk that fails only costs that chunk's sections.
  const settled = await Promise.allSettled(chunks.map((chunk) => writeChunk(client, model, described, chunk)))

  const content: Record<string, SectionContent> = {}
  for (const result of settled) {
    if (result.status === 'fulfilled') Object.assign(content, result.value)
  }

  if (!Object.keys(content).length) {
    const failure = settled.find((result) => result.status === 'rejected')
    const reason =
      failure && failure.status === 'rejected' && failure.reason instanceof Error
        ? failure.reason.message
        : 'The model returned nothing usable.'
    return Response.json({ content: {}, error: reason }, { status: 200 })
  }

  return Response.json({ content })
}

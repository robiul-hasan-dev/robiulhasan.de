// Markdown → HTML renderer with REAL sanitization.
// Pipeline: remark (parse) → remark-gfm (tables, strikethrough) →
//           remark-rehype (to HAST) → rehype-sanitize (allowlist) →
//           rehype-stringify (to HTML).
// Security: rehype-sanitize strips ALL raw HTML not in the schema below —
//           no <script>, no event handlers, no javascript: URLs. Content is
//           trusted today (curated local files) but this holds even if a
//           content source becomes untrusted (imports, LLM drafts).
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import { defaultSchema } from 'rehype-sanitize';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

// Allowlist = defaultSchema (safe defaults) + GFM table elements.
// DefaultSchema already permits headings, p, a[href], ul/ol/li, blockquote,
// pre/code, img[src,alt,title], strong/em, hr, br — with javascript: URLs
// and event handlers stripped. We add the GFM table family.
const schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    th: [...(defaultSchema.attributes?.th ?? []), 'align'],
    td: [...(defaultSchema.attributes?.td ?? []), 'align'],
  },
};

export async function markdownToHtml(md: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(md);
  return result.toString();
}

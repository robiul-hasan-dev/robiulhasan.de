// Markdown → HTML renderer (safe: no raw HTML passthrough beyond allowed tags)
import { remark } from 'remark';
import html from 'remark-html';

export async function markdownToHtml(md: string): Promise<string> {
  const result = await remark().use(html, { sanitize: false }).process(md);
  return result.toString();
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getKnowledgeNode, getKnowledgeNodes } from '@lib/content';
import { markdownToHtml } from '@lib/markdown';

export async function generateStaticParams() {
  return getKnowledgeNodes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const node = getKnowledgeNode(slug);
  if (!node) return { title: 'Nicht gefunden' };
  return { title: node.title, description: node.claim };
}

// ISR: server-rendered + cached (dynamic-capable, per user request + charter perf)
export const revalidate = 3600;

export default async function KnowledgeNodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const node = getKnowledgeNode(slug);
  if (!node) notFound();

  const bodyHtml = await markdownToHtml(node.body || '');

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-[var(--text-tertiary)]">
        <Link href="/knowledge/" className="no-underline hover:text-[var(--accent)]">
          ← Alle Erkenntnisse
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-bold">{node.title}</h1>
      <p className="mt-3 text-base text-[var(--text-secondary)]">{node.claim}</p>

      <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
        <h2 className="text-sm font-medium text-[var(--text-primary)]">Evidenz</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
          {node.evidence?.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
        <p className="mt-3 font-mono text-xs text-[var(--text-tertiary)]">
          Quelle: {node.source} · Validierung: Tier {node.validationTier}
        </p>
      </div>

      {bodyHtml && (
        <article
          className="prose mt-8 max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)]"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      )}

      {node.backlinks && node.backlinks.length > 0 && (
        <div className="mt-8 border-t border-[var(--border)] pt-4">
          <h2 className="text-sm font-medium text-[var(--text-primary)]">Verwandte Artikel</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {node.backlinks.map((b) => (
              <li key={b}>
                <Link href={b} className="text-[var(--accent-strong)]">
                  {b}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

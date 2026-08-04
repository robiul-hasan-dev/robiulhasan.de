import Link from 'next/link';
import { getKnowledgeNodes } from '@lib/content';

export const metadata = { title: 'Wissen' };

export default function KnowledgeIndexPage() {
  const nodes = getKnowledgeNodes();
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Wissen</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Kuratierte Erkenntnisse mit Evidenz und Validierungsstufe — keine Meinungen ohne Quelle.
      </p>
      <div className="mt-8 space-y-4">
        {nodes.map((node) => (
          <article key={node.slug} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
            <h2 className="text-lg font-medium">
              <Link href={`/knowledge/${node.slug}/`} className="no-underline hover:text-[var(--accent-strong)]">
                {node.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{node.claim}</p>
            <p className="mt-3 font-mono text-xs text-[var(--text-tertiary)]">
              Tier {node.validationTier} · {node.tags?.join(' · ')}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { getProjects } from '@lib/content';

export const metadata = { title: 'Projekte' };

export default function ProjectsIndexPage() {
  const projects = getProjects();
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <h1 className="text-3xl font-bold">Projekte</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Nachweisbare Arbeit — mit Live-Evidenz, nicht nur Behauptungen.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}/`}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
          >
            <h2 className="text-lg font-medium text-[var(--text-primary)]">{p.title}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{p.summary}</p>
            {p.tags?.length > 0 && (
              <p className="mt-3 font-mono text-xs text-[var(--text-tertiary)]">
                {p.tags.join(' · ')}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

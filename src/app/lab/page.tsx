import Link from 'next/link';

export const metadata = { title: 'Lab — Live-Demos' };

export default function LabIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Lab — Live-Demos</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Beweis statt Behauptung. Beide Demos laufen auf eigener Infrastruktur.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/lab/titan-search/"
          className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
        >
          <h2 className="text-lg font-medium text-[var(--text-primary)]">Titan Search</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Private KI-Suche über SearXNG — ohne Tracking, ohne Google.
          </p>
        </Link>
        <Link
          href="/lab/ask-titan/"
          className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
        >
          <h2 className="text-lg font-medium text-[var(--text-primary)]">Ask Titan</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Fragen an die kuratierte Wissensbasis — Antworten mit Quellenangaben.
          </p>
        </Link>
      </div>
    </div>
  );
}

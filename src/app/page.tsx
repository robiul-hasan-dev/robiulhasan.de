import Link from 'next/link';
import { getProjects, getPosts } from '@lib/content';

export default function HomePage() {
  const projects = getProjects().slice(0, 3);
  const posts = getPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Hero */}
      <section className="py-12">
        <p className="text-sm text-[var(--text-tertiary)]">
          Software & AI Engineer · München, Deutschland
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Ich baue selbst-gehostete KI-Systeme, die{' '}
          <span className="text-[var(--accent)]">nachweisbar funktionieren</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-[var(--text-secondary)]">
          Vollständig selbst-gehostete AI Operating Systeme, private Suchinfrastruktur und
          automatisierte Intelligence — dokumentiert, getestet, sicher. Kein Hype.
          Nachweisbare Arbeit.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/projects/"
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--on-accent)] no-underline hover:opacity-90"
          >
            Projekte ansehen
          </Link>
          <Link
            href="/about/"
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] no-underline hover:border-[var(--accent)]"
          >
            Über mich
          </Link>
        </div>
      </section>

      {/* Status strip */}
      <section
        aria-label="System-Status"
        className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
      >
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--success)]" />
          Systeme online
        </p>
        <p className="mt-1 text-sm text-[var(--text-tertiary)]">
          14 Abteilungen · 40+ Scripts · 23 Cron-Jobs
        </p>
        <p className="text-sm text-[var(--text-tertiary)]">100% selbst-gehostet · €0 Extra-Kosten</p>
      </section>

      {/* Featured work */}
      <section className="py-12" aria-labelledby="featured">
        <h2 id="featured" className="mb-6 text-2xl font-semibold">
          Ausgewählte Arbeit
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}/`}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
            >
              <h3 className="text-lg font-medium text-[var(--text-primary)]">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{p.summary}</p>
            </Link>
          ))}
          <Link
            href="/lab/"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
          >
            <h3 className="text-lg font-medium text-[var(--text-primary)]">Lab — Live-Demos</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Beweis statt Behauptung: Titan Search und Ask Titan live ausprobieren — direkt im
              Browser.
            </p>
          </Link>
        </div>
      </section>

      {/* Latest posts */}
      <section className="pb-12" aria-labelledby="latest">
        <h2 id="latest" className="mb-6 text-2xl font-semibold">
          Neueste Artikel
        </h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-[var(--border)] pb-4">
              <time className="font-mono text-xs text-[var(--text-tertiary)]">
                {new Date(post.date).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <h3 className="mt-1 text-lg font-medium">
                <Link href={`/blog/${post.slug}/`} className="no-underline hover:text-[var(--accent)]">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{post.summary}</p>
            </article>
          ))}
        </div>
        <p className="mt-4">
          <Link href="/blog/" className="text-sm font-medium">
            Alle Artikel →
          </Link>
        </p>
      </section>
    </div>
  );
}

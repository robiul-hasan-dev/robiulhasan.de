import Link from 'next/link';
import { getProjects, getPosts } from '@lib/content';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';

export default function HomePage() {
  const projects = getProjects().slice(0, 3);
  const posts = getPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Hero — the wow layer (Release 1/2) */}
      <Hero />

      {/* Status strip — live trust signal */}
      <Reveal>
        <section
          aria-label="System-Status"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="titan-pulse-dot mr-2 inline-block align-middle" />
            Systeme online
          </p>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            14 Abteilungen · 40+ Scripts · 23 Cron-Jobs
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            100% selbst-gehostet · €0 Extra-Kosten
          </p>
        </section>
      </Reveal>

      {/* Proof cards — evidence counter animation */}
      <Reveal className="py-12">
        <h2 className="mb-6 text-2xl font-semibold">Nachweisbare Arbeit</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <CountUp end={919} suffix="+" label="SSH-Brute-Force blockiert" />
          <CountUp end={14} suffix="" label="Aktive Abteilungen" />
          <CountUp end={40} suffix="+" label="Automatisierte Scripts" />
          <CountUp end={23} suffix="" label="Cron-Jobs im Betrieb" />
        </div>
      </Reveal>

      {/* Featured work */}
      <Reveal>
        <section className="pb-12" aria-labelledby="featured">
          <h2 id="featured" className="mb-6 text-2xl font-semibold">
            Ausgewählte Arbeit
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}/`}
                className="titan-float rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
              >
                <h3 className="text-lg font-medium text-[var(--text-primary)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {p.summary}
                </p>
              </Link>
            ))}
            <Link
              href="/lab/"
              className="titan-float rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
            >
              <h3 className="text-lg font-medium text-[var(--text-primary)]">
                Lab — Live-Demos
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Beweis statt Behauptung: Titan Search und Ask Titan live
                ausprobieren — direkt im Browser.
              </p>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Latest posts */}
      <Reveal>
        <section className="pb-12" aria-labelledby="latest">
          <h2 id="latest" className="mb-6 text-2xl font-semibold">
            Neueste Artikel
          </h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-[var(--border)] pb-4"
              >
                <time className="font-mono text-xs text-[var(--text-tertiary)]">
                  {new Date(post.date).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h3 className="mt-1 text-lg font-medium">
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="no-underline hover:text-[var(--accent)]"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {post.summary}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-4">
            <Link href="/blog/" className="text-sm font-medium">
              Alle Artikel →
            </Link>
          </p>
        </section>
      </Reveal>
    </div>
  );
}

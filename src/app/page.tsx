import Link from 'next/link';
import { getProjects, getPosts } from '@lib/content';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import ContactForm from '@/components/ContactForm';
import AIDemo from '@/components/AIDemo';

export default function HomePage() {
  const projects = getProjects().slice(0, 3);
  const posts = getPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Hero — the wow layer (Release 1/2) */}
      <Hero />

      {/* Status strip — safe public trust signal (no internal metrics) */}
      <Reveal>
        <section
          aria-label="Positionierung"
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="titan-pulse-dot mr-2 inline-block align-middle" />
            Offen für neue Projekte
          </p>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Software-Engineering · KI-Systeme · Sicherheit
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Dokumentiert · Getestet · Datenschutz-konform
          </p>
        </section>
      </Reveal>

      {/* Proof cards — public evidence only (no internal operations data) */}
      <Reveal className="py-[var(--space-24)]">
        <div className="divider-gradient" aria-hidden="true" />
        <p className="section-eyebrow">01 — Nachweise</p>
        <h2 className="mb-6 text-2xl font-semibold">Nachweisbare Arbeit</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <CountUp end={3} suffix="" label="Projekte dokumentiert" />
          <CountUp end={4} suffix="" label="Artikel veröffentlicht" />
          <CountUp end={5} suffix="" label="Wissens-Seiten" />
          <CountUp end={100} suffix="%" label="Datenschutz-konform (DSGVO)" />
        </div>
      </Reveal>

      {/* AI demo — the craft proof, purely client-side */}
      <Reveal className="py-[var(--space-24)]">
        <div className="divider-gradient" aria-hidden="true" />
        <p className="section-eyebrow">02 — Interaktiv</p>
        <AIDemo />
      </Reveal>

      {/* Featured work */}
      <Reveal>
        <section className="pb-[var(--space-24)]" aria-labelledby="featured">
          <div className="divider-gradient" aria-hidden="true" />
          <p className="section-eyebrow">03 — Arbeit</p>
          <h2 id="featured" className="mb-6 text-2xl font-semibold">
            Ausgewählte Arbeit
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}/`}
                className="titan-float shadow-ambient rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
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
              className="titan-float shadow-ambient rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
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
        <section className="pb-[var(--space-24)]" aria-labelledby="latest">
          <div className="divider-gradient" aria-hidden="true" />
          <p className="section-eyebrow">04 — Artikel</p>
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
                    className="no-underline hover:text-[var(--accent-strong)]"
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
      {/* Contact CTA — the conversion layer */}
      <Reveal>
        <section
          aria-labelledby="contact"
          className="shadow-ambient mb-[var(--space-24)] rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8"
        >
          <h2 id="contact" className="text-2xl font-semibold">
            Sprechen wir?
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
            Du hast ein Projekt, eine Idee oder eine Frage? Schreib mir — ich
            antworte in der Regel innerhalb von 48 Stunden.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </Reveal>
    </div>
  );
}

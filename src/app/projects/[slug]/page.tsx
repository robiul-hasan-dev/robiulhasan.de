import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@lib/content';
import { getFact, getWording } from '@lib/facts';
import { markdownToHtml } from '@lib/markdown';
import { StatusBadge } from '@/components/StatusBadge';

// v16: params is a Promise — must await
export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Nicht gefunden' };
  // Only a registry-cleared description may be exposed; never the raw summary.
  const description = project.factId ? getWording(project.factId) : null;
  return { title: project.title, description: description ?? undefined };
}

// ISR: server-rendered + cached (dynamic-capable, per user request + charter perf)
export const revalidate = 3600;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const fact = project.factId ? getFact(project.factId) : null;
  const lifecycle = fact?.lifecycle ?? project.status;
  const publicDescription = project.factId ? getWording(project.factId) : null;

  // An outcome is only a publishable RESULT when its evidenceId resolves to a
  // cleared registry fact (quantitative only if verified). Everything else is an
  // approach description, surfaced honestly as "evidence still pending".
  const verifiedOutcomes = project.outcomes.filter(
    (o) => o.evidenceId && getWording(o.evidenceId),
  );
  const hasUnverifiedClaims =
    project.outcomes.length > verifiedOutcomes.length || !publicDescription;

  const bodyHtml = project.body.trim()
    ? await markdownToHtml(project.body)
    : '';

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-[var(--text-tertiary)]">
        <Link
          href="/projects/"
          className="no-underline hover:text-[var(--accent-strong)]"
        >
          ← Alle Projekte
        </Link>
      </p>

      {/* Context + status */}
      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {project.title}
          </h1>
          <StatusBadge status={lifecycle} />
        </div>
        <p
          className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--text-tertiary)]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {project.dateRange}
        </p>
        {publicDescription && (
          <p className="mt-4 text-[var(--text-secondary)]">
            {publicDescription}
          </p>
        )}
      </header>

      <div className="mt-10 space-y-10">
        <Section title="Problem">
          <p className="text-[var(--text-secondary)]">{project.problem}</p>
        </Section>

        <Section title="Rolle">
          <p className="text-[var(--text-secondary)]">{project.role}</p>
        </Section>

        {project.constraints.length > 0 && (
          <Section title="Randbedingungen">
            <BulletList items={project.constraints} />
          </Section>
        )}

        {(project.methods.length > 0 || bodyHtml) && (
          <Section title="Vorgehen &amp; Architektur">
            {project.methods.length > 0 && (
              <BulletList items={project.methods} />
            )}
            {bodyHtml && (
              <article
                className="prose mt-4 max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-strong)] prose-strong:text-[var(--text-primary)]"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            )}
          </Section>
        )}

        {project.technologies.length > 0 && (
          <Section title="Technologie">
            <p
              className="text-sm text-[var(--text-tertiary)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {project.technologies.join(' · ')}
            </p>
          </Section>
        )}

        {/* Evidence available — verified, registry-backed results only */}
        {verifiedOutcomes.length > 0 && (
          <Section title="Belegte Ergebnisse">
            <ul className="space-y-3">
              {verifiedOutcomes.map((o) => (
                <li key={o.claim} className="text-[var(--text-secondary)]">
                  {o.claim}
                  {o.evidenceId && (
                    <span
                      className="mt-1 block text-xs text-[var(--text-tertiary)]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Beleg: {getWording(o.evidenceId)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Evidence unavailable — honest standing note */}
        {hasUnverifiedClaims && (
          <Section title="Belege ausstehend">
            <p className="text-[var(--text-secondary)]">
              Für dieses Projekt sind noch keine extern überprüfbaren Kennzahlen
              freigegeben. Die Angaben oben beschreiben den Ansatz, sie sind
              keine gemessenen Ergebnisse.
            </p>
          </Section>
        )}

        {/* Prototype / screenshots / demo — placeholder when none is ready */}
        <Section title="Prototyp &amp; Demo">
          {project.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              className="rounded-lg border border-[var(--border)]"
            />
          ) : (
            <p className="text-[var(--text-secondary)]">
              Kein veröffentlichungsreifer Prototyp oder Screenshot verfügbar.
            </p>
          )}
          {project.demoUrl && (
            <p className="mt-3">
              <a
                href={project.demoUrl}
                className="text-[var(--accent-strong)]"
                rel="noreferrer noopener"
                target="_blank"
              >
                Demo ansehen
              </a>
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}

/** One case-study section — rendered only when the caller has content for it,
 *  so the page never shows an empty "TODO" wall (directive §4.2). */
function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2
        className="text-sm uppercase tracking-[0.12em] text-[var(--text-tertiary)]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-[var(--text-secondary)]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

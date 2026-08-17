import Link from 'next/link';
import { getProjects } from '@lib/content';
import { getFact, getWording } from '@lib/facts';
import { StatusBadge } from '@/components/StatusBadge';

export const metadata = { title: 'Projekte' };

// Honest fallback when the truth registry does not (yet) clear a public
// description for a project. We NEVER fall back to the raw markdown summary,
// which may still carry unverified claims (directive §1.2).
const NO_PUBLIC_DESCRIPTION =
  'Öffentliche Beschreibung in Prüfung — Details folgen nach Freigabe.';

export default function ProjectsIndexPage() {
  const projects = getProjects();
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Projekte</h1>
      <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
        Projekte mit ehrlicher Statuskennzeichnung. Kennzahlen erscheinen nur,
        wenn sie belegt sind — nicht als Behauptung.
      </p>
      <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
        {projects.map((project) => {
          const fact = project.factId ? getFact(project.factId) : null;
          const lifecycle = fact?.lifecycle ?? project.status;
          const description = project.factId
            ? getWording(project.factId)
            : null;
          return (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}/`}
                className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-medium text-[var(--text-primary)]">
                    {project.title}
                  </h2>
                  <StatusBadge status={lifecycle} />
                </div>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">
                  {description ?? NO_PUBLIC_DESCRIPTION}
                </p>
                {project.technologies.length > 0 && (
                  <p
                    className="mt-4 text-xs text-[var(--text-tertiary)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {project.technologies.join(' · ')}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

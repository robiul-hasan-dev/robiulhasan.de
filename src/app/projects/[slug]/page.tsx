import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@lib/content';
import { markdownToHtml } from '@lib/markdown';

// v16: params is a Promise — must await
export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Nicht gefunden' };
  return { title: project.title, description: project.summary };
}

// ISR: server-rendered + cached (dynamic-capable, per user request + charter perf)
export const revalidate = 3600;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const bodyHtml = await markdownToHtml(project.body);
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-[var(--text-tertiary)]">
        <Link href="/projects/" className="no-underline hover:text-[var(--accent)]">
          ← Alle Projekte
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-bold">{project.title}</h1>
      {project.tags?.length > 0 && (
        <p className="mt-2 font-mono text-xs text-[var(--text-tertiary)]">
          {project.tags.join(' · ')}
        </p>
      )}

      <article
        className="prose mt-8 max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-strong)] prose-strong:text-[var(--text-primary)]"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </div>
  );
}

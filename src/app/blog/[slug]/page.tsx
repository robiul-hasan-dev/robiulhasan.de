import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@lib/content';
import { markdownToHtml } from '@lib/markdown';

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Nicht gefunden' };
  return { title: post.title, description: post.summary };
}

// ISR: server-rendered + cached (dynamic-capable, per user request + charter perf)
export const revalidate = 3600;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const bodyHtml = await markdownToHtml(post.body);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-[var(--text-tertiary)]">
        <Link href="/blog/" className="no-underline hover:text-[var(--accent-strong)]">
          ← Alle Artikel
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>
      <time className="mt-2 block font-mono text-xs text-[var(--text-tertiary)]">
        {new Date(post.date).toLocaleDateString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>

      <article
        className="prose mt-8 max-w-none text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-strong)] prose-strong:text-[var(--text-primary)]"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </div>
  );
}

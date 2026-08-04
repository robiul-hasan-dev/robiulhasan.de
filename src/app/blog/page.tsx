import Link from 'next/link';
import { getPosts } from '@lib/content';

export const metadata = { title: 'Blog' };

export default function BlogIndexPage() {
  const posts = getPosts();
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Praxis-Evidenz, Technologie-Analysen und Strategie — auf eigener Infrastruktur.
      </p>
      <div className="mt-8 space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-[var(--border)] pb-6">
            <time className="font-mono text-xs text-[var(--text-tertiary)]">
              {new Date(post.date).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h2 className="mt-1 text-xl font-medium">
              <Link href={`/blog/${post.slug}/`} className="no-underline hover:text-[var(--accent)]">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{post.summary}</p>
            {post.tags?.length > 0 && (
              <p className="mt-3 font-mono text-xs text-[var(--text-tertiary)]">
                {post.tags.join(' · ')}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

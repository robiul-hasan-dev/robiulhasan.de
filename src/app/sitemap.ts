import type { MetadataRoute } from 'next';
import { getProjects, getPosts, getKnowledgeNodes } from '@lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://robiulhasan.de';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projects/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/knowledge/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/lab/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/lab/titan-search/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/lab/ask-titan/`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/docs/adr/`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/impressum/`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/datenschutz/`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const projects = getProjects().map((p) => ({
    url: `${base}/projects/${p.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const posts = getPosts().map((p) => ({
    url: `${base}/blog/${p.slug}/`,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const knowledge = getKnowledgeNodes().map((n) => ({
    url: `${base}/knowledge/${n.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projects, ...posts, ...knowledge];
}

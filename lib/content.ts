// Content layer — typed access to markdown collections
// Ported from Astro content collections (ADR-017)
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Project {
  title: string;
  slug: string;
  status: string;
  stack: string[];
  tier: string;
  tags: string[];
  summary: string;
  body: string;
  date: string;
}

export interface Post {
  title: string;
  slug: string;
  published: boolean;
  date: string;
  tags: string[];
  summary: string;
  body: string;
}

export interface KnowledgeNode {
  title: string;
  slug: string;
  claim: string;
  evidence: string[];
  validationTier: string;
  source: string;
  date: string;
  tags: string[];
  backlinks?: string[];
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

function loadCollection<T>(dir: string): T[] {
  const fullDir = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullDir)) return [];
  return fs
    .readdirSync(fullDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(fullDir, f), 'utf8');
      const { data, content } = matter(raw);
      return { ...(data as object), body: content } as T;
    });
}

function normalizeDate(d: unknown): string {
  if (d instanceof Date) return d.toISOString();
  return String(d ?? '');
}

export function getProjects(): Project[] {
  return loadCollection<Project>('projects')
    .map((p) => ({ ...p, date: normalizeDate(p.date) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getPosts(): Post[] {
  return loadCollection<Post>('posts')
    .filter((p) => p.published)
    .map((p) => ({ ...p, date: normalizeDate(p.date) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getKnowledgeNodes(): KnowledgeNode[] {
  return loadCollection<KnowledgeNode>('knowledge')
    .map((n) => ({ ...n, date: normalizeDate(n.date) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getKnowledgeNode(slug: string): KnowledgeNode | undefined {
  return getKnowledgeNodes().find((n) => n.slug === slug);
}

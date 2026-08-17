// Content layer — typed access to markdown collections
// Ported from Astro content collections (ADR-017)
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { parseProject, type Project as ProjectFrontmatter } from './schema';

/** A published project: validated front matter (lib/schema) + rendered body.
 *  Loading goes THROUGH parseProject, so the build fails on a published project
 *  that is missing a required field (directive §7.2). */
export type Project = ProjectFrontmatter & { body: string };

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

/** Load, validate, and return every PUBLISHED project (drafts are skipped and
 *  not strictly validated). Front matter that fails the schema throws here,
 *  failing the build with the offending file named (directive §7.2). */
export function getProjects(): Project[] {
  const dir = path.join(CONTENT_DIR, 'projects');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      const { data, content } = matter(raw);
      return { file: f, data: data as Record<string, unknown>, body: content };
    })
    .filter(({ data }) => data.published === true)
    .map(({ file, data, body }) => {
      try {
        // gray-matter parses ISO dates into Date objects; the schema wants a
        // plain ISO string, so normalize before validating.
        const frontmatter = parseProject({
          ...data,
          date: normalizeDate(data.date).slice(0, 10),
        });
        return { ...frontmatter, body };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(
          `Invalid project front matter in content/projects/${file}: ${message}`,
        );
      }
    })
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

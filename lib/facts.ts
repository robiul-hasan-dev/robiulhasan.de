// Truth-registry loader — Master Implementation Directive §1.2 (Truth protocol).
//
// Reads content/facts.yaml, validates it against the Zod truth schema in
// lib/schema.ts (build FAILS on a malformed or dishonest registry), and exposes
// the publishable public wording keyed by fact id. Content/UI code renders
// claims THROUGH this module — it never hardcodes marketing strings.
//
// No new dependency: facts.yaml is a pure YAML document, parsed here through
// gray-matter's bundled YAML engine (gray-matter is already used by lib/content
// for markdown front matter) by presenting the file as a front-matter block.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  parseTruthRegistry,
  publishableWording,
  type TruthRegistry,
} from './schema';

const FACTS_PATH = path.join(process.cwd(), 'content', 'facts.yaml');

let cached: TruthRegistry | null = null;

/** Load + validate the truth registry once per process (build/render time). */
export function getTruthRegistry(): TruthRegistry {
  if (cached) return cached;
  const raw = fs.readFileSync(FACTS_PATH, 'utf8');
  // Wrap the YAML document as a front-matter block so gray-matter's YAML engine
  // parses it. facts.yaml contains no bare `---` line, so this is unambiguous.
  const { data } = matter(`---\n${raw}\n---\n`);
  // gray-matter's YAML engine parses ISO dates (YYYY-MM-DD) into Date objects;
  // the schema requires plain ISO strings. NOTE: JSON.stringify's replacer
  // cannot do this — Date.toJSON() runs BEFORE the replacer, so the replacer
  // only ever sees the serialized string. Walk the structure manually.
  const normalizeDates = (value: unknown): unknown => {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (Array.isArray(value)) return value.map(normalizeDates);
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [
          k,
          normalizeDates(v),
        ]),
      );
    }
    return value;
  };
  cached = parseTruthRegistry(normalizeDates(data));
  return cached;
}

/** All publishable public wording, keyed by fact id (verified/owner-confirmed). */
export function getPublishableWording(): Record<string, string> {
  return publishableWording(getTruthRegistry());
}

/**
 * Public wording for a single fact id — but ONLY when that fact is cleared for
 * publication. Returns null when the id is unknown or the claim is withheld
 * (needs-verification / private). Callers MUST handle null by omitting the
 * claim; they must never substitute an invented fallback (directive §1.2).
 */
export function getWording(id: string): string | null {
  return getPublishableWording()[id] ?? null;
}

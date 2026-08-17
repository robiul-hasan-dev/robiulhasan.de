// =============================================================================
// TYPED CONTENT + TRUTH-REGISTRY SCHEMAS — robiulhasan.de
// Master Implementation Directive §1.2 (Truth protocol) and §7.2 (Content model).
//
// SKELETON (SLICE 1): this file defines the schemas and parse helpers that make
// the build FAIL on dishonest or malformed content. It is intentionally NOT yet
// wired into a loader — reading content/facts.yaml and the MDX/project files and
// calling these validators at build time is a later slice (see the note in
// content/facts.yaml). Until then this is the single, typed source of the rules.
//
// Design goals (directive §7.2): "Build must fail when required content,
// alternative text, valid locale linkage or status is absent." The refinements
// below encode exactly that, plus the truth-protocol rule that unverified or
// private claims can never carry public wording.
//
// zod ^4.4.3 is already a project dependency; nothing new is installed here.
// =============================================================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** ISO 8601 calendar date, e.g. 2026-08-17. Kept as a string for YAML/JSON
 *  round-tripping; validated by shape rather than parsed into a Date. */
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be ISO 8601 (YYYY-MM-DD)');

/** Kebab-case identifier used for fact ids and content slugs. */
export const kebabId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Id/slug must be kebab-case');

// ---------------------------------------------------------------------------
// Truth registry (content/facts.yaml)
// ---------------------------------------------------------------------------

/** Evidence status. `verified` / `owner-confirmed` may be published; the other
 *  two must never carry public wording. Mirrors the facts.yaml header. */
export const FACT_STATUSES = [
  'verified',
  'owner-confirmed',
  'needs-verification',
  'private',
] as const;
export type FactStatus = (typeof FACT_STATUSES)[number];

/** Visible lifecycle labels for project-shaped claims (directive §1.2). */
export const LIFECYCLES = [
  'concept',
  'prototype',
  'in-progress',
  'field-experience',
  'production',
] as const;
export type Lifecycle = (typeof LIFECYCLES)[number];

/** Statuses whose claims are allowed on a public surface. */
const PUBLISHABLE: ReadonlySet<FactStatus> = new Set([
  'verified',
  'owner-confirmed',
]);

const factBase = z.object({
  id: kebabId,
  claim: z.string().min(1, 'claim is required'),
  status: z.enum(FACT_STATUSES),
  // `evidence` may legitimately read "OWNER INPUT REQUIRED" for owner-confirmed
  // wording awaiting final sign-off, so it is only required to be non-empty.
  evidence: z.string().min(1, 'evidence is required'),
  publicWording: z.string().min(1).nullable(),
  lastVerified: isoDate.nullable(),
  lifecycle: z.enum(LIFECYCLES).optional(),
  note: z.string().optional(),
});

/**
 * A single truth-registry entry with the cross-field truth rules enforced:
 *   - needs-verification / private => publicWording MUST be null (never leak an
 *     unverified or private claim onto the page).
 *   - verified / owner-confirmed    => publicWording AND lastVerified required
 *     (a publishable claim must say something and be dated).
 */
export const factSchema = factBase.superRefine((fact, ctx) => {
  const publishable = PUBLISHABLE.has(fact.status);

  if (!publishable && fact.publicWording !== null) {
    ctx.addIssue({
      code: 'custom',
      path: ['publicWording'],
      message: `status "${fact.status}" must not carry public wording (set publicWording: null)`,
    });
  }

  if (publishable) {
    if (fact.publicWording === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['publicWording'],
        message: `status "${fact.status}" requires publicWording`,
      });
    }
    if (fact.lastVerified === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['lastVerified'],
        message: `status "${fact.status}" requires a lastVerified date`,
      });
    }
  }
});
export type Fact = z.infer<typeof factSchema>;

export const truthRegistrySchema = z.object({
  version: z.number().int().positive(),
  lastReviewed: isoDate,
  facts: z.array(factSchema).min(1),
});
export type TruthRegistry = z.infer<typeof truthRegistrySchema>;

// ---------------------------------------------------------------------------
// Project content model (directive §7.2)
// ---------------------------------------------------------------------------

export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

/** Image asset — alt text is REQUIRED so the build fails on missing alt
 *  (directive §7.2 / §11 accessibility). */
export const imageAssetSchema = z.object({
  src: z.string().min(1, 'image src is required'),
  alt: z.string().min(1, 'alt text is required'),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type ImageAsset = z.infer<typeof imageAssetSchema>;

/**
 * A single project outcome. `evidenceId` links the claim back to a truth-registry
 * fact; only an outcome whose evidenceId resolves to a PUBLISHABLE fact may be
 * shown as a verified (quantitative) result. An unlinked outcome is a qualitative
 * description of the approach — never presented as a measured metric (§1.2).
 */
export const projectOutcomeSchema = z.object({
  claim: z.string().min(1),
  evidenceId: kebabId.optional(),
});
export type ProjectOutcome = z.infer<typeof projectOutcomeSchema>;

/**
 * Published project contract (directive §7.2). lib/content parses every
 * PUBLISHED project's front matter through this schema, so the BUILD FAILS when a
 * published project is missing its status (lifecycle), role, problem, or any
 * other required field — dishonest-by-omission content cannot ship.
 *
 * `status` carries the visible lifecycle label; `factId` links the project to
 * its truth-registry entry so the public description and any measurable results
 * render THROUGH the registry rather than from the raw markdown.
 */
export const projectSchema = z.object({
  slug: kebabId,
  title: z.string().min(1),
  summary: z.string().min(1),
  status: z.enum(LIFECYCLES),
  role: z.string().min(1),
  date: isoDate,
  dateRange: z.string().min(1),
  problem: z.string().min(1),
  constraints: z.array(z.string().min(1)).default([]),
  methods: z.array(z.string().min(1)).default([]),
  outcomes: z.array(projectOutcomeSchema).default([]),
  technologies: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  cover: imageAssetSchema.optional(),
  demoUrl: z.string().url().optional(),
  repositoryUrl: z.string().url().optional(),
  factId: kebabId.optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});
export type Project = z.infer<typeof projectSchema>;

// ---------------------------------------------------------------------------
// Parse helpers — throw (fail the build) on invalid input.
// A YAML/MDX loader will feed these in a later slice; keeping them here means
// the failure surface is defined now, before any content is wired in.
// ---------------------------------------------------------------------------

export function parseTruthRegistry(data: unknown): TruthRegistry {
  return truthRegistrySchema.parse(data);
}

export function parseProject(data: unknown): Project {
  return projectSchema.parse(data);
}

/** Convenience: the subset of registry facts that are cleared for publication,
 *  keyed by id, with non-null public wording. Content code should read wording
 *  through this rather than hardcoding strings. */
export function publishableWording(
  registry: TruthRegistry,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const fact of registry.facts) {
    if (PUBLISHABLE.has(fact.status) && fact.publicWording !== null) {
      out[fact.id] = fact.publicWording;
    }
  }
  return out;
}

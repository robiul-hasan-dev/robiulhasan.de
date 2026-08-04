#!/usr/bin/env node
/**
 * Post-build CSP hash generator (ADR-017)
 * Next.js inlines hydration scripts whose content is stable per build.
 * This script scans the built HTML, computes sha256 hashes of every inline
 * script, and writes them to .next/csp-hashes.json for next.config.ts to read.
 * Restores STATIC rendering + full caching (no nonce → no dynamic rendering).
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const serverDir = join(process.cwd(), '.next', 'standalone', '.next', 'server', 'app');
// NOTE: scan the STANDALONE output — that's what the container actually serves.
// The source .next/server can drift (chunk hashes differ between build passes).

function walk(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

const htmlFiles = walk(serverDir);
const hashes = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  // Inline scripts (no src attribute)
  const scripts = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g) || [];
  for (const s of scripts) {
    const content = s.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
    const hash = createHash('sha256').update(content).digest('base64');
    hashes.add(`'sha256-${hash}'`);
  }
}

// The no-FOUC theme script is in the layout head — included above if rendered statically.
const output = {
  generated: new Date().toISOString(),
  scriptSrcHashes: [...hashes],
};
writeFileSync(join(process.cwd(), '.next', 'csp-hashes.json'), JSON.stringify(output, null, 2));
console.log(`[csp-hashes] ${hashes.size} inline script hash(es) computed → .next/csp-hashes.json`);

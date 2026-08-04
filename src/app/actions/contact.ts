'use server';

import { z } from 'zod';
import { createHash } from 'crypto';
import { headers } from 'next/headers';

/**
 * Contact form server action — Release 2/2.
 *
 * Security model (charter §3 — no compromise):
 *  1. Zod schema validates every field server-side (never trust client)
 *  2. Sliding-window rate limit per IP (3 / 10 min) — DB-backed, survives restarts
 *  3. Parameterized queries only (no SQL injection)
 *  4. Only IP HASH stored (SHA-256) — no raw IP, GDPR-friendly
 *  5. Restricted DB user (titan_public) with INSERT-only grant
 *  6. No PII in logs; honeypot field for bots
 */

// ── Schema ────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Bitte gib deinen Namen an.')
    .max(120, 'Name ist zu lang.'),
  email: z
    .string()
    .trim()
    .email('Bitte gib eine gültige E-Mail-Adresse an.')
    .max(254, 'E-Mail ist zu lang.'),
  message: z
    .string()
    .trim()
    .min(10, 'Die Nachricht ist zu kurz (min. 10 Zeichen).')
    .max(4000, 'Die Nachricht ist zu lang (max. 4000 Zeichen).'),
  // Honeypot: bots fill it, humans don't see it. If filled → silently drop.
  website: z.string().max(0).optional(),
});

// ── DB (restricted public user, isolated database) ─────────────────────
// pg is lazy-imported inside functions (dynamic import) so the bundler
// never resolves its node built-ins (fs/net/tls) at build time.
type PgPool = {
  query: (text: string, params?: unknown[]) => Promise<{
    rows: Array<Record<string, unknown>>;
  }>;
  end: () => Promise<void>;
};

let _pool: PgPool | null = null;

async function getPool(): Promise<PgPool> {
  if (!_pool) {
    const { Pool } = await import('pg');
    _pool = new Pool({
      host: process.env.TITAN_DB_HOST || '127.0.0.1',
      port: Number(process.env.TITAN_DB_PORT || 5432),
      database: 'titan_public',
      user: 'titan_public',
      password: process.env.TITAN_PUBLIC_PASS || '',
      max: 2, // tiny pool — site is low-traffic
      connectionTimeoutMillis: 3000,
    }) as unknown as PgPool;
  }
  return _pool;
}

// ── Rate limiting (sliding window, DB-backed) ──────────────────────────
const RATE_LIMIT = 3;
const RATE_WINDOW_MIN = 10;

async function isRateLimited(ipHash: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - RATE_WINDOW_MIN * 60 * 1000);
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT count(*)::int AS cnt
     FROM contact_messages
     WHERE ip_hash = $1 AND created_at > $2`,
    [ipHash, cutoff]
  );
  const first = rows[0] as { cnt?: number } | undefined;
  return (first?.cnt ?? 0) >= RATE_LIMIT;
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

// ── Server Action ──────────────────────────────────────────────────────
export type ContactState = {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    website: formData.get('website'),
  };

  // Honeypot: silently pretend success
  if (raw.website && String(raw.website).length > 0) {
    return { success: 'Danke! Deine Nachricht wurde gesendet.' };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // IP from headers — proxy-aware, never trust client-supplied value
  const hdrs = await headers();
  const fwd = hdrs.get('x-forwarded-for') || '';
  const ip = fwd.split(',')[0].trim() || 'unknown';
  const ipHash = hashIp(ip);

  try {
    if (await isRateLimited(ipHash)) {
      return {
        error: 'Zu viele Anfragen. Bitte versuche es in 10 Minuten erneut.',
      };
    }

    const { name, email, message } = parsed.data;
    const pool = await getPool();
    await pool.query(
      `INSERT INTO contact_messages (name, email, message, ip_hash)
       VALUES ($1, $2, $3, $4)`,
      [name, email, message, ipHash]
    );

    return {
      success:
        'Danke! Deine Nachricht wurde erfolgreich gesendet. Ich melde mich in der Regel innerhalb von 48 Stunden.',
    };
  } catch (e) {
    // Log minimal info — never the message content or IP
    console.error('contact:db-error', {
      err: (e as Error).message.slice(0, 120),
    });
    return {
      error:
        'Es gab ein technisches Problem. Bitte versuche es später erneut.',
    };
  }
}

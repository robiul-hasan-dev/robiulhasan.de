'use client';

import { useEffect, useState } from 'react';

const FRESHNESS_WINDOW_MS = 90 * 60 * 1000; // 90 minutes

type ShieldState = 'checking' | 'online' | 'unavailable';

interface ShieldJson {
  generated_at: string;
  status: string;
  last_check: string;
}

function isFresh(generatedAt: string): boolean {
  const ts = Date.parse(generatedAt);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts <= FRESHNESS_WINDOW_MS;
}

/**
 * ShieldStrip — small live-status line. Fetches /data/shield.json once on
 * mount. Only ever claims "online" after a confirmed, fresh, operational
 * reading; any other case (stale data, fetch failure, bad shape) surfaces
 * as "currently unavailable" rather than a false reassurance.
 */
export default function ShieldStrip() {
  const [state, setState] = useState<ShieldState>('checking');

  useEffect(() => {
    let cancelled = false;

    fetch('/data/shield.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json() as Promise<ShieldJson>;
      })
      .then((data) => {
        if (cancelled) return;
        const ok = data.status === 'operational' && isFresh(data.generated_at);
        setState(ok ? 'online' : 'unavailable');
      })
      .catch(() => {
        if (cancelled) return;
        setState('unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'checking') {
    return (
      <div role="status" aria-live="polite" className="flex items-center gap-2 text-sm">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-[var(--text-tertiary)]"
        />
        <span className="text-[var(--text-tertiary)]">Status wird geprüft …</span>
      </div>
    );
  }

  if (state === 'online') {
    return (
      <div role="status" aria-live="polite" className="flex items-center gap-2 text-sm">
        <span aria-hidden="true" className="titan-pulse-dot" />
        <span className="text-[var(--text-secondary)]">Systeme online</span>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="flex items-center gap-2 text-sm">
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full bg-[var(--warning)]"
      />
      <span className="text-[var(--warning)]">Status derzeit nicht verfügbar</span>
    </div>
  );
}

'use client';

// Titan Search demo — calls FastAPI via Caddy /lab/api/search (unchanged)
import { useState } from 'react';

interface Result {
  title: string;
  url: string;
  snippet: string;
}

interface ApiResponse {
  results: Result[];
  ai_disclosure?: string;
  error?: string;
}

export default function TitanSearchDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [status, setStatus] = useState('Bereit');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setLoading(true);
    setStatus('Suche läuft…');
    try {
      const res = await fetch(`/lab/api/search?q=${encodeURIComponent(q)}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as ApiResponse;
        setStatus(data.error || `Fehler ${res.status}`);
        setResults([]);
        return;
      }
      const data = (await res.json()) as ApiResponse;
      setResults(data.results || []);
      setStatus(`${data.results?.length || 0} Ergebnisse`);
    } catch {
      setStatus('Wissensbasis nicht erreichbar');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Lab: Titan Search</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Private KI-Suche über SearXNG — ohne Tracking, ohne Google.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suchbegriff eingeben…"
          aria-label="Suchbegriff"
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--on-accent)] disabled:opacity-50"
        >
          {loading ? '…' : 'Suchen'}
        </button>
      </form>

      <p aria-live="polite" className="mt-4 text-sm text-[var(--text-tertiary)]">
        {status}
      </p>

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map((r, i) => (
            <article key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <h2 className="text-base font-medium">
                <a href={r.url} className="no-underline hover:text-[var(--accent-strong)]" rel="noopener noreferrer" target="_blank">
                  {r.title}
                </a>
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{r.snippet}</p>
              <p className="mt-1 font-mono text-xs text-[var(--text-tertiary)]">{r.url}</p>
            </article>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-[var(--text-tertiary)]">
        Hinweis: Ergebnisse werden von einer KI-Suchmaschine erzeugt (Art. 50 EU AI Act).
      </p>
    </div>
  );
}

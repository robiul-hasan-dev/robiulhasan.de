'use client';

// Ask Titan demo — RAG over curated public corpus via Caddy /lab/api/ask (unchanged)
import { useState } from 'react';

interface Citation {
  title: string;
  url: string;
  source: string;
  score: number;
}

interface ApiResponse {
  answer?: string;
  citations?: Citation[];
  confidence?: number;
  disclosure?: string;
  error?: string;
}

export default function AskTitanDemo() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState<Citation[]>([]);
  const [status, setStatus] = useState('Bereit');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setLoading(true);
    setStatus('Frage wird beantwortet…');
    try {
      const res = await fetch(`/lab/api/ask?q=${encodeURIComponent(q)}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as ApiResponse;
        setStatus(data.error || `Fehler ${res.status}`);
        setAnswer('');
        setCitations([]);
        return;
      }
      const data = (await res.json()) as ApiResponse;
      setAnswer(data.answer || '');
      setCitations(data.citations || []);
      setStatus('Antwort bereit');
    } catch {
      setStatus('Wissensbasis nicht erreichbar');
      setAnswer('');
      setCitations([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Lab: Ask Titan</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Fragen an die kuratierte Wissensbasis dieser Seite — Antworten mit Quellenangaben.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Was ist Titan/OS?"
          aria-label="Frage"
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--on-accent)] disabled:opacity-50"
        >
          {loading ? '…' : 'Fragen'}
        </button>
      </form>

      <p aria-live="polite" className="mt-4 text-sm text-[var(--text-tertiary)]">
        {status}
      </p>

      {answer && (
        <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
          <p className="whitespace-pre-wrap text-[var(--text-primary)]">{answer}</p>
        </div>
      )}

      {citations.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-medium text-[var(--text-primary)]">Quellen</h2>
          <ul className="mt-2 space-y-1">
            {citations.map((c, i) => (
              <li key={i} className="text-sm">
                <a href={c.url} className="text-[var(--accent-strong)]" rel="noopener noreferrer" target="_blank">
                  {c.title}
                </a>{' '}
                <span className="font-mono text-xs text-[var(--text-tertiary)]">
                  (Konfidenz {Math.round(c.score * 100)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8 text-xs text-[var(--text-tertiary)]">
        Hinweis: Antworten werden von einem KI-System erzeugt (Art. 50 EU AI Act). Die Wissensbasis
        enthält ausschließlich veröffentlichte Inhalte.
      </p>
    </div>
  );
}

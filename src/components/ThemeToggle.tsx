'use client';

// Theme toggle — client component (ADR-014: dark default + light, system-aware)
// No-FOUC handled by inline script in layout (before paint)

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>('dark');

  useEffect(() => {
    // Sync with what the no-FOUC script set
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  function toggle() {
    // Functional update — no stale closure on rapid clicks
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* private mode — ignore */
      }
      return next;
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Zum hellen Theme wechseln' : 'Zum dunklen Theme wechseln'}
      title={theme === 'dark' ? 'Helles Theme' : 'Dunkles Theme'}
      className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

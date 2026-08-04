'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * AIDemo — "Frag das System" interactive preview.
 * Purely client-side: no fetch, no API, no backend. Pre-written German
 * answers (sourced only from public site content) type out on click.
 */

type Question = {
  q: string;
  a: string;
};

const QUESTIONS: Question[] = [
  {
    q: 'Was baust du?',
    a: 'Ich baue vollständig selbst-gehostete KI-Systeme: private Suchinfrastruktur, automatisierte Intelligence-Workflows und Multi-Agenten-Architekturen. Alles dokumentiert, getestet und DSGVO-konform — kein Hype, nachweisbare Arbeit.',
  },
  {
    q: 'Wo liegen deine Stärken?',
    a: 'Docker-Orchestrierung, PostgreSQL mit pgvector, Linux- und SSH-Sicherheit, Python-Automatisierung und KI-Agenten-Systeme — jede Fähigkeit ist auf der Über-mich-Seite mit konkreter Evidenz belegt.',
  },
  {
    q: 'Wie arbeitest du?',
    a: 'Arbeit spricht lauter als Worte: Jede Fähigkeit ist mit nachweisbarer Evidenz belegt statt bloßer Behauptung. Ich dokumentiere, teste und sichere jedes System, bevor es live geht.',
  },
  {
    q: 'Wer bist du?',
    a: 'Software- und KI-Ingenieur mit humanitärem Hintergrund — Stationen bei IOM, DRC und MSF, heute in München. Ich baue KI-Systeme, die nachweisbar funktionieren.',
  },
];

const TYPE_SPEED_MS = 18;

export default function AIDemo() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [displayed, setDisplayed] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const ask = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const answer = QUESTIONS[index].a;
    setActiveIndex(index);

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      setDisplayed(answer);
      return;
    }

    setDisplayed('');
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setDisplayed(answer.slice(0, i));
      if (i >= answer.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, TYPE_SPEED_MS);
  };

  return (
    <section aria-labelledby="ai-demo-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="ai-demo-heading" className="text-2xl font-semibold">
          Frag das System
        </h2>
        <p className="text-xs text-[var(--text-tertiary)]">
          Demo — interaktive Vorschau ·{' '}
          <Link href="/lab/" className="font-medium">
            echte Tools im Lab →
          </Link>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUESTIONS.map((item, index) => (
          <button
            key={item.q}
            type="button"
            onClick={() => ask(index)}
            aria-pressed={activeIndex === index}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            {item.q}
          </button>
        ))}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="mt-4 min-h-[6rem] rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm text-[var(--text-secondary)]"
      >
        {activeIndex === null ? (
          <span className="text-[var(--text-tertiary)]">
            Wähle eine Frage, um eine Antwort zu sehen.
          </span>
        ) : (
          <p>{displayed}</p>
        )}
      </div>
    </section>
  );
}

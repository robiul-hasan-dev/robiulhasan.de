'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy-load 3D — keeps it out of the initial bundle
const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => null,
});

/**
 * Hero — the "3-second decision" section.
 * Serves: mass visitor (clarity in 3s) + searcher (trust signals).
 *
 * Design: premium-minimal. Animated gradient background + 3D core
 * (gated by capability) + precise German copy. No hype.
 */
export default function Hero() {
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    // Gate 3D: WebGL support + enough device memory + no reduced-motion.
    // DEFER until after first paint (requestIdleCallback) so the 231KB three.js
    // chunk never competes with LCP — it loads only when the browser is idle.
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const webgl = (() => {
      try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
      } catch {
        return false;
      }
    })();
    const mem = (navigator as unknown as { deviceMemory?: number })
      .deviceMemory;
    const enoughMem = typeof mem === 'undefined' || mem >= 4;

    if (reduceMotion || !webgl || !enoughMem) return;

    const load3D = () => setShow3D(true);
    const idle =
      'requestIdleCallback' in window
        ? (window as unknown as {
            requestIdleCallback: (cb: () => void, opts?: object) => number;
          }).requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 500);

    // Small delay after idle → well after LCP (typically <2.5s)
    let timer: ReturnType<typeof setTimeout> | null = null;
    const id = idle(() => {
      timer = setTimeout(load3D, 1500);
    });
    return () => {
      if (typeof id === 'number') {
        (window as unknown as { cancelIdleCallback: (i: number) => void })
          .cancelIdleCallback?.(id);
      } else {
        clearTimeout(id);
      }
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <section
      aria-label="Intro"
      className="relative overflow-hidden py-16 md:py-24"
    >
      {/* Animated gradient background (CSS, cheap) */}
      <div
        aria-hidden="true"
        className="titan-gradient-shift absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, var(--bg) 0%, var(--bg-elevated) 50%, var(--bg) 100%)',
        }}
      />

      {/* 3D core — only when capable */}
      {show3D && <Hero3D />}

      {/* Content layer */}
      <div className="relative mx-auto max-w-4xl px-6">
        <p className="titan-reveal visible text-sm text-[var(--text-tertiary)]">
          Software &amp; AI Engineer · München, Deutschland
        </p>
        <h1 className="titan-reveal visible mt-3 text-3xl font-bold text-[var(--text-primary)] md:text-5xl">
          Ich baue selbst-gehostete KI-Systeme, die{' '}
          <span className="text-[var(--accent)]">nachweisbar funktionieren</span>
          .
        </h1>
        <p className="titan-reveal visible mt-4 max-w-2xl text-base text-[var(--text-secondary)] md:text-lg">
          Vollständig selbst-gehostete AI Operating Systeme, private
          Suchinfrastruktur und automatisierte Intelligence — dokumentiert,
          getestet, sicher. Kein Hype. Nachweisbare Arbeit.
        </p>
        <div className="titan-reveal visible mt-8 flex flex-wrap gap-4">
          <Link
            href="/projects/"
            className="titan-float rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--on-accent)] no-underline hover:opacity-90"
          >
            Projekte ansehen
          </Link>
          <Link
            href="/about/"
            className="titan-float rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] no-underline hover:border-[var(--accent)]"
          >
            Über mich
          </Link>
        </div>
      </div>
    </section>
  );
}

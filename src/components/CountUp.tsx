'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CountUp — animated number counter for proof cards.
 * Starts when scrolled into view. Respects prefers-reduced-motion (jumps to end).
 *
 * Usage:
 *   <CountUp end={42} suffix="+" label="Beispiel-Zahl" />
 */
export default function CountUp({
  end,
  duration = 1200,
  prefix = '',
  suffix = '',
  label = '',
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;

      // Reduced motion: jump straight to end
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setValue(end);
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        // easeOutCubic for a satisfying deceleration
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="titan-counter">
      <span className="font-mono text-3xl font-bold text-[var(--accent)] md:text-4xl">
        {prefix}
        {value.toLocaleString('de-DE')}
        {suffix}
      </span>
      {label && (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{label}</p>
      )}
    </div>
  );
}

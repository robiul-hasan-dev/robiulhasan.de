'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Reveal — scroll-triggered reveal wrapper.
 * Uses IntersectionObserver (no animation lib needed) + CSS from motion.css.
 * Respects prefers-reduced-motion via CSS.
 *
 * Usage:
 *   <Reveal>...</Reveal>              // single element
 *   <Reveal stagger>...</Reveal>      // stagger children
 */
export default function Reveal({
  children,
  stagger = false,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  stagger?: boolean;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If reduced motion, show immediately (CSS also handles it)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cls = [
    stagger ? 'titan-reveal-stagger' : 'titan-reveal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={cls}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

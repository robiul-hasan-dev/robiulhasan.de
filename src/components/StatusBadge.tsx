import type { Lifecycle } from '@lib/schema';

/**
 * StatusBadge — an accessible lifecycle pill (Server Component).
 *
 * Renders the honest lifecycle label (directive §1.2) in JetBrains Mono. The
 * label is decorative typography, so the real status is also exposed to assistive
 * tech via aria-label. No "live"/"production" wording is emitted unless the
 * registry actually classifies the project that way.
 */

const LIFECYCLE_LABELS: Record<Lifecycle, string> = {
  concept: 'Konzept',
  prototype: 'Prototyp',
  'in-progress': 'In Arbeit',
  'field-experience': 'Feldeinsatz',
  production: 'Produktion',
};

interface StatusBadgeProps {
  status: Lifecycle;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = LIFECYCLE_LABELS[status];
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--bg-inset)] px-2.5 py-0.5 text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]"
      style={{ fontFamily: 'var(--font-mono)' }}
      aria-label={`Projektstatus: ${label}`}
    >
      {label}
    </span>
  );
}

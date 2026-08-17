// LocaleSwitcher — PLACEHOLDER (Server Component, no client JS).
//
// The site is German-only today (Phase 0 gap #6). EN/DE locale-prefixed routes
// and a real switcher arrive in the i18n slice. Until reviewed English content
// exists, EN is shown as "in progress" and is intentionally NOT a link — an
// honest signal rather than a toggle that leads nowhere.

export default function LocaleSwitcher() {
  return (
    <div
      className="flex items-center gap-1 font-mono text-xs"
      aria-label="Sprache / Language"
    >
      <span
        aria-current="true"
        className="rounded px-1.5 py-1 text-[var(--text-primary)]"
      >
        DE
      </span>
      <span aria-hidden="true" className="text-[var(--text-tertiary)]">
        /
      </span>
      <span
        aria-disabled="true"
        title="English — in Vorbereitung"
        className="rounded px-1.5 py-1 text-[var(--text-tertiary)]"
      >
        EN
      </span>
    </div>
  );
}

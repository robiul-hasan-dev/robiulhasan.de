import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-3 text-[var(--text-secondary)]">
        Diese Seite existiert nicht.
      </p>
      <p className="mt-6">
        <Link href="/" className="text-sm font-medium text-[var(--accent-strong)]">
          ← Zur Startseite
        </Link>
      </p>
    </div>
  );
}

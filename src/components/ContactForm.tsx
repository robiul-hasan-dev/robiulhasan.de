'use client';

import { useActionState } from 'react';
import { submitContact, type ContactState } from '@/app/actions/contact';

const initialState: ContactState = {};

/**
 * ContactForm — Release 2/2 conversion layer.
 * Server-action driven (useActionState), German UI, accessible.
 * Honeypot field hidden from humans, traps bots.
 */
export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState
  );

  return (
    <form
      action={formAction}
      className="space-y-4"
      noValidate={false}
      aria-label="Kontaktformular"
    >
      {/* Honeypot — hidden from humans, bots fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto">
        <label htmlFor="website">Website (bitte freilassen)</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-[var(--text-secondary)]"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
          placeholder="Dein Name"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-[var(--danger)]" role="alert">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-[var(--text-secondary)]"
        >
          E-Mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
          placeholder="name@beispiel.de"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-[var(--danger)]" role="alert">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-[var(--text-secondary)]"
        >
          Nachricht
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
          placeholder="Worum geht es?"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-[var(--danger)]" role="alert">
            {state.fieldErrors.message[0]}
          </p>
        )}
      </div>

      {/* Status feedback */}
      {state.success && (
        <p
          className="rounded-md border border-[var(--success)]/30 bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--success)]"
          role="status"
        >
          {state.success}
        </p>
      )}
      {state.error && (
        <p
          className="rounded-md border border-[var(--danger)]/30 bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--danger)]"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--on-accent)] transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {pending ? 'Sende…' : 'Nachricht senden'}
      </button>
    </form>
  );
}

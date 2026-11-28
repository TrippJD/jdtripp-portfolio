"use client";

import { useActionState, useState } from "react";
import { sendContactMessage, type ContactField, type ContactState } from "@/app/actions/contact";
import { Starfield } from "@/components/hero/starfield";
import { contact } from "@/content/site";
import { Turnstile } from "./turnstile";
import { Brackets } from "@/components/brackets";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const initialState: ContactState = { status: "idle", attempt: 0 };

// Wraps the server action to count attempts, which remounts the form with the
// visitor's values and resets the spam check after every submission.
async function submit(previous: ContactState, formData: FormData): Promise<ContactState> {
  const result = await sendContactMessage(previous, formData);
  return { ...result, attempt: (previous.attempt ?? 0) + 1 };
}

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-space px-4 py-3 text-paper transition-colors outline-none placeholder:text-haze/60 hover:border-haze/60 focus:border-signal aria-invalid:border-flare";

function Field({
  name,
  label,
  state,
  children,
}: {
  name: ContactField;
  label: string;
  state: ContactState;
  children: (props: {
    id: string;
    name: ContactField;
    defaultValue?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}) {
  const errors = state.fieldErrors?.[name];
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="font-mono text-xs tracking-[0.15em] text-haze uppercase">
        {label}
      </label>
      {children({
        id: name,
        name,
        defaultValue: state.values?.[name],
        "aria-invalid": errors ? true : undefined,
        "aria-describedby": errors ? errorId : undefined,
      })}
      {errors && (
        <p id={errorId} className="mt-2 text-sm text-flare">
          {errors[0]}
        </p>
      )}
    </div>
  );
}

/** Section 9: the contact form, closing the page where the hero opened: in the stars. */
export function Contact() {
  const [state, formAction, pending] = useActionState(submit, initialState);
  const [dismissedAttempt, setDismissedAttempt] = useState(-1);
  const showSuccess = state.status === "success" && dismissedAttempt !== state.attempt;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden border-t border-line py-32 md:py-40"
    >
      {/* Bookend to the hero: the same star field, fading in from the top. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_40%)]"
      >
        <Starfield className="size-full" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(ellipse_at_bottom,rgba(61,123,255,0.16),transparent_70%)]"
      />

      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
        <div>
          <p className="eyebrow">
            <Brackets>{contact.eyebrow}</Brackets>
          </p>
          <h2
            id="contact-heading"
            className="mt-6 text-[2.6rem] leading-[0.95] font-bold tracking-tighter sm:text-5xl md:text-7xl"
          >
            {contact.heading}
          </h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-haze">{contact.intro}</p>

          <ul className="mt-10 flex flex-wrap gap-3">
            {contact.elsewhere.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-medium transition-colors hover:border-signal hover:text-signal"
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-space-2/80 p-6 backdrop-blur md:p-10">
          {showSuccess ? (
            <div role="status" className="flex min-h-96 flex-col justify-center">
              <p className="eyebrow">
                <Brackets>Transmission received</Brackets>
              </p>
              <p className="mt-6 text-4xl font-bold tracking-tight">{contact.success.heading}</p>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-haze">
                {state.message ?? contact.success.body}
              </p>
              <button
                type="button"
                onClick={() => setDismissedAttempt(state.attempt ?? 0)}
                className="mt-8 self-start rounded-full border border-line px-6 py-3 font-medium transition-colors hover:border-signal hover:text-signal"
              >
                {contact.success.again}
              </button>
            </div>
          ) : (
            <form key={state.attempt} action={formAction} noValidate className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field name="name" label="Name" state={state}>
                  {(props) => (
                    <input
                      {...props}
                      type="text"
                      autoComplete="name"
                      required
                      className={inputClass}
                    />
                  )}
                </Field>
                <Field name="email" label="Email" state={state}>
                  {(props) => (
                    <input
                      {...props}
                      type="email"
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                  )}
                </Field>
              </div>

              <Field name="message" label="Message" state={state}>
                {(props) => (
                  <textarea
                    {...props}
                    rows={6}
                    required
                    data-lenis-prevent
                    placeholder="The role, the team, and what you're building."
                    className={`${inputClass} resize-y`}
                  />
                )}
              </Field>

              {/* Honeypot: hidden from people, tempting to bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {turnstileSiteKey && (
                <Turnstile siteKey={turnstileSiteKey} resetKey={state.attempt ?? 0} />
              )}

              {state.status === "error" && state.message && (
                <p
                  role="alert"
                  className="rounded-xl border border-flare/40 bg-flare/10 px-4 py-3 text-sm"
                >
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-6 py-4 font-medium text-space transition-colors hover:bg-paper disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {pending ? "Transmitting…" : "Send message"}
                {!pending && <span aria-hidden="true">→</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

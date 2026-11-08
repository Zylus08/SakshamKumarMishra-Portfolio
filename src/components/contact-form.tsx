"use client";
import { useEffect, useId, useRef, useState } from "react";
import { contactSchema } from "@/lib/contact/schema";
import { profile } from "@/lib/profile";
type State =
  | "idle"
  | "validating"
  | "submitting"
  | "accepted"
  | "mock"
  | "rate_limited"
  | "failed";
export function ContactForm() {
  const id = useId(),
    form = useRef<HTMLFormElement>(null),
    notice = useRef<HTMLParagraphElement>(null);
  const [state, setState] = useState<State>("idle"),
    [message, setMessage] = useState(""),
    [mode, setMode] = useState("loading"),
    [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/contact", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) =>
        setMode(
          ["mock", "live", "disabled"].includes(data.mode)
            ? data.mode
            : "disabled",
        ),
      )
      .catch(() => {
        if (!controller.signal.aborted) setMode("disabled");
      });
    return () => controller.abort();
  }, []);
  const pending = state === "validating" || state === "submitting";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setState("validating");
    setMessage("Checking your message…");
    setErrors({});
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const validation = contactSchema.safeParse(values);
    if (!validation.success) {
      const issues = validation.error.flatten().fieldErrors;
      setErrors(issues);
      setState("failed");
      setMessage("Please check the highlighted fields.");
      const key = Object.keys(issues)[0];
      form.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
      return;
    }
    setState("submitting");
    setMessage("Submitting your message…");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (response.status === 202 && data.code === "accepted") {
        setState("accepted");
        setMessage(
          "Accepted by the email provider. Inbox delivery is not yet confirmed.",
        );
        form.current?.reset();
      } else if (response.ok && data.code === "mock") {
        setState("mock");
        setMessage(
          "Test submission validated. No email was sent; real delivery is not configured.",
        );
        form.current?.reset();
      } else if (response.status === 429) {
        setState("rate_limited");
        setMessage(
          `Too many requests. Try again in ${Math.max(1, Math.ceil((Number(data.retryAfter) || 3600) / 60))} minutes.`,
        );
      } else {
        setState("failed");
        setMessage(
          response.status === 503
            ? "Message sending is not configured or temporarily unavailable. Please try again later."
            : "Your message could not be accepted. Please check the fields or try again later.",
        );
        if (data.errors) setErrors(data.errors);
      }
    } catch {
      setState("failed");
      setMessage(
        "We could not confirm acceptance. Check your connection before trying again.",
      );
    }
    notice.current?.focus();
  }
  return (
    <form
      ref={form}
      className="contact-form"
      noValidate
      onSubmit={submit}
      aria-label="Contact Saksham"
      aria-busy={pending}
    >
      <div className="form-heading">
        <span className="micro">A NOTE, NOT A PITCH.</span>
        <p>
          {mode === "mock"
            ? "Test mode — real email delivery is not configured."
            : mode === "disabled"
              ? "Email sending is not configured yet. You can still review the form."
              : mode === "live"
                ? "Your message is shared only with the configured contact inbox."
                : "Checking message availability…"}
        </p>
        {profile.email && (
          <p>
            Prefer email?{" "}
            <a className="text-link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </p>
        )}
      </div>
      <div className="form-pair">
        {(
          [
            {
              name: "name",
              label: "Name",
              type: "text",
              max: 80,
              auto: "name",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              max: 254,
              auto: "email",
            },
          ] as const
        ).map((field) => (
          <div className="form-field" key={field.name}>
            <label htmlFor={`${id}-${field.name}`}>
              {field.label}
              {field.name === "name" ? (
                <span> (optional)</span>
              ) : (
                <span> (required)</span>
              )}
            </label>
            <input
              id={`${id}-${field.name}`}
              name={field.name}
              type={field.type}
              maxLength={field.max}
              autoComplete={field.auto}
              required={field.name === "email"}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${id}-${field.name}-error` : undefined
              }
            />
            {errors[field.name] && (
              <p className="field-error" id={`${id}-${field.name}-error`}>
                {errors[field.name]?.[0]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="form-field">
        <label htmlFor={`${id}-subject`}>
          Subject <span>(required)</span>
        </label>
        <input
          id={`${id}-subject`}
          name="subject"
          required
          minLength={3}
          maxLength={160}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? `${id}-subject-error` : undefined}
        />
        {errors.subject && (
          <p className="field-error" id={`${id}-subject-error`}>
            {errors.subject[0]}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor={`${id}-message`}>
          Message <span>(required)</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          minLength={20}
          maxLength={5000}
          required
          aria-invalid={!!errors.message}
          aria-describedby={`${id}-message-help${errors.message ? ` ${id}-message-error` : ""}`}
        />
        <p id={`${id}-message-help`} className="field-help">
          20–5,000 characters. Please leave out sensitive personal information.
        </p>
        {errors.message && (
          <p className="field-error" id={`${id}-message-error`}>
            {errors.message[0]}
          </p>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input
          id={`${id}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="form-submit">
        <button className="button" type="submit" disabled={pending}>
          {pending
            ? "Submitting…"
            : mode === "mock"
              ? "Test contact form ↗"
              : "Send message ↗"}
        </button>
        <p
          ref={notice}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={`form-status ${state}`}
          data-state={state}
        >
          {message}
        </p>
      </div>
    </form>
  );
}

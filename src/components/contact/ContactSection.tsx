"use client";

import { FormEvent, useMemo, useState } from "react";
import { siteConfig } from "@/content/site";
import { ExternalIcon } from "@/components/ui/ExternalIcon";

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactSection({ formEnabled = false }: { formEnabled?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [formMessage, setFormMessage] = useState("");
  const statusText = useMemo(() => {
    if (formState === "sending") return "Sending…";
    if (formState === "sent") return "Message sent — thanks. I’ll get back to you soon.";
    if (formState === "error") return formMessage || "Something went wrong. Please use the email button instead.";
    return "";
  }, [formMessage, formState]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
    };

    setFormState("sending");
    setFormMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) throw new Error(result?.error || "Message delivery failed.");
      setFormState("sent");
      form.reset();
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "Message delivery failed.");
      setFormState("error");
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-grid">
        <div className="contact-copy">
          <div className="eyebrow"><span>06</span><span>/</span><span>CONTACT</span></div>
          <h2>Have something interesting <em>in mind?</em></h2>
          <p>Whether it is a role, a project or just an interesting problem, I am always happy to hear the idea.</p>
          <div className="contact-actions">
            <a className="button-primary" href={`mailto:${siteConfig.email}`}>Email me</a>
            <button className="button-secondary" type="button" onClick={copyEmail}>{copied ? "Copied ✓" : "Copy email"}</button>
            <a className="button-secondary" href={siteConfig.linkedin} target="_blank" rel="noreferrer">LinkedIn <ExternalIcon /></a>
            <a className="button-secondary" href={siteConfig.github} target="_blank" rel="noreferrer">GitHub <ExternalIcon /></a>
            <a className="button-secondary" href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">Resume <ExternalIcon /></a>
          </div>
        </div>

        <div className="contact-visual-column">
          <div className="contact-desk" aria-hidden="true">
            <div className="contact-lamp"><span /><i /></div>
            <div className="contact-laptop"><span /></div>
            <div className="contact-paper">let&apos;s build<br />something good.</div>
          </div>
        </div>
      </div>

      {formEnabled && (
        <div className="contact-form-shell">
          <div className="contact-form-intro">
            <span className="mini-label">LEAVE A NOTE</span>
            <h3>Prefer a message here?</h3>
            <p>This goes straight to my inbox. No account, no mailing list, no nonsense.</p>
          </div>
          <form className="contact-form" onSubmit={submit} aria-describedby="contact-form-status">
            <div className="contact-form-row">
              <label>
                <span>Name</span>
                <input name="name" type="text" minLength={2} maxLength={80} autoComplete="name" required />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" maxLength={200} autoComplete="email" required />
              </label>
            </div>
            <label>
              <span>Company <small>optional</small></span>
              <input name="company" type="text" maxLength={120} autoComplete="organization" />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" minLength={12} maxLength={3000} rows={5} required />
            </label>
            <label className="contact-honeypot" aria-hidden="true">
              <span>Website</span>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="contact-form-footer">
              <button className="button-primary" type="submit" disabled={formState === "sending"}>
                {formState === "sending" ? "Sending…" : formState === "sent" ? "Sent ✓" : "Send message"}
              </button>
              <p id="contact-form-status" className={`contact-form-status ${formState}`} aria-live="polite">{statusText}</p>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

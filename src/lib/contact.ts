export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
  website?: string;
}

export interface ContactValidationResult {
  ok: boolean;
  value?: ContactPayload;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanLine(value: unknown) {
  return clean(value).replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ");
}

export function validateContactPayload(input: unknown): ContactValidationResult {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request body." };
  const data = input as Record<string, unknown>;

  const name = cleanLine(data.name);
  const email = clean(data.email).toLowerCase();
  const company = cleanLine(data.company);
  const message = clean(data.message);
  const website = clean(data.website);

  // Honeypot field. Bots often populate every input they can find.
  if (website) {
    return {
      ok: true,
      value: { name: name || "Visitor", email: email || "bot@example.invalid", company, message: message || "", website },
    };
  }

  if (name.length < 2 || name.length > 80) return { ok: false, error: "Please enter your name." };
  if (email.length > 200 || !EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (company.length > 120) return { ok: false, error: "Company name is too long." };
  if (message.length < 12) return { ok: false, error: "Please add a little more detail to your message." };
  if (message.length > 3000) return { ok: false, error: "Please keep the message under 3,000 characters." };

  return { ok: true, value: { name, email, company, message, website } };
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char] ?? char);
}

export function contactEmailHtml(payload: ContactPayload) {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const company = escapeHtml(payload.company || "Not provided");
  const message = escapeHtml(payload.message).replace(/\n/g, "<br />");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#18130f;color:#f3ede5;font-family:Arial,sans-serif;padding:32px">
    <div style="max-width:640px;margin:0 auto;background:#211a15;border:1px solid #3c3027;border-radius:20px;padding:28px">
      <div style="font-size:12px;letter-spacing:.12em;color:#ff7256;text-transform:uppercase;margin-bottom:20px">Portfolio contact</div>
      <h1 style="font-size:28px;margin:0 0 20px">New message from ${name}</h1>
      <p style="color:#c9bbae;line-height:1.6"><strong style="color:#f3ede5">Email:</strong> ${email}<br /><strong style="color:#f3ede5">Company:</strong> ${company}</p>
      <div style="height:1px;background:#3c3027;margin:24px 0"></div>
      <p style="font-size:16px;line-height:1.75;color:#f3ede5;margin:0">${message}</p>
    </div>
  </body>
</html>`;
}

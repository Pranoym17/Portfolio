import { contactEmailHtml, validateContactPayload } from "@/lib/contact";
import { cleanupRateLimits, consumeRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "unknown";
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ ok: false, error: "Cross-origin submissions are not accepted." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json({ ok: false, error: "Expected JSON." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Request is too large." }, { status: 413 });
  }

  const key = clientKey(request);
  if (Math.random() < 0.02) cleanupRateLimits();
  const rate = consumeRateLimit(key);
  if (!rate.allowed) {
    return Response.json(
      { ok: false, error: "Too many messages. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let raw = "";
  try {
    raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return Response.json({ ok: false, error: "Request is too large." }, { status: 413 });
    }
  } catch {
    return Response.json({ ok: false, error: "Could not read request." }, { status: 400 });
  }

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const validation = validateContactPayload(input);
  if (!validation.ok || !validation.value) {
    return Response.json({ ok: false, error: validation.error ?? "Invalid submission." }, { status: 400 });
  }

  // Honeypot submissions are silently accepted so bots do not learn the filter.
  if (validation.value.website) {
    return Response.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return Response.json(
      { ok: false, error: "The contact form is not configured yet. Please use the email button instead." },
      { status: 503 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "pranoy-portfolio/1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Portfolio message from ${validation.value.name}`,
      reply_to: validation.value.email,
      html: contactEmailHtml(validation.value),
      text: [
        `Name: ${validation.value.name}`,
        `Email: ${validation.value.email}`,
        `Company: ${validation.value.company || "Not provided"}`,
        "",
        validation.value.message,
      ].join("\n"),
      tags: [{ name: "source", value: "portfolio" }],
    }),
  });

  if (!response.ok) {
    console.error("Contact email provider error", { status: response.status });
    return Response.json(
      { ok: false, error: "Message delivery failed. Please use the email button instead." },
      { status: 502 },
    );
  }

  return Response.json(
    { ok: true },
    {
      status: 202,
      headers: {
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(rate.remaining),
      },
    },
  );
}

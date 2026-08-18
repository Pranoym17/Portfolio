import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

/**
 * `/api/contact` rate-limits to 4 posts per client per 10 minutes, keyed on
 * `x-forwarded-for` and held in an in-memory map. Playwright reuses a running dev
 * server, so without this every run would spend the same bucket and a second run
 * inside the window would 429 instead of asserting the real status code.
 */
function freshClient() {
  // The route treats this header as an opaque bucket key, so a UUID is fine.
  return { "X-Forwarded-For": `test-${randomUUID()}` };
}

test("health endpoint reports the app as healthy", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "API suite runs once in chromium project");
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.service).toBe("pranoy-living-workspace");
  expect(typeof body.contactConfigured).toBe("boolean");
});

test("contact endpoint rejects invalid payloads", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "API suite runs once in chromium project");
  const response = await request.post("/api/contact", {
    headers: freshClient(),
    data: { name: "A", email: "not-an-email", message: "tiny" },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.ok).toBe(false);
});

test("contact endpoint silently accepts honeypot bot submissions without sending", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "API suite runs once in chromium project");
  const response = await request.post("/api/contact", {
    headers: freshClient(),
    data: {
      name: "Definitely A Bot",
      email: "bot@example.com",
      message: "This is deliberately long enough for validation.",
      website: "https://spam.example",
    },
  });
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ ok: true });
});

test("contact endpoint rejects cross-origin posts", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "API suite runs once in chromium project");
  const response = await request.post("/api/contact", {
    headers: { ...freshClient(), Origin: "https://malicious.example" },
    data: {
      name: "Test User",
      email: "test@example.com",
      message: "This is a valid looking contact message for the test.",
    },
  });
  expect(response.status()).toBe(403);
});

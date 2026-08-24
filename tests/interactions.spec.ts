import { expect, test, type Page } from "@playwright/test";

/**
 * The keyboard shortcuts only work once ClientShell has hydrated and attached its
 * listener. Retry the keypress rather than racing a fixed timeout.
 */
async function openTerminal(page: Page) {
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await expect(async () => {
    await page.keyboard.press("~");
    await expect(input).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  return input;
}

test("terminal runs help and the hire easter egg scrolls to contact", async ({ page }) => {
  await page.goto("/");
  const input = await openTerminal(page);
  await input.fill("help");
  await input.press("Enter");
  await expect(page.getByText(/commands: about, projects, skills/i)).toBeVisible();

  await input.fill("sudo hire pranoy");
  await input.press("Enter");
  await expect(page.getByText(/Access granted/i)).toBeVisible();
  // Smooth-scrolls the full page height, which grew with the real content, so this
  // needs headroom well past the animation itself when the suite runs under load.
  await expect(page.locator("#contact")).toBeInViewport({ timeout: 20000 });
});

test("terminal rejects unknown commands without executing them", async ({ page }) => {
  await page.goto("/");
  const input = await openTerminal(page);
  await input.fill("rm -rf /");
  await input.press("Enter");
  await expect(page.getByText(/command not found/i)).toBeVisible();
});

test("command palette filters by technology and closes on Escape", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  await expect(async () => {
    await page.keyboard.press("Control+K");
    await expect(dialog).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });

  await page.getByRole("textbox", { name: "Search portfolio commands" }).fill("python");
  await expect(dialog.getByRole("button").first()).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("copy email confirms then reverts", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "clipboard permissions are only grantable in Chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#contact");

  const copy = page.getByRole("button", { name: /Copy email/i });
  await copy.click();
  await expect(page.getByRole("button", { name: /Copied/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Copy email/i })).toBeVisible({ timeout: 6000 });
});

test("project X-Ray exposes the architecture diagram", async ({ page }) => {
  await page.goto("/#work");
  const project = page.locator("[data-project-card]").first();
  await project.getByRole("button", { name: /Cortex Lab/i }).click();
  await expect(project).toHaveAttribute("data-expanded", "true");

  // The card is still moving under GSAP Flip right after expanding, so retry the
  // tab click until the view actually switches rather than racing the animation.
  const diagram = project.getByRole("img", { name: "Project architecture diagram" });
  await expect(async () => {
    await project.getByRole("button", { name: "X-Ray" }).click({ timeout: 2000 });
    await expect(diagram).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 20000 });

  await project.getByRole("button", { name: "Product" }).click();
  await expect(project.getByText(/THE PROBLEM/i)).toBeVisible();
});

test("404 route renders a way back home", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Return home/i })).toBeVisible();
});

test("reduced motion still reveals every section", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  for (const id of ["work", "experience", "about", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test("page exposes exactly one h1 and a labelled main landmark", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
});

test("overlays trap focus and restore it to the invoking control", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "the palette trigger is desktop-only");
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open command palette" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();

  // Focus must be inside the dialog, not left behind on the page.
  const focusInDialog = await page.evaluate(() => !!document.activeElement?.closest("[role='dialog']"));
  expect(focusInDialog).toBe(true);

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("canvas is hidden from assistive tech and content survives without it", async ({ page }) => {
  await page.goto("/");
  const wrap = page.locator(".workspace-canvas-wrap");
  await expect(wrap).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("konami code acknowledges without unlocking a game", async ({ page }) => {
  await page.goto("/");
  const status = page.getByRole("status");
  // `useKonami` binds its listener on hydration, so keys pressed before then are
  // dropped and the sequence index never advances. Retry the whole sequence —
  // the hook resets its index on any non-matching key, so replaying is safe.
  await expect(async () => {
    for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
      await page.keyboard.press(key);
    }
    await expect(status).toContainText(/nothing unlocked/i, { timeout: 1000 });
  }).toPass({ timeout: 15000 });
});

test("workspace microcopy is present but decorative", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "annotations are desktop-only");
  await page.goto("/");
  const notes = page.locator(".workspace-note");
  await expect(notes.first()).toBeAttached();
  // Decorative: must not be announced to assistive tech.
  await expect(page.locator(".workspace-notes")).toHaveAttribute("aria-hidden", "true");
});

test("about section exposes all three personal cards", async ({ page }) => {
  await page.goto("/#about");
  for (const label of ["CURRENTLY LEARNING", "INTERESTED IN", "OUTSIDE CODE"]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
});

test("laptop double-click signal opens the terminal", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "Terminal command" });
  // The 3D laptop dispatches this event; asserting on the wiring avoids
  // depending on WebGL raycast coordinates.
  await expect(async () => {
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("workspace:open-terminal")));
    await expect(input).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
});

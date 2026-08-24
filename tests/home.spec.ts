import { expect, test } from "@playwright/test";

test("core recruiter path is visible and navigable", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Pranoy/i })).toBeVisible();
  await expect(page.getByRole("region", { name: /Introduction/i }).getByText("Computer Engineering", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /View my work/i })).toBeVisible();

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("dialog").getByRole("button", { name: /Projects/ }).click();
  } else {
    await page.getByRole("link", { name: "Projects", exact: true }).click();
  }
  await expect(page.getByRole("heading", { level: 2, name: /brought to life/i })).toBeVisible();
  await expect(page.locator("#work").getByRole("heading", { level: 3, name: "Shared AI Memory Layer" })).toBeVisible();
});

// Expanding a project and switching to X-Ray is covered in interactions.spec.ts,
// which also asserts the toggle back to Product.

test("command palette opens from keyboard", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  // Retry until ClientShell has hydrated and bound the shortcut.
  await expect(async () => {
    await page.keyboard.press("Control+K");
    await expect(dialog).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  const input = page.getByRole("textbox", { name: "Search portfolio commands" });
  await input.fill("hardware");
  await expect(page.getByRole("button", { name: /Edge Vision Controller/i })).toBeVisible();
  await page.keyboard.press("Escape");
});

test("hidden terminal is safe and functional", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "Terminal command" });
  // Retry until ClientShell has hydrated and bound the shortcut.
  await expect(async () => {
    await page.keyboard.press("~");
    await expect(input).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  await input.fill("help");
  await input.press("Enter");
  await expect(page.getByText(/commands: about, projects, skills/i)).toBeVisible();
});

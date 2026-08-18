import { expect, test } from "@playwright/test";

test("mobile keeps content direct", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile project only");
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Pranoy/i })).toBeVisible();
  await page.getByRole("link", { name: /View my work/i }).click();
  await expect(page.locator("[data-project-card]").first()).toBeVisible();
});

test("reduced motion keeps portfolio content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Shared AI Memory Layer" }).first()).toBeVisible();
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { level: 2, name: /Learning by/i })).toBeVisible();
});

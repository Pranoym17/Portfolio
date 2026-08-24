import { expect, test } from "@playwright/test";

test("mobile navigation exposes all primary destinations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile project only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: /Projects/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Experience/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /About/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Contact/ })).toBeVisible();
  await page.getByRole("button", { name: /Contact/ }).click();
  await expect(page.locator("#contact")).toBeVisible();
});

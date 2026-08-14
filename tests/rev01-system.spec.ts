import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

test("the system route is noindex and uses only local font assets", async ({ page }) => {
  await page.goto(`${BASE_URL}/system`);

  await expect(page).toHaveTitle(/Parrit Command System/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { name: "Parrit Command System." })).toBeVisible();

  const fontSources = await page.evaluate(() =>
    [...document.fonts].map((font) => `${font.family}:${font.weight}`),
  );
  expect(fontSources).toContain("IBM Plex Sans:400");
  expect(fontSources).toContain("IBM Plex Mono:400");

  const holds = page.getByRole("button", { name: /hold to commit/i });
  await holds.first().hover();
  await page.mouse.down();
  await page.waitForTimeout(650);
  await page.mouse.up();
  await expect(page.getByRole("button", { name: "Committed" }).first()).toBeVisible();

  await holds.last().focus();
  await page.keyboard.down("Enter");
  await page.waitForTimeout(650);
  await page.keyboard.up("Enter");
  await expect(page.getByRole("button", { name: "Committed" }).last()).toBeVisible();
});

test.describe("network deny self-test", () => {
  test.use({ expectBlockedRequest: true });

  test("blocks an unmatched external request", async ({ page, blockedRequests }) => {
    await page.goto(`${BASE_URL}/system`);
    const result = await page.evaluate(async () => {
      try {
        await fetch("https://example.invalid/rev01-network-probe");
        return "unexpected-success";
      } catch {
        return "blocked";
      }
    });

    expect(result).toBe("blocked");
    expect(blockedRequests).toContain("https://example.invalid/rev01-network-probe");
  });
});

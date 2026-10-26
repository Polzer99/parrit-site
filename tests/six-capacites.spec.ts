// Superseded six-card contract: verify the three entry points and Harness.
import { expect, test } from "./network-deny.setup";
import { localizedPath } from "../src/system/locale";
const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
for (const locale of ["fr", "en"] as const) test(`capability destinations ${locale}`, async ({ page }) => {
  await page.goto(`${BASE}${localizedPath("/", locale)}`);
  for (const path of ["/consulting-transformation", "/ai-sprints", "/engineering-integration", "/harness-engineering"]) await expect(page.locator(`main a[href="${localizedPath(path, locale)}"]`)).toBeVisible();
  await expect(page.locator(`main a[href="${localizedPath("/build-with-you", locale)}"]`)).toHaveCount(0);
  await expect(page.locator(`footer a[href="${localizedPath("/build-with-you", locale)}"]`)).toBeVisible();
});

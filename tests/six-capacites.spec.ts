import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });
for (const width of [375, 1440]) {
  for (const locale of ["fr", "en"]) {
    test(`capabilities and footer link ${locale} ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.setExtraHTTPHeaders({ "Accept-Language": locale });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator(".home-s-capacites#capacites");
      await expect(section).toHaveCount(1);
      await expect(section).not.toHaveClass(/home-s-parcours/);
      await expect(page.locator(".home-s-parcours")).toHaveCount(1);
      await expect(page.locator(".home-s-brands + .home-s-parcours + .home-s-maison + .home-s-capacites + .home-s-build + .home-s-proof + .home-s-journal + .home-s-close")).toHaveCount(1);
      const maisonLinks = page.locator(".home-s-maison a");
      await expect(maisonLinks).toHaveCount(1);
      await expect(maisonLinks).toHaveAttribute("href", `${locale === "fr" ? "/fr" : ""}/commission`);
      await expect(section.getByRole("heading", { level: 3 })).toHaveCount(6);
      await expect(section.locator("a, button")).toHaveCount(0);
      const headings = section.getByRole("heading", { level: 3 });
      const left = (await headings.nth(0).boundingBox())!.x;
      for (const index of width === 1440 ? [2, 4] : [1, 2, 3, 4, 5]) {
        expect(Math.abs((await headings.nth(index).boundingBox())!.x - left)).toBeLessThanOrEqual(1);
      }
      const href = `${locale === "fr" ? "/fr" : ""}/build-with-you`;
      await expect(page.locator(`main a[href="${href}"]`)).toHaveCount(0);
      await expect(page.locator(`footer a[href="${href}"]`)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`home-${locale}-${width}.png`), fullPage: true });
    });
  }
}

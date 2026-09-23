import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });

for (const width of [375, 1440, 767, 768]) {
  for (const locale of ["en", "fr"] as const) {
    test(`offer journey ${locale} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const prefix = locale === "fr" ? "/fr" : "";
      await page.goto(`${BASE_URL}${prefix || "/"}`);
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator(".home-s-offers");
      const cards = section.getByRole("article");
      await expect(cards).toHaveCount(2);
      for (const card of await cards.all()) {
        await expect(card).toBeVisible();
        await expect(card.getByRole("link")).toHaveCount(1);
        await expect(card.getByRole("listitem")).toHaveCount(3);
      }
      await expect(cards.nth(0).locator(".offer-price")).toHaveText(locale === "fr" ? "À partir de 3 200 € HT · forfait" : "Starting at €3,200 excl. VAT · fixed fee");
      await expect(cards.nth(1).locator(".offer-price")).toHaveText(locale === "fr" ? "Sur devis" : "Custom quote");
      await expect(cards.nth(0).getByRole("link")).toHaveAttribute("href", `${prefix}/build-with-you`);
      await expect(cards.nth(1).getByRole("link")).toHaveAttribute("href", `${prefix}/commission`);
      expect(await section.evaluate((el) => [el.previousElementSibling?.className, el.nextElementSibling?.className])).toEqual(["home-s-proof", "home-s-journal"]);
      expect(await page.locator(".home-s-proof").evaluate((el) => el.previousElementSibling?.className)).toBe("home-s-build r2-dark");
      const columns = await section.locator(".home-s-offers-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
      expect(columns).toBe(width < 768 ? 1 : 2);
      // Detect child overflow as well: the home itself deliberately hides overflow-x.
      expect(await section.evaluate((el) => [...el.querySelectorAll("*")].every((child) => {
        const rect = child.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= window.innerWidth;
      }))).toBe(true);
      if (width === 375 || width === 1440) await testInfo.attach(`offers-${locale}-${width}`, {
        body: await section.screenshot({ animations: "disabled" }), contentType: "image/png",
      });
      await cards.nth(0).getByRole("link").click();
      await expect(page).toHaveURL(`${BASE_URL}${prefix}/build-with-you`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Build With You");
      await expect(page.locator(".r2-phase")).toHaveCount(3);
      await expect(page.locator("main .offer-price")).toHaveText(locale === "fr" ? "À partir de 3 200 € HT · forfait" : "Starting at €3,200 excl. VAT · fixed fee");
      await expect(page.locator("main form")).toHaveCount(0);
      await expect(page.locator("main a")).toHaveCount(3);
      for (const link of await page.locator("main a").all()) {
        await expect(link).toHaveAttribute("href", `${prefix}/commission`);
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://parrit.ai${prefix}/build-with-you`);
      await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute("href", "https://parrit.ai/fr/build-with-you");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.evaluate(() => document.fonts.ready);
      if (width === 375 || width === 1440) await testInfo.attach(`build-with-you-${locale}-${width}`, {
        body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png",
      });
    });
  }
}

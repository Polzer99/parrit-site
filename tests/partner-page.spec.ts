import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
if (!["localhost", "127.0.0.1"].includes(new URL(BASE_URL).hostname)) throw new Error("Local test origin required");
const FORM = "https://docs.google.com/forms/d/e/1FAIpQLSeNVPnXs_ji3QJSC8WHGs6UPtOgO1GPdTfs6jc6T1S5cpB9aw/viewform";
const PATHS = { fr: "/fr/devenir-partenaire", en: "/become-a-partner" } as const;
test.use({ serviceWorkers: "block" });
test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const locale of ["fr", "en"] as const) {
  test(`partner response, metadata, form destination and language switch ${locale}`, async ({ page, context, request }) => {
    const path = PATHS[locale];
    const response = await page.goto(`${BASE_URL}${path}?source=partner#information`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page).toHaveTitle(locale === "fr" ? "Devenir partenaire · Parrit.ai" : "Become a partner · Parrit.ai");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://parrit.ai${path}`);
    for (const [lang, route] of Object.entries({ ...PATHS, "x-default": PATHS.en })) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveAttribute("href", `https://parrit.ai${route}`);
    }
    const introduction = await page.locator(".partner-introduction").innerText();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", introduction);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", introduction);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `https://parrit.ai${path}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://parrit.ai/opengraph-image?v=2026-10-27");
    const action = page.locator("main a.exec");
    await expect(action).toHaveCount(1);
    await expect(action).toHaveAttribute("href", FORM);
    await expect(action).toHaveAttribute("target", "_blank");
    await expect(action).toHaveAttribute("rel", "noopener noreferrer");
    await expect(page.locator('main a[href="mailto:paul.larmaraud@parrit.ai"]')).toHaveCount(1);
    await expect(page.locator("main iframe, main form")).toHaveCount(0);
    await expect(page.getByText("The form is in French.", { exact: true })).toHaveCount(locale === "en" ? 1 : 0);
    // API requests bypass browser routing: only this local origin, never follow redirects.
    const sitemap = await request.get(`${BASE_URL}/sitemap.xml`, { maxRedirects: 0 });
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const route of Object.values(PATHS)) {
      const entry = xml.match(new RegExp(`<url>\\s*<loc>https://parrit\\.ai${route}</loc>[\\s\\S]*?</url>`))?.[0];
      expect(entry).toBeTruthy();
      for (const [lang, target] of Object.entries(PATHS)) expect(entry).toContain(`hreflang="${lang}" href="https://parrit.ai${target}"`);
    }
    const other = locale === "fr" ? "en" : "fr";
    const switcher = page.locator(`.single-header .languages a[hreflang="${other}"]`);
    await expect(switcher).toHaveAttribute("href", PATHS[other]);
    await expect(page.locator(`.single-footer a[hreflang="${other}"]`)).toHaveAttribute("href", PATHS[other]);
    // Wait for hydration by retrying the complete switch, as in conformity-i18n.
    await expect(async () => {
      await page.goto(`${BASE_URL}${path}?source=partner#information`);
      await switcher.click();
      await expect(page).toHaveURL(`${BASE_URL}${PATHS[other]}?source=partner#information`, { timeout: 1500 });
      expect((await context.cookies()).find(cookie => cookie.name === "parrit_locale")?.value).toBe(other);
    }).toPass({ timeout: 10000 });
    await expect(page.locator("html")).toHaveAttribute("lang", other);
    // No click on the external form: the deny-all fixture remains active throughout.
  });

  for (const [width, height] of [[1440, 800], [1280, 720], [390, 700], [375, 700]]) {
    test(`partner full page geometry ${locale} ${width}×${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.goto(`${BASE_URL}${PATHS[locale]}`);
      await page.evaluate(() => document.fonts.ready);
      const measurements = await page.locator("main").evaluate(main => {
        const nodes = [...main.querySelectorAll("h1, h2, p, a, b")];
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          clipped: nodes.filter(el => /hidden|clip/.test(getComputedStyle(el).overflowY) || el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflowY !== "visible").map(el => el.textContent),
          small: nodes.filter(el => parseFloat(getComputedStyle(el).fontSize) < 16).map(el => el.textContent),
          columns: getComputedStyle(main.querySelector(".partner-blocks")!).gridTemplateColumns.split(" ").length,
          footerBottom: document.querySelector("footer")!.getBoundingClientRect().bottom,
          pageHeight: document.documentElement.scrollHeight,
        };
      });
      expect(measurements.overflow).toBe(false);
      expect(measurements.clipped).toEqual([]);
      expect(measurements.small).toEqual([]);
      expect(measurements.columns).toBe(width > 760 ? 3 : 1);
      await expect(page.locator("main h1 b")).toHaveCSS("font-weight", "600");
      await expect(page.locator("main h2")).toHaveCount(3);
      if (width > 760) {
        expect(measurements.footerBottom).toBeLessThanOrEqual(height);
        expect(measurements.pageHeight).toBeLessThanOrEqual(height);
      }
      if (width === 1440 || width === 375) await testInfo.attach(`partner-${locale}-${width}`, { body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png" });
    });
  }

  for (const [width, height] of [[1440, 800], [1280, 720], [390, 700]]) {
    test(`home partner invitation stays within one screen ${locale} ${width}×${height}`, async ({ page }) => {
      for (const pattern of ["https://app.cal.com/**", "https://cal.com/**"]) await page.route(pattern, route => route.fulfill({ contentType: "text/html", body: "" }));
      await page.setViewportSize({ width, height });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator(locale === "fr" ? "#partenaires" : "#team");
      const content = section.locator(":scope > .wrap");
      const metrics = await content.evaluate(el => ({ height: el.getBoundingClientRect().height, scrollHeight: el.scrollHeight, overflow: getComputedStyle(el).overflowY }));
      expect(metrics.height).toBeLessThanOrEqual(height);
      expect(metrics.scrollHeight).toBeLessThanOrEqual(height);
      expect(metrics.overflow).not.toMatch(/hidden|clip/);
      const link = section.locator(`a[href="${PATHS[locale]}"]`);
      await expect(link).toHaveClass(/\bghost\b/);
      await link.click();
      await expect(page).toHaveURL(`${BASE_URL}${PATHS[locale]}`);
      await expect(page.locator("main a.exec")).toHaveAttribute("href", FORM);
    });
  }

  test.describe(`partner SSR ${locale}`, () => {
    test.use({ javaScriptEnabled: false });
    test("content and language destinations work without JavaScript", async ({ page }) => {
      await page.goto(`${BASE_URL}${PATHS[locale]}`);
      await expect(page.locator("main h2")).toHaveCount(3);
      await expect(page.locator("main a.exec")).toHaveAttribute("href", FORM);
      const other = locale === "fr" ? "en" : "fr";
      await page.locator(`.single-header .languages a[hreflang="${other}"]`).click();
      await expect(page).toHaveURL(`${BASE_URL}${PATHS[other]}`);
      await expect(page.locator("html")).toHaveAttribute("lang", other);
    });
  });
}

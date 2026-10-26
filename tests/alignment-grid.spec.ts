import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const routes = ["", "/systems", "/journal", "/standard", "/commission", "/manufacture", "/build-with-you", "/dossiers", "/legal", "/journal/one-card-one-action"];
test.use({ serviceWorkers: "block" });
for (const width of [1440, 375]) for (const locale of ["en", "fr"]) for (const route of routes) {
  test(`shared grid ${locale} ${route || "/"} ${width}`, async ({ page }, testInfo) => {
    await page.route("https://app.cal.com/**", (request) => request.fulfill({ body: "", contentType: "text/html" }));
    await page.route("https://cal.com/**", (request) => request.fulfill({ body: "", contentType: "text/html" }));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : ""}${route || (locale === "en" ? "/" : "")}`);
    await page.evaluate(() => document.fonts.ready);
    const left = width === 1440 ? 180 : 20;
    const anchors = page.locator(".cmdbar .wordmark, .home-s-footer nav, main > .rev-wrap > header, main > .r2-wrap > header, main > .rev-wrap > section, main > .r2-wrap > section, main > section > .home-s-wrap, .journal-article > header");
    expect(await anchors.count()).toBeGreaterThan(2);
    for (const element of await anchors.all()) {
      // Wrappers include padding; compare their content edge, the actual layout grid.
      const x = await element.evaluate((el) => el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft));
      expect(x, await element.getAttribute("class") ?? "grid anchor").toBeCloseTo(left, 0);
    }
    const title = page.locator("h1").first();
    const box = await title.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeCloseTo(left, 0);
    if (!route && width === 1440) {
      await expect(title).toHaveCSS("text-align", "left");
      const actions = page.locator("#H01 .v1-actions");
      expect((await actions.boundingBox())!.x).toBeCloseTo(box!.x, 0);
      expect((await actions.locator("a").first().boundingBox())!.x).toBeCloseTo(box!.x, 0);
      await expect(actions).toHaveCSS("justify-content", "flex-start");
    }
    for (const element of await page.locator(".journal-list time, .doctrine-code .k").all()) {
      expect((await element.boundingBox())!.height).toBeLessThanOrEqual(24);
    }
    if (!route) {
      const note = (await page.locator(".home-s-close h2").boundingBox())!;
      expect(Math.abs(note.x + note.width / 2 - width / 2)).toBeLessThanOrEqual(2);
    }
    for (const control of await page.locator(".cmdbar .wordmark, .cmdbar .cmd-nav a:visible, .cmdbar .locale-toggle, .cmdbar .locale-toggle button, .cmdbar .cmd-menu-toggle:visible, .cmdbar .cmd-cta:visible").all()) {
      expect((await control.boundingBox())!.height).toBeCloseTo(48, 0);
    }
    if (route === "/commission") {
      const cal = (await page.locator(".cal-instrument").boundingBox())!;
      expect(cal.x).toBeCloseTo(left, 0);
      expect(cal.width).toBeCloseTo(width - 2 * left, 0);
    }
    const localFooter = page.locator("main footer.rev-footer, main footer.journal-article-footer");
    const technical = route === "/systems";
    await expect(localFooter).toHaveCount(technical ? 1 : 0);
    if (technical) {
      await expect(localFooter.locator(":scope > *")).toHaveCount(1);
      await expect(localFooter.locator(".registry-line")).toHaveCount(1);
      expect(await localFooter.innerText()).not.toMatch(/©|REV 0/);
    } else await expect(page.locator("main .registry-line")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await testInfo.attach(`alignment-${locale}-${width}`, { body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png" });
  });
}

import { mkdirSync } from "node:fs";
import { expect, test } from "./network-deny.setup";
import { localizedPath } from "../src/system/locale";
const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
if (!["localhost", "127.0.0.1"].includes(new URL(BASE).hostname)) throw new Error("Site V1 tests require a local server");
const routes = ["/", "/consulting-transformation", "/ai-sprints", "/engineering-integration", "/harness-engineering"];
test.use({ serviceWorkers: "block" });
for (const width of [360, 390, 768, 1024, 1440]) for (const locale of ["fr", "en"] as const) for (const route of routes) {
  test(`site V1 capture and proof ${locale} ${route} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const path = localizedPath(route, locale);
    expect((await page.goto(`${BASE}${path}`))?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://parrit.ai${path === "/" ? "" : path}`);
    await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute("href", `https://parrit.ai${localizedPath(route, "fr")}`);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", `https://parrit.ai${route === "/" ? "" : route}`);
    const main = page.locator("main");
    expect((await main.innerText()).replace(/MIT License/g, "")).not.toMatch(/Content Factor|usines? de contenu|FormIA|Qualiopi|\bMIT\b|[—–]|\d+\s*%/i);
    await expect(main.locator("img")).toHaveCount(route === "/" ? 2 : 0);
    await expect(main.locator("svg[role='img']")).toHaveCount(0);
    for (const img of await main.locator("img").all()) await expect(img).toHaveAttribute("src", /^\/brand\/scenes\/scene-carte-visite-(photo|fiche-crm)\.png$/);
    const claims = await main.evaluate(el => { const clone = el.cloneNode(true) as HTMLElement; clone.querySelectorAll("time, .scene-marker, .scene-chat-time").forEach(time => time.remove()); return clone.textContent; });
    expect(claims).not.toMatch(/\d/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator(".cmdbar")).not.toHaveCSS("position", "fixed");
    for (const action of await page.locator('a.rev-button[href$="/commission"]:visible').all()) {
      await expect(action).toHaveAttribute("href", localizedPath("/commission", locale));
      expect((await action.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    }
    if (width === 390 && route === "/") {
      expect(await page.evaluate(() => scrollY)).toBe(0);
      const actions = page.locator("#H01 .v1-actions a");
      await expect(actions).toHaveCount(2);
      for (const action of await actions.all()) {
        await expect(action).toBeInViewport({ ratio: 1 });
        const box = (await action.boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(844);
      }
    }
    if (width < 1201) {
      const menu = page.locator(".v1-mobile-menu"); await menu.locator("summary").click();
      await expect(menu.locator("nav a")).toHaveCount(7);
      const navBox = (await menu.boundingBox())!; const mainBox = (await main.boundingBox())!;
      expect(navBox.y + navBox.height).toBeLessThanOrEqual(mainBox.y + 1);
      await page.keyboard.press("Escape"); await expect(menu).not.toHaveAttribute("open", "");
      await expect(page.locator(".cmd-cta")).toBeVisible();
    } else await expect(page.locator(".cmd-nav > .v1-nav-entry")).toHaveCount(4);
    // Verify all text boxes fit the viewport; shared brand/aeration tests audit contrast.
    const overflow = await main.locator("h1, h2, h3, p, li, dd").evaluateAll(els => els.filter(el => { const b = el.getBoundingClientRect(); return b.width && (b.left < -1 || b.right > innerWidth + 1); }).map(el => el.textContent));
    expect(overflow).toEqual([]);
    if (process.env.SITE_V1_CAPTURE === "1") {
    mkdirSync("docs/site-v1/captures", { recursive: true });
    await page.screenshot({ path: `docs/site-v1/captures/${locale}-${route === "/" ? "home" : route.slice(1)}-${width}.png`, fullPage: true, animations: "disabled" });
    }
  });
}
for (const locale of ["fr", "en"] as const) for (const route of ["/", "/engineering-integration"]) {
  test(`tabs keyboard ${locale} ${route}`, async ({ page }) => {
    await page.goto(`${BASE}${localizedPath(route, locale)}`);
    await expect(page.getByRole("tablist")).toHaveAttribute("aria-label", locale === "fr" ? "Engineering & Intégration" : "Engineering & Integration");
    const tabs = page.getByRole("tab"); await expect(tabs).toHaveCount(3);
    await tabs.first().focus();
    for (const [key, index] of [["ArrowRight", 1], ["End", 2], ["ArrowRight", 0], ["ArrowLeft", 2], ["Home", 0]] as const) {
      await page.keyboard.press(key); await expect(tabs.nth(index)).toBeFocused(); await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
      await expect(page.getByRole("tabpanel")).toHaveCount(1); await expect(tabs.nth(index)).toHaveCSS("outline-style", "solid");
      const panel = page.getByRole("tabpanel"); await expect(panel).toHaveAttribute("aria-labelledby", (await tabs.nth(index).getAttribute("id"))!);
    }
    await tabs.nth(1).click(); await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  });
  test(`no JavaScript exposes all panels ${locale} ${route}`, async ({ page }) => {
    // Separate context is unnecessary: context option preserves the deny-all fixture.
    await page.goto(`${BASE}${localizedPath(route, locale)}`);
    const html = await page.request.get(`${BASE}${localizedPath(route, locale)}`, { maxRedirects: 0 });
    expect(html.status()).toBe(200);
    expect(await html.text()).toContain('data-enhanced="false"');
  });
}
test.describe("JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });
  for (const path of ["/", "/fr", "/engineering-integration", "/fr/engineering-integration"]) test(`all three panels and native mobile navigation remain usable ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 }); await page.setExtraHTTPHeaders({ "Accept-Language": "en" }); await page.goto(`${BASE}${path}`);
    await expect(page.locator(".v1-switcher h3")).toHaveCount(3);
    for (const heading of await page.locator(".v1-switcher h3").all()) await expect(heading).toBeVisible();
    await page.locator(".v1-mobile-menu summary").click(); await expect(page.locator(".v1-mobile-menu nav")).toBeVisible();
  });
});
test("contact aliases preserve tracking in a single 301", async ({ request }) => {
  for (const prefix of ["", "/fr"]) {
    const response = await request.get(`${BASE}${prefix}/contact?source=qa&utm_source=test`, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    const location = new URL(response.headers().location, BASE);
    expect(location.pathname).toBe(`${prefix}/commission`); expect(location.searchParams.get("source")).toBe("qa"); expect(location.searchParams.get("utm_source")).toBe("test");
  }
});

test("desktop engineering menu closes on Escape, outside click, links and route changes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`);
  const menu = page.locator(".cmd-nav details"); const summary = menu.locator("summary");
  await summary.click(); await expect(menu).toHaveAttribute("open", "");
  await page.keyboard.press("Escape"); await expect(menu).not.toHaveAttribute("open", ""); await expect(summary).toBeFocused();
  await summary.click(); await page.locator("main h1").click(); await expect(menu).not.toHaveAttribute("open", "");
  await summary.click(); await menu.locator('a[href="/engineering-integration#custom"]').click();
  await expect(page).toHaveURL(/engineering-integration#custom$/); await expect(menu).not.toHaveAttribute("open", "");
  await summary.click(); await menu.locator('a[href="/engineering-integration#integrations"]').click();
  await expect(page).toHaveURL(/engineering-integration#integrations$/); await expect(menu).not.toHaveAttribute("open", "");
  await summary.click(); await page.goBack(); await expect(menu).not.toHaveAttribute("open", "");
});
test("consulting legacy alias plus language choice has a single 301", async ({ request }) => {
  const response = await request.get(`${BASE}/fr/consulting-transformation?lang=en&source=qa&utm_source=test`, { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  const target = new URL(response.headers().location, BASE);
  expect(target.pathname).toBe("/consulting-transformation"); expect(target.search).toBe("?source=qa&utm_source=test");
  expect((await request.get(target.href, { maxRedirects: 0 })).status()).toBe(200);
});

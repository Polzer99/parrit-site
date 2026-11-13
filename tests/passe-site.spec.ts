import { readFile } from "node:fs/promises";
import type { Page } from "@playwright/test";
import { test, expect } from "./network-deny.setup";
import { CAL_LINK_COMMISSION, CAL_LINK_COMMISSION_EN } from "../site.config";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const local = (path: string) => {
  const url = new URL(path, BASE);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
};
test.use({ serviceWorkers: "block" });
async function calendar(page: Page) {
  const sdk = await readFile("node_modules/@calcom/embed-core/dist/embed/embed.js", "utf8");
  await page.route("**/embed/embed.js", async route => {
    expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
    await route.fulfill({ contentType: "application/javascript", body: sdk });
  });
  await page.route("**/embed?**", async route => {
    const url = new URL(route.request().url());
    expect(url.hostname).toBe("app.cal.com");
    expect([`/${CAL_LINK_COMMISSION}/embed`, `/${CAL_LINK_COMMISSION_EN}/embed`]).toContain(url.pathname);
    await route.fulfill({ contentType: "text/html", body: '<!doctype html><html><body><main>Calendrier local</main><script>for(const type of ["__iframeReady","linkReady"])parent.postMessage({fullType:"CAL:commission:"+type,data:{}},"*");</script></body></html>' });
  });
}
const headers = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "SAMEORIGIN",
  "content-security-policy": "frame-ancestors 'self'",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
};

// Correctif 3: actual next start response and hydrated desktop/mobile links.
// The auto fixture from network-deny.setup rejects every unexpected external request.
for (const prefix of ["", "/fr"]) {
  for (const path of ["/journal", "/journal/themes/ai-sprints", "/journal/what-is-parrit-ai", "/legal"]) {
    test(`cached page hydrates only campaign attribution ${prefix}${path}`, async ({ page }) => {
      await page.setExtraHTTPHeaders({ "accept-language": "en" });
      const response = await page.goto(local(`${prefix}${path}?source=essai&utm_custom=offhome&utm_campaign=c1&unknown=excluded`));
      expect(response?.status()).toBe(200);
      const cache = response?.headers()["cache-control"] ?? "";
      // s-maxage is the shared-cache directive used by Next's static responses.
      expect(cache).toMatch(/(?:^|,)\s*(?:public\b|s-maxage=[1-9]\d*)/i);
      expect(cache).not.toMatch(/\b(?:private|no-store|no-cache)\b/i);
      const buttons = page.locator(".single-header a.rev-button");
      await expect(buttons).toHaveCount(2);
      for (const button of await buttons.all()) {
        await expect.poll(async () => {
          const href = await button.getAttribute("href");
          const url = new URL(href ?? "", BASE);
          return {
            pathname: url.pathname,
            hash: url.hash,
            parameters: [...url.searchParams].sort(([a], [b]) => a.localeCompare(b)),
          };
        }).toEqual({
          pathname: prefix || "/",
          hash: "#contact",
          parameters: [["source", "rdv-nav"], ["utm_campaign", "c1"], ["utm_custom", "offhome"]],
        });
      }
    });
  }
}

for (const path of ["/", "/fr", "/journal/one-card-one-action", "/fr/journal/one-card-one-action", "/rendez-vous", "/fr/rendez-vous"]) {
  test(`real document security headers ${path}`, async ({ page }) => {
    await calendar(page);
    await page.setExtraHTTPHeaders({ "accept-language": "en" });
    const response = await page.goto(local(path));
    expect(response?.status()).toBe(200);
    for (const [key, value] of Object.entries(headers)) expect(response?.headers()[key]).toBe(value);
  });
}
for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "fr" ? "/fr" : "";
  for (const width of [1280, 390]) {
    test(`Journal navigation fits and indicates active page ${locale} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(local(`${prefix}/journal`));
      const header = page.locator(".single-header");
      if (width === 390) await header.locator("summary").click();
      const nav = header.locator(width === 390 ? ".mobile-menu nav" : ".desktop-nav");
      const journal = nav.getByRole("link", { name: "Journal", exact: true });
      await expect(journal).toBeVisible();
      await expect(journal).toHaveAttribute("aria-current", "page");
      await expect(journal).toHaveAttribute("href", `${prefix}/journal`);
      expect(await journal.evaluate(node => getComputedStyle(node).textDecorationLine)).toContain("underline");
      const boxes = await nav.locator("a").evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; }));
      for (const box of boxes) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width); }
      if (width === 1280) {
        for (const box of boxes) expect(Math.abs(box.top - boxes[0].top)).toBeLessThanOrEqual(1);
        const navBox = await nav.boundingBox();
        const languageBox = await header.locator(".languages").boundingBox();
        const buttonBox = await header.locator(":scope > .wrap > .btn").boundingBox();
        expect(navBox && languageBox && buttonBox).toBeTruthy();
        expect(navBox!.x + navBox!.width).toBeLessThanOrEqual(languageBox!.x);
        expect(languageBox!.x + languageBox!.width).toBeLessThanOrEqual(buttonBox!.x);
        expect(Math.abs(navBox!.y + navBox!.height / 2 - buttonBox!.y - buttonBox!.height / 2)).toBeLessThanOrEqual(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
  test(`booking header keeps attribution and Cal iframe loads under the CSP ${locale}`, async ({ page }) => {
    await calendar(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    const query = "source=journal-example&utm_source=mail&utm_custom=one&utm_custom=two";
    await page.goto(local(`${prefix}/rendez-vous?${query}`));
    await page.locator('.single-header > .wrap > a[href="#reservation"]').click();
    expect(page.url()).toBe(local(`${prefix}/rendez-vous?${query}#reservation`));
    await expect(page.locator("#reservation")).toBeInViewport();
    await expect.poll(() => page.frames().some(frame => frame.url().includes("app.cal.com"))).toBe(true);
    const frame = page.frames().find(frame => frame.url().includes("app.cal.com"));
    await expect(frame!.getByRole("main")).toHaveText("Calendrier local");
    const iframeUrl = new URL(frame!.url());
    expect(iframeUrl.searchParams.get("metadata[source]")).toBe("journal-example");
    expect(iframeUrl.searchParams.getAll("utm_custom")).toEqual(["one", "two"]);
  });
}

test.describe("booking without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const prefix of ["", "/fr"]) test(`native calendar fragment ${prefix}`, async ({ page }) => {
    const query = "source=journal-example&utm_custom=one&utm_custom=two";
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(local(`${prefix}/rendez-vous?${query}`));
    await page.locator('.single-header > .wrap > a[href="#reservation"]').click();
    expect(page.url()).toBe(local(`${prefix}/rendez-vous?${query}#reservation`));
    await expect(page.locator("#reservation")).toBeInViewport();
  });
});

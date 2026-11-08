import { readFile } from "node:fs/promises";
import type { Page } from "@playwright/test";
import { CAL_LINK_COMMISSION, CAL_LINK_COMMISSION_EN } from "../site.config";
import { ctaHref, type CtaId } from "../src/lib/registry/cta";
import { test, expect } from "./network-deny.setup";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const local = (path: string) => {
  const url = new URL(path, BASE);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
};

test.use({ serviceWorkers: "block" });

async function mockCalendar(page: Page) {
  const requests: URL[] = [];
  const sdk = await readFile("node_modules/@calcom/embed-core/dist/embed/embed.js", "utf8");
  await page.route("**/embed/embed.js", async route => {
    expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
    await route.fulfill({ contentType: "application/javascript", body: sdk });
  });
  await page.route("**/embed?**", async route => {
    const url = new URL(route.request().url());
    expect(url.hostname).toBe("app.cal.com");
    expect([`/${CAL_LINK_COMMISSION}/embed`, `/${CAL_LINK_COMMISSION_EN}/embed`]).toContain(url.pathname);
    requests.push(url);
    await route.fulfill({ contentType: "text/html", body: `<!doctype html><html><body>
      <main aria-label="Calendrier local">Calendrier de test</main><script>
      const send = (type, data = {}) => parent.postMessage({fullType: 'CAL:commission:' + type, data}, '*');
      send('__iframeReady'); send('__dimensionChanged', {iframeHeight: 570}); send('linkReady');
      </script></body></html>` });
  });
  return requests;
}

for (const locale of ["fr", "en"] as const) for (const width of [1440, 375]) {
  test(`booking page and real SDK attribution ${locale} ${width}`, async ({ page, context }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
    const calendar = await mockCalendar(page);
    // Attribution must not depend on or write browser storage.
    await page.addInitScript(() => {
      for (const name of ["localStorage", "sessionStorage"]) Object.defineProperty(window, name, { get: () => { throw new Error("Storage forbidden"); } });
    });
    const prefix = locale === "fr" ? "/fr" : "";
    const response = await page.goto(local(`${prefix}/rendez-vous?source=journal-test&utm_source=x&utm_content=a%26b&utm_custom=one&utm_custom=two`));
    expect(response?.status()).toBe(200);
    // Count only document headings: Cal's shadow DOM contains its own empty h1.
    await expect.poll(() => page.evaluate(() => document.querySelectorAll("h1").length)).toBe(1);
    await expect.poll(() => page.evaluate(() => document.querySelector("h1")?.textContent?.trim())).toBe(locale === "fr" ? "Entretien stratégique IA, 15 minutes" : "AI strategy call, 15 minutes");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    await expect(page.locator('main a[href="mailto:paul.larmaraud@parrit.ai"]')).toBeVisible();
    await expect.poll(() => calendar.length).toBe(1);
    expect(calendar[0].pathname).toBe(`/${locale === "fr" ? CAL_LINK_COMMISSION : CAL_LINK_COMMISSION_EN}/embed`);
    expect(calendar[0].searchParams.get("metadata[source]")).toBe("journal-test");
    expect(calendar[0].searchParams.get("utm_source")).toBe("x");
    expect(calendar[0].searchParams.get("utm_content")).toBe("a&b");
    expect(calendar[0].searchParams.getAll("utm_custom")).toEqual(["one", "two"]);
    expect(calendar[0].searchParams.has("source")).toBe(false);
    expect(await context.cookies()).toEqual([]);
    await expect(page.locator('.cal-embed-stage')).toHaveAttribute("data-ready", "true");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`rendez-vous-${locale}-${width}.png`), fullPage: true });
  });
}

for (const source of ["<script>", "a".repeat(81), "valid\n", "valid\r"]) {
  test(`invalid source is not passed to iframe: ${JSON.stringify(source.slice(0, 20))}`, async ({ page }) => {
    const calendar = await mockCalendar(page);
    await page.goto(local(`/fr/rendez-vous?source=${encodeURIComponent(source)}&utm_source=x&theme=light&email=private`));
    await expect.poll(() => calendar.length).toBe(1);
    expect(calendar[0].searchParams.has("metadata[source]")).toBe(false);
    expect(calendar[0].searchParams.get("utm_source")).toBe("x");
    expect(calendar[0].searchParams.get("theme")).toBe("dark");
    expect(calendar[0].searchParams.has("email")).toBe(false);
  });
}

// Articles have one canonical EN URL. FR interface rendering is covered by
// booking-render.test.mjs, using the existing server locale contract.
for (const [path, source, locale] of [
  ["/journal/malicious-mcp-server-after-install", "journal-malicious-mcp-server-after-install", "en"],
  ["/journal/themes/ai-sprints", "theme-ai-sprints", "en"],
  ["/fr/journal/themes/ai-sprints", "theme-ai-sprints", "fr"],
] as const) for (const width of [1440, 375]) {
  test(`call block placement and navigation ${path} ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
    await mockCalendar(page);
    await page.goto(local(path));
    const block = page.locator(".booking-call");
    await expect(block).toHaveCount(1);
    await expect(block).toHaveAttribute("lang", locale);
    await expect(block.locator(":scope > *")).toHaveCount(4);
    await expect(page.locator(".exec")).toHaveCount(1);
    const button = block.locator(".exec");
    const href = `${locale === "fr" ? "/fr" : ""}/rendez-vous?source=${source}`;
    await expect(button).toHaveAttribute("href", href);
    expect(await block.innerText()).not.toMatch(/offert|gratuit|€|countdown|compte à rebours/i);
    const order = await block.evaluate(node => ({
      preceding: node.previousElementSibling?.className,
      following: node.nextElementSibling?.className,
      bodyLanguage: document.querySelector(".journal-body")?.getAttribute("lang"),
    }));
    if (source.startsWith("journal-")) {
      expect(order.preceding).toBe("journal-body");
      expect(order.following).toBe("journal-related");
      expect(order.bodyLanguage).toBe("en");
    } else expect(order.following).toBeUndefined();
    await block.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const dimensions = await button.evaluate(node => ({ button: node.getBoundingClientRect().width, parent: node.parentElement!.getBoundingClientRect().width }));
    if (width >= 600) expect(dimensions.button).toBeLessThan(dimensions.parent);
    else expect(Math.abs(dimensions.button - dimensions.parent)).toBeLessThanOrEqual(1);
    await block.screenshot({ path: testInfo.outputPath(`appel-${locale}-${width}.png`) });
    await button.click();
    await expect(page).toHaveURL(local(href));
    // Use the same document-only scope after client-side navigation.
    await expect.poll(() => page.evaluate(() => document.querySelectorAll("h1").length)).toBe(1);
    await expect.poll(() => page.evaluate(() => document.querySelector("h1")?.textContent?.trim())).toBe(locale === "fr" ? "Entretien stratégique IA, 15 minutes" : "AI strategy call, 15 minutes");
  });
}

for (const locale of ["fr", "en"] as const) {
  test(`every booking registry CTA resolves to a 200 (${locale})`, async ({ page }) => {
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
    await mockCalendar(page);
    const ids: CtaId[] = ["rdv.paul", "rdv.systeme", "rdv.offre", "rdv.auteur", "prototype.demander"];
    for (const id of ids) {
      const response = await page.goto(local(ctaHref(id, locale, "registry-test")));
      expect(response?.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(`${locale === "fr" ? "/fr" : ""}/rendez-vous`);
    }
  });
}

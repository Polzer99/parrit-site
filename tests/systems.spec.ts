import { expectPopulated } from "./content-structure";
import type { APIRequestContext } from "@playwright/test";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });

for (const width of [375, 767, 768, 1440]) {
  for (const locale of ["en", "fr"] as const) {
    test(`systems ${locale} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const prefix = locale === "fr" ? "/fr" : "";
      const response = await page.goto(`${BASE_URL}${prefix}/systems`);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expectPopulated(page.getByRole("heading", { level: 1 }));
      const cards = page.locator("#capacites article");
      await expect(cards).toHaveCount(4);
      for (const card of await cards.all()) {
        await expect(card).toBeVisible();
        await expect(card.getByRole("heading", { level: 3 })).toBeVisible();
        await expectPopulated(card.locator("dt"), 4);
        for (const value of await card.locator("dd").all()) {
          await expect(value).toBeVisible();
          expect((await value.innerText()).trim().length).toBeGreaterThan(0);
        }
        await expect(card.locator("footer")).toBeVisible();
      }
      const table = page.getByRole("table");
      await expect(table).toBeVisible();
      await expect(table.locator("caption time")).toHaveAttribute("datetime", "2026-09-13");
      await expectPopulated(table.locator("caption time"));
      await expect(table.locator("tbody tr")).toHaveCount(7);
      const outreach = table.locator("tbody tr").filter({ has: page.locator("td", { hasText: /Lemlist/ }) });
      await expect(outreach).toHaveCount(1);
      await expectPopulated(outreach.locator("th"));
      await expect(outreach.locator("td").nth(1)).toHaveText(/(?:being|underway|in progress).*transfer|transfer.*(?:underway|in progress)|en cours.*transfert/i);
      await expect(outreach.locator("td").last()).toHaveText("0");
      const distinction = page.locator("#acquisition-distinction");
      await expect(distinction).toBeVisible();
      await expectPopulated(distinction);
      // Evidence remains bounded: public signals, no meetings or sales yet.
      await expect(distinction).toContainText(/publi(?:c|que)/i);
      await expect(distinction).toContainText(/aucun rendez-vous|(?:not|no|hasn't)[^.]*meeting/i);
      await expect(distinction).toContainText(/aucune vente|no sale/i);
      await expect(distinction).toContainText(/connaissons déjà|already know/i);
      await expect(page.locator("#offre")).toHaveCount(0);
      await expect(page.locator("body")).not.toContainText(/€|sur devis|custom quote/i);
      await expectPopulated(page.locator("#faq"));
      await expect(page.locator("#faq h3")).toHaveCount(4);
      await expect(page.locator("#operating-view .r2-phase")).toHaveCount(0);
      await expect(page.locator('[id^="step-"]')).toHaveCount(0);
      const narrative = page.locator("#operating-view > p").first();
      await expectPopulated(narrative);
      await expect(page.locator('#operating-view > p + .mechanism-diagram')).toHaveCount(1);
      await expect(page.locator('#operating-view > .mechanism-diagram + .registry-snapshot')).toHaveCount(1);
      await expect(page.locator(".registry-snapshot + #acquisition-distinction")).toHaveCount(1);
      await expectPopulated(table.locator("thead th"), 4);
      const headings = await table.locator("thead th").allTextContents();
      for (const row of await table.locator("tbody tr").all()) {
        for (let i = 0; i < headings.length; i++) await expect(row.locator("th, td").nth(i)).toHaveAttribute("data-label", headings[i]);
      }
      await expect(table.locator("tbody tr td:last-child")).toHaveText(["11", "1", "0", "1", "2", "6", "6"]);
      await expectPopulated(page.locator(".registry-snapshot > p"));
      expect((await page.locator(".registry-snapshot > p").innerText()).match(/\d+/g)).toEqual(["25", "1", "8", "4", "12", "7", "25"]);
      const guards = page.locator("#garde-fous a");
      for (let i = 0; i < 4; i++) await expect(guards.nth(i)).toHaveAttribute("href", i < 3 ? "#operating-view" : "#capacites");
      expect(await page.locator("main").innerText()).not.toMatch(/—|R-06|R-13|PARITY_FAIL|NOT_STARTED|CUTOVER|MIGRATING/);
      await expect(page.locator('main a[href$="/commission"]')).toHaveCount(3);
      for (const link of await page.locator("main a").all()) {
        const href = await link.getAttribute("href");
        expect(href).toBeTruthy();
        if (href!.startsWith("#")) await expect(page.locator(href!)).toHaveCount(1);
        else expect(["commission", "build-with-you", "manufacture", "legal"].map((path) => `${prefix}/${path}`)).toContain(href);
      }
      // Request APIs bypass the browser deny-all: strictly local URLs, no redirects.
      const base = new URL(BASE_URL);
      expect(["localhost", "127.0.0.1"]).toContain(base.hostname);
      for (const path of ["commission", "build-with-you", "manufacture", "legal"]) {
        const destination = await page.request.get(`${base.origin}${prefix}/${path}`, { maxRedirects: 0 });
        expect(destination.status(), `Destination ${prefix}/${path}`).toBe(200);
        await destination.dispose();
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://parrit.ai${prefix}/systems`);
      await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute("href", "https://parrit.ai/fr/systems");
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", "https://parrit.ai/systems");
      expect(await page.locator("#capacites .home-s-offers-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length)).toBe(width < 768 ? 1 : 2);
      expect(await page.locator("main").evaluate((el) => [...el.querySelectorAll("*")].every((child) => {
        const rect = child.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= innerWidth;
      }))).toBe(true);
      if (width === 375 || width === 1440) {
        await testInfo.attach(`systems-${locale}-${width}-full-page`, {
          body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png",
        });
        for (const selector of [".r2-hero", '[aria-labelledby="evidence-heading"]', "#operating-view", "#capacites", "#r06", "#method", "#garde-fous", "#faq"]) {
          await testInfo.attach(`systems-${locale}-${width}-${selector.replace(/[^a-z-]/gi, "")}`, {
            body: await page.locator(selector).screenshot({ animations: "disabled" }), contentType: "image/png",
          });
        }
      }
    });
  }
}

async function getLocal(request: APIRequestContext, url: string) {
  const target = new URL(url);
  // Deny-all HTTP : la fixture request échappe aux interceptions navigateur.
  expect(["localhost", "127.0.0.1"]).toContain(target.hostname);
  expect(target.origin, `Origine interdite : ${url}`).toBe(new URL(BASE_URL).origin);
  // Aucun suivi, même si un serveur local redirige vers un service réel.
  return request.get(url, { maxRedirects: 0 });
}

async function getText(request: APIRequestContext, url: string): Promise<string> {
  const response = await getLocal(request, url);
  try {
    expect(response.status(), `URL inaccessible : ${url}`).toBe(200);
    return await response.text();
  } finally {
    await response.dispose();
  }
}

test("systems routes appear in sitemap with reciprocal language URLs", async ({ request }) => {
  const xml = await getText(request, `${BASE_URL}/sitemap.xml`);
  expect(xml).toContain("https://parrit.ai/systems");
  expect(xml).toContain("https://parrit.ai/fr/systems");
});

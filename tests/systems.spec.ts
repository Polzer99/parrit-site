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
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale === "fr" ? "Nous montrons le système. Vous jugez avant de vous engager." : "We show the system. You judge before you commit.");
      const cards = page.locator("#capacites article");
      await expect(cards).toHaveCount(4);
      const labels = locale === "fr" ? ["Entrée", "Traitement", "Sortie", "Limites"] : ["Input", "Process", "Output", "Limits"];
      for (const card of await cards.all()) {
        await expect(card).toBeVisible();
        await expect(card.getByRole("heading", { level: 3 })).toBeVisible();
        await expect(card.locator("dt")).toHaveText(labels);
        for (const value of await card.locator("dd").all()) {
          await expect(value).toBeVisible();
          expect((await value.innerText()).trim().length).toBeGreaterThan(0);
        }
        await expect(card.locator("footer")).toBeVisible();
      }
      const table = page.getByRole("table");
      await expect(table).toBeVisible();
      await expect(table.locator("caption time")).toHaveText("2026-09-13");
      await expect(table.locator("tbody tr")).toHaveCount(7);
      await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Le transfert n'a pas commencé" : "Transfer not started");
      await expect(table.locator("tbody tr").nth(2).locator("td").last()).toHaveText("0");
      const distinction = page.locator("#acquisition-distinction");
      await expect(distinction).toBeVisible();
      for (const phrase of locale === "fr" ? ["il repère, dans des informations publiques", "aucun rendez-vous", "aucune vente", "personnes que nous connaissons déjà"] : ["it looks for public signs", "a single meeting", "no sale", "people we already know"]) await expect(distinction).toContainText(phrase);
      await expect(page.locator("#offre article")).toHaveCount(1);
      await expect(page.locator("#offre .offer-price")).toHaveText(locale === "fr" ? "3 200 € HT · forfait" : "€3,200 excl. VAT · fixed fee");
      await expect(page.locator("#faq h3")).toHaveCount(4);
      await expect(page.locator("#operating-view .r2-phase")).toHaveCount(0);
      await expect(page.locator('[id^="step-"]')).toHaveCount(0);
      const narrative = page.locator("#operating-view > p").first();
      await expect(narrative).toContainText(locale === "fr" ? "Prenons l'exemple le plus net : l'identification de nos contacts." : "Take the clearest example: contact identification.");
      await expect(page.locator("#operating-view > p + .registry-snapshot")).toHaveCount(1);
      await expect(page.locator(".registry-snapshot + #acquisition-distinction")).toHaveCount(1);
      const headings = locale === "fr"
        ? ["Type d'information", "Où l'information est enregistrée", "Situation", "Anciens points d'écriture recensés"]
        : ["Type of information", "Where it's recorded", "Status", "Legacy write points on record"];
      await expect(table.locator("thead th")).toHaveText(headings);
      for (const row of await table.locator("tbody tr").all()) {
        for (let i = 0; i < headings.length; i++) await expect(row.locator("th, td").nth(i)).toHaveAttribute("data-label", headings[i]);
      }
      await expect(table.locator("tbody tr td:last-child")).toHaveText(["11", "1", "0", "1", "2", "6", "6"]);
      await expect(page.locator(".registry-snapshot > p")).toHaveText(locale === "fr"
        ? "25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, une vérification a trouvé un désaccord entre les deux versions. Pour 12, le transfert n'a pas encore commencé. Le compte des anciens outils inclut des points déjà mis en pause ou en échec, gardés au registre jusqu'à fermeture actée."
        : "25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, a check found a disagreement between the two versions. For 12, the transfer hasn't started. The legacy-tool count includes points already paused or failing, kept on record until formally closed.");
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
        for (const selector of [".r2-hero", '[aria-labelledby="evidence-heading"]', "#operating-view", "#capacites", "#r06", "#method", "#garde-fous", "#offre", "#faq"]) {
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

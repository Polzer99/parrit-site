import { PUBLIC_ROUTES } from "./public-routes";
import { readdirSync } from "node:fs";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const noOffer = /offert|gratuit|\bfree\b|forfait|fixed price|sur devis|custom quote|sans engagement|no commitment|pas un abonnement|not subscribed|\b1[05][\s-]?(min|minutes|heures|hours)\b|\b30[\s-]?min|à partir de(?! vos opérations\b)|\bHT\b|excl\. VAT/i;
// Only whole, verbatim status lines are exempt, never substrings or patterns.
const approvedStatuses = new Set([
  "Démonstration, données fictives.", "Demonstration, fictional data.",
  "Exemple illustratif", "Illustrative example",
  "Scènes reconstituées sur données fictives, fidèles aux systèmes en service.",
  "Scenes recreated with fictional data, true to the systems in use.",
]);
const withoutStatuses = (copy: string) => copy.split("\n").filter(line => !approvedStatuses.has(line.trim())).join("\n");
const forbidden = [
  /[—–]/,
  /\b(fictifs?|fictives?|fictional|illustrati(?:fs?|ves?)|illustrées?|non interactive|pas une analyse|not an analysis)\b/i,
  /\bREV\s?0\d\b|\bPS-0\d\b|\bSTD-\d\.\d\b|\bP0\b/,
  /(?:^|[.!?]\s+)(?:Pas|Not)\s+[^.!?]{1,40}\.\s+[A-ZÀ-Ý][^.!?]{1,60}\./,
];
test.use({ serviceWorkers: "block" });
for (const locale of ["en", "fr"]) {
  const articles = readdirSync("content/journal").filter((file) => file.endsWith(".mdx")).map((file) => `/journal/${file.slice(0, -4)}`);
  const routes = PUBLIC_ROUTES.filter(path => locale === "fr" ? path === "/fr" || path.startsWith("/fr/") : !path.startsWith("/fr"));
  for (const pathname of [...routes, ...(locale === "en" ? articles : [])]) {
    const route = pathname === "/" || pathname === "/fr" ? "" : pathname.replace(/^\/fr\//, "/");
    test(`public copy ${locale} ${route || "/"}`, async ({ page }) => {
      // Known third-party embed is mocked; all other outbound traffic fails the fixture.
      await page.route("https://app.cal.com/**", (request) => request.fulfill({ body: "", contentType: "text/html" }));
      await page.route("https://cal.com/**", (request) => request.fulfill({ body: "", contentType: "text/html" }));
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
      await page.goto(`${BASE_URL}${pathname}`);
      const article = articles.includes(route);
      // Editorial articles retain HEAD's scope for internal version references
      // and rhetorical patterns. Dashes and unapproved status wording are checked everywhere.
      const patterns = article ? forbidden.slice(0, 2) : forbidden;
      const audit = async () => {
        const text = await page.locator("body").innerText();
        const attributes = await page.locator("[aria-label], [alt]").evaluateAll((elements) => elements.flatMap((el) => [el.getAttribute("aria-label"), el.getAttribute("alt")]).filter(Boolean).join("\n"));
        for (const pattern of patterns) expect(withoutStatuses(`${text}\n${attributes}`)).not.toMatch(pattern);
        const metadata = await page.locator('title, meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]').evaluateAll((elements) => elements.map((el) => el.getAttribute("content") ?? el.textContent ?? "").join("\n"));
        const publicCopy = `${text}\n${attributes}\n${metadata}`.replace(/(?:synchronisation (?:qui tourne )?toutes les|sync job (?:that runs|running) every) 15 minutes/g, "");
        // Preserve HEAD's editorial noOffer scope: article bodies discuss third-party
        // tools (e.g. free libraries); themes are public pages, never articles.
        if (!article) expect(publicCopy).not.toMatch(noOffer);
        for (const pattern of patterns) expect(withoutStatuses(metadata)).not.toMatch(pattern);
        if (route !== "/legal" && !article) expect(publicCopy).not.toContain("€");
        if (route !== "/legal" && route !== "") {
          expect(publicCopy).not.toMatch(/\bPaul\b|Larmaraud|fondat(eur|rice)|fondée par|founder|founded by|quinze minutes|fifteen minutes/i);
          await expect(page.locator('a[href*="paul-larmaraud.com"]')).toHaveCount(0);
        }
        if (!route) await expect(page.locator(".home-s-offers")).toHaveCount(0);
        await expect(page.locator(".offer-price")).toHaveCount(0);
        if (locale === "fr") {
          // Exclude time elements and Journal lists only, never other page copy.
          const french = await page.locator("body").evaluate((body) => {
            const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
            const texts: string[] = [];
            while (walker.nextNode()) {
              const parent = walker.currentNode.parentElement;
              if (parent && !parent.closest("script, style, time[datetime], .journal-list, .home-s-journal ol") && parent.getClientRects().length) texts.push(walker.currentNode.textContent ?? "");
            }
            return texts.join(" ");
          });
          expect(`${french}\n${attributes}`).not.toMatch(/\b20\d\d-\d\d-\d\d\b/);
        }
      };
      await audit();
      if (!route) {
        await expect(page.locator(".contact-fallback input[type=email]")).toBeVisible();
        await audit();
      }
    });
  }
}

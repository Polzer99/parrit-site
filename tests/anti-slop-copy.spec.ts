import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const routes = ["", "/systems", "/journal", "/standard", "/commission", "/manufacture", "/build-with-you", "/dossiers", "/legal"];
const forbidden = [
  /[—–]/,
  /\b(fictif|fictive|fictional|illustrati(f|ve)|illustrées?|non interactive|pas une analyse|not an analysis)\b/i,
  /\bREV\s?0\d\b|\bPS-0\d\b|\bSTD-\d\.\d\b|\bP0\b/,
  /(?:^|[.!?]\s+)(?:Pas|Not)\s+[^.!?]{1,40}\.\s+[A-ZÀ-Ý][^.!?]{1,60}\./,
];
test.use({ serviceWorkers: "block" });
for (const locale of ["en", "fr"]) {
  for (const route of routes) {
    test(`public copy ${locale} ${route || "/"}`, async ({ page }) => {
      // Known third-party embed is mocked; all other outbound traffic fails the fixture.
      await page.route("https://app.cal.com/**", (request) => request.fulfill({ body: "", contentType: "text/html" }));
      await page.route("https://cal.com/**", (request) => request.fulfill({ body: "", contentType: "text/html" }));
      await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : ""}${route || (locale === "en" ? "/" : "")}`);
      const audit = async () => {
        const text = await page.locator("body").innerText();
        const attributes = await page.locator("[aria-label], [alt]").evaluateAll((elements) => elements.flatMap((el) => [el.getAttribute("aria-label"), el.getAttribute("alt")]).filter(Boolean).join("\n"));
        for (const pattern of forbidden) expect(`${text}\n${attributes}`).not.toMatch(pattern);
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
        await expect(async () => {
          await page.locator("#agent-operation").fill(locale === "fr" ? "relance client" : "client follow-up");
          await page.locator(".agent-esquisse-form button").click();
          await expect(page.locator(".agent-esquisse-transition")).toBeVisible();
        }).toPass();
        await audit();
      }
    });
  }
}

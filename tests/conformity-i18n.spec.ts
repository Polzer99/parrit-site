import { FRENCH_JOURNAL_SLUGS } from "../src/system/journal-translations";
import { expectPopulated } from "./content-structure";
import { expect, test } from "./network-deny.setup";
import type { BrowserContext, Page } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
if (!["localhost", "127.0.0.1"].includes(new URL(BASE_URL).hostname)) throw new Error("Local test origin required");
const SITE = "https://parrit.ai";
// Next émet la racine sans slash final (https://parrit.ai) ; toute attente
// d'URL absolue passe par ici pour suivre cette convention.
const absolute = (pathname: string) => (pathname === "/" ? SITE : `${SITE}${pathname}`);
const PAGES = ["", "/legal", "/journal", "/journal/themes/harness-engineering", "/journal/themes/ai-sprints", "/journal/themes/integration-developpement", "/journal/themes/conseil-transformation"];

async function switchHeaderLanguage(
  page: Page,
  context: BrowserContext,
  target: "en" | "fr",
  expectedUrl: string,
  expectedLocale: "en" | "fr" = target,
) {
  const label = target.toUpperCase();
  await expect(async () => {
    const link = page.locator(".cmdbar").getByRole("link", { name: label, exact: true });
    await expect(link).toBeVisible({ timeout: 1_000 });
    const destination = new URL(expectedUrl);
    // The browser-only fragment reaches href after hydration; wait for the real destination.
    await expect(link).toHaveAttribute("href", destination.pathname + destination.search + destination.hash);
    await link.click({ timeout: 1_000 });
    await expect(page).toHaveURL(expectedUrl, { timeout: 1_500 });
    expect((await context.cookies()).find(({ name }) => name === "parrit_locale")?.value).toBe(target);
    await expect(page.locator("html")).toHaveAttribute("lang", expectedLocale, { timeout: 1_000 });
  }).toPass({
    intervals: [100, 250, 500],
    timeout: 10_000,
  });
}

test.use({ serviceWorkers: "block" });

test.beforeEach(async ({ page }) => {
  // The real booking embed is expected but must never leave the test browser.
  await page.route("https://app.cal.com/**", (route) => route.fulfill({ contentType: "text/html", body: "" }));
  await page.route("https://cal.com/**", (route) => route.fulfill({ contentType: "text/html", body: "" }));
});

test("/fr serves French HTML, heading and self canonical", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  const response = await page.goto(`${BASE_URL}/fr`);
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expectPopulated(page.locator("h1"));
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/fr`);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "fr_FR");
});

test("Googlebot receives English on bare URL despite French preference", async ({ request }) => {
  // Le runner n'applique pas setExtraHTTPHeaders sur la premiere navigation
  // (constate au proxy de logging, 07/09) : les assertions de protocole
  // passent par APIRequestContext, qui envoie les en-tetes verbatim.
  const response = await request.get(`${BASE_URL}/`, {
    headers: { "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8", "User-Agent": "Googlebot" },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('<html lang="en"');
  expect(html).toMatch(/<h1\b[^>]*>[\s\S]*?\S[\s\S]*?<\/h1>/);
  expect(html).toContain(`<link rel="canonical" href="${SITE}"/>`);
});

for (const path of PAGES) {
  test(`reciprocal hreflang and path metadata: ${path || "/"}`, async ({ page, context }) => {
    await context.addCookies([{ name: "parrit_locale", value: "fr", url: BASE_URL }]);
    const descriptions: string[] = [];
    for (const lang of ["en", "fr"] as const) {
      const pathname = lang === "fr" ? `/fr${path}` : path || "/";
      await page.goto(`${BASE_URL}${pathname}`);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", absolute(pathname));
      for (const [hreflang, url] of [["en", path || "/"], ["fr", `/fr${path}`], ["x-default", path || "/"]]) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveAttribute("href", absolute(url));
      }
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description).toBeTruthy();
      descriptions.push(description ?? "");
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description ?? "");
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", absolute(pathname));
    }
    expect(descriptions[0]).not.toBe(descriptions[1]);
  });
}

for (const [source, target] of [
  ["/?lang=fr&utm_source=test", "/fr?utm_source=test"],
  ["/legal?lang=fr&source=test", "/fr/legal?source=test"],
  ["/fr/legal?lang=en&utm_campaign=test", "/legal?utm_campaign=test"],
  ["/fr?lang=en", "/"],
]) {
  test(`legacy choice is a single 301: ${source}`, async ({ page }) => {
    await page.setExtraHTTPHeaders({ "Accept-Language": "fr" });
    const response = await page.goto(`${BASE_URL}${source}`);
    const previous = response?.request().redirectedFrom();
    expect(previous).toBeTruthy();
    expect((await previous?.response())?.status()).toBe(301);
    expect(previous?.redirectedFrom()).toBeNull();
    await expect(page).toHaveURL(`${BASE_URL}${target}`);
  });
}

test("French negotiation is 302, preserves query and does not record a choice", async ({ request }) => {
  const headers = { "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8" };
  const response = await request.get(`${BASE_URL}/legal?source=test`, { headers, maxRedirects: 0 });
  expect(response.status()).toBe(302);
  const location = new URL(response.headers()["location"] ?? "", BASE_URL);
  expect(`${location.pathname}${location.search}`).toBe("/fr/legal?source=test");
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["vary"]?.toLowerCase()).toContain("user-agent");
  expect(response.headers()["set-cookie"]).toBeUndefined();
  const followed = await request.get(location.href, { headers, maxRedirects: 0 });
  expect(followed.status()).toBe(200);
  expect(await followed.text()).toContain('<html lang="fr"');
});

for (const choice of ["en", "fr"]) {
  test(`choice cookie ${choice} suppresses negotiation without changing bare content`, async ({ page, context }) => {
    await context.addCookies([{ name: "parrit_locale", value: choice, url: BASE_URL }]);
    await page.setExtraHTTPHeaders({ "Accept-Language": "fr" });
    const response = await page.goto(`${BASE_URL}/legal`);
    expect(response?.request().redirectedFrom()).toBeNull();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
}

test("header switches paths, saves choice and preserves query/hash", async ({ page, context }) => {
  await page.goto(`${BASE_URL}/fr/legal?source=test&utm_campaign=language#top`);
  await switchHeaderLanguage(page, context, "en", `${BASE_URL}/legal?source=test&utm_campaign=language#top`);
  await expect(page).toHaveURL(`${BASE_URL}/legal?source=test&utm_campaign=language#top`);
  expect((await context.cookies()).find(({ name }) => name === "parrit_locale")?.value).toBe("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await switchHeaderLanguage(page, context, "fr", `${BASE_URL}/fr/legal?source=test&utm_campaign=language#top`);
  await expect(page).toHaveURL(`${BASE_URL}/fr/legal?source=test&utm_campaign=language#top`);
  expect((await context.cookies()).find(({ name }) => name === "parrit_locale")?.value).toBe("fr");
  // §7 keeps one desktop action and moves the phone action into its native menu.
  for (const selector of [".cmdbar > .wrap > a.rev-button", ".cmdbar .mobile-menu a.rev-button"]) {
    const action = page.locator(selector);
    await expect(action).toHaveCount(1);
    const target = new URL((await action.getAttribute("href"))!, BASE_URL);
    expect(target.pathname).toBe("/fr");
    expect(target.hash).toBe("#contact");
    expect(target.searchParams.getAll("source")).toEqual(["rdv-nav"]);
    expect(target.searchParams.get("utm_campaign")).toBe("language");
  }
});

for (const target of ["fr", "en"] as const) {
  test(`language links follow fragment changes and browser history (${target})`, async ({ page, context }) => {
    const start = target === "fr" ? "/legal" : "/fr/legal";
    const destination = target === "fr" ? "/fr/legal" : "/legal";
    const query = "?source=test&utm_campaign=a%26b&utm_custom=one&utm_custom=two";
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
    await page.goto(`${BASE_URL}${start}${query}#top`);
    const header = page.locator(".cmdbar").getByRole("link", { name: target.toUpperCase(), exact: true });
    const footer = page.locator(`.single-footer a[hreflang="${target}"]`);
    for (const link of [header, footer]) await expect(link).toHaveAttribute("href", `${destination}${query}#top`);
    await page.evaluate(() => { window.location.hash = "section%20two"; });
    for (const link of [header, footer]) await expect(link).toHaveAttribute("href", `${destination}${query}#section%20two`);
    await page.evaluate(() => window.history.back());
    await expect(page).toHaveURL(`${BASE_URL}${start}${query}#top`);
    for (const link of [header, footer]) await expect(link).toHaveAttribute("href", `${destination}${query}#top`);
    await footer.click();
    await expect(page).toHaveURL(`${BASE_URL}${destination}${query}#top`);
    expect((await context.cookies()).find(({ name }) => name === "parrit_locale")?.value).toBe(target);
    await expect(page.locator("html")).toHaveAttribute("lang", target);
  });
}

test("home language switches translate the current fragment in both directions", async ({ page, context }) => {
  await page.goto(`${BASE_URL}/fr?source=test&utm_source=mail#parcours`);
  await switchHeaderLanguage(page, context, "en", `${BASE_URL}/?source=test&utm_source=mail#path`);
  await switchHeaderLanguage(page, context, "fr", `${BASE_URL}/fr?source=test&utm_source=mail#parcours`);
});

test("translated Journal articles keep their own language and switch to their equivalent", async ({ page, context }) => {
  const path = "/journal/one-card-one-action";
  const query = "source=test&utm_source=mail&utm_campaign=a%26b&utm_custom=one&utm_custom=two";
  await page.setExtraHTTPHeaders({ "Accept-Language": "fr" });
  const direct = await page.goto(`${BASE_URL}${path}?${query}`);
  expect(direct?.status()).toBe(200);
  expect(direct?.request().redirectedFrom()).toBeNull();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute("href", `${SITE}/fr${path}`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${path}`);
  await expect(page.locator("[data-language-note]")).toHaveCount(0);
  await expectPopulated(page.locator(".journal-header .journal-deck"));
  const englishTitle = await page.locator("h1").textContent();
  const englishBody = await page.locator(".journal-body").textContent();
  const french = await page.goto(`${BASE_URL}/fr${path}?lang=fr&${query}`);
  expect(french?.status()).toBe(200);
  expect(french?.request().redirectedFrom()).toBeNull();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("h1")).not.toHaveText(englishTitle!);
  await expect(page.locator(".journal-body")).not.toHaveText(englishBody!);
  await expect(page.locator(".journal-body")).toHaveAttribute("lang", "fr");
  await expect(page.locator("[data-language-note]")).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/fr${path}`);
  await switchHeaderLanguage(page, context, "en", `${BASE_URL}${path}?${query}`);
  await expect(page.locator("h1")).toHaveText(englishTitle!);
  await expect(page.locator(".journal-body")).toHaveText(englishBody!);
  await switchHeaderLanguage(page, context, "fr", `${BASE_URL}/fr${path}?${query}`);
  await expect(page.locator(".journal-body")).toHaveAttribute("lang", "fr");
  await expect(page.locator("[data-language-note]")).toHaveCount(0);
});

test.describe("Journal renamings and language links without hydration", () => {
  test.use({ javaScriptEnabled: false });
  for (const target of ["fr", "en"] as const) test(`source and UTM survive renaming and native ${target} link`, async ({ page }) => {
    const path = "/journal/one-card-one-action";
    const startPrefix = target === "en" ? "/fr" : "";
    const targetPrefix = target === "fr" ? "/fr" : "";
    const query = "source=test&utm_source=mail&utm_campaign=a%26b&utm_custom=one&utm_custom=two";
    const response = await page.goto(`${BASE_URL}${startPrefix}/journal/une-carte-une-action?lang=fr&${query}`);
    const original = response?.request().redirectedFrom();
    expect(original).toBeTruthy();
    expect(original!.redirectedFrom()).toBeNull();
    expect((await original!.response())?.status()).toBe(startPrefix ? 308 : 301);
    await expect(page).toHaveURL(`${BASE_URL}${startPrefix}${path}?lang=fr&${query}`);
    const link = page.locator(".cmdbar").getByRole("link", { name: target.toUpperCase(), exact: true });
    await expect(link).toHaveAttribute("href", `${targetPrefix}${path}?${query}`);
    await link.click();
    await expect(page).toHaveURL(`${BASE_URL}${targetPrefix}${path}?${query}`);
    await expect(page.locator("html")).toHaveAttribute("lang", target);
    await expect(page.locator(".journal-body")).toHaveAttribute("lang", target);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${targetPrefix}${path}`);
  });
});

test("sitemap contains both translated page and article sets", async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/sitemap.xml`);
  expect(response?.status()).toBe(200);
  const xml = await response!.text();
  for (const path of PAGES) {
    expect(xml).toContain(`<loc>${SITE}${path || "/"}</loc>`);
    expect(xml).toContain(`<loc>${SITE}/fr${path}</loc>`);
  }
  expect(FRENCH_JOURNAL_SLUGS).toHaveLength(31);
  for (const slug of FRENCH_JOURNAL_SLUGS) {
    for (const prefix of ["", "/fr"]) {
      const url = `${SITE}${prefix}/journal/${slug}`;
      const block = xml.split("<url>").find(candidate => candidate.includes(`<loc>${url}</loc>`));
      expect(block, url).toBeDefined();
      for (const [language, alternatePrefix] of [["fr", "/fr"], ["en", ""], ["x-default", ""]]) {
        expect(block).toContain(`hreflang="${language}" href="${SITE}${alternatePrefix}/journal/${slug}"`);
      }
    }
  }
  expect(xml).not.toContain("?lang=");
});

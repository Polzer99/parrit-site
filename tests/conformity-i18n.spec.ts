import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const SITE = "https://parrit.ai";
// Next émet la racine sans slash final (https://parrit.ai) ; toute attente
// d'URL absolue passe par ici pour suivre cette convention.
const absolute = (pathname: string) => (pathname === "/" ? SITE : `${SITE}${pathname}`);
const PAGES = ["", "/manufacture", "/standard", "/dossiers", "/commission", "/legal", "/journal"];

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
  await expect(page.locator("h1")).toHaveText("Le système IA qui fait tourner votre entreprise.");
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
  expect(html).toContain("The AI system your company");
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
  ["/standard?lang=fr&source=test", "/fr/standard?source=test"],
  ["/fr/standard?lang=en&utm_campaign=test", "/standard?utm_campaign=test"],
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
  const response = await request.get(`${BASE_URL}/standard?source=test`, { headers, maxRedirects: 0 });
  expect(response.status()).toBe(302);
  const location = new URL(response.headers()["location"] ?? "", BASE_URL);
  expect(`${location.pathname}${location.search}`).toBe("/fr/standard?source=test");
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
    const response = await page.goto(`${BASE_URL}/standard`);
    expect(response?.request().redirectedFrom()).toBeNull();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
}

test("header switches paths, saves choice and preserves query/hash", async ({ page, context }) => {
  await page.goto(`${BASE_URL}/fr/standard?source=test#top`);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(`${BASE_URL}/standard?source=test#top`);
  expect((await context.cookies()).find(({ name }) => name === "parrit_locale")?.value).toBe("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "FR", exact: true }).click();
  await expect(page).toHaveURL(`${BASE_URL}/fr/standard?source=test#top`);
  expect((await context.cookies()).find(({ name }) => name === "parrit_locale")?.value).toBe("fr");
  await expect(page.locator('.cmd-nav a[href="/fr/commission"]')).toHaveCount(1);
});

test("Journal articles are English only, including legacy French aliases", async ({ page }) => {
  const path = "/journal/one-card-one-action";
  await page.setExtraHTTPHeaders({ "Accept-Language": "fr" });
  const direct = await page.goto(`${BASE_URL}${path}`);
  expect(direct?.request().redirectedFrom()).toBeNull();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[hreflang="fr"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${path}`);
  const alias = await page.goto(`${BASE_URL}/fr${path}?lang=fr&source=test`);
  expect((await alias?.request().redirectedFrom()?.response())?.status()).toBe(301);
  await expect(page).toHaveURL(`${BASE_URL}${path}?source=test`);
  await page.getByRole("button", { name: "FR", exact: true }).click();
  await expect(page).toHaveURL(`${BASE_URL}${path}?source=test`);
});

test("sitemap contains both translated sets and no French articles", async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/sitemap.xml`);
  expect(response?.status()).toBe(200);
  const xml = await response!.text();
  for (const path of PAGES) {
    expect(xml).toContain(`<loc>${SITE}${path || "/"}</loc>`);
    expect(xml).toContain(`<loc>${SITE}/fr${path}</loc>`);
  }
  expect(xml).not.toMatch(/<loc>[^<]*\/fr\/journal\//);
  expect(xml).not.toContain("?lang=");
});

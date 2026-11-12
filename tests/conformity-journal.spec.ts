import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { expectPopulated } from "./content-structure";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
if (!["localhost", "127.0.0.1"].includes(new URL(BASE_URL).hostname)) throw new Error("Local test origin required");
const SITE = "https://parrit.ai";
const DIRECTORY = path.join(process.cwd(), "content", "journal");
const sourceArticles = readdirSync(DIRECTORY).filter(filename => filename.endsWith(".mdx")).map(filename => {
  const { data, content } = matter(readFileSync(path.join(DIRECTORY, filename), "utf8"));
  return { filename, slug: filename.slice(0, -4), noindex: data.noindex === true, content };
});
const translatedArticles = sourceArticles.filter(entry => !entry.noindex);
const untranslatedArticles = sourceArticles.filter(entry => entry.noindex);

test.use({ serviceWorkers: "block" });

test("the route matrix covers all 31 published translations and 9 noindex originals", () => {
  expect(translatedArticles).toHaveLength(31);
  expect(untranslatedArticles).toHaveLength(9);
});

for (const source of translatedArticles) test(`French article and reciprocal metadata: ${source.slug}`, async ({ page }) => {
  const french = matter(readFileSync(path.join(DIRECTORY, "fr", source.filename), "utf8"));
  const english = matter(readFileSync(path.join(DIRECTORY, source.filename), "utf8"));
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  for (const [locale, entry] of [["fr", french], ["en", english]] as const) {
    const pathname = `${locale === "fr" ? "/fr" : ""}/journal/${source.slug}`;
    const response = await page.goto(`${BASE_URL}${pathname}`);
    expect(response?.status()).toBe(200);
    expect(response?.request().redirectedFrom()).toBeNull();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator(".journal-body")).toHaveAttribute("lang", locale);
    await expect(page.locator(".journal-header h1")).toHaveText(String(entry.data.title));
    await expect(page.locator(".journal-header .journal-deck")).toHaveText(String(entry.data.description));
    const firstParagraph = entry.content.trim().split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    await expect(page.locator(".journal-body > p").first()).toHaveText(firstParagraph);
    await expect(page.locator(".journal-header time")).toHaveAttribute("datetime", String(entry.data.date));
    await expect(page.locator(".journal-header .journal-entry-meta")).toContainText(locale === "fr" ? /[1-9]\d* min de lecture/ : /[1-9]\d* min read/);
    await expect(page.locator("[data-language-note]")).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${pathname}`);
    for (const [language, prefix] of [["fr", "/fr"], ["en", ""], ["x-default", ""]]) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveAttribute("href", `${SITE}${prefix}/journal/${source.slug}`);
    }
    const structuredData: unknown[] = (await page.locator('main script[type="application/ld+json"]').allTextContents()).map(text => JSON.parse(text) as unknown);
    expect(structuredData).toContainEqual(expect.objectContaining({
      "@type": "Article", inLanguage: locale, headline: entry.data.title,
      description: entry.data.description, datePublished: entry.data.date,
      mainEntityOfPage: `${SITE}${pathname}`,
    }));
  }
  expect(french.data.title).not.toBe(english.data.title);
  expect(french.content).not.toBe(english.content);
});

for (const source of untranslatedArticles) test(`noindex French alias keeps one 308: ${source.slug}`, async ({ request }) => {
  // APIRequestContext bypasses browser routing: origin is guarded above and redirects never auto-follow.
  const query = "?source=journal-test&utm_source=mail&utm_campaign=a%26b&utm_custom=one&utm_custom=two";
  const response = await request.get(`${BASE_URL}/fr/journal/${source.slug}${query}`, { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  const target = new URL(response.headers()["location"] ?? "", BASE_URL);
  expect(target.href).toBe(`${BASE_URL}/journal/${source.slug}${query}`);
  const followed = await request.get(target.href, { maxRedirects: 0 });
  expect(followed.status()).toBe(200);
  const html = await followed.text();
  expect(html).toContain('<html lang="en"');
  expect(html).toMatch(/<meta name="robots" content="[^"]*noindex/);
  expect(html).not.toContain('hreflang="fr" href="https://parrit.ai/fr/journal/');
});

test("first certified article renders its Harness label and serves the linked certificate", async ({ page }) => {
  await page.goto(`${BASE_URL}/journal/malicious-mcp-server-after-install`);
  const badge = page.locator(".journal-header .harness-badge");
  await expectPopulated(badge.locator("strong"));
  await expect(badge.locator("a")).toHaveAttribute("href", "/certificates/malicious-mcp-server-after-install.json");
  const [response] = await Promise.all([
    page.waitForResponse((response) => new URL(response.url()).pathname === "/certificates/malicious-mcp-server-after-install.json"),
    badge.locator("a").click(),
  ]);
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    status: "CERTIFIED",
    url: "https://parrit.ai/journal/malicious-mcp-server-after-install",
    content_sha256: "7c514e04973364814bb05e29f2e09dc08c432bd5a3b2116c59f79b072a40df83",
  });
});

test("renamed French slugs answer one permanent redirect", async ({ request }) => {
  // API requests bypass the browser deny-all: restrict the origin and never auto-follow.
  expect(["localhost", "127.0.0.1"]).toContain(new URL(BASE_URL).hostname);

  for (const [source, target] of [
    ["/journal/une-carte-une-action", "/journal/one-card-one-action"],
    ["/journal/glm-5-2-souverainete", "/journal/glm-5-2-sovereignty"],
    ["/fr/journal/une-carte-une-action", "/fr/journal/one-card-one-action"],
    ["/fr/journal/glm-5-2-souverainete", "/fr/journal/glm-5-2-sovereignty"],
  ]) {
    const response = await request.get(`${BASE_URL}${source}`, { maxRedirects: 0 });
    expect(response.status()).toBe(source.startsWith("/fr/") ? 308 : 301);
    const location = new URL(response.headers()["location"] ?? "", BASE_URL);
    expect(location.href).toBe(`${BASE_URL}${target}`);

    const followed = await request.get(location.href, { maxRedirects: 0 });
    expect(followed.status()).toBe(200);
  }
});

test("journal index uses square, shadowless list rows", async ({ page }) => {
  await page.goto(`${BASE_URL}/journal`);

  const rows = page.locator(".journal-list > li");
  await expect(rows).not.toHaveCount(0);
  await expect(page.locator("main form")).toHaveCount(0);
  await expect(page.locator("main .ri-stage")).toHaveCount(0);

  const decoratedElements = await page.locator("body, body *").evaluateAll((elements) =>
    elements.filter((element) => {
      const style = getComputedStyle(element);
      return style.boxShadow !== "none" || style.borderRadius !== "0px";
    }).map((element) => ({
      tag: element.tagName,
      className: element.getAttribute("class"),
    })),
  );

  expect(decoratedElements).toEqual([]);
});

test("journal article preserves its date without a technical registry", async ({ page }) => {
  await page.goto(`${BASE_URL}/journal/one-card-one-action`);

  await expect(page.locator(".journal-article-footer .registry-line")).toHaveCount(0);
  await expect(page.locator(".journal-header time")).toHaveAttribute("datetime", /\d{4}-\d{2}-\d{2}/);

});

test("machine-translated glossary entry is noindex", async ({ page }) => {
  await page.goto(`${BASE_URL}/journal/rgpd-llm-securite`);

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

for (const locale of ["fr", "en"] as const) for (const width of [1440, 390]) {
  test(`UI polish: deck and reading time have system spacing ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
    await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : ""}/journal/${translatedArticles[0].slug}`);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.locator(".journal-header").evaluate(header => {
      const deck = header.querySelector(".journal-deck")!.getBoundingClientRect();
      const meta = header.querySelector(".journal-entry-meta")!;
      return {
        gap: meta.getBoundingClientRect().top - deck.bottom,
        spacing: parseFloat(getComputedStyle(meta).getPropertyValue("--brand-s2")),
      };
    });
    expect(geometry.spacing).toBe(16);
    expect(Math.abs(geometry.gap - geometry.spacing)).toBeLessThanOrEqual(1);
  });
}

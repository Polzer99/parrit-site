import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

test("renamed French slugs answer one permanent redirect", async ({ request }) => {
  // API requests bypass the browser deny-all: restrict the origin and never auto-follow.
  expect(["localhost", "127.0.0.1"]).toContain(new URL(BASE_URL).hostname);

  for (const [source, target] of [
    ["/journal/une-carte-une-action", "/journal/one-card-one-action"],
    ["/journal/glm-5-2-souverainete", "/journal/glm-5-2-sovereignty"],
  ]) {
    const response = await request.get(`${BASE_URL}${source}`, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
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

test("journal article renders its registry-line footer", async ({ page }) => {
  await page.goto(`${BASE_URL}/journal/one-card-one-action`);

  await expect(page.locator(".journal-article-footer .registry-line")).toHaveText(
    /^WE FIND THE WAY · \d{4}-\d{2}-\d{2} · PARRIT \/ JOURNAL$/,
  );
});

test("machine-translated glossary entry is noindex", async ({ page }) => {
  await page.goto(`${BASE_URL}/journal/rgpd-llm-securite`);

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

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
  await page.goto(`${BASE_URL}/journal/une-carte-une-action`);

  await expect(page.locator(".journal-article-footer .registry-line")).toHaveText(
    /^WE FIND THE WAY · \d{4}-\d{2}-\d{2} · PARRIT \/ JOURNAL$/,
  );
});

test("machine-translated glossary entry is noindex", async ({ page }) => {
  await page.goto(`${BASE_URL}/journal/rgpd-llm-securite`);

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

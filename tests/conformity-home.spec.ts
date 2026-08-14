import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

test.use({ viewport: { width: 1440, height: 900 } });

test("the home locks the approved display scale and surface rules", async ({ page }) => {
  await page.goto(`${BASE_URL}/`);

  const h1FontSize = await page.getByRole("heading", { level: 1 }).evaluate((heading) =>
    Number.parseFloat(getComputedStyle(heading).fontSize),
  );
  expect(h1FontSize).toBeGreaterThanOrEqual(84);
  expect(h1FontSize).toBeLessThanOrEqual(88);

  const surfaceRules = await page.locator("*").evaluateAll((elements) =>
    elements.reduce(
      (result, element) => {
        const style = getComputedStyle(element);
        if (style.boxShadow !== "none") result.shadowCount += 1;
        if (
          [
            style.borderTopLeftRadius,
            style.borderTopRightRadius,
            style.borderBottomRightRadius,
            style.borderBottomLeftRadius,
          ].some((radius) => Number.parseFloat(radius) > 0)
        ) {
          result.radiusCount += 1;
        }
        return result;
      },
      { shadowCount: 0, radiusCount: 0 },
    ),
  );

  expect(surfaceRules.shadowCount).toBe(1);
  expect(surfaceRules.radiusCount).toBe(0);
});

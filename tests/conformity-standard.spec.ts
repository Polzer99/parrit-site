import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

// Copy lock updated for the approved 2026-10-05 verification: six commitments.
const PRINCIPLES = [
  [
    "01",
    "State is readable at any moment."
  ],
  [
    "02",
    "Every signal carries its decision."
  ],
  [
    "03",
    "A decision always keeps its origin."
  ],
  [
    "04",
    "Rolling back is written in advance."
  ],
  [
    "05",
    "The system belongs to you."
  ],
  [
    "06",
    "Each new capability reuses what already exists."
  ]
] as const;

test.describe("the Parrit Standard conformity", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("matches the desktop display and flat specification treatment", async ({ page }) => {
    await page.goto(`${BASE_URL}/standard`);

    const display = page.getByRole("heading", {
      name: "Six commitments we apply to our systems.",
    });
    await expect(display).toBeVisible();

    const displaySize = await display.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(displaySize).toBeGreaterThanOrEqual(50);
    expect(displaySize).toBeLessThanOrEqual(54);

    for (const [code, definition] of PRINCIPLES) {
      await expect(page.getByText(code, { exact: true })).toBeVisible();
      // LOT 1 replaces the old labels and definitions with a statement and a scene.
      await expect(page.getByText(definition, { exact: true })).toBeVisible();
    }

    const decoratedElements = await page.locator("body *").evaluateAll((elements) =>
      elements.filter((element) => {
        const style = getComputedStyle(element);
        return style.boxShadow !== "none" || style.borderRadius !== "0px";
      }).map((element) => ({
        boxShadow: getComputedStyle(element).boxShadow,
        borderRadius: getComputedStyle(element).borderRadius,
        tag: element.tagName,
      })),
    );
    expect(decoratedElements).toEqual([]);
  });
});

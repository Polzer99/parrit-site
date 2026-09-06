import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

// Copy lock updated for the approved 2026-09-06 LOT 1: six commitments.
const PRINCIPLES = [
  [
    "PS-01",
    "The state is readable at any moment."
  ],
  [
    "PS-02",
    "Every signal carries its decision."
  ],
  [
    "PS-03",
    "Every decision keeps its origin."
  ],
  [
    "PS-04",
    "The way back is written in advance."
  ],
  [
    "PS-05",
    "The system belongs to you."
  ],
  [
    "PS-06",
    "The next brick raises the value of the ones before."
  ]
] as const;

test.describe("the Parrit Standard conformity", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("matches the desktop display and flat specification treatment", async ({ page }) => {
    await page.goto(`${BASE_URL}/standard`);

    const display = page.getByRole("heading", {
      name: "Six commitments. Every system we deliver keeps them.",
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

import { expectPopulated } from "./content-structure";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

test.describe("the Parrit Standard conformity", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("matches the desktop display and flat specification treatment", async ({ page }) => {
    await page.goto(`${BASE_URL}/standard`);

    const display = page.getByRole("heading", {
      level: 1,
    });
    await expect(display).toBeVisible();

    const displaySize = await display.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(displaySize).toBeGreaterThanOrEqual(50);
    expect(displaySize).toBeLessThanOrEqual(54);

    await expectPopulated(page.locator(".doctrine-row h3"), 6);
    for (const code of ["01", "02", "03", "04", "05", "06"]) {
      await expect(page.getByText(code, { exact: true })).toHaveCount(0);
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

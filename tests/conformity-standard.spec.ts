import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

const PRINCIPLES = [
  ["PS-01", "The operator can determine the state of the system at any moment, without asking anyone."],
  ["PS-02", "Every surfaced piece of information leads to a possible action within the same view."],
  ["PS-03", "Every significant decision carries its origin: data, author, timestamp, rationale."],
  ["PS-04", "Every critical process has a documented path of return before it enters production."],
  ["PS-05", "The client holds the system, its data and its documentation as company assets."],
  ["PS-06", "Each new capability increases the value of every capability already in production."],
] as const;

test.describe("the Parrit Standard conformity", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("matches the desktop display and flat specification treatment", async ({ page }) => {
    await page.goto(`${BASE_URL}/standard`);

    const display = page.getByRole("heading", {
      name: "Every system we deliver is certified to the same specification.",
    });
    await expect(display).toBeVisible();

    const displaySize = await display.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(displaySize).toBeGreaterThanOrEqual(50);
    expect(displaySize).toBeLessThanOrEqual(54);

    for (const [code, definition] of PRINCIPLES) {
      await expect(page.getByText(code, { exact: true })).toBeVisible();
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

import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

test.use({
  expectBlockedRequest: true,
  viewport: { width: 1440, height: 900 },
});

test("commission matches the REV 01 display and instrument constraints", async ({ page }) => {
  await page.goto(`${BASE_URL}/commission`);

  await expect(
    page.getByRole("heading", { name: "Commission your Operating System." }),
  ).toBeVisible();
  await expect(page.locator(".cal-instrument")).toBeVisible();

  const displaySize = await page.locator(".commission-header h1").evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(displaySize).toBeGreaterThanOrEqual(50);
  expect(displaySize).toBeLessThanOrEqual(54);

  const visualConstraints = await page.locator("body *").evaluateAll((elements) => ({
    shadows: elements.filter((element) => getComputedStyle(element).boxShadow !== "none").length,
    radii: elements.filter((element) => {
      const style = getComputedStyle(element);
      return [
        style.borderTopLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
        style.borderBottomLeftRadius,
      ].some((radius) => Number.parseFloat(radius) !== 0);
    }).length,
  }));

  expect(visualConstraints.shadows).toBe(1);
  expect(visualConstraints.radii).toBe(0);
});

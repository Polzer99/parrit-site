// The lot replaces the raster scene with a process diagram and qualified cases.
import { expect, test } from "./network-deny.setup";
const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
for (const width of [375, 768, 1024, 1440]) for (const locale of ["fr", "en"]) test(`process and case geometry ${locale} ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); await page.goto(`${BASE}${locale === "fr" ? "/fr" : "/"}`);
  const diagram = page.locator(".v1-process"); await expect(diagram.locator("strong")).toHaveCount(2); await expect(diagram.locator("svg")).toHaveCount(6);
  const columns = diagram.locator(':scope > div');
  await expect(columns).toHaveCount(2);
  for (const column of await columns.all()) {
    await expect(column.locator('p')).toHaveCount(5);
    await expect(column.locator('svg')).toHaveCount(3);
  }
  const first = (await columns.nth(0).boundingBox())!;
  const second = (await columns.nth(1).boundingBox())!;
  if (width <= 760) {
    expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
    expect(second.x).toBe(first.x);
  } else {
    expect(second.x).toBeGreaterThanOrEqual(first.x + first.width);
    expect(second.y).toBe(first.y);
  }
  const target = diagram.locator('.v1-process-target');
  expect(await target.evaluate(el => getComputedStyle(el).borderTopColor)).not.toBe(await columns.nth(0).evaluate(el => getComputedStyle(el).borderTopColor));
  await expect(page.locator('#H12 a')).toHaveClass('rev-button exec');
  for (const connector of await diagram.locator("svg").all()) {
    await expect(connector).toHaveAttribute("aria-hidden", "true"); await expect(connector.locator("path").first()).toHaveAttribute("stroke-width", "2");
    await expect(connector.locator("path").last()).toHaveAttribute("d", "M20 3L30 7L20 11Z");
  }
  await expect(page.locator(".v1-case")).toHaveCount(3);
  for (const card of await page.locator(".v1-case").all()) { await expect(card.locator("dt")).toHaveCount(4); await expect(card.locator("dd")).toHaveCount(4); const b = (await card.boundingBox())!; expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(width); }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
});

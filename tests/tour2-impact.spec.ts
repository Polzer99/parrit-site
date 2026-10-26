import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { expect, test } from './network-deny.setup';
import { localizedPath } from '../src/system/locale';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3210';
if (!['localhost', '127.0.0.1'].includes(new URL(BASE).hostname)) throw new Error('Local server required');
const guides = ['/consulting-transformation', '/ai-sprints', '/engineering-integration', '/harness-engineering'];
test.use({ serviceWorkers: 'block' });
for (const locale of ['fr', 'en'] as const) for (const width of [375, 1440]) for (const javaScriptEnabled of [true, false]) {
  test.describe(`tour2 ${locale} ${width} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled, viewport: { width, height: 900 } });
    test('hero, alternating visuals, compact mobile and accessible content', async ({ page }, testInfo) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
      await page.goto(`${BASE}${localizedPath('/', locale)}`);
      await page.evaluate(() => document.fonts.ready);
      const title = (await page.locator('#H01 h1').boundingBox())!;
      const frame = (await page.locator('#H01 .product-scene-frame').boundingBox())!;
      const summary = (await page.locator('.v1-hero-summary').boundingBox())!;
      expect(title.y).toBeLessThan(900);
      expect(frame.y).toBeGreaterThanOrEqual(Math.max(title.y + title.height, summary.y + summary.height));
      if (width === 1440) {
        expect(frame.y).toBeLessThan(900);
        expect(frame.width).toBeCloseTo(1160, 0);
        expect(summary.x).toBeGreaterThan(title.x + title.width);
        await expect(page.locator('#H01 .product-scene-frame')).toBeInViewport();
      } else {
        for (const button of await page.locator('#H01 .v1-actions a').all()) expect((await button.boundingBox())!.width).toBeCloseTo(summary.width, 0);
        const logo = (await page.locator('.wordmark').boundingBox())!;
        const menu = (await page.locator('.v1-mobile-menu summary').boundingBox())!;
        expect(Math.abs((logo.y + logo.height / 2) - (menu.y + menu.height / 2))).toBeLessThan(16);
        expect((await page.locator('#H03 .v1-process').boundingBox())!.height).toBeLessThan(400);
        expect((await page.locator('#H11 ol').boundingBox())!.height).toBeLessThan(400);
      }
      const frameText = await page.locator('.product-scene-copy').boundingBox();
      expect(frameText!.y).toBeGreaterThanOrEqual(frame.y + frame.height);
      for (const [index, id] of ['H03', 'H05', 'H06', 'H07'].entries()) {
        const copy = (await page.locator(`#${id} .v1-door-copy`).boundingBox())!;
        const visual = page.locator(`#${id} [data-service-visual]`);
        await expect(visual).toBeVisible();
        expect(await visual.locator('svg, img').count()).toBeGreaterThan(0);
        await expect(visual).toHaveCSS('clip-path', 'none');
        const box = (await visual.boundingBox())!;
        if (width === 375) expect(box.y).toBeGreaterThanOrEqual(copy.y + copy.height);
        else if (index % 2 === 0) expect(box.x).toBeGreaterThanOrEqual(copy.x + copy.width);
        else expect(copy.x).toBeGreaterThanOrEqual(box.x + box.width);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.locator('#H11 li:last-child svg')).toHaveCount(0);
      if (javaScriptEnabled) {
        mkdirSync('docs/site-v1/captures', { recursive: true });
        const path = `docs/site-v1/captures/tour2-home-${locale}-${width}.png`;
        await page.screenshot({ path, fullPage: true, animations: 'disabled' });
        await testInfo.attach('home', { path, contentType: 'image/png' });
      }
      for (const route of guides) {
        await page.goto(`${BASE}${localizedPath(route, locale)}`);
        await expect(page.locator(`[data-service-visual="${route.slice(1)}"]`)).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        if (route === '/consulting-transformation' && javaScriptEnabled) {
          const path = `docs/site-v1/captures/tour2-conseil-${locale}-${width}.png`;
          await page.screenshot({ path, fullPage: true, animations: 'disabled' });
          await testInfo.attach('guide', { path, contentType: 'image/png' });
        }
      }
    });
  });
}
// Run this test against the unchanged checkout first with TOUR2_MEASURE=before.
// Replay against the candidate; the same viewport, fonts, locales and pages are used.
test('tour2 page heights before and after', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const heights: Record<string, number> = {};
  for (const locale of ['fr', 'en'] as const) for (const route of guides) {
    const path = localizedPath(route, locale);
    await page.goto(`${BASE}${path}`);
    await page.evaluate(() => document.fonts.ready);
    for (const img of await page.locator('main img').all()) await expect(img).toHaveJSProperty('complete', true);
    heights[path] = await page.evaluate(() => document.documentElement.scrollHeight);
  }
  mkdirSync('docs/site-v1/captures', { recursive: true });
  const phase = process.env.TOUR2_MEASURE === 'before' ? 'before' : 'after';
  const path = `docs/site-v1/captures/tour2-heights-${phase}.json`;
  writeFileSync(path, JSON.stringify(heights, null, 2) + '\n');
  await testInfo.attach('heights', { path, contentType: 'application/json' });
  if (phase === 'after') {
    const baseline: Record<string, number> = JSON.parse(readFileSync(process.env.TOUR2_BASELINE_FILE ?? 'docs/site-v1/captures/tour2-heights-before.json', 'utf8'));
    for (const [route, height] of Object.entries(heights)) {
      expect(baseline[route], `missing baseline: ${route}`).toBeGreaterThan(0);
      expect(height / baseline[route], `${route}: at least 30% shorter`).toBeLessThanOrEqual(.7);
    }
  }
});

import { expect, test } from './network-deny.setup';
const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3210';
if (!['localhost', '127.0.0.1'].includes(new URL(BASE).hostname)) throw new Error('Local server required');
test.use({ serviceWorkers: 'block' });
for (const width of [360, 390, 768, 1024, 1440]) for (const locale of ['fr', 'en']) {
  test(`V3 geometry, motion and keyboard ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${BASE}${locale === 'fr' ? '/fr' : '/'}`);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('h1')).toHaveCSS('line-height', width <= 760 ? '39.2px' : '82.32px');
    await expect(page.locator('h1')).toHaveCSS('font-size', width <= 760 ? '40px' : '84px');
    for (const el of await page.locator('main h2, .v1-process').all()) {
      await expect(el).toHaveCSS('animation-name', 'none');
      await expect(el).toHaveCSS('clip-path', 'none');
    }
    for (const row of await page.locator('.v1-process > div').all()) {
      await expect(row).toHaveCSS('border-top-width', '1px');
      await expect(row).toHaveCSS('border-left-width', '0px');
      await expect(row).toHaveCSS('box-shadow', 'none');
    }
    await expect(page.locator('#H03 ol > li')).toHaveCount(4);
    await expect(page.locator('#H03 .v1-index')).toHaveCount(0);
    await expect(page.locator('#H11 ol > li')).toHaveCount(6);
    await expect(page.locator('#H11 .v1-index')).toHaveCount(0);
    for (const card of await page.locator('.v1-case').all()) {
      const status = (await card.locator('.v1-case-status').boundingBox())!;
      const title = (await card.locator('h3').boundingBox())!;
      expect(title.y + title.height).toBeLessThanOrEqual(status.y);
    }
    const actions = page.locator('#H12 a');
    await expect(actions).toHaveCount(1);
    for (const action of await actions.all()) {
      await expect(action).toHaveAttribute('href', locale === 'fr' ? '/fr/commission' : '/commission');
      await action.focus();
      await expect(action).toBeFocused();
      expect((await action.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.locator('.v1-process')).toHaveCSS('animation-duration', '0.6s');
  });
}
test('V3 full content without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: 'block' });
  const blocked: string[] = [];
  await context.route('**/*', route => {
    if (['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname)) return route.continue();
    blocked.push(route.request().url()); return route.abort();
  });
  try {
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE);
    await expect(page.locator('.v1-process')).toBeVisible();
    await expect(page.locator('#H12 a')).toHaveCount(1);
    await expect(page.locator('#H06 .v1-switcher h3')).toHaveCount(3);
    expect(blocked).toEqual([]);
  } finally { await context.close(); }
});

import { expect, test } from './network-deny.setup';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3210';
if (!['localhost', '127.0.0.1'].includes(new URL(BASE).hostname)) throw new Error('Local server required');
test.use({ serviceWorkers: 'block' });

for (const width of [390, 760, 761, 1440]) for (const locale of ['fr', 'en']) {
  test(`V4 heading scale and single closing action ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const prefix = locale === 'fr' ? '/fr' : '';
    const routes = ['', locale === 'fr' ? '/conseil-transformation' : '/consulting-transformation', '/ai-sprints', '/engineering-integration', '/harness-engineering'];
    for (const route of routes) {
      await page.goto(`${BASE}${prefix}${route || (prefix ? '' : '/')}`);
      await page.evaluate(() => document.fonts.ready);
      const headings = page.locator('main h2:not(.home-s-close h2)');
      expect(await headings.count()).toBeGreaterThan(0);
      for (const heading of await headings.all()) await expect(heading).toHaveCSS('font-size', width <= 760 ? '32px' : '40px');
      for (const heading of await page.locator('main h3').all()) await expect(heading).toHaveCSS('font-size', '22px');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (!route) {
        const action = page.locator('#H12 a');
        await expect(action).toHaveCount(1);
        await expect(action).toHaveAttribute('href', `${prefix}/commission`);
        await action.focus();
        await expect(action).toBeFocused();
      }
    }
  });
}

for (const width of [390, 1440]) for (const locale of ['fr', 'en']) {
  test(`V4 every selected engineering tab has a 3:1 contour ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${BASE}${locale === 'fr' ? '/fr' : ''}/engineering-integration`);
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3);
    for (const tab of await tabs.all()) {
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      const ratios = await tab.evaluate(element => {
        function luminance(color: string) {
          const channels = color.match(/[\d.]+/g)?.map(Number);
          if (!channels || channels.length < 3 || (channels.length === 4 && channels[3] !== 1)) throw new Error(`Opaque RGB required: ${color}`);
          const linear = channels.slice(0, 3).map(value => {
            const s = value / 255;
            return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          });
          return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
        }
        const section = element.closest('[data-regime]');
        if (!section) throw new Error('Missing surrounding register');
        const background = luminance(getComputedStyle(section).backgroundColor);
        const style = getComputedStyle(element);
        return ['top', 'right', 'bottom', 'left'].map(side => {
          if (parseFloat(style.getPropertyValue(`border-${side}-width`)) < 1 || style.getPropertyValue(`border-${side}-style`) === 'none') return 0;
          const border = luminance(style.getPropertyValue(`border-${side}-color`));
          return (Math.max(border, background) + .05) / (Math.min(border, background) + .05);
        });
      });
      for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(3);
    }
  });
}

import { mkdirSync } from 'node:fs';
import { expect, test } from './network-deny.setup';
import { localizedPath } from '../src/system/locale';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3210';
if (!['localhost', '127.0.0.1'].includes(new URL(BASE).hostname)) throw new Error('Local server required');
test.use({ serviceWorkers: 'block' });
const routes = ['/', '/consulting-transformation', '/ai-sprints', '/engineering-integration', '/harness-engineering'];
for (const locale of ['fr', 'en'] as const) for (const width of [375, 1440]) {
  test(`accessible typography and home geometry ${locale} ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of routes) {
      await page.goto(`${BASE}${localizedPath(route, locale)}`);
      await page.evaluate(() => document.fonts.ready);
      const mono = await page.locator('body *').evaluateAll(elements => elements.filter(el => {
        if (el.closest('.wordmark, script, style')) return false;
        const style = getComputedStyle(el), box = el.getBoundingClientRect();
        return box.width > 1 && box.height > 1 && style.visibility !== 'hidden' &&
          Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) && /IBM Plex Mono/.test(style.fontFamily);
      }).map(el => el.textContent));
      expect(mono).toEqual([]);
      await expect(page.locator('main .k, main .v1-index')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      for (const button of await page.locator('a.rev-button, button:visible').all()) expect((await button.innerText()).trim()).not.toMatch(/\.$/);
      if (route !== '/') continue;
      const scene = page.locator('#H01 .product-scene-object');
      await expect(scene.locator('img')).toBeVisible();
      expect(await scene.locator('img').evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      const copy = (await page.locator('.v1-hero-copy').boundingBox())!;
      const visual = (await scene.boundingBox())!;
      if (width === 1440) {
        expect(visual.y).toBeGreaterThanOrEqual(copy.y + copy.height);
        expect((await page.locator(".product-scene-frame").boundingBox())!.y).toBeLessThan(900);
      } else expect(visual.y).toBeGreaterThanOrEqual(copy.y + copy.height);
      await expect(page.locator('#H03 .v1-process')).toHaveCount(1);
      const steps = page.locator('#H11 ol > li');
      await expect(steps).toHaveCount(6);
      await expect(page.locator('#H11 svg')).toHaveCount(5);
      const boxes = await steps.evaluateAll(els => els.map(el => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, right: b.right }; }));
      expect(new Set(boxes.map(b => b.y)).size).toBe(width === 1440 ? 2 : 6);
      for (const step of await steps.all()) await expect(step).toHaveCSS('border-left-width', '0px');
      for (const box of boxes) { expect(box.x).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width); }
      // Structural rules only: closed control contours and approved phone UI are not separators.
      const collisions = await page.locator('main *, footer *').evaluateAll(els => {
        const lines: { x: number; right: number; y: number; tag: string }[] = [];
        for (const el of els) {
          if (el.closest('.scene-chat, .rev-button, button, [role="tablist"]')) continue;
          const s = getComputedStyle(el), b = el.getBoundingClientRect();
          if (b.width < 100 || b.height < 1 || s.visibility === 'hidden') continue;
          for (const side of ['top', 'bottom']) if (parseFloat(s.getPropertyValue(`border-${side}-width`)) > 0 && s.getPropertyValue(`border-${side}-style`) !== 'none') lines.push({ x: b.x, right: b.right, y: side === 'top' ? b.top : b.bottom, tag: el.className });
        }
        return lines.flatMap((a, i) => lines.slice(i + 1).filter(b => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 && Math.abs(a.y - b.y) < 24).map(b => [a, b]));
      });
      expect(collisions).toEqual([]);
      await page.evaluate(() => scrollTo(0, 0));
      mkdirSync('docs/site-v1/captures', { recursive: true });
      const path = `docs/site-v1/captures/ergonomie-${locale}-${width}.png`;
      await page.screenshot({ path, fullPage: true, animations: 'disabled' });
      await testInfo.attach(`ergonomie-${locale}-${width}`, { path, contentType: 'image/png' });
    }
  });
}
for (const locale of ['fr', 'en'] as const) test(`method three columns at 1024 ${locale}`, async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
  await page.goto(`${BASE}${localizedPath('/', locale)}`);
  const rows = await page.locator('#H11 li').evaluateAll(els => els.map(el => el.getBoundingClientRect().y));
  expect(rows).toHaveLength(6);
  expect(new Set(rows).size).toBe(2);
});

for (const locale of ['fr', 'en'] as const) test(`engineering panel headings ${locale}`, async ({ page }) => {
  await page.goto(`${BASE}${localizedPath('/engineering-integration', locale)}`);
      const tabs = page.locator('[role="tab"]');
      await expect(tabs).toHaveCount(3);
      for (const tab of await tabs.all()) {
        await tab.click();
        const panel = page.locator('[role="tabpanel"]:visible');
        await expect(panel.locator('h3')).toHaveClass('sr-only');
        expect((await panel.locator('h3').boundingBox())!.width).toBeLessThanOrEqual(1);
        await expect(tab).toHaveAttribute('aria-selected', 'true');
      }
 });

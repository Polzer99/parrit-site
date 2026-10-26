import { expect, test } from './network-deny.setup';
const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3210';
if (!['localhost', '127.0.0.1'].includes(new URL(BASE).hostname)) throw new Error('Local server required');
test.use({ serviceWorkers: 'block' });

for (const width of [375, 1440]) for (const locale of ['fr', 'en']) {
  test(`Matiere decorative geometry ${locale} ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${BASE}${locale === 'fr' ? '/fr' : '/'}`);
    await page.evaluate(() => document.fonts.ready);
    const grain = page.locator('[data-matiere]');
    await expect(grain).toHaveCount(1);
    await expect(grain).toHaveAttribute('aria-hidden', 'true');
    await expect(grain).toHaveAttribute('data-matiere', 'clair');
    expect(await grain.evaluate(el => el.childNodes.length)).toBe(0);
    await expect(grain).toHaveCSS('background-repeat', 'repeat');
    await expect(grain).toHaveCSS('image-rendering', 'pixelated');
    await expect(grain).toHaveCSS('animation-name', 'none');
    await expect(grain).toHaveCSS('box-shadow', 'none');
    await expect(grain).toHaveCSS('border-radius', '0px');
    await expect(grain).toHaveCSS('opacity', '1');
    await expect(grain).toHaveCSS('filter', 'none');
    const geometry = await grain.evaluate(el => {
      const box = el.getBoundingClientRect();
      const parent = el.parentElement!;
      const parentBox = parent.getBoundingClientRect();
      const parentStyle = getComputedStyle(parent);
      const overlaps: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent?.trim() || !node.parentElement?.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
        const range = document.createRange(); range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (rect.width > 0 && rect.height > 0 && rect.left < box.right && rect.right > box.left && rect.top < box.bottom && rect.bottom > box.top) overlaps.push(node.textContent.trim());
        }
      }
      return {
        marginTop: parseFloat(getComputedStyle(el).marginTop),
        overlaps, height: box.height, expectedHeight: parseFloat(getComputedStyle(el).getPropertyValue('--brand-s6')),
        width: box.width, expectedWidth: parentBox.width - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight),
        afterHero: el.closest('main')?.querySelector('#H01')?.nextElementSibling?.contains(el),
        regime: el.closest('[data-regime]')?.getAttribute('data-regime'),
        image: getComputedStyle(el).backgroundImage,
        overflow: document.documentElement.scrollWidth,
      };
    });
    expect(geometry.overlaps).toEqual([]);
    expect(geometry.height).toBe(geometry.expectedHeight);
    expect(geometry.marginTop).toBe(geometry.expectedHeight);
    expect(geometry.width).toBe(geometry.expectedWidth);
    expect(geometry.afterHero).toBe(true);
    expect(geometry.regime).toBe('calm');
    expect(geometry.overflow).toBeLessThanOrEqual(width);
    expect(geometry.image).toContain('/matiere/grain-clair.png');
    expect(await page.evaluate(async () => {
      const image = new Image(); image.src = '/matiere/grain-clair.png'; await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    })).toEqual([512, 512]);
    const screenshot = await page.screenshot({ path: testInfo.outputPath(`home-${locale}-${width}.png`), fullPage: true });
    await testInfo.attach(`home-${locale}-${width}`, { body: screenshot, contentType: 'image/png' });
    await page.goto(`${BASE}${locale === 'fr' ? '/fr/ai-sprints' : '/ai-sprints'}`);
    await expect(page.locator('[data-matiere]')).toHaveCount(0);
  });
}

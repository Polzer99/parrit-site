import { expect, test } from './network-deny.setup';
import { localizedPath } from '../src/system/locale';
const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3210';
if (!['localhost', '127.0.0.1'].includes(new URL(BASE).hostname)) throw new Error('Local server required');
test.use({ serviceWorkers: 'block' });
const routes = ['/', '/consulting-transformation', '/ai-sprints', '/engineering-integration', '/harness-engineering', '/standard', '/manufacture', '/systems', '/build-with-you', '/dossiers', '/journal', '/legal', '/commission'];
for (const locale of ['fr', 'en'] as const) for (const width of [1440, 375]) for (const route of routes) {
  test(`coherence ${locale} ${width} ${route}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    // Explicit expected embed mock, behind the shared deny-all fixture.
    await page.route('https://*.cal.com/**', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
    await page.goto(`${BASE}${localizedPath(route, locale)}`);
    await page.evaluate(() => document.fonts.ready);
    const failures = await page.locator('main').evaluate((main, desktop) => {
      const errors: string[] = [];
      const visible = (el: Element) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
      for (const a of main.querySelectorAll('a')) if (visible(a) && getComputedStyle(a).color === 'rgb(0, 0, 238)') errors.push(`browser blue: ${a.textContent}`);
      for (const button of main.querySelectorAll('.rev-button')) {
        if (!visible(button) || button.closest('form')) continue;
        const box = button.getBoundingClientRect();
        const group = button.parentElement!;
        const siblings = [...group.children].filter(el => el.matches('.rev-button') && visible(el));
        const first = siblings[0] ?? button;
        let container: Element | null = group;
        let anchor: Element | null = null;
        while (container && container !== main) {
          const candidates: Element[] = [...container.children].filter(el => el.matches('h1,h2,h3,p')).filter(el => visible(el) && Boolean(el.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING));
          anchor = candidates.at(-1) ?? null;
          if (anchor) break;
          container = container.parentElement;
        }
        if (!anchor) { errors.push(`missing text anchor: ${button.textContent}`); continue; }
        const text = anchor.getBoundingClientRect();
        if (desktop && box.width >= (container?.getBoundingClientRect().width ?? 0) - 2) errors.push(`full width: ${button.textContent}`);
        if (button === first && siblings.length === 2) {
          const primaryStyle = first.closest('.systems-hero') ? 'ghost' : 'exec';
          if (!siblings[0].classList.contains(primaryStyle) || !siblings[1].classList.contains('ghost')) errors.push('primary action must precede secondary');
          const [a, b] = siblings.map(el => el.getBoundingClientRect());
          if (Math.abs(a.height - b.height) > 2) errors.push('unequal action heights');
          if (desktop && Math.abs(a.y - b.y) > 2) errors.push('unequal action baselines');
          const gap = parseFloat(getComputedStyle(group).gap);
          const expectedGap = parseFloat(getComputedStyle(group).getPropertyValue('--brand-s2'));
          if (gap !== expectedGap) errors.push('incorrect action gap');
        }
        if (button === first) {
          const centered = getComputedStyle(anchor).textAlign === 'center';
          const groupBox = siblings.length > 1 ? group.getBoundingClientRect() : box;
          const delta = centered ? Math.abs(groupBox.x + groupBox.width / 2 - text.x - text.width / 2) : Math.abs(box.x - text.x);
          if (delta > 2) errors.push(`alignment ${delta}: ${button.textContent}`);
        }
        if (/\.$/.test(button.textContent?.trim() ?? '')) errors.push(`terminal period: ${button.textContent}`);
        if (!desktop && siblings.length > 1) {
          const full = siblings.map(el => Math.abs(el.getBoundingClientRect().width - group.getBoundingClientRect().width) <= 2);
          if (full.some(Boolean) && !full.every(Boolean)) errors.push('mixed mobile widths');
        }
      }
      for (const section of main.querySelectorAll('section, header')) {
        const primary = [...section.querySelectorAll('.rev-button.exec')].filter(el => el.closest('section, header') === section);
        if (primary.length > 1) errors.push('multiple primary actions in one section');
      }
      return errors;
    }, width === 1440);
    expect(failures).toEqual([]);
    for (const button of await page.locator('main .rev-button[href$="/commission"]').all()) {
      const homeHeroPrimary = route === '/' && await button.evaluate(el => el.matches('#H01 .v1-actions > .rev-button.exec:first-child'));
      await expect(button).toHaveText(homeHeroPrimary
        ? (locale === 'fr' ? "Parlons de votre transformation" : "Let's talk about your transformation")
        : (locale === 'fr' ? "Parler d’un projet" : 'Talk about a project'));
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
test('French articles redirect once, retaining query parameters', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr' });
  const response = await page.goto(`${BASE}/fr/journal/what-is-parrit-ai?source=qa&utm_campaign=coherence`);
  expect(response?.status()).toBe(200);
  const previous = response!.request().redirectedFrom()!;
  expect(previous).not.toBeNull();
  expect(previous.redirectedFrom()).toBeNull();
  expect((await previous.response())?.status()).toBe(308);
  expect(new URL(page.url()).pathname).toBe('/journal/what-is-parrit-ai');
  expect(new URL(page.url()).searchParams.get('source')).toBe('qa');
  expect(new URL(page.url()).searchParams.get('utm_campaign')).toBe('coherence');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

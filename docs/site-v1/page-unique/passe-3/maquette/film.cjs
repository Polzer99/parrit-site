const { chromium } = require('/Users/paullarmaraud/parrit-site-worktrees/scenario-donnee/node_modules/playwright');
const dir = '/private/tmp/claude-501/-Users-paullarmaraud/b2420e7f-18c7-4612-878e-b13d9a2a28d0/scratchpad/maquette-bas';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: dir + '/film', size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage();
  await page.goto('file://' + dir + '/index.html');
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(19000);
  const go = async (sel, wait) => { await page.evaluate(s => document.querySelector(s).scrollIntoView({ behavior: 'smooth', block: 'start' }), sel); await page.waitForTimeout(wait); };
  await go('.parcours', 15000);
  await go('.svc', 9000);
  await go('.team', 5000);
  await go('.marquee', 7000);
  await go('.flowmap', 13000);
  await go('.founder', 3000);
  await go('#contact', 4000);
  await ctx.close(); await browser.close();
})();

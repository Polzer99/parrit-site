const { chromium } = require('/Users/paullarmaraud/parrit-site-worktrees/scenario-donnee/node_modules/playwright');
const dir = __dirname;
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: dir + '/film-hero', size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + dir + '/index.html');
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(7000); await page.screenshot({ path: dir + '/s-hero2.png' });
  await page.waitForTimeout(13000);
  console.log('errors', JSON.stringify(errors));
  await ctx.close(); await browser.close();
})();

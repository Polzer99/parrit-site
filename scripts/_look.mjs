import { chromium } from "playwright";
const OUT = "/tmp/claude-501/-Users-paullarmaraud/408d8788-ca37-4dfe-9b85-155bdfc51136/scratchpad/hero";
import { mkdir } from "node:fs/promises";
await mkdir(OUT, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
p.on("pageerror", e => console.log("ERR", String(e)));
p.on("console", m => m.type()==="error" && console.log("CONSOLE", m.text()));
await p.goto("http://localhost:3000/art-direction-lab/product-living-hero-proof", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const att = async (m) => p.waitForFunction((x) => document.querySelector(".hp")?.getAttribute("data-moment") === x, m, { timeout: 14000 });
for (const [m, nom] of [["travail","paper-travail"],["arret","paper-arret"],["action","paper-action"]]) {
  await att(m); await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${nom}.png` });
}
await p.locator('.hp-lab-choix button', { hasText: "Ink" }).click();
for (const [m, nom] of [["arret","ink-arret"],["action","ink-action"]]) {
  await att(m); await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${nom}.png` });
}
await b.close();

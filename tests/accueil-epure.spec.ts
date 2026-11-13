import { readFile } from "node:fs/promises";
import { test, expect } from "./network-deny.setup";
import { HOME_GOALS, GOAL_PLANES, goalNodeLabel } from "../src/system/home-goals";
import { CAL_LINK_COMMISSION, CAL_LINK_COMMISSION_EN } from "../site.config";
import type { Page } from "@playwright/test";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const local = (path: string) => {
  const url = new URL(path, BASE);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
};
test.use({ serviceWorkers: "block" });
async function offlineCalendar(page: Page) {
  const calls: URL[] = [];
  const sdk = await readFile("node_modules/@calcom/embed-core/dist/embed/embed.js", "utf8");
  await page.route("**/embed/embed.js", route => {
    expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
    return route.fulfill({ contentType: "application/javascript", body: sdk });
  });
  await page.route("**/embed?**", route => {
    const url = new URL(route.request().url());
    expect(url.hostname).toBe("app.cal.com");
    expect([`/${CAL_LINK_COMMISSION}/embed`, `/${CAL_LINK_COMMISSION_EN}/embed`]).toContain(url.pathname);
    calls.push(url);
    return route.fulfill({ contentType: "text/html", body: '<!doctype html><html><body>Local calendar<script>parent.postMessage({fullType:"CAL:commission:__iframeReady",data:{}},"*");parent.postMessage({fullType:"CAL:commission:linkReady",data:{}},"*");</script></body></html>' });
  });
  // Even a localhost POST is prevented from reaching the production webhook.
  await page.route("**/api/interet", route => route.fulfill({ json: { ok: true } }));
  return calls;
}
for (const locale of ["fr", "en"] as const) {
  const home = locale === "fr" ? "/fr" : "/";
  for (const width of [390, 1440]) test(`17 goals update result, diagram and attribution without shifting ${locale} ${width}`, async ({ page, context }, testInfo) => {
    await offlineCalendar(page);
    await page.setViewportSize({ width, height: width === 390 ? 700 : 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
    await page.goto(local(`${home}?utm_source=check&utm_custom=one&utm_custom=two`));
    await page.evaluate(() => document.fonts.ready);
    const select = page.locator("#objectif");
    await expect(select.locator("option")).toHaveCount(17);
    const initial = await page.locator(".hero .exec").boundingBox();
    for (const goal of HOME_GOALS) {
      await select.selectOption(goal.id);
      await expect(page.locator(`.goal-results [data-result="${goal.id}"]`)).toBeVisible();
      await expect(page.locator(".goal-results > p:visible")).toHaveText(goal.result[locale]);
      await expect(page.locator(".goal-path")).toHaveAttribute("data-path", goal.id);
      await expect(page.locator('.goal-node[data-active="true"]')).toHaveCount(3);
      for (const node of goal.path) await expect(page.locator(".goal-node").filter({ has: page.locator("title", { hasText: new RegExp(`^${goalNodeLabel(GOAL_PLANES.flatMap(p => [...p.nodes]).find(n => n.fr === node)!, locale)}$`) }) }).first()).toHaveAttribute("data-active", "true");
      const url = new URL((await page.locator(".hero .exec").getAttribute("href"))!, BASE);
      expect(url.searchParams.get("source")).toBe(`accueil-${goal.id}`);
      expect(url.searchParams.getAll("utm_custom")).toEqual(["one", "two"]);
      const current = (await page.locator(".hero .exec").boundingBox())!;
      expect(Math.abs(current.y - initial!.y)).toBeLessThanOrEqual(1);
      const overflow = await page.locator(".hero").evaluate(hero => [...hero.querySelectorAll<HTMLElement>("h1, select, .goal-results > p:not([hidden]), .goal-node-label, .rev-button")].map(el => el.getBoundingClientRect()).some(r => r.left < -1 || r.right > innerWidth + 1));
      expect(overflow).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator(".goal-path")).toHaveCSS("animation-name", "none");
    }
    if (width === 1440) {
      const hero = (await page.locator(".hero").boundingBox())!;
      expect(hero.y + hero.height).toBeLessThanOrEqual(800);
    } else {
      const group = (await page.locator(".hero .actions").boundingBox())!;
      expect(initial!.width).toBeCloseTo(group.width, 0);
    }
    expect(await context.cookies()).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`accueil-${locale}-${width}.png`), fullPage: true });
  });
  test(`nine motor links select the matching goal with visible keyboard focus ${locale}`, async ({ page }) => {
    await offlineCalendar(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(home));
    for (const goal of HOME_GOALS.filter(item => item.flow)) {
      await page.locator(`.goal-flow[data-goal="${goal.id}"]`).click();
      await expect(page.locator("#objectif")).toHaveValue(goal.id);
      await expect(page.locator("#objectif")).toBeFocused();
      await expect(page.locator(".goal-results > p:visible")).toHaveText(goal.result[locale]);
    }
    const labels = await page.locator(".goal-flow > b").allTextContents();
    expect(new Set(labels).size).toBe(labels.length);
    expect(await page.locator("main").innerText()).not.toMatch(/[←-⇿⟵-⟿]/u);
    for (const link of await page.locator(".goal-flow, .assistant-links a").all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });
  test(`selected goal reaches real embed SDK, including after calendar mount and reload ${locale}`, async ({ page }) => {
    const calendar = await offlineCalendar(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(`${home}?objectif=agents&utm_custom=one&utm_custom=two`));
    await page.locator(".hero .exec").click();
    await expect.poll(() => calendar.at(-1)?.searchParams.get("metadata[source]")).toBe("accueil-agents");
    await page.locator("#objectif").selectOption("logiciel");
    const href = (await page.locator(".hero .exec").getAttribute("href"))!;
    await page.locator(".hero .exec").click();
    await expect.poll(() => calendar.at(-1)?.searchParams.get("metadata[source]")).toBe("accueil-logiciel");
    expect(calendar.at(-1)?.searchParams.getAll("utm_custom")).toEqual(["one", "two"]);
    // Opening exactly the href also models a modified click/new tab.
    await page.goto(local(href));
    await expect(page.locator("#objectif")).toHaveValue("logiciel");
    await page.reload();
    await expect(page.locator("#objectif")).toHaveValue("logiciel");
    await expect.poll(() => calendar.at(-1)?.searchParams.get("metadata[source]")).toBe("accueil-logiciel");
  });
  test.describe(`GET fallback ${locale}`, () => {
    test.use({ javaScriptEnabled: false });
    test("all seventeen goals remain usable without JavaScript", async ({ page }) => {
      await page.goto(local(`${home}?source=accueil-agents&utm_source=offline`));
      await page.locator('.goal-flow[data-goal="logiciel"]').click();
      await expect(page.locator("#objectif")).toHaveValue("logiciel");
      for (const goal of HOME_GOALS) {
        await page.locator("#objectif").selectOption(goal.id);
        await page.locator('.goal-form button[type="submit"]').click();
        await expect(page.locator("#objectif")).toHaveValue(goal.id);
        await expect(page.locator(".goal-results > p:visible")).toHaveText(goal.result[locale]);
        await expect(page.locator(".goal-path")).toHaveAttribute("data-path", goal.id);
        expect(new URL(page.url()).searchParams.get("utm_source")).toBe("offline");
      }
    });
  });
}

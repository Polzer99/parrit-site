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
    // Pseudo-elements have no boundingBox API: resolve the chevron's center
    // from its containing block, border box and computed transform.
    const selectionGeometry = () => select.evaluate(node => {
      const box = node.getBoundingClientRect();
      const wrapper = node.closest(".goal-select")!;
      const bounds = wrapper.getBoundingClientRect();
      const arrow = getComputedStyle(wrapper, "::after");
      const arrowWidth = parseFloat(arrow.width) + (arrow.boxSizing === "border-box" ? 0
        : parseFloat(arrow.borderLeftWidth) + parseFloat(arrow.borderRightWidth));
      const arrowHeight = parseFloat(arrow.height) + (arrow.boxSizing === "border-box" ? 0
        : parseFloat(arrow.borderTopWidth) + parseFloat(arrow.borderBottomWidth));
      const transform = new DOMMatrixReadOnly(arrow.transform === "none" ? undefined : arrow.transform);
      return {
        x: box.x, width: box.width, wrapperX: bounds.x, wrapperWidth: bounds.width,
        chevronX: bounds.right - parseFloat(arrow.right) - arrowWidth / 2 + transform.e,
        chevronY: bounds.top + scrollY + parseFloat(arrow.top) + arrowHeight / 2 + transform.f,
      };
    });
    const initialSelection = await selectionGeometry();
    const initialLabels = await page.locator(".goal-node-label").evaluateAll(nodes => nodes.map(node => {
      const box = node.getBoundingClientRect();
      return { x: box.x, y: box.y + scrollY, width: box.width, height: box.height };
    }));
    expect(initialLabels).toHaveLength(GOAL_PLANES.reduce((count, plane) => count + plane.nodes.length, 0));
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
      const widths = await select.evaluate((node: HTMLSelectElement) => {
        const style = getComputedStyle(node);
        const probe = document.createElement("span");
        probe.textContent = node.selectedOptions[0].text;
        Object.assign(probe.style, {
          position: "absolute", visibility: "hidden", whiteSpace: "pre",
          font: style.font, letterSpacing: style.letterSpacing,
        });
        document.body.append(probe);
        const text = probe.getBoundingClientRect().width;
        probe.remove();
        return {
          text,
          useful: node.getBoundingClientRect().width - parseFloat(style.borderLeftWidth)
            - parseFloat(style.borderRightWidth) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
        };
      });
      expect(widths.text, `${locale}/${goal.id}: texte hors réserve du chevron`).toBeLessThanOrEqual(widths.useful);
      const geometry = await selectionGeometry();
      for (const key of ["x", "width", "wrapperX", "wrapperWidth", "chevronX", "chevronY"] as const) {
        expect(Math.abs(geometry[key] - initialSelection[key]), `${locale}/${goal.id}: ${key} stable`).toBeLessThanOrEqual(1);
      }
      const labels = page.locator(".goal-node-label");
      await expect(page.locator('.goal-node-label[data-active="true"]')).toHaveText([...goal.path].reverse().map(node => goalNodeLabel(GOAL_PLANES.flatMap(plane => [...plane.nodes]).find(item => item.fr === node)!, locale)));
      const currentLabels = await labels.evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        return { x: box.x, y: box.y + scrollY, width: box.width, height: box.height };
      }));
      expect(currentLabels).toHaveLength(initialLabels.length);
      for (const [index, label] of currentLabels.entries()) {
        for (const key of ["x", "y", "width", "height"] as const) {
          expect(Math.abs(label[key] - initialLabels[index][key]), `${locale}/${goal.id}: étiquette ${index} ${key} stable`).toBeLessThanOrEqual(1);
        }
      }
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
  // 15/11 : calculateur, remplace le test des neuf liens de moteurs.
  test(`calculator inputs update results and touch targets stay 44px ${locale}`, async ({ page }) => {
    await offlineCalendar(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(home));
    const growth = page.locator('.calc-card[data-calculator="croissance"]');
    const time = page.locator('.calc-card[data-calculator="temps"]');
    const growthResult = growth.locator('[data-calc-result="croissance"]');
    const timeResult = time.locator('[data-calc-result="temps"]');
    await expect(growthResult).toHaveText(locale === "fr" ? /^9\s000\s€$/ : "€9,000");
    await growth.locator(".calc-field input").first().fill("40");
    await expect(growthResult).toHaveText(locale === "fr" ? /^18\s000\s€$/ : "€18,000");
    await growth.locator(".calc-field input").first().fill("");
    await expect(growthResult).toHaveText(locale === "fr" ? /^0\s€$/ : "€0");
    await expect(timeResult).toHaveText("17 h");
    await time.locator("select").selectOption("comptes-rendus");
    await expect(timeResult).toHaveText("11 h");
    expect(await page.locator("main").innerText()).not.toMatch(/[←-⇿⟵-⟿]/u);
    for (const link of await page.locator(".calc-field input, .calc-field select, .calc-footer .btn, .assistant-links a").all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });
  // 18/11 : les deux cartes partagent leurs rangées ; plus de vide sous la plus courte dans le carrousel.
  for (const width of [1440, 390]) test(`calculator cards share rows at ${width}px ${locale}`, async ({ page }) => {
    await offlineCalendar(page);
    await page.setViewportSize({ width, height: 800 });
    await page.goto(local(home));
    const box = (selector: string) => page.locator(selector).boundingBox().then(b => b!);
    const [growth, time] = [await box('.calc-card[data-calculator="croissance"]'), await box('.calc-card[data-calculator="temps"]')];
    expect(Math.abs(growth.height - time.height)).toBeLessThanOrEqual(1);
    const fields = await page.locator(".calc-card > .calc-fields").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top - node.parentElement!.getBoundingClientRect().top));
    const results = await page.locator(".calc-card > .calc-result").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().bottom - node.parentElement!.getBoundingClientRect().top));
    expect(Math.abs(fields[0] - fields[1])).toBeLessThanOrEqual(1);
    // No hidden void inside a card either: the second row is the same height on both sides.
    const second = await page.locator(".calc-card > :nth-child(2)").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
    expect(Math.abs(second[0] - second[1])).toBeLessThanOrEqual(1);
    await expect(page.locator(".calc-task select")).toHaveAccessibleName(locale === "fr" ? /^Tâche\b/ : /^Task\b/);
    expect(Math.abs(results[0] - results[1])).toBeLessThanOrEqual(1);
    // The carousel is as tall as the cards: nothing empty between a card and its dots.
    const grid = await box(".calc-grid");
    expect(grid.height - Math.max(growth.height, time.height)).toBeLessThanOrEqual(1);
  });
  test(`calendar snapshots goal at lazy load and preserves nodes until reload ${locale}`, async ({ page }) => {
    const calendar = await offlineCalendar(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(`${home}?objectif=agents&utm_custom=one&utm_custom=two`));
    const stage = await page.locator(".cal-embed-stage").elementHandle();
    expect(calendar).toHaveLength(0);
    await page.locator("#objectif").selectOption("contenu");
    await page.locator(".hero .exec").click();
    await expect.poll(() => calendar.at(-1)?.searchParams.get("metadata[source]")).toBe("accueil-contenu");
    const frame = await page.locator(".cal-embed-stage iframe").elementHandle();
    await page.locator("#objectif").selectOption("logiciel");
    const href = (await page.locator(".hero .exec").getAttribute("href"))!;
    await page.locator(".hero .exec").click();
    expect(new URL(href, BASE).searchParams.get("source")).toBe("accueil-logiciel");
    await page.waitForTimeout(2_000);
    expect(await stage!.evaluate(node => node === document.querySelector(".cal-embed-stage"))).toBe(true);
    expect(await frame!.evaluate(node => node === document.querySelector(".cal-embed-stage iframe"))).toBe(true);
    expect(calendar).toHaveLength(1);
    expect(calendar[0].searchParams.get("metadata[source]")).toBe("accueil-contenu");
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
      // 15/11 : calculateur, plus de lien de moteur ; un objectif passé en GET reste sélectionné sans JS.
      await page.goto(local(`${home}?utm_source=offline&objectif=logiciel`));
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

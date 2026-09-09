import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const PATHS = ["/", "/fr", "/standard", "/fr/standard", "/manufacture", "/fr/manufacture", "/dossiers", "/fr/dossiers"];

test.use({ serviceWorkers: "block" });
test.describe.configure({ mode: "serial" });

for (const width of [1440, 390]) {
  test(`at ${width}px all routes keep text clear of actions and other text`, async ({ page }) => {
    test.setTimeout(120_000);
    // Reuse the fixture page and its deny-all context for every route at this width.
    // None of these routes mounts Cal. Unexpected external requests must fail.
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of PATHS) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);

      const result = await page.evaluate(() => {
        type Box = { left: number; right: number; top: number; bottom: number };
        type TextBox = { element: Element; label: string; box: Box };
        const describe = (element: Element, text: string) =>
          `${element.tagName.toLowerCase()}.${[...element.classList].join(".")} "${text.trim().replace(/\s+/g, " ")}"`;
        const visible = (element: Element) => {
          if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
          // Screen-reader-only text has a layout box, but is clipped out of the painting.
          for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            if (style.clip !== "auto" || style.clipPath === "inset(50%)") return false;
          }
          return true;
        };
        const texts: TextBox[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const element = node.parentElement;
          const value = node.textContent ?? "";
          if (!element || !value.trim() || !visible(element)) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          // Ignore source indentation, but preserve each rendered line separately.
          range.setStart(node, value.length - value.trimStart().length);
          range.setEnd(node, value.trimEnd().length);
          for (const rect of range.getClientRects()) {
            if (rect.width > 0 && rect.height > 0) {
              texts.push({ element, label: describe(element, value), box: {
                left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
              } });
            }
          }
          range.detach();
        }
        const actions = [...document.querySelectorAll("a, button")].filter((element) => {
          if (!visible(element)) return false;
          const background = getComputedStyle(element).backgroundColor;
          return background !== "transparent" && !/^(?:rgba\(.*,[ ]*|.*\/[ ]*)0(?:\.0+)?\s*\)$/.test(background);
        });
        const actionFailures: string[] = [];
        for (const action of actions) {
          // Only the action's painted box uses element geometry. Text always uses Range.
          const box = action.getBoundingClientRect();
          for (const text of texts) {
            if (action.contains(text.element)) continue;
            const dx = Math.max(box.left - text.box.right, text.box.left - box.right, 0);
            const dy = Math.max(box.top - text.box.bottom, text.box.top - box.bottom, 0);
            const overlapX = Math.min(box.right, text.box.right) - Math.max(box.left, text.box.left);
            const overlapY = Math.min(box.bottom, text.box.bottom) - Math.max(box.top, text.box.top);
            if ((overlapY > 0 && dx < 12) || (overlapX > 0 && dy < 12)) {
              actionFailures.push(`${text.label} / ${describe(action, action.textContent ?? "")} : horizontal ${dx.toFixed(2)}px, vertical ${dy.toFixed(2)}px`);
            }
          }
        }
        const textFailures: string[] = [];
        const blockDisplays = new Set(["block", "flex", "grid", "list-item", "table-cell"]);
        const isBlock = (element: Element) => blockDisplays.has(getComputedStyle(element).display);
        const immediateBlockContainer = (element: Element): Element | null => {
          for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            if (isBlock(parent)) return parent;
          }
          return null;
        };
        // Inline phrase fragments still count for action clearance, never as separate blocks.
        const blockTexts = texts.filter((text) => isBlock(text.element)).map((text) => ({
          ...text, container: immediateBlockContainer(text.element),
        }));
        for (let i = 0; i < blockTexts.length; i += 1) {
          const a = blockTexts[i];
          for (let j = i + 1; j < blockTexts.length; j += 1) {
            const b = blockTexts[j];
            if (a.element.contains(b.element) || b.element.contains(a.element)) continue;
            if (a.container !== null && a.container === b.container) continue;
            const x = Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left);
            const y = Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top);
            if (x > 0 && y > 0) textFailures.push(`${a.label} / ${b.label} : overlap ${x.toFixed(2)} × ${y.toFixed(2)}px`);
          }
        }
        return { textCount: texts.length, actionCount: actions.length, actionFailures, textFailures };
      });

      expect(result.textCount, "the geometry audit must measure rendered text").toBeGreaterThan(0);
      expect(result.actionCount, "the geometry audit must measure filled actions").toBeGreaterThan(0);
      expect.soft(result.actionFailures, `${path} at ${width}px: minimum text/action gap is 12px`).toEqual([]);
      expect.soft(result.textFailures, `${path} at ${width}px: text rectangles must not overlap`).toEqual([]);
    }
  });
}

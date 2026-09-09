import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const PATHS = ["/", "/fr", "/standard", "/fr/standard", "/manufacture", "/fr/manufacture", "/dossiers", "/fr/dossiers"];

test.use({ serviceWorkers: "block" });
test.describe.configure({ mode: "serial" });

for (const width of [1440, 390]) {
  test(`at ${width}px all routes keep text clear and within the closed type scale`, async ({ page }) => {
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
        const typography = new Map<Element, { label: string; size: number }>();
        const measureType = (element: Element, text: string) => {
          typography.set(element, {
            label: describe(element, text.trim().replace(/\s+/g, " ").slice(0, 40)),
            size: Number.parseFloat(getComputedStyle(element).fontSize),
          });
        };
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
              measureType(element, value);
              texts.push({ element, label: describe(element, value), box: {
                left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
              } });
            }
          }
          range.detach();
        }
        // Inputs and textarea placeholders have no DOM text nodes.
        const placeholderType: { label: string; size: number }[] = [];
        for (const control of document.querySelectorAll("input, textarea, select")) {
          if (!visible(control)) continue;
          const box = control.getBoundingClientRect();
          if (box.width <= 0 || box.height <= 0) continue;
          if (control instanceof HTMLSelectElement) {
            measureType(control, control.selectedOptions[0]?.text ?? "");
          } else if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
            if (control instanceof HTMLInputElement && ["hidden", "checkbox", "radio", "range", "color", "file", "image"].includes(control.type)) continue;
            measureType(control, control.value || control.placeholder);
            if (!control.value && control.placeholder) {
              placeholderType.push({
                label: `${describe(control, control.placeholder.slice(0, 40))}::placeholder`,
                size: Number.parseFloat(getComputedStyle(control, "::placeholder").fontSize),
              });
            }
          }
        }
        // Independent spec values: do not read tokens, or a changed token would pass.
        const fixedSizes = [14, 16, 18, 22, 26];
        const fluidSizes = [[30, 4, 44], [34, 5, 54], [38, 6.4, 68], [40, 6.8, 84]]
          .map(([min, vw, max]) => Math.min(max, Math.max(min, window.innerWidth * vw / 100)));
        const floorFailures: string[] = [];
        const scaleFailures: string[] = [];
        for (const { label, size } of [...typography.values(), ...placeholderType]) {
          if (!Number.isFinite(size) || size < 14) floorFailures.push(`${size}px: ${label}`);
          if (!fixedSizes.includes(size) && !fluidSizes.some((expected) => Math.abs(size - expected) <= 0.5)) {
            scaleFailures.push(`${size}px: ${label}`);
          }
        }
        const actions = [...document.querySelectorAll("a, button")].filter((element) => {
          if (!visible(element)) return false;
          const background = getComputedStyle(element).backgroundColor;
          return background !== "transparent" && !/^(?:rgba\(.*,[ ]*|.*\/[ ]*)0(?:\.0+)?\s*\)$/.test(background);
        });
        // A component must be identifiable by its fill OR its contour visible on at least three sides:
        // either can provide 3:1 contrast against the container, independently of text.
        // Canvas resolves computed CSS colors to sRGB; it never loads an image.
        type Color = [number, number, number, number];
        const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("The fill contrast audit requires a 2D color parser");
        const color = (value: string): Color => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = value;
          context.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
          return [r / 255, g / 255, b / 255, a / 255];
        };
        const over = (front: Color, back: Color): Color => {
          const alpha = front[3] + back[3] * (1 - front[3]);
          if (!alpha) return [0, 0, 0, 0];
          const channel = (i: number) => (front[i] * front[3] + back[i] * back[3] * (1 - front[3])) / alpha;
          return [channel(0), channel(1), channel(2), alpha];
        };
        const painted = (element: Element | null, foreground: Color = [0, 0, 0, 0]): Color => {
          let result: Color = foreground;
          for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            // Do not silently report a ratio for a surface this audit cannot resolve.
            if (style.backgroundImage !== "none") throw new Error(`Fill contrast: unsupported image on ${describe(ancestor, "")}`);
            const backgroundClippedAtBorder = ancestor === element && foreground[3] > 0 && style.backgroundClip !== "border-box";
            if (!backgroundClippedAtBorder) result = over(result, color(style.backgroundColor));
            result[3] *= Number(style.opacity);
          }
          return over(result, [1, 1, 1, 1]);
        };
        const luminance = (value: Color) => {
          const linear = value.slice(0, 3).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        };
        const rgb = (value: Color) => `rgb(${value.slice(0, 3).map((v) => Math.round(v * 255)).join(", ")})`;
        const contrast = (front: Color, back: Color) => {
          const a = luminance(front);
          const b = luminance(back);
          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        };
        const controlContrastFailures: string[] = [];
        let controlCount = 0;
        const interactive = 'a[href], button, input, textarea, select, summary, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"], [role="slider"], [role="combobox"], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
        for (const control of document.querySelectorAll(interactive)) {
          if (!visible(control)) continue;
          const box = control.getBoundingClientRect();
          if (box.width <= 0 || box.height <= 0) continue;
          const style = getComputedStyle(control);
          const background = style.backgroundColor;
          const borders = ["top", "right", "bottom", "left"].flatMap((side) => {
            const width = Number.parseFloat(style.getPropertyValue(`border-${side}-width`));
            const borderStyle = style.getPropertyValue(`border-${side}-style`);
            const border = color(style.getPropertyValue(`border-${side}-color`));
            if (!(width > 0) || borderStyle === "none" || borderStyle === "hidden" || border[3] === 0) return [];
            return [border];
          });
          const fill = painted(control);
          const container = painted(control.parentElement);
          // A command has a shape only through a nontransparent fill distinct from
          // its effective container background, or a visible border on at least three sides.
          // Three sides still delimit an object; a single side separates two rows.
          // One or two sides are separators: they neither bring a command into this
          // audit nor rescue an insufficient fill contrast.
          const hasDistinctFill = color(background)[3] > 0 && fill.some((channel, i) => Math.abs(channel - container[i]) > 1e-6);
          const hasContour = borders.length >= 3;
          if (!hasDistinctFill && !hasContour) continue;
          controlCount += 1;
          const fillRatio = contrast(fill, container);
          const borderRatios = hasContour ? borders.map((border) => contrast(painted(control, border), container)) : [];
          const borderRatio = Math.max(1, ...borderRatios);
          if (fillRatio < 3 && borderRatio < 3) {
            const label = control.getAttribute("aria-label") || control.textContent || control.getAttribute("placeholder") || control.getAttribute("name") || "";
            controlContrastFailures.push(`${location.pathname}: ${describe(control, label)}; fill ${background} (effective ${rgb(fill)}), container ${rgb(container)}; fill ratio ${fillRatio.toFixed(3)}:1, border ratio ${borderRatio.toFixed(3)}:1${borderRatios.length ? "" : " (no contour visible on at least three sides)"}; both < 3:1`);
          }
        }
        const actionFailures: string[] = [];
        for (const action of actions) {
          // Only the action's painted box uses element geometry. Text always uses Range.
          const box = action.getBoundingClientRect();
          for (const text of texts) {
            if (action.contains(text.element)) continue;
            const interactiveSelector = 'a, button, input, select, [role="button"]';
            const textControl = text.element.closest(interactiveSelector);
            if (
              action.matches(interactiveSelector) && textControl &&
              action.parentElement !== null && action.parentElement === textControl.parentElement
            ) continue;
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
        return { controlCount, controlContrastFailures, textCount: texts.length, actionCount: actions.length, actionFailures, textFailures, floorFailures, scaleFailures };
      });

      expect(result.controlCount, "the contrast audit must measure interactive controls").toBeGreaterThan(0);
      expect.soft(result.controlContrastFailures, `${path} at ${width}px: control fill or visible border contrast against the container must be at least 3:1`).toEqual([]);
      expect(result.textCount, "the geometry audit must measure rendered text").toBeGreaterThan(0);
      expect(result.actionCount, "the geometry audit must measure filled actions").toBeGreaterThan(0);
      expect.soft(result.actionFailures, `${path} at ${width}px: minimum text/action gap is 12px`).toEqual([]);
      expect.soft(result.textFailures, `${path} at ${width}px: text rectangles must not overlap`).toEqual([]);
      expect.soft(result.floorFailures, `${path} at ${width}px: visible text must be at least 14px`).toEqual([]);
      expect.soft(result.scaleFailures, `${path} at ${width}px: sizes outside the nine spec steps (fluid tolerance 0.5px)`).toEqual([]);
    }
  });
}

import { test } from "@playwright/test";

test("interaction audit pass 4", async ({ page }) => {
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("https://parrit.ai/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2700);

  // DOM structure check: panel should be sibling of header, not descendant
  const structure = await page.evaluate(() => {
    const header = document.querySelector("header.cmdbar");
    const panel = document.querySelector(".cmd-panel");
    if (!header || !panel) return { header: !!header, panel: !!panel };
    return {
      headerHTML_tail: header.outerHTML.slice(-80),
      panelIsSiblingOfHeader: header.parentElement === panel.parentElement,
      panelInsideHeader: header.contains(panel),
    };
  });
  console.log("STRUCTURE:", structure);

  // Tap open
  await page.locator(".cmd-menu-toggle").click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "/private/tmp/claude-501/-Users-paullarmaraud/8f9d695b-1d13-4269-941a-0ff4a61c34a2/scratchpad/mobile-panel-pass4.png" });

  const panelStyles = await page.evaluate(() => {
    const panel = document.querySelector(".cmd-panel");
    if (!panel) return "NOT FOUND";
    const cs = getComputedStyle(panel);
    const rect = panel.getBoundingClientRect();
    return { background: cs.backgroundColor, opacity: cs.opacity, zIndex: cs.zIndex, rect };
  });
  console.log("PANEL STYLES:", panelStyles);

  // Escape closes it
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const panelVisibleAfterEsc = await page.locator(".cmd-panel").isVisible().catch(() => false);
  console.log("panel visible after Escape:", panelVisibleAfterEsc);
  const focusAfterEsc = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el ? `${el.tagName}.${el.className}` : null;
  });
  console.log("focus after escape:", focusAfterEsc);

  // Reopen via keyboard, verify Escape from keyboard-opened state too
  await page.keyboard.press("Tab"); // wordmark
  await page.keyboard.press("Tab"); // toggle
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  console.log("panel visible after keyboard reopen:", await page.locator(".cmd-panel").isVisible().catch(() => false));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  console.log("panel visible after 2nd Escape:", await page.locator(".cmd-panel").isVisible().catch(() => false));
});

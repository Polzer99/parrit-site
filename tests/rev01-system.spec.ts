import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

// LOT 3, spec 2026-09-06: the debug surface is retired, so lock its absence.
test("the retired system route returns 404", async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/system`);
  expect(response?.status()).toBe(404);
});

test.describe("network deny self-test", () => {
  test.use({ expectBlockedRequest: true });

  test("blocks an unmatched external request", async ({ page, blockedRequests }) => {
    await page.goto(`${BASE_URL}/system`);
    const result = await page.evaluate(async () => {
      try {
        await fetch("https://example.invalid/rev01-network-probe");
        return "unexpected-success";
      } catch {
        return "blocked";
      }
    });

    expect(result).toBe("blocked");
    expect(blockedRequests).toContain("https://example.invalid/rev01-network-probe");
  });
});

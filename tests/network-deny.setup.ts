import { expect, test as base } from "@playwright/test";

type NetworkDenyFixtures = {
  blockedRequests: string[];
  expectBlockedRequest: boolean;
};

export const test = base.extend<NetworkDenyFixtures>({
  expectBlockedRequest: [false, { option: true }],
  blockedRequests: [
    async ({ context, expectBlockedRequest }, fixtureUse) => {
      const blockedRequests: string[] = [];

      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
          await route.continue();
          return;
        }

        blockedRequests.push(route.request().url());
        await route.abort("blockedbyclient");
      });

      await fixtureUse(blockedRequests);

      if (expectBlockedRequest) {
        expect(
          blockedRequests.length,
          "the self-test must prove an external request was blocked",
        ).toBeGreaterThan(0);
      } else {
        expect(blockedRequests, "outbound requests are forbidden in REV 01 e2e tests").toEqual([]);
      }
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";

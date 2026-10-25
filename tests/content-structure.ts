import { expect, type Locator } from "@playwright/test";

// Editorial wording may change; cardinality and useful, nonempty content may not.
export async function expectPopulated(locator: Locator, count = 1) {
  await expect(locator).toHaveCount(count);
  for (const element of await locator.all()) await expect(element).toHaveText(/\S/);
}

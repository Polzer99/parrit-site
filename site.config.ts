export const CAL_LINK_COMMISSION = "paul-larmaraud/audit";

export const BUILD_WITH_YOU_PRICE = { amountHt: 3200, currency: "EUR" } as const;

export const siteConfig = {
  CAL_LINK_COMMISSION,
  BUILD_WITH_YOU_PRICE,
} as const;

export function isPlaceholder(value: string): boolean {
  return value.trim().toUpperCase() === "TBD";
}

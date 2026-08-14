export const CAL_LINK_COMMISSION = "paul-larmaraud/executive-operating-session";
export const CAL_LINK_COACHING_PAUL = "TBD";
export const CAL_LINK_COACHING_MAXIME = "TBD";
export const COACHING_OFFER_NAME = "TBD";
export const COACHING_PRICE_DISPLAY = "TBD";

export const siteConfig = {
  CAL_LINK_COMMISSION,
  CAL_LINK_COACHING_PAUL,
  CAL_LINK_COACHING_MAXIME,
  COACHING_OFFER_NAME,
  COACHING_PRICE_DISPLAY,
} as const;

export function isPlaceholder(value: string): boolean {
  return value.trim().toUpperCase() === "TBD";
}

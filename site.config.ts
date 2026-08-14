export const CAL_LINK_COMMISSION = "paul-larmaraud/30min";

export const siteConfig = {
  CAL_LINK_COMMISSION,
} as const;

export function isPlaceholder(value: string): boolean {
  return value.trim().toUpperCase() === "TBD";
}

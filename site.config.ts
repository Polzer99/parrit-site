export const CAL_LINK_COMMISSION = "paul-larmaraud/audit";
export const CAL_LINK_COMMISSION_EN = "paul-larmaraud/ai-strategy-meeting";

export const siteConfig = {
  CAL_LINK_COMMISSION,
  CAL_LINK_COMMISSION_EN,
} as const;

export function isPlaceholder(value: string): boolean {
  return value.trim().toUpperCase() === "TBD";
}

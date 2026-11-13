import "server-only";
import type { Locale } from "@/system/locale";

/** Unprefixed routes are English. French route entries pass their locale explicitly. */
export async function getLocale(): Promise<Locale> {
  return "en";
}

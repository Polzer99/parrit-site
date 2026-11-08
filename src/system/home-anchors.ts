import type { Locale } from "./locale";

const HASHES: Readonly<Record<string, string>> = {
  "en-production": "in-production", offres: "offers", parcours: "path", partenaires: "team", terrain: "in-the-field", fonctionnement: "how-it-works",
};

export function localizedHomeHash(fragment: string, locale: Locale) {
  const hash = fragment.replace(/^#/, "");
  if (!hash) return "";
  if (hash === "ce-qui-change" || hash === "what-changes") return locale === "fr" ? "#en-production" : "#in-production";
  const translated = locale === "en" ? HASHES[hash] ?? hash : Object.entries(HASHES).find(([, value]) => value === hash)?.[0] ?? hash;
  return `#${translated}`;
}

export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = "parrit_locale";
export const LOCALE_HEADER = "x-parrit-locale";
export const PATHNAME_HEADER = "x-parrit-pathname";

// The Journal index has translated chrome; individual entries do not.
export const TRANSLATED_PATHS: readonly string[] = [
  "/", "/manufacture", "/standard", "/dossiers", "/commission", "/journal", "/legal",
];

export function barePathname(pathname: string): string {
  return pathname === "/fr" ? "/" : pathname.startsWith("/fr/") ? pathname.slice(3) : pathname;
}

export function localizedPath(href: string, locale: Locale): string {
  const suffixAt = href.search(/[?#]/);
  const pathname = suffixAt < 0 ? href : href.slice(0, suffixAt);
  const suffix = suffixAt < 0 ? "" : href.slice(suffixAt);
  const bare = barePathname(pathname);
  return `${locale === "fr" && TRANSLATED_PATHS.includes(bare) ? `/fr${bare === "/" ? "" : bare}` : bare}${suffix}`;
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "fr" || value === "en";
}

export function localeFromAcceptLanguage(value: string | null): Locale {
  if (!value) return "en";

  const preferences = value
    .split(",")
    .map((part) => {
      const [tag, ...parameters] = part.trim().toLowerCase().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityParameter ? Number.parseFloat(qualityParameter.split("=")[1] ?? "0") : 1;
      return { tag, quality: Number.isFinite(quality) ? quality : 0 };
    })
    .sort((left, right) => right.quality - left.quality);

  for (const { tag, quality } of preferences) {
    if (quality <= 0) continue;
    if (tag === "fr" || tag.startsWith("fr-")) return "fr";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }

  return "en";
}

export function localizedAlternates(pathname: string, locale: Locale) {
  const bare = barePathname(pathname);
  return {
    canonical: localizedPath(bare, locale),
    languages: {
      ...(TRANSLATED_PATHS.includes(bare) ? { fr: localizedPath(bare, "fr") } : {}),
      en: bare,
      "x-default": bare,
    },
  } as const;
}

export function localizedOpenGraph(pathname: string, locale: Locale, title: string, description: string) {
  return {
    title, description, siteName: "Parrit.ai", type: "website" as const,
    url: localizedPath(pathname, locale),
    locale: locale === "fr" ? "fr_FR" : "en_US",
    alternateLocale: locale === "fr" ? "en_US" : "fr_FR",
  };
}

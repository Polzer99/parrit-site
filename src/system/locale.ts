export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = "parrit_locale";
export const LOCALE_HEADER = "x-parrit-locale";

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

export function localizedAlternates(pathname: string) {
  const separator = pathname.includes("?") ? "&" : "?";
  return {
    canonical: pathname,
    languages: {
      "fr-FR": `${pathname}${separator}lang=fr`,
      "en": `${pathname}${separator}lang=en`,
      "x-default": `${pathname}${separator}lang=en`,
    },
  } as const;
}

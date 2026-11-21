import type { Locale } from "./locale";

export const BOOKING_COPY = {
  fr: {
    title: "Premier échange de 15 minutes",
    metaTitle: "Premier échange, 15 minutes",
    invitation: "Si vous souhaitez en savoir plus, rencontrons-nous.",
    description: "Vous échangez avec Paul Larmaraud sur votre besoin pendant 15 minutes. Vous examinez une première piste et décidez de la suite.",
    action: "Choisir un créneau",
    email: "Vous préférez écrire ? paul.larmaraud@parrit.ai",
  },
  en: {
    title: "First call, 15 minutes",
    metaTitle: "First call, 15 minutes",
    invitation: "If you'd like to know more, let's meet.",
    description: "You talk with Paul Larmaraud about your needs for 15 minutes. You explore an initial idea and decide what comes next.",
    action: "Pick a time",
    email: "Prefer to write? paul.larmaraud@parrit.ai",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type BookingSearchParams = Record<string, string | string[] | undefined>;
export type BookingParameters = Partial<Record<"metadata[source]" | `utm_${string}`, string | string[]>>;

/** Cal embed-core serializes config entries into the booking iframe URL. */
export function bookingParameters(query: BookingSearchParams): BookingParameters {
  const parameters: BookingParameters = {};
  if (typeof query.source === "string" && query.source.length >= 1 && query.source.length <= 80 && !/[^a-z0-9-]/.test(query.source)) {
    parameters["metadata[source]"] = query.source;
  }
  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith("utm_") && value !== undefined) {
      parameters[key as `utm_${string}`] = value;
    }
  }
  return parameters;
}

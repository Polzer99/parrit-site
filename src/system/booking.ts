import type { Locale } from "./locale";

export const BOOKING_COPY = {
  fr: {
    title: "Entretien stratégique IA, 15 minutes",
    invitation: "Si vous souhaitez en savoir plus, rencontrons-nous.",
    description: "15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite.",
    action: "Choisir un créneau",
    email: "Vous préférez écrire ? paul.larmaraud@parrit.ai",
  },
  en: {
    title: "AI strategy call, 15 minutes",
    invitation: "If you'd like to know more, let's meet.",
    description: "15 minutes with Paul Larmaraud to clarify your topic. You leave with a first lead, and you decide what comes next.",
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

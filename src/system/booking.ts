import type { Locale } from "./locale";

export const BOOKING_COPY = {
  fr: {
    title: "Premier échange de 15 minutes.",
    metaTitle: "Premier échange, 15 minutes",
    description: "Vous présentez une tâche ou un projet pendant 15 minutes en visioconférence. Nous vous disons ce qui est réalisable et ce qu’il faudrait examiner ensuite.",
    action: "Prendre rendez-vous",
    email: "Décrire votre besoin par courriel",
    emailOpen: "Ouvrir un courriel",
  },
  en: {
    title: "First call, 15 minutes.",
    metaTitle: "First call, 15 minutes",
    description: "You describe a task or a project in a 15-minute video call. We tell you what is feasible and what should be examined next.",
    action: "Book a call",
    email: "Describe your need by email",
    emailOpen: "Open an email",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type BookingCallVariant = "article" | "harness-engineering" | "ai-sprints" | "integration-developpement" | "conseil-transformation";
export const BOOKING_CALL_COPY = {
  fr: {
    article: {
      invitation: "Examinez ce sujet dans votre entreprise.",
      description: "Pendant ces 15 minutes, vous décrivez une tâche concernée par le sujet de cet article. Nous précisons ensemble ce que vous souhaitez améliorer et les informations nécessaires pour l’étudier.",
      emailLead: "Vous pouvez aussi nous décrire votre situation par courriel.",
    },
    "harness-engineering": {
      invitation: "Précisez les actions que vous voulez contrôler.",
      description: "Pendant ces 15 minutes, vous décrivez ce que votre assistant fait et ce qui vous inquiète. Nous précisons ensemble les actions à examiner et les éléments nécessaires pour les vérifier.",
      emailLead: "Vous pouvez aussi nous décrire la tâche et le problème rencontré par courriel.",
    },
    "ai-sprints": {
      invitation: "Décrivez la tâche que vous voulez essayer.",
      description: "Pendant ces 15 minutes, vous présentez une tâche et le résultat attendu. Nous précisons ensemble ce qu’un premier essai devrait vérifier et les fichiers nécessaires pour l’étudier.",
      emailLead: "Vous pouvez aussi nous décrire la tâche et le résultat attendu par courriel.",
    },
    "integration-developpement": {
      invitation: "Précisez les informations que vos logiciels doivent échanger.",
      description: "Pendant ces 15 minutes, vous décrivez une tâche qui passe par plusieurs logiciels. Nous précisons ensemble les informations à transmettre et les accès à vérifier pour étudier le raccordement.",
      emailLead: "Vous pouvez aussi nous décrire la tâche et les logiciels concernés par courriel.",
    },
    "conseil-transformation": {
      invitation: "Choisissez une tâche à examiner.",
      description: "Pendant ces 15 minutes, vous décrivez une difficulté dans le travail de votre service. Nous précisons ensemble la tâche à observer et les personnes ou documents nécessaires pour l’étudier.",
      emailLead: "Vous pouvez aussi nous décrire une difficulté rencontrée par vos équipes par courriel.",
    },
  },
  en: {
    article: {
      invitation: "Examine this subject in your company.",
      description: "During these 15 minutes, you describe a task related to the subject of this article. Together, we clarify what you want to improve and the information needed to examine it.",
      emailLead: "You can also describe your situation to us by email.",
    },
    "harness-engineering": {
      invitation: "Specify the actions you want to control.",
      description: "During these 15 minutes, you describe what your assistant does and what concerns you. Together, we clarify the actions to examine and the information needed to check them.",
      emailLead: "You can also describe the task and the problem you encountered by email.",
    },
    "ai-sprints": {
      invitation: "Describe the task you want to try.",
      description: "During these 15 minutes, you present a task and the expected result. Together, we clarify what a first trial should check and the files needed to examine it.",
      emailLead: "You can also describe the task and the expected result to us by email.",
    },
    "integration-developpement": {
      invitation: "Specify the information your software needs to exchange.",
      description: "During these 15 minutes, you describe a task that passes through several pieces of software. Together, we clarify the information to transfer and the access to check before examining the connection.",
      emailLead: "You can also describe the task and the software involved to us by email.",
    },
    "conseil-transformation": {
      invitation: "Choose a task to examine.",
      description: "During these 15 minutes, you describe a difficulty in your department’s work. Together, we clarify the task to observe and the people or documents needed to examine it.",
      emailLead: "You can also describe a difficulty your teams encounter to us by email.",
    },
  },
} as const satisfies Record<Locale, Record<BookingCallVariant, { invitation: string; description: string; emailLead: string }>>;

export type BookingSearchParams = Record<string, string | string[] | undefined>;
export type BookingParameters = Partial<Record<"metadata[source]" | `utm_${string}`, string | string[]>>;

/** Cal embed-core serializes config entries into the booking iframe URL. */
export function bookingParameters(query: BookingSearchParams): BookingParameters {
  const parameters: BookingParameters = {};
  const source = typeof query.source === "string" && query.source.length >= 1 && query.source.length <= 80 && !/[^a-z0-9-]/.test(query.source)
    ? query.source : undefined;
  if (source) parameters["metadata[source]"] = source;

  // Cal stores these five standard UTM fields without hidden questions.
  // Never enable forwardQueryParams: names, emails and arbitrary URL fields
  // must not be copied into the booking iframe.
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
  for (const key of keys) {
    const value = query[key];
    if (typeof value !== "string" || value.length < 1 || value.length > 120) continue;
    // Campaign labels only, not URLs, addresses, encoded payloads or phone-like values.
    if (!/^[\p{L}\p{N}][\p{L}\p{M}\p{N}_. ~-]*$/u.test(value) || /[^\p{L}\p{M}\p{N}_. ~-]/u.test(value)) continue;
    if (/^[0-9][0-9 .-]{6,}$/.test(value)) continue;
    parameters[key] = value;
  }
  if (source) {
    // Preserve an explicit campaign source and content. Otherwise identify the
    // site and its CTA, not a visitor. This is not cross-page visitor tracking.
    if (!parameters.utm_source) {
      parameters.utm_source = "parrit.ai";
      if (!parameters.utm_medium) parameters.utm_medium = "website";
    }
    if (!parameters.utm_content) parameters.utm_content = source;
  }
  return parameters;
}

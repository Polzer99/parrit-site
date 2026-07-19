import { getAttribution } from "@/lib/attribution";

export type EventName =
  | "cta_click"
  | "booking_cta_click"
  | "booking_started"
  | "scroll_depth"
  | "time_on_page"
  | "form_view"
  | "form_start"
  | "form_submitted"
  | "form_failed"
  | "hero_cta_click"
  | "diagnostic_started"
  | "diagnostic_completed"
  | "diagnostic_lead";

export type EventProperties = Record<string, string | number | boolean>;

type PostHogCapture = {
  capture: (name: string, properties?: EventProperties) => void;
};

function getLang(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && ["fr", "en", "pt-BR", "zh-CN"].includes(segment)
    ? segment
    : "fr";
}

export function track(name: EventName, props?: EventProperties): void {
  if (typeof window === "undefined") return;

  const posthog = (window as unknown as { posthog?: PostHogCapture }).posthog;
  if (!posthog) return;

  const page = window.location.pathname;
  posthog.capture(name, {
    ...getAttribution(),
    ...(props ?? {}),
    page,
    lang: getLang(page),
  });
}

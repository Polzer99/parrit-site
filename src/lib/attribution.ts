/** Attribution de la visite en mémoire ; perdue au rechargement du document. */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type TouchData = Partial<Record<UtmKey, string>> & {
  referrer?: string;
  landing_page?: string;
  timestamp: string;
};

type Attribution = {
  first_touch: TouchData;
  last_touch: TouchData;
};

function readUtmsFromUrl(): Partial<Record<UtmKey, string>> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Partial<Record<UtmKey, string>> = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

function buildTouch(): TouchData {
  const utms = readUtmsFromUrl();
  return {
    ...utms,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    landing_page: typeof window !== "undefined" ? window.location.pathname : undefined,
    timestamp: new Date().toISOString(),
  };
}

let visit: Attribution | null = null;

/** Capture une seule fois l'arrivée, y compris si le formulaire précède l'effet. */
export function captureTouch(): void {
  if (typeof window === "undefined" || visit) return;
  const arrival = buildTouch();
  visit = { first_touch: arrival, last_touch: arrival };
}

/**
 * Retourne les props plates à spread dans les events PostHog / payloads webhook.
 * Préfixe first_touch_ et last_touch_. Ajoute aussi les UTMs courantes (URL en
 * cours) sous leur nom natif pour compat avec dashboards existants.
 */
export function getAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  captureTouch();
  const stored = typeof window === "undefined" ? null : visit;
  const current = readUtmsFromUrl();

  if (stored) {
    Object.entries(stored.first_touch).forEach(([k, v]) => {
      if (v) out[`first_touch_${k}`] = v;
    });
    Object.entries(stored.last_touch).forEach(([k, v]) => {
      if (v) out[`last_touch_${k}`] = v;
    });
  }

  Object.entries(current).forEach(([k, v]) => {
    if (v) out[k] = v;
  });

  return out;
}

/** Propriétés first-touch immuables destinées au `$set_once` PostHog. */
export function getFirstTouchOnly(): Record<string, string> {
  const out: Record<string, string> = {};
  captureTouch();
  const stored = typeof window === "undefined" ? null : visit;

  if (!stored) return out;
  Object.entries(stored.first_touch).forEach(([key, value]) => {
    if (value) out[`first_touch_${key}`] = value;
  });
  return out;
}

/**
 * Construit un lien /rendez-vous attribué : porte la source du contenu + les
 * derniers UTM connus, pour qu'une prise de RDV soit rattachable au contenu qui
 * l'a générée. Client-only (getAttribution dégrade en SSR). Défaut lang = fr.
 */
export function buildRdvHref(source: string, lang: string = "fr"): string {
  const utms = getAttribution();
  const params = new URLSearchParams({ source });
  (["utm_source", "utm_medium", "utm_campaign"] as const).forEach((k) => {
    if (utms[k]) params.set(k, utms[k]);
  });
  return `/${lang}/rendez-vous?${params.toString()}`;
}

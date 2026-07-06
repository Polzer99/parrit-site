/**
 * Attribution tracking : capture UTMs + referrer + landing page au 1er touch
 * et au last touch, persiste 90 jours en localStorage. Survit aux navigations
 * cross-page sur parrit.ai.
 *
 * Usage :
 *   captureTouch()            // appelée 1× par page load (layout client)
 *   getAttribution()          // retourne props plates à spread dans events
 */

const STORAGE_KEY = "parrit_attribution_v1";
const WINDOW_DAYS = 90;
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

function readStored(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    const ageMs = Date.now() - new Date(parsed.first_touch.timestamp).getTime();
    if (ageMs > WINDOW_DAYS * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(a: Attribution) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    /* localStorage indisponible, on dégrade silencieux */
  }
}

function hasAttributionSignal(t: TouchData): boolean {
  return UTM_KEYS.some((k) => t[k]) || Boolean(t.referrer);
}

/**
 * Appelée 1× par page load. Pose first_touch si vide ou > 90j. Met à jour
 * last_touch dès qu'un signal d'attribution arrive (UTMs OU referrer externe).
 */
export function captureTouch(): void {
  if (typeof window === "undefined") return;
  const now = buildTouch();
  const stored = readStored();

  if (!stored) {
    writeStored({ first_touch: now, last_touch: now });
    return;
  }

  if (hasAttributionSignal(now)) {
    writeStored({ first_touch: stored.first_touch, last_touch: now });
  }
}

/**
 * Retourne les props plates à spread dans les events PostHog / payloads webhook.
 * Préfixe first_touch_ et last_touch_. Ajoute aussi les UTMs courantes (URL en
 * cours) sous leur nom natif pour compat avec dashboards existants.
 */
export function getAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  const stored = readStored();
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

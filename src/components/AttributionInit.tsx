"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureTouch, getAttribution, getFirstTouchOnly } from "@/lib/attribution";

type PostHogAttribution = {
  register: (properties: Record<string, string>) => void;
  setPersonProperties: (
    properties: Record<string, string>,
    propertiesSetOnce: Record<string, string>,
  ) => void;
};

/**
 * Pose le first_touch / met à jour le last_touch en localStorage à chaque
 * page load. Doit être monté 1× dans le layout pour couvrir toutes les routes.
 * Aucun rendu visuel.
 */
export default function AttributionInit() {
  const pathname = usePathname();

  useEffect(() => {
    captureTouch();
    const posthog = (
      window as unknown as { posthog?: PostHogAttribution }
    ).posthog;
    posthog?.register(getAttribution());
    posthog?.setPersonProperties({}, getFirstTouchOnly());
  }, [pathname]);
  return null;
}

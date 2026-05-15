"use client";

import { useEffect } from "react";
import { captureTouch } from "@/lib/attribution";

/**
 * Pose le first_touch / met à jour le last_touch en localStorage à chaque
 * page load. Doit être monté 1× dans le layout pour couvrir toutes les routes.
 * Aucun rendu visuel.
 */
export default function AttributionInit() {
  useEffect(() => {
    captureTouch();
  }, []);
  return null;
}

"use client";

import { useEffect } from "react";

import { captureTouch } from "@/lib/attribution";

/* Attribution de la visite en mémoire uniquement ; aucune mesure d’audience. */
export function AnalyticsInit() {
  useEffect(() => {
    captureTouch();
  }, []);

  return null;
}

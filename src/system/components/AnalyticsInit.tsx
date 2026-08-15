"use client";

import { useEffect } from "react";

import { captureTouch } from "@/lib/attribution";

/* Capture le premier/dernier touch (utm, referrer) dès l'arrivée — le snippet
   PostHog, lui, est injecté côté layout (autocapture, heatmaps, web vitals). */
export function AnalyticsInit() {
  useEffect(() => {
    captureTouch();
  }, []);

  return null;
}

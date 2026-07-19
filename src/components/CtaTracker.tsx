"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function CtaTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent): void {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-ph="cta"], [data-ph="booking"]');
      if (!target) return;

      const destination =
        target.dataset.phDest ??
        (target instanceof HTMLAnchorElement ? target.href : "");
      const properties = {
        label: target.dataset.phLabel ?? target.textContent?.trim() ?? "",
        destination,
        placement: target.dataset.phPlacement ?? "",
      };

      track(target.dataset.ph === "booking" ? "booking_cta_click" : "cta_click", properties);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

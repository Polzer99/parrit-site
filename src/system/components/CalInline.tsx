"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef, useState } from "react";

import { CAL_LINK_COMMISSION, isPlaceholder } from "../../../site.config";
import type { Locale } from "@/system/locale";

type ParritCalInlineProps = {
  calLink?: string;
  preview?: boolean;
  locale?: Locale;
};

export function ParritCalInline({
  calLink = CAL_LINK_COMMISSION,
  preview = false,
  locale = "en",
}: ParritCalInlineProps) {
  const copy = locale === "fr" ? {
    title: "PARRIT / COMMANDE",
    ready: "CHOISISSEZ UN CRÉNEAU",
    loading: "CHARGEMENT DES CRÉNEAUX…",
    retrieving: "OUVERTURE DU CALENDRIER · QUELQUES SECONDES",
    format: "30 MIN · VISIO",
    status: "UNE COMMANDE, PAS UN ABONNEMENT",
  } : {
    title: "PARRIT / COMMISSION",
    ready: "SELECT A TIME",
    loading: "LOADING AVAILABLE TIMES…",
    retrieving: "RETRIEVING THE CALENDAR · A FEW SECONDS",
    format: "30 MIN · VIDEO",
    status: "COMMISSIONED, NOT SUBSCRIBED",
  };
  const placeholder = isPlaceholder(calLink);
  /* lazy + état de chargement : l'embed (~1,7 MB) ne se monte qu'à l'approche du
     viewport, et un état visible couvre les secondes où l'iframe est encore noire */
  const stageRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (preview || placeholder) return;
    const node = stageRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      let cancelled = false;
      queueMicrotask(() => {
        if (!cancelled) setMount(true);
      });
      return () => {
        cancelled = true;
      };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [placeholder, preview]);

  useEffect(() => {
    if (preview || placeholder || !mount) return;

    async function configureCalendar() {
      const cal = await getCalApi({ namespace: "commission" });
      cal("on", { action: "linkReady", callback: () => setReady(true) });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: { branding: { brandColor: "#E10600" } },
        cssVarsPerTheme: {
          dark: {
            "cal-brand": "#E10600",
            "cal-bg": "#131518",
            "cal-bg-emphasis": "#1A1D21",
            "cal-border": "#24282D",
          },
          light: { "cal-brand": "#E10600" },
        },
      });
    }

    void configureCalendar();
  }, [placeholder, preview, mount]);

  if (placeholder) {
    return (
      <div className="launch-placeholder" role="status">
        <strong>[TO FILL]</strong>
        <span>Coaching calendar link must be configured before launch.</span>
      </div>
    );
  }

  return (
    <div className="cal-stage" ref={stageRef}>
      <div className="cal-instrument">
        <div className="cal-bar">
          <span>{copy.title}</span>
          <span>{ready ? copy.ready : copy.loading}</span>
        </div>
        {preview ? (
          <div className="cal-preview">CAL.COM INLINE INSTRUMENT</div>
        ) : (
          <div className="cal-embed-stage" data-ready={ready || undefined}>
            {!ready ? (
              <div className="cal-loading" role="status" aria-live="polite">
                <span className="k">{copy.retrieving}</span>
              </div>
            ) : null}
            {mount ? (
              <Cal
                namespace="commission"
                calLink={calLink}
                className="cal-embed"
                config={{ layout: "month_view", theme: "dark" }}
              />
            ) : null}
          </div>
        )}
        <div className="cal-bar cal-bar-footer">
          <span>{copy.format}</span>
          <span className="cal-status">
            <i aria-hidden="true" />
            {copy.status}
          </span>
        </div>
      </div>
    </div>
  );
}

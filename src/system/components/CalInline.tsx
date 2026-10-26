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
    ready: "Choisissez un créneau",
    loading: "Chargement des créneaux…",
    retrieving: "Ouverture du calendrier · Quelques secondes",
    format: "VISIO",
  } : {
    title: "PARRIT / COMMISSION",
    ready: "Select a time",
    loading: "Loading available times…",
    retrieving: "Retrieving the calendar · A few seconds",
    format: "VIDEO",
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
      // The cross-origin iframe cannot inherit the parent CSS variables.
      // Resolve the canonical vars before passing colors through the embed API.
      const styles = getComputedStyle(stageRef.current ?? document.documentElement);
      const tokenValue = (variable: string) => styles.getPropertyValue(variable.slice(4, -1)).trim();
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: { align: "left", branding: { brandColor: tokenValue("var(--accent-on-dark)") } },
        cssVarsPerTheme: {
          dark: {
            "cal-brand": tokenValue("var(--accent-on-dark)"),
            "cal-bg": tokenValue("var(--ink)"),
            "cal-bg-emphasis": tokenValue("var(--ink)"),
            "cal-bg-subtle": tokenValue("var(--ink)"),
            "cal-bg-muted": tokenValue("var(--ink)"),
            "cal-text": tokenValue("var(--paper)"),
            "cal-text-emphasis": tokenValue("var(--paper)"),
            "cal-text-subtle": tokenValue("var(--g4-d)"),
            "cal-text-muted": tokenValue("var(--g4-d)"),
            "cal-border": tokenValue("var(--rule-d)"),
          },
          light: { "cal-brand": tokenValue("var(--accent-strong)") },
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
                <span>{copy.retrieving}</span>
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
        </div>
      </div>
    </div>
  );
}

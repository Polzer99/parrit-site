"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

import { CAL_LINK_COMMISSION } from "../../../site.config";

type ParritCalInlineProps = {
  preview?: boolean;
};

export function ParritCalInline({ preview = false }: ParritCalInlineProps) {
  useEffect(() => {
    if (preview) return;

    async function configureCalendar() {
      const tokens = getComputedStyle(document.documentElement);
      const token = (name: string) => tokens.getPropertyValue(name).trim();
      const cal = await getCalApi({ namespace: "commission" });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: { branding: { brandColor: token("--red") } },
        cssVarsPerTheme: {
          dark: {
            "cal-brand": token("--red"),
            "cal-bg": token("--carbon"),
            "cal-bg-emphasis": token("--carbon2"),
            "cal-border": token("--rule-d"),
            "cal-text": token("--paper"),
            "cal-text-muted": token("--g2"),
          },
          light: { "cal-brand": token("--red") },
        },
      });
    }

    void configureCalendar();
  }, [preview]);

  return (
    <div className="cal-stage">
      <div className="cal-instrument">
        <div className="cal-bar">
          <span>PARRIT / COMMISSION</span>
          <span>SELECT A TIME</span>
        </div>
        {preview ? (
          <div className="cal-preview">CAL.COM INLINE INSTRUMENT</div>
        ) : (
          <Cal
            namespace="commission"
            calLink={CAL_LINK_COMMISSION}
            className="cal-embed"
            config={{ layout: "month_view", theme: "dark" }}
          />
        )}
        <div className="cal-bar cal-bar-footer">
          <span>45 MIN · VISIO</span>
          <span className="cal-status">
            <i aria-hidden="true" />
            COMMISSIONED, NOT SUBSCRIBED
          </span>
        </div>
      </div>
      <div className="cal-caption">THE FIRST STEP · AN EXAMINATION, NOT A SALES CALL.</div>
    </div>
  );
}

"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

import { CAL_LINK_COMMISSION, isPlaceholder } from "../../../site.config";

type ParritCalInlineProps = {
  calLink?: string;
  preview?: boolean;
};

export function ParritCalInline({
  calLink = CAL_LINK_COMMISSION,
  preview = false,
}: ParritCalInlineProps) {
  const placeholder = isPlaceholder(calLink);

  useEffect(() => {
    if (preview || placeholder) return;

    async function configureCalendar() {
      const cal = await getCalApi({ namespace: "commission" });
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
  }, [placeholder, preview]);

  if (placeholder) {
    return (
      <div className="launch-placeholder" role="status">
        <strong>[TO FILL]</strong>
        <span>Coaching calendar link must be configured before launch.</span>
      </div>
    );
  }

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
            calLink={calLink}
            className="cal-embed"
            config={{ layout: "month_view", theme: "dark" }}
          />
        )}
        <div className="cal-bar cal-bar-footer">
          <span>30 MIN · VIDEO</span>
          <span className="cal-status">
            <i aria-hidden="true" />
            COMMISSIONED, NOT SUBSCRIBED
          </span>
        </div>
      </div>
    </div>
  );
}

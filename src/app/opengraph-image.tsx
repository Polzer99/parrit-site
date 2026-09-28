import { token } from "@/system/token.server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Parrit.ai · Company Operating Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";



export default async function Image() {
  const [plexSans, plexMono] = await Promise.all([
    readFile(path.join(process.cwd(), "src/og-assets/GeneralSans-Medium.otf")),
    readFile(path.join(process.cwd(), "src/og-assets/ibm-plex-mono-latin-600-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: token("--carbon"),
          color: token("--paper"),
          fontFamily: "General Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "IBM Plex Mono",
            fontSize: 22,
            letterSpacing: "0.18em",
            color: token("--g4-d"),
          }}
        >
          <span>PARRIT.AI · COMPANY OPERATING SYSTEMS</span>
          <span style={{ display: "flex" }}>
            [P<span style={{ color: token("--accent-on-dark") }}>.</span>]
          </span>
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            maxWidth: 820,
          }}
        >
          Your company. One system.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "IBM Plex Mono",
            fontSize: 20,
            letterSpacing: "0.16em",
            color: token("--g4-d"),
          }}
        >
          <div style={{ width: 14, height: 14, background: token("--accent-on-dark") }} />
          <span>COMMISSIONED, NOT SUBSCRIBED · PARRIT / SITE · REV 01 · 2026</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "General Sans", data: plexSans, weight: 500, style: "normal" },
        { name: "IBM Plex Mono", data: plexMono, weight: 600, style: "normal" },
      ],
    },
  );
}

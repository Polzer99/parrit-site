import { token } from "@/system/token.server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Parrit.ai · Nous allons à la frontière du possible, puis nous le livrons à nos clients.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image() {
  const [generalRegular, generalSemibold, plexMono] = await Promise.all([
    readFile(path.join(process.cwd(), "src/og-assets/GeneralSans-Regular.otf")),
    readFile(path.join(process.cwd(), "src/og-assets/GeneralSans-Semibold.otf")),
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
          background: token("--accent-strong"),
          color: token("--paper2"),
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
            color: token("--brand-derived-on-canard-2"),
          }}
        >
          <span>PARRIT.AI · AGENTS ET LOGICIELS D&apos;IA</span>
          <span style={{ display: "flex", color: token("--paper2") }}>
            [P<span style={{ color: token("--accent-on-dark") }}>.</span>]
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 58,
            fontWeight: 400,
            letterSpacing: "-0.035em",
            lineHeight: 1.2,
            width: "100%",
          }}
        >
          <span>Nous allons à la frontière du possible,</span>
          <span style={{ fontWeight: 600 }}>puis nous le livrons à nos clients.</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "IBM Plex Mono",
            fontSize: 20,
            letterSpacing: "0.16em",
            color: token("--brand-derived-on-canard-2"),
          }}
        >
          <span>APPRENDRE · AMÉLIORER · CONSTRUIRE</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "General Sans", data: generalRegular, weight: 400, style: "normal" },
        { name: "General Sans", data: generalSemibold, weight: 600, style: "normal" },
        { name: "IBM Plex Mono", data: plexMono, weight: 600, style: "normal" },
      ],
    },
  );
}

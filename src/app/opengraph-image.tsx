import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Parrit — Company Operating Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [geist, geistMono] = await Promise.all([
    fetch(new URL("../og-assets/Geist-Medium.ttf", import.meta.url)).then((r) =>
      r.arrayBuffer(),
    ),
    fetch(new URL("../og-assets/GeistMono-SemiBold.ttf", import.meta.url)).then((r) =>
      r.arrayBuffer(),
    ),
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
          background: "#131518",
          color: "#F1F2F3",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: "0.18em",
            color: "#6F757B",
          }}
        >
          <span>PARRIT — COMPANY OPERATING SYSTEMS</span>
          <span style={{ display: "flex" }}>
            [P<span style={{ color: "#E10600" }}>.</span>]
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
            fontFamily: "Geist Mono",
            fontSize: 20,
            letterSpacing: "0.16em",
            color: "#9CA1A6",
          }}
        >
          <div style={{ width: 14, height: 14, background: "#E10600" }} />
          <span>COMMISSIONED, NOT SUBSCRIBED · PARRIT / SITE · REV 01 · 2026</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist, weight: 500, style: "normal" },
        { name: "Geist Mono", data: geistMono, weight: 600, style: "normal" },
      ],
    },
  );
}

"use client";

import Image from "next/image";

/* ─── Logo resolver ─────────────────────────────────────────
   Maps raw tool name strings (as written in dictionaries) to
   a simpleicons SVG slug under /public/logos/. Unknown tools
   fall back to a stylized pill with first letter. */
function resolveLogo(rawName: string): { slug: string | null; label: string } {
  const lower = rawName.toLowerCase();
  if (lower.includes("claude")) return { slug: "claude", label: rawName };
  if (lower.includes("gemini") || lower.includes("vertex"))
    return { slug: "googlegemini", label: rawName };
  if (lower.includes("n8n")) return { slug: "n8n", label: rawName };
  if (lower.includes("brevo")) return { slug: "brevo", label: rawName };
  if (lower.includes("whatsapp")) return { slug: "whatsapp", label: rawName };
  if (lower.includes("supabase")) return { slug: "supabase", label: rawName };
  if (lower.includes("vercel")) return { slug: "vercel", label: rawName };
  if (lower.includes("github")) return { slug: "githubactions", label: rawName };
  if (lower.includes("sheets") || lower.includes("workspace"))
    return { slug: "googlesheets", label: rawName };
  if (lower.includes("youtube") || lower.includes("rss"))
    return { slug: "youtube", label: rawName };
  if (lower.includes("telegram")) return { slug: "telegram", label: rawName };
  if (lower.includes("looker")) return { slug: "looker", label: rawName };
  return { slug: null, label: rawName };
}

interface Props {
  items: string[];
}

export default function ToolLogos({ items }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 12,
      }}
    >
      {items.map((raw) => {
        const { slug, label } = resolveLogo(raw);
        return (
          <div
            key={raw}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.65)",
              minHeight: 56,
            }}
          >
            {slug ? (
              <Image
                src={`/logos/${slug}.svg`}
                alt={label}
                width={28}
                height={28}
                style={{ flexShrink: 0, objectFit: "contain" }}
              />
            ) : (
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(200,149,108,0.15)",
                  border: "1px solid rgba(200,149,108,0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c8956c",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-heading)",
                  flexShrink: 0,
                }}
              >
                {label[0]}
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.3,
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

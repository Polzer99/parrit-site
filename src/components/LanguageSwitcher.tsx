"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Locale = "fr" | "en" | "pt-BR";

const LOCALES: { code: Locale; short: string; label: string; flag: string }[] = [
  { code: "fr", short: "FR", label: "Français", flag: "🇫🇷" },
  { code: "en", short: "EN", label: "English", flag: "🇺🇸" },
  { code: "pt-BR", short: "PT", label: "Português (BR)", flag: "🇧🇷" },
];

function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(fr|en|pt-BR)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] || "/";
}

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(locale: Locale) {
    setOpen(false);
    const rest = stripLocale(pathname);
    const target = `/${locale}${rest === "/" ? "" : rest}`;
    router.push(target);
  }

  const current = LOCALES.find((l) => l.code === currentLang) ?? LOCALES[0];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text, #1a1a1a)",
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 8,
          cursor: "pointer",
          letterSpacing: "0.02em",
          backdropFilter: "blur(6px)",
        }}
      >
        <span aria-hidden>{current.flag}</span>
        <span>{current.short}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          <path
            d="M2 4l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            listStyle: "none",
            margin: 0,
            padding: 4,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: 170,
            zIndex: 50,
          }}
        >
          {LOCALES.map((l) => {
            const isCurrent = l.code === currentLang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => !isCurrent && switchTo(l.code)}
                  role="option"
                  aria-selected={isCurrent}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    border: "none",
                    background: isCurrent ? "rgba(200,149,108,0.12)" : "transparent",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    textAlign: "left",
                    color: "var(--text, #1a1a1a)",
                    cursor: isCurrent ? "default" : "pointer",
                    borderRadius: 6,
                  }}
                >
                  <span aria-hidden>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

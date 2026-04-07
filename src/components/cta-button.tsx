"use client";

import { ArrowRight } from "lucide-react";
import { WA_LINK } from "./data";

export function CTAButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 px-10 h-14 text-lg font-medium rounded-full transition-colors ${className}`}
      style={{ backgroundColor: "var(--accent)", color: "#09090b" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--accent-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--accent)")
      }
    >
      Discuter avec Paul
      <ArrowRight className="w-5 h-5" />
    </a>
  );
}

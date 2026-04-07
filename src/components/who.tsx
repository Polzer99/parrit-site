"use client";

import { LinkedInIcon } from "./icons";
import { useScrollFade } from "./hooks";
import { team } from "./data";

export function Who() {
  const fadeRef = useScrollFade();

  return (
    <section className="py-12 px-6">
      <div
        className="fade-in max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left"
        ref={fadeRef}
      >
        <p className="text-sm text-text-muted font-light">{team.line}</p>
        <span className="flex items-center gap-2">
          <a
            href={team.paul}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text transition-colors"
            aria-label="LinkedIn Paul"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
          <a
            href={team.yukun}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text transition-colors"
            aria-label="LinkedIn Yukun"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
        </span>
      </div>
    </section>
  );
}

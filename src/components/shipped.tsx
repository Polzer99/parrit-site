"use client";

import { ArrowRight } from "lucide-react";
import { useScrollFade } from "./hooks";
import { shipped } from "./data";

function ShippedRow({
  item,
  isLast,
  fadeRef,
}: {
  item: (typeof shipped)[number];
  isLast: boolean;
  fadeRef: (node: HTMLElement | null) => void;
}) {
  const isLink = !!item.link;
  const Tag = isLink ? "a" : "div";
  const linkProps = isLink
    ? { href: item.link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className="fade-in shipped-row flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-5 px-4 -mx-4 rounded-lg"
      ref={fadeRef}
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        cursor: isLink ? "pointer" : "default",
      }}
    >
      <span
        className="text-xs font-medium tracking-wider uppercase shrink-0 w-28"
        style={{ color: "var(--accent)" }}
      >
        {item.badge}
      </span>
      <span className="flex-1 text-text text-base font-light">
        {item.description}
      </span>
      <span className="flex items-center gap-2 text-sm text-text-muted shrink-0">
        {item.status}
        {isLink && <ArrowRight className="w-4 h-4 opacity-50" />}
      </span>
    </Tag>
  );
}

export function Shipped() {
  const fadeRef = useScrollFade();

  return (
    <section className="py-28 sm:py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <h2
          className="fade-in text-4xl sm:text-5xl font-semibold mb-16"
          ref={fadeRef}
          style={{ letterSpacing: "-0.03em" }}
        >
          Exp&eacute;di&eacute; en production
        </h2>
        <div className="flex flex-col">
          {shipped.map((item, i) => (
            <ShippedRow
              key={i}
              item={item}
              isLast={i === shipped.length - 1}
              fadeRef={fadeRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

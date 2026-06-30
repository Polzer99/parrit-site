"use client";

import { useEffect, useRef } from "react";

// Révélation à la descente, robuste : visible par défaut (SSR / sans JS / navigateur
// sans IntersectionObserver). On arme l'effet UNIQUEMENT côté client via le DOM,
// donc le contenu n'est JAMAIS masqué à tort (fix Safari vs animation-timeline).
export default function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.classList.add("armed");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [className, "ch-reveal"].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Révélation au scroll. La durée n'est pas décidée ici : elle vient de
 * --dur-slow, donc du thème. Paul se révèle vite et sec, Parrit lentement.
 * C'est le même composant, la même règle, trois sensations.
 *
 * prefers-reduced-motion est traité dans lab.css, pas ici : la règle CSS gagne
 * même si le JS ne s'exécute pas.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  /*
   * L'état de révélation est un ÉTAT REACT, pas une classe posée à la main.
   *
   * La première version faisait el.classList.add("is-in") depuis l'observer.
   * Ça marche jusqu'au premier re-render : React réapplique className="lab-reveal"
   * et efface la classe, donc des sections entières repassaient à opacity 0 sans
   * jamais revenir. Mesuré le 12/08 sur /brand-lab/parrit, sections Proof et
   * Expansion, invisibles à l'écran.
   *
   * Règle : ne jamais écrire en impératif dans un attribut que React possède.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    // Navigateur sans IntersectionObserver : on montre tout, sans jamais rien
    // cacher. Le passage à l'état visible est planifié sur la frame suivante et
    // non appelé dans le corps de l'effet, qui déclencherait un rendu en
    // cascade (react-hooks/set-state-in-effect).
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setSeen(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`lab-reveal${seen ? " is-in" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

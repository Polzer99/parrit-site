"use client";

import { useMemo, useState } from "react";
import LaunchCard from "@/components/LaunchCard";
import type { Launch, LaunchCategory } from "@/lib/launches";

type LaunchesLibraryProps = {
  launches: Launch[];
  categories: LaunchCategory[];
  lang: string;
};

export default function LaunchesLibrary({
  launches,
  categories,
  lang,
}: LaunchesLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<LaunchCategory | "Tous">(
    "Tous",
  );

  const visibleLaunches = useMemo(() => {
    if (activeCategory === "Tous") return launches;
    return launches.filter((launch) => launch.category === activeCategory);
  }, [activeCategory, launches]);

  return (
    <>
      <div className="launch-filters" aria-label="Filtres par categorie">
        <button
          className="launch-filter"
          data-active={activeCategory === "Tous"}
          onClick={() => setActiveCategory("Tous")}
          type="button"
        >
          Tous
        </button>
        {categories.map((category) => (
          <button
            className="launch-filter"
            data-active={activeCategory === category}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="launch-grid">
        {visibleLaunches.map((launch) => (
          <LaunchCard
            href={`/${lang}/launches/${launch.slug}`}
            key={launch.slug}
            launch={launch}
          />
        ))}
      </div>
    </>
  );
}

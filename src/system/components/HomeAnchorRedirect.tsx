"use client";
import { useEffect } from "react";
import type { Locale } from "@/system/locale";
import { localizedHomeHash } from "@/system/home-anchors";

/** Fragments never reach the server. SSR aliases also work without JavaScript. */
export function HomeAnchorRedirect({ locale }: { locale: Locale }) {
  useEffect(() => {
    const redirect = () => {
      if (!["#ce-qui-change", "#what-changes"].includes(window.location.hash)) return;
      const hash = localizedHomeHash(window.location.hash, locale);
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${hash}`);
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start", behavior: "instant" });
      window.dispatchEvent(new PopStateEvent("popstate"));
    };
    redirect();
    window.addEventListener("hashchange", redirect);
    window.addEventListener("popstate", redirect);
    return () => {
      window.removeEventListener("hashchange", redirect);
      window.removeEventListener("popstate", redirect);
    };
  }, [locale]);
  return null;
}

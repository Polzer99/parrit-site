"use client";
import { useEffect } from "react";
import { observeMotion } from "./RevealOnView";
/** Preserve the existing phone/panel sequences, starting only at section entry. */
export function ConversationMotion() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".single-page .live, .single-page #ce-qui-change, .single-page #what-changes");
    const cleanups = Array.from(sections, section => observeMotion(section, element => {
      element.dataset.motion = "ready";
      return () => { delete element.dataset.motion; };
    }));
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);
  return null;
}

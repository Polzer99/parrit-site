"use client";
import { useEffect } from "react";
/** Progressive enhancement: static, complete conversations are the SSR default. */
export function ConversationMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".single-page");
    if (page) page.dataset.motion = "ready";
    return () => { if (page) delete page.dataset.motion; };
  }, []);
  return null;
}

"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export default function BookingTracker({ src, title }: { src: string; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    track("booking_started", { trigger: "page_mount" });

    const iframe = iframeRef.current;
    if (!iframe) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        track("booking_started", { trigger: "iframe_visible" });
        observer.disconnect();
      },
      { threshold: 0.25 },
    );
    observer.observe(iframe);
    return () => observer.disconnect();
  }, []);

  return <iframe ref={iframeRef} src={src} title={title} loading="lazy" />;
}

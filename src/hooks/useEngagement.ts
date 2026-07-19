"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;
const TIME_BUCKETS = [10, 30, 60, 120, 300] as const;

export function useEngagement(): void {
  const pathname = usePathname();

  useEffect(() => {
    const reachedScroll = new Set<number>();
    const reachedTime = new Set<number>();
    let activeSeconds = 0;
    let scrollFrame: number | null = null;

    function captureScroll(): void {
      scrollFrame = null;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const threshold of SCROLL_THRESHOLDS) {
        if (depth >= threshold && !reachedScroll.has(threshold)) {
          reachedScroll.add(threshold);
          track("scroll_depth", { depth: threshold });
        }
      }
    }

    function handleScroll(): void {
      if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(captureScroll);
    }

    function captureTimeBuckets(): void {
      for (const bucket of TIME_BUCKETS) {
        if (activeSeconds >= bucket && !reachedTime.has(bucket)) {
          reachedTime.add(bucket);
          track("time_on_page", { active_seconds: activeSeconds, bucket: `${bucket}s` });
        }
      }
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        activeSeconds += 1;
        captureTimeBuckets();
      }
    }, 1000);

    function handleVisibilityChange(): void {
      captureTimeBuckets();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", captureTimeBuckets);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    captureScroll();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", captureTimeBuckets);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    };
  }, [pathname]);
}

export default function EngagementTracker() {
  useEngagement();
  return null;
}

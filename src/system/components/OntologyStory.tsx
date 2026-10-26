"use client";

import { useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: no-preference)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getSnapshot = () => window.matchMedia(motionQuery).matches;
const getServerSnapshot = () => false;

/** SSR and reduced motion show the final result, with no running story animations. */
export function OntologyStory({ input, result, output }: { input: string; result: string; output: string }) {
  const motion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reveal = motion ? <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.76;.8;.96;1" dur="9s" repeatCount="indefinite"/> : null;

  return <g className="story">
    <text x="1010" y="122" className="lab" textAnchor="middle">{result}</text>
    <path id="onto-story-path" d="M190 40 L310 130 L260 220 L520 220 L1010 130" className="edge ghost"/>
    {motion && <rect width="12" height="12" x="-6" y="-6" className="token">
      <animateMotion dur="9s" repeatCount="indefinite" keyPoints="0;0;.18;.36;.62;1;1" keyTimes="0;.05;.25;.42;.6;.78;1" calcMode="linear"><mpath href="#onto-story-path"/></animateMotion>
      <animate attributeName="opacity" values="0;1;1;1;1;0;0" keyTimes="0;.05;.25;.42;.6;.78;1" dur="9s" repeatCount="indefinite"/>
    </rect>}
    <g transform="translate(1010 165)">
      <rect x="-70" y="-18" width="140" height="36" className="gold">{reveal}</rect>
      <text y="6" textAnchor="middle" className="goldt">{reveal}{output}</text>
    </g>
    {motion && <text x="190" y="18" textAnchor="middle" className="nt in">{input}
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.04;.2;.26;1" dur="9s" repeatCount="indefinite"/>
    </text>}
  </g>;
}

"use client";

import { useRef } from "react";
import { useMotionOnView } from "./RevealOnView";

const sequence: readonly (readonly [number, number, number, string])[] = [
  [40, 180, 1800, ""], [180, 180, 2600, "s1"], [180, 540, 2600, "s1 withbot"],
  [540, 540, 2600, "s2 withbot"], [540, 900, 2600, "s2 withbot"], [900, 900, 3200, "s3 withbot"],
];
function startWalker(element: HTMLElement) {
  const svg = element.querySelector<SVGSVGElement>("svg")!;
  const human = svg.querySelector<SVGGElement>(".human")!;
  const bot = svg.querySelector<SVGGElement>(".bot")!;
  let frame = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let index = 0;
  const place = (x: number) => {
    human.setAttribute("transform", `translate(${x} 120)`);
    bot.setAttribute("transform", `translate(${x - 44} 120)`);
  };
  const go = () => {
    const [from, to, duration, classes] = sequence[index];
    svg.setAttribute("class", `walk playing ${classes}${from !== to ? " walking" : ""}`);
    const began = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - began) / duration);
      place(from + (to - from) * progress);
      if (progress < 1) frame = requestAnimationFrame(step);
      else { index = (index + 1) % sequence.length; timer = setTimeout(go, index === 0 ? 800 : 0); }
    };
    frame = requestAnimationFrame(step);
  };
  go();
  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    svg.setAttribute("class", "walk s1 s2 s3 withbot");
    place(900);
  };
}
export function PathWalker() {
  const ref = useRef<HTMLDivElement>(null);
  useMotionOnView(ref, startWalker);
  return <div ref={ref} className="path-walker">
    <svg className="walk s1 s2 s3 withbot" viewBox="0 0 1080 130" aria-hidden="true">
      <line x1="0" y1="120" x2="1080" y2="120" className="ground"/>
      <g transform="translate(214 44)" className="prop p1">
        <rect width="26" height="34" className="pg"/><rect x="30" width="26" height="34" className="pg"/>
        {[8, 16, 24].map(y => <g key={y}><line x1="4" y1={y} x2="22" y2={y} className="txt"/><line x1="34" y1={y} x2="52" y2={y} className="txt"/></g>)}
      </g>
      <g transform="translate(574 38)" className="prop p2">{[[0, 26], [16, 18], [32, 10], [48, 0]].map(([x, y], i) => <rect key={i} x={x} y={y} width="11" height={40 - y} className={`bar b${i}`}/>)}</g>
      <g transform="translate(934 36)" className="prop p3">{[[0, 30], [26, 30], [52, 30], [13, 10], [39, 10]].map(([x, y], i) => <rect key={i} x={x} y={y} width="22" height="18" className={`blk k${i}`}/>)}</g>
      <g className="human" transform="translate(900 120)"><rect x="-7" y="-58" width="14" height="14" className="hu"/><rect x="-10" y="-42" width="20" height="24" className="hu"/><rect x="-8" y="-18" width="6" height="18" className="hu leg l1"/><rect x="2" y="-18" width="6" height="18" className="hu leg l2"/></g>
      <g className="bot" transform="translate(856 120)"><rect x="-12" y="-24" width="24" height="24" className="ag2"/><rect x="-7" y="-17" width="4" height="5" className="eye2"/><rect x="3" y="-17" width="4" height="5" className="eye2"/></g>
    </svg>
  </div>;
}

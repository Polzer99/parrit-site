import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   PARRIT / COMMAND SYSTEM — REV 02 · système retenu (v1 rouge)
   Registres : Document (blanc froid) · Instrument (ink/carbon)
   Signal : Parrit Red #E10600
   Signatures : ligne de registre · Parrit Frame · Hold-to-Commit
   Tokens = variables sources pour la production (Claude Code / Codex)
   ══════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');

:root {
  /* ── PC-01/02 · color tokens ── */
  --ink:     #0A0B0C;
  --carbon:  #131518;
  --carbon2: #1A1D21;
  --paper:   #F1F2F3;
  --paper2:  #FAFAFB;
  --rule-l:  #DDE0E3;
  --rule-d:  #24282D;
  --g2:      #9CA1A6;
  --g3:      #55595E;
  --g4:      #6F757B;
  --red:     #E10600;
  --red-p:   #B80500;

  /* ── PC-03 · type tokens (Geist = transition, cible Söhne) ── */
  --ui:   "Geist", "Helvetica Neue", Arial, sans-serif;
  --mono: "Geist Mono", "IBM Plex Mono", Menlo, monospace;

  /* ── PC-04 · space (8pt) ── */
  --s1: 8px; --s2: 16px; --s3: 24px; --s4: 32px; --s6: 48px; --s8: 64px;

  /* ── PC-09 · motion ── */
  --ease: cubic-bezier(.2, 0, 0, 1);
  --micro: 120ms; --move: 240ms; --seq: 400ms; --hold: 600ms;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
.pr { font-family: var(--ui); background: var(--ink); color: var(--paper); min-height: 100vh; -webkit-font-smoothing: antialiased; }

/* PC-05 · registry text */
.k { font-family: var(--mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--g4); font-weight: 500; }
.k b { color: var(--paper); font-weight: 600; }
.light .k { color: var(--g3); }
.light .k b { color: var(--ink); }

/* ── bars ── */
.bar { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 22px; padding: 0 20px; height: 50px; background: rgba(10,11,12,.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--rule-d); }
.mark { font-family: var(--mono); font-weight: 600; font-size: 13px; letter-spacing: .22em; }
.mark i { font-style: normal; color: var(--red); }
.nav { position: sticky; top: 50px; z-index: 39; display: flex; overflow-x: auto; background: var(--ink); border-bottom: 1px solid var(--rule-d); scrollbar-width: none; }
.nav::-webkit-scrollbar { display: none; }
.nav button { appearance: none; border: 0; background: none; cursor: pointer; font-family: var(--mono); font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: var(--g4); padding: 13px 16px; white-space: nowrap; position: relative; transition: color var(--micro) var(--ease); }
.nav button:hover, .nav button[data-on="true"] { color: var(--paper); }
.nav button[data-on="true"]::after { content: ""; position: absolute; left: 16px; right: 16px; bottom: -1px; height: 2px; background: var(--red); }
.nav button:focus-visible { outline: 2px solid var(--red); outline-offset: -3px; }

.view { animation: vin var(--seq) var(--ease) both; }
@keyframes vin { from { opacity: 0; } to { opacity: 1; } }
.wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.light { background: var(--paper); color: var(--ink); }
.rule { height: 1px; background: var(--rule-d); }
.light .rule { background: var(--rule-l); }

/* ══ PC-07 · THE PARRIT FRAME ══ */
.frame { position: relative; }
.frame::before, .frame::after, .frame > .fx::before, .frame > .fx::after {
  content: ""; position: absolute; width: 14px; height: 14px; border: 0 solid var(--red);
  transition: opacity var(--move) var(--ease), transform var(--move) var(--ease);
}
.frame::before { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px; }
.frame::after { top: -1px; right: -1px; border-top-width: 2px; border-right-width: 2px; }
.frame > .fx::before { bottom: -1px; left: -1px; border-bottom-width: 2px; border-left-width: 2px; }
.frame > .fx::after { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px; }
/* frame closing on commit */
.frame.closed::before { transform: translate(6px, 6px); opacity: 0; }
.frame.closed::after { transform: translate(-6px, 6px); opacity: 0; }
.frame.closed > .fx::before { transform: translate(6px, -6px); opacity: 0; }
.frame.closed > .fx::after { transform: translate(-6px, -6px); opacity: 0; }

/* PC-06 · status: shape + colour */
.st { display: inline-flex; align-items: center; gap: 7px; font-family: var(--mono); font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; }
.st::before { content: ""; display: inline-block; }
.st.ok::before { width: 7px; height: 7px; border-radius: 50%; background: var(--g2); }
.st.att::before { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 8px solid currentColor; }
.st.crit { color: var(--red); }
.st.crit::before { width: 8px; height: 8px; background: var(--red); }
.st.done::before { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

/* ══ PC-07 · HOLD TO COMMIT ══ */
.hold { position: relative; overflow: hidden; appearance: none; cursor: pointer; border: 1.5px solid var(--paper); background: transparent; color: var(--paper); font-family: var(--mono); font-size: 9.5px; letter-spacing: .15em; text-transform: uppercase; font-weight: 600; padding: 12px 18px; user-select: none; -webkit-user-select: none; touch-action: none; }
.light .hold { border-color: var(--ink); color: var(--ink); background: var(--paper2); }
.hold .fill { position: absolute; inset: 0; width: 0%; background: var(--red); }
.hold .lab { position: relative; z-index: 1; }
.hold[data-armed="true"] .lab { color: #fff; }
.hold[data-done="true"] { border-color: var(--rule-d); color: var(--g2); cursor: default; }
.light .hold[data-done="true"] { border-color: var(--rule-l); color: var(--g3); }
.hold[data-done="true"] .fill { display: none; }
.hold:focus-visible { outline: 2px solid var(--red); outline-offset: 2px; }
.ghost { appearance: none; cursor: pointer; border: 1px solid var(--rule-d); background: none; color: var(--g2); font-family: var(--mono); font-size: 9.5px; letter-spacing: .15em; text-transform: uppercase; padding: 12px 18px; }
.light .ghost { border-color: var(--rule-l); color: var(--g3); }

/* ── sections ── */
.sec { padding: 56px 0; border-top: 1px solid var(--rule-l); }
.sechead { display: flex; justify-content: space-between; align-items: baseline; gap: 14px; flex-wrap: wrap; margin-bottom: 28px; }
.sechead h2 { font-size: 22px; font-weight: 600; letter-spacing: -.015em; }

/* ── VIEW 01 boot ── */
.bootlog { padding: 34px 0 0; font-family: var(--mono); font-size: 11px; letter-spacing: .1em; color: var(--g4); min-height: 128px; }
.bootlog div { opacity: 0; transform: translateY(3px); }
.bootlog div.on { animation: bl var(--seq) var(--ease) forwards; }
@keyframes bl { to { opacity: 1; transform: none; } }
.bootlog .okl { color: var(--g2); } .bootlog .rl { color: var(--red); }
.boothero { padding: 6vh 0 60px; }
.boothero h1 { font-weight: 500; letter-spacing: -.03em; line-height: 1.0; font-size: clamp(42px, 7.2vw, 96px); max-width: 14ch; opacity: 0; }
.boothero h1.on { animation: bl .6s .1s var(--ease) forwards; }
.bootfoot { display: flex; justify-content: space-between; gap: 16px; padding: 24px 0 40px; border-top: 1px solid var(--rule-d); flex-wrap: wrap; opacity: 0; }
.bootfoot.on { animation: bl .5s .3s var(--ease) forwards; }
.bootfoot p { font-size: 14px; color: var(--g2); max-width: 36ch; line-height: 1.6; }

/* ── VIEW 02 system ── */
.chips { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1px; background: var(--rule-l); border: 1px solid var(--rule-l); }
.chip { background: var(--paper2); }
.chip .c { height: 66px; }
.chip .m { padding: 10px 12px 13px; }
.chip .m b { display: block; font-size: 12px; font-weight: 600; }
.chip .m small { display: block; font-size: 11px; color: var(--g3); margin-top: 4px; line-height: 1.45; }
.spec { display: grid; grid-template-columns: 170px 1fr; border-top: 1px solid var(--rule-l); }
.spec dt { padding: 13px 12px 13px 0; }
.spec dd { padding: 12px 0; font-size: 13.5px; line-height: 1.65; color: #26282B; }
.spec dd b { font-weight: 600; color: var(--ink); }
@media (max-width: 680px) { .spec { grid-template-columns: 1fr; } .spec dd { padding-top: 4px; } }
.doctrine { border: 1.5px solid var(--ink); background: var(--paper2); }
.doc-h { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 16px 22px; border-bottom: 1.5px solid var(--ink); }
.doc-r { display: grid; grid-template-columns: 84px 158px 1fr; border-top: 1px solid var(--rule-l); }
.doc-r:first-of-type { border-top: 0; }
.doc-r > div { padding: 15px 22px; }
.doc-r .cl { border-right: 1px solid var(--rule-l); }
.doc-r .nm { font-weight: 600; font-size: 14px; border-right: 1px solid var(--rule-l); }
.doc-r .df { font-size: 13px; line-height: 1.55; color: #26282B; }
.doc-f { display: flex; align-items: center; gap: 10px; padding: 15px 22px; border-top: 1.5px solid var(--ink); }
.sq { display: inline-block; width: 9px; height: 9px; background: var(--red); }
@media (max-width: 680px) { .doc-r { grid-template-columns: 1fr; } .doc-r .cl, .doc-r .nm { border-right: 0; padding-bottom: 0; } }

/* ── VIEW 03 home ── */
.hh { padding: 84px 0 52px; }
.hh h1 { font-size: clamp(38px, 6.6vw, 86px); font-weight: 500; letter-spacing: -.035em; line-height: 1.0; max-width: 13ch; }
.hh p { margin-top: 26px; font-size: 15.5px; line-height: 1.65; color: var(--g3); max-width: 44ch; }
.cta { margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap; }
.instr { background: var(--carbon); color: var(--paper); border: 1px solid var(--rule-d); max-width: 740px; margin: 0 auto; box-shadow: 0 40px 80px -40px rgba(10,11,12,.4); }
.ibar { display: flex; justify-content: space-between; gap: 10px; padding: 12px 17px; border-bottom: 1px solid var(--rule-d); }
.irow { display: flex; align-items: baseline; gap: 16px; padding: 16px 17px; border-bottom: 1px solid var(--rule-d); }
.irow:last-child { border-bottom: 0; }
.irow .n { font-family: var(--mono); font-size: 25px; font-weight: 500; min-width: 92px; letter-spacing: -.02em; }
.irow .l { font-size: 13.5px; color: #C7CBCF; }
.irow .z { margin-left: auto; }
.irow.crit .n { color: var(--red); }
.loop3 { display: grid; grid-template-columns: 1fr 1fr 1fr; border: 1px solid var(--rule-l); background: var(--paper2); }
.loop3 > div { padding: 26px 24px; border-left: 1px solid var(--rule-l); }
.loop3 > div:first-child { border-left: 0; }
.loop3 h3 { font-family: var(--mono); font-size: 11px; letter-spacing: .2em; margin-bottom: 12px; font-weight: 600; }
.loop3 p { font-size: 13px; line-height: 1.6; color: #26282B; }
@media (max-width: 680px) { .loop3 { grid-template-columns: 1fr; } .loop3 > div { border-left: 0; border-top: 1px solid var(--rule-l); } .loop3 > div:first-child { border-top: 0; } }
.com3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule-l); border: 1px solid var(--rule-l); }
.com3 > div { background: var(--paper2); padding: 26px 24px; }
.com3 h4 { font-size: 16px; font-weight: 600; margin: 12px 0 8px; letter-spacing: -.01em; }
.com3 p { font-size: 13px; line-height: 1.6; color: #26282B; }
@media (max-width: 680px) { .com3 { grid-template-columns: 1fr; } }

/* ── VIEW 04 cockpit ── */
.os { border: 1px solid var(--rule-d); background: var(--carbon); display: grid; grid-template-columns: 205px 1fr 250px; min-height: 540px; }
.osr { border-right: 1px solid var(--rule-d); padding: 18px 0; }
.osr .k { padding: 0 18px 12px; display: block; }
.osi { display: flex; justify-content: space-between; padding: 10px 18px; font-size: 12.5px; color: var(--g2); }
.osi b { font-family: var(--mono); font-size: 9.5px; color: var(--g4); font-weight: 500; }
.osi.on { color: var(--paper); background: var(--carbon2); box-shadow: inset 2px 0 0 var(--red); }
.osm { padding: 20px; }
.dcard { border: 1px solid var(--rule-d); background: var(--carbon2); padding: 16px 18px; margin-bottom: 13px; }
.dcard h4 { font-size: 14px; font-weight: 600; }
.dcard p { font-size: 12.5px; color: var(--g2); line-height: 1.55; margin-top: 6px; max-width: 60ch; }
.dcard .foot { display: flex; gap: 10px; align-items: center; margin-top: 13px; flex-wrap: wrap; }
.dcard .hold, .dcard .ghost { padding: 10px 14px; font-size: 8.5px; }
.dcard[data-done="true"] { opacity: .55; }
.oss { border-left: 1px solid var(--rule-d); padding: 18px; display: grid; gap: 17px; align-content: start; }
.metric b { display: block; font-family: var(--mono); font-size: 21px; font-weight: 500; margin-top: 4px; letter-spacing: -.01em; }
.metric.crit b { color: var(--red); }
.log div { font-family: var(--mono); font-size: 8.5px; letter-spacing: .05em; color: var(--g4); line-height: 1.65; }
.log div b { color: var(--g2); font-weight: 500; }
@media (max-width: 980px) {
  .os { grid-template-columns: 1fr; }
  .osr { display: flex; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--rule-d); padding: 0; }
  .osr .k { display: none; }
  .osi { white-space: nowrap; border-right: 1px solid var(--rule-d); }
  .osi.on { box-shadow: inset 0 -2px 0 var(--red); }
  .oss { border-left: 0; border-top: 1px solid var(--rule-d); }
}

/* ── VIEW 05 mobile ── */
.phones { display: flex; gap: 44px; justify-content: center; flex-wrap: wrap; padding: 48px 0 70px; align-items: flex-start; }
.phone { width: 318px; border: 1px solid var(--rule-d); background: var(--carbon); border-radius: 32px; padding: 11px; box-shadow: 0 50px 90px -52px rgba(0,0,0,.7); }
.scr { border-radius: 23px; overflow: hidden; background: var(--ink); border: 1px solid var(--rule-d); min-height: 590px; display: flex; flex-direction: column; }
.mtop { display: flex; justify-content: space-between; padding: 13px 16px 9px; }
.mh { padding: 6px 16px 15px; border-bottom: 1px solid var(--rule-d); }
.mh h3 { font-size: 18px; font-weight: 600; letter-spacing: -.015em; margin-top: 5px; }
.mb { padding: 14px 16px; border-bottom: 1px solid var(--rule-d); }
.mn { display: flex; align-items: baseline; gap: 11px; }
.mn b { font-family: var(--mono); font-size: 27px; font-weight: 500; letter-spacing: -.02em; }
.mn span { font-size: 12.5px; color: var(--g2); }
.mn.crit b { color: var(--red); }
.mtag { margin-top: 6px; }
.mnav { margin-top: auto; display: flex; border-top: 1px solid var(--rule-d); }
.mnav span { flex: 1; text-align: center; padding: 14px 4px; font-family: var(--mono); font-size: 8px; letter-spacing: .15em; text-transform: uppercase; color: var(--g4); border-right: 1px solid var(--rule-d); }
.mnav span:last-child { border-right: 0; }
.mnav .on { color: var(--paper); box-shadow: inset 0 2px 0 var(--red); }
.mdec { padding: 17px; display: grid; gap: 12px; }
.mdec h4 { font-size: 15.5px; font-weight: 600; line-height: 1.35; }
.mdec p { font-size: 12.5px; color: var(--g2); line-height: 1.6; }
.mfacts { border-top: 1px solid var(--rule-d); border-bottom: 1px solid var(--rule-d); padding: 11px 0; display: grid; gap: 8px; }
.mfacts div { display: flex; justify-content: space-between; gap: 10px; }
.cap { text-align: center; margin-top: 15px; }

/* ── VIEW 06 decision ── */
.stages { display: flex; border: 1px solid var(--rule-d); margin-bottom: 20px; overflow-x: auto; }
.stages button { appearance: none; border: 0; border-right: 1px solid var(--rule-d); background: none; cursor: pointer; flex: 1; padding: 13px 10px; font-family: var(--mono); font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--g4); white-space: nowrap; }
.stages button:last-child { border-right: 0; }
.stages button[data-on="true"] { color: var(--paper); box-shadow: inset 0 -2px 0 var(--red); }
.stagecard { border: 1px solid var(--rule-d); background: var(--carbon2); padding: 26px; min-height: 250px; }
.stagecard h3 { font-size: 18px; font-weight: 600; margin: 10px 0; }
.stagecard p { font-size: 13.5px; line-height: 1.65; color: var(--g2); max-width: 58ch; }
.flownav { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }

/* ── VIEW 07 dossier ── */
.dossier { border: 1.5px solid var(--ink); background: var(--paper2); max-width: 840px; margin: 44px auto 80px; }
.dh { padding: 28px 30px; border-bottom: 1.5px solid var(--ink); display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
.dh h2 { font-size: clamp(25px, 3.8vw, 38px); font-weight: 500; letter-spacing: -.025em; line-height: 1.05; max-width: 14ch; }
.plate { display: grid; grid-template-columns: auto auto; gap: 6px 20px; align-content: start; }
.ds { padding: 26px 30px; border-top: 1px solid var(--rule-l); }
.ds p { font-size: 14px; line-height: 1.7; color: #26282B; max-width: 60ch; margin-top: 12px; }
.caps { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--rule-l); border: 1px solid var(--rule-l); margin-top: 14px; }
.caps div { background: var(--paper2); padding: 14px 16px; font-size: 13px; }
.ba { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--ink); border: 1.5px solid var(--ink); margin-top: 14px; }
.ba > div { background: var(--paper2); padding: 18px 20px; }
.ba ul { list-style: none; display: grid; gap: 9px; font-size: 13px; margin-top: 12px; }
.ba .after b { font-family: var(--mono); font-size: 12px; }
@media (max-width: 680px) { .ba, .caps { grid-template-columns: 1fr; } }

/* ── VIEW 08 map ── */
.map { border: 1px solid var(--rule-l); background: var(--paper2); padding: 28px 26px; }
.stratum { display: grid; grid-template-columns: 150px 1fr; border-top: 1px solid var(--rule-l); padding: 15px 0; gap: 14px; align-items: center; }
.stratum:first-of-type { border-top: 0; }
.badges { display: flex; gap: 8px; flex-wrap: wrap; }
.sysb { font-family: var(--mono); font-size: 8.5px; letter-spacing: .1em; text-transform: uppercase; border: 1px solid var(--ink); padding: 7px 10px; background: var(--paper); }
.sysb.live { box-shadow: inset 3px 0 0 var(--red); }
.sysb.next { border-style: dashed; border-color: var(--g2); color: var(--g3); background: transparent; }
@media (max-width: 680px) { .stratum { grid-template-columns: 1fr; gap: 8px; } }

/* ── VIEW 09 institution ── */
.inst { display: grid; gap: 40px; padding: 44px 0 80px; }
.li { border: 1px solid var(--rule-l); background: #fff; max-width: 820px; }
.lib { background: var(--ink); color: var(--paper); aspect-ratio: 4/1; display: flex; align-items: center; justify-content: space-between; padding: 0 36px; gap: 14px; }
.libody { padding: 18px 22px 22px; }
.libody h4 { font-size: 16px; font-weight: 600; }
.libody p { font-size: 13px; color: #26282B; line-height: 1.6; max-width: 60ch; margin-top: 8px; }
.cover { max-width: 460px; aspect-ratio: 3/4; border: 1.5px solid var(--ink); background: var(--paper2); display: flex; flex-direction: column; padding: 26px; }
.cover h3 { margin-top: auto; font-size: clamp(28px, 4.6vw, 42px); font-weight: 500; letter-spacing: -.03em; line-height: 1.04; }
.cover .bt { margin-top: 22px; padding-top: 14px; border-top: 1.5px solid var(--ink); display: flex; justify-content: space-between; gap: 10px; }
.slide169 { max-width: 820px; aspect-ratio: 16/9; background: var(--ink); color: var(--paper); border: 1px solid var(--rule-d); display: flex; flex-direction: column; padding: 32px 38px; }
.slide169 h3 { margin-top: auto; font-size: clamp(24px, 4vw, 40px); font-weight: 500; letter-spacing: -.03em; line-height: 1.05; max-width: 18ch; }

/* ── rationale ── */
.rat { max-width: 740px; margin: 0 auto; padding: 60px 22px 100px; }
.rat-i { display: grid; grid-template-columns: 62px 1fr; gap: 18px; border-top: 1px solid var(--rule-d); padding: 20px 0; }
.rat-i h4 { font-size: 14.5px; font-weight: 600; margin-bottom: 7px; }
.rat-i p { font-size: 13.5px; line-height: 1.7; color: var(--g2); }
@media (max-width: 680px) { .rat-i { grid-template-columns: 1fr; gap: 6px; } }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 1ms !important; transition-duration: 1ms !important; }
}
`;

/* ══════════ primitives ══════════ */

const K = ({ children, style }) => <span className="k" style={style}>{children}</span>;
const St = ({ kind, children }) => <span className={`st ${kind}`}>{children}</span>;

/* PC-07 · Frame wrapper — closes on commit */
function Frame({ closed, children, style, className = "" }) {
  return (
    <div className={`frame${closed ? " closed" : ""} ${className}`} style={style}>
      <i className="fx" />
      {children}
    </div>
  );
}

/* PC-07 · Hold-to-Commit — 600 ms linear fill, keyboard-operable */
function Hold({ label, doneLabel, onCommit }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef(null); const t0 = useRef(0);
  const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stop = useCallback(() => { cancelAnimationFrame(raf.current); setPct(0); }, []);
  const start = useCallback(() => {
    if (done) return;
    if (reduced) { setDone(true); onCommit && onCommit(); return; }
    t0.current = performance.now();
    const step = (now) => {
      const p = Math.min(100, ((now - t0.current) / 600) * 100);
      setPct(p);
      if (p >= 100) { setDone(true); onCommit && onCommit(); return; }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [done, onCommit, reduced]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <button type="button" className="hold" data-armed={pct > 0} data-done={done}
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } }}
      onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") stop(); }}
      aria-label={done ? doneLabel : `${label} — maintenir pour valider`}>
      <span className="fill" style={{ width: `${done ? 0 : pct}%` }} />
      <span className="lab">{done ? doneLabel : label}</span>
    </button>
  );
}

/* ══════════ VIEW 01 — BOOT ══════════ */

function Boot() {
  const [k, setK] = useState(0);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setK(99); return; }
    let i = 0;
    const id = setInterval(() => { i += 1; setK(i); if (i > 7) clearInterval(id); }, 260);
    return () => clearInterval(id);
  }, []);
  const lines = [
    <>PARRIT / OS-0042 · REV 03</>,
    <>LOADING COMPANY MODEL ................ <span className="okl">DONE</span></>,
    <>CONNECTING OPERATIONS ................ <span className="okl">14 SYSTEMS</span></>,
    <>SCANNING FOR EXCEPTIONS .............. <span className="rl">2 FOUND</span></>,
    <span className="okl">READY.</span>,
  ];
  return (
    <div className="wrap">
      <div className="bootlog" aria-hidden="true">
        {lines.map((l, i) => <div key={i} className={k > i ? "on" : ""}>{l}</div>)}
      </div>
      <div className="boothero">
        <h1 className={k > 5 ? "on" : ""}>
          The system your company{" "}
          <Frame style={{ display: "inline-block", padding: "0 .12em" }}>operates</Frame>{" "}on.
        </h1>
      </div>
      <div className={`bootfoot${k > 6 ? " on" : ""}`}>
        <K>PARRIT DESIGNS AND BUILDS<br />COMPANY OPERATING SYSTEMS.</K>
        <p>One system to understand, decide and act across the company. Built for one company at a time. Commissioned, not subscribed.</p>
      </div>
    </div>
  );
}

/* ══════════ VIEW 02 — BRAND SYSTEM ══════════ */

function BrandSystem() {
  return (
    <div className="wrap">
      <div className="sec" style={{ borderTop: 0, paddingTop: 64 }}>
        <div className="sechead"><h2>Color — two registers</h2><K>PC-01 / PC-02</K></div>
        <div className="chips">
          {[["#0A0B0C", "Ink", "Type, structure, the institution"], ["#131518", "Carbon", "Instrument surfaces"], ["#F1F2F3", "Cold white", "Documents, site, dossiers"], ["#9CA1A6", "Grey 2", "Secondary information"], ["#55595E", "Grey 3", "Labels, annotations"], ["#E10600", "Parrit Red", "Signal only. Never decoration."]].map(([c, n, d]) => (
            <div className="chip" key={c}>
              <div className="c" style={{ background: c, borderBottom: c === "#F1F2F3" ? "1px solid #DDE0E3" : "none" }} />
              <div className="m"><b>{n}</b><K>{c}</K><small>{d}</small></div>
            </div>
          ))}
        </div>
      </div>

      <div className="sec">
        <div className="sechead"><h2>Signatures</h2><K>PC-05 / PC-06 / PC-07</K></div>
        <dl className="spec">
          <dt><K>REGISTRY LINE</K></dt>
          <dd><span style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".12em" }}>PARRIT / OS-0042 · SYS-018 · REV 03 · STATUS / OPERATIONAL</span><br />Present on every artefact. <b>It replaces the logo</b> in most contexts.</dd>
          <dt><K>THE PARRIT FRAME</K></dt>
          <dd>
            Red corner brackets mark <b>any object awaiting a decision</b>. 14 × 14 px, 2 px stroke, −1 px offset. Never decorative, never nested.
            <Frame style={{ border: "1px solid var(--rule-l)", background: "#fff", padding: 15, fontSize: 13, maxWidth: 440, marginTop: 12 }}>Supplier contract renewal — €120k / year</Frame>
          </dd>
          <dt><K>HOLD TO COMMIT</K></dt>
          <dd>
            <b>REV 02 graft.</b> Consequential actions are held 600 ms while red fills the control — a guarded switch, not a click. Release early: nothing happens. On commit, the frame closes (240 ms) and the journal line appears. Try it:
            <div style={{ marginTop: 12 }}><Hold label="Hold · approve" doneLabel="Committed · journaled" /></div>
          </dd>
          <dt><K>STATUS MARKS</K></dt>
          <dd style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
            <St kind="ok">Operational</St><St kind="att">Attention</St><St kind="crit">Critical</St><St kind="done">Executed</St>
          </dd>
        </dl>
      </div>

      <div className="sec">
        <div className="sechead"><h2>The Parrit Standard</h2><K>STD / 1.0</K></div>
        <div className="doctrine">
          <div className="doc-h"><K><b>THE PARRIT STANDARD</b></K><K>SPECIFICATION · STD-1.0 · 2026</K></div>
          {[["PS-01", "Observable", "The operator can determine the state of the system at any moment, without asking anyone."],
            ["PS-02", "Actionable", "Every surfaced piece of information leads to a possible action within the same view."],
            ["PS-03", "Traceable", "Every significant decision carries its origin: data, author, timestamp, rationale."],
            ["PS-04", "Reversible", "Every critical process has a documented path of return before it enters production."],
            ["PS-05", "Owned", "The client holds the system, its data and its documentation as company assets."],
            ["PS-06", "Compounding", "Each new capability increases the value of every capability already in production."]].map(([cl, nm, df]) => (
            <div className="doc-r" key={cl}><div className="cl"><K>{cl}</K></div><div className="nm">{nm}</div><div className="df">{df}</div></div>
          ))}
          <div className="doc-f"><span className="sq" /><K><b>CERTIFIED — BUILT TO THE PARRIT STANDARD</b></K></div>
        </div>
      </div>
    </div>
  );
}

/* ══════════ VIEW 03 — HOMEPAGE ══════════ */

function Home() {
  return (
    <div className="wrap">
      <div className="hh">
        <K>PARRIT — COMPANY OPERATING SYSTEMS</K>
        <h1 style={{ marginTop: 20 }}>Your company. One system.</h1>
        <p>Parrit designs and builds the operating system your company runs on: one place to understand what is happening, decide what matters and act — down to your phone.</p>
        <div className="cta">
          <Hold label="Commission your Operating System" doneLabel="Request on record" />
          <button className="ghost" type="button">Examine a system</button>
        </div>
      </div>

      <div style={{ padding: "10px 0 64px" }}>
        <div className="instr">
          <div className="ibar"><St kind="crit">Live</St><K>SILVANI GROUP · OS-0042</K><K>TUE 09:14</K></div>
          <div className="irow"><span className="n">3</span><span className="l">decisions require attention</span><span className="z"><K>TODAY</K></span></div>
          <div className="irow crit"><span className="n">€1.2M</span><span className="l">at risk on blocked orders</span><span className="z"><K style={{ color: "var(--red)" }}>ACTION REQUIRED</K></span></div>
          <div className="irow"><span className="n">7</span><span className="l">actions executed overnight</span><span className="z"><K>JOURNAL</K></span></div>
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}><K>THE OPERATING SYSTEM — SURFACED. COMPLEXITY ABSORBED UNDERNEATH.</K></div>
      </div>

      <div className="sec">
        <div className="sechead"><h2>One operating loop</h2><K>SCREEN 02</K></div>
        <div className="loop3">
          <div><h3>UNDERSTAND</h3><p>The system maintains a live model of the company: orders, cash, operations, people, clients — provenance on every number.</p></div>
          <div><h3 style={{ color: "var(--red)" }}>DECIDE</h3><p>Only what requires the executive reaches the executive. Framed, sourced, quantified, with its path of return documented.</p></div>
          <div><h3>ACT</h3><p>A decision executes through the same system that surfaced it — held, committed, journaled.</p></div>
        </div>
      </div>

      <div className="sec">
        <div className="sechead"><h2>Commissioned, not subscribed</h2><K>SCREEN 03</K></div>
        <div className="com3">
          <div><K>01 — EXAMINATION</K><h4>We study how your company actually operates.</h4><p>Not a workshop. A diagnostic of flows, decisions and failure points, documented as an engineering brief.</p></div>
          <div><K>02 — CONSTRUCTION</K><h4>We build the first system into production.</h4><p>One critical operation, rebuilt end-to-end and certified to the Parrit Standard before anything else begins.</p></div>
          <div><K>03 — COMPOUNDING</K><h4>Each capability joins the Operating System.</h4><p>The system grows with the company. You own it — code, data, documentation — as company infrastructure.</p></div>
        </div>
      </div>
      <div style={{ height: 60 }} />
    </div>
  );
}

/* ══════════ VIEW 04 — COCKPIT ══════════ */

function DecisionCard({ title, body, action, done, status, onCommit }) {
  const [isDone, setDone] = useState(false);
  const [closing, setClosing] = useState(false);
  const commit = () => { setClosing(true); setTimeout(() => setDone(true), 240); onCommit && onCommit(); };
  const inner = (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <h4>{title}</h4>{isDone ? <St kind="done">Executed</St> : status}
      </div>
      <p>{body}</p>
      <div className="foot">
        <Hold label={action} doneLabel={done} onCommit={commit} />
        <button className="ghost" type="button">Open dossier</button>
      </div>
    </>
  );
  return isDone
    ? <div className="dcard" data-done="true">{inner}</div>
    : <Frame closed={closing} className="dcard">{inner}</Frame>;
}

function Cockpit() {
  const [log, setLog] = useState([
    ["08:52", "CREDIT LIMIT RAISED — INSURER CONF."],
    ["07:31", "PAYMENT RUN EXECUTED — 41 INVOICES"],
    ["06:15", "DAILY CLOSE COMPLETED — SYS-018"],
    ["02:04", "STOCK REBALANCE — PLANT 01 → 03"],
  ]);
  const push = (l) => setLog((x) => [["09:1" + (4 + (x.length - 4)), l], ...x]);
  return (
    <div className="wrap" style={{ padding: "48px 0 80px" }}>
      <div className="sechead"><h2 style={{ fontSize: 22, fontWeight: 600 }}>Executive cockpit — desktop</h2><K>SILVANI GROUP · OS-0042 · REV 03</K></div>
      <div className="os">
        <div className="osr">
          <K><b>SYSTEMS</b></K>
          {[["Attention", "06", true], ["Financial ops", "SYS-018"], ["Order flow", "SYS-021"], ["Production", "SYS-014"], ["People", "SYS-009"], ["Journal", "ALL"]].map(([n, id, on]) => (
            <div key={n} className={`osi${on ? " on" : ""}`}><span>{n}</span><b>{id}</b></div>
          ))}
        </div>
        <div className="osm">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <K><b>REQUIRES YOUR ATTENTION</b></K><K>TUE 09:14 · 6 ITEMS</K>
          </div>
          <DecisionCard
            title="Release blocked orders — Müller GmbH"
            body="€1.2M of confirmed orders held by an expired credit limit. Insurer approved the raise at 08:52. Releasing restores committed delivery dates on 14 orders. Return path RB-14, documented."
            action="Hold · release 14 orders" done="Executed · 09:14 · Journaled ACT-2841"
            status={<St kind="crit">Critical</St>}
            onCommit={() => push("ORDERS RELEASED — MÜLLER · ACT-2841")} />
          <DecisionCard
            title="Approve supplier contract renewal"
            body="Logistics contract renews Friday at +8%. Two alternates quoted within 3% at equal service levels. Decision needed before auto-renewal."
            action="Hold · approve renewal" done="Executed · 09:15 · Journaled ACT-2842"
            status={<St kind="att">Attention</St>}
            onCommit={() => push("CONTRACT RENEWAL APPROVED · ACT-2842")} />
          <div className="dcard">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><h4>Exception — invoice mismatch, plant 02</h4><St kind="att">Attention</St></div>
            <p>3 supplier invoices diverge from goods received beyond tolerance. Held from payment automatically. Finance has context; no executive action needed.</p>
          </div>
          <div className="dcard">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><h4>Signal — Q3 cash position improving</h4><St kind="ok">Informational</St></div>
            <p>Collection time down 6 days since the receivables system entered production. Projected month-end cash +€430k vs plan.</p>
          </div>
        </div>
        <div className="oss">
          <div className="metric"><K>DECISIONS PENDING</K><b>3</b></div>
          <div className="metric crit"><K>AT RISK</K><b>€1.2M</b></div>
          <div className="metric"><K>ACTIONS / 24H</K><b>7</b></div>
          <div className="rule" />
          <K><b>JOURNAL</b></K>
          <div className="log">{log.map(([t, l], i) => <div key={i}><b>{t}</b> {l}</div>)}</div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}><K>FRAMED CARDS AWAIT A DECISION. HOLD THE RED CONTROL — THE FRAME CLOSES, THE ACTION JOURNALS.</K></div>
    </div>
  );
}

/* ══════════ VIEW 05 — MOBILE ══════════ */

function Mobile() {
  const [committed, setCommitted] = useState(false);
  const [closing, setClosing] = useState(false);
  return (
    <div className="wrap">
      <div className="sechead" style={{ paddingTop: 48 }}><h2 style={{ fontSize: 22, fontWeight: 600 }}>Super App — your company, in your pocket</h2><K>MOBILE · STATES 01–02</K></div>
      <div className="phones">
        <div>
          <div className="phone"><div className="scr">
            <div className="mtop"><K>09:14</K><K>PARRIT / OS-0042</K></div>
            <div className="mh"><K>SILVANI GROUP — LIVE</K><h3>What matters now</h3></div>
            <div className="mb"><div className="mn"><b>3</b><span>decisions require you</span></div><div className="mtag"><K>OLDEST — 2 H</K></div></div>
            <div className="mb"><div className="mn crit"><b>€1.2M</b><span>at risk — blocked orders</span></div><div className="mtag"><K style={{ color: "var(--red)" }}>ACTION REQUIRED</K></div></div>
            <div className="mb"><div className="mn"><b>7</b><span>actions executed overnight</span></div><div className="mtag"><K>ALL JOURNALED</K></div></div>
            <div className="mb"><div className="mn"><b>2</b><span>exceptions held safely</span></div><div className="mtag"><K>NO ACTION NEEDED</K></div></div>
            <div className="mnav"><span className="on">NOW</span><span>SYSTEMS</span><span>JOURNAL</span><span>ASK</span></div>
          </div></div>
          <div className="cap"><K>STATE 01 — READABLE IN FIVE SECONDS</K></div>
        </div>
        <div>
          <div className="phone"><div className="scr">
            <div className="mtop"><K>09:14</K><K>DECISION 1 / 3</K></div>
            {committed ? (
              <div className="mdec">
                <St kind="done">Executed</St>
                <h4>Release blocked orders — Müller GmbH</h4>
                <p>14 orders released. Logistics notified, credit position updated.</p>
                <div className="mfacts"><div><K>TRACE</K><K><b>ACT-2841 · 09:14</b></K></div><div><K>REVERSAL</K><K><b>RB-14 · AVAILABLE</b></K></div></div>
              </div>
            ) : (
              <Frame closed={closing} className="mdec">
                <St kind="crit">Critical</St>
                <h4>Release blocked orders — Müller GmbH</h4>
                <p>€1.2M held by an expired credit limit. Insurer confirmed the raise at 08:52. Releasing restores 14 committed delivery dates.</p>
                <div className="mfacts">
                  {[["SOURCE", "SYS-021 / ORDER FLOW"], ["EXPOSURE", "€1,204,300"], ["RETURN PATH", "RB-14 · DOCUMENTED"], ["IF IGNORED", "4 DATES SLIP — FRI"]].map(([k, v]) => (
                    <div key={k}><K>{k}</K><K><b>{v}</b></K></div>
                  ))}
                </div>
                <Hold label="Hold · release 14 orders" doneLabel="Executed · ACT-2841"
                  onCommit={() => { setClosing(true); setTimeout(() => setCommitted(true), 300); }} />
              </Frame>
            )}
            <div className="mnav"><span>NOW</span><span className="on">SYSTEMS</span><span>JOURNAL</span><span>ASK</span></div>
          </div></div>
          <div className="cap"><K>STATE 02 — SOURCED, QUANTIFIED, REVERSIBLE</K></div>
        </div>
      </div>
    </div>
  );
}

/* ══════════ VIEW 06 — DECISION FLOW ══════════ */

const STAGES = [
  ["SIGNAL", "08:52 — the system detects the event", "The insurer's approval lands. The order-flow system recognizes that the condition blocking €1.2M of confirmed orders has just been lifted. No human noticed yet; the journal did."],
  ["CONTEXT", "The situation, assembled", "Parrit frames it: 14 orders, €1,204,300, four delivery dates at risk by Friday, return path RB-14 already documented. Provenance attached to every number. The executive reads for twenty seconds."],
  ["DECISION", "One question, held", "Not a form. Not a dashboard. One framed question with one guarded control. The executive holds for 600 ms — long enough to mean it, short enough to act between two meetings."],
  ["EXECUTION", "The same system executes", "The system that surfaced the decision releases the orders, notifies logistics and updates the credit position. No handoff, no ticket, no 'I'll ask the team'."],
  ["TRACE", "09:14 — journaled, forever", "ACT-2841: source, author, timestamp, rationale, reversal path. Six months later, anyone can answer 'why did we do this?' in one look. This is PS-03, lived."],
];

function DecisionFlow() {
  const [i, setI] = useState(0);
  const [id, h, p] = STAGES[i];
  return (
    <div className="wrap" style={{ padding: "48px 0 80px" }}>
      <div className="sechead"><h2 style={{ fontSize: 22, fontWeight: 600 }}>One decision, end to end</h2><K>INFORMATION → CONTEXT → DECISION → ACTION → TRACE</K></div>
      <div className="stages">
        {STAGES.map(([s], k) => <button key={s} data-on={k === i} onClick={() => setI(k)}>{`0${k + 1} ${s}`}</button>)}
      </div>
      {id === "DECISION" ? (
        <Frame className="stagecard">
          <K style={{ color: "var(--red)" }}><b>{`STAGE ${i + 1} / 5 — ${id}`}</b></K>
          <h3>{h}</h3><p>{p}</p>
          <div style={{ marginTop: 18 }}>
            <Hold label="Hold · release 14 orders" doneLabel="Committed — advancing" onCommit={() => setTimeout(() => setI(3), 500)} />
          </div>
        </Frame>
      ) : (
        <div className="stagecard">
          <K><b>{`STAGE ${i + 1} / 5 — ${id}`}</b></K>
          <h3>{h}</h3><p>{p}</p>
        </div>
      )}
      <div className="flownav">
        <button className="ghost" type="button" onClick={() => setI(Math.max(0, i - 1))} style={{ opacity: i === 0 ? .4 : 1 }}>← Previous</button>
        <button className="ghost" type="button" onClick={() => setI(Math.min(4, i + 1))} style={{ opacity: i === 4 ? .4 : 1 }}>Next stage →</button>
      </div>
    </div>
  );
}

/* ══════════ VIEW 07 — DOSSIER ══════════ */

function Dossier() {
  return (
    <div className="wrap">
      <div className="dossier">
        <div className="dh">
          <div><K>SYSTEM DOSSIER</K><h2 style={{ marginTop: 12 }}>Financial closing, rebuilt.</h2></div>
          <div className="plate">
            {[["CLIENT", "SILVANI GROUP"], ["SYSTEM", "SYS-018"], ["DOMAIN", "FINANCIAL OPERATIONS"], ["COMMISSIONED", "2026"], ["REV", "03"], ["STATUS", "OPERATIONAL"]].map(([k, v]) => (
              [<K key={k}>{k}</K>, <K key={k + "v"}><b>{v}</b></K>]
            ))}
          </div>
        </div>
        <div className="ds"><K><b>01 — OPERATING PROBLEM</b></K>
          <p>Monthly close took 12 days across 3 entities and 5 disconnected tools. Numbers arrived too late to steer with. The CFO spent the first week of every month reconstructing the past.</p>
        </div>
        <div className="ds"><K><b>02 — CAPABILITIES BUILT</b></K>
          <div className="caps">
            {["Continuous reconciliation across the 3 entities", "Intercompany matching, exceptions held automatically", "Daily close position, surfaced to the cockpit", "Payment runs executed and journaled by the system"].map((c, k) => (
              <div key={k}><K>CAP-0{k + 1}</K><div style={{ marginTop: 5 }}>{c}</div></div>
            ))}
          </div>
        </div>
        <div className="ds"><K><b>03 — MEASURED CHANGE · 2 QUARTERS</b></K>
          <div className="ba">
            <div><K>BEFORE</K><ul><li>Close in 12 days</li><li>5 tools, manual reconciliation</li><li>Numbers 3 weeks old at decision time</li><li>2 FTE-weeks per month of assembly</li></ul></div>
            <div className="after"><K>AFTER</K><ul><li>Close in <b>2 DAYS</b></li><li><b>1 SYSTEM</b> — exceptions only</li><li>Position refreshed <b>DAILY</b></li><li><b>−87%</b> manual assembly</li></ul></div>
          </div>
        </div>
        <div className="doc-f" style={{ borderTop: "1.5px solid var(--ink)", padding: "16px 30px", justifyContent: "space-between", flexWrap: "wrap", gap: 10, display: "flex" }}>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}><span className="sq" /><K><b>BUILT TO THE PARRIT STANDARD</b></K></span>
          <K>PARRIT / OS-0042 / SYS-018</K>
        </div>
      </div>
    </div>
  );
}

/* ══════════ VIEW 08 — SYSTEM MAP ══════════ */

function SystemMap() {
  const strata = [
    ["FINANCE", [["SYS-018 · CLOSING", "live"], ["SYS-022 · RECEIVABLES", "live"]]],
    ["SALES", [["SYS-021 · ORDER FLOW", "live"], ["SYS-030 · PIPELINE", "next"]]],
    ["OPERATIONS", [["SYS-014 · PRODUCTION", "live"], ["SYS-019 · LOGISTICS", "next"]]],
    ["KNOWLEDGE", [["SYS-009 · COMPANY MEMORY", "live"]]],
    ["MANAGEMENT", [["EXE-001 · THE COCKPIT", "live"]]],
  ];
  return (
    <div className="wrap" style={{ padding: "48px 0 80px" }}>
      <div className="sechead"><h2 style={{ fontSize: 22, fontWeight: 600 }}>How capabilities compound into one system</h2><K>SILVANI GROUP · 7 LIVE · 2 COMMISSIONED NEXT</K></div>
      <div className="map">
        {strata.map(([dom, sys]) => (
          <div className="stratum" key={dom}>
            <K><b>{dom}</b></K>
            <div className="badges">{sys.map(([s, st]) => <span key={s} className={`sysb ${st}`}>{s}</span>)}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, fontSize: 13.5, lineHeight: 1.65, color: "#26282B", maxWidth: "58ch" }}>
        Every system writes to the same journal — the company's single line of record. Nothing is an isolated tool: PS-06 makes that a breach of standard, not a preference. The cockpit (EXE-001) reads them all.
      </p>
    </div>
  );
}

/* ══════════ VIEW 09 — INSTITUTION ══════════ */

function Institution() {
  return (
    <div className="wrap inst">
      <div>
        <K><b>LINKEDIN — COMPANY PAGE</b></K>
        <div className="li" style={{ marginTop: 14 }}>
          <div className="lib">
            <span className="mark" style={{ fontSize: 16 }}>PARRIT<i>.</i>AI</span>
            <div style={{ textAlign: "right" }}><K>COMPANY OPERATING SYSTEMS<br />COMMISSIONED · NOT SUBSCRIBED</K></div>
          </div>
          <div className="libody">
            <h4>Parrit</h4><K>COMPANY OPERATING SYSTEMS · LILLE</K>
            <p>Parrit designs and builds the system your company operates on — one system to understand, decide and act, certified to the Parrit Standard.</p>
          </div>
        </div>
      </div>
      <div>
        <K><b>PUBLICATION — WE FIND THE WAY</b></K>
        <div className="cover" style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><K>WE FIND THE WAY</K><K>ISSUE 04 / 2026</K></div>
          <h3>How companies will <Frame style={{ display: "inline-block", padding: "0 .1em" }}>operate</Frame> next.</h3>
          <div className="bt"><K>PARRIT.AI</K><K>P. LARMARAUD · M. BOUÉ</K></div>
        </div>
      </div>
      <div>
        <K><b>EXECUTIVE BRIEFING — TITLE SLIDE</b></K>
        <div className="slide169" style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><K>EXECUTIVE BRIEFING</K><K>CONFIDENTIAL / SILVANI GROUP</K></div>
          <h3>Commissioning your Operating System.</h3>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <K>PARRIT / OS-0042 · PROPOSAL REV 01</K><K>2026</K>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════ RATIONALE ══════════ */

function Rationale() {
  const items = [
    ["R-01", "System retained", "The v1 red system, locked after a full comparative exploration: cold-white documents (the institution) and carbon instruments (the product), fine 1px rules, zero radius, registry line on every artefact. The rejected alternative (warm paper / calibration orange / trace rail) contributed exactly one graft: Hold-to-Commit."],
    ["R-02", "Proprietary signatures", "The registry line replaces the logo in most contexts. The Parrit Frame marks any object awaiting a decision, and now has its closing gesture: hold 600 ms → red fills → frame converges shut in 240 ms → journal line. The commit cycle is the one animation the brand owns."],
    ["R-03", "Production notes", "Every value is a CSS custom property in :root, mapped one-to-one to PARRIT / CODES-1.0 REV 02 (PC-01 → PC-12). Components are isolated (Frame, Hold, DecisionCard, St, K) and stateless where possible — built to be lifted into the production codebase by coding agents without reinterpretation. Type ships on Geist; swapping to Söhne is a token change."],
    ["R-04", "Open items", "License the type pair (Söhne / ABC Diatype). Validate #E10600 in print and on video. Specify the ASK tab (product scope). Define frame density rules when several decisions coexist on one mobile screen."],
  ];
  return (
    <div className="rat">
      <K><b>DESIGN RATIONALE — REV 02</b></K>
      <div style={{ marginTop: 26 }}>
        {items.map(([n, h, p]) => (
          <div className="rat-i" key={n}><K>{n}</K><div><h4>{h}</h4><p>{p}</p></div></div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ APP ══════════ */

const VIEWS = [
  ["01 / OPENING", Boot, false],
  ["02 / SYSTEM", BrandSystem, true],
  ["03 / WEBSITE", Home, true],
  ["04 / COCKPIT", Cockpit, false],
  ["05 / SUPER APP", Mobile, false],
  ["06 / DECISION", DecisionFlow, false],
  ["07 / DOSSIER", Dossier, true],
  ["08 / SYSTEM MAP", SystemMap, true],
  ["09 / INSTITUTION", Institution, true],
  ["10 / RATIONALE", Rationale, false],
];

export default function App() {
  const [v, setV] = useState(0);
  const [clock, setClock] = useState("");
  useEffect(() => {
    const t = () => setClock(new Date().toTimeString().slice(0, 8));
    t(); const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);
  const [, View, light] = VIEWS[v];
  return (
    <div className="pr">
      <style>{CSS}</style>
      <div className="bar">
        <span className="mark">PARRIT<i>.</i>AI</span>
        <K>OS-0042 · REV <b>03</b> · <b>OPERATIONAL</b></K>
        <K style={{ marginLeft: "auto" }}>{clock} · LOCAL</K>
      </div>
      <div className="nav" role="tablist">
        {VIEWS.map(([label], i) => (
          <button key={label} role="tab" data-on={i === v} aria-selected={i === v} onClick={() => { setV(i); window.scrollTo(0, 0); }}>{label}</button>
        ))}
      </div>
      <main className={`view${light ? " light" : ""}`} key={v}><View /></main>
    </div>
  );
}

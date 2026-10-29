import type { GlyphName } from "@/system/ontology-hero-data";

// Vector paths from the approved generator, with canonical token colours.
const glyphs = {
  mail: <><rect x="3" y="5" width="12" height="9" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M3 5l6 5 6-5" fill="none" stroke="currentColor" strokeWidth="1.3"/></>,
  doc: <><path d="M5 3h6l3 3v9H5z" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M7 9h5M7 12h5" stroke="currentColor" strokeWidth="1.1"/></>,
  rule: <><path d="M4 5h10M4 9h10M4 13h6" stroke="currentColor" strokeWidth="1.4"/></>,
  tool: <><rect x="4" y="4" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.3"/><rect x="7.5" y="7.5" width="3" height="3" fill="currentColor"/></>,
  cal: <><rect x="3.5" y="5" width="11" height="9.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M3.5 8h11M6.5 3v3M11.5 3v3" stroke="currentColor" strokeWidth="1.3"/></>,
  cube: <><path d="M9 3l5.5 3v6L9 15l-5.5-3V6z M3.5 6L9 9l5.5-3 M9 9v6" fill="none" stroke="currentColor" strokeWidth="1.2"/></>,
  person: <><circle cx="9" cy="6.5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M4 15c.6-3 2.6-4.5 5-4.5s4.4 1.5 5 4.5" fill="none" stroke="currentColor" strokeWidth="1.3"/></>,
  gear: <><circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M9 2.5v2.5M9 13v2.5M2.5 9H5M13 9h2.5M4.4 4.4l1.8 1.8M11.8 11.8l1.8 1.8M4.4 13.6l1.8-1.8M11.8 6.2l1.8-1.8" stroke="currentColor" strokeWidth="1.3"/></>,
  chart: <><path d="M4 15V9M8 15V5M12 15v-4M15 15H3" stroke="currentColor" strokeWidth="1.5"/></>,
  bot: <><rect x="3" y="4" width="12" height="11" fill="currentColor"/><rect x="6" y="8" width="2" height="3.5" fill="var(--onto-node-fill)"/><rect x="10" y="8" width="2" height="3.5" fill="var(--onto-node-fill)"/></>,
};
export function OntologyGlyph({ name }: { name: GlyphName }) { return glyphs[name]; }

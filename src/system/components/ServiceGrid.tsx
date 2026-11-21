import { MobileCarousel } from "./MobileCarousel";
import { CardGlyph } from "./CardGlyph";
import type { OntologyGlyphName } from "./OntologyGlyph";

/** Sept cartes : un pictogramme, un titre, une phrase (décision de Paul du 21/11/2026, soir). */
export function ServiceGrid({ items, label }: {
  items: readonly (readonly [OntologyGlyphName, string, string])[];
  label: string;
}) {
  return <MobileCarousel className="services" label={label}>
    {items.map(([glyph, title, text]) => <div className="partner" key={title}>
      <div className="partner-head"><CardGlyph name={glyph}/><span className="s">{title}</span></div>
      <p>{text}</p>
    </div>)}
  </MobileCarousel>;
}

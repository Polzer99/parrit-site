import { OntologyGlyph, type OntologyGlyphName } from "./OntologyGlyph";

/** Repère d'une carte : un pictogramme du schéma du héros, 32 px, dans la couleur du contexte. Aucun nouvel actif. */
export function CardGlyph({ name }: { name: OntologyGlyphName }) {
  return <svg className="card-glyph" viewBox="0 0 18 18" width="32" height="32" aria-hidden="true" focusable="false"><OntologyGlyph name={name}/></svg>;
}

/** Coche des listes « vous recevez » : la même sur l'accueil et sur les pages d'offre. */
export function CheckMark() {
  return <svg className="check-mark" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="m3 9 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
}

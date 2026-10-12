export const ORG_ID = "https://parrit.ai/#organization";

export const AUTEUR = {
  id: ORG_ID,
  nom: "Parrit.ai",
  url: "https://parrit.ai",
} as const;

export function orgRef() {
  return { "@type": "Organization", "@id": AUTEUR.id, name: AUTEUR.nom, url: AUTEUR.url };
}

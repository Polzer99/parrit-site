export const AUTEUR = {
  id: "https://paul-larmaraud.com/#person",
  nom: "Paul Larmaraud",
  url: "https://paul-larmaraud.com",
} as const;

export const ORG_ID = "https://parrit.ai/#organization";

export function personRef() {
  return { "@type": "Person", "@id": AUTEUR.id, name: AUTEUR.nom, url: AUTEUR.url };
}

export function orgRef() {
  return { "@type": "Organization", "@id": ORG_ID, name: "Parrit.ai", url: "https://parrit.ai" };
}

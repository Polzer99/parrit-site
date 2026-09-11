const NOMS_INTERDITS = [
  "Joone",
  "Clevery",
  "Lavazza",
  "Naval Group",
  "Estée Lauder",
  "Hiolle",
  "Toyotomi",
  "Metavisio",
  "Stratera",
  "Rydge",
  "Eficia",
  "TerraCall",
  "SNCF",
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokens(value) {
  return new Set(
    String(value)
      .toLocaleLowerCase("en")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim()
      .split(/\s+/u)
      .filter(Boolean),
  );
}

function jaccard(left, right) {
  if (left.size === 0 && right.size === 0) return 0;

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }

  return intersection / new Set([...left, ...right]).size;
}

export function gateSlug(slug) {
  if (/\d{4}-\d{2}-\d{2}/u.test(slug)) {
    return { ok: false, motif: "slug : une date YYYY-MM-DD est interdite" };
  }
  if (slug.startsWith("journal-")) {
    return { ok: false, motif: "slug : le préfixe « journal- » est interdit" };
  }
  return { ok: true };
}

export function gateNoms(texte) {
  for (const nom of NOMS_INTERDITS) {
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}_])${escapeRegExp(nom)}(?![\\p{L}\\p{N}_])`,
      "iu",
    );
    if (pattern.test(texte)) {
      return { ok: false, motif: `nom client interdit : « ${nom} »` };
    }
  }
  return { ok: true };
}

/**
 * Le Journal est écrit en anglais, et l'anglais ne met pas d'espace devant une
 * ponctuation haute. Le français, si. Un article qui porte cette espace n'est
 * donc pas un article mal relu : c'est un article PENSÉ EN FRANÇAIS puis
 * traduit, et la typographie d'origine a survécu au passage.
 *
 * C'est pour ça que la règle est ici plutôt que dans un correcteur : elle
 * n'attrape pas une faute de frappe, elle attrape une méthode d'écriture que la
 * doctrine refuse — chaque langue s'écrit nativement, jamais ne se traduit.
 *
 * Relevé du 11/09/2026 : 20 occurrences sur exactement 5 des 20 articles. Les
 * 15 écrits nativement en anglais en portaient zéro. La typographie signait
 * l'origine du texte mieux que n'importe quelle relecture.
 *
 * On vise l'espace ordinaire et les espaces insécables, devant les quatre
 * ponctuations concernées. Les deux-points d'un horaire ou d'une URL n'ont
 * jamais d'espace avant, ils ne peuvent donc pas déclencher.
 */
export function gateTypographie(texte) {
  const PONCTUATION_HAUTE = /[    ]([:;!?])/u;
  const trouve = PONCTUATION_HAUTE.exec(texte);
  if (trouve) {
    const debut = Math.max(0, trouve.index - 40);
    return {
      ok: false,
      motif: `typographie : espace avant « ${trouve[1]} », habitude française dans un texte anglais — « …${texte.slice(debut, trouve.index + 2)} »`,
    };
  }
  return { ok: true };
}

export function gateRepetition(title, description, entreesExistantes) {
  const titleTokens = tokens(title);
  const descriptionTokens = tokens(description);

  for (const entree of entreesExistantes) {
    const titleSimilarity = jaccard(titleTokens, tokens(entree.title));
    const descriptionSimilarity = jaccard(descriptionTokens, tokens(entree.description));

    if (titleSimilarity >= 0.6 || descriptionSimilarity >= 0.6) {
      return { ok: false, motif: `répétition avec « ${entree.slug} »` };
    }
  }

  return { ok: true };
}

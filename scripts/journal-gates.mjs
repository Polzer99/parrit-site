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

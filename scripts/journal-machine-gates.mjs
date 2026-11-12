import matter from 'gray-matter';
import { withinDeadline } from './journal-machine-io.mjs';
import { readFileSync } from 'node:fs';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import { journalMarkdownBlocks } from '../src/system/journal-markdown.ts';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { gateFichesInternes, gateNoms, gateRepetition, gateSlug } from './journal-gates.mjs';
import { journalMdxTraps } from './publish-journal.mjs';
import { falseClaims } from './false-claims-check.mjs';
import { certificationClaims } from './lib/certification-claims.mjs';
import { ownershipClaims } from './lib/ownership-claims.mjs';
import { spellingErrors } from './entity-spelling.mjs';

export const PILIERS = ['audit-pme', 'agents-production', 'industrie-metiers', 'logiciel-sur-mesure', 'formation', 'gouvernance'];
export const OFFRES = ['audit', 'formation', 'logiciel', 'harnais'];
export const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ANTI_IA = ['de plus', 'en outre', 'par ailleurs', 'il est important de noter', 'dans un monde où', "à l'ère de", 'révolutionnaire', 'innovant', 'puissant', 'incontournable', 'véritable levier', "n'est plus une option", 'en conclusion', 'en résumé'];
export const PRIMARY_DOMAINS = JSON.parse(readFileSync(new URL('../content/plan/sources-primaires.json', import.meta.url), 'utf8'));
// An allowlist makes the exclusion of competitors and anonymous generated sites enforceable.
export const SOURCE_HOSTS = [...Object.values(PRIMARY_DOMAINS).flat().map(domain => new URL(`https://${domain}`).hostname), 'gouv.fr', 'europa.eu', 'insee.fr', 'cnil.fr', 'legifrance.gouv.fr', 'service-public.fr', 'service-public.gouv.fr', 'bpifrance.fr', 'bpifrance-creation.fr', 'cci.fr', 'hautsdefrance.fr', 'anact.fr', 'inria.fr', 'cnrs.fr', 'arxiv.org', 'oecd.org', 'nist.gov', 'iso.org', 'openai.com', 'anthropic.com', 'microsoft.com', 'google.com', 'deepmind.google', 'mistral.ai', 'docs.github.com', 'openrouter.ai', 'banque-france.fr', 'mckinsey.com', 'ey.com', 'bcg.com', 'gartner.com', 'lesechos.fr', 'lemonde.fr', 'usinenouvelle.com', 'lemondeinformatique.fr', 'ft.com'];
const LOCAL_HOSTS = ['hautsdefrance.fr', 'bpifrance.fr', 'bpifrance-creation.fr', 'cci.fr', 'hautsdefrance.cci.fr'];
const fail = (gate, motif) => ({ gate, ok: false, motif });
const normalized = value => String(value).normalize('NFKC').replace(/[’‘]/g, "'").toLocaleLowerCase('fr');
export const words = text => (text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || []).length;
export const prose = text => text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/https?:\/\/\S+/g, '').replace(/<[^>]+>/g, ' ');
export function visibleArticle(raw) {
  const { data, content } = matter(raw);
  return [data.title, data.description, content, ...(data.faq || []).flatMap(item => [item.q, item.a]), ...(data.sources || []).map(item => item.label)].join('\n');
}

export const PRESS_TITLES = JSON.parse(readFileSync(new URL('../content/plan/chroniques-presse.json', import.meta.url), 'utf8'));
export const REFUSED_DOMAINS = JSON.parse(readFileSync(new URL('../content/plan/sources-refusees.json', import.meta.url), 'utf8'));
export function gatePressOverlap(topic) {
  const tokens = value => new Set(normalized(value).match(/[\p{L}\p{N}]+/gu) || []);
  for (const candidate of [topic.title, topic.titre, topic.these_pressentie, topic.requete].filter(Boolean)) {
    const left = tokens(candidate);
    for (const title of PRESS_TITLES) {
      const right = tokens(title);
      if ([...left].filter(token => right.has(token)).length / new Set([...left, ...right]).size >= 0.4)
        return fail('chronique-presse', 'couvert_par_chronique_presse');
    }
  }
  return { gate: 'chronique-presse', ok: true };
}
export const exactText = value => String(value).normalize('NFC').replace(/[’‘ʼ]/g, "'").replace(/\s+/gu, ' ').trim();
function sourceMentionIndex(text, publisher) {
  const escaped = normalized(publisher).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...normalized(text).matchAll(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'gu'))];
  return matches.at(-1)?.index ?? -1;
}
export function sourceFresh(source, today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(source.published_at) || !Number.isFinite(Date.parse(source.published_at)) ||
      new Date(source.published_at).toISOString().slice(0, 10) !== source.published_at || source.published_at > today) return false;
  if (source.kind === 'law') return true;
  const cutoff = new Date(today);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - (['usage', 'market', 'news'].includes(source.kind) ? 6 : 18));
  return new Date(source.published_at) > cutoff;
}
export function sourceDatePresent(text, date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  if (text.includes(date)) return true;
  const [year, month, day] = date.split('-').map(Number);
  const fr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][month - 1];
  const en = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][month - 1];
  const normalizedDate = exactText(text).toLowerCase();
  return new RegExp(`\\b0?${day}(?:er|st|nd|rd|th)? (?:${fr}|${en}) ${year}\\b|\\b${en} 0?${day}(?:st|nd|rd|th)?,? ${year}\\b|\\b0?${day}/0?${month}/${year}\\b`).test(normalizedDate);
}
const FR_MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const EN_MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
function decodeHTML(value) {
  const entities = { nbsp: ' ', amp: '&', quot: '"', apos: "'", rsquo: "'", laquo: '«', raquo: '»', eacute: 'é', egrave: 'è', ucirc: 'û' };
  return String(value).replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (all, name) => {
    if (name[0] !== '#') return entities[name.toLowerCase()] ?? all;
    const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : all;
  });
}
function htmlAttributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m => [m[1].toLowerCase(), decodeHTML(m[2] ?? m[3] ?? m[4])]));
}
export function sourceVisibleText(body) {
  const text = String(body);
  return decodeHTML((/<[a-z][^>]*>/i.test(text) ? text.replace(/\s+/g, ' ') : text).replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|head|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<\/?(?:p|div|article|section|header|footer|li|tr|h[1-6]|br|hr)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' '));
}
function validDate(year, month, day, today) {
  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= '1990-01-01' && date <= today &&
    Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date ? date : null;
}
function parsedDate(value, today) {
  if (typeof value !== 'string') return null;
  const text = exactText(decodeHTML(value)).toLowerCase();
  let m = text.match(/^(?:D:)?(\d{4})[-/]?(\d{2})[-/]?(\d{2})(?=$|[^\d]|\d{6})/i);
  if (m) return validDate(m[1], m[2], m[3], today);
  m = text.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})\b/);
  if (m) return validDate(m[3], m[2], m[1], today);
  m = text.match(/^(\d{1,2})(?:er|st|nd|rd|th)?\s+([\p{L}]+)\.?\s+(\d{4})\b/u);
  const monthNumber = name => {
    for (const list of [FR_MONTHS, EN_MONTHS]) {
      const i = list.findIndex(month => month === name || (name.length >= 3 && month.startsWith(name)));
      if (i >= 0) return i + 1;
    }
    return 0;
  };
  if (m) return validDate(m[3], monthNumber(m[2]), m[1], today);
  m = text.match(/^([a-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/);
  return m ? validDate(m[3], monthNumber(m[1]), m[2], today) : null;
}
function firstCompleteDate(text, today) {
  const candidates = String(text).matchAll(/\b(?:\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[/.]\d{1,2}[/.]\d{4}|\d{1,2}(?:er|st|nd|rd|th)?\s+[\p{L}]+\.?\s+\d{4}|[a-z]+\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})\b/giu);
  for (const m of candidates) { const date = parsedDate(m[0], today); if (date) return date; }
  return null;
}

/** PDF input is { creationDate, pages, text }, decoded by fetchSource via Poppler.
 * dateModified is evidence of modification only, never a publication fallback.
 */
export function extractPublicationDate(input, url, headers = {}, today = new Date().toISOString().slice(0, 10)) {
  const pdf = input && typeof input === 'object' && !Buffer.isBuffer(input);
  const html = pdf ? '' : String(input);
  const clean = html.replace(/<!--[\s\S]*?-->/g, '');
  const dates = { datePublished: [], dateCreated: [], dateModified: [] };
  const visit = value => {
    if (!value || typeof value !== 'object') return;
    for (const [key, item] of Object.entries(value)) {
      if (Object.hasOwn(dates, key)) dates[key].push(...(Array.isArray(item) ? item : [item]));
      if (typeof item === 'object') visit(item);
    }
  };
  for (const match of clean.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (htmlAttributes(match[1]).type?.toLowerCase() !== 'application/ld+json') continue;
    try { visit(JSON.parse(match[2])); } catch { /* Bad JSON-LD does not suppress other evidence. */ }
  }
  const modified = dates.dateModified.map(value => parsedDate(value, today)).find(Boolean);
  const result = (published_at, methode) => published_at ? { published_at, methode, ...(modified ? { modified_at: modified } : {}) } : null;
  for (const key of ['datePublished', 'dateCreated']) {
    for (const value of dates[key]) { const date = parsedDate(value, today); if (date) return result(date, 'json_ld'); }
  }
  const markup = clean.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const metas = [...markup.matchAll(/<meta\b[^>]*>/gi)].map(m => htmlAttributes(m[0]));
  for (const name of ['article:published_time', 'og:published_time', 'citation_publication_date', 'citation_date', 'dc.date', 'dcterms.issued', 'date', 'pubdate', 'parsely-pub-date', 'sailthru.date']) {
    for (const meta of metas.filter(m => (m.property || m.name || '').toLowerCase() === name)) {
      const date = parsedDate(meta.content, today); if (date) return result(date, 'meta');
    }
  }
  const article = markup.match(/<article\b[^>]*>([\s\S]*?)<\/article\s*>/i)?.[1];
  const header = markup.match(/<header\b[^>]*>([\s\S]*?)<\/header\s*>/i)?.[1];
  for (const scope of [article, header].filter(Boolean)) {
    for (const m of scope.matchAll(/<time\b[^>]*>/gi)) {
      const date = parsedDate(htmlAttributes(m[0]).datetime, today); if (date) return result(date, 'time');
    }
  }
  let pathname = '';
  try { pathname = new URL(url).pathname; } catch { /* No URL evidence. */ }
  for (const m of pathname.matchAll(/(?:^|[^\d])(\d{4})[-/]?(\d{2})[-/]?(\d{2})(?!\d)/g)) {
    const date = validDate(m[1], m[2], m[3], today); if (date) return result(date, 'url');
  }
  const visible = exactText(sourceVisibleText(markup));
  for (const m of visible.matchAll(/\b(?:publié(?:e)?\s+le|mis(?:e)?\s+à\s+jour\s+le|published(?:\s+on)?|updated(?:\s+on)?|publication)\s*:?\s*/giu)) {
    const date = parsedDate(visible.slice(m.index + m[0].length), today); if (date) return result(date, 'texte');
  }
  const contentType = typeof headers.get === 'function' ? headers.get('content-type') : headers['content-type'];
  if (pdf || /application\/pdf/i.test(contentType || '')) {
    const date = parsedDate(input.creationDate, today);
    if (date) return result(date, 'pdf_creation');
    const firstPages = (input.pages || []).slice(0, 2).join('\n');
    const fallback = firstCompleteDate(firstPages, today); if (fallback) return result(fallback, 'pdf_texte');
  }
  if (/^https:\/\/(?:www\.)?arxiv\.org\/abs\//i.test(url)) {
    const submission = visible.match(/(?:submitted\s+on|\[v1\])\s+(.{0,100})/i)?.[1];
    const date = submission && firstCompleteDate(submission, today);
    if (date) return result(date, 'arxiv');
  }
  return null;
}

export function articleParts(content) {
  const start = content.search(/^## /m);
  return { chapo: start < 0 ? content.trim() : content.slice(0, start).trim(), body: start < 0 ? '' : content.slice(start).trim() };
}

export function gateTopicRepetition(topic, entries) {
  const press = gatePressOverlap(topic);
  if (!press.ok) return press;
  const old = gateRepetition(topic.requete, '', entries);
  if (!old.ok) return old;
  const tokens = value => new Set(normalized(value).match(/[\p{L}\p{N}]+/gu) || []);
  const left = tokens(topic.requete);
  for (const entry of entries) {
    const right = tokens(entry.title);
    const union = new Set([...left, ...right]);
    const score = [...left].filter(token => right.has(token)).length / (union.size || 1);
    if (score >= 0.5 || (entry.requete && normalized(topic.requete).trim() === normalized(entry.requete).trim())) {
      return { ok: false, motif: `répétition avec « ${entry.slug} » (requête ou Jaccard ≥ 0,5)` };
    }
  }
  return { ok: true };
}

export function gateAntiIA(text) {
  const value = normalized(text);
  const expression = ANTI_IA.find(term => new RegExp(`(?<![\\p{L}])${term}(?![\\p{L}])`, 'u').test(value));
  if (/[—–]/u.test(text)) return fail('anti-ia', 'tiret cadratin ou demi-cadratin');
  if (expression) return fail('anti-ia', `expression interdite : ${expression}`);
  const firstWords = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !/^[#|*-]/.test(p)).map(p => normalized(p).match(/[\p{L}]+/u)?.[0]);
  if (firstWords.some((word, i) => word && word === firstWords[i + 1] && word === firstWords[i + 2])) return fail('anti-ia', 'trois paragraphes commencent par le même mot');
  return { gate: 'anti-ia', ok: true };
}

export function gateParrit(text) {
  const patterns = [
    [/€|\b(?:euros?|EUR|USD|dollars?|GBP)\b|[$£]/iu, 'prix ou montant'],
    [/\b(?:FormIA|Qualiopi|OPCO|MIT)\b/iu, 'organisme ou certification interdit'],
    [/\b(?:nos clients|chez un client|nous avons déployé|nous avons accompagné|our clients|we (?:have )?(?:deployed|supported)|at a client)\b/iu, 'fait de mission interdit'],
    [/\bbureaux\b|\bour offices\b|\b\d+\s+(?:bis\s+)?(?:rue|avenue|boulevard|allée|impasse|road|street)\b/iu, 'adresse ou bureaux'],
  ];
  for (const [pattern, motif] of patterns) if (pattern.test(text)) return fail('interdits-parrit', motif);
  const cities = /\b(?:Lyon|Marseille|Bordeaux|Toulouse|Nantes|Rennes|Nice|Strasbourg|Montpellier|Rueil-Malmaison|Roubaix)\b/iu;
  if (cities.test(text)) return fail('interdits-parrit', 'ville non autorisée');
  const locations = [...text.matchAll(/(?:\bà|\bdepuis|\bprès de|\bville de|\bbasés? à|\bin|\bbased in)\s+([\p{Lu}][\p{L}-]+)/gu)].map(match => match[1]);
  if (locations.some(city => !['Tourcoing', 'Lille', 'Paris', 'Hauts-de-France', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].includes(city))) return fail('interdits-parrit', 'localisation non autorisée');
  return { gate: 'interdits-parrit', ok: true };
}

export function gateStructure(raw, slug, locale = 'fr', today = new Date().toISOString().slice(0, 10)) {
  const { data, content } = matter(raw);
  const error = motif => fail('structure', motif);
  for (const key of ['title', 'description', 'date', 'updatedAt', 'pilier', 'requete', 'author', 'slug']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) return error(`frontmatter : ${key}`);
  }
  if (!SAFE_SLUG.test(slug) || slug.length > 72 || data.slug !== slug) return error('slug invalide');
  if (!PILIERS.includes(data.pilier) || data.author !== 'Paul Larmaraud') return error('pilier ou auteur invalide');
  if (data.title.length < 50 || data.title.length > 90 || /[?？]|\b(?:guide|tout savoir|comment|how to|everything you need|\d+ conseils|\d+ tips)\b/iu.test(data.title) || data.description.length > 155) return error('titre-thèse affirmatif 50 à 90 signes / description ≤155');
  if (data.draft || data.noindex) return error('publication masquée');
  for (const key of ['date', 'updatedAt']) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data[key]) || !Number.isFinite(Date.parse(data[key])) || new Date(data[key]).toISOString().slice(0, 10) !== data[key]) return error(`date invalide : ${key}`);
  }
  if (data.date > today || data.updatedAt > today) return error('date de publication future');
  if (data.updatedAt < data.date) return error('updatedAt antérieur à date');
  if (locale === 'fr' && data.translationOf !== slug) return error('translationOf invalide');
  if (!Array.isArray(data.faq) || data.faq.length < 2 || data.faq.length > 4 || data.faq.some(item => typeof item.q !== 'string' || !item.q.endsWith('?') || typeof item.a !== 'string' || !item.a.trim())) return error('FAQ structurée : 2 à 4 questions et réponses');
  if (!Array.isArray(data.sources) || data.sources.length < 3 || data.sources.length > 8 || data.sources.some(s =>
      ['label', 'url', 'publisher', 'published_at'].some(key => typeof s[key] !== 'string' || !s[key].trim()) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(s.published_at))) return error('Sources : 3 à 8 références avec titre, éditeur, date et lien');
  if (new Set(data.sources.map(s => s.url)).size !== data.sources.length) return error('Sources dupliquées');
  if (/^\s{0,3}\[[^\]]+\]:/m.test(content)) return error('liens de référence Markdown interdits');
  // Content is data, never executable MDX/HTML, images, embeds or frontmatter extras.
  if (/<\/?[A-Za-z]|[{}]|^\s*(?:import|export)\s|!\[/m.test(content)) return error('MDX actif ou HTML interdit');
  const { chapo, body } = articleParts(content);
  const lead = prose(chapo).replace(/[*_]/g, '');
  if (lead.length < 300 || lead.length > 450 || !/\d/.test(lead) || !data.sources.some(s => sourceMentionIndex(lead, s.publisher) >= 0) || !/\b20\d{2}\b/.test(lead)) return error('chapô : 300 à 450 signes, chiffre daté et source nommée');
  if (/^\s*(?:#{1,6}\s*|[*_]{1,2})?(?:à retenir|key takeaways|FAQ|questions fréquentes|frequently asked questions)\b/imu.test(body)) return error('FAQ visible et À retenir interdits');
  const sections = [...body.matchAll(/^## (.+)$/gm)];
  const hollow = /^(?:introduction|(?:le )?contexte|les enjeux|conclusion|en résumé|à retenir|sources|faq|questions fréquentes|context|the stakes|summary|key takeaways|frequently asked questions)$/iu;
  if (sections.length < 3 || sections.length > 4 || sections.some(s => /[?？]/u.test(s[1]) || hollow.test(s[1].trim()))) return error('H2 : 3 ou 4 intertitres affirmatifs, aucun nominal creux');
  const bodyText = prose(body).replace(/^## /gm, '').replace(/[*_]/g, '');
  if (bodyText.length < 4500 || bodyText.length > 7000) return error(`corps : ${bodyText.length} signes, attendu 4500 à 7000`);
  if (/(?<![\p{L}\p{N}])(?:nous|notre|nos|parrit|je|mon|ma|mes|moi|vous|votre|vos|we|our|us|I|my|me|mine|you|your)(?![\p{L}\p{N}])|(?<!\p{L})j['’](?=\p{L})/iu.test(prose(content))) return error('corps : troisième personne, aucun nous/notre/nos/Parrit');
  const paragraphs = body.split(/\n\s*\n/).map(p => p.replace(/^## .*(?:\n|$)/gm, '').trim()).filter(Boolean);
  if (paragraphs.some(p => !/\d/.test(prose(p)) && !data.sources.some(s => sourceMentionIndex(prose(p), s.publisher) >= 0))) return error('paragraphe sans fait ni source');
  if (data.faq.some(item => !exactText(prose(content)).includes(exactText(item.a)))) return error('FAQ : réponse absente du texte');
  // Sources/signature/booking are rendered once by the shared template, after the body.
  if (/\]\([^)]*(?:source=journal-|#contact|rendez-vous)/.test(content)) return error('appel réservé à la ligne du gabarit');
  journalMarkdownBlocks(content); // Optional tables still use the strict shared parser.
  return { gate: 'structure', ok: true };
}

export function numericFacts(text, locale = 'fr', source = false) {
  let value = prose(text).replace(/\b\d{4}-\d{2}-\d{2}\b/g, '');
  value = value.replace(/\b(?:article|art\.|version|v)\s*\d+(?:[.-]\d+)*\b/gi, '');
  value = value.replace(/\b(?:GPT-|GLM-|Opus |Apache )\d+(?:\.\d+)+\b|\b\d+(?:\.\d+){2,}\b/g, '');
  const found = [];
  const expression = /\d+(?:[ \u00a0\u202f]\d{3})*(?:[.,]\d+)*(?:[ \u00a0\u202f]*%)?/g;
  for (const match of value.matchAll(expression)) {
    let numberText = match[0].replace(/[ \u00a0\u202f]/g, '');
    numberText = locale === 'en' ? numberText.replace(/,(?=\d{3}(?:\D|$))/g, '') : numberText.replace(',', '.');
    let number = Number(numberText.replace('%', ''));
    if (!Number.isFinite(number)) { found.push(numberText); continue; }
    const after = value.slice(match.index + match[0].length, match.index + match[0].length + 45);
    const before = value.slice(Math.max(0, match.index - 30), match.index);
    const factor = after.match(/^\s*(millions?|milliards?|billions?|thousands?|mille)\b/i)?.[1].toLowerCase();
    if (factor) number *= /milliard|billion/.test(factor) ? 1e9 : /million/.test(factor) ? 1e6 : 1e3;
    const units = /^\s*(?:%|pour cent|percent|minutes?|heures?|hours?|jours?|days?|mois|months?|ans?|années?|years?|secondes?|seconds?|ms|s\b|kg|km|go|mo|gb|mb|té?raoctets?|giga(?:octets?|bytes?)|tokens?|jetons?|fois|times|salariés?|employees|personnes?|people|entreprises?|companies|dossiers?|records?|lignes?|rows?|utilisateurs?|users?|kwh|mwh|watts?|mètres?|meters?|tonnes?|litres?|liters?|octets?|bytes?|kilowatts?)\b/iu.test(after);
    // Calendar references only: a quantity such as 2000 employees is not a year.
    if (!source && !factor && !units && number >= 1900 && number <= 2099 && Number.isInteger(number) && /(?:\ben|\bin|\bfin de|\bdepuis|\buntil|\bavant|\bafter|\bbefore|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|January|February|March|April|May|June|July|August|September|October|November|December)\s*$/i.test(before)) continue;
    if (!source && number <= 10 && !numberText.endsWith('%') && !units && !factor) continue;
    found.push(`${number}${numberText.endsWith('%') || /^\s*(?:pour cent|percent)\b/i.test(after) ? '%' : ''}`);
  }
  return [...new Set(found)].sort();
}

export function publicSourceUrl(input, local = false) {
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || isIP(url.hostname)) throw new Error('URL source non publique');
  if (REFUSED_DOMAINS.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) throw new Error(`domaine refusé : ${url.hostname}`);
  if (!(local ? LOCAL_HOSTS : SOURCE_HOSTS).some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) throw new Error(`source hors registre officiel : ${url.hostname}`);
  return url;
}
const isPrivate = ip => ip.includes(':') ? !/^[23][0-9a-f]{0,3}:/i.test(ip) : /^(?:0|10|127|169\.254|172\.(?:1[6-9]|2\d|3[01])|192\.168|192\.0|198\.(?:18|19)|22[4-9]|23\d|24\d|25[0-5])\./.test(ip);
async function decodePDF(bytes, signal, executePDF) {
  const directory = await mkdtemp(path.join(tmpdir(), 'journal-source-'));
  try {
    const file = path.join(directory, 'source.pdf');
    await writeFile(file, bytes);
    signal.throwIfAborted();
    const run = (command, args) => withinDeadline(() => executePDF(command, args, { signal, timeout: 15_000, maxBuffer: 5_000_000, env: { ...process.env, LC_ALL: 'C' } }), signal);
    const { stdout: info } = await run('pdfinfo', ['-rawdates', file]);
    const { stdout: text } = await run('pdftotext', ['-enc', 'UTF-8', file, '-']);
    return { creationDate: info.match(/^CreationDate:\s*(.+)$/m)?.[1], pages: text.split('\f'), text };
  } finally { await rm(directory, { recursive: true, force: true }); }
}
export async function fetchSource(url, { fetchImpl = fetch, resolve = lookup, local = false, details = false, today, sourceCache, executePDF = execFileAsync } = {}) {
  let current = publicSourceUrl(url, local);
  const cached = sourceCache?.get(url);
  if (cached) return details ? cached : cached.text;
  const signal = AbortSignal.timeout(15_000);
  for (let redirects = 0; redirects <= 5; redirects++) {
    const addresses = await withinDeadline(() => resolve(current.hostname, { all: true }), signal);
    if (!addresses.length || addresses.some(({ address }) => isPrivate(address))) throw new Error('adresse source privée');
    const response = await withinDeadline(() => fetchImpl(current.href, { method: 'GET', redirect: 'manual', headers: { 'User-Agent': 'ParritJournalBot/1.0' }, signal }), signal);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      await withinDeadline(() => response.body?.cancel(), signal);
      current = publicSourceUrl(new URL(response.headers.get('location'), current).href, local);
      continue;
    }
    if (response.status !== 200 || Number(response.headers.get('content-length')) > 5_000_000) {
      await withinDeadline(() => response.body?.cancel(), signal).catch(() => {});
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
      throw Object.assign(new Error('source trop volumineuse'), { code: 'SOURCE_TOO_LARGE' });
    }
    const chunks = []; let size = 0;
    const reader = response.body?.getReader();
    if (reader) {
      try {
        while (true) {
          const { value, done } = await withinDeadline(() => reader.read(), signal);
          if (done) break;
          size += value.byteLength;
          if (size > 5_000_000) throw Object.assign(new Error('source trop volumineuse'), { code: 'SOURCE_TOO_LARGE' });
          chunks.push(value);
        }
      } finally {
        // cancel() is observed even if the deadline has already expired.
        await withinDeadline(() => reader.cancel(), AbortSignal.timeout(1_000)).catch(() => {});
      }
    }
    const bytes = Buffer.concat(chunks);
    const pdf = bytes.subarray(0, 5).toString() === '%PDF-' || /application\/pdf/i.test(response.headers.get('content-type') || '');
    const body = pdf ? await decodePDF(bytes, signal, executePDF) : bytes.toString('utf8');
    signal.throwIfAborted();
    const text = pdf ? body.text : sourceVisibleText(body);
    const publication = extractPublicationDate(body, current.href, response.headers, today);
    const result = { text, publication, url: current.href };
    sourceCache?.set(url, result);
    return details ? result : text;
  }
  throw new Error('trop de redirections');
}

export async function gateSources(raw, annotations, options = {}) {
  const { data, content } = matter(raw);
  const reasons = [], texts = [], evidence = new Map();
  for (const source of data.sources || []) {
    const citation = annotations.find(annotation => annotation.url === source.url);
    try {
      publicSourceUrl(source.url, options.local);
      if (!citation) throw new Error('source hors recherche');
      if (source.publisher !== citation.author || source.published_at !== citation.published_at || !sourceFresh(citation, options.today || new Date().toISOString().slice(0, 10))) throw new Error('éditeur/date non conformes à la recherche');
      const { text, publication } = await fetchSource(source.url, { ...options, details: true });
      if (publication?.published_at !== citation.published_at) throw new Error('date non vérifiée dans la page source');
      texts.push(text); evidence.set(source.url, exactText(text));
    } catch (error) { reasons.push(`${source.url} : ${error.message}`); }
  }
  // Annotation snippets are leads, never proof: only fetched pages can support facts/quotes.
  const supported = new Set(texts.flatMap(text => [...numericFacts(text, 'fr', true), ...numericFacts(text, 'en', true)]));
  if (/\b\d+(?:[.,]\d+)?(?:[eE][+-]?\d+|[kKmMbB])\b/.test(prose(visibleArticle(raw)))) reasons.push('notation numérique abrégée ou scientifique non autorisée');
  const missing = numericFacts(visibleArticle(raw), options.locale || 'fr').filter(number => !supported.has(number));
  if (missing.length) reasons.push(`nombres non sourcés : ${missing.join(', ')}`);
  const quotedText = [content, data.title, data.description, ...(data.faq || []).flatMap(f => [f.q, f.a])].join('\n\n');
  for (const paragraph of quotedText.split(/\n\s*\n/)) {
    for (const quote of paragraph.matchAll(/«([^»]+)»|“([^”]+)”|"([^"\n]+)"|‘([^’]+)’|(?<!\p{L})'([^'\n]+)'(?!\p{L})/gu)) {
      const value = quote.slice(1).find(Boolean);
      if (words(value) <= 6) continue;
      // Attribute this quotation, not an unrelated sentence elsewhere in the paragraph.
      const prefix = paragraph.slice(0, quote.index).split(/[.!?]\s+/u).at(-1);
      const suffix = paragraph.slice(quote.index + quote[0].length).split(/[.!?]\s+/u)[0];
      const adjacent = (data.sources || []).filter(s => suffix.includes(s.url));
      const before = (data.sources || []).map(s => ({ source: s, index: sourceMentionIndex(prefix, s.publisher) })).filter(s => s.index >= 0).sort((a, b) => b.index - a.index);
      const after = (data.sources || []).filter(s => sourceMentionIndex(suffix, s.publisher) >= 0);
      const attributed = adjacent.length ? adjacent : before.length ? [before[0].source] : after;
      if (!attributed.some(s => evidence.get(s.url)?.includes(exactText(value)))) reasons.push(`citation non vérifiée mot pour mot dans sa source : ${value}`);
    }
  }
  return reasons.length ? fail('sources', reasons.join('; ')) : { gate: 'sources', ok: true };
}

export function gateAdaptation(fr, en) {
  try {
  const a = matter(fr), b = matter(en);
  for (const key of ['slug', 'date', 'updatedAt', 'pilier', 'requete', 'author']) if (a.data[key] !== b.data[key]) return fail('adaptation', `champ divergent : ${key}`);
  if (JSON.stringify(numericFacts(visibleArticle(fr))) !== JSON.stringify(numericFacts(visibleArticle(en), 'en'))) return fail('adaptation', 'chiffres FR/EN différents');
  const urls = raw => [...new Set([...(matter(raw).data.sources || []).map(s => s.url), ...[...matter(raw).content.matchAll(/https?:\/\/[^\s)]+/g)].map(m => m[0])])].sort();
  if (JSON.stringify(urls(fr)) !== JSON.stringify(urls(en))) return fail('adaptation', 'URL FR/EN différentes');
  if (a.content.match(/^## /gm)?.length !== b.content.match(/^## /gm)?.length || a.data.faq?.length !== b.data.faq?.length) return fail('adaptation', 'structure FR/EN différente');
  return { gate: 'adaptation', ok: true };
  } catch (error) { return fail('adaptation', `frontmatter invalide : ${error.message}`); }
}

export async function articleGates({ raw, slug, locale = 'fr', entries = [], annotations = [], sourceOptions = {}, internalLinks = [], topic, today }) {
  try {
    const parsed = matter(raw);
    const text = visibleArticle(raw);
    const checks = [
      ['fiches', gateFichesInternes(raw)], ['slug', gateSlug(slug)], ['noms-clients', gateNoms(raw)],
      ['repetition', gateRepetition(parsed.data.title, parsed.data.description, entries)],
    ].map(([gate, result]) => ({ gate, ...result }));
    checks.push(gatePressOverlap({ title: parsed.data.title }), gateAntiIA(text), gateParrit(text), gateStructure(raw, slug, locale, today));
    for (const [gate, errors] of [
      ['mdx', journalMdxTraps(parsed.content)], ['entite', spellingErrors(raw, `${slug}.mdx`)],
      ['false-claims', falseClaims(raw).map(x => x.rule)], ['certification', certificationClaims(text)],
      ['ownership', ownershipClaims(raw, `content/journal/${slug}.mdx`).map(x => x.text)],
    ]) checks.push(errors.length ? fail(gate, errors.join('; ')) : { gate, ok: true });
    if (topic && (parsed.data.requete !== topic.requete || parsed.data.pilier !== topic.pilier)) checks.push(fail('sujet', 'requête ou pilier ne correspond pas au sujet choisi'));
    const links = [...parsed.content.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
    const chosen = new Set(links.filter(link => internalLinks.includes(link)));
    if (internalLinks.length && (chosen.size < Math.min(2, internalLinks.length) || chosen.size > 3)) checks.push(fail('liens-internes', '2 à 3 articles proches attendus'));
    const allowed = new Set([...(parsed.data.sources || []).map(s => s.url), ...internalLinks, locale === 'fr' ? `/fr?source=journal-${slug}#contact` : `/?source=journal-${slug}#contact`]);
    if (links.some(link => !allowed.has(link))) checks.push(fail('liens', 'lien hors sources, articles fournis ou réservation'));
    if (checks.every(check => check.ok)) checks.push(await gateSources(raw, annotations, { ...sourceOptions, locale, today }));
    return checks;
  } catch (error) { return [fail('parse', error.message)]; }
}

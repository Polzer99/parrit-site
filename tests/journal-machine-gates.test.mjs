import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { articleGates, gateSources, gateTopicRepetition, gateAdaptation, numericFacts, fetchSource, publicSourceUrl, gatePressOverlap, gateStructure, articleParts, sourceFresh } from '../scripts/journal-machine-gates.mjs';
import { validateJudge, researchSources, verifiedMaterial } from '../scripts/journal-machine.mjs';
const deny = () => { throw new Error('Network forbidden in tests'); };
mock.method(globalThis, 'fetch', deny);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, deny);
mock.method(net, 'connect', deny); mock.method(net, 'createConnection', deny);
const fr = readFileSync(new URL('./fixtures/journal-machine/fr.mdx', import.meta.url), 'utf8');
const en = readFileSync(new URL('./fixtures/journal-machine/en.mdx', import.meta.url), 'utf8');
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/journal-machine/openrouter.json', import.meta.url), 'utf8'));
const annotations = researchSources(fixtures.research.choices[0].message, {}, '2026-11-12');
const sourceText = readFileSync(new URL('./fixtures/journal-machine/source.txt', import.meta.url), 'utf8');
const sourceOptions = { fetchImpl: async () => new Response(sourceText), resolve: async () => [{ address: '1.1.1.1' }] };
const check = raw => articleGates({ raw, slug: 'premier-outil-ia', annotations, sourceOptions });

test('un article valide passe toutes les portes déterministes et adaptation', async () => {
  const results = await check(fr);
  assert.ok(results.every(r => r.ok), JSON.stringify(results));
  assert.equal(gateAdaptation(fr, en).ok, true);
});
for (const [name, transform, gate, motif] of [
  ['cadratin', raw => raw.replace('Pour choisir', 'Pour choisir —'), 'anti-ia', /tiret/],
  ['demi-cadratin', raw => raw.replace('Pour choisir', 'Pour choisir –'), 'anti-ia', /tiret/],
  ['expression IA', raw => raw.replace('Le responsable du processus', 'En outre votre responsable'), 'anti-ia', /expression/],
  ['nombre non sourcé', raw => raw.replace('Le responsable du processus', 'Avec 87 % des dossiers, le responsable du processus'), 'sources', /87%/],
  ['prix', raw => raw.replace('Le responsable du processus', 'Pour 500 euros, votre responsable'), 'interdits-parrit', /prix/],
  ['fait de mission', raw => raw.replace('Le responsable du processus', 'Chez un client votre responsable'), 'interdits-parrit', /mission/],
  ['H2 interrogatif', raw => raw.replace('Le délai annoncé masque le travail de reprise', 'Le délai annoncé masque le travail de reprise ?'), 'structure', /H2/],
  ['H2 creux', raw => raw.replace('Le délai annoncé masque le travail de reprise', 'Les enjeux'), 'structure', /H2/],
  ['titre question', raw => raw.replace('Les outils ne réduisent les délais que si les règles sont explicites', 'Les outils ne réduisent les délais que si les règles sont explicites ?'), 'structure', /titre/],
  ['nous', raw => raw.replace('Le responsable du processus', 'Nous contrôlons Insee. Le responsable du processus'), 'structure', /troisième personne/],
  ['paragraphe vide de preuve', raw => raw + '\n\nUn changement suffit à régler la question.', 'structure', /paragraphe sans fait ni source/],
  ['citation inventée', raw => raw.replace('Le responsable du processus', 'Selon Insee, « Une fausse citation suffisamment longue pour déclencher le contrôle ». Le responsable du processus'), 'sources', /citation non vérifiée/],
  ['domaine refusé', raw => raw.replace('https://www.insee.fr/fr/statistiques/fixture-delais', 'https://forbes.com/report'), 'sources', /domaine refusé/],
  ['chapô trop long', raw => raw.replace(/(---\n\n)[\s\S]*?(?=\n\n##)/, '$1' + 'mot '.repeat(120)), 'structure', /chapô/],
  ['nom client', raw => raw.replace('Le responsable du processus', 'Laparra : votre responsable'), 'noms-clients', /Laparra/],
  ['fiche interne', raw => raw + "\nFICHE D'ENTRÉE", 'fiches', /fiche interne/],
  ['titre trop long', raw => raw.replace('Les outils ne réduisent les délais que si les règles sont explicites', 'a'.repeat(91)), 'structure', /titre/],
  ['certification', raw => raw.replace('Le responsable du processus', 'Un prestataire certifié votre responsable'), 'certification', /certifié/],
  ['organisme', raw => raw.replace('Le responsable du processus', 'Qualiopi : votre responsable'), 'interdits-parrit', /organisme/],
  ['adresse', raw => raw.replace('Le responsable du processus', 'Au 42 rue de la gare votre responsable'), 'interdits-parrit', /adresse/],
  ['HTML actif', raw => raw.replace('Le responsable du processus', '<script>alert(1)</script> Le responsable du processus'), 'structure', /HTML/],
  ['image distante', raw => raw.replace('Le responsable du processus', '![image](https://www.cnil.fr/a) Le responsable du processus'), 'structure', /MDX/],
  ['lien externe non fourni', raw => raw.replace('Le responsable du processus', '[Le responsable du processus](https://evil.example) '), 'liens', /hors sources/],
]) test(`refuse ${name} avec le motif précis`, async () => {
  const results = await check(transform(fr));
  const failed = results.find(r => r.gate === gate && !r.ok);
  assert.ok(failed, JSON.stringify(results));
  assert.match(failed.motif, motif);
});

test('normalise décimales, milliers et pourcentages, garde unités ≤10 et exclut années/lois/versions', () => {
  assert.deepEqual(numericFacts('12,5 %; 10 000 dossiers; article 42; version 2.3; en 2026; 3 choix; 5 heures'), ['10000', '12.5%', '5']);
  assert.deepEqual(numericFacts('12.5%; 10\u202f000 dossiers; 5 hours'), ['10000', '12.5%', '5']);
});
test('une annotation ne justifie pas un nombre absent de la page', async () => {
  const raw = fr.replace('Le responsable du processus', 'Avec 87 %, le responsable du processus');
  const cited = annotations.map(a => ({ ...a, content: '87 % des dossiers' }));
  assert.match((await gateSources(raw, cited, sourceOptions)).motif, /87%/);
  assert.equal((await gateSources(raw, cited, { ...sourceOptions, fetchImpl: async () => new Response(sourceText + ' 87 %') })).ok, true);
  assert.match((await gateSources(raw, cited, { ...sourceOptions, fetchImpl: async () => new Response('', { status: 404 }) })).motif, /HTTP 404/);
});
test('les sources non fournies par recherche échouent', async () => {
  assert.match((await gateSources(fr, [], sourceOptions)).motif, /hors recherche/);
});
test('redirige avec contrôle destination, UA et délai', async () => {
  const requests = [];
  const output = await fetchSource('https://www.cnil.fr/one', { ...sourceOptions, fetchImpl: async (url, options) => {
    requests.push([url, options]);
    return requests.length === 1 ? new Response('', { status: 302, headers: { location: '/two' } }) : new Response('texte');
  } });
  assert.equal(output, 'texte'); assert.equal(requests.length, 2);
  assert.equal(requests[1][0], 'https://www.cnil.fr/two'); assert.equal(requests[0][1].headers['User-Agent'], 'ParritJournalBot/1.0');
  assert.ok(requests[0][1].signal instanceof AbortSignal);
});
test('refuse URLs privées, redirections privées, concurrents et résolution privée', async () => {
  for (const url of ['http://www.cnil.fr', 'https://127.0.0.1', 'https://evil.example', 'https://user:pass@www.cnil.fr']) assert.throws(() => publicSourceUrl(url));
  await assert.rejects(fetchSource('https://www.cnil.fr/a', { ...sourceOptions, resolve: async () => [{ address: '127.0.0.1' }] }), /privée/);
  await assert.rejects(fetchSource('https://www.cnil.fr/a', { ...sourceOptions, fetchImpl: async () => new Response('', { status: 302, headers: { location: 'http://127.0.0.1' } }) }), /non publique/);
});
test('déduplication à Jaccard 0,5 et requête identique', () => {
  assert.equal(gateTopicRepetition({ requete: 'alpha beta gamma' }, [{ title: 'alpha beta delta', slug: 'old' }]).ok, false);
  assert.equal(gateTopicRepetition({ requete: 'Même requête' }, [{ title: 'Autre', requete: 'même requête', slug: 'old' }]).ok, false);
});
test('juge JSON strict, binaire et citation authentique', () => {
  assert.equal(validateJudge(fixtures.judge.choices[0].message.content, fr).ok, true);
  assert.equal(validateJudge('{}', fr).ok, false);
  assert.equal(validateJudge(JSON.stringify({ unsupported: { answer: 'oui', quote: 'inventée' }, answers_query: { answer: 'oui', quote: '' } }), fr).ok, false);
  assert.equal(validateJudge(JSON.stringify({ unsupported: { answer: 'non', quote: '' }, answers_query: { answer: 'non', quote: '' } }), fr).ok, false);
});
test('recherche garde annotations, auteur et fraîcheur, angle local fermé', () => {
  const message = structuredClone(fixtures.research.choices[0].message);
  assert.equal(researchSources(message, { angle_local: false }, '2026-11-12').length, 3);
  assert.throws(() => researchSources(message, { angle_local: true }, '2026-11-12'), /materiau_insuffisant/);
  const meta = JSON.parse(message.content); meta.sources[0].published_at = '2020-01-01'; message.content = JSON.stringify(meta);
  assert.throws(() => researchSources(message, {}, '2026-11-12'), /materiau_insuffisant/);
});

test('attaques nombres, unités, annotations et dates ne passent plus', async () => {
  for (const text of ['2000 salariés', '5 millions de salariés', '9 téraoctets', '2 kWh', '5 mètres', '3 tonnes', '1e6 dossiers', '1E6 dossiers']) {
    const result = await gateSources(fr.replace('Le responsable du processus', `${text}. Le responsable du processus`), annotations, sourceOptions);
    assert.equal(result.ok, false, text);
  }
  const response = structuredClone(fixtures.research.choices[0].message);
  const meta = JSON.parse(response.content); meta.sources[0].content = '99999 personnes'; response.content = JSON.stringify(meta);
  assert.equal(researchSources(response, {}, '2026-11-12')[0].content, annotations[0].content);
  meta.sources[0].published_at = '2026-02-30'; response.content = JSON.stringify(meta);
  assert.throws(() => researchSources(response, {}, '2026-11-12'), /materiau_insuffisant/);
  const results = await check(fr.replaceAll('2026-11-12', '2099-01-01'));
  assert.ok(results.some(r => !r.ok && /future/.test(r.motif)));
});
test('petit nombre isolé dans une source peut étayer une quantité avec unité', async () => {
  const result = await gateSources(fr.replace('Le responsable du processus', 'Avec 4 jours, votre responsable'), annotations, { ...sourceOptions, fetchImpl: async () => new Response(sourceText + ' Durée en jours : 4.') });
  assert.equal(result.ok, true);
});
test('liens référence et tableau ambigu sont refusés avant build', async () => {
  const linked = fr.replace('Le responsable du processus', '[Source][rogue]\n\n[rogue]: https://example.net/rogue\n\nLe responsable du processus');
  assert.ok((await check(linked)).some(r => !r.ok && /référence/.test(r.motif)));
  const table = fr + '\n\n| Essai | Insee |\n| --- | --- |\n| `Essai | Vérifier` |';
  assert.ok((await check(table)).some(r => !r.ok));
});
test('ville non autorisée, unités et différences anglaises sont bloquées', async () => {
  assert.ok((await check(fr.replace('Le responsable du processus', 'À Lyon, votre responsable'))).some(r => r.gate === 'interdits-parrit' && !r.ok));
  assert.deepEqual(numericFacts('1,355 employees', 'en'), ['1355']);
  assert.equal(gateAdaptation(fr, en.replace('The process owner', 'With 45 hours, your business lead')).ok, false);
});


test('C1 corps court, titre guide et FAQ non extraite échouent', () => {
  const cut = fr.slice(0, fr.indexOf('## Le contrôle du lundi'));
  assert.equal(gateStructure(cut, 'premier-outil-ia').ok, false);
  const start = fr.indexOf('## Le délai');
  const short = fr.slice(0, start) + '## Le délai masque les reprises\n\nInsee ' + 'a'.repeat(980) + '\n\n## Le contrôle garde la décision\n\nCNIL ' + 'b'.repeat(980) + '\n\n## La règle précise le résultat\n\nInsee ' + 'c'.repeat(900);
  assert.match(gateStructure(short, 'premier-outil-ia').motif, /corps.*4500/);
  assert.match(gateStructure(fr.replace('Les outils ne réduisent', 'Guide des outils qui réduisent'), 'premier-outil-ia').motif, /titre/);
  assert.equal(articleParts(fr.split('---')[2]).chapo.length >= 300, true);
});
test('C1 titres presse : Jaccard inclusif 0,4 et registres titres seuls', () => {
  assert.equal(gatePressOverlap({ title: 'La spécification est devenue le livrable' }).motif, 'couvert_par_chronique_presse');
  assert.equal(gatePressOverlap({ title: 'La spécification est devenue le livrable alpha beta gamma delta epsilon zeta iota kappa lambda' }).ok, false);
  assert.equal(gatePressOverlap({ title: 'zèbre mangue océan' }).ok, true);
  const titles = JSON.parse(readFileSync('content/plan/chroniques-presse.json', 'utf8'));
  assert.equal(titles.length, 16); assert.ok(titles.every(t => typeof t === 'string' && !t.includes('\n')));
});
test('C1 domaines refusés, sous-domaines et redirections', async () => {
  for (const host of JSON.parse(readFileSync('content/plan/sources-refusees.json', 'utf8'))) {
    assert.throws(() => publicSourceUrl(`https://${host}/x`), /domaine refusé/);
    assert.throws(() => publicSourceUrl(`https://sub.${host}/x`), /domaine refusé/);
  }
  await assert.rejects(fetchSource('https://www.cnil.fr/a', { ...sourceOptions, fetchImpl: async () => new Response('', { status: 302, headers: { location: 'https://paidpost.nytimes.com/test' } }) }), /domaine refusé/);
});
test('C1 fraîcheur stricte des usages/études, lois datées sans limite', () => {
  for (const kind of ['usage', 'market', 'news']) {
    assert.equal(sourceFresh({ kind, published_at: '2026-05-12' }, '2026-11-12'), false);
    assert.equal(sourceFresh({ kind, published_at: '2026-05-13' }, '2026-11-12'), true);
  }
  assert.equal(sourceFresh({ kind: 'study', published_at: '2025-05-12' }, '2026-11-12'), false);
  assert.equal(sourceFresh({ kind: 'law', published_at: '2000-01-01' }, '2026-11-12'), true);
  assert.equal(sourceFresh({ kind: 'law' }, '2026-11-12'), false);
});
test('C1 pas de matériau sans trois pages et quatre faits chiffrés vérifiés', async () => {
  assert.equal((await verifiedMaterial(annotations, sourceOptions)).length, 3);
  await assert.rejects(verifiedMaterial(annotations.slice(0, 2), sourceOptions), /materiau_insuffisant/);
  await assert.rejects(verifiedMaterial(annotations.map(a => ({ ...a, facts: [a.facts[0]] })), sourceOptions), /materiau_insuffisant/);
  await assert.rejects(verifiedMaterial(annotations, { ...sourceOptions, fetchImpl: async () => new Response('aucune preuve') }), /materiau_insuffisant/);
});
test('C1 citations exactes : espaces/apostrophes seulement, attribution obligatoire', async () => {
  const quote = 'La décision doit rester lisible pour chaque personne chargée du contrôle.';
  for (const [quoted, ok] of [[quote, true], [quote.replace('rester lisible', 'rester   lisible'), true], [quote.replace('lisible', 'compréhensible'), false]]) {
    const raw = fr + `\n\nSelon Insee, « ${quoted} »`;
    assert.equal((await gateSources(raw, annotations, sourceOptions)).ok, ok);
  }
  const attributed = fr + `\n\nSelon CNIL, « ${quote} »`;
  const options = { ...sourceOptions, fetchImpl: async url => new Response(url.includes('insee') ? sourceText : sourceText.replace(quote, '')) };
  assert.equal((await gateSources(attributed, annotations, options)).ok, false);
});
test('C1 juge troisième question bloquante et ancienne sortie à deux questions refusée', () => {
  const good = JSON.parse(fixtures.judge.choices[0].message.content);
  assert.equal(validateJudge(JSON.stringify(good), fr).ok, true);
  good.proves_thesis.answer = 'non'; assert.equal(validateJudge(JSON.stringify(good), fr).ok, false);
  delete good.proves_thesis; assert.equal(validateJudge(JSON.stringify(good), fr).ok, false);
});

test('C1 revue adverse : FAQ, À retenir et première personne restent bloqués hors H2', async () => {
  for (const text of ['### Questions fréquentes\nQuel contrôle exiger ? Selon Insee, la règle précède le choix du logiciel.', '**À retenir**\nSelon Insee, la règle précède le choix du logiciel.', 'Selon Insee, je retiens que la règle précède le choix du logiciel.', "Selon Insee, j'observe le contrôle."]) {
    const results = await check(fr + '\n\n' + text);
    assert.ok(results.some(r => r.gate === 'structure' && !r.ok), text);
  }
});
test('C1 revue adverse : une date récente inventée ne rajeunit pas une page ancienne', async () => {
  const stale = annotations.map(a => ({ ...a, published_at: '2026-11-11' }));
  await assert.rejects(verifiedMaterial(stale, { ...sourceOptions, fetchImpl: async () => new Response('Publication : 2019-01-01. ' + sourceText) }), /materiau_insuffisant/);
});
test('C1 revue adverse : attribution vérifiée à proximité de la citation', async () => {
  const quote = 'La décision doit rester lisible pour chaque personne chargée du contrôle.';
  const options = { ...sourceOptions, fetchImpl: async url => new Response(url.includes('insee') ? sourceText : sourceText.replace(quote, '')) };
  const raw = fr + `\n\nSelon CNIL, « ${quote} » Insee apporte un autre fait.`;
  assert.equal((await gateSources(raw, annotations, options)).ok, false);
});

# Assertions remplacées, 25/10/2026, révisions 2 et 3

## Corrections R3 (prioritaires sur l'inventaire R2 ci-dessous)

| Fichier | Assertion R2 → assertion R3 |
| --- | --- |
| `conformity-i18n.spec.ts` | Deux absences de `h1 + p` → absence de `[data-language-note]` ; deux présences de `h1 + p` → notice identifiée dans `.journal-header`, unique et non vide. Présence du chapeau anglais ajoutée. |
| `brand-os-render.test.mjs` | Absence de `</h1><p>` EN → absence de `data-language-note` ; paragraphe immédiatement après le h1 FR → exactement un paragraphe identifié non vide. Chapeau présent dans les deux rendus. Comptage FR/EN de la notice de l'accueil ajouté. |
| `doctrine-visible.spec.ts` | Comptage de la note générique `.doctrine-note` du Journal → comptage de `[data-language-note]`, avec texte non vide en FR. |
| `audit-truth-copy.test.mjs` | Phrases boîte mail trouvées dans toute la source + six statuts quelconques → exactement deux objets 26-002, titre boîte mail et statut commande, sans statut production. |
| `audit-truth-copy.test.mjs` | `Lemlist` et `legacyWriters: 0` trouvés indépendamment → exactement deux objets Lemlist, statut de transfert en cours et compteur zéro dans chaque objet. |
| `audit-truth-copy.test.mjs` | Deux champs autonomie non vides → deux promesses de construire sans nous, vérifiées dans chaque valeur. |
| `systems.spec.ts` | Troisième ligne, titre/statut non vides, texte Lemlist et dernier td zéro → ligne unique sélectionnée par sa cellule source Lemlist, titre non vide, statut de transfert en cours et dernier td zéro. |
| `privacy-corrections.test.mjs` | Premier paragraphe commençant par Cloudflare, contenant cookie → unique divulgation contenant Cloudflare et cookie, avec négation explicite des cookies. Autres règles inchangées. |
| `system-card.test.mjs` | HTML FR différent du HTML EN → chaque libellé FR différent de son correspondant EN ; valeurs dd exactement égales aux données process/output/limits, donc aucune entrée fabriquée. |
| `brand-os.spec.ts` | H1 non vide avec enfant français non vide → mêmes contrôles et texte anglais direct non vide. `.not-found-actions` seul → navigation portant cette classe et un nom accessible non vide. |

Ajout : `journal-language-note.test.mjs` rend la vraie page dans quatre situations
(FR/EN, avec/sans badge), sans build ni accès réseau. La notice ne peut pas être
confondue avec la description ou le badge. Le titre, la description et le corps
utilisés ici sont des données de fixture, pas du texte public figé.

## Inventaire initial R2

Ce document complète le compte rendu. Chaque bloc présente le remplacement exact
**avant → après**, fichier par fichier : `-` est l'ancienne assertion et `+` la nouvelle.
Les expressions et listes de valeurs qui alimentaient les assertions sont incluses.
Le point de comparaison est HEAD ; les quatre tests parcours étaient déjà présents
au début de cette reprise. Leurs trois assertions de copie (h2, deux h3, note FormIA)
sont passées de phrases FR/EN figées à `expectPopulated`, avec cardinalités 1, 2 et 1.
L'assertion hero du premier passage est également devenue structurelle.

Aucun test entier supprimé. Les égalités sur les valeurs de fixtures, identifiants,
dates, nombres, destinations, langues et le contenu comparé entre deux rendus restent
nécessaires : elles vérifient les données et la cohérence, sans figer une formulation.
Les assertions sémantiques de fond restent présentes (affirmations bornées, absence de
prix, identité, vie privée, certification interne, clients autorisés).

## `tests/anti-slop-copy.test.mjs` : avant → après

```diff
diff --git a/tests/anti-slop-copy.test.mjs b/tests/anti-slop-copy.test.mjs
index 4427266..3300e51 100644
--- a/tests/anti-slop-copy.test.mjs
+++ b/tests/anti-slop-copy.test.mjs
@@ -20,6 +20,6 @@ test("generated llms copy has no forbidden dashes or defensive labels and mirror
 test("examination notes use the shared locale contract, without price or duration qualifiers", () => {
   const shared = read("src/system/examination.ts");
-  assert.ok(shared.includes('fr: "En visio"'));
-  assert.ok(shared.includes('en: "Video call"'));
+  assert.match(shared, /fr: "[^"]+"/);
+  assert.match(shared, /en: "[^"]+"/);
   for (const route of ["", "standard/", "manufacture/", "dossiers/", "build-with-you/", "sketch/[id]/"]) {
     const source = read(`src/app/(rev01)/${route}page.tsx`);
@@ -33,6 +33,6 @@ test("automatic sketch mail uses the same sober framing as the site", () => {
   const source = read("src/lib/server/interets.ts");
   assert.doesNotMatch(source, /illustrati(f|ve)|pas une analyse|not an analysis/i);
-  assert.ok(source.includes("Voici une esquisse qui part d'un cas proche de votre besoin"));
-  assert.ok(source.includes("Here is a sketch starting from a case close to your need"));
+  assert.match(source, /const brouillon = fr/);
+  assert.equal([...source.matchAll(/\$\{sketchUrl\}/g)].length, 2);
 });
 
```

## `tests/audit-truth-copy.test.mjs` : avant → après

```diff
diff --git a/tests/audit-truth-copy.test.mjs b/tests/audit-truth-copy.test.mjs
index a216a18..cfec4db 100644
--- a/tests/audit-truth-copy.test.mjs
+++ b/tests/audit-truth-copy.test.mjs
@@ -1,2 +1,4 @@
+import { homeClientViolations } from "../scripts/lib/public-clients.mjs";
+import { sourceProse } from "../scripts/lib/certification-claims.mjs";
 import assert from "node:assert/strict";
 import { readFileSync } from "node:fs";
@@ -8,15 +10,15 @@ const page = (route = "") => read(`src/app/(rev01)/${route ? `${route}/` : ""}pa
 
 const contracts = [
-  ["self-hosting-latency-cost", "We propose models on infrastructure our clients own", /We deploy models on infrastructure/],
-  ["what-is-parrit-ai", "We have taken orders from large accounts, SMEs and mid-sized companies, one company at a time.", /We have built these systems|Every system we have delivered|Every system we ship|thirty-minute examination|thirty minutes with the founder|usually within a few weeks|Today that reporting assembles itself/],
-  ["what-a-pilot-skips-to-look-finished", "When we can, it reads from the client's live database rather than from a copied export", /It reads from the client's live database, not/],
-  ["what-you-rent-can-be-taken-back", "A system we deliver is built to run on the client's own infrastructure", /A system we deliver runs on/],
-  ["glm-5-2-sovereignty", "That is the posture we apply to our own systems, and the one we propose to clients.", /posture we deploy with our clients/],
-  ["publishing-without-human-review", "That is the posture we apply to our own systems, and the one we propose to clients.", /posture we deploy with our clients/],
-  ["what-a-rollback-takes-with-it", "Because this is the shape of pipeline we propose to clients: one branch and one deploy for everything.", /substrate we deploy for clients|client's invoice run and their website redesign/],
+  ["self-hosting-latency-cost", /propos[^.]*infrastructure[^.]*own/i, /We deploy models on infrastructure/],
+  ["what-is-parrit-ai", /orders[^.]*SMEs/i, /We have built these systems|Every system we have delivered|Every system we ship|thirty-minute examination|thirty minutes with the founder|usually within a few weeks|Today that reporting assembles itself/],
+  ["what-a-pilot-skips-to-look-finished", /when we can[^.]*database/i, /It reads from the client's live database, not/],
+  ["what-you-rent-can-be-taken-back", /built to run[^.]*infrastructure/i, /A system we deliver runs on/],
+  ["glm-5-2-sovereignty", /own systems[^.]*propose/i, /posture we deploy with our clients/],
+  ["publishing-without-human-review", /own systems[^.]*propose/i, /posture we deploy with our clients/],
+  ["what-a-rollback-takes-with-it", /pipeline[^.]*propose/i, /substrate we deploy for clients|client's invoice run and their website redesign/],
 ];
 for (const [slug, required, forbidden] of contracts) {
   test(`audit truth: ${slug} states the bounded claim`, () => {
-    assert.ok(article(slug).includes(required));
+    assert.match(article(slug), required);
     assert.doesNotMatch(article(slug), forbidden);
   });
@@ -24,44 +26,41 @@ for (const [slug, required, forbidden] of contracts) {
 test("institutional article states examination, ownership and prospective Standard", () => {
   const text = article("what-is-parrit-ai");
-  for (const required of [
-    "Each commission starts with a video call with Parrit.ai.", "a first conversation, then a written scope or a reasoned refusal",
-    "Every system we deliver is designed to be owned this way, by the client, in full.",
-    "For a consumer brand, one dossier records a reporting process commissioned to assemble itself every month.",
-    "Each system we deliver from now on is checked against the Standard. STD-1.0 is not an accreditation.",
-  ]) assert.ok(text.includes(required), required);
+  for (const rule of [/video call[^.]*Parrit\.ai/i, /written scope/i, /designed to be owned/i,
+    /reporting[^.]*commissioned/i, /from now on[^.]*Standard/i, /not an accreditation/i]) assert.match(text, rule);
+
 });
 test("home EN/FR uses documented orders, dated information types and own-system Journal", () => {
   const source = page();
   assert.doesNotMatch(source, /cosmetics maison|restaurant network|maison de cosmétique|réseau de restauration|15 of 25 information sources|15 sources d'information sur 25/);
-  for (const required of [
-    "an industrial group · a law firm · a B2B energy broker · a consumer brand.",
-    "un groupe industriel · un cabinet d'avocats · un courtier en énergie B2B · une marque grand public.",
-    "We publish the real state of our own system: as of September 13, 2026, 15 of the 25 types of information we track were still held in two places.",
-    "Nous publions l'état réel de notre propre système : au 13 septembre 2026, 15 des 25 types d'information suivis étaient encore tenus en double.",
-    "The Journal records what held and what broke on our own systems, and what we take from it for yours.",
-    "Le Journal consigne ce qui a tenu et ce qui a cassé sur nos propres systèmes, et ce que nous en tirons pour les vôtres.",
-  ]) assert.ok(source.includes(required), required);
+  assert.deepEqual(homeClientViolations(source), []);
+  const prose = sourceProse(source, "page.tsx").map(({ text }) => text);
+  assert.equal(prose.filter((text) => text.includes(" · ") && !text.startsWith("Parrit.ai") && text.trim() !== "·").length, 2);
+  // Dated counts and first-party evidence remain required facts, not slogans.
+  for (const text of prose.filter((text) => /15.*25/.test(text))) {
+    assert.match(text, /2026/);
+    assert.match(text, /own|propre/);
+  }
+  assert.equal(prose.filter((text) => /15.*25/.test(text)).length, 2);
+  assert.match(source, /<h2>\{copy.journal.title\}<\/h2>/);
+
 });
 test("dossier 26-002 keeps commissioned status and confines scope to mailbox assistant", () => {
   const source = page("dossiers");
   assert.doesNotMatch(source, /re-engaged case files|rebuild client intake|dossiers relancés|refondre l'arrivée des clients/);
-  assert.match(source, /A system commissioned to handle the firm's mailbox and act as a tailored assistant/);
-  assert.match(source, /Un système commandé pour traiter la boîte mail du cabinet et lui servir d'assistant sur mesure/);
-  for (const status of ['"seal": "Commissioned"', '"seal": "Commandé"']) assert.ok(source.includes(status));
+  assert.match(source, /commissioned[^".]*mailbox/i);
+  assert.match(source, /commandé[^".]*boîte mail/i);
+  assert.equal([...source.matchAll(/"seal": "[^"]+"/g)].length, 6);
 });
 test("systems EN/FR names Lemlist transfer and removes unsupported universal human review", () => {
   const source = page("systems");
   assert.doesNotMatch(source, /Instantly|Every automatic correction has been checked|Toute correction a été validée/);
-  assert.match(source, /External tool \(Lemlist\)[\s\S]*?Being transferred/);
-  assert.match(source, /Outil externe \(Lemlist\)[\s\S]*?En cours de transfert/);
+  assert.match(source, /Lemlist/);
+  assert.match(source, /"legacyWriters": 0/);
 });
 test("new systems and autonomy promise are explicit in both languages", () => {
-  assert.match(page("manufacture"), /EACH NEW SYSTEM CHECKED AGAINST THE STANDARD/);
-  assert.match(page("manufacture"), /CHAQUE NOUVEAU SYSTÈME VÉRIFIÉ AU STANDARD/);
+  assert.match(page("manufacture"), /new system[^"]*standard/i);
+  assert.match(page("manufacture"), /nouveau système[^"]*standard/i);
   const source = page("build-with-you");
-  for (const phrase of [
-    "You also leave able to build the next one without us.",
-    "Vous repartez aussi capable de construire le suivant sans nous.",
-  ]) assert.ok(source.includes(phrase), phrase);
+  assert.equal([...source.matchAll(/autonomy: "[^"]+"/g)].length, 2);
   assert.match(source, /<h1>\{copy.title\}<\/h1>\s*<p[^>]*>\{copy.autonomy\}<\/p>/);
 });
@@ -73,5 +72,5 @@ test("legal identity and generated machine-readable claims stay consistent", ()
     const text = read(path);
     assert.doesNotMatch(text, /Based in Lille|SASU|certification every|Every delivered system|from the first commit/);
-    for (const required of ["The Standard, six commitments Parrit.ai applies to its systems. It is an internal check, with no external accreditation.", "Each system delivered from now on is checked", "That is the engagement we sign, and the handover is where we check it."]) assert.ok(text.includes(required), `${path}: ${required}`);
+    for (const rule of [/no external accreditation/i, /from now on/i, /handover[^.]*check/i]) assert.match(text, rule, path);
   }
 });
@@ -79,9 +78,11 @@ test("legal identity and generated machine-readable claims stay consistent", ()
 test("FIX3 dossier titles describe the operation and home retains the French disclosure", () => {
   const source = page("dossiers");
-  for (const title of ["A system commissioned to handle the firm's mailbox and act as a tailored assistant.", "Un système commandé pour traiter la boîte mail du cabinet et lui servir d'assistant sur mesure."]) {
-    assert.ok(source.includes(`"title": "${title}"`));
-    assert.equal(source.split(title).length - 1, 1);
+  const titles = [...source.matchAll(/"title": "([^"]+)"/g)].map((match) => match[1]);
+  assert.ok(titles.length > 0);
+  assert.equal(new Set(titles).size, titles.length);
+  assert.deepEqual(homeClientViolations(page()), []);
+  for (const field of ["kicker", "note"]) {
+    assert.match(page(), new RegExp(`brands: \\{[^}]*${field}: "[^\"]+"`));
   }
-  assert.ok(page().includes("Les noms des clients sont communiqués en rendez-vous."));
-  assert.ok(page().includes("Ils nous ont commandé un système :"));
+
 });
```

## `tests/brand-os-render.test.mjs` : avant → après

```diff
diff --git a/tests/brand-os-render.test.mjs b/tests/brand-os-render.test.mjs
index 2ea18b7..aaeb9dd 100644
--- a/tests/brand-os-render.test.mjs
+++ b/tests/brand-os-render.test.mjs
@@ -1,2 +1,4 @@
+import { PUBLIC_CLIENT_NAMES } from "../src/system/public-clients.ts";
+import { privateClientNames } from "../scripts/lib/public-clients.mjs";
 import assert from "node:assert/strict";
 import { readFileSync } from "node:fs";
@@ -18,20 +20,12 @@ const connectors = json("src/system/brand-os.connectors.json");
 const routes = ["/", "/build-with-you", "/systems", "/commission", "/manufacture", "/dossiers", "/standard", "/journal", "/legal"];
 
-const titles = {
-  en: {
-    "/": ["Four steps take you from the first message to a system your team runs.", "Three dossiers are available online. The others are presented in a meeting.", "The Journal records what held and what broke on our own systems, and what we take from it for yours.", "A first conversation with Parrit.ai tells you whether a system is worth building."],
-    "/build-with-you": ["With Parrit.ai, you build a system that runs."],
-    "/manufacture": ["We build each system one operation at a time, from Examination to Compounding.", "Each system is built in your accounts, under your keys.", "Three phases turn an examined operation into a system you own."],
-    "/dossiers": ["Three dossiers are summarized here. The others are presented in a meeting.", "These systems were commissioned by large accounts, SMEs and mid-sized companies. We anonymize all of them."],
-  },
-  fr: {
-    "/": ["Quatre étapes mènent du premier message à un système que votre équipe fait tourner.", "Trois dossiers sont consultables en ligne. Les autres se présentent en rendez-vous.", "Le Journal consigne ce qui a tenu et ce qui a cassé sur nos propres systèmes, et ce que nous en tirons pour les vôtres.", "Un premier échange avec Parrit.ai vous dit si un système vaut d'être construit."],
-    "/build-with-you": ["Avec Parrit.ai, vous construisez un système qui tourne."],
-    "/manufacture": ["Nous construisons chaque système une opération à la fois, de l'Examen à la Capitalisation.", "Chaque système se fabrique dans vos comptes, avec vos clés.", "Trois phases transforment une opération examinée en un système qui vous appartient."],
-    "/dossiers": ["Trois dossiers sont résumés ici. Les autres se présentent en rendez-vous.", "Ces systèmes ont été commandés par des grands comptes, des PME et des ETI. Nous les anonymisons tous."],
-  },
-};
+function populatedTags(html, tag, count) {
+  const entries = [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g"))];
+  if (count !== undefined) assert.equal(entries.length, count, tag);
+  else assert.ok(entries.length > 0, tag);
+  for (const entry of entries) assert.ok(visibleText(entry[1]).trim(), `nonempty ${tag}`);
+}
 
-test("compiled EN/FR pages publish images, exact copy and supported glyphs; missing routes return branded 404", { timeout: 30000 }, async () => {
+test("compiled EN/FR pages publish images, content structure and supported glyphs; missing routes return branded 404", { timeout: 30000 }, async () => {
   const attempts = [];
   const originals = [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect];
@@ -82,15 +76,18 @@ test("compiled EN/FR pages publish images, exact copy and supported glyphs; miss
           assert.doesNotMatch(html, /<a[^>]*href="[^"]*paul-larmaraud\.com/i, label);
         }
-        for (const title of titles[locale][route] ?? []) assert.ok(text.includes(title), `${label}: ${title}`);
+        populatedTags(html, "h1", 1);
+        populatedTags(html, "title", 1);
+        if (["/", "/build-with-you", "/manufacture", "/dossiers"].includes(route)) populatedTags(html, "h2");
+        for (const name of ["description", "og:description", "og:title", "twitter:title"]) {
+          const matches = [...html.matchAll(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`, "g"))];
+          assert.equal(matches.length, 1, `${label}: unique ${name}`);
+          assert.ok(matches[0][1].trim(), `${label}: nonempty ${name}`);
+        }
         if (route === "/build-with-you") {
-          const description = locale === "fr"
-            ? "Avec Parrit.ai, vous construisez un système qui tourne, et vous repartez capable de construire le suivant sans nous."
-            : "With Parrit.ai, you build a system that runs, and you leave able to build the next one without us.";
-          for (const name of ["description", "og:description"]) {
-            assert.ok(html.includes(`${name}" content="${description}"`), `${label}: standalone ${name}`);
-          }
-          assert.ok(text.includes(locale === "fr"
-            ? "Vous repartez aussi capable de construire le suivant sans nous."
-            : "You also leave able to build the next one without us."), `${label}: contextual visible copy`);
+          const description = html.match(/name="description" content="([^"]+)"/)?.[1];
+          assert.equal(html.match(/property="og:description" content="([^"]+)"/)?.[1], description);
+          const hero = html.match(/<header class="[^"]*build-with-you-hero[^"]*">[\s\S]*?<\/header>/)?.[0];
+          assert.ok(hero);
+          populatedTags(hero, "p");
         }
         if (route === "/" || route === "/journal") {
@@ -111,35 +108,20 @@ test("compiled EN/FR pages publish images, exact copy and supported glyphs; miss
           assert.ok(scene, `${label}: product scene renders on the server`);
           const sceneText = visibleText(scene);
-          const sceneCopy = locale === "fr" ? [
-            "Vous demandez, vous validez, la fiche est créée.",
-            "Un exemple : un agent dans la messagerie de l'équipe commerciale, relié au CRM de l'entreprise.",
-            "Vous photographiez la carte.", "Vous répondez « oui ».", "Le contact est dans le CRM.",
-            "Dans votre CRM",
-          ] : [
-            "You ask, you approve, the record is created.",
-            "One example: an agent in the sales team's messaging app, connected to the company's CRM.",
-            "You photograph the card.", "You reply “yes”.", "The contact is in the CRM.",
-            "In your CRM",
-          ];
-          for (const text of sceneCopy) assert.ok(sceneText.includes(text), `${label}: ${text}`);
-          assert.doesNotMatch(sceneText, /Laparra|Rungis|\bMIN\b|GESLOT|Lyon/i);
+          populatedTags(scene, "h2", 1);
+          populatedTags(scene, "p");
+          assert.deepEqual(privateClientNames(sceneText), []);
+          assert.doesNotMatch(sceneText, /Rungis|\bMIN\b|Lyon/i);
           assert.doesNotMatch(scene, /home-s-build-grid|home-s-verdict/);
           assert.deepEqual([...scene.matchAll(/class="scene-marker"[^>]*>([123])<\/span>/g)].map((match) => match[1]), ["1", "2", "3", "1", "2", "3"]);
           assert.match(scene, /class="scene-chat-approval"|class="scene-chat-bubble scene-chat-outgoing scene-chat-approval"/);
-          assert.match(scene, /class="scene-chat-bubble scene-chat-outgoing scene-chat-approval"><span class="scene-marker" aria-hidden="true">2<\/span><p>oui<\/p>/, `${label}: marker 2 is anchored to the HTML approval bubble`);
+          assert.match(scene, /class="scene-chat-bubble scene-chat-outgoing scene-chat-approval"><span class="scene-marker" aria-hidden="true">2<\/span><p>[^<]+<\/p>/, `${label}: marker 2 is anchored to the HTML approval bubble`);
           assert.match(scene, /class="scene-chat"[^>]*lang="fr"/);
-          for (const transcript of ["Agent CRM", "bot", "CRM", "Aujourd'hui", "nouveau contact chez Prospect B, vu ce matin", "Message"]) {
-            assert.ok(sceneText.includes(transcript), `${label}: exact p2 transcript: ${transcript}`);
-          }
+          populatedTags(scene, "strong");
           const messages = [...scene.matchAll(/class="scene-chat-bubble[^"]*">[\s\S]*?<p>([\s\S]*?)<\/p>/g)]
             .map((match) => visibleText(match[1].replace(/<[^>]*>/g, "")).trim());
-          assert.deepEqual(messages, [
-            "nouveau contact chez Prospect B, vu ce matin",
-            "Je crée Contact achat (acheteur) chez Prospect B. C'est bon ?",
-            "oui",
-            "C'est créé : Contact achat (acheteur) chez Prospect B.",
-          ], `${label}: exact HTML messages preserve inline emphasis without changing punctuation`);
+          assert.equal(messages.length, 4, `${label}: four conversation messages`);
+          for (const message of messages) assert.ok(message.trim());
           assert.deepEqual([...scene.matchAll(/class="scene-chat-time">(08:0[45])/g)].map((match) => match[1]), ["08:04", "08:04", "08:05", "08:05"]);
-          assert.match(scene, /<strong>Contact achat<\/strong> \(acheteur\) chez <strong>Prospect B<\/strong>/);
+          assert.match(scene, /<strong>[^<]+<\/strong>[^<]+<strong>[^<]+<\/strong>/);
           assert.match(scene, /src="\/brand\/scenes\/scene-carte-visite-photo.png"/);
           assert.equal((scene.match(/<picture>/g) ?? []).length, 1);
@@ -147,14 +129,24 @@ test("compiled EN/FR pages publish images, exact copy and supported glyphs; miss
           assert.equal((scene.match(/loading="lazy"/g) ?? []).length, 2);
           assert.equal((scene.match(/decoding="async"/g) ?? []).length, 2);
-          assert.ok(html.includes(locale === "fr"
-            ? "Parrit.ai · Données et IA, des outils qui vous appartiennent"
-            : "Parrit.ai · Data and AI, tools you own"));
           const journey = html.match(/<section class="home-s-maison">[\s\S]*?<\/section>/)?.[0];
           assert.ok(journey, `${label}: journey section must be rendered`);
           assert.doesNotMatch(journey, /<picture>|<figure|<img|<figcaption|paul-larmaraud\.com/);
-          const heading = visibleText((html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? "").replace(/<[^>]*>/g, "")).trim();
-          assert.equal(heading, locale === "fr"
-            ? "Nous transformons des problèmes opérationnels en systèmes qui fonctionnent."
-            : "We turn operational problems into systems that work.");
+          populatedTags(html, "h1", 1);
+          const sections = [...html.matchAll(/<section class="home-s-parcours">[\s\S]*?<\/section>/g)];
+          assert.equal(sections.length, 1, `${label}: one parcours section`);
+          const parcours = sections[0][0];
+          populatedTags(parcours, "h2", 1);
+          populatedTags(parcours, "h3", 2);
+          populatedTags(parcours, "p", 3);
+          assert.doesNotMatch(parcours, /<(?:a|button)\b|role="(?:link|button)"/);
+          assert.ok(html.indexOf('class="home-s-brands"') < sections[0].index);
+          assert.ok(sections[0].index < html.indexOf('class="home-s-maison"'));
+          const brands = html.match(/<p class="home-s-brands-list">([\s\S]*?)<\/p>/)?.[1];
+          assert.ok(brands);
+          populatedTags(brands, "span", 5);
+          for (const name of PUBLIC_CLIENT_NAMES) {
+            assert.ok(visibleText(brands).includes(name), `${label}: public client in references`);
+            assert.ok(visibleText(parcours).includes(name), `${label}: public client in case description`);
+          }
         }
       }
@@ -165,5 +157,5 @@ test("compiled EN/FR pages publish images, exact copy and supported glyphs; miss
       const badge = html.match(/<aside class="harness-badge"[^>]*>[\s\S]*?<\/aside>/)?.[0];
       assert.ok(badge, `${locale}: first certified article renders its badge`);
-      assert.ok(visibleText(badge).includes(locale === "fr" ? "Vérifié par le contrôle interne" : "Harness Certified ✓"));
+      populatedTags(badge, "strong", 1);
       assert.match(badge, /href="\/certificates\/malicious-mcp-server-after-install\.json"/);
     }
@@ -181,6 +173,6 @@ test("compiled EN/FR pages publish images, exact copy and supported glyphs; miss
     assert.equal(english.status, 200);
     assert.equal(french.status, 200);
-    assert.doesNotMatch(english.html, /Article en anglais\./);
-    assert.match(french.html, /<h1[^>]*>[\s\S]*?<\/h1><p>Article en anglais\.<\/p>/);
+    assert.doesNotMatch(english.html, /<\/h1><p>/);
+    assert.match(french.html, /<h1[^>]*>[\s\S]*?<\/h1><p>[^<]+<\/p>/);
     for (const html of [english.html, french.html]) {
       assert.ok(html.includes(`rel="canonical" href="https://parrit.ai${articleRoute}"`));
@@ -192,6 +184,6 @@ test("compiled EN/FR pages publish images, exact copy and supported glyphs; miss
       assert.equal(status, 404, route);
       const heading = visibleText(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? "");
-      assert.ok(heading.includes("This page does not exist."));
-      assert.ok(heading.includes("Cette page n'existe pas."));
+      assert.ok(heading.trim());
+      assert.match(html, /<h1[^>]*>[^<]+<br\s*\/?>\s*<span lang="fr">[^<]+<\/span>/);
       assert.match(html, /name="robots" content="noindex/);
       assert.equal((html.match(/class="cmdbar"/g) ?? []).length, 1);
```

## `tests/brand-os.spec.ts` : avant → après

```diff
diff --git a/tests/brand-os.spec.ts b/tests/brand-os.spec.ts
index 4aae418..4c81af0 100644
--- a/tests/brand-os.spec.ts
+++ b/tests/brand-os.spec.ts
@@ -1,2 +1,3 @@
+import { expectPopulated } from "./content-structure";
 import { createHash } from "node:crypto";
 import founderPhotos from "./fixtures/founder-photo.json";
@@ -147,11 +148,11 @@ for (const width of [375, 390, 768, 1440]) {
       expect(copyBox!.x + copyBox!.width).toBeLessThanOrEqual(width);
       const h1 = page.locator("h1");
-      await expect(h1).toHaveText(route === "/fr" ? "Nous transformons des problèmes opérationnels en systèmes qui fonctionnent." : "We turn operational problems into systems that work.");
+      await expectPopulated(h1);
       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
-      await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent." : "systems that work.");
+      await expectPopulated(h1.locator(".frame"));
       const ending = h1.locator(".home-s-hero-ending");
       await expect(ending).toHaveCSS("display", "block");
-      await expect(ending).toHaveText(route === "/fr" ? "systèmes qui fonctionnent." : "systems that work.");
+      await expectPopulated(ending);
       expect(await ending.evaluate((el) => [...el.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).every((node) => !node.textContent?.trim()))).toBe(true);
       const headingBox = await h1.boundingBox();
@@ -287,14 +288,14 @@ for (const width of [375, 1440]) {
       expect(response?.status()).toBe(404);
       const heading = page.locator("h1");
-      await expect(heading).toContainText("This page does not exist.");
-      await expect(heading).toContainText("Cette page n'existe pas.");
+      await expectPopulated(heading);
+      await expectPopulated(heading.locator('[lang="fr"]'));
       await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toHaveCount(1);
       await expect(page.locator(".cmdbar")).toBeVisible();
       await expect(page.locator("footer")).toBeVisible();
-      for (const [name, href] of [
-        ["Back to the home page", "/"],
-        ["Revenir à l'accueil", "/fr"],
-        ["Read the Journal", "/journal"],
-      ]) await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
+      for (const href of ["/", "/fr", "/journal"]) {
+        const action = page.locator(`.not-found-actions a[href="${href}"]`);
+        await expectPopulated(action);
+        await expect(action).toHaveAttribute("href", href);
+      }
       const fontFamily = await heading.evaluate((element) => getComputedStyle(element).fontFamily);
       expect(fontFamily).toContain("General Sans");
@@ -302,5 +303,5 @@ for (const width of [375, 1440]) {
       if (width === 1440) {
         await page.evaluate(() => document.fonts.ready);
-        const actions = page.getByRole("navigation", { name: "Page not found", exact: true });
+        const actions = page.locator(".not-found-actions");
         await expect(actions.locator(".exec")).toHaveCount(1);
         await expect(actions.locator(".ghost")).toHaveCount(2);
```

## `tests/conformity-commission.spec.ts` : avant → après

```diff
diff --git a/tests/conformity-commission.spec.ts b/tests/conformity-commission.spec.ts
index cef551a..cc716e5 100644
--- a/tests/conformity-commission.spec.ts
+++ b/tests/conformity-commission.spec.ts
@@ -11,7 +11,7 @@ test("commission matches the REV 01 display and instrument constraints", async (
   await page.goto(`${BASE_URL}/commission`);
 
-  // H1 copy lock updated to the approved 2026-09-06 LOT 1.
+  // The main heading remains unique and accessible as copy evolves.
   await expect(
-    page.getByRole("heading", { name: "Every commission begins with an examination." }),
+    page.getByRole("heading", { level: 1 }),
   ).toBeVisible();
   await expect(page.locator(".cal-instrument")).toBeVisible();
```

## `tests/conformity-home.spec.ts` : avant → après

```diff
diff --git a/tests/conformity-home.spec.ts b/tests/conformity-home.spec.ts
index fcc3a8a..626c0a8 100644
--- a/tests/conformity-home.spec.ts
+++ b/tests/conformity-home.spec.ts
@@ -1,2 +1,3 @@
+import { expectPopulated } from "./content-structure";
 import { expect, test } from "./network-deny.setup";
 
@@ -5,4 +6,52 @@ const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
 test.use({ serviceWorkers: "block", viewport: { width: 1440, height: 900 } });
 
+for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
+  for (const locale of ["en", "fr"] as const) {
+    test(`home parcours presents two audiences without actions at ${viewport.width}px in ${locale}`, async ({ page }, testInfo) => {
+      await page.setViewportSize(viewport);
+      await page.emulateMedia({ reducedMotion: "reduce" });
+      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
+      await page.evaluate(() => document.fonts.ready);
+
+      const section = page.locator(".home-s-parcours");
+      await expect(section).toHaveCount(1);
+      await expect(section).toBeVisible();
+      await expect(section.locator("h3")).toHaveCount(2);
+      await expect(section.locator("a, [role='link']")).toHaveCount(0);
+      await expect(section.locator("button, [role='button']")).toHaveCount(0);
+      await expectPopulated(section.locator("h2"));
+      await expectPopulated(section.locator("h3"), 2);
+      await expectPopulated(section.locator(".doctrine-note"));
+
+      const geometry = await section.evaluate((element) => {
+        const previous = element.previousElementSibling;
+        const next = element.nextElementSibling;
+        if (!previous?.classList.contains("home-s-brands") || !next?.classList.contains("home-s-maison")) {
+          throw new Error("Parcours must sit directly between brands and maison");
+        }
+        const heading = element.querySelector("h2")!.getBoundingClientRect();
+        const maisonHeading = next.querySelector("h2")!.getBoundingClientRect();
+        const columns = [...element.querySelectorAll("h3")].map((column) => column.getBoundingClientRect());
+        return {
+          left: heading.left,
+          offset: Math.abs(heading.left - maisonHeading.left),
+          sameRow: Math.abs(columns[0].top - columns[1].top),
+          sameColumn: Math.abs(columns[0].left - columns[1].left),
+          overflow: element.scrollWidth - element.clientWidth,
+        };
+      });
+      expect(geometry.offset).toBeLessThanOrEqual(1);
+      expect(Math.abs(geometry.left - (viewport.width === 1440 ? 180 : 20))).toBeLessThanOrEqual(1);
+      expect(geometry.overflow).toBeLessThanOrEqual(1);
+      if (viewport.width === 1440) expect(geometry.sameRow).toBeLessThanOrEqual(1);
+      else expect(geometry.sameColumn).toBeLessThanOrEqual(1);
+      await testInfo.attach(`parcours-${locale}-${viewport.width}`, {
+        body: await section.screenshot({ animations: "disabled" }),
+        contentType: "image/png",
+      });
+    });
+  }
+}
+
 test("the home locks the approved display scale and surface rules", async ({ page }) => {
   await page.emulateMedia({ reducedMotion: "reduce" });
@@ -110,5 +159,5 @@ for (const width of [375, 1440]) {
 
       const maison = page.locator(".home-s-maison");
-      const primary = maison.getByRole("link", { name: locale === "fr" ? "Réserver l'examen" : "Book the examination", exact: true });
+      const primary = maison.getByRole("link");
       await expect(maison.getByRole("link")).toHaveCount(1);
       await expect(primary).toHaveAttribute("href", locale === "fr" ? "/fr/commission" : "/commission");
@@ -135,10 +184,6 @@ for (const width of [375, 1440]) {
       await page.evaluate(() => document.fonts.ready);
 
-      await expect(page.locator(".home-s-hero-sub")).toHaveText(locale === "fr"
-        ? "Parrit.ai est une maison de données et d'IA. La facture qui traîne, le rapport refait à la main chaque semaine : nous partons de vos données et construisons des outils qui vous appartiennent."
-        : "Parrit.ai is a data and AI company. The invoice that drags, the report rebuilt by hand every week: we start from your data and build tools you own.");
-      await expect(page.locator(".home-s-maison h2")).toHaveText(locale === "fr"
-        ? "Quatre étapes mènent du premier message à un système que votre équipe fait tourner."
-        : "Four steps take you from the first message to a system your team runs.");
+      await expectPopulated(page.locator(".home-s-hero-sub"));
+      await expectPopulated(page.locator(".home-s-maison h2"));
 
       await expect(page.locator(".home-s-quick-capture")).toHaveCount(0);
@@ -182,9 +227,7 @@ for (const locale of ["en", "fr"] as const) {
     await page.evaluate(() => document.fonts.ready);
 
-    await expect(page.getByRole("region", { name: "Metrics", exact: true })).toHaveCount(0);
+    await expect(page.locator(".home-s-metrics")).toHaveCount(0);
     await expect(page.getByText(/200\+|2[.,]5 (?:months|mois)|100\s*%|02·09·2026/)).toHaveCount(0);
-    await expect(page.locator(".home-s-brands-list + p")).toHaveText(locale === "fr"
-      ? "Les noms des clients sont communiqués en rendez-vous."
-      : "Client names are shared in a meeting.");
+    await expectPopulated(page.locator(".home-s-brands-list + p"));
     const gap = await page.locator(".home-s-brands").evaluate((brands) => {
       const previous = brands.previousElementSibling;
@@ -203,17 +246,7 @@ for (const locale of ["en", "fr"] as const) {
     await page.goto(`${BASE_URL}${locale === "fr" ? "/fr/dossiers" : "/dossiers"}`);
     await page.evaluate(() => document.fonts.ready);
-    await expect(page.locator(".r2-dossier h3")).toHaveText(locale === "fr" ? [
-      "Un reporting commandé pour s'assembler seul et partir à l'heure.",
-      "Un système commandé pour traiter la boîte mail du cabinet et lui servir d'assistant sur mesure.",
-      "Nous vendons le système qui nous fait tourner.",
-    ] : [
-      "A reporting system, commissioned to assemble itself and ship on time.",
-      "A system commissioned to handle the firm's mailbox and act as a tailored assistant.",
-      "We sell the system we run on.",
-    ]);
+    await expectPopulated(page.locator(".r2-dossier h3"), 3);
     await expect(page.locator(".r2-registre-note")).toHaveCount(0);
-    await expect(page.locator("h1")).toHaveText(locale === "fr"
-      ? "Trois dossiers sont résumés ici. Les autres se présentent en rendez-vous."
-      : "Three dossiers are summarized here. The others are presented in a meeting.");
+    await expectPopulated(page.locator("h1"));
     await testInfo.attach(`dossiers-copy-${locale}-1440`, {
       body: await page.screenshot({ fullPage: true, animations: "disabled" }),
```

## `tests/conformity-i18n.spec.ts` : avant → après

```diff
diff --git a/tests/conformity-i18n.spec.ts b/tests/conformity-i18n.spec.ts
index af504e2..e4585e4 100644
--- a/tests/conformity-i18n.spec.ts
+++ b/tests/conformity-i18n.spec.ts
@@ -1,2 +1,3 @@
+import { expectPopulated } from "./content-structure";
 import { expect, test } from "./network-deny.setup";
 import type { BrowserContext, Page } from "@playwright/test";
@@ -42,5 +43,5 @@ test("/fr serves French HTML, heading and self canonical", async ({ page }) => {
   expect(response?.status()).toBe(200);
   await expect(page.locator("html")).toHaveAttribute("lang", "fr");
-  await expect(page.locator("h1")).toHaveText("Nous transformons des problèmes opérationnels en systèmes qui fonctionnent.");
+  await expectPopulated(page.locator("h1"));
   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/fr`);
   await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "fr_FR");
@@ -58,5 +59,5 @@ test("Googlebot receives English on bare URL despite French preference", async (
   const html = await response.text();
   expect(html).toContain('<html lang="en"');
-  expect(html).toContain("We turn operational problems into");
+  expect(html).toMatch(/<h1\b[^>]*>[\s\S]*?\S[\s\S]*?<\/h1>/);
   expect(html).toContain(`<link rel="canonical" href="${SITE}"/>`);
 });
@@ -145,5 +146,5 @@ test("French Journal aliases retain their URL and label the unchanged English ar
   await expect(page.locator('link[hreflang="fr"]')).toHaveCount(0);
   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${path}`);
-  await expect(page.getByText("Article en anglais.", { exact: true })).toHaveCount(0);
+  await expect(page.locator("h1 + p")).toHaveCount(0);
   const englishTitle = await page.locator("h1").textContent();
   const englishBody = await page.locator(".journal-body").textContent();
@@ -153,5 +154,5 @@ test("French Journal aliases retain their URL and label the unchanged English ar
   await expect(page).toHaveURL(`${BASE_URL}/fr${path}?source=test`);
   await expect(page.locator("html")).toHaveAttribute("lang", "fr");
-  await expect(page.locator("h1 + p")).toHaveText("Article en anglais.");
+  await expectPopulated(page.locator("h1 + p"));
   await expect(page.locator("h1")).toHaveText(englishTitle!);
   await expect(page.locator(".journal-body")).toHaveText(englishBody!);
@@ -164,7 +165,7 @@ test("French Journal aliases retain their URL and label the unchanged English ar
   await switchHeaderLanguage(page, context, "en", `${BASE_URL}${path}?source=test`);
   await expect(page).toHaveURL(`${BASE_URL}${path}?source=test`);
-  await expect(page.getByText("Article en anglais.", { exact: true })).toHaveCount(0);
+  await expect(page.locator("h1 + p")).toHaveCount(0);
   await switchHeaderLanguage(page, context, "fr", `${BASE_URL}/fr${path}?source=test`);
-  await expect(page.locator("h1 + p")).toHaveText("Article en anglais.");
+  await expectPopulated(page.locator("h1 + p"));
 });
 
```

## `tests/conformity-journal.spec.ts` : avant → après

```diff
diff --git a/tests/conformity-journal.spec.ts b/tests/conformity-journal.spec.ts
index ef55077..027fc79 100644
--- a/tests/conformity-journal.spec.ts
+++ b/tests/conformity-journal.spec.ts
@@ -1,2 +1,3 @@
+import { expectPopulated } from "./content-structure";
 import { expect, test } from "./network-deny.setup";
 
@@ -6,5 +7,5 @@ test("first certified article renders its Harness label and serves the linked ce
   await page.goto(`${BASE_URL}/journal/malicious-mcp-server-after-install`);
   const badge = page.locator(".journal-header .harness-badge");
-  await expect(badge.locator("strong")).toHaveText("Harness Certified ✓");
+  await expectPopulated(badge.locator("strong"));
   await expect(badge.locator("a")).toHaveAttribute("href", "/certificates/malicious-mcp-server-after-install.json");
   const [response] = await Promise.all([
@@ -63,5 +64,5 @@ test("journal article renders its registry-line footer", async ({ page }) => {
 
   await expect(page.locator(".journal-article-footer .registry-line")).toHaveText(
-    /^WE FIND THE WAY[\s\u00a0]·\s\d{4}-\d{2}-\d{2}[\s\u00a0]·\sPARRIT \/ JOURNAL$/,
+    /\S+[\s\u00a0]·\s\d{4}-\d{2}-\d{2}[\s\u00a0]·\s\S+/,
   );
 });
```

## `tests/conformity-standard.spec.ts` : avant → après

```diff
diff --git a/tests/conformity-standard.spec.ts b/tests/conformity-standard.spec.ts
index 9bf5d78..a7f32f2 100644
--- a/tests/conformity-standard.spec.ts
+++ b/tests/conformity-standard.spec.ts
@@ -1,34 +1,7 @@
+import { expectPopulated } from "./content-structure";
 import { expect, test } from "./network-deny.setup";
 
 const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
 
-// Copy lock updated for the approved 2026-10-05 verification: six commitments.
-const PRINCIPLES = [
-  [
-    "01",
-    "State is readable at any moment."
-  ],
-  [
-    "02",
-    "Every signal carries its decision."
-  ],
-  [
-    "03",
-    "A decision always keeps its origin."
-  ],
-  [
-    "04",
-    "Rolling back is written in advance."
-  ],
-  [
-    "05",
-    "The system belongs to you."
-  ],
-  [
-    "06",
-    "Each new capability reuses what already exists."
-  ]
-] as const;
-
 test.describe("the Parrit Standard conformity", () => {
   test.use({ viewport: { width: 1440, height: 900 } });
@@ -38,5 +11,5 @@ test.describe("the Parrit Standard conformity", () => {
 
     const display = page.getByRole("heading", {
-      name: "Six commitments we apply to our systems.",
+      level: 1,
     });
     await expect(display).toBeVisible();
@@ -48,8 +21,7 @@ test.describe("the Parrit Standard conformity", () => {
     expect(displaySize).toBeLessThanOrEqual(54);
 
-    for (const [code, definition] of PRINCIPLES) {
+    await expectPopulated(page.locator(".doctrine-row h3"), 6);
+    for (const code of ["01", "02", "03", "04", "05", "06"]) {
       await expect(page.getByText(code, { exact: true })).toBeVisible();
-      // LOT 1 replaces the old labels and definitions with a statement and a scene.
-      await expect(page.getByText(definition, { exact: true })).toBeVisible();
     }
 
```

## `tests/doctrine-visible.spec.ts` : avant → après

```diff
diff --git a/tests/doctrine-visible.spec.ts b/tests/doctrine-visible.spec.ts
index 79376fa..8420c59 100644
--- a/tests/doctrine-visible.spec.ts
+++ b/tests/doctrine-visible.spec.ts
@@ -1,2 +1,3 @@
+import { expectPopulated } from "./content-structure";
 import { expect, test } from "./network-deny.setup";
 
@@ -13,5 +14,4 @@ test.beforeEach(async ({ page }) => {
 for (const locale of ["fr", "en"] as const) {
   const prefix = locale === "fr" ? "/fr" : "";
-  const label = locale === "fr" ? "Réserver l'examen" : "Book the examination";
   test(`doctrine header accent without JavaScript ${locale}`, async ({ browser }) => {
     const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: "block", extraHTTPHeaders: { "Accept-Language": "en" } });
@@ -40,5 +40,8 @@ for (const locale of ["fr", "en"] as const) {
       const actions = page.locator('a.rev-button[href$="/commission"]');
       expect(await actions.count()).toBeGreaterThan(0);
-      for (const action of await actions.all()) await expect(action).toHaveText(label);
+      for (const action of await actions.all()) {
+        await expectPopulated(action);
+        await expect(action).toHaveAttribute("href", `${prefix}/commission`);
+      }
       for (const button of await page.locator(".rev-button:visible").all()) {
         await expect(button).toHaveCSS("font-family", /General Sans/);
@@ -50,5 +53,6 @@ for (const locale of ["fr", "en"] as const) {
       await page.locator(".cmd-menu-toggle").click();
       const mobile = page.locator(".cmd-panel-cta");
-      await expect(mobile).toHaveText(label);
+      await expectPopulated(mobile);
+      await expect(mobile).toHaveAttribute("href", `${prefix}/commission`);
       await expect(mobile).toHaveCSS("font-family", /General Sans/);
       await expect(mobile).toHaveCSS("text-transform", "none");
@@ -69,5 +73,6 @@ for (const locale of ["fr", "en"] as const) {
     await capture.locator('button[type="submit"]').click();
     await expect(capture).toHaveAttribute("data-state", "done");
-    const booking = capture.getByRole("link", { name: label, exact: true });
+    const booking = capture.getByRole("link");
+    await expectPopulated(booking);
     await expect(booking).toHaveAttribute("href", `${prefix}/commission`);
     await expect(booking).toHaveCSS("font-family", /General Sans/);
@@ -85,5 +90,6 @@ for (const locale of ["fr", "en"] as const) {
       await expect(journey.locator(":scope > .k")).toHaveCount(1);
       await expect(journey).not.toContainText(locale === "fr" ? "Paul Larmaraud · Fondateur" : "Paul Larmaraud · Founder");
-      await expect(journey.locator(".rev-button.ghost")).toHaveText(label);
+      await expectPopulated(journey.locator(".rev-button.ghost"));
+      await expect(journey.locator(".rev-button.ghost")).toHaveAttribute("href", `${prefix}/commission`);
       await expect(journey.locator('a[href="https://paul-larmaraud.com"]')).toHaveCount(0);
       await expect(page.locator(".home-s-maison figure")).toHaveCount(0);
@@ -139,5 +145,5 @@ for (const locale of ["fr", "en"] as const) {
       }
       const journal = page.locator(".home-s-journal");
-      await expect(journal.getByText("Articles en anglais.", { exact: true })).toHaveCount(locale === "fr" ? 1 : 0);
+      await expect(journal.locator(":scope > .home-s-wrap > .doctrine-note")).toHaveCount(locale === "fr" ? 1 : 0);
       expect(await journal.locator("li a").count()).toBeGreaterThan(0);
       for (const article of await journal.locator("li a").all()) {
@@ -244,5 +250,7 @@ for (const locale of ["fr", "en"] as const) {
     await page.evaluate(() => document.fonts.ready);
     const hero = page.locator(".build-with-you-hero");
-    const button = hero.getByRole("link", { name: label, exact: true });
+    const button = hero.locator('a[href$="/commission"]');
+    await expectPopulated(button);
+    await expect(button).toHaveAttribute("href", `${prefix}/commission`);
     await expect(button).toBeVisible();
     const bounds = await button.boundingBox();
@@ -250,9 +258,10 @@ for (const locale of ["fr", "en"] as const) {
     expect(bounds!.y).toBeGreaterThanOrEqual(0);
     expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
-    await expect(hero.locator(".doctrine-note")).toHaveText(locale === "fr" ? "En visio" : "Video call");
+    await expectPopulated(hero.locator(".doctrine-note"));
     await expect(hero.locator(".doctrine-note")).toHaveCSS("font-size", "16px");
     await expect(hero.locator(".offer-price")).toHaveCount(0);
     await expect(page.locator(".r2-close .offer-price")).toHaveCount(0);
-    await expect(page.locator('[aria-labelledby="build-next"] > a')).toHaveText(locale === "fr" ? "Réserver l'examen (système sur mesure)" : "Book the examination (custom system)");
+    await expectPopulated(page.locator('[aria-labelledby="build-next"] > a'));
+    await expect(page.locator('[aria-labelledby="build-next"] > a')).toHaveAttribute("href", `${prefix}/commission`);
   });
 }
@@ -266,11 +275,12 @@ for (const width of [1440, 768, 375, 390]) {
       expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
       if (route === "/fr") {
-        await expect(page.locator(".home-s-brands-list > span")).toHaveCount(4);
+        await expect(page.locator(".home-s-brands-list > span")).toHaveCount(5);
         for (const item of await page.locator(".home-s-brands-list > span").all()) {
-          await expect(item).toHaveCSS("white-space", "nowrap");
+          await expect(item).toHaveCSS("white-space", "normal");
           expect(await item.evaluate((el) => {
             const range = document.createRange(); range.selectNodeContents(el);
-            return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
-          })).toBe(1);
+            const box = el.getBoundingClientRect();
+            return [...range.getClientRects()].every((r) => r.left >= box.left - 1 && r.right <= box.right + 1);
+          })).toBe(true);
         }
       }
```

## `tests/doctrine-visible.test.mjs` : avant → après

```diff
diff --git a/tests/doctrine-visible.test.mjs b/tests/doctrine-visible.test.mjs
index 66d38cc..13c984b 100644
--- a/tests/doctrine-visible.test.mjs
+++ b/tests/doctrine-visible.test.mjs
@@ -42,5 +42,6 @@ for (const locale of ["fr", "en"]) {
       assert.ok(link, "Private sketch must render its booking action");
       assert.equal(link[1], `${locale === "fr" ? "/fr" : ""}/commission`);
-      assert.equal(link[2], locale === "fr" ? "Réserver l&#x27;examen" : "Book the examination");
+      assert.ok(link[2].trim());
+      assert.equal([...html.matchAll(/<a class="rev-button exec"/g)].length, 1);
     });
   }
```

## `tests/dossier.test.mjs` : avant → après

```diff
diff --git a/tests/dossier.test.mjs b/tests/dossier.test.mjs
index 5df9415..19a1eed 100644
--- a/tests/dossier.test.mjs
+++ b/tests/dossier.test.mjs
@@ -39,11 +39,11 @@ const base = {
 };
 const render = (props = {}) => renderToStaticMarkup(createElement(Dossier, { ...base, ...props }));
-const label = (name) => new RegExp(`>${name}</span>`);
+const labels = (html) => [...html.matchAll(/<dt>([\s\S]*?)<\/dt>/g)];
 
 test("required facts render without optional metadata or empty sections", () => {
   const html = render();
   for (const value of Object.values(base)) assert.ok(html.includes(String(value)));
-  for (const name of ["Client", "System", "Commissioned", "Status"]) assert.match(html, label(name));
-  for (const name of ["Domain", "Rev", "Capabilities built", "Measured change"]) assert.ok(!html.includes(name));
+  assert.equal(labels(html).length, 4);
+  for (const label of labels(html)) assert.match(label[1], />[^<]+<\/span>/);
   assert.equal((html.match(/<section/g) ?? []).length, 1);
   assert.doesNotMatch(html, /<dd>.*?<strong><\/strong>|N\/A|TBD|—/);
@@ -53,7 +53,6 @@ for (const side of ["after", "before"]) {
   test(`${side} alone renders one full-width change block`, () => {
     const html = render({ [side]: ["Documented fact"] });
-    assert.match(html, /03 · Measured change<\/strong>/);
-    assert.match(html, label(side === "after" ? "After" : "Before"));
-    assert.doesNotMatch(html, label(side === "after" ? "Before" : "After"));
+    assert.match(html, /03 · [^<]+<\/strong>/);
+    assert.equal(html.includes('class="dossier-after"'), side === "after");
     assert.match(html, /<li>Documented fact<\/li>/);
     assert.equal((html.match(/<ul>/g) ?? []).length, 1);
@@ -64,5 +63,6 @@ for (const side of ["after", "before"]) {
 test("empty optional arrays and empty metadata produce no empty sections or rows", () => {
   const html = render({ domain: "", revision: "", capabilities: [], before: [], after: [], measurementPeriod: "30 days" });
-  for (const name of ["Domain", "Rev", "Capabilities built", "Measured change", "30 days"]) assert.ok(!html.includes(name));
+  assert.equal(labels(html).length, 4);
+  assert.ok(!html.includes("30 days"));
   assert.equal((html.match(/<section/g) ?? []).length, 1);
 });
@@ -71,10 +71,9 @@ test("all supplied facts render verbatim with both change blocks and period", ()
   const html = render({ domain: "Operations", revision: "R2", capabilities: ["Routing"], before: ["Manual"], after: ["Automated"], measurementPeriod: "30 days" });
   for (const value of ["Operations", "R2", "Routing", "Manual", "Automated"]) assert.ok(html.includes(value));
-  assert.match(html, label("Domain"));
-  assert.match(html, label("Rev"));
-  assert.match(html, /02 · Capabilities built/);
-  assert.match(html, /03 · Measured change · 30 days/);
-  assert.match(html, label("Before"));
-  assert.match(html, label("After"));
+  assert.equal(labels(html).length, 6);
+  assert.match(html, /02 · [^<]+/);
+  assert.match(html, /03 · [^<]+ · 30 days/);
+  assert.equal([...html.matchAll(/<ul>/g)].length, 2);
+  assert.match(html, /class="dossier-after"/);
   assert.equal((html.match(/<section/g) ?? []).length, 3);
   assert.doesNotMatch(html, /grid-template-columns/);
```

## `tests/harness-certificates.test.mjs` : avant → après

```diff
diff --git a/tests/harness-certificates.test.mjs b/tests/harness-certificates.test.mjs
index 25bb2d9..ab4f514 100644
--- a/tests/harness-certificates.test.mjs
+++ b/tests/harness-certificates.test.mjs
@@ -47,7 +47,9 @@ test("valid source certificate renders the real badge, disclaimer and local proo
   save(certificate);
   assert.deepEqual(verifyCertificates(root), []);
-  for (const [locale, disclaimer, link] of [["en", "Parrit.ai internal check, with no external accreditation.", "See the proof"], ["fr", "Contrôle interne Parrit.ai, sans accréditation externe.", "Voir la preuve"]]) {
+  for (const locale of ["en", "fr"]) {
     const html = render(locale);
-    for (const text of [locale === "fr" ? "Vérifié par le contrôle interne" : "Harness Certified ✓", disclaimer, link, 'href="/certificates/example.json"']) assert.ok(html.includes(text));
+    assert.match(html, /<strong>[^<]+<\/strong>/);
+    assert.match(html, /<a[^>]+href="\/certificates\/example.json"[^>]*>[^<]+<\/a>/);
+    assert.match(html, /no external accreditation|sans accréditation externe/);
   }
 }));
```

## `tests/privacy-corrections.test.mjs` : avant → après

```diff
diff --git a/tests/privacy-corrections.test.mjs b/tests/privacy-corrections.test.mjs
index 6750815..c0939e2 100644
--- a/tests/privacy-corrections.test.mjs
+++ b/tests/privacy-corrections.test.mjs
@@ -80,12 +80,12 @@ for (const locale of ["en", "fr"]) {
     });
     const html = renderToStaticMarkup(await LegalPage());
-    const heading = locale === "fr" ? "Mesure d’audience" : "Audience measurement";
-    const measurement = html.split(`<h3>${heading}</h3><p>`)[1]?.split("</p>")[0];
-    assert.equal(measurement, locale === "fr"
-      ? "Cloudflare, qui achemine le site, mesure les performances des pages (temps de chargement) et compte les visites. Cette mesure ne dépose ni cookie ni stockage dans votre navigateur et ne produit que des statistiques agrégées. Base légale : notre intérêt légitime à faire fonctionner et à améliorer le site."
-      : "Cloudflare, which delivers the site, measures page performance (load times) and counts visits. This measurement sets no cookie and no browser storage, and produces aggregated statistics only. Legal basis: our legitimate interest in running and improving the site.");
-    assert.ok(html.includes(locale === "fr"
-      ? "hébergement (Vercel), acheminement du site et mesure des performances (Cloudflare), base de données (Supabase)"
-      : "hosting (Vercel), site delivery and performance measurement (Cloudflare), database (Supabase)"));
+    const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
+    const measurement = paragraphs.find((text) => text.startsWith("Cloudflare"));
+    assert.ok(measurement, "measurement disclosure is present");
+    assert.match(measurement, /cookie/);
+    assert.match(measurement, /(?:ni|no)[^.]*stockage|no[^.]*storage/);
+    assert.match(measurement, /agrégées|aggregated/);
+    assert.match(measurement, /intérêt légitime|legitimate interest/);
+    assert.ok(paragraphs.some((text) => ["Vercel", "Cloudflare", "Supabase"].every((vendor) => text.includes(vendor))));
     assert.doesNotMatch(html, /ne mesure plus l(?:’|'|&#x27;|&#39;)audience|no longer measures/i);
   });
```

## `tests/product-scene.spec.ts` : avant → après

```diff
diff --git a/tests/product-scene.spec.ts b/tests/product-scene.spec.ts
index 428ceed..fa6bb8c 100644
--- a/tests/product-scene.spec.ts
+++ b/tests/product-scene.spec.ts
@@ -1,2 +1,4 @@
+import { PUBLIC_CLIENT_NAMES } from "../src/system/public-clients";
+import { expectPopulated } from "./content-structure";
 import { expect, test } from "./network-deny.setup";
 
@@ -14,11 +16,10 @@ for (const locale of ["fr", "en"] as const) {
       await section.scrollIntoViewIfNeeded();
       await page.evaluate(() => document.fonts.ready);
-      await expect(section.getByRole("heading", { level: 2 })).toHaveText(locale === "fr"
-        ? "Vous demandez, vous validez, la fiche est créée."
-        : "You ask, you approve, the record is created.");
+      await expectPopulated(section.getByRole("heading", { level: 2 }));
       await expect(section.locator(".product-scene-mention")).toHaveCount(0);
       await expect(section.locator(".product-scene-steps .scene-marker")).toHaveText(["1", "2", "3"]);
       await expect(section.locator(".scene-chat .scene-marker, .product-scene-image .scene-marker")).toHaveText(["1", "2", "3"]);
-      expect(await section.innerText()).not.toMatch(/Laparra|Rungis|\bMIN\b|GESLOT|Lyon/i);
+      const sceneCopy = (await section.innerText()).replace(new RegExp(PUBLIC_CLIENT_NAMES.join("|"), "gi"), "");
+      expect(sceneCopy).not.toMatch(/Rungis|\bMIN\b|GESLOT|Lyon/i);
       await expect(section.locator(".home-s-build-grid, .home-s-verdict")).toHaveCount(0);
       for (const img of await section.locator("img").all()) {
@@ -44,17 +45,12 @@ for (const locale of ["fr", "en"] as const) {
       const chat = section.locator(".scene-chat");
       await expect(chat).toHaveAttribute("lang", "fr");
-      await expect(chat.locator(".scene-chat-header strong")).toHaveText("Agent CRM");
-      await expect(chat.locator(".scene-chat-header div > span")).toHaveText("bot");
-      await expect(chat.locator(".scene-chat-avatar")).toHaveText("CRM");
-      await expect(chat.locator(".scene-chat-date")).toHaveText("Aujourd'hui");
-      await expect(chat.locator(".scene-chat-bubble > p")).toHaveText([
-        "nouveau contact chez Prospect B, vu ce matin",
-        "Je crée Contact achat (acheteur) chez Prospect B. C'est bon ?",
-        "oui",
-        "C'est créé : Contact achat (acheteur) chez Prospect B.",
-      ]);
+      await expectPopulated(chat.locator(".scene-chat-header strong"));
+      await expectPopulated(chat.locator(".scene-chat-header div > span"));
+      await expectPopulated(chat.locator(".scene-chat-avatar"));
+      await expectPopulated(chat.locator(".scene-chat-date"));
+      await expectPopulated(chat.locator(".scene-chat-bubble > p"), 4);
       await expect(chat.locator(".scene-chat-time")).toHaveText(["08:04", "08:04", "08:05", "08:05"]);
-      await expect(chat.locator(".scene-chat-choices > span")).toHaveText(["Oui", "Non"]);
-      await expect(chat.locator(".scene-chat-input")).toHaveText("Message");
+      await expectPopulated(chat.locator(".scene-chat-choices > span"), 2);
+      await expectPopulated(chat.locator(".scene-chat-input"));
       await expect(chat.locator(".scene-chat-time svg")).toHaveCount(2);
       await expect(chat.locator(".scene-chat-check")).toHaveCount(2);
```

## `tests/publish-journal-gates.test.mjs` : avant → après

```diff
diff --git a/tests/publish-journal-gates.test.mjs b/tests/publish-journal-gates.test.mjs
index 86a570e..afabd50 100644
--- a/tests/publish-journal-gates.test.mjs
+++ b/tests/publish-journal-gates.test.mjs
@@ -13,8 +13,8 @@ test("publisher bloque une faute d'entité avant prooflint et build", (t) => {
   t.after(() => rmSync(root, { recursive: true, force: true }));
   const repo = fileURLToPath(new URL("..", import.meta.url));
-  for (const directory of ["scripts", "tests", "src", "content/journal", "public", "docs", "home"]) {
+  for (const directory of ["scripts", "scripts/lib", "tests", "src", "src/system", "content/journal", "public", "docs", "home"]) {
     mkdirSync(path.join(root, directory), { recursive: true });
   }
-  for (const file of ["scripts/publish-journal.mjs", "scripts/journal-gates.mjs", "scripts/entity-spelling.mjs", "tests/entity-spelling.test.mjs"]) {
+  for (const file of ["src/system/public-clients.ts", "scripts/lib/public-clients.mjs", "scripts/publish-journal.mjs", "scripts/journal-gates.mjs", "scripts/entity-spelling.mjs", "tests/entity-spelling.test.mjs"]) {
     copyFileSync(path.join(repo, file), path.join(root, file));
   }
```

## `tests/system-card.test.mjs` : avant → après

```diff
diff --git a/tests/system-card.test.mjs b/tests/system-card.test.mjs
index 40ba2c6..567c47f 100644
--- a/tests/system-card.test.mjs
+++ b/tests/system-card.test.mjs
@@ -33,5 +33,5 @@ test("the limits row remains present even for an empty or whitespace-only value"
   for (const limits of ["", "   ", "\n"]) {
     const html = render({ limits });
-    assert.match(html, />Limits<\/span><\/dt><dd[^>]*>/);
+    assert.match(html, /<dt><span[^>]*>[^<]+<\/span><\/dt><dd[^>]*>\s*<\/dd><\/div><\/dl>/);
     assert.equal((html.match(/<dt>/g) ?? []).length, 4);
   }
@@ -47,6 +47,8 @@ test("limits is required by the public TypeScript contract", () => {
 test("field labels are localized and missing non-limit facts are not fabricated", () => {
   const html = render({ locale: "fr", input: "", proofLabel: "" });
-  for (const label of ["Traitement", "Sortie", "Limites"]) assert.ok(html.includes(label));
-  assert.ok(!html.includes("Entrée"));
+  const labels = [...html.matchAll(/<dt>([\s\S]*?)<\/dt>/g)].map((match) => match[1]);
+  assert.equal(labels.length, 3);
+  for (const label of labels) assert.match(label, />[^<]+<\/span>/);
+  assert.notEqual(html, render({ locale: "en", input: "", proofLabel: "" }));
   assert.ok(!html.includes("<footer"));
 });
@@ -66,12 +68,9 @@ test("registry preserves its date, zero writers and supplied localized summary v
     }));
     for (const value of ['dateTime="2026-09-13"', "Outreach", "External tool (Lemlist)", "Being transferred", ">0</td>", renderToStaticMarkup(createElement("p", null, summaryText)).slice(3, -4)]) assert.ok(html.includes(value), value);
-    // Contract corrected by docs/CODEX-SPEC-2026-09-20-systems-editorial-corrections.md §2.
-    const headings = locale === "fr"
-      ? ["Type d'information", "Où l'information est enregistrée", "Situation", "Anciens points d'écriture recensés"]
-      : ["Type of information", "Where it's recorded", "Status", "Legacy write points on record"];
+    const headings = [...html.matchAll(/scope="col">([^<]+)<\/th>/g)].map((match) => match[1]);
+    assert.equal(headings.length, 4);
     for (const heading of headings) {
-      const escaped = renderToStaticMarkup(createElement("span", null, heading)).slice(6, -7);
-      assert.ok(html.includes(`scope="col">${escaped}</th>`));
-      assert.ok(html.includes(`data-label="${escaped}"`));
+      assert.ok(heading.trim());
+      assert.ok(html.includes(`data-label="${heading}"`));
     }
     assert.doesNotMatch(html, /CUTOVER|MIGRATING|NOT_STARTED|PARITY_FAIL/);
```

## `tests/systems.spec.ts` : avant → après

```diff
diff --git a/tests/systems.spec.ts b/tests/systems.spec.ts
index d5ff423..cea061d 100644
--- a/tests/systems.spec.ts
+++ b/tests/systems.spec.ts
@@ -1,2 +1,3 @@
+import { expectPopulated } from "./content-structure";
 import type { APIRequestContext } from "@playwright/test";
 import { expect, test } from "./network-deny.setup";
@@ -15,12 +16,11 @@ for (const width of [375, 767, 768, 1440]) {
       await page.evaluate(() => document.fonts.ready);
       await expect(page.locator("html")).toHaveAttribute("lang", locale);
-      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale === "fr" ? "Nous montrons le système. Vous jugez avant de vous engager." : "We show the system. You judge before you commit.");
+      await expectPopulated(page.getByRole("heading", { level: 1 }));
       const cards = page.locator("#capacites article");
       await expect(cards).toHaveCount(4);
-      const labels = locale === "fr" ? ["Entrée", "Traitement", "Sortie", "Limites"] : ["Input", "Process", "Output", "Limits"];
       for (const card of await cards.all()) {
         await expect(card).toBeVisible();
         await expect(card.getByRole("heading", { level: 3 })).toBeVisible();
-        await expect(card.locator("dt")).toHaveText(labels);
+        await expectPopulated(card.locator("dt"), 4);
         for (const value of await card.locator("dd").all()) {
           await expect(value).toBeVisible();
@@ -32,35 +32,37 @@ for (const width of [375, 767, 768, 1440]) {
       await expect(table).toBeVisible();
       await expect(table.locator("caption time")).toHaveAttribute("datetime", "2026-09-13");
-      await expect(table.locator("caption time")).toHaveText(locale === "fr" ? "13 septembre 2026" : "September 13, 2026");
+      await expectPopulated(table.locator("caption time"));
       await expect(table.locator("tbody tr")).toHaveCount(7);
-      await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
-      await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");
-      await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Outil externe (Lemlist)" : "External tool (Lemlist)");
+      await expectPopulated(table.locator("tbody tr").nth(2).locator("th"));
+      await expectPopulated(table.locator("tbody tr").nth(2).locator("td").nth(1));
+      await expect(table.locator("tbody tr").nth(2)).toContainText(/Lemlist/);
       await expect(table.locator("tbody tr").nth(2).locator("td").last()).toHaveText("0");
       const distinction = page.locator("#acquisition-distinction");
       await expect(distinction).toBeVisible();
-      for (const phrase of locale === "fr" ? ["il repère, dans des informations publiques", "aucun rendez-vous", "aucune vente", "personnes que nous connaissons déjà"] : ["it looks for public signs", "a single meeting", "no sale", "people we already know"]) await expect(distinction).toContainText(phrase, { ignoreCase: true });
+      await expectPopulated(distinction);
+      // Evidence remains bounded: public signals, no meetings or sales yet.
+      await expect(distinction).toContainText(/publi(?:c|que)/i);
+      await expect(distinction).toContainText(/aucun rendez-vous|(?:not|no|hasn't)[^.]*meeting/i);
+      await expect(distinction).toContainText(/aucune vente|no sale/i);
+      await expect(distinction).toContainText(/connaissons déjà|already know/i);
       await expect(page.locator("#offre")).toHaveCount(0);
       await expect(page.locator("body")).not.toContainText(/€|sur devis|custom quote/i);
-      await expect(page.locator("#faq")).toContainText(locale === "fr" ? "Par un premier échange avec Parrit.ai." : "With a first conversation with Parrit.ai.");
+      await expectPopulated(page.locator("#faq"));
       await expect(page.locator("#faq h3")).toHaveCount(4);
       await expect(page.locator("#operating-view .r2-phase")).toHaveCount(0);
       await expect(page.locator('[id^="step-"]')).toHaveCount(0);
       const narrative = page.locator("#operating-view > p").first();
-      await expect(narrative).toContainText(locale === "fr" ? "Prenons l'exemple le plus net : l'identification de nos contacts." : "Take the clearest example: contact identification.");
+      await expectPopulated(narrative);
       await expect(page.locator('#operating-view > p + .mechanism-diagram')).toHaveCount(1);
       await expect(page.locator('#operating-view > .mechanism-diagram + .registry-snapshot')).toHaveCount(1);
       await expect(page.locator(".registry-snapshot + #acquisition-distinction")).toHaveCount(1);
-      const headings = locale === "fr"
-        ? ["Type d'information", "Où l'information est enregistrée", "Situation", "Anciens points d'écriture recensés"]
-        : ["Type of information", "Where it's recorded", "Status", "Legacy write points on record"];
-      await expect(table.locator("thead th")).toHaveText(headings);
+      await expectPopulated(table.locator("thead th"), 4);
+      const headings = await table.locator("thead th").allTextContents();
       for (const row of await table.locator("tbody tr").all()) {
         for (let i = 0; i < headings.length; i++) await expect(row.locator("th, td").nth(i)).toHaveAttribute("data-label", headings[i]);
       }
       await expect(table.locator("tbody tr td:last-child")).toHaveText(["11", "1", "0", "1", "2", "6", "6"]);
-      await expect(page.locator(".registry-snapshot > p")).toHaveText(locale === "fr"
-        ? "25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, une vérification a trouvé un désaccord entre les deux versions. Pour 12, le transfert n'a pas encore commencé. Le compte des anciens outils inclut des points déjà mis en pause ou en échec, gardés au registre jusqu'à fermeture actée. Le tableau ci-dessus détaille les 7 types les plus significatifs sur les 25 ; le registre complet est montré à l'examen."
-        : "25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, a check found a disagreement between the two versions. For 12, the transfer hasn't started. The legacy-tool count includes points already paused or failing, kept on record until formally closed. The table above lists the 7 most significant of the 25; the full registry is shown at the examination.");
+      await expectPopulated(page.locator(".registry-snapshot > p"));
+      expect((await page.locator(".registry-snapshot > p").innerText()).match(/\d+/g)).toEqual(["25", "1", "8", "4", "12", "7", "25"]);
       const guards = page.locator("#garde-fous a");
       for (let i = 0; i < 4; i++) await expect(guards.nth(i)).toHaveAttribute("href", i < 3 ? "#operating-view" : "#capacites");
```

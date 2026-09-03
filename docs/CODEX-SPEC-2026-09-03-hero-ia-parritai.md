# CODEX-SPEC · 2026-09-03 · Héros IA + marque Parrit.ai (§4)

Statut : VALIDÉ PAR PAUL (« mets en production le héro, le 1 », 03/09).
Périmètre strict : chaînes de copy uniquement. Aucun changement de structure,
de composant ou de route.

## 1. Héros n°1 (home + Opening + metadata, FR et EN)

FR H1 (home + boot screen ; conserver l'effet de cadre existant, sur le même
mot) :
« Le système IA qui fait tourner votre entreprise. »

FR sous-titre du hero (remplace « Un seul endroit pour voir ce qui se
passe… ») :
« Construit par Parrit.ai, maison française fondée par Paul Larmaraud, après
trois ans de projets déployés chez des grands comptes, des PME et des ETI. »

FR meta title home : « Parrit.ai · Le système IA qui fait tourner votre
entreprise »

FR boot sub (Opening) : « Parrit.ai conçoit et construit des systèmes
d'exploitation d'entreprise. » (la 2e ligne du boot reste inchangée)

EN H1 (home + boot) : « The AI system your company operates on. »
EN hero sub : « Built by Parrit.ai, a French maison founded by Paul
Larmaraud: three years of AI systems deployed across large accounts, SMEs
and mid-sized companies. »
EN meta title : « Parrit.ai · Company Operating Systems »
EN boot sub : « Parrit.ai designs and builds company operating systems. »

## 2. Marque §4 : « Parrit » seul → « Parrit.ai » (FR et EN)

Dans TOUTES les chaînes visibles des dictionnaires rev01 (FAQ, dossiers,
manufacture, standard, commission, formulaires, notes) : chaque occurrence
de « Parrit » employé seul devient « Parrit.ai ». Exemples : « Qui est
Parrit ? » → « Qui est Parrit.ai ? » ; « les serveurs de Parrit » ; « Si
Parrit disparaît demain » ; « Parrit tourne sur son propre système » ; « Who
is Parrit? » ; « Parrit's servers » ; « if Parrit disappears tomorrow ».
NE PAS toucher : « Parrit.ai » déjà correct, le wordmark PARRIT.AI, les
chromes machine (« PARRIT / OS », « PARRIT / SITE · REV 01 », « PARRIT /
JOURNAL », « PARRIT / COMMANDE »…), « Parrit Standard » / « Standard
Parrit » (nom du référentiel), « PS-0x », le JSON-LD (déjà PARRIT.AI), les
articles content/journal/*.mdx (hors périmètre).

## 3. Qualité

npm run lint + npx tsc --noEmit + npm run qa:brand:rev01 + npm run build :
verts. Aucun tiret cadratin. Rapport .codex-report-hero.md : liste des
chaînes modifiées (avant → après), dernières lignes du build.

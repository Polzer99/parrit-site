# Compte rendu — polissage UX/UI du 12/11/2026

Spec : [CODEX-SPEC-2026-11-12-polissage-ui-skills-design.md](CODEX-SPEC-2026-11-12-polissage-ui-skills-design.md).
Référence Git : `d7da52b`. Travail local, sans commit, push ni déploiement.

Les lots A, C1 et C3 sont implémentés. B2 est abandonné pour l’accessibilité :
le contour d’origine des technologies est rétabli, car `tests/aeration.spec.ts`
exige un contraste ≥ 3:1 sur cette région navigable au clavier. C2 suit le repli explicitement autorisé :
aucun paramètre 24 h non documenté n'a été ajouté. **Aucun rendu navigateur n’est certifié.** Les blocages de dépendances ci-dessous
sont historiques ; lors du retrait de B1, `npm run lint` et `npm test` passent
(335 tests réussis, aucun échec). Aucun commit effectué.

B1 est abandonné : à 1440 px, les six logos sur une ligne se touchent.
L’arbitrage taille/ligne est laissé à Paul. Le composant est rétabli depuis
`origin/main`, le bloc CSS ajouté est retiré et le commentaire d’origine
est conservé avec « six logos » (décision du 09/11).

## Fichiers modifiés

| Fichiers | Résultat |
| --- | --- |
| `DESIGN.md` (nouveau) | Référence française du code servi : couleur, typographie, mise en page, composants, mouvement, à faire/éviter. Variables et fichiers sources, sans palette hex copiée. |
| `DESIGN-SYSTEM.md`, `docs/design-system/PARRIT-DESIGN-SYSTEM.md` | Bandeau historique ajouté en tête ; texte antérieur intégralement conservé. |
| `AGENTS.md` | Lien vers DESIGN.md dans la section visuelle, Brand OS toujours source. |
| `src/system/single-page.css` | Appui souligné sur menu et FAQ natifs. |
| `src/app/(rev01)/rev01.css` | `--brand-s2` entre chapeau et métadonnées d'article, sans changer l'index ni le contenu. |
| `src/system/system.css` | État d'appui de Hold avant validation ; transitions annulées en mouvement réduit, remplaçant le fallback 1 ms qui impliquait `all` sur les éléments sans propriété déclarée. Animations existantes conservées. |
| `AI_CONTEXT.md`, `docs/polissage-ui-skills-design/plan.md`, ce rapport | État et limites du chantier ; plan d'exécution et preuves. |

## Tests ajoutés et renforcés

- `tests/design-md-truth.test.mjs` : deux tests, variables réellement définies dans
  les CSS servis et absence de valeur hex dans DESIGN.md.
- `tests/helpers/served-css.mjs` : parcourt les imports locaux depuis les pages et
  layouts publics, incluant les CSS des composants ; les archives ne font pas foi.
- `tests/ui-polish.test.mjs` : transitions explicitement ciblées, rejet de `all`
  explicite, des raccourcis sans propriété et d'une durée isolée.
- `tests/home-visual-layers.test.mjs` : une assertion résiduelle attendait encore
  huit images, malgré le retrait de deux logos dans #373 et les six références
  de la spec. Attente corrigée à six et égalité exacte avec les fichiers autorisés
  du registre ajoutée (plus stricte que la simple appartenance précédente).
  Il s'agit du contrat de publication déjà modifié, pas d'un seuil géométrique.
- `tests/home-visual-layers.spec.ts` : huit cas FR/EN supplémentaires sur le
  focus des technologies à 1440/390, leur défilement et sa pause au focus,
  l’appui et le focus des contrôles natifs. Contrôle des six clients conservé.
  Service workers bloqués, deny-all réseau partagé et simulation du SDK Cal conservés.
- `tests/conformity-journal.spec.ts` : quatre cas FR/EN, 1440/390, mesurant les
  16 px entre chapeau et métadonnées d'article.

## Exécutions et limites

Les commandes ont été exécutées depuis ce worktree, avant puis après les changements.
Les journaux bruts de cette session sont sous `/tmp/polissage-*` (temporaires).

| Commande | Référence | Candidat |
| --- | --- | --- |
| `npm ci` | Échec : `ENOTFOUND registry.npmjs.org`, dépendances non installées | Pas de nouvelle tentative réseau identique ; repli `npm ci --offline --logs-dir=/tmp/polissage-npm-logs` en échec `ENOTCACHED` (notamment zwitch) |
| `npm run lint` | Échec : `eslint: command not found` | Même blocage |
| `npm run build` | Certificats validés ; arrêt du prebuild sur `gray-matter` absent | Même blocage, compilation Next non atteinte |
| `npm test` | 20 réussites, 34 échecs liés aux dépendances manquantes / imports | 23 réussites, mêmes 34 échecs ; les trois nouveaux tests passent |
| `npm run test:brand-os` | 6 réussites, 4 échecs, dépendances manquantes | Même résultat ; ne constitue pas une validation Brand OS complète |
| `npm run qa:brand:rev01` | Échec : module `color-name` absent | Même blocage |
| `node --test tests/design-md-truth.test.mjs tests/ui-polish.test.mjs` | Trois tests rouges avant implémentation : DESIGN.md absent et transition implicite | **3/3 réussis** |
| `npm run qa:network:rev01 -- --list` | Non lancé | Échec : CLI locale Playwright absente ; l'exécutable de secours répond `unknown command 'test'` |
| `git diff --check` | — | Réussi |

Dernier rejeu ciblé, après correction du comptage résiduel des logos : les trois
tests autonomes passent ; `home-visual-layers.test.mjs` ne peut pas se charger
(`sharp` absent). Sa syntaxe est validée par `node --check` ; ses assertions de
rendu restent à exécuter avec les dépendances.

Contrôle auxiliaire de syntaxe avec le parseur TypeScript 5.9.3 déjà disponible
dans le worktree voisin : les specs navigateur modifiées
sont syntaxiquement valides. Ce contrôle n'est ni un typecheck ni le lint/build
du projet. Aucune dépendance du voisin n'a été copiée ou substituée au lockfile.

La documentation Next du dépôt n'était pas installée. Le guide CSS de la copie
locale 16.2.2 a été lu, puis recoupé avec Context7 Next 16.3.6 (version proche
disponible du 16.3.4 verrouillé) : ordre des imports conservé et preuve finale
attendue sur le build de production. Aucun changement d'API Next.

La revue indépendante a corrigé le registre canard du bandeau dans DESIGN.md.

## C2 — source documentaire Cal.com

Consultation du 12/11/2026 :

- [Instructions officielles de l'embed](https://cal.com/help/embedding/embed-instructions)
  : options inline/UI, styles, visibilité des détails et du fuseau ; aucune option
  documentée pour forcer le format des créneaux à 24 h.
- [Préremplissage de l'embed React](https://cal.com/help/embedding/prefill-booking-form-embed)
  : `config` pour les champs et métadonnées, sans option documentée de format horaire.
- Context7 `/websites/cal`, recherche ciblée : le `timeFormat` 12/24 documenté
  concerne les utilisateurs gérés via API, pas le contrat de l'embed.

Conclusion limitée aux sources consultées : **aucune option d'embed documentée
trouvée**. CalInline est conservé octet pour octet, sans paramètre inventé,
modification de compte Cal, manipulation de stockage ou contournement de l'iframe.
Versions verrouillées : embed-react et embed-core 1.5.3 ; installation indisponible.
L'affichage français en 24 h reste donc non résolu, comme le permet la spec.

## Préservation et reprise sur hôte

La spec non suivie préexistante et `public/llms.txt` ont conservé leurs SHA256.
Aucune modification des tokens vendorisés, polices, couleurs, graisses, rayons,
ombres, images, textes publics, articles ou dépendances. Les deux documents
historiques conservent tout leur contenu sous le nouveau bandeau.

Sur un hôte disposant du registre npm, exécuter la chaîne de la spec :

```sh
npm ci && npm run lint && npm run build && npm test && npm run test:brand-os && npm run qa:brand:rev01
```

Puis lancer le serveur local avec `npm run start -- -p 3210` et exécuter
`npm run qa:network:rev01` dans un autre terminal. Aucun `npx` nécessaire.
Vérifier les captures, la géométrie et le CLS.
La preuve navigateur et la preuve en production sont absentes ; aucun déploiement
n'a été tenté. Les blocages d'environnement n'ont entraîné aucun assouplissement.

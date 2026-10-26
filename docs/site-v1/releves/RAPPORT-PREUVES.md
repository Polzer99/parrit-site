# Rapport, registre de preuves parrit.ai site V1 (brouillon, 26/10/2026)

Lecture seule partout. Un seul accès réseau : la liste publique des organismes de formation (data.gouv.fr, CSV quotidien du ministère du Travail), pour contrôler FORMIA et l'absence de Parrit.ai. Aucun fichier de dépôt modifié, aucun hook contourné, aucune écriture Supabase, aucun mail.

Registre : `/private/tmp/claude-501/-Users-paullarmaraud/b346e810-3d70-419d-bed2-335c723c82cc/scratchpad/site-v1/preuves/registre-preuves.yaml` (44 entrées, tous les champs de la section 6 de la spec présents, plus un champ `notes`).

Précision de source : « Calypie » = Qualiopi (Paul, 26/10). Il n'existe aucune entité Calypie ni Calliope. Le fichier `paul-larmaraud-landing/src/content/site.ts` n'existe pas ; le contenu publié de ce site est dans `src/content/copy.ts`.

## 1. Publiable aujourd'hui (sans geste supplémentaire de Paul)

- Cinq noms de clients, en texte, avec la phrase de réalisation exacte de `public-clients.ts` / REGLES-DOR §6 (25/10) : Laparra, Clevery Avocats, Forexpert, Joone (accompagnement, jamais « système livré »), SNCF (toujours « avec Arkel », jamais client direct). Aucun logo, aucun chiffre, aucune citation.
- Bandeau H02 : catégories honnêtes (SNCF = via partenaire, Joone = accompagnement). Pas de « Ils nous font confiance » générique.
- Standard Parrit : uniquement en « contrôle interne », jamais une accréditation.
- Hermes Agent : en texte, avec l'attribution exacte « Hermes Agent, open source by Nous Research, MIT License », jamais comme technologie propriétaire.
- Section H09 « Partenaires scientifiques » : état vide élégant. Aucune source ne permet autre chose (voir 3).
- Technologies, proposition à valider par Paul : mention TEXTE nominative des outils dont l'usage est prouvé (Supabase, OpenRouter, n8n, Telegram, Claude, Codex, Gemini). Statut affichable : « intégré en production » ou « utilisé sur projet », jamais « partenaire ». Aucun logo.

## 2. Bloqué, et pourquoi

| Élément | Raison |
|---|---|
| Tous les logos clients (Laparra, Clevery, Forexpert, Joone, SNCF) | Paul a autorisé les noms, pas les logos (AGENTS.md:125, NOTE-CADRAGE:11). Accord d'Éric (Laparra) noté « à obtenir ». Les fichiers de `design-source/brand-kit/client-logos` sont historiques, non autorisés. |
| Tous les logos technologiques | Aucune charte de marque fournisseur lue. |
| Arkel (nom seul, page partenaire, logo) | Pas de contrat retrouvé. Accord oral de réutilisation de decks, ne couvre pas la marque. Nom toléré seulement dans « avec Arkel » sur la ligne SNCF. |
| DENEM Labs / son fondateur | Contrat en cours de signature au 05/10, signature de l'autre partie non constatée. Aucun accord écrit sur nom, rôle ou logo. |
| Chercheurs, MIT | Aucune preuve (voir 3). |
| Maxime (partenaire CRM) | Pas de consentement ; règle « pas cité dans un deck présenté par Paul ». |
| Qualiopi de FORMIA | Faits vérifiés (voir 4), mais le claim reste bloqué dans `parrit-canon/brand/verbal/claims.json:328` et DS-013 (« numéro non vérifié, entité tierce ») tant que Paul ne le lève pas. |
| Chiffres (200+ signaux, 5-10 k€, 2,5 mois, 14 jours, « trois ans », « centaines d'agents ») | Claims bloqués ou sans méthode ni période. |
| Content Factory | Retirée par la spec ; TRUTH.md garde encore la capacité 6 « Content Factories » (écart à aligner, NOTE-CADRAGE:9). |
| « Propriétaire » (CRM Laparra, harnais) | Détenteur des droits non confirmé. TRUTH.md:17 dit que les outils construits appartiennent au client. |
| Tous les autres clients (dont ceux des partenaires de conseil) | Non nommables ; le Journal ne nomme aucun client, y compris les cinq publics. |

## 3. Chercheurs et MIT : ce que disent les sources

- Aucun chercheur nommé et vérifié n'existe dans le dépôt, le canon, les docs ou le site personnel. Entrée placeholder : « aucune source trouvée ».
- Une seule piste interne : le fondateur de DENEM Labs, décrit en mémoire tantôt « chercheur MIT » (note de Claude du 20/08, non sourcée), tantôt « publication MIT » (propos de Paul rapportés), tantôt « expert technique IA ». La seule trace primaire est un mail du 20/08 « travaille avec le MIT ». Sur les supports Act-On du 30/09, la mention MIT a été retirée (« MIT clos »). Aucun nom, titre ni MIT n'est donc repris dans le registre public.
- « Palantir/MIT » dans un deck de 28/08 est une référence de style de schéma, pas une affiliation. Le rapport MIT NANDA cité dans un article est une citation de source, pas une relation.
- Piège de test : « MIT License » (Hermes) est une licence logicielle ; le test « aucune attribution MIT » doit l'exclure.
- Conflit de doctrine : TRUTH.md:122 / AGENTS.md:127 (12/10) interdisent tout nom de personne hors /legal ; la spec H09 demande des profils individuels nommés.

## 4. Qualiopi : fiche de vérification

Source primaire lue en entier le 26/10 : `~/Downloads/LAPARRA-DOSSIER-2026-09-14/pieces/formia/FormIA-Certificat-Qualiopi-ATA-1926-2026.pdf` (md5 882e25f304e14c584f589b16dba8705b, identique à `~/Desktop/QUALIOPI FORMIA.pdf`). Recoupé avec la liste publique des organismes de formation, interrogée le 26/10.

| Point | Constat | Source |
|---|---|---|
| Entité titulaire | FORMIA, SIREN 100415884, NDA 11757517475, site 1 rue Marguerin 75014 Paris. **Pas Parrit.ai.** | Certificat ; liste publique OF |
| Numéro | ATA 1926 2026 | Certificat |
| Certificateur | ATALIA Certification, accréditation Cofrac 5-0628 | Certificat |
| Validité | du 26/05/2026 au 25/05/2029 ; certification initiale 26/05/2026 ; « sous réserve du respect des caractéristiques certifiées » | Certificat |
| Catégorie d'actions | Actions de formation (L6313-1 1°) seulement. Bilan de compétences, VAE, apprentissage : non cochés | Certificat ; liste publique (seul `actionsDeFormation=true`) |
| Parrit.ai (SIREN 928503218) | Absent de la liste publique : non certifié, non déclaré organisme de formation | Liste publique, 26/10 ; confirmé le 11/09 (mémoire) |
| Mention obligatoire | À afficher avec le logo : « La certification qualité a été délivrée au titre de la catégorie suivante : actions de formation ». C'est la règle générale de la marque Qualiopi ; elle n'est écrite dans aucune source du dépôt. À confirmer auprès d'ATALIA ou de la charte du ministère avant tout affichage | Non sourcée localement |
| Libellé sûr | « FORMIA, organisme de formation lié à Parrit.ai, est certifiée Qualiopi pour ses actions de formation (certificat ATA 1926 2026). » À ne jamais écrire : « Parrit.ai est certifié Qualiopi » | Règle de la spec H10 |

Points d'attention : les formations données au nom de Parrit.ai (Joone, SNCF via Arkel) ne sont pas sous cette certification, ne pas les y relier. Orthographe à fixer : « Formia » (spec), « FormIA » (TRUTH.md), « FORMIA » (certificat et registre). Les sources sont contradictoires sur la détention de FORMIA (100/100 actions pour Parrit.ai, ou 100/1000 avec cession de 900 prévue le 29/09, exécution inconnue) et sur la présidence (Lacangel Group au registre le 28/09, Parrit.ai selon le Kbis du 05/10) : rien de cela n'est publiable, la spec interdit un schéma capitalistique inventé. Le certificat porte « sous réserve du respect des caractéristiques certifiées » : revérifier à chaque revue trimestrielle.

## 5. Questions pour Paul (une ligne chacune)

1. Lèves-tu le claim bloqué « Qualiopi n° ATA 1926 2026 » (claims.json:328 / DS-013), puisque le certificat primaire et la liste publique le confirment ?
2. Orthographe publique de l'organisme : Formia, FormIA ou FORMIA ?
3. Qui est aujourd'hui le président légal de FORMIA (Kbis) et quelle est la part de Parrit.ai ? Je n'écris rien tant que ce n'est pas tranché.
4. Autorises-tu le logo Qualiopi (Marianne) avec la mention de catégorie obligatoire, après vérification auprès d'ATALIA ?
5. Quels logos clients as-tu l'accord écrit d'afficher, et de qui ? Laparra (Éric), Joone, Forexpert, Clevery, SNCF/Arkel.
6. Accord de Dalila (Forexpert) pour être nommé : donné ou à demander ?
7. Veux-tu que la page de réalisation Clevery mentionne que c'est le cabinet de ton père ?
8. Arkel : nom et rôle publiables ? Et SNCF : des sessions autres que celle du 28/04 ont-elles été livrées ?
9. Chercheurs : quels noms, quelle affiliation vérifiable (lien officiel), quel rôle réel, quel consentement ? Sinon H09 reste vide.
10. L'affiliation MIT du fondateur de DENEM est-elle prouvable ? Sinon retrait définitif (comme sur Act-On).
11. Règle « aucun nom de personne hors /legal » (12/10) : levée pour les partenaires scientifiques ?
12. Le contrat DENEM est-il signé, et DENEM accepte-t-il d'être nommé comme partenaire technique ?
13. Maxime : accepte-t-il d'être présenté, et sous quelle forme (sans nom) ?
14. Mention texte des outils (Supabase, n8n, Claude, etc.) validée sans logo ? Mistral, Grok, Kimi, ChatGPT : quels sont réellement en production ?
15. « Propriétaire » : qui détient le harnais et le CRM Laparra (contrat du 29/09) ?
16. Content Factory : la capacité 6 de TRUTH.md est-elle supprimée avec l'alignement du canon ?

## 6. Écarts et pièges relevés

- Le bloc Qualiopi/Formia retiré le 05/10 l'a été pour « numéro non vérifié, entité tierce ». Le numéro est désormais vérifié ; l'entité tierce reste vraie et doit être dite (FORMIA, pas Parrit.ai).
- L'asset `public/brand/qualiopi-formia.png` est dans le dépôt mais n'est plus rendu ; son contenu n'a pas été comparé au certificat ni à la mention obligatoire.
- La mémoire contient des fiches périmées sur Qualiopi (« Ethan porte la Qualiopi », « Parrit.ai est certifié, pas une entité Calliope », `feedback_calliope_jamais_mentionner_qualiopi_oui.md` du 25/05). Le certificat du 26/05 les remplace : l'organisme certifié est FORMIA. À corriger en mémoire par Paul ou un terminal habilité.
- Aucun fichier de ce registre n'est dans un dépôt git : à verser dans `docs/site-v1/` par le terminal qui détient le lot.

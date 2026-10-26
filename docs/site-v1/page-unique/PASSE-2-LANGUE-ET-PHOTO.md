# Passe 2 : langue de la page et photo du fondateur (27/10/2026)

S'applique APRÈS `SCENARIO-DONNEE-ET-MOTS-INUTILES.md` (déjà appliquée dans ce dossier).

Demande de Paul : « supprime les formulations un peu françaises ou anglaises qui n'ont pas lieu d'être… il ne faut pas qu'on répète les mêmes choses… simple à comprendre, avec des mots distingués ». Méthode : relecture en passes (clarté, voix, répétitions, preuve) ; le français est pensé en français, l'anglais en anglais, jamais l'un calqué sur l'autre.

Ne pas toucher : titre du haut, sous-titre « matière première », libellés des boutons, ligne Laparra des références, case MIT, mention sur les marques, « Exemple illustratif ». Identifiants d'ancres inchangés.

## 1. Photo du fondateur (décision Paul du 27/10)

Remplacer `/photos/paul-centre.png` (gros plan, image vidéo basse définition) dans la section fondateur par le portrait souriant déjà présent et contrôlé : `public/brand/founder/parrit-ai-founder-linkedin-buste-3x4-{340,680}.{avif,webp}`, via `<picture>` (avif puis webp, `srcset` 340w/680w, `sizes` adapté à la colonne), `width`/`height` au ratio 3:4, `alt="Paul Larmaraud"`, `loading="lazy"`. Rayon 0. Cadrage : ne pas zoomer, la photo entière en 3:4. Mettre à jour les tests et `AGENTS.md` (ligne Photo) : « portrait choisi par Paul le 27/10/2026 : buste LinkedIn souriant ». Ne pas supprimer `paul-centre.png` du dépôt.

## 2. Français

| Avant | Après |
|---|---|
| Agent prospection | Agent de prospection |
| Agent CRM | Agent commercial |
| Un appel est prévu aujourd'hui : Entreprise C, à J+35. | Un appel est prévu aujourd'hui : Entreprise C. |
| C'est fait, la tâche est dans le CRM. | C'est fait, la tâche est enregistrée. |
| Dans son CRM | Dans sa base clients |
| Un cabinet d'avocats démarre sa journée avec ses actions prêtes. | Chaque matin, un cabinet d'avocats trouve ses réponses déjà rédigées. |
| L'outil rédige le compte rendu, vous le relisez. | Il rédige le compte rendu, vous le relisez. |
| Former les équipes, puis construire un premier agent avec nous. | Former les équipes, puis créer avec elles un premier agent. |
| Des outils reliés entre eux, puis des logiciels à vous, en production. | Relier vos outils, puis bâtir vos propres logiciels. |
| Déjà équipé ? Nous vérifions vos agents et leurs règles, nous installons l'IA sur vos serveurs, nous auditons votre usage de Claude Code. | Déjà équipés ? Nous vérifions vos agents et leurs règles, installons l'IA sur vos serveurs et auditons votre usage de Claude Code. |
| Il n'a pas le droit de lire la paie. | Il n'a pas accès à la paie. |
| L'agent veut envoyer un devis au client A. | L'agent prépare un devis pour le client A. |
| Tout envoi demande l'accord d'une personne. | Il attend votre accord. |
| Une personne valide : le devis part. | Vous validez : le devis part. |
| Un agent écrit le code demandé. | Un agent écrit le code. |
| Le 19/10/2026, quatre agents ont relu le code avant qu'il soit accepté. | Le 19 octobre 2026, quatre agents l'ont relu avant validation. |
| Vos données sont traitées chez vous. (Sur vos serveurs) | Elles ne quittent pas votre entreprise. |
| Les données sensibles restent chez vous. (Mixte) | Les plus sensibles restent chez vous. |
| Sans code et assistants | Automatisation et assistants |
| Des développeurs et des studios : automatisations, assistants écrits, vocaux et vidéo. | Des développeurs et des studios : assistants écrits, vocaux et vidéo. |
| Acculturation | Formation |
| Des cabinets de conseil et des relecteurs de nos livrables. | Des cabinets partenaires et des relecteurs de nos livrables. |
| À l'international : des partenaires au Brésil et en Italie ; au Cameroun, une expansion en cours et de premiers clients. | À l'international : des partenaires au Brésil et en Italie, de premiers clients au Cameroun. |
| En 2024, après deux ans chez Lime. (passe 1) | Il a créé l'entreprise en 2024, après deux ans chez Lime. |
| Il conçoit des systèmes où plusieurs agents travaillent ensemble. + Il pose les garde-fous qui les encadrent. | Il conçoit des systèmes où plusieurs agents travaillent ensemble, et les garde-fous qui les encadrent. |
| Il forme les équipes et pilote les projets d'IA. | Il forme les équipes et pilote les projets. |
| Ouverture du calendrier · Quelques secondes | (supprimer : « Chargement des créneaux… » suffit) |
| Pas de créneau ? Laissez votre e-mail | Aucun créneau ne convient ? Laissez votre e-mail. |
| Une réponse personnelle par entreprise · Aucune séquence automatique | Aucune relance automatique. |

Si « Chez Parrit.ai… » ou la ligne de légende du code ont laissé une case sans titre en passe 1, la case garde sa structure avec les lignes ci-dessus.

## 3. Anglais (réécrit en anglais naturel, pas traduit)

| Before | After |
|---|---|
| Our agents already work at our clients. | Our agents are already at work for our clients. |
| A law firm starts its day with its actions ready. | Every morning, a law firm finds its replies already drafted. |
| A call is due today: Company C, day 35. | A call is due today: Company C. |
| CRM agent | Sales agent |
| Done, the task is in the CRM. | Done, the task is saved. |
| In the CRM | In the customer base |
| A Rungis wholesaler steers its customer base by talking to its agents. | A Rungis wholesaler runs its customer base by talking to its agents. |
| Scenes rebuilt with fictional data, faithful to the systems in service. | Scenes recreated with fictional data, true to the systems in use. |
| The tool drafts the meeting notes, you review them. | It drafts the meeting notes; you review them. |
| At a client | Client case |
| Choose your priorities, then put quick, useful solutions in place. | Set priorities, then deliver quick wins. |
| Connected tools, then software of your own, in production. | Connect your tools, then build software of your own. |
| Already equipped? | Already using AI? |
| It flags gaps between two files. | It flags discrepancies between two files. |
| It checks that a file is complete. | It checks that an employee file is complete. |
| It has no right to read payroll. | It has no access to payroll. |
| The agent wants to send a quote to client A. / Every send needs a person's approval. / A person approves: the quote goes out. | The agent prepares a quote for client A. / It waits for your approval. / You approve: the quote goes out. |
| An agent writes the requested code. | An agent writes the code. |
| On October 19, 2026, four agents reviewed the code before it was accepted. | On October 19, 2026, four agents reviewed it before approval. |
| Your data is processed on your premises. | It never leaves your company. |
| Sensitive data stays with you. | The most sensitive data stays with you. |
| No-code and assistants / Developers and studios: automations, written, voice and video assistants. | Automation and assistants / Developers and studios: written, voice and video assistants. |
| Transformation and projects | Transformation |
| AI adoption / Around fifteen trainers available, and a certified training organization. | Training / Around fifteen trainers and a certified training organization. |
| Consulting firms and reviewers of our deliverables. | Partner firms and reviewers of our deliverables. |
| Abroad: partners in Brazil and Italy; in Cameroon, an expansion under way and first clients. | Abroad: partners in Brazil and Italy, first clients in Cameroon. |
| Helping the teams adopt AI. | Helping its teams adopt AI. |
| A training program. (SNCF) | A training program, delivered with Arkel. |
| He founded Parrit.ai in 2024, after two years at Lime. | He started the company in 2024, after two years at Lime. |
| He designs systems… / He puts in place the safeguards that frame the agents. | He designs systems where several agents work together, and the safeguards around them. |
| He trains teams and leads AI projects. | He trains teams and leads projects. |
| PARRIT / COMMISSION, Retrieving the calendar · A few seconds | (remove) |
| VIDEO, YOUR REQUEST | Video call, Your request (sentence case) |
| No slot that works? Leave your e-mail | No suitable time? Leave your e-mail. |
| We reply personally, with an example… | We reply ourselves. |
| One personal reply per company · No automated sequence | No automated follow-up. |

Appliquer aussi à l'anglais les coupes de la passe 1 qui n'y auraient pas été reportées (doublons « Nothing goes out without… », légende du code, « every morning » des légendes, « Experts in… »).

## Contrôles

- `python3 ~/parrit-os/tools/prooflint.py` sur le texte visible FR et EN extrait du build : zéro tiret cadratin, zéro avertissement de jargon non justifié.
- Si un test fige un ancien libellé, l'adapter au nouveau.
- Batterie : `npm run lint && npm test && (npm run build || npx next build --webpack) && npm run qa:brand:rev01 && npm run qa:claims:rev01 && npm run test:brand-os`. Ni commit ni push.

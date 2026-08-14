# LOT R2 — HYBRIDE B+C (maquette validée 15/08, go Paul)

Autorité : la maquette validée (scratchpad `maquette-rev02/home.html`, publiée en artifact
« Maquette REV 02 ») + arbitrages Paul 14-15/08 : sombre dominant · rouge intouchable ·
typo T3 (déjà en prod) · preuves chiffrées (chiffres dictés Paul / constatés en base).

## Périmètre
1. **Home** = réécriture selon la maquette (registre SOMBRE) : hero + instrument, bande
   métriques (3 faits vrais), **dossiers scellés** (3 cas anonymisés + chiffres réels +
   ligne registre), Standard en **document-écrin clair** (extrait 3 PS avec « In practice »),
   Manufacture (lede Fraunces + 3 phases), FAQ (3 objections), close Fraunces + exec.
2. **RevHeader** : + nav mono (System · Manufacture · Standard · Dossiers · Journal ·
   Commission), cachée <760px comme la maquette.
3. **/manufacture** (nouvelle page, sombre) : doctrine étendue — comment on construit.
4. **/dossiers** : contenu réel (3 dossiers + registre), passe INDEXABLE + sitemap.
5. **/standard** : garde son registre CLAIR (document-écrin voulu) + colonne « In practice »
   sous chaque PS.
6. Titres éditoriaux : Fraunces via `--ed` (`font-variation-settings:"opsz" 40,"SOFT" 0,
   "WONK" 0`, poids 480). JAMAIS en corps.
7. Chiffres : Parrit 200+/sem (constaté os_events) · Clevery +€5–10K/mois · Joone 2,5 mois ·
   Laparra qualitatif registre. AUCUN nom client sur le site (§6).

## Gates
- qa:brand (tokens only — ajouter `--steel #3A3F47` à tokens.css) ; une seule ombre
  (instrument) ; radius 0 ; pas de dégradé.
- qa:network : H1 home passe à clamp(46,6.4vw,92) → test range 90–94 @1440 ; opening
  inchangée ; cmdbar 52px partout ; nouvelles pages 200.
- Vérif finale en prod, vrai navigateur, desktop + mobile.

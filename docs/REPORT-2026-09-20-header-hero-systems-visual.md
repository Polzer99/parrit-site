# Implémentation de la spec du 20/09/2026

Base locale demandée : branche `codex/header-hero-systems-visual`, commit `28fae7dcb20ca2751c7b1162ebcd6e5973f8ac63`. Plan fourni par la spec et explicitement validé par la demande utilisateur. Modifications locales réversibles, aucune écriture métier, aucun déploiement. Retour arrière possible par le diff de cette branche ; aucun fichier préexistant modifié par l'utilisateur n'a été écrasé.

## Changements

1. En-tête : retrait de l'état, de l'effet, du rendu et des règles CSS de l'horloge. CTA commission localisé dans la barre et dans le panneau mobile. Le lien mobile ferme le panneau comme les liens existants.
2. Accueil : agent déplacé entre sous-titre et capture, ancienne section supprimée, marge prescrite ajoutée, textes de clôture FR/EN corrigés.
3. Systems : composant et CSS repris des extraits, insertion entre narrative et registre.

Un commentaire du header contenait un tiret cadratin préexistant : remplacé par un point-virgule pour satisfaire le contrôle sur le fichier entier. Le test existant de succession des sections attend le hero au lieu de l'ancienne section agent ; la tolérance d'espacement est inchangée. Prototype REV 03 intact.

## Trois grep demandés

```sh
grep -n "clock" src/system/components/RevHeader.tsx src/app/'(rev01)'/rev01.css
grep -n "home-s-agent" src/app/'(rev01)'/page.tsx src/app/'(rev01)'/rev01.css
grep -n "—" src/system/components/RevHeader.tsx src/system/components/AgentEsquisse.tsx src/system/components/MechanismSchema.tsx src/app/'(rev01)'/page.tsx src/app/'(rev01)'/systems/page.tsx
```

Les trois commandes ont été exécutées : sortie vide, code 1 chacune (aucune correspondance, résultat attendu).

## Validation

- Baseline : contrôle de marque vert ; build resté à la compilation, interrompu. Chromium refusé avant modifications.
- `npm run build && npm run qa:brand:rev01` : build candidat resté à « Creating an optimized production build », arrêté après 90 secondes (code 124). La seconde commande chaînée n’a pas été atteinte ; le contrôle de marque exécuté séparément passe.
- Candidat : `npm run lint`, `npx tsc --noEmit`, `npm run qa:brand:rev01` et `git diff --check` passent.
- `npx next start -p 3210` : échec `listen EPERM`, port interdit dans le sandbox.
- `npm run qa:network:rev01 -- --workers=1 --max-failures=1` : échec au lancement de Chromium (`bootstrap_check_in`, Permission denied 1100), 73 tests non exécutés. Limite au premier échec pour éviter de répéter le même blocage ; aucune assertion ni protection réseau assouplie.
- Captures comparables avant/après et visibilité effective de l'interaction sans défilement : non vérifiées, navigateur indisponible. Aucune preuve de production revendiquée.
- Documentation Next.js installée consultée (Link et CSS). Context7 sollicité, quota mensuel épuisé.

## Relecture indépendante et limites de la spec

Question exacte : « en changeant seulement le nom et le logo, pourrait-on publier exactement cette pièce pour une autre agence ? »

Réponse de la relecture en lecture seule : oui pour les trois blocs et leur en-tête pris isolément ; non pour la section complète avec ses données propres à Parrit (onze outils, 114 fiches, quinze catégories sur vingt-cinq). Le test strict de distinctivité n'est donc pas validé. Les textes imposés ont été conservés, conformément à la demande explicite de fidélité.

Autre limite détectée dans le code existant : la règle `.rev-button`, située après l'emplacement prescrit de `.cmd-cta`, a la même spécificité et redéfinit le padding à `12px 18px`. L'extrait `.cmd-cta` demandé est présent exactement, mais son padding `8px 16px` sera supplanté par la cascade. Aucune adaptation visuelle hors spec n'a été introduite. Le rendu et la hauteur effective du bouton restent à vérifier dans un navigateur autorisé.

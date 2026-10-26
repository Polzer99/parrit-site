# Captures du lot 1

Les 50 captures sont définies dans `tests/site-v1.spec.ts` : accueil et quatre
pages, FR et EN, à 360, 390, 768, 1024 et 1440 px. Hauteur : 844 px.
Les requêtes externes sont bloquées par la fixture réseau commune.

Après `npm run build -- --webpack`, lancer `npm run start -- -p 3210` dans un
terminal puis `sh scripts/capture-site-v1.sh` dans un autre.

Cette session ne fournit aucune capture : Chromium est refusé par le sandbox
macOS avant navigation (`MachPortRendezvousServer`, permission denied).
Le script pose `SITE_V1_CAPTURE=1` et écrit les PNG ici uniquement lorsque les vérifications de page passent. Sans cette variable, `site-v1.spec.ts` ne produit aucun PNG pendant la QA réseau.
La suite complète `npm run qa:network:rev01` contrôle aussi contraste,
géométrie, clavier et mouvement réduit. Aucune capture historique n'a été écrasée.

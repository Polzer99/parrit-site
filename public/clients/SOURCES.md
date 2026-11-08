# Logos clients, décision du 27/10/2026

Les cinq logos sont affichés sur décision de Paul Larmaraud, sans accord écrit
des clients. Paul porte cette décision. Le registre `publicationLogo` conserve
l'auteur, la date, la provenance et le fichier ; la permission de nommer chaque
client reste vérifiée séparément par `getSiteEvidence`. MIT reste sans logo.

Fichiers de masque alpha fournis avec la passe 3, copiés sans modification :

- `laparra.png` (551×120) : https://www.laparra.fr, en-tête relevé le 27/10/2026.
- `clevery.png` (367×120) : https://www.cleveryavocats.fr.
- `forexpert.png` (119×120) : https://www.forexpert-formation.com ; pas forexpert.fr.
- `joone.png` (387×120) : https://www.joone.fr.
- `sncf.svg` (24×24) : simple-icons@15.16.1, `icons/sncf.svg`.

Marques de leurs propriétaires. Les fichiers sont servis localement, sans
chargement externe. La SNCF reste une référence de formation via partenaire.

## Passe 2, 08/11/2026

Fichiers ci-dessus conservés à l'identique ; permissions inchangées. Le composant
affiche désormais les pixels sources, avec éclairage CSS et retour sans filtre
en mouvement réduit. **Limite : les quatre PNG sont des masques monochromes,
et le SVG SNCF est noir.** Aucun fichier ne contient les couleurs des marques.
Le passage à `grayscale(0)`/`filter:none` ne peut donc pas restituer la pleine
couleur demandée par la spec. Les originaux locaux examinés sont également
monochromes ; récupération par CLI bloquée (résolution DNS). Aucun logo n'a été
recoloré artificiellement. Des originaux couleur de ces mêmes marques sont
nécessaires pour clore ce critère ; servir leurs fichiers localement et actualiser
la provenance avant remplacement.

## Trois ajouts, décision de Paul du 08/11/2026, nuit

Toyotomi Europe, Hiolle Technologies et Carte Noire sont publiables sur décision
nominative de Paul Larmaraud du 08/11/2026, sans accord écrit des clients.
Les autorisations de nom et de logo sont enregistrées séparément. Le Journal
continue de refuser ces noms, comme ceux des cinq références précédentes.
Les cinq fichiers existants restent inchangés.

Sources locales lues uniquement, exports PNG noirs sur fond transparent,
hauteur de 120 px comme les masques existants. Aucun redessin. Toyotomi et
Hiolle conservent l'alpha source ; leurs pixels colorés deviennent noirs.
Pour Carte Noire, le ruban blanc devient noir et le lettrage noir devient une
réserve transparente (alpha multiplié par luminance). Seules les marges
transparentes sont retirées ; EXIF et autres métadonnées ne sont pas recopiés.
Les exports ont été inspectés visuellement sur fond blanc.

- Toyotomi : en-tête de https://toyotomi.eu, relevé le 08/11/2026.
- Hiolle : en-tête de https://hiolle-technologies.fr, relevé le 08/11/2026.
- Carte Noire : fichier d'archive de Paul.

- `public/clients/toyotomi.png` (537×120)
  Source : `~/parrit-canon/docs/site-benchmark/logos-clients/toyotomi.png`
  SHA256 source : `036df9b3c8c737263892f991dec6f1428631e1cf08c7f9ba6e30bc91cc1ef252`
  SHA256 export : `5e158139fcb2e8656e08ed6ad4da087f9929c7abf0cd9b85e1ed837bda197161`
- `public/clients/hiolle-technologies.png` (402×120)
  Source : `~/parrit-canon/docs/site-benchmark/logos-clients/hiolle-technologies.svg`
  SHA256 source : `4f3bcad25410b96aa31f2c94903d8710eada48e5289022ed8a3a99ae779499f0`
  SHA256 export : `490f1dfeae98afdbd172f6fca71c9b74852b97218b4558c2274f711399234cd3`
- `public/clients/carte-noire.png` (254×120)
  Source : `~/parrit-canon/docs/site-benchmark/logos-clients/carte-noire.png`
  SHA256 source : `08ceef29eba51edf7a8fba06fc925460874306afbf3a0ff33bcaeccd36f70243`
  SHA256 export : `f318e6575aed79efefc86d5d79a8644476cb4915606b4aa7599039a958fa91c5`

La bande affiche huit références simultanément, avec retour à la ligne et
éclairage successif (cycle de 12,8 s, créneaux de 1,6 s, rampes de 300 ms).
Elle ne défile plus horizontalement ; sur téléphone, grille de deux colonnes.
La limite couleur de la passe 2 est historique : ce lot demande explicitement
des masques monochromes.

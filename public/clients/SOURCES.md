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

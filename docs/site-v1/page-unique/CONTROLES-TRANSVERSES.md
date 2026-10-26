# Restauration des contrôles transverses

Les cinq specs ont été restaurées par `git show HEAD:tests/<fichier>` puis
adaptées aux 14 routes actuelles. Aucun commit ni push.

- Aération : moteur, échelle fermée, plancher 16 px, écart texte/action 12 px,
  contrastes 4.5:1 et 3:1, dette figée et sondes imbriquées conservés. Le
  formulaire est ouvert avant mesure ; erreurs déclenchées dans le contact.
- Lisibilité : 375/390/1440, cibles 44 px, boutons 48 px, prose 1.44 minimum,
  débordement et H3 homogènes. Seuls les deux boutons de l'addendum restent
  à 22 px ; les autres restent à 16 px.
- Anti-slop : thèmes traités comme pages publiques, 40 articles conservés.
  Seules les huit chaînes de statut FR/EN exactes sont retirées, par ligne
  entière, avant le contrôle fictif/illustratif ; pluriels également interdits.
  Cadratins/demi-cadratins et statuts contrôlés aussi dans les articles.
  Le périmètre éditorial historique est conservé pour noOffer et les références
  de version (l'article sur Parrit cite STD-1.0). Aucune exemption par préfixe
  `/journal/` ne peut désormais englober les thèmes.
- Doctrine : destinations contact, navigation sans JS, capture simulée,
  typographie, captures et espacement rose sur toutes les routes. Les actions
  pleines sont désormais comptées dans les accents ; pas seulement le décor.
- Liens : minimum sept destinations et quarante pages découvertes conservés.
  Les ancres comptent comme destinations finales ; chaque document doit répondre
  200, chaque ancre exister. Aucun suivi automatique des redirections ; les URL
  absolues parrit.ai sont vérifiées sur l'origine locale.

Corrections du code : tailles arbitraires remplacées par l'échelle existante,
H3 à 22 px, cibles tactiles du header/footer, retour à la ligne du header,
hauteur des téléphones adaptée au texte lisible, focus des actions sombres,
espacement de l'erreur de formulaire, lien après capture vers l'ancre contact.
Fichiers vendorisés inchangés. Six destinations de liens dans deux articles
remplacées par les ancres finales ; prose éditoriale inchangée.

Validation : lint, 105 tests Node, build Webpack, conformité marque et 19 tests
Brand OS réussis. 154 tests restaurés recensés ; qa:network:rev01 totalise
228 tests dans 11 fichiers. Turbopack interrompu sans progression, repli Webpack.
La preuve navigateur n'est pas acquise ici : écoute 3210 refusée EPERM et
Chromium refusé avant navigation (MachPortRendezvousServer, Permission denied).
Les géométries et contrastes calculés doivent donc être rejoués sur l'hôte.

Contrôle complémentaire sans socket : 54 pages rendues par le serveur compilé,
715 destinations internes et ancres vérifiées (fichiers publics lus sur disque),
sans requête externe. Ne couvre ni le proxy, ni l'hydratation, ni la géométrie.
Le focus du hero utilise le rose clair déjà retenu pour sa silhouette sur canard ;
le moteur de contraste reconnaît ce jeton vendorisé, sans modifier ses seuils.

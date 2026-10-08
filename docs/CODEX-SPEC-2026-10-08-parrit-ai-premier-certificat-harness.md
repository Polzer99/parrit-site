# parrit.ai : publier le premier certificat Harness (08/10/2026)

Ordre direct de Paul (04/10 et 08/10) : déployer le label Harness Certified sur le contenu produit par l'IA. Le mécanisme est en
production (#306 : `HarnessBadge`, `src/system/harness-certificates.mjs`, `scripts/verify-certificates.mjs`).

Changement demandé, strict :
1. Copier À L'IDENTIQUE, octet pour octet, `docs/certificates-source/malicious-mcp-server-after-install.public.json` vers
   `public/certificates/malicious-mcp-server-after-install.json`. Ne rien reformater, ne rien réécrire : c'est un certificat signé
   par son empreinte (`certificate_sha256`).
2. Ne pas modifier `content/journal/malicious-mcp-server-after-install.mdx` : le certificat porte le sha256 de ce fichier exact
   (7c514e04…), toute modification invaliderait le certificat et ferait échouer la batterie, ce qui est voulu.
3. Ajouter un test qui vérifie que `checkCertificate("malicious-mcp-server-after-install")` est valide et que la page rendue de
   l'article contient le libellé « Harness Certified ✓ » et un lien vers `/certificates/malicious-mcp-server-after-install.json`.
4. Supprimer `docs/certificates-source/` après la copie (la source fait foi dans `~/.parrit/certificates/`, hors dépôt).

Batterie : `npm ci --silent && npm run build && npm run test:journal && npm run qa:claims:rev01` verte, plus le test ajouté.
Diffusion : PR ; fusion par Claude après CI verte.

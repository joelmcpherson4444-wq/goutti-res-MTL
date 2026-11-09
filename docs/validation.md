# Validation locale

Date : 9 novembre 2026. Node 24.22.1, Astro 5, Chromium local via Playwright.

- Compilation statique : réussie, six pages.
- 4 tests de configuration : aperçu sans appels/envois; numéro fictif bloqué; destination HTTPS et destinataire obligatoires; validation de l’origine canonique.
- 8 tests navigateur : pages et liens internes; métadonnées uniques; robots et sitemap hors index; clavier et dialogue fictif; champs obligatoires, téléphone et code postal; simulation sans POST et sans conversion; réponses réelles simulées (500, 200 non confirmé, succès confirmé); écran étroit de 320 px; barre mobile sans masquer le pied de page; formulaire désactivé sans JavaScript.
- Captures de l’accueil à 390 × 844 et 1440 × 1000, inspection visuelle des deux formats.
- Aucun service d’envoi externe configuré et aucun appel réel effectué.

## Limites à lever

Les deux originaux ajoutés au dépôt ont été intégrés : duplex en brique à l’accueil, gros plan blanc sur la page des descentes pluviales. Quatre WebP sont servis localement, avec recadrages mobiles et textes alternatifs descriptifs. Les captures mobile et ordinateur ont été renouvelées après intégration.

L’accès GitHub en écriture a été rétabli. La branche `feat/site-gouttieres-montreal` a été rattachée au commit initial de `main` et poussée. La description de PR figure dans `docs/pull-request.md`.

Les tests d’envoi utilisent des réponses réseau interceptées, pas une boîte de réception réelle. La réception par le partenaire devra être vérifiée après configuration. Le clavier et les largeurs sont testés; aucun audit exhaustif par lecteur d’écran n’est revendiqué. Aucun déploiement effectué.

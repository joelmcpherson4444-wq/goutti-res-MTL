# Validation locale

Date : 9 novembre 2026. Node 24.22.1, Astro 5, Chromium local via Playwright.

- Compilation statique : réussie, six pages.
- 4 tests de configuration : aperçu sans appels/envois; numéro fictif bloqué; destination HTTPS et destinataire obligatoires; validation de l’origine canonique.
- 8 tests navigateur : pages et liens internes; métadonnées uniques; robots et sitemap hors index; clavier et dialogue fictif; champs obligatoires, téléphone et code postal; simulation sans POST et sans conversion; réponses réelles simulées (500, 200 non confirmé, succès confirmé); écran étroit de 320 px; barre mobile sans masquer le pied de page; formulaire désactivé sans JavaScript.
- Captures de l’accueil à 390 × 844 et 1440 × 1000, inspection visuelle des deux formats.
- Aucun service d’envoi externe configuré et aucun appel réel effectué.

## Limites à lever

Les originaux des photos sont visibles dans le chat mais indisponibles comme fichiers téléchargeables. Les cadres provisoires sont explicites; le script d’optimisation et les composants responsive sont prêts. La qualité des recadrages et le poids final des WebP devront être vérifiés lorsque les fichiers seront intégrés.

GitHub autorise la lecture, mais l’application refuse les écritures : `403 Resource not accessible by integration`. La branche est créée localement; le push et la PR restent bloqués. La description proposée de PR figure dans `docs/pull-request.md`.

Les tests d’envoi utilisent des réponses réseau interceptées, pas une boîte de réception réelle. La réception par le partenaire devra être vérifiée après configuration. Le clavier et les largeurs sont testés; aucun audit exhaustif par lecteur d’écran n’est revendiqué. Aucun déploiement effectué.

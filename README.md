# Gouttières Montréal

Site statique Astro en français québécois. Six pages, CSS simple, aucune police ni bibliothèque externe chargée par le navigateur. Aucun déploiement configuré ou effectué.

## Aperçu local

Node.js 22.12+ (ou version compatible avec Astro 5), npm.

```sh
npm ci
npm run dev
# http://localhost:4321
```

Pour vérifier la version compilée :

```sh
npm run build
npm run preview
npm test
npm run test:browser
```

Les tests navigateur utilisent Chromium à `/usr/bin/chromium`. Adapter `playwright.config.mjs` à votre poste ou utiliser un navigateur installé par Playwright. Sur un environnement sans dossier personnel accessible, définir `ASTRO_TELEMETRY_DISABLED=1` et `npm_config_cache` vers un répertoire accessible.

## Configuration centrale

Modifier `src/config.mjs` : `business.name`, `phone`, `services`, `sectors`, `images`, `mode`, `publicUrl`, `indexable` et `quote`. Le nom est un nom de travail et les secteurs proposés sont à confirmer avec le partenaire. Les textes éditoriaux des pages demeurent dans `src/pages/`.

### Images originales — intégration en attente

Les deux images ont été montrées dans la conversation mais leurs fichiers n’étaient pas disponibles dans l’environnement d’exécution. Aucun visuel provenant d’une autre entreprise n’a été utilisé. Les cadres d’aperçu indiquent explicitement la photo manquante.

Lorsque les originaux sont accessibles :

```sh
npm run images -- /chemin/duplex.png /chemin/gouttiere-blanche.png
```

Le script produit quatre WebP dans `public/images/` : `duplex.webp`, `duplex-mobile.webp`, `downspout.webp`, `downspout-mobile.webp`. Vérifier les recadrages (point d’intérêt à droite), puis mettre `images.ready: true`. Les textes alternatifs sont centralisés. La photo du duplex est prioritaire sur l’accueil; celle de la descente apparaît sur la page correspondante. Les visuels sont présentés comme illustrations, sans revendication de réalisation.

## Aperçu et indexation

Le réglage livré est `mode: 'preview'`, `indexable: false`, `publicUrl: ''`. Toutes les pages portent `noindex, nofollow`, robots.txt interdit le parcours et le sitemap est vide. Aucune URL canonique factice. L’aperçu fonctionne sur localhost ou l’URL fournie par un hébergeur, sans domaine personnalisé.

`noindex` ne protège pas l’accès aux pages. Garder tout aperçu distant privé si nécessaire. Ne pas soumettre un aperçu aux moteurs. Les robots qui ne parcourent pas une page ne peuvent pas y lire son noindex.

Pour la version publique, dans une étape ultérieure autorisée :

1. Confirmer l’identité et les renseignements du partenaire, les services et la couverture. Relire les textes; ajouter uniquement les preuves vérifiées.
2. Intégrer et valider les deux images originales.
3. Configurer les appels et le formulaire selon les sections suivantes.
4. Renseigner `publicUrl` avec l’origine HTTPS publique réelle (par exemple l’adresse attribuée par l’hébergeur, sans chemin, requête ou fragment). Aucune obligation de domaine personnalisé.
5. Passer `mode` à `production`. L’indexation reste désactivée tant que `indexable` reste faux.
6. Après validation de la version publique, passer `indexable` à `true`, recompiler et déployer dans l’étape autorisée. Les canoniques utilisent `publicUrl`; robots.txt autorise le parcours et indique le sitemap des six pages.
7. Vérifier les règles de l’hébergeur (absence de `X-Robots-Tag: noindex` en production), les canoniques et le sitemap. Soumettre le sitemap public aux moteurs si souhaité.

La compilation refuse une indexation sans mode production, URL publique valide et images activées. Aucun balisage d’entreprise inventé (adresse, RBQ, avis, garantie, équipe).

## Appels et suivi

Le numéro livré `514 555-0148` est fictif. En aperçu, « Appeler » ouvre une boîte de dialogue explicite, sans lien `tel:` et sans événement de conversion. Pour activer les appels :

- Définir le vrai numéro dans `phone.display` et au format E.164 dans `phone.e164`.
- Vérifier le routage et mettre `phone.verified: true` et `mode: 'production'`.
- Si vous utilisez un numéro de suivi, utiliser ce numéro dans les deux champs et configurer son transfert vers le partenaire chez votre fournisseur. Tester un vrai appel et le traitement des appels manqués.

Le clic sur un lien téléphonique réel pousse `{ event: 'call_click', page_path }` dans `window.dataLayer`. Il mesure un clic, pas un appel abouti. Aucun script de mesure tiers n’est livré; connecter ensuite votre outil de mesure et définir la gestion du consentement appropriée. Ne pas placer les noms, téléphones ou descriptions dans les événements.

## Destination des demandes

En aperçu, validation native et validation du téléphone, puis succès simulé sans requête réseau ni stockage local. Utiliser des données fictives. Aucun événement `quote_submit_success` n’est émis pour une simulation.

Avant d’activer l’envoi réel :

1. Choisir un service d’envoi et une destination contrôlée par le partenaire. Configurer le destinataire chez ce service; ne jamais mettre une clé secrète dans le navigateur ou la configuration publique.
2. Renseigner `quote.recipient` avec un court texte final identifiant qui recevra les données, leur usage et les renseignements de confidentialité pertinents. Le texte est affiché au-dessus du formulaire; le consentement est requis en mode réel.
3. Configurer `quote.endpoint` avec une URL HTTPS et `quote.enabled: true`, puis `mode: 'production'`.
4. L’endpoint doit accepter POST JSON avec `name`, `phone`, `postal`, `project`, `description` et `consent`. Valider côté serveur, limiter les abus, configurer CORS pour l’origine publique et gérer la confidentialité et la conservation des données. Le JSON retourné doit être **`{"success":true}`**, avec statut HTTP 2xx, uniquement après acceptation réelle de la demande par le service. Une page HTML ou une simple réponse 200 ne suffit pas.
5. Tester l’arrivée effective à la destination, un échec réseau, un rejet du service, la validation et le blocage des doubles clics.

`quote_submit_success` n’est poussé qu’après statut 2xx ET confirmation JSON `success: true`. Le succès simulé, une erreur ou une réponse non confirmée ne déclenchent rien. Le navigateur abandonne après 15 secondes; un statut non confirmé invite à réessayer, sans annoncer un envoi réussi. Le prestataire devra gérer les doublons côté serveur si nécessaire.

## Validation et transfert

Voir `docs/validation.md` pour les contrôles et limites. Captures de l’accueil : `docs/accueil-mobile.png` et `docs/accueil-desktop.png`. Elles reflètent les cadres provisoires tant que les fichiers originaux manquent. La navigation s’inspire seulement du regroupement Services / Secteurs du site de référence; les contenus, styles et composants sont propres au projet.

Avant mise en ligne : revue de la PR, photos originales, partenaire et couverture confirmés, vrai numéro testé, destinataire nommé, service d’envoi et règles de confidentialité validés, URL publique configurée, captures renouvelées, validation finale et autorisation de publier. Aucun déploiement automatique dans ce dépôt.

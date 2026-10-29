# Corpus Sana — Site web

Site web officiel de **CORPUS SANA ONGD**, une Organisation Non Gouvernementale de Développement basée en République Démocratique du Congo. Fondée en novembre 2018 à Kinshasa, l'organisation œuvre pour promouvoir le bien-être universel et intégral de l'Homme, avec une attention particulière portée à la santé.

Le site présente la mission de l'organisation, ses engagements, ses partenaires, ses actualités (articles stockés en base de données) ainsi que son travail autour de la valorisation des plantes médicinales traditionnelles.

## Stack technique

| Outil | Rôle |
| :--- | :--- |
| [Astro](https://astro.build) `^7.3.3` | Framework, rendu serveur (`output: 'server'`) |
| [`@astrojs/netlify`](https://docs.astro.build/fr/guides/integrations-guide/netlify/) | Adaptateur de déploiement Netlify (fonctions serverless) |
| [Turso](https://turso.tech) / [`@libsql/client`](https://github.com/tursodatabase/libsql-client-ts) | Base de données SQLite distante pour les articles |
| [`marked`](https://marked.js.org) | Conversion du contenu Markdown des articles en HTML |
| CSS encapsulé (scoped) | Style par composant, sans framework UI externe |

Un peu de JavaScript natif est utilisé côté client pour le carrousel d'actualités.

## Prérequis

- **Node.js** `>= 22.12.0`
- **npm**
- Une base **Turso** (URL + jeton d'authentification)

## Installation

```sh
npm install
```

Copiez `.env.example` en `.env` à la racine (ignoré par Git) et remplissez-le :

```ini
TURSO_DATABASE_URL=libsql://<votre-base>.turso.io
TURSO_AUTH_TOKEN=<jeton-turso>
ADMIN_SECRET=<chaîne-secrète-longue-et-aléatoire>
ADMIN_PASSWORD=<mot-de-passe-de-l-espace-admin>
```

| Variable | Utilisation |
| :--- | :--- |
| `TURSO_DATABASE_URL` | URL de la base Turso. **Obligatoire** : `src/turso.ts` lève une erreur si elle est absente. |
| `TURSO_AUTH_TOKEN` | Jeton d'accès Turso. **Obligatoire**. |
| `ADMIN_SECRET` | Jeton *Bearer* exigé par l'API `POST /api/articles`, et clé de signature des cookies de session admin. |
| `ADMIN_PASSWORD` | Mot de passe de connexion à `/admin`. Si `ADMIN_SECRET` ou `ADMIN_PASSWORD` manque, aucune connexion n'est possible. |

Ces mêmes variables doivent être définies dans **Netlify → Site configuration → Environment variables** pour la production.

### Schéma de la base de données

La table `articles` n'est pas créée automatiquement. Le schéma ci-dessous correspond aux colonnes lues et écrites par le code :

```sql
CREATE TABLE IF NOT EXISTS articles (
  slug    TEXT PRIMARY KEY,           -- identifiant d'URL : [a-z0-9-]+
  title   TEXT NOT NULL,
  author  TEXT NOT NULL,
  summary TEXT NOT NULL,
  date    TEXT NOT NULL,              -- format AAAA-MM-JJ
  image   TEXT,                       -- URL de l'image (optionnelle)
  color   TEXT DEFAULT 'blue',        -- 'blue' | 'orange' | 'green'
  content TEXT NOT NULL               -- corps de l'article en Markdown
);
```

Pour l'appliquer avec la CLI Turso : `turso db shell <votre-base> < schema.sql`.

## Commandes

| Commande | Action |
| :--- | :--- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Lance le serveur de développement sur `localhost:4321` |
| `npm run build` | Génère le build de production dans `./dist/` (nécessite l'accès à Turso) |
| `npm run preview` | Prévisualise le build localement |
| `npm run astro ...` | Exécute la CLI Astro (`astro add`, `astro check`…) |

## Structure du projet

```text
/
├── astro.config.mjs          # output: 'server' + adaptateur Netlify
├── netlify.toml              # configuration de build Netlify
├── .env.example              # modèle des variables d'environnement
├── public/                   # favicon.svg, favicon.ico
└── src/
    ├── turso.ts              # client libSQL partagé (lit les variables d'env)
    ├── auth.ts               # mot de passe admin + cookie de session signé (HMAC)
    ├── middleware.ts         # protège toutes les routes /admin
    ├── content.config.ts     # collection "articles" (Markdown) — héritée, non utilisée
    ├── content/
    │   ├── article.json      # ancien format JSON — hérité, non utilisé
    │   └── articles/*.md     # ancien format Markdown — hérité, non utilisé
    ├── assets/               # images optimisées par astro:assets
    │   ├── hero/             # diaporama du Hero
    │   ├── img/              # illustrations de la page « À propos »
    │   └── partners/         # logos des partenaires
    ├── layouts/
    │   └── BaseLayout.astro  # <html lang="fr">, Header + Footer
    ├── components/
    │   ├── Header.astro      # barre du haut, navigation et sous-menus, sélecteur FR/EN
    │   ├── Hero.astro        # bannière plein écran, slider CSS (effet Ken Burns)
    │   ├── PartnerBar.astro  # bandeau des partenaires
    │   ├── EngagementSec.astro # engagements, cartes à accent coloré
    │   ├── ActuSec.astro     # carrousel des 4 derniers articles (lus depuis Turso)
    │   ├── PharmaSec.astro   # plantes médicinales → médicaments, cartes en quinconce
    │   └── Footer.astro
    └── pages/
        ├── index.astro             # accueil
        ├── about/about-us.astro    # mission, valeurs, chronologie, partenaires
        ├── articles/index.astro    # liste des articles (50 max)
        ├── articles/[slug].astro   # page d'un article
        ├── admin.astro             # formulaire de création d'article (protégé)
        ├── admin/login.astro       # connexion à l'espace admin
        ├── admin/logout.ts         # POST : déconnexion
        └── api/articles.ts         # POST : insertion d'un article
```

## Routes

| Route | Rendu | Description |
| :--- | :--- | :--- |
| `/` | Serveur (à chaque requête) | Accueil : Hero, partenaires, engagements, actualités, pharmacopée |
| `/about/about-us` | Serveur | Présentation de l'ONGD, valeurs, chiffres clés, chronologie, partenaires |
| `/articles` | Serveur | Liste des articles, triés par date décroissante |
| `/articles/[slug]` | Serveur | Article complet, Markdown converti en HTML |
| `/admin` | Serveur, **protégé** | Formulaire de publication d'un article |
| `/admin/login` | Serveur | Connexion par mot de passe |
| `POST /admin/logout` | Serveur | Déconnexion |
| `POST /api/articles` | Serveur | Insère un article (`Authorization: Bearer <ADMIN_SECRET>`) |

## Gestion des articles

Les articles sont stockés dans la table Turso `articles`.

1. Ouvrir `/admin`. Sans session valide, le visiteur est redirigé vers `/admin/login` pour saisir `ADMIN_PASSWORD`. La session dure 8 heures.
2. Remplir le formulaire : slug, date, titre, auteur, couleur, résumé, image (URL) et contenu Markdown.
3. Le formulaire est traité côté serveur. Il appelle `POST /api/articles` avec `ADMIN_SECRET`, qui valide les champs obligatoires et insère la ligne.
4. L'article apparaît aussitôt sur l'accueil et sur `/articles`, qui sont rendus à chaque requête.

Vous pouvez aussi appeler l'API directement :

```sh
curl -X POST https://<votre-site>/api/articles \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slug":"mon-article","title":"Titre","author":"Corpus Sana","summary":"Résumé","date":"2026-10-29","color":"green","content":"## Bonjour\n\nTexte en **Markdown**."}'
```

Réponses possibles : `201` (créé), `400` (champs manquants), `401` (jeton invalide), `500` (erreur base de données, par exemple un slug déjà utilisé).

## Charte graphique

Couleurs communes à toutes les sections, et valeurs possibles du champ `color` d'un article :

- Bleu `#009cb4` (`blue`)
- Orange `#eb690b` (`orange`)
- Vert `#48a23f` (`green`)

## Déploiement (Netlify)

La configuration est dans `netlify.toml` : commande `npm run build`, dossier publié `dist`, Node 22, et quelques en-têtes de sécurité. L'adaptateur `@astrojs/netlify` transforme les pages rendues à la demande en fonction Netlify.

1. Pousser le dépôt sur GitHub. `.env` est ignoré par Git, seul `.env.example` est versionné.
2. Sur Netlify : **Add new project → Import an existing project → GitHub**, puis choisir le dépôt. Les réglages de build sont lus depuis `netlify.toml`.
3. Dans **Project configuration → Environment variables**, ajouter `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_SECRET` et `ADMIN_PASSWORD`. Utiliser de nouvelles valeurs fortes pour la production.
4. Lancer le déploiement (**Deploys → Trigger deploy**). Chaque push sur `main` redéploie ensuite le site.
5. Vérifier `/`, `/articles`, puis la connexion sur `/admin/login`.

En local, l'émulation des Edge Functions est désactivée (`devFeatures: { edgeFunctions: false }` dans `astro.config.mjs`), car le site n'en utilise pas.

## Sécurité de l'espace admin

- `src/middleware.ts` intercepte toute route `/admin…` (sauf `/admin/login`) et redirige vers la connexion si le cookie de session est absent, expiré ou falsifié.
- Le cookie `admin_session` vaut `<expiration>.<signature HMAC-SHA256>`, signé avec `ADMIN_SECRET`. Il est `HttpOnly`, `SameSite=Strict`, `Secure` en production, limité au chemin `/admin` et valable 8 heures. Changer `ADMIN_SECRET` déconnecte toutes les sessions.
- Les comparaisons de mot de passe et de signature se font en temps constant. Les réponses `/admin` sont envoyées avec `Cache-Control: no-store`.
- La protection CSRF d'Astro (`security.checkOrigin`, active par défaut) refuse les formulaires envoyés depuis un autre site.
- Il n'y a pas de limite au nombre de tentatives de connexion : choisissez un mot de passe long (16 caractères ou plus).

## Limites connues / À faire

- Le contenu Markdown est converti par `marked` sans assainissement. Le HTML écrit dans un article est donc injecté tel quel.
- Plusieurs liens de la navigation pointent vers des pages qui n'existent pas encore : `/contact`, `/donate`, `/faire-un-don`, `/nos-domaines`, `/sante`, `/nutrition`, `/education`, `/environnement`, `/expertise`, `/fr/produits`, `/en`, `/mentions-legales`, `/politique-confidentialite`.
- `src/content.config.ts`, `src/content/article.json` et `src/content/articles/*.md` viennent des anciennes versions (JSON puis Markdown) et ne sont plus lus par le site.

## En savoir plus

- Documentation Astro : [docs.astro.build](https://docs.astro.build)
- Documentation Turso : [docs.turso.tech](https://docs.turso.tech)

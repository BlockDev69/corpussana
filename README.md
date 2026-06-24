# Corpus Sana — Site web

Site web officiel de **CORPUS SANA ONGD**, une Organisation Non Gouvernementale de Développement basée en République Démocratique du Congo. Fondée en novembre 2018 à Kinshasa, l'organisation œuvre pour promouvoir le bien-être universel et intégral de l'Homme, avec une attention particulière portée à la santé.

Le site présente la mission de l'organisation, ses engagements, ses actualités, ainsi que son travail autour de la valorisation des plantes médicinales traditionnelles pour la création de médicaments.

## Stack technique

- **[Astro](https://astro.build)** `^6.4.2` — génération de site statique, composants `.astro`.
- **CSS encapsulé** (scoped) par composant, sans framework UI externe.
- **Zéro dépendance runtime** hormis Astro ; un peu de JavaScript natif pour le carrousel d'actualités.

## Prérequis

- **Node.js** `>= 22.12.0`
- **npm** (ou un gestionnaire de paquets compatible)

## Installation

```sh
npm install
```

> 🧑‍🚀 Pour lancer le serveur de développement : `npm run dev`.

## 🚀 Structure du projet

Arborescence du projet :

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Header / Hero / PartnerBar / EngagementSec / ActuSec / PharmaSec
│   ├── layouts
│   │   └── BaseLayout.astro
│   └── pages
│       └── index.astro
└── package.json
```

## Composants principaux

- **`Hero.astro`** — bannière plein écran avec slider d'images en CSS pur (effet Ken Burns).
- **`EngagementSec.astro`** — présentation des engagements de l'organisation, cartes à accent coloré.
- **`ActuSec.astro`** — carrousel d'actualités et d'articles de blog ; boutons de défilement sur desktop, scroll tactile horizontal sur mobile (fond bleu nuit).
- **`PharmaSec.astro`** — transformation des plantes médicinales en médicaments, via des cartes carrées avec images et disposition dynamique en quinconce.

Une charte de couleurs commune est utilisée à travers les sections : bleu (`#009cb4`), orange (`#eb690b`) et vert (`#48a23f`).

## 🧞 Commandes

Toutes les commandes se lancent depuis la racine du projet :

| Commande                  | Action                                                       |
| :------------------------ | :----------------------------------------------------------- |
| `npm install`             | Installe les dépendances                                     |
| `npm run dev`             | Lance le serveur de développement sur `localhost:4321`       |
| `npm run build`           | Génère le site de production dans `./dist/`                  |
| `npm run preview`         | Prévisualise le build localement avant déploiement           |
| `npm run astro ...`       | Exécute les commandes CLI Astro (`astro add`, `astro check`) |
| `npm run astro -- --help` | Affiche l'aide de la CLI Astro                               |

## 👀 En savoir plus

- Documentation Astro : [docs.astro.build](https://docs.astro.build)

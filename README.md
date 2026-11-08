# Adopte un jardin

Site pour proposer son jardin à la location ou à la cueillette de fruits et légumes.
Démo front-only : toutes les données sont stockées dans le `localStorage` du navigateur,
la connexion et le paiement sont simulés.

**🌱 Site en ligne : https://mathieujullien77190.github.io/jardin/**
· **📚 Storybook (package UI) : https://mathieujullien77190.github.io/jardin/storybook/**

## Stack

Next.js (App Router, export statique / SSG) · React · TypeScript · Tailwind CSS ·
Zustand (état + persistance `localStorage`) · MapLibre GL · ESLint · Prettier ·
Storybook (package UI)

## Fonctionnalités

- Connexion fictive : e-mail et mot de passe au choix (un compte est créé automatiquement).
  Au premier lancement, le site te connecte avec un compte fictif rempli de données
  (jardins autour de Melun, favoris, réservations, messages).
- Recherche par texte, commune, rayon (km), prix max, équipements (outils, eau, toilettes), tri
- Vraie carte MapLibre GL (fond OpenFreeMap) : jardins regroupés en clusters, polygones sur
  le cadastre réel (cliquables), lignes cadastrales à fort zoom
- Fiche jardin : parcelle cadastrale sur photo aérienne IGN, plages d’accès, équipements,
  photos, adresse et téléphone visibles après réservation
- Sélecteur d’adresse (géocodeur gratuit de la Géoplateforme) : la parcelle cadastrale est
  retrouvée automatiquement
- Deux modes : **cueillette** (au panier / au kg) et **location** de parcelle (à l’année)
- Réservation avec frais de service, paiement simulé, code de validation saisi par le
  propriétaire, versements en mars / juin / octobre
- Tableaux de bord propriétaire (`/mes-parcelles`) et jardinier (`/mes-reservations`)
- Favoris, avis et notes, messagerie
- Échanges de plantes (plants, semis, graines, boutures)
- Guide : 4 documents détaillés (louer, cueillir, proposer son jardin, échanger des plantes)
- Version tablette et mobile : barre de navigation en bas sur téléphone, carte au-dessus
  de la liste

## Scripts

```bash
npm install
npm run dev              # http://localhost:3000
npm run lint
npm run typecheck
npm run format
npm run build            # génère le site statique dans ./out
npm run storybook        # catalogue du package UI sur http://localhost:6006
npm run build-storybook
npm run parcels          # retire des parcelles cadastrales au hasard (API Carto IGN)
npm run gardens          # régénère les jardins de démo répartis en France
```

## Package UI (`packages/ui`)

Workspace npm `@adopte-un-jardin/ui` : primitives React + Tailwind (Button, Chip, Field,
Badge, Stars, EmptyState, HeartIcon) et jetons de design (`theme.css`). Chaque composant a une
story Storybook (prose dans `*.fr.md`, snippet consommateur dans `*.source.md`).

## Données de démo

- Parcelles : API Carto de l’IGN (`scripts/fetch-parcels.mjs` → `src/constants/parcels.ts`,
  `scripts/generate-gardens.mjs` → `src/constants/generated-gardens.ts`), tirées au hasard
  près de chaque commune.
- Le worker MapLibre est copié dans `public/maplibre/` par `predev` / `prebuild`.

## Déploiement GitHub Pages

`.github/workflows/deploy.yml` construit le site (`basePath: '/jardin'` en production) et le
Storybook, puis publie le tout. À activer une fois dans le dépôt : **Settings → Pages →
Source : GitHub Actions**.

## Structure

```
src/
  app/            routes (pages fines)
  components/     un dossier par composant (index, composant, helpers, constants, types)
    ui/           re-exports du package UI (Button ajoute next/link)
  constants/      clés, routes, communes, données de démo
  helpers/        stockage, formats, géo, tarifs, filtres, adresse, cadastre
  hooks/          useApp (façade sur les stores), useQueryId
  store/          stores Zustand (app persisté, toasts)
  types/          modèle de domaine
packages/ui/      package UI + Storybook
maquettes/        3 maquettes HTML de départ
```

# Adopte un jardin

Site pour proposer son jardin à la location ou à la cueillette de fruits et légumes.
Démo front-only : toutes les données sont stockées dans le `localStorage` du navigateur,
la connexion et le paiement sont simulés.

## Stack

Next.js (App Router, export statique / SSG) · React · TypeScript · Tailwind CSS · ESLint · Prettier

## Fonctionnalités

- Recherche par texte, commune, rayon (km), prix max, équipements (outils, eau, toilettes), tri
- Vraie carte MapLibre GL (fond OpenFreeMap) : bulles par commune, polygones des jardins sur
  le cadastre réel (cliquables), lignes cadastrales à fort zoom
- Fiche jardin : parcelle cadastrale sur photo aérienne IGN
- Fiche parcelle : surface, eau, compteur, outils, toilettes, plages d’accès, personnes max,
  équipements, photos multiples, adresse et téléphone visibles après réservation
- Deux modes : **cueillette** (au panier / au kg) et **location** de parcelle (à l’année)
- Réservation avec frais de service, paiement simulé, code de validation saisi par le propriétaire,
  versements en mars / juin / octobre
- Tableaux de bord propriétaire (`/mes-parcelles`) et jardinier (`/mes-reservations`)
- Favoris, avis et notes, messagerie
- Échanges de plantes (plants, semis, graines, boutures)
- Profil avec commune par défaut, guide, thème clair / sombre
- Connexion fictive (comptes démo : `marie@demo.fr`, `jean@demo.fr`, `lea@demo.fr`, `samir@demo.fr`,
  n’importe quel mot de passe)

## Scripts

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run format
npm run build        # génère le site statique dans ./out
npm run parcels      # retire des parcelles cadastrales au hasard (API Carto IGN)
```

Les parcelles des jardins de démo viennent de l’API Carto de l’IGN (`scripts/fetch-parcels.mjs`
→ `src/constants/parcels.ts`) : parcelles tirées au hasard près de chaque commune.
Le worker MapLibre est copié dans `public/maplibre/` par `predev` / `prebuild`.

## Déploiement GitHub Pages

`next.config.ts` exporte un site statique et applique `basePath: '/jardin'` en production
(nom du dépôt). Publier le dossier `out/` avec une GitHub Action
(`actions/upload-pages-artifact` + `actions/deploy-pages`).

## Structure

```
src/
  app/            routes (pages fines)
  components/     un dossier par composant (index, composant, helpers, constants, types)
    ui/           primitives partagées (Button, Chip, Field, Badge, Stars, EmptyState)
  constants/      clés, routes, communes, données de démo
  helpers/        stockage, formats, géo, tarifs, filtres
  hooks/          useApp (contexte), useQueryId
  types/          modèle de domaine
maquettes/        3 maquettes HTML de départ
```

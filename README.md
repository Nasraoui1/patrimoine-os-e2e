# patrimoine-os-e2e

Tests automatisés end-to-end de **PatrimoineOS** avec [Playwright](https://playwright.dev) :

- **Tests API** sur `patrimoine-os-api` (NestJS) — projet Playwright `api`
- **Tests UI** sur `patrimoine-os-web` (React/Vite) — projets `chromium` et `firefox`

Les tests unitaires restent dans chaque repo (Jest côté API, Vitest côté web). Ce repo couvre le comportement de bout en bout.

## Structure

```
tests/
  api/          # tests HTTP de l'API (request fixture)
  ui/           # tests navigateur
  pages/        # Page Objects (LoginPage, ...)
utils/          # données de test, helpers
playwright.config.ts
.github/workflows/e2e.yml   # CI : démarre Postgres + API + Web puis lance les tests
```

## Prérequis

L'API et le front doivent tourner en local :

```bash
# dans patrimoine-os-api
npm run db:up
npm run start:dev

# dans patrimoine-os-web
npm run dev
```

## Installation

```bash
npm install
npx playwright install
cp .env.example .env   # puis renseigner un compte de test si besoin
```

## Lancer les tests

| Commande | Description |
| --- | --- |
| `npm test` | Tous les tests (API + UI Chromium + Firefox) |
| `npm run test:api` | Tests API uniquement |
| `npm run test:ui` | Tests UI sur Chromium |
| `npm run test:headed` | Tests UI avec navigateur visible |
| `npm run test:debug` | Mode debug pas à pas |
| `npm run report` | Ouvre le dernier rapport HTML |
| `npm run codegen` | Enregistre un scénario en cliquant dans l'app |

Les tests « connexion réussie » sont sautés si `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` ne sont pas définis (le compte doit avoir un email vérifié et pas de 2FA).

## Conventions

- Un fichier `*.spec.ts` par fonctionnalité.
- Sélecteurs accessibles en priorité (`getByRole`, `getByLabel`), pas de sélecteurs CSS fragiles.
- Données uniques par exécution (`uniqueEmail()`) pour que les tests soient indépendants et rejouables.
- Les interactions d'une page passent par son Page Object dans `tests/pages/`.

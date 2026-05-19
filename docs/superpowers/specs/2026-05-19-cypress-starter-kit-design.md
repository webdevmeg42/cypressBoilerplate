# Cypress Starter Kit — Design Spec

**Date:** 2026-05-19
**Status:** Approved

---

## Overview

A production-pattern Cypress starter kit targeting full-stack (UI + API) test coverage. Uses TypeScript, Page Objects for UI, typed API helpers, Mochawesome reporting, GitHub Actions CI, and ESLint + Prettier. Demo suites run against two public APIs: JSONPlaceholder (API tests) and Reqres.in (UI/auth tests).

---

## Folder Structure

```
cypressBoilerplate/
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── posts.cy.ts        # JSONPlaceholder: CRUD on /posts
│   │   │   └── users.cy.ts        # JSONPlaceholder: GET /users
│   │   └── ui/
│   │       └── auth.cy.ts         # Reqres.in: login/register via browser
│   ├── fixtures/
│   │   ├── api/
│   │   │   └── post.json          # Sample post payload
│   │   └── ui/
│   │       └── user.json          # Login credentials
│   ├── support/
│   │   ├── api/
│   │   │   └── jsonplaceholder.ts # Typed helper: wraps cy.request() calls
│   │   ├── pages/
│   │   │   └── LoginPage.ts       # Page Object for Reqres.in login UI
│   │   ├── commands.ts            # Custom Cypress commands
│   │   ├── e2e.ts                 # Entry point — imports commands
│   │   └── index.d.ts             # TS type declarations for custom commands
├── .github/
│   └── workflows/
│       └── cypress.yml
├── cypress.config.ts
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
├── package.json
└── README.md
```

---

## Architecture

### Cypress Config (`cypress.config.ts`)
- `baseUrl`: `https://reqres.in` (UI tests default)
- `env.jsonplaceholderUrl`: `https://jsonplaceholder.typicode.com`
- Reporter: Mochawesome, output to `cypress/reports/`
- `video: false` in CI to reduce artifact size

### TypeScript
- Single `tsconfig.json` at root, targeting `ES2020`
- `types: ["cypress"]` — no separate tsconfig for support files
- Custom commands declared in `support/index.d.ts` as `Cypress.Chainable` namespace extensions for full autocomplete

### Custom Commands (`support/commands.ts`)
| Command | Behavior |
|---|---|
| `cy.login(email, password)` | POSTs to Reqres.in `/api/login`, stores token in `Cypress.env('token')` |
| `cy.createPost(body)` | POSTs to JSONPlaceholder `/posts`, returns response chain |

### API Helpers (`support/api/jsonplaceholder.ts`)
Exported typed functions that wrap `cy.request()`. Specs call helpers, not raw requests.
- `getPosts()` → `Cypress.Chainable<Cypress.Response<Post[]>>`
- `getUser(id: number)` → `Cypress.Chainable<Cypress.Response<UserResponse>>`
- `createPost(body: Partial<Post>)` → `Cypress.Chainable<Cypress.Response<Post>>`

### Page Objects (`support/pages/LoginPage.ts`)
Class with chainable methods. Selectors are private constants.
- `LoginPage.visit()` — navigates to `/`
- `.fillEmail(email)` — types into email field
- `.fillPassword(password)` — types into password field
- `.submit()` — clicks submit button, returns `this`

---

## Demo Test Suites

### `e2e/api/posts.cy.ts`
- GET `/posts` — assert 100 items returned, verify shape of first item
- GET `/posts/1` — assert specific field values
- POST `/posts` — assert 201 status, echoed body fields, `id` present

### `e2e/api/users.cy.ts`
- GET `/users?page=1` — assert pagination fields (`page`, `total`, `per_page`)
- GET `/users/2` — assert email format with regex, assert `id === 2`

### `e2e/ui/auth.cy.ts`
- Successful login → token stored, no error shown
- Failed login (bad credentials) → error message displayed
- Register with new email → token returned

---

## CI, Linting & Reporting

### GitHub Actions (`.github/workflows/cypress.yml`)
- Triggers: `push` and `pull_request` to `main`
- Steps: checkout → Node 20 setup → `npm ci` → `npx cypress run` via `cypress-io/github-action`
- Artifacts: `cypress/reports/` and `cypress/screenshots/` uploaded on failure

### Mochawesome
- Packages: `mochawesome`, `mochawesome-merge`, `mochawesome-report-generator`
- `cypress/reports/` is gitignored
- `npm run report` merges per-spec JSON → single HTML report

### ESLint + Prettier
- `eslint-plugin-cypress` rules: no magic-number waits, no `cy.pause()` in committed code, no assigning return values
- Prettier: single quotes, 2-space indent, trailing commas (`es5`)

### `package.json` Scripts
```json
{
  "cy:open":    "cypress open",
  "cy:run":     "cypress run",
  "cy:run:api": "cypress run --spec 'cypress/e2e/api/**'",
  "cy:run:ui":  "cypress run --spec 'cypress/e2e/ui/**'",
  "lint":       "eslint cypress --ext .ts",
  "format":     "prettier --write .",
  "report":     "mochawesome-merge cypress/reports/*.json | marge --reportDir cypress/reports/html"
}
```

---

## What's Gitignored
- `node_modules/`
- `cypress/reports/`
- `cypress/screenshots/`
- `cypress/videos/`

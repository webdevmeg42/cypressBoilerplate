# Cypress Boilerplate

Production-pattern Cypress starter kit with TypeScript, Page Objects, typed API helpers, Mochawesome reporting, and GitHub Actions CI.

Demo test suites run against [JSONPlaceholder](https://jsonplaceholder.typicode.com) (API tests) and [DummyJSON](https://dummyjson.com) (auth flow tests).

## Getting Started

```bash
npm install
npm run cy:open   # open interactive Test Runner
npm run cy:run    # run all tests headless
```

## Project Structure

```
cypress/
├── e2e/
│   ├── api/          # API tests (JSONPlaceholder)
│   └── ui/           # Auth flow tests (DummyJSON)
├── fixtures/
│   ├── api/          # API test data
│   └── ui/           # UI/auth test data
└── support/
    ├── api/          # Typed cy.request() helpers
    ├── pages/        # Page Object classes
    ├── commands.ts   # Custom cy.* commands
    ├── e2e.ts        # Entry point
    └── index.d.ts    # Command type declarations
```

## Scripts

| Command | Description |
|---|---|
| `npm run cy:open` | Open Cypress Test Runner (interactive) |
| `npm run cy:run` | Run all tests headless |
| `npm run cy:run:api` | Run API tests only |
| `npm run cy:run:ui` | Run UI/auth tests only |
| `npm run lint` | Lint TypeScript files with ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run report` | Merge JSON outputs → HTML report |

## Custom Commands

| Command | Description |
|---|---|
| `cy.login(username, password)` | POST to DummyJSON `/auth/login`, stores accessToken in `Cypress.env('token')` |
| `cy.createPost(body)` | POST to JSONPlaceholder `/posts`, returns response |

## CI

Tests run automatically on every push and pull request to `main` via GitHub Actions. Reports and screenshots are uploaded as artifacts and retained for 7 days.

## Adding Your Own Tests

- **API tests:** add helpers to `cypress/support/api/`, import in `cypress/e2e/api/`
- **UI tests:** add Page Object classes to `cypress/support/pages/`, use in `cypress/e2e/ui/`
- **Custom commands:** declare in `cypress/support/commands.ts` and `cypress/support/index.d.ts`

# Cypress Boilerplate

Production-pattern Cypress starter kit with TypeScript, Page Objects, typed API helpers, Mochawesome reporting, and GitHub Actions CI.

Demo test suites run against [JSONPlaceholder](https://jsonplaceholder.typicode.com) (API tests) and [DummyJSON](https://dummyjson.com) (auth flow tests).

## Setup

```bash
npm install
```

## Running Cypress

### Interactive mode

Opens the Cypress Test Runner UI where you can select and watch tests run in a browser.

```bash
npm run cy:open
```

### Headless mode

Runs the full test suite in the terminal with no browser window. Use this for CI or quick local checks.

```bash
npm run cy:run
```

### Run a specific suite

```bash
npm run cy:run:api   # API tests only  (cypress/e2e/api/**)
npm run cy:run:ui    # Auth flow tests (cypress/e2e/ui/**)
```

### Run a single spec file

```bash
npx cypress run --spec 'cypress/e2e/api/posts.cy.ts'
```

### Run with a specific browser

```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser electron   # default, bundled with Cypress
```

### Headed mode (headless runner + visible browser)

```bash
npx cypress run --headed
```

## Reports

After a headless run, merge the per-spec JSON files into a single HTML report:

```bash
npm run report
```

The report is written to `cypress/reports/html/index.html`.

## Code Quality

```bash
npm run lint     # ESLint — checks for Cypress anti-patterns and TypeScript issues
npm run format   # Prettier — formats all files in place
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

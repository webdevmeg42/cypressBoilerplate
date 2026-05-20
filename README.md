# Cypress Boilerplate

Production-pattern Cypress starter kit with TypeScript, Page Objects, typed API helpers, test tagging, accessibility checks, Mochawesome reporting, and Docker-based GitHub Actions CI.

Demo test suites run against [JSONPlaceholder](https://jsonplaceholder.typicode.com) (API tests) and [DummyJSON](https://dummyjson.com) (auth flow tests).

## Setup

```bash
npm install
```

## Running Cypress

### Interactive mode

Opens the Cypress Test Runner UI in Chrome (recommended).

```bash
npm run cy:open
```

To open with Electron instead:

```bash
npm run cy:open:electron
```

> **Note:** Electron has known GPU sandbox issues on macOS Ventura+. Use Chrome if you see a blank runner or renderer crash errors.

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
npx cypress run --browser electron
```

### Headed mode (headless runner + visible browser)

```bash
npx cypress run --headed
```

### Run against a different base URL

Override the `baseUrl` from `cypress.config.ts` at runtime — useful for pointing at staging, a local dev server, or a feature environment without changing config files.

```bash
npx cypress run --config baseUrl=https://staging.example.com
npx cypress run --config baseUrl=http://localhost:3000
```

### Keep running after a failure

```bash
npx cypress run --config bail=false   # run all tests even when some fail
npx cypress run --config bail=1       # stop after the first failure
```

### Run tests by tag

Tests are tagged `@smoke` and `@regression` using `@cypress/grep`. Pass a tag at runtime to filter:

```bash
npx cypress run --env grepTags=@smoke
npx cypress run --env grepTags=@regression
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
│   ├── api/
│   │   ├── posts.cy.ts           # CRUD tests with fixture-backed assertions + cy.task()
│   │   ├── posts-intercept.cy.ts # cy.intercept() examples: stub, spy, on-the-fly mutation
│   │   └── users.cy.ts           # GET tests
│   └── ui/
│       ├── accessibility.cy.ts   # WCAG 2.1 AA checks via cypress-axe
│       └── auth.cy.ts            # Login, error, and /auth/me flows
├── fixtures/
│   ├── api/                      # posts.json, post.json, users.json, user.json
│   └── ui/                       # user.json, login-response.json, me-response.json
└── support/
    ├── api/                      # Typed cy.request() helpers (jsonplaceholder.ts)
    ├── helpers/
    │   ├── fuzzers.ts            # fuzzString, fuzzEmoji, fuzzIp, randomInt, randomFloat
    │   └── overrides.ts          # Global Cypress config overrides (scrollBehavior)
    ├── pages/                    # Page Object classes (LoginPage.ts)
    ├── commands.ts               # Custom cy.* commands
    ├── e2e.ts                    # Entry point
    └── index.d.ts                # Command and type declarations
```

## Custom Commands

| Command | Description |
|---|---|
| `cy.login(username, password)` | POST to DummyJSON `/auth/login`, stores accessToken in `Cypress.env('token')` |
| `cy.createPost(body)` | POST to JSONPlaceholder `/posts`, returns response |

## Tasks

`cy.task()` calls run in Node.js (outside the browser). Two tasks are registered in `cypress.config.ts`:

| Task | Returns | Use case |
|---|---|---|
| `cy.task('generateUuid')` | `string` | Unique values for test data (e.g. post titles) |
| `cy.task('log', message)` | `null` | Node-side console output during a test run |

## Fuzzers

Import from `cypress/support/helpers/fuzzers.ts` to generate randomised test inputs:

```ts
import { fuzzString, fuzzEmoji, fuzzIp, randomInt, randomFloat } from '../../support/helpers/fuzzers';
```

| Function | Signature | Example output |
|---|---|---|
| `fuzzString` | `(length = 10, charset: 'alpha' \| 'alphanumeric' \| 'all' = 'alphanumeric')` | `"aB3xKq7mWz"` |
| `fuzzEmoji` | `(count = 1)` | `"🔥💀✨"` |
| `fuzzIp` | `(version: 4 \| 6 = 4)` | `"192.168.42.7"` |
| `randomInt` | `(min, max)` | `42` |
| `randomFloat` | `(min, max, decimals = 2)` | `3.14` |

## CI

Tests run automatically on every push and pull request to `main` via GitHub Actions.

**Jobs:**
1. `lint-and-typecheck` — runs `tsc --noEmit` and `eslint` inside a `node:20` Docker container. The test job only starts if this passes.
2. `cypress-run` — runs in a `cypress/base:20.18.0` Docker container, split across two parallel runners (API specs / UI specs).

**Artifacts:** test reports and screenshots are uploaded per runner and retained for 7 days.

**Manual trigger:** the workflow can be dispatched from the GitHub Actions UI with optional inputs:

| Input | Description |
|---|---|
| `branch` | Branch to check out (default: `main`) |
| `base_url` | Override `baseUrl` — point at staging or a feature environment |
| `spec` | Run a single spec or glob instead of the full suite |
| `grep` | Filter by tag, e.g. `@smoke` |

## Adding Your Own Tests

- **API tests:** add helpers to `cypress/support/api/`, import in `cypress/e2e/api/`
- **UI tests:** add Page Object classes to `cypress/support/pages/`, use in `cypress/e2e/ui/`
- **Custom commands:** declare in `cypress/support/commands.ts` and `cypress/support/index.d.ts`
- **Fuzzers:** add generator functions to `cypress/support/helpers/fuzzers.ts`

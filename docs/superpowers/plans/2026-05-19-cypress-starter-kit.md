# Cypress Starter Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a full-stack Cypress boilerplate with TypeScript, Page Objects, typed API helpers, Mochawesome reporting, and GitHub Actions CI — with a live demo test suite against JSONPlaceholder (API) and Reqres.in (auth flows).

**Architecture:** App-layer separation: `cypress/e2e/api/` for JSONPlaceholder request tests, `cypress/e2e/ui/` for Reqres.in auth-flow tests. Typed API helpers wrap `cy.request()` calls; a LoginPage class follows the Page Object pattern for auth. Custom commands expose common flows as first-class `cy.*` methods.

**Tech Stack:** Cypress 13, TypeScript 5, Mochawesome 7 + mochawesome-merge + marge, ESLint 8 + eslint-plugin-cypress 3 + @typescript-eslint, Prettier 3, GitHub Actions (cypress-io/github-action@v6)

---

## File Map

| File | Role |
|---|---|
| `package.json` | Dependencies, npm scripts |
| `tsconfig.json` | TypeScript config targeting Cypress files |
| `cypress.config.ts` | baseUrl, env vars, Mochawesome reporter |
| `.eslintrc.cjs` | Cypress lint rules + TypeScript rules |
| `.prettierrc` | Formatting defaults |
| `.gitignore` | Ignores node_modules, reports, screenshots, videos |
| `cypress/fixtures/api/post.json` | Sample POST payload for posts spec |
| `cypress/fixtures/ui/user.json` | Reqres.in login credentials |
| `cypress/support/index.d.ts` | Type declarations for custom commands |
| `cypress/support/api/jsonplaceholder.ts` | Typed helpers: `getPosts`, `getPost`, `createPost`, `getUsers`, `getUser` |
| `cypress/support/pages/LoginPage.ts` | Page Object wrapping Reqres.in auth endpoints |
| `cypress/support/commands.ts` | `cy.login()`, `cy.createPost()` custom commands |
| `cypress/support/e2e.ts` | Entry point — imports commands |
| `cypress/e2e/api/posts.cy.ts` | GET all, GET one, POST — JSONPlaceholder |
| `cypress/e2e/api/users.cy.ts` | GET list, GET one — JSONPlaceholder |
| `cypress/e2e/ui/auth.cy.ts` | Login success, login error, register — Reqres.in |
| `.github/workflows/cypress.yml` | CI: run on push/PR, upload artifacts |
| `README.md` | Setup and usage instructions |

---

## Task 1: Bootstrap — package.json + install

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "cypress-boilerplate",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:api": "cypress run --spec 'cypress/e2e/api/**'",
    "cy:run:ui": "cypress run --spec 'cypress/e2e/ui/**'",
    "lint": "eslint cypress --ext .ts",
    "format": "prettier --write .",
    "report": "mochawesome-merge cypress/reports/*.json | marge --reportDir cypress/reports/html"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "cypress": "^13.0.0",
    "eslint": "^8.57.0",
    "eslint-plugin-cypress": "^3.0.0",
    "mochawesome": "^7.1.3",
    "mochawesome-merge": "^4.3.0",
    "mochawesome-report-generator": "^6.2.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` generated, no errors.

- [ ] **Step 3: Verify Cypress installed**

Run: `npx cypress --version`
Expected: prints Cypress version (13.x), no error.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: initialise project with dependencies"
```

---

## Task 2: TypeScript Config

**Files:**
- Create: `tsconfig.json`

- [ ] **Step 1: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["cypress"],
    "baseUrl": "."
  },
  "include": ["cypress/**/*.ts"]
}
```

- [ ] **Step 2: Verify config parses**

Run: `npx tsc --noEmit`
Expected: exits 0. (No files matched yet — that's fine; the config itself is valid.)

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: add TypeScript config"
```

---

## Task 3: Cypress Config

**Files:**
- Create: `cypress.config.ts`

- [ ] **Step 1: Create cypress.config.ts**

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://reqres.in',
    env: {
      jsonplaceholderUrl: 'https://jsonplaceholder.typicode.com',
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
    },
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(_on, config) {
      return config;
    },
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add cypress.config.ts
git commit -m "chore: add Cypress config with Mochawesome reporter"
```

---

## Task 4: Linting and Formatting

**Files:**
- Create: `.eslintrc.cjs`
- Create: `.prettierrc`

- [ ] **Step 1: Create .eslintrc.cjs**

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'cypress'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
  ],
  env: {
    'cypress/globals': true,
    node: true,
  },
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

- [ ] **Step 2: Create .prettierrc**

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

- [ ] **Step 3: Verify lint runs (no cypress files yet — expect clean output)**

Run: `npm run lint 2>&1 || true`
Expected: either exits 0 or reports "No files matched" — no actual lint errors.

- [ ] **Step 4: Commit**

```bash
git add .eslintrc.cjs .prettierrc
git commit -m "chore: add ESLint and Prettier config"
```

---

## Task 5: .gitignore

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create .gitignore**

```
node_modules/
cypress/reports/
cypress/screenshots/
cypress/videos/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add gitignore"
```

---

## Task 6: Fixtures

**Files:**
- Create: `cypress/fixtures/api/post.json`
- Create: `cypress/fixtures/ui/user.json`

- [ ] **Step 1: Create fixture directories and api/post.json**

```bash
mkdir -p cypress/fixtures/api cypress/fixtures/ui
```

`cypress/fixtures/api/post.json`:
```json
{
  "title": "Test Post Title",
  "body": "This is the body of the test post.",
  "userId": 1
}
```

- [ ] **Step 2: Create cypress/fixtures/ui/user.json**

```json
{
  "email": "eve.holt@reqres.in",
  "password": "cityslicka"
}
```

- [ ] **Step 3: Commit**

```bash
git add cypress/fixtures/
git commit -m "feat: add test fixtures for posts and users"
```

---

## Task 7: Type Declarations for Custom Commands

**Files:**
- Create: `cypress/support/index.d.ts`

- [ ] **Step 1: Create cypress/support/index.d.ts**

```typescript
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Log in via Reqres.in /api/login. Stores token in Cypress.env('token').
     * @example cy.login('eve.holt@reqres.in', 'cityslicka')
     */
    login(email: string, password: string): Chainable<string>;

    /**
     * Create a post via JSONPlaceholder /posts.
     * @example cy.createPost({ title: 'Hello', body: 'World', userId: 1 })
     */
    createPost(body: {
      title: string;
      body: string;
      userId: number;
    }): Chainable<Response<{ id: number; title: string; body: string; userId: number }>>;
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add cypress/support/index.d.ts
git commit -m "feat: add TypeScript declarations for custom commands"
```

---

## Task 8: JSONPlaceholder API Helpers

**Files:**
- Create: `cypress/support/api/jsonplaceholder.ts`

- [ ] **Step 1: Create cypress/support/api/jsonplaceholder.ts**

```typescript
interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

const baseUrl = (): string => Cypress.env('jsonplaceholderUrl') as string;

export const getPosts = (): Cypress.Chainable<Cypress.Response<Post[]>> =>
  cy.request<Post[]>(`${baseUrl()}/posts`);

export const getPost = (id: number): Cypress.Chainable<Cypress.Response<Post>> =>
  cy.request<Post>(`${baseUrl()}/posts/${id}`);

export const createPost = (body: Omit<Post, 'id'>): Cypress.Chainable<Cypress.Response<Post>> =>
  cy.request<Post>({
    method: 'POST',
    url: `${baseUrl()}/posts`,
    body,
  });

export const getUsers = (): Cypress.Chainable<Cypress.Response<User[]>> =>
  cy.request<User[]>(`${baseUrl()}/users`);

export const getUser = (id: number): Cypress.Chainable<Cypress.Response<User>> =>
  cy.request<User>(`${baseUrl()}/users/${id}`);
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add cypress/support/api/jsonplaceholder.ts
git commit -m "feat: add typed JSONPlaceholder API helpers"
```

---

## Task 9: LoginPage Page Object

**Files:**
- Create: `cypress/support/pages/LoginPage.ts`

> Note: Reqres.in is an API service without browser login forms. `LoginPage` wraps its REST auth endpoints in the Page Object pattern — the same structure used when `cy.visit()` and DOM interactions replace `cy.request()` in a real UI app.

- [ ] **Step 1: Create cypress/support/pages/LoginPage.ts**

```typescript
const ENDPOINTS = {
  login: '/api/login',
  register: '/api/register',
} as const;

interface AuthPayload {
  email: string;
  password: string;
}

interface AuthSuccessResponse {
  token: string;
}

interface AuthErrorResponse {
  error: string;
}

interface RegisterSuccessResponse {
  id: number;
  token: string;
}

export const LoginPage = {
  login(payload: AuthPayload): Cypress.Chainable<Cypress.Response<AuthSuccessResponse>> {
    return cy.request<AuthSuccessResponse>({
      method: 'POST',
      url: ENDPOINTS.login,
      body: payload,
    });
  },

  loginExpectingError(
    payload: Partial<AuthPayload>
  ): Cypress.Chainable<Cypress.Response<AuthErrorResponse>> {
    return cy.request<AuthErrorResponse>({
      method: 'POST',
      url: ENDPOINTS.login,
      body: payload,
      failOnStatusCode: false,
    });
  },

  register(payload: AuthPayload): Cypress.Chainable<Cypress.Response<RegisterSuccessResponse>> {
    return cy.request<RegisterSuccessResponse>({
      method: 'POST',
      url: ENDPOINTS.register,
      body: payload,
    });
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add cypress/support/pages/LoginPage.ts
git commit -m "feat: add LoginPage Page Object for auth flows"
```

---

## Task 10: Custom Commands + Entry Point

**Files:**
- Create: `cypress/support/commands.ts`
- Create: `cypress/support/e2e.ts`

- [ ] **Step 1: Create cypress/support/commands.ts**

```typescript
import { createPost } from './api/jsonplaceholder';
import { LoginPage } from './pages/LoginPage';

Cypress.Commands.add('login', (email: string, password: string) => {
  return LoginPage.login({ email, password }).then(({ body }) => {
    Cypress.env('token', body.token);
    return body.token;
  });
});

Cypress.Commands.add('createPost', (body) => {
  return createPost(body);
});
```

- [ ] **Step 2: Create cypress/support/e2e.ts**

```typescript
import './commands';
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add cypress/support/commands.ts cypress/support/e2e.ts
git commit -m "feat: add custom commands cy.login() and cy.createPost()"
```

---

## Task 11: Posts API Spec

**Files:**
- Create: `cypress/e2e/api/posts.cy.ts`

- [ ] **Step 1: Create cypress/e2e/api/posts.cy.ts**

```typescript
import { createPost, getPost, getPosts } from '../../support/api/jsonplaceholder';

describe('Posts API — JSONPlaceholder', () => {
  it('GET /posts returns 100 posts with the correct shape', () => {
    getPosts().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(100);

      const first = response.body[0];
      expect(first).to.have.all.keys('id', 'title', 'body', 'userId');
      expect(first.id).to.be.a('number');
      expect(first.title).to.be.a('string').and.have.length.greaterThan(0);
      expect(first.userId).to.be.a('number');
    });
  });

  it('GET /posts/1 returns the expected post', () => {
    getPost(1).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body.userId).to.eq(1);
      expect(response.body.title).to.be.a('string').and.have.length.greaterThan(0);
      expect(response.body.body).to.be.a('string').and.have.length.greaterThan(0);
    });
  });

  it('POST /posts creates a new post and echoes the body', () => {
    cy.fixture('api/post').then((post: { title: string; body: string; userId: number }) => {
      createPost(post).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.title).to.eq(post.title);
        expect(response.body.body).to.eq(post.body);
        expect(response.body.userId).to.eq(post.userId);
        expect(response.body.id).to.be.a('number');
      });
    });
  });
});
```

- [ ] **Step 2: Run the spec and verify all 3 tests pass**

Run: `npx cypress run --spec 'cypress/e2e/api/posts.cy.ts'`
Expected: `3 passing` printed to stdout, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add cypress/e2e/api/posts.cy.ts
git commit -m "feat: add Posts API spec against JSONPlaceholder"
```

---

## Task 12: Users API Spec

**Files:**
- Create: `cypress/e2e/api/users.cy.ts`

- [ ] **Step 1: Create cypress/e2e/api/users.cy.ts**

```typescript
import { getUser, getUsers } from '../../support/api/jsonplaceholder';

describe('Users API — JSONPlaceholder', () => {
  it('GET /users returns all 10 users with the correct shape', () => {
    getUsers().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(10);

      const first = response.body[0];
      expect(first).to.include.all.keys('id', 'name', 'username', 'email');
      expect(first.id).to.be.a('number');
      expect(first.email).to.be.a('string').and.include('@');
    });
  });

  it('GET /users/2 returns the correct user with a valid email', () => {
    getUser(2).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(2);
      expect(response.body.name).to.be.a('string').and.have.length.greaterThan(0);
      expect(response.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });
});
```

- [ ] **Step 2: Run the spec and verify both tests pass**

Run: `npx cypress run --spec 'cypress/e2e/api/users.cy.ts'`
Expected: `2 passing` printed to stdout, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add cypress/e2e/api/users.cy.ts
git commit -m "feat: add Users API spec against JSONPlaceholder"
```

---

## Task 13: Auth Spec

**Files:**
- Create: `cypress/e2e/ui/auth.cy.ts`

- [ ] **Step 1: Create cypress/e2e/ui/auth.cy.ts**

```typescript
import { LoginPage } from '../../support/pages/LoginPage';

describe('Auth flows — Reqres.in', () => {
  context('Login', () => {
    it('stores a token in Cypress.env on successful login', () => {
      cy.fixture('ui/user').then((user: { email: string; password: string }) => {
        cy.login(user.email, user.password);
      });
      cy.wrap(null).then(() => {
        const token = Cypress.env('token') as string;
        expect(token).to.be.a('string').and.have.length.greaterThan(0);
      });
    });

    it('returns 400 and an error message when password is missing', () => {
      LoginPage.loginExpectingError({ email: 'eve.holt@reqres.in' }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Missing password');
      });
    });
  });

  context('Register', () => {
    it('returns a token on successful registration', () => {
      LoginPage.register({ email: 'eve.holt@reqres.in', password: 'pistol' }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token').that.is.a('string');
        expect(response.body).to.have.property('id').that.is.a('number');
      });
    });
  });
});
```

- [ ] **Step 2: Run the spec and verify all 3 tests pass**

Run: `npx cypress run --spec 'cypress/e2e/ui/auth.cy.ts'`
Expected: `3 passing` printed to stdout, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add cypress/e2e/ui/auth.cy.ts
git commit -m "feat: add auth flow spec against Reqres.in"
```

---

## Task 14: GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/cypress.yml`

- [ ] **Step 1: Create .github/workflows/cypress.yml**

```bash
mkdir -p .github/workflows
```

```yaml
name: Cypress Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  cypress-run:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Run Cypress tests
        uses: cypress-io/github-action@v6

      - name: Upload test reports and screenshots
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: cypress-results
          path: |
            cypress/reports/
            cypress/screenshots/
          retention-days: 7
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/cypress.yml
git commit -m "ci: add GitHub Actions workflow for Cypress"
```

---

## Task 15: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README.md**

```markdown
# Cypress Boilerplate

Production-pattern Cypress starter kit with TypeScript, Page Objects, typed API helpers, Mochawesome reporting, and GitHub Actions CI.

Demo test suites run against [JSONPlaceholder](https://jsonplaceholder.typicode.com) (API tests) and [Reqres.in](https://reqres.in) (auth flow tests).

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
│   └── ui/           # Auth flow tests (Reqres.in)
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
| `cy.login(email, password)` | POST to Reqres.in `/api/login`, stores token in `Cypress.env('token')` |
| `cy.createPost(body)` | POST to JSONPlaceholder `/posts`, returns response |

## CI

Tests run automatically on every push and pull request to `main` via GitHub Actions. Reports and screenshots are uploaded as artifacts and retained for 7 days.

## Adding Your Own Tests

- **API tests:** add helpers to `cypress/support/api/`, import in `cypress/e2e/api/`
- **UI tests:** add Page Object classes to `cypress/support/pages/`, use in `cypress/e2e/ui/`
- **Custom commands:** declare in `cypress/support/commands.ts` and `cypress/support/index.d.ts`
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup and usage instructions"
```

---

## Task 16: Full Run Verification

- [ ] **Step 1: Run the linter across all Cypress TypeScript files**

Run: `npm run lint`
Expected: exits 0, no errors (warnings are OK).

- [ ] **Step 2: Run the full test suite headless**

Run: `npm run cy:run`
Expected output (exact counts):
```
  Posts API — JSONPlaceholder
    ✓ GET /posts returns 100 posts with the correct shape
    ✓ GET /posts/1 returns the expected post
    ✓ POST /posts creates a new post and echoes the body

  Users API — JSONPlaceholder
    ✓ GET /users returns all 10 users with the correct shape
    ✓ GET /users/2 returns the correct user with a valid email

  Auth flows — Reqres.in
    Login
      ✓ stores a token in Cypress.env on successful login
      ✓ returns 400 and an error message when password is missing
    Register
      ✓ returns a token on successful registration

  8 passing
```

- [ ] **Step 3: Final commit if any cleanup was needed**

If any files were changed during verification:
```bash
git add -A
git commit -m "chore: final verification pass"
```

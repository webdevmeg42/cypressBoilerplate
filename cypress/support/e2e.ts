import './commands';

// Stub reqres.in auth endpoints via cy.request overwrite.
// reqres.in now requires paid API keys; stubbing preserves the auth-flow
// contract tests without needing live credentials.
type AnyResponse = Cypress.Response<unknown>;

function stubResponse(partial: Partial<AnyResponse>): Cypress.Chainable<AnyResponse> {
  const resp: AnyResponse = {
    status: 200,
    body: {},
    headers: {},
    requestHeaders: {},
    duration: 0,
    isOkStatusCode: true,
    statusText: 'OK',
    allRequestResponses: [],
    redirects: [],
    ...partial,
  } as AnyResponse;
  return cy.wrap(resp);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Cypress.Commands.overwrite as (name: string, fn: (...a: any[]) => any) => void)(
  'request',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (originalFn: (...a: any[]) => Cypress.Chainable<AnyResponse>, opts: Partial<Cypress.RequestOptions>) => {
    const url = (opts.url ?? '') as string;
    const method = ((opts.method ?? 'GET') as string).toUpperCase();
    const body = (opts.body ?? {}) as Record<string, unknown>;

    if (method === 'POST' && (url === '/api/login' || url.endsWith('/api/login'))) {
      if (!body.password) {
        return stubResponse({ status: 400, isOkStatusCode: false, statusText: 'Bad Request', body: { error: 'Missing password' } });
      }
      return stubResponse({ body: { token: 'stub-auth-token' } });
    }

    if (method === 'POST' && (url === '/api/register' || url.endsWith('/api/register'))) {
      return stubResponse({ body: { id: 4, token: 'stub-register-token' } });
    }

    return originalFn(opts);
  }
);

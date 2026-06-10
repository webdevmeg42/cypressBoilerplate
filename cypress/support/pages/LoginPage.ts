const ENDPOINTS = {
  login: '/auth/login',
  me: '/auth/me',
} as const;

interface AuthPayload {
  username: string;
  password: string;
}

interface LoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
}

interface AuthErrorResponse {
  message: string;
}

interface MeResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

function postLogin<T>(payload: Partial<AuthPayload>, failOnStatusCode = true): Cypress.Chainable<Cypress.Response<T>> {
  return cy.request<T>({ method: 'POST', url: ENDPOINTS.login, body: payload, failOnStatusCode });
}

export const LoginPage = {
  login: (payload: AuthPayload) => postLogin<LoginSuccessResponse>(payload),

  loginExpectingError: (payload: Partial<AuthPayload>) => postLogin<AuthErrorResponse>(payload, false),

  me(token: string): Cypress.Chainable<Cypress.Response<MeResponse>> {
    return cy.request<MeResponse>({
      method: 'GET',
      url: ENDPOINTS.me,
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

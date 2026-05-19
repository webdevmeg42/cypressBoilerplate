// API-layer auth helper following the Page Object naming convention.
// In a real app, replace cy.request() calls with cy.visit() + cy.get() interactions.
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

export const LoginPage = {
  login(payload: AuthPayload): Cypress.Chainable<Cypress.Response<LoginSuccessResponse>> {
    return cy.request<LoginSuccessResponse>({
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

  me(token: string): Cypress.Chainable<Cypress.Response<MeResponse>> {
    return cy.request<MeResponse>({
      method: 'GET',
      url: ENDPOINTS.me,
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

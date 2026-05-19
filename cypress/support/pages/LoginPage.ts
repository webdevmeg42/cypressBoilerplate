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

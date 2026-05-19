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

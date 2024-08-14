// Extend Cypress interface to include custom command
declare global {
  namespace Cypress {
    interface Chainable {
      loginAndSaveToken(): Chainable<void>;
    }
  }
}

export {};

import { Method } from 'cypress/types/net-stubbing';

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<string>;

      setTokenInLocalStorage(accessToken: string): Chainable<void>;
      interceptWithToken(method: Method, url: string, accessToken: string): Chainable<void>;
      visitWithToken(url: string): Chainable<void>;  // Add this line for visitWithToken
    }
  }
}

export {};

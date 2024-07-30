/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }



import { CypressEnum } from '../enums/cypress.enum';

Cypress.Commands.add('login', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;

  cy.visit('/auth/login');

  cy.intercept('POST', Cypress.env('api_server') + '/auth/login').as('login');

  cy.get('input[formControlName="email"]').type(loginEmail);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait('@login').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
    // console.log('response = ', interception.response);
  });
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

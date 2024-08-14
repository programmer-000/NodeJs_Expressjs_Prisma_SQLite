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


import { CypressEnum } from '../enums/cypress.enum';

Cypress.Commands.add('loginAndSaveToken', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;

  cy.visit('/auth/login');

  cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
    req.on('response', (res) => {
      window.localStorage.setItem('accessToken', res.body.accessToken);
    });
  }).as('login');

  cy.get('input[formControlName="email"]').type(loginEmail);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();

  cy.wait('@login').its('response.statusCode').should('eq', 200);
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});


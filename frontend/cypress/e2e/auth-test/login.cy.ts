import { CypressEnum } from '../../enums/cypress.enum';

describe('LoginComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;
  const testExampleEmail = CypressEnum.TestExampleEmail;

  beforeEach(() => {
    cy.visit('/auth/login'); // Navigate to the login page before each test
  });

  it('should display the login form', () => {
    verifyLoginFormIsDisplayed();
  });

  it('should display validation errors', () => {
    displayValidationErrors();
  });

  it('should enable the login button when the form is valid', () => {
    fillLoginForm(loginEmail, password);
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should show an error message on failed login', () => {
    simulateFailedLogin(testExampleEmail, 'wrongpassword');
  });

  it('should log in the user and navigate to the home page on successful login', () => {
    simulateSuccessfulLogin(loginEmail, password);
    verifyNavigationToHomePage();
  });

  // Helper functions
  const verifyLoginFormIsDisplayed = () => {
    cy.get('mat-card-title').contains('Login Account');
    cy.get('input[formControlName="email"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  };

  const displayValidationErrors = () => {
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('mat-error').contains('Email required');
    cy.get('input[formControlName="email"]').type('invalid-email').blur();
    cy.get('mat-error').contains('Invalid email').should('be.visible');

    cy.get('input[formControlName="password"]').focus().blur();
    cy.get('mat-error').contains('Password required');
  };

  const fillLoginForm = (email: string, password: string) => {
    cy.get('input[formControlName="email"]').type(email).should('have.value', email);
    cy.get('input[formControlName="password"]').type(password).should('have.value', password);
  };

  const simulateFailedLogin = (email: string, password: string) => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginAttempt');

    fillLoginForm(email, password);
    cy.get('button[type="submit"]').click();
    cy.get('mat-snack-bar-container').should('be.visible'); // Check message availability
  };

  const simulateSuccessfulLogin = (email: string, password: string) => {
    cy.intercept('POST', Cypress.env('api_server') + '/auth/login').as('login');

    fillLoginForm(email, password);
    cy.get('button[type="submit"]').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
  };

  const verifyNavigationToHomePage = () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/'); // Check URL change
    cy.get('app-post-statistics').should('be.visible'); // Optionally, check for some element on the home page
  };
});

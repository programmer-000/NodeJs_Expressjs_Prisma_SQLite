import { CypressEnum } from '../enums/cypress.enum';

describe('LoginComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;
  const testExampleEmail = CypressEnum.TestExampleEmail;

  // Navigate to the login page before each test
  beforeEach(() => {
    cy.visit('/auth/login'); // Adjust the URL as needed
  });

  // Test to ensure the login form is displayed correctly
  it('should display the login form', () => {
    cy.get('mat-card-title').contains('Login Account');
    cy.get('input[formControlName="email"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  // Test to ensure validation errors are displayed when fields are left empty
  it('should display validation errors', () => {
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('mat-error').contains('Email required');
    cy.get('input[formControlName="email"]').type('invalid-email').blur();
    cy.get('mat-error').contains('Invalid email').should('be.visible');

    cy.get('input[formControlName="password"]').focus().blur();
    cy.get('mat-error').contains('Password required');
  });

  // Test to ensure the login button is enabled when the form is valid
  it('should enable the login button when the form is valid', () => {
    cy.get('input[formControlName="email"]').type(loginEmail).should('have.value', loginEmail);
    cy.get('input[formControlName="password"]').type(password).should('have.value', password);
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  // Test to simulate a failed login attempt and display an error message
  it('should show an error message on failed login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    });

    cy.get('input[formControlName="email"]').type(testExampleEmail);
    cy.get('input[formControlName="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check message availability
    cy.get('mat-snack-bar-container').should('be.visible');
  });

  // Test to simulate a successful login attempt and navigation to the home page
  it('should log in the user and navigate to the home page on successful login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    });

    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Check URL change to ensure navigation to the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Optionally, check for some element on the home page to confirm navigation
    cy.get('app-post-statistics').should('be.visible');
  });
});

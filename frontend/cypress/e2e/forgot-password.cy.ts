import { CypressEnum } from '../enums/cypress.enum';

describe('ForgotPasswordComponent', () => {
  const testExampleEmail = CypressEnum.TestExampleEmail;
  const loginEmail = CypressEnum.LoginEmail;

  // Navigate to the forgot password page before each test
  beforeEach(() => {
    cy.visit('/auth/forgot-password'); // Adjust the route as necessary
  });

  // Test to ensure the forgot password form is displayed
  it('should display the forgot password form', () => {
    cy.get('mat-card-title').contains('Forgot Password');
    cy.get('form').should('be.visible');
  });

  // Test to ensure the submit button is initially disabled
  it('should have an initially disabled submit button', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  // Test to enable the submit button when the email is valid
  it('should enable the submit button when the email is valid', () => {
    cy.get('input[formControlName="email"]').type(testExampleEmail);
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  // Test to display validation errors for the email field
  it('should display validation errors for email field', () => {
    // Trigger required validation error
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('mat-error').contains('Email required').should('be.visible');

    // Trigger invalid email validation error
    cy.get('input[formControlName="email"]').type('invalid-email').blur();
    cy.get('mat-error').contains('Invalid email').should('be.visible');
  });

  // Test to submit the form and show success notification
  it('should submit the form and show success notification', () => {
    // Intercept the API call
    cy.intercept('POST', '/api/auth/verify-email', {
      statusCode: 200,
      body: { message: 'Success' },
    }).as('verifyEmail');

    // Fill in the form and submit
    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('button[type="submit"]').click();

    // Wait for the API call to complete
    // cy.wait('@verifyEmail');

    // Check message availability
    cy.get('mat-snack-bar-container').should('be.visible');
  });

  // Test to show error message on failed email verification
  it('should show error message on failed email verification', () => {
    // Intercept the API call and simulate an error
    cy.intercept('POST', '/api/auth/verify-email', {
      statusCode: 400,
      body: { message: 'Error' },
    }).as('verifyEmailError');

    // Fill in the form and submit
    cy.get('input[formControlName="email"]').type(testExampleEmail);
    cy.get('button[type="submit"]').click();

    // Wait for the API call to complete
    // cy.wait('@verifyEmailError');

    // Check that an error message is shown
    cy.get('mat-snack-bar-container').should('be.visible');
  });

  // Test to navigate back to the login page on clicking the Back button
  it('should navigate back to login page on clicking Back button', () => {
    cy.get('a').contains('Back').click();
    cy.url().should('include', '/auth/login'); // Adjust the route as necessary
  });
});

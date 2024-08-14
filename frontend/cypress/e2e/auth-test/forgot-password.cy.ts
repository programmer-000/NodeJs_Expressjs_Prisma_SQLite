import { CypressEnum } from '../../enums/cypress.enum';

describe('ForgotPasswordTest', () => {
  const testExampleEmail = CypressEnum.TestExampleEmail;
  const loginEmail = CypressEnum.LoginEmail;

  beforeEach(() => {
    cy.visit('/auth/forgot-password'); // Navigate to the forgot password page before each test
  });

  it('should display the forgot password form', () => {
    verifyForgotPasswordFormIsDisplayed();
  });

  it('should have an initially disabled submit button', () => {
    verifySubmitButtonIsDisabled();
  });

  it('should enable the submit button when the email is valid', () => {
    fillEmail(testExampleEmail);
    verifySubmitButtonIsEnabled();
  });

  it('should display validation errors for email field', () => {
    displayEmailValidationErrors();
  });

  it('should submit the form and show success notification', () => {
    interceptVerifyEmail(200, { message: 'Success' });
    submitForgotPasswordForm(loginEmail);
    verifyNotificationIsDisplayed();
  });

  it('should show error message on failed email verification', () => {
    interceptVerifyEmail(400, { message: 'Error' });
    submitForgotPasswordForm(testExampleEmail);
    verifyNotificationIsDisplayed();
  });

  it('should navigate back to login page on clicking Back button', () => {
    navigateBackToLogin();
    verifyNavigationToLoginPage();
  });

  // Helper functions
  const verifyForgotPasswordFormIsDisplayed = () => {
    cy.get('mat-card-title').contains('Forgot Password');
    cy.get('form').should('be.visible');
  };

  const verifySubmitButtonIsDisabled = () => {
    cy.get('button[type="submit"]').should('be.disabled');
  };

  const verifySubmitButtonIsEnabled = () => {
    cy.get('button[type="submit"]').should('not.be.disabled');
  };

  const fillEmail = (email: string) => {
    cy.get('input[formControlName="email"]').type(email).should('have.value', email);
  };

  const displayEmailValidationErrors = () => {
    // Trigger required validation error
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('mat-error').contains('Email required').should('be.visible');

    // Trigger invalid email validation error
    cy.get('input[formControlName="email"]').type('invalid-email').blur();
    cy.get('mat-error').contains('Invalid email').should('be.visible');
  };

  const interceptVerifyEmail = (statusCode: number, body: object) => {
    cy.intercept('POST', '/api/auth/verify-email', {
      statusCode,
      body,
    }).as('verifyEmail');
  };

  const submitForgotPasswordForm = (email: string) => {
    fillEmail(email);
    cy.get('button[type="submit"]').click();
  };

  const verifyNotificationIsDisplayed = () => {
    cy.get('mat-snack-bar-container').should('be.visible');
  };

  const navigateBackToLogin = () => {
    cy.get('a').contains('Back').click();
  };

  const verifyNavigationToLoginPage = () => {
    cy.url().should('include', '/auth/login'); // Adjust the route as necessary
  };
});

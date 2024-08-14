import { CypressEnum } from '../../enums/cypress.enum';

describe('RegisterTest', () => {
  const registerEmail = CypressEnum.RegisterEmail;
  const password = CypressEnum.Password;
  const firstName = CypressEnum.RegisterFirstName;
  const lastName = CypressEnum.RegisterLastName;
  const country = CypressEnum.Country;
  const birthDate = CypressEnum.BirthDate;

  beforeEach(() => {
    cy.visit('/auth/registration'); // Navigate to the registration page before each test
  });

  it('should display the registration form', () => {
    verifyRegistrationFormIsDisplayed();
  });

  it('should display validation errors for required fields', () => {
    displayRequiredFieldValidationErrors();
  });

  it('should display validation error for mismatched passwords', () => {
    verifyPasswordMismatchError();
  });

  it('should display validation error for future birth date', () => {
    verifyFutureBirthDateError();
  });

  it('should fill out and submit the registration form successfully', () => {
    fillAndSubmitRegistrationForm({
      email: registerEmail,
      firstName,
      lastName,
      country,
      password,
      birthDate,
    });
    verifyRegistrationSuccess();
  });

  // Helper functions
  const verifyRegistrationFormIsDisplayed = () => {
    cy.get('mat-card-title').contains('Register Account');
  };

  const displayRequiredFieldValidationErrors = () => {
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('mat-error').contains('Email required');
    cy.get('input[formControlName="email"]').type('invalid-email').blur();
    cy.get('mat-error').contains('Invalid email').should('be.visible');

    cy.get('input[formControlName="firstName"]').focus().blur();
    cy.get('mat-error').contains('First Name required');

    cy.get('input[formControlName="lastName"]').focus().blur();
    cy.get('mat-error').contains('Last Name required');

    cy.get('input[formControlName="location"]').focus().blur();
    cy.get('mat-error').contains('Country required');

    cy.get('input[formControlName="password"]').focus().blur();
    cy.get('mat-error').contains('Password required');

    cy.get('input[formControlName="confirmPassword"]').focus().blur();
    cy.get('mat-error').contains('Confirm Password required');

    cy.get('input[formControlName="birthAt"]').focus().blur();
    cy.get('mat-error').contains('Birth date required');
  };

  const verifyPasswordMismatchError = () => {
    cy.get('input[formControlName="password"]').type(password);
    cy.get('input[formControlName="confirmPassword"]').type('wrongPassword');
    cy.get('form').submit();
    cy.get('mat-error').contains('Passwords must match');
  };

  const verifyFutureBirthDateError = () => {
    cy.get('input[formControlName="birthAt"]').type('3000-01-01');
    cy.get('form').submit();
    cy.get('mat-error').contains('Birth date cannot be in the future');
  };

  const fillAndSubmitRegistrationForm = ({
                                           email,
                                           firstName,
                                           lastName,
                                           country,
                                           password,
                                           birthDate,
                                         }) => {
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="firstName"]').type(firstName);
    cy.get('input[formControlName="lastName"]').type(lastName);
    cy.get('input[formControlName="location"]').type(country);
    cy.get('mat-option').contains(country).click(); // Select the country from the autocomplete
    cy.get('input[formControlName="password"]').type(password);
    cy.get('input[formControlName="confirmPassword"]').type(password);
    cy.get('input[formControlName="birthAt"]').type(birthDate);

    cy.intercept('POST', Cypress.env('api_server') + '/auth/register').as('registerUser');
    cy.get('form').submit();
    cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
  };

  const verifyRegistrationSuccess = () => {
    cy.url().should('include', '/auth/login'); // Adjust the URL check if necessary
    cy.get('mat-snack-bar-container').should('be.visible');
  };
});

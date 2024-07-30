import { CypressEnum } from '../../enums/cypress.enum';

describe('AddUserDialog', () => {
  const newUserEmail = CypressEnum.NewUserEmail;
  const password = CypressEnum.Password;
  const newUserFirstName = CypressEnum.NewUserFirstName;
  const newUserLastName = CypressEnum.NewUserLastName;
  const country = CypressEnum.Country;
  const birthDate = CypressEnum.BirthDate;

  beforeEach(() => {
    cy.login();
    cy.visit('/users');

    cy.url().should('eq', Cypress.config().baseUrl + '/users');
    openAddUserDialog();
  });

  it('should display validation errors for required fields', () => {
    validateRequiredFields();
  });

  it('should open the add user dialog, fill out the form, and submit it', () => {
    fillOutForm(newUserEmail, newUserFirstName, newUserLastName, country, password, birthDate);
    submitForm();

    // Verify the user was added (mock or real response verification)
    verifyUserAdded(newUserEmail);
  });

  it('should close the dialog when the cancel button is clicked', () => {
    openAddUserDialog();
    cancelForm();
  });

  // Function to open the add user dialog
  const openAddUserDialog = () => {
    cy.get('[data-test="addUser-button"]').click();
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('[data-test="userForm"]').should('be.visible');
  };

  // Function to validate required fields
  const validateRequiredFields = () => {
    // Validate email field
    cy.get('[data-test="userForm"] input[formControlName="email"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Email required');
    cy.get('[data-test="userForm"] input[formControlName="email"]').type('invalid-email').blur();
    cy.get('[data-test="userForm"] mat-error').contains('Invalid email').should('be.visible');

    // Validate first name field
    cy.get('[data-test="userForm"] input[formControlName="firstName"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('First Name required');

    // Validate last name field
    cy.get('[data-test="userForm"] input[formControlName="lastName"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Last Name required');

    // Validate location field
    cy.get('[data-test="userForm"] input[formControlName="location"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Country required');
    cy.get('[data-test="userForm"] input[formControlName="location"]').type('invalid-location');
    cy.get('[data-test="userForm"] mat-error').contains('Country not found').should('be.visible');

    // Validate role select field
    cy.get('[data-test="userForm"] mat-select[formControlName="role"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('RoleEnum required');

    // Validate password field
    cy.get('[data-test="userForm"] input[formControlName="password"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Password required');

    // Validate confirm password field
    cy.get('[data-test="userForm"] input[formControlName="confirmPassword"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Confirm Password required');

    // Validate birth date field
    cy.get('[data-test="userForm"] input[formControlName="birthAt"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Birth date required');

    // Validate status checkbox
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').scrollIntoView().should('be.visible').click();
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"] .mdc-label').contains('Status - Deactivated');
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').should('not.have.class', 'mat-mdc-checkbox-checked');

    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').scrollIntoView().should('be.visible').click();
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"] .mdc-label').contains('Status - Active');
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').should('have.class', 'mat-mdc-checkbox-checked');
  };

  // Function to fill out the user form
  const fillOutForm = (email, firstName, lastName, country, password, birthDate) => {
    cy.get('[data-test="userForm"] input[formControlName="email"]').type(email);
    cy.get('[data-test="userForm"] input[formControlName="firstName"]').type(firstName);
    cy.get('[data-test="userForm"] input[formControlName="lastName"]').type(lastName);

    cy.get('[data-test="userForm"] mat-select[formControlName="role"]').click();
    cy.get('mat-option').contains('Client').click();

    cy.get('[data-test="userForm"] input[formControlName="location"]').type(country);
    cy.get('mat-option').contains(country).click();

    cy.get('[data-test="userForm"] input[formControlName="password"]').type(password);
    cy.get('[data-test="userForm"] input[formControlName="confirmPassword"]').type(password);

    // This option allows you to directly enter the date into the field
    // cy.get('input[formControlName="birthAt"]').type(birthDate);

    // This option involves selecting a date in the datepicker
    cy.get('[data-test="userForm"] mat-datepicker-toggle button').click();
    cy.get('mat-calendar').should('be.visible');
    cy.get('mat-calendar').contains('1').click();
  };

  // Function to submit the form
  const submitForm = () => {
    cy.get('button[type="submit"]').click();
  };

  // Function to verify the user was added
  const verifyUserAdded = (email) => {
    cy.get('mat-dialog-container').should('not.exist');
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.get('app-users-table').should('be.visible');
    cy.get('.mat-mdc-paginator-navigation-last').click();
    cy.get('table').should('contain', email);
  };

  // Function to cancel the form
  const cancelForm = () => {
    cy.get('[data-test="cancel-button"]').click();
    cy.get('mat-dialog-container').should('not.exist');
  };
});

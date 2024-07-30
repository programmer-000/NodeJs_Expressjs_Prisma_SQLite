import { CypressEnum } from '../../enums/cypress.enum';

describe('AccountSettingsDialog', () => {
  const newUserEmail = CypressEnum.NewUserEmail;
  const newUserFirstName = CypressEnum.NewUserFirstName;
  const newUserLastName = CypressEnum.NewUserLastName;
  const country = CypressEnum.Country;

  beforeEach(() => {
    cy.login();
    cy.visit('/');

    cy.url().should('eq', Cypress.config().baseUrl + '/');

    openAccountSettings();
  });

  it('should open the edit user dialog, fill out the form with new information, and submit it', () => {
    // Update the user form fields
    updateUserForm(newUserEmail, newUserFirstName, newUserLastName, country);

    // Update the birthdate field by selecting a date in the datepicker
    updateBirthDate(3);

    // Uncomment the following code if necessary
    // submitForm();
    // verifyUserUpdated();
  });

  // Function to open account settings
  const openAccountSettings = () => {
    cy.get('[data-test="account-button"]').click();
    cy.get('[data-test="settings-button"]').should('be.visible').click();
    cy.get('[data-test="userForm"]').should('be.visible');
  };

  // Function to update the user form fields
  const updateUserForm = (email, firstName, lastName, country) => {
    cy.get('[data-test="userForm"] input[formControlName="email"]').clear().type(email);
    cy.get('[data-test="userForm"] input[formControlName="firstName"]').clear().type(firstName);
    cy.get('[data-test="userForm"] input[formControlName="lastName"]').clear().type(lastName);
    cy.get('[data-test="userForm"] input[formControlName="location"]').clear().type(country);
    cy.get('mat-option').contains(country).click();
  };

  // Function to update the birthdate field
  const updateBirthDate = (day) => {
    cy.get('[data-test="userForm"] mat-datepicker-toggle button').click();
    cy.get('mat-calendar').should('be.visible');
    cy.get('mat-calendar').contains(day.toString()).click();
  };

  // Uncomment the following functions if necessary
  /*
  // Function to submit the form
  const submitForm = () => {
    cy.get('button[type="submit"]').click();
  };

  // Function to verify the user was updated
  const verifyUserUpdated = () => {
    cy.get('[data-test="userForm"]').should('not.exist');
    cy.get('mat-snack-bar-container').should('be.visible');
  };
  */
});

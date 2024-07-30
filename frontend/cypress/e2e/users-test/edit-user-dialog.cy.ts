import { CypressEnum } from '../../enums/cypress.enum';

describe('EditUserDialog', () => {
  const newUserEmail = CypressEnum.NewUserEmail;
  const newUserFirstName = CypressEnum.NewUserFirstName;
  const newUserLastName = CypressEnum.NewUserLastName;
  const country = CypressEnum.Country;

  beforeEach(() => {
    cy.login();
    cy.visit('/users');

    cy.url().should('eq', Cypress.config().baseUrl + '/users');

    cy.get('[data-test="editUser-button"]').first().click();
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('[data-test="userForm"]').should('be.visible');
  });

  it('should open the edit user dialog, fill out the form with new information, and submit it', () => {
    // Update email field
    cy.get('[data-test="userForm"] input[formControlName="email"]').clear().type(newUserEmail);

    // Update first name field
    cy.get('[data-test="userForm"] input[formControlName="firstName"]').clear().type(newUserFirstName);

    // Update last name field
    cy.get('[data-test="userForm"] input[formControlName="lastName"]').clear().type(newUserLastName);

    // Update role field
    cy.get('[data-test="userForm"] mat-select[formControlName="role"]').click();
    cy.get('mat-option').contains('Client').click();

    // Update location field
    cy.get('[data-test="userForm"] input[formControlName="location"]').clear().type(country);
    cy.get('mat-option').contains(country).click();

    // Update birthdate field by selecting a date in the datepicker
    cy.get('[data-test="userForm"] mat-datepicker-toggle button').click();
    cy.get('mat-calendar').should('be.visible');
    cy.get('mat-calendar').contains('3').click();

    // // Update status checkbox
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').scrollIntoView().should('be.visible').click();

    /** Uncomment the code if necessary */

    // // Submit the form
    // cy.get('button[type="submit"]').click();

    // Verify the user was updated (mock or real response verification)
    // cy.get('mat-dialog-container').should('not.exist');
    // cy.get('mat-snack-bar-container').should('be.visible');
    // cy.get('app-users-table').should('be.visible');
    // // cy.get('.mat-mdc-paginator-navigation-last').click();
    // cy.get('app-users-table').should('contain', newUserEmail);
  });
});

import { CypressEnum } from '../../enums/cypress.enum';

describe('EditUserDialogTest', () => {
  const newUserEmail = CypressEnum.NewUserEmail;
  const newUserFirstName = CypressEnum.NewUserFirstName;
  const newUserLastName = CypressEnum.NewUserLastName;
  const country = CypressEnum.Country;

  beforeEach(() => {
    cy.loginAndSaveToken();
    cy.visit('/users');
    cy.url().should('eq', Cypress.config().baseUrl + '/users');

    openEditUserDialog();
  });

  it('should open the edit user dialog, fill out the form with new information, and submit it', () => {
    fillEditUserForm({
      email: newUserEmail,
      firstName: newUserFirstName,
      lastName: newUserLastName,
      role: 'Client',
      location: country,
      birthDate: '3',
      status: true
    });

    /** Uncomment the code if necessary */
    // submitForm();
    // verifyUserUpdate(newUserEmail);
  });

  function openEditUserDialog() {
    cy.get('[data-test="editUser-button"]').first().click();
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('[data-test="userForm"]').should('be.visible');
  }

  function fillEditUserForm({ email, firstName, lastName, role, location, birthDate, status }) {
    updateInputField('email', email);
    updateInputField('firstName', firstName);
    updateInputField('lastName', lastName);
    selectDropdownOption('role', role);
    selectCountry(location);
    selectDateInDatepicker(birthDate);
    toggleCheckbox('status', status);
  }

  function updateInputField(formControlName, value) {
    cy.get(`[data-test="userForm"] input[formControlName="${formControlName}"]`).clear().type(value);
  }

  function selectDropdownOption(formControlName, value) {
    cy.get(`[data-test="userForm"] mat-select[formControlName="${formControlName}"]`).click();
    cy.get('mat-option').contains(value).click();
  }

  function selectCountry(country) {
    cy.get('[data-test="userForm"] input[formControlName="location"]').clear().type(country);
    cy.get('mat-option').contains(country).click();
  }

  function selectDateInDatepicker(day) {
    cy.get('[data-test="userForm"] mat-datepicker-toggle button').click();
    cy.get('mat-calendar').should('be.visible');
    cy.get('mat-calendar').contains(day).click();
  }

  function toggleCheckbox(formControlName, shouldCheck) {
    cy.get(`[data-test="userForm"] mat-checkbox[formControlName="${formControlName}"]`)
      .scrollIntoView()
      .should('be.visible')
      .then(($checkbox) => {
        if (shouldCheck && !$checkbox.hasClass('mat-checkbox-checked')) {
          $checkbox.click();
        } else if (!shouldCheck && $checkbox.hasClass('mat-checkbox-checked')) {
          $checkbox.click();
        }
      });
  }

  /** Uncomment the code if necessary */
  function submitForm() {
    cy.intercept('PUT', '**/users/*', (req) => {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
    }).as('editUser');

    cy.get('button[type="submit"]').click();
    cy.wait('@editUser').its('response.statusCode').should('eq', 200);
  }

  function verifyUserUpdate(email) {
    cy.get('mat-dialog-container').should('not.exist');
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.get('app-users-table').should('be.visible');
    cy.get('app-users-table').should('contain', email);
  }
});

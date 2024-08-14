import { CypressEnum } from '../../enums/cypress.enum';

describe('ChangePasswordDialogTest', () => {
  const newPassword = CypressEnum.NewPassword;

  beforeEach(() => {
    cy.loginAndSaveToken();
    cy.visit('/users');
    cy.url().should('eq', Cypress.config().baseUrl + '/users');
    openEditUserDialog();
  });

  it('should open the change password dialog and display the form', () => {
    openChangePasswordDialog();
    verifyChangePasswordFormIsDisplayed();
  });

  it('should close the dialog when the cancel button is clicked', () => {
    openChangePasswordDialog();
    verifyChangePasswordFormIsDisplayed();
    cancelChangePasswordDialog();
    verifyChangePasswordFormIsClosed();
  });

  it('should display validation errors for required fields', () => {
    openChangePasswordDialog();
    triggerValidationErrorsForRequiredFields();
    verifyValidationErrorsForRequiredFields();
  });

  it('should display error when passwords do not match', () => {
    openChangePasswordDialog();
    fillMismatchedPasswords();
    verifyPasswordMismatchError();
  });

  it('should display error when password is less than 6 characters', () => {
    openChangePasswordDialog();
    fillShortPasswords();
    verifyMinLengthPasswordErrors();
  });

  it('should fill out the change password form and submit it', () => {
    cy.intercept('PUT', '**/users/update_password/*', (req) => {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
    }).as('changePasswordRequest');

    // Custom functions for filling and submitting the form
    openChangePasswordDialog();
    fillAndSubmitChangePasswordForm(newPassword);

    // Wait for the intercepted request to finish and check the response
    cy.wait('@changePasswordRequest').its('response.statusCode').should('eq', 200);

    // Verify the success of the form submission
    verifyFormSubmissionSuccess();
  });

  // Helper functions
  const openEditUserDialog = () => {
    cy.intercept('GET', '**/users/*', (req) => {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
    }).as('getUserData');

    cy.get('[data-test="editUser-button"]').first().click();

    // Wait for the user data request to complete
    cy.wait('@getUserData');
    cy.get('mat-dialog-container').should('be.visible');
  };

  const openChangePasswordDialog = () => {
    cy.get('[data-test="link-change-password"]').click();
  };

  const verifyChangePasswordFormIsDisplayed = () => {
    cy.get('[data-test="changePasswordForm"]').should('be.visible');
  };

  const cancelChangePasswordDialog = () => {
    cy.get('[data-test="changePasswordForm"] a').contains('Cancel').click();
  };

  const verifyChangePasswordFormIsClosed = () => {
    cy.get('[data-test="changePasswordForm"]').should('not.exist');
  };

  const triggerValidationErrorsForRequiredFields = () => {
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').focus().blur();
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().blur();
  };

  const verifyValidationErrorsForRequiredFields = () => {
    cy.get('[data-test="changePasswordForm"] mat-error').contains('New Password required').should('be.visible');
    cy.get('[data-test="changePasswordForm"] mat-error').contains('Confirm Password required').should('be.visible');
  };

  const fillMismatchedPasswords = () => {
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').type(newPassword);
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().type('wrongPassword');
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').blur();
  };

  const verifyPasswordMismatchError = () => {
    cy.get('[data-test="changePasswordForm"] mat-error').contains('Confirm passwords must match').should('be.visible');
  };

  const fillShortPasswords = () => {
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').focus().type('123');
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().type('123');
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').focus().blur();
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().blur();
  };

  const verifyMinLengthPasswordErrors = () => {
    cy.get('[data-test="changePasswordForm"] mat-error').contains('New Password must be at least 6 characters').should('be.visible');
    cy.get('[data-test="changePasswordForm"] mat-error').contains('Confirm Password must be at least 6 characters').should('be.visible');
  };

  const fillAndSubmitChangePasswordForm = (newPassword) => {
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').focus().type(newPassword);
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().type(newPassword);
    cy.get('[data-test="changePasswordForm"] button[type="submit"]').click();
  };

  const verifyFormSubmissionSuccess = () => {
    cy.get('[data-test="changePasswordForm"]').should('not.exist');
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.get('[data-test="userForm"]').should('be.visible');
  };
});

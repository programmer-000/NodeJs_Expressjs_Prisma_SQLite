import { CypressEnum } from '../../enums/cypress.enum';

describe('ManagePostCategoriesTest', () => {
  const newCategory = CypressEnum.NewCategory;
  const updatedCategory = CypressEnum.UpdatedCategory;

  beforeEach(() => {
    cy.loginAndSaveToken();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  });

  it('should display the manage categories button', () => {
    cy.get('[data-test="manage-categories-button"]').should('be.visible');
  });

  it('should add a new category', () => {
    openManageCategoriesDialog();
    addNewCategory(newCategory);
    verifyCategoryExists(newCategory);
  });

  it('should edit an existing category', () => {
    openManageCategoriesDialog();
    verifyCategoryExists(newCategory);
    editCategory(newCategory, updatedCategory);
    verifyCategoryExists(updatedCategory);
  });

  it('should delete a category', () => {
    openManageCategoriesDialog();
    verifyCategoryExists(updatedCategory);
    deleteCategory(updatedCategory);
    verifyCategoryNotExists(updatedCategory);
  });

  // Open the Manage Categories dialog
  const openManageCategoriesDialog = () => {
    cy.get('[data-test="manage-categories-button"]').click();
    cy.get('mat-dialog-container').should('be.visible');
  };

  // Add a new category
  const addNewCategory = (categoryName: string) => {
    cy.get('[data-test="add-category-button"]').click();
    cy.get('[data-test="input-category"]').type(categoryName, {force: true});
    cy.wait(300);
    cy.get('[data-test="submit-category-button"]').should('not.be.disabled').click();
    cy.get('mat-snack-bar-container').should('be.visible');
  };

  // Edit an existing category
  const editCategory = (oldCategoryName: string, newCategoryName: string) => {
    cy.get('[data-test="category-title"]').contains(oldCategoryName).parents('.categories')
      .find('[data-test="edit-category-button"]').click();
    cy.get('[data-test="input-category"]').clear().type(newCategoryName, { force: true });
    cy.wait(300);
    cy.get('[data-test="submit-category-button"]').should('not.be.disabled').click();
    cy.get('mat-snack-bar-container').should('be.visible');
  };

  // Delete a category
  const deleteCategory = (categoryName: string) => {
    cy.get('[data-test="category-title"]').contains(categoryName).parents('.categories')
      .find('[data-test="delete-category-button"]').click();
    cy.get('[data-test="confirm-ok-button"]').click();
    cy.get('mat-snack-bar-container').should('be.visible');
  };

  // Verify category exists
  const verifyCategoryExists = (categoryName: string) => {
    cy.get('[data-test="category-title"]').should('contain.text', categoryName);
  };

  // Verify category does not exist
  const verifyCategoryNotExists = (categoryName: string) => {
    cy.get('[data-test="category-title"]').should('not.contain.text', categoryName);
  };
});

import { DataPost } from '../../constants/data-post';

describe('EditPostDialogTest', () => {
  const { title, description, content } = DataPost;
  const postUrl = `${Cypress.config().baseUrl}/posts/1`;
  let selectedCategories = '';

  beforeEach(() => {
    cy.loginAndSaveToken();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  });

  it('should display the page of one post', () => {
    cy.visit(postUrl);
    cy.url().should('eq', postUrl);
    cy.get('mat-card-header').should('be.visible');
    cy.get('[data-test="edit-button"]').should('be.visible');
  });

  it('should edit the post', () => {
    openEditDialog();
    fillPostDetails(title, description, content);
    toggleCategoryOption();
    togglePublishedCheckbox();
    updatePost();
    verifySuccessMessage();
    verifyPostDetails(title, description, content);
  });

  // Open the Edit Post dialog
  const openEditDialog = () => {
    cy.visit(postUrl);
    cy.url().should('eq', postUrl);

    const token = window.localStorage.getItem('accessToken');
    cy.intercept('GET', '**/posts/*', (req) => {
      req.headers['Authorization'] = `Bearer ${token}`;
      req.continue();
    }).as('getPost');
    cy.get('[data-test="edit-button"]').should('be.visible').click();
    cy.get('mat-dialog-container').should('be.visible');
    cy.wait('@getPost');
  };

  // Fill in the post details
  const fillPostDetails = (title, description, content) => {
    cy.get('[data-test="post-title-input"]').clear().type(`${title} Updated`);
    cy.get('[data-test="post-description-input"]').clear().type(`${description} Updated`);
    cy.get('[data-test="post-content-input"]').clear().type(`${content} Updated`);
  };

  // Toggle the first category option
  const toggleCategoryOption = () => {
    cy.get('[data-test="categories-field"]').click();
    cy.get('mat-option[data-test="categories-title-option"]').first().then(option => {
      const isSelected = option.attr('aria-selected') === 'true';
      cy.wrap(option).click().should('have.attr', 'aria-selected', isSelected ? 'false' : 'true');
      selectedCategories = option.text().trim();
      cy.get('mat-option[data-test="categories-title-option"]').should('contain.text', selectedCategories);
    });
    cy.get('body').type('{esc}');
    cy.wait(100);
  };

  // Toggle the published checkbox
  const togglePublishedCheckbox = () => {
    cy.get('[data-test="postForm"] mat-checkbox[formControlName="published"]').scrollIntoView().should('be.visible')
      .find('input')
      .then($checkbox => {
        if ($checkbox.is(':checked')) {
          cy.get('[data-test="postForm"] mat-checkbox[formControlName="published"]').click();
        } else {
          cy.get('[data-test="postForm"] mat-checkbox[formControlName="published"]').click();
        }
      });
  };

  // Save the post
  const updatePost = () => {
    cy.intercept('PUT', '**/posts/*', (req) => {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      req.continue();
    }).as('updatePost');

    cy.get('[data-test="save-post-button"]').click();
    cy.wait('@updatePost').its('response.statusCode').should('eq', 201);
  };

  // Verify the success message
  const verifySuccessMessage = () => {
    cy.get('mat-snack-bar-container').should('be.visible');
  };

  // Verify the post details
  const verifyPostDetails = (title, description, content) => {
    cy.get('[data-test="post-title"]').should('contain.text', `${title} Updated`);
    cy.get('[data-test="post-description"]').should('contain.text', `${description} Updated`);
    cy.get('[data-test="post-text"]').should('contain.text', `${content} Updated`);
  };
});

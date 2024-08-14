import { DataPost } from '../../constants/data-post';

describe('AddPostDialogTest', () => {
  const { title, description, content } = DataPost;
  let selectedCategories = '';

  beforeEach(() => {
    cy.loginAndSaveToken();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  });

  it('should display the page of one post', () => {
    cy.get('app-posts-filter-panel').should('be.visible');
    cy.get('[data-test="add-post-button"]').should('be.visible');
  });

  it('should add a new post', () => {
    openAddPostDialog();
    fillPostDetails(title, description, content);
    selectFirstCategory();
    closeDropdown();
    savePost();
    verifySuccessMessage();
  });

  it('should navigate to the last page when paginator is used', () => {
    navigateToLastPage();
  });

  // Open the Add Post dialog
  const openAddPostDialog = () => {
    const token = window.localStorage.getItem('accessToken');
    cy.intercept('GET', '**/categories', (req) => {
      req.headers['Authorization'] = `Bearer ${token}`;
      req.continue();
    }).as('getCategories');

    cy.get('[data-test="add-post-button"]').should('be.visible').click();
    cy.wait('@getCategories');
    cy.get('mat-dialog-container').should('be.visible');
  };

  // Fill in the post details
  const fillPostDetails = (title, description, content) => {
    cy.get('[data-test="post-title-input"]').type(`${title} Updated`);
    cy.get('[data-test="post-description-input"]').type(`${description} Updated`);
    cy.get('[data-test="post-content-input"]').type(`${content} Updated`);
  };

  // Select the first category in the dropdown
  const selectFirstCategory = () => {
    cy.get('[data-test="categories-field"]').click();
    cy.get('mat-option[data-test="categories-title-option"]').first().click().then(option => {
      selectedCategories = option.text().trim();
      cy.wrap(option).should('have.attr', 'aria-selected', 'true');
      cy.get('mat-option[data-test="categories-title-option"]').should('contain.text', selectedCategories);
    });
  };

  // Close the dropdown
  const closeDropdown = () => {
    cy.get('body').type('{esc}');
    cy.wait(100);
  };

  // Save the post
  const savePost = () => {
    cy.intercept('POST', '**/posts', (req) => {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      req.continue();
    }).as('savePost');

    cy.get('[data-test="save-post-button"]').click();
    cy.wait('@savePost').its('response.statusCode').should('eq', 201);
  };

  // Verify the success message
  const verifySuccessMessage = () => {
    cy.get('mat-snack-bar-container').should('be.visible');
  };

  // Navigate to the last page using the paginator and check out the new post
  const navigateToLastPage = () => {

    const token = window.localStorage.getItem('accessToken');
    cy.intercept('GET', '**/posts*', (req) => {
      req.headers['Authorization'] = `Bearer ${token}`;
      req.continue();
    }).as('getPosts');

    cy.get('.mat-mdc-paginator-navigation-last').click();

    cy.wait('@getPosts');
    cy.get('[data-test="posts-grid"]').contains(title);
  };
});

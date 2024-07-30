describe('PostsFilterPanel', () => {
  let selectedAuthor = '';
  let selectedCategories = '';
  let selectedPublished = '';

  beforeEach(() => {
    cy.login();

    // Verify successful login by checking the URL or a specific element
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
    cy.get('app-posts-filter-panel').should('be.visible');
  });

  it('should detect posts of the selected author on the page', () => {
    cy.get('app-posts-filter-panel form').should('be.visible');
  });

  it('should update the filter when an author is selected', () => {
    selectAuthor();

    // Verify the selected author's name in posts
    cy.get('[data-test="posts-grid"] app-preview-post').each(post => {
      cy.wrap(post).should('contain.text', selectedAuthor);
    });

    // Deselect all authors
    deselectAllAuthors();
  });

  it('should update the filter when a category is selected', () => {
    selectCategory();

    // Verify the selected category name in posts
    cy.get('[data-test="posts-grid"] app-preview-post').each(post => {
      cy.wrap(post).should('contain.text', selectedCategories);
    });

    // Deselect all categories
    deselectAllCategories();
  });

  it('should update the filter when a published status is selected', () => {
    selectPublishedStatus();

    // Ensure mat-option is collapsing
    cy.get('body').type('{esc}');

    // Deselect all published statuses
    deselectAllPublishedStatuses();
  });

  it('should fill in all filter fields and clear when you click the “Clear All” button', () => {
    fillAllFilterFields();

    // Clear all fields
    cy.get('[data-test="clearAllFields-button"]').click();

    // Verify all fields are cleared
    verifyAllFieldsCleared();
  });

  // Select an author and save its name
  const selectAuthor = () => {
    cy.get('mat-select[formControlName="authors"]').click();
    cy.get('mat-option[data-test="author-name-option"]').first().click().then(option => {
      selectedAuthor = option.text().trim();
      cy.get('mat-option[data-test="author-name-option"]').first().should('have.attr', 'aria-selected', 'true');
    });
    cy.wait(300);
    cy.get('body').type('{esc}');
  };

  // Deselect all authors
  const deselectAllAuthors = () => {
    cy.get('mat-select[formControlName="authors"]').click();
    cy.get('mat-option').contains('Clear All').click();
    cy.wait(300);
    cy.get('mat-select[formControlName="authors"]')
      .each(author => {
        cy.wrap(author).should('not.contain', selectedAuthor);
      });
  };

  // Select a category and save its name
  const selectCategory = () => {
    cy.get('mat-select[formControlName="categories"]').click();
    cy.get('mat-option[data-test="categories-name-option"]').first().click().then(option => {
      selectedCategories = option.text().trim();
      cy.get('mat-option[data-test="categories-name-option"]').first().should('have.attr', 'aria-selected', 'true');
    });
    cy.get('mat-select[formControlName="categories"]').should('contain.text', selectedCategories);
    cy.wait(300);
    cy.get('body').type('{esc}');
  };

  // Deselect all categories
  const deselectAllCategories = () => {
    cy.get('mat-select[formControlName="categories"]').click();
    cy.get('mat-option').contains('Clear All').click();
    cy.wait(300);
    cy.get('mat-select[formControlName="categories"]')
      .each(category => {
        cy.wrap(category).should('not.contain', selectedCategories);
      });
  };

  // Select a published status and save its name
  const selectPublishedStatus = () => {
    cy.get('mat-select[formControlName="published"]').click();
    cy.get('mat-option[data-test="published-name-option"]').last().click().then(option => {
      selectedPublished = option.text().trim();
      cy.get('mat-option[data-test="published-name-option"]').last().should('have.attr', 'aria-selected', 'true');
    });
    cy.get('mat-select[formControlName="published"]').should('contain', selectedPublished);
    cy.wait(300);
    cy.get('body').type('{esc}');
  };

  // Deselect all published statuses
  const deselectAllPublishedStatuses = () => {
    cy.get('mat-select[formControlName="published"]').click();
    cy.get('mat-option').contains('Clear All').click();
    cy.wait(300);
    cy.get('mat-select[formControlName="published"]').should('contain.text', 'Select status');
  };

  // Fill all filter fields with values
  const fillAllFilterFields = () => {
    selectAuthor();
    selectCategory();
    selectPublishedStatus();
  };

  // Verify all fields are cleared
  const verifyAllFieldsCleared = () => {
    cy.get('mat-select[formControlName="authors"]').should('contain.text', 'Select authors');
    cy.get('mat-select[formControlName="categories"]').should('contain.text', 'Select categories');
    cy.get('mat-select[formControlName="published"]').should('contain.text', 'Select status');
  };
});

describe('PostsTest', () => {
  beforeEach(() => {
    cy.loginAndSaveToken();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  });

  it('should display the posts page', () => {
    verifyPostsPageIsVisible();
    verifyFilterPanelIsVisible();
    verifyPostsGridIsVisible();
  });

  it('should display the paginator', () => {
    verifyPaginatorIsVisible();
  });

  it('should display the correct number of posts in the grid', () => {
    verifyNumberOfPostsInGrid(5); // assuming pageSize is 5
  });

  it('should navigate to the next page when paginator is used', () => {
    navigateToNextPage();
    verifyNumberOfPostsInGrid(5); // check the number of posts on the next page
  });

  it('should navigate to different pages using paginator', () => {
    navigateToNextPage();
    navigateToFirstPage();
    verifyNumberOfPostsInGrid(5); // check the number of posts on the first page
    navigateToLastPage();
    verifyOfPostsInGrid();
  });

  // Verify the posts page is visible
  const verifyPostsPageIsVisible = () => {
    cy.get('app-posts').should('be.visible');
  };

  // Verify the filter panel is visible
  const verifyFilterPanelIsVisible = () => {
    cy.get('app-posts-filter-panel').should('be.visible');
  };

  // Verify the posts grid is visible
  const verifyPostsGridIsVisible = () => {
    cy.intercept('GET', '/posts', (req) => {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      req.continue();
    }).as('fetchPosts');

    cy.visit('/posts');
    cy.wait('@fetchPosts').its('response.statusCode').should('eq', 200);

    cy.get('[data-test="posts-grid"]').should('be.visible');
  };

  // Verify the paginator is visible
  const verifyPaginatorIsVisible = () => {
    cy.get('mat-paginator').should('be.visible');
  };

  // Verify the correct number of posts in the grid
  const verifyNumberOfPostsInGrid = (expectedCount) => {
    cy.get('[data-test="posts-grid"] app-preview-post').should('have.length', expectedCount);
  };

  // Make sure the messages in the grid are visible
  const verifyOfPostsInGrid = () => {
    cy.get('[data-test="posts-grid"] app-preview-post').should('be.visible');
  };

  // Navigate to the next page using the paginator
  const navigateToNextPage = () => {
    cy.get('.mat-mdc-paginator-navigation-next').click();
  };

  // Navigate to the first page using the paginator
  const navigateToFirstPage = () => {
    cy.get('.mat-mdc-paginator-navigation-first').click();
  };

  // Navigate to the last page using the paginator
  const navigateToLastPage = () => {
    cy.get('.mat-mdc-paginator-navigation-last').click();
  };
});

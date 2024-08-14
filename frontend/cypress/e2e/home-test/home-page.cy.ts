describe('HomeTest', () => {
  beforeEach(() => {
    cy.loginAndSaveToken();
  });

  it('should display post and user statistics components', () => {
    cy.intercept('GET', '**/dashboard', (req) => {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      req.continue();
    }).as('fetchStatistics');

    cy.visit('/');

    cy.wait('@fetchStatistics');

    cy.get('app-post-statistics').should('be.visible');
    cy.get('app-user-statistics').should('be.visible');
  });
});

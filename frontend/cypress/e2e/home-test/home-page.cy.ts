describe('HomeComponent', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.url().should('include', '/');
  });

  it('should display post and user statistics components', () => {
    cy.intercept('GET', '**/dashboard', { delay: 500 }).as('fetchStatistics');
    cy.visit('/');

    cy.wait('@fetchStatistics');
    cy.get('app-post-statistics').should('be.visible');
    cy.get('app-user-statistics').should('be.visible');
  });
});

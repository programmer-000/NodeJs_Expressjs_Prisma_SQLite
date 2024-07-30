describe('PostStatisticsComponent', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should display loading spinner while fetching data', () => {
    cy.intercept('GET', '**/dashboard', { delay: 500 }).as('fetchStatistics');
    cy.visit('/')
    cy.wait('@fetchStatistics');
    cy.get('app-post-statistics').should('be.visible');
  });

  it('should display post statistics', () => {
    cy.intercept('GET', '**/dashboard', { fixture: 'postStatistics.json' }).as('fetchPostStatistics');
    cy.visit('/');
    cy.wait('@fetchPostStatistics');
    cy.get('[data-test="post-statistics-title"]').should('be.visible');
    cy.get('[data-test="post-statistics-status"]').should('be.visible');
    cy.get('[data-test="post-statistics-chart"]').should('have.length', 3);
  });
});

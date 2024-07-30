describe('UserStatisticsComponent', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should display loading spinner while fetching data', () => {
    cy.intercept('GET', '**/dashboard', { delay: 500 }).as('fetchStatistics');
    cy.visit('/')
    cy.wait('@fetchStatistics');
    cy.get('app-user-statistics').should('be.visible');
  });

  it('should display user statistics', () => {
    cy.intercept('GET', '**/dashboard', { fixture: 'userStatistics.json' }).as('fetchUserStatistics');
    cy.visit('/');
    cy.wait('@fetchUserStatistics');
    cy.get('[data-test="users-statistics-title"]').should('be.visible');
    cy.get('[data-test="users-statistics-status"]').should('be.visible');
    cy.get('[data-test="users-statistics-chart"]').should('have.length', 3);
  });
});

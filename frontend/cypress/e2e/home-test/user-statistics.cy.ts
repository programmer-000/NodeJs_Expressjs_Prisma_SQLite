describe('UserStatisticsTest', () => {
  beforeEach(() => {
    cy.loginAndSaveToken();
    cy.visit('/');
  });

  it('should display app-user-statistics', () => {
    const token = window.localStorage.getItem('accessToken');
    cy.intercept('GET', '**/dashboard', (req) => {
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      req.continue();
    }).as('fetchStatistics');

    cy.visit('/');
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

import { CypressEnum } from '../enums/cypress.enum';

describe('HomeComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;

  beforeEach(() => {
    cy.visit('/auth/login'); // Adjust the URL as needed
  });

  // Test to simulate a successful login attempt and navigation to the home page
  it('should log in the user and navigate to the home page on successful login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    });

    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Check URL change to ensure navigation to the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Optionally, check for some element on the home page to confirm navigation
    cy.get('app-post-statistics').should('be.visible');
  });

  // Navigate to the home page before each test
  // beforeEach(() => {
  //   cy.visit('/'); // Adjust the route as necessary
  // });

  // Test to ensure the home component is displayed
  // it('should display the home component', () => {
  //   cy.url().should('eq', Cypress.config().baseUrl + '/');
  //   cy.get('app-home').should('be.visible');
  // });
  //
  // // Test to ensure the post statistics component is visible
  // it('should display the post statistics component', () => {
  //   cy.get('app-post-statistics').should('be.visible');
  // });
  //
  // // Test to ensure the user statistics component is visible
  // it('should display the user statistics component', () => {
  //   cy.get('app-user-statistics').should('be.visible');
  // });
  //
  // // Test to ensure the loading spinner is displayed while data is loading
  // it('should display a loading spinner while data is loading', () => {
  //   cy.intercept('GET', '/api/statistics', (req) => {
  //     // Simulate a delay in response
  //     req.on('response', (res) => {
  //       res.setDelay(2000);
  //     });
  //   }).as('getStatistics');
  //
  //   // Refresh the page to trigger data loading
  //   cy.visit('/home');
  //
  //   // Check that the loading spinner is visible
  //   cy.get('mat-progress-spinner.home-spinner').should('be.visible');
  //
  //   // Wait for the API call to complete
  //   // cy.wait('@getStatistics');
  //
  //   // Check that the loading spinner is no longer visible
  //   cy.get('mat-progress-spinner.home-spinner').should('not.exist');
  // });
  //
  // // Test to ensure the correct data is loaded
  // it('should load the correct data for the statistics components', () => {
  //   cy.intercept('GET', '/api/statistics', {
  //     statusCode: 200,
  //     body: { /* mock statistics data */ },
  //   }).as('getStatistics');
  //
  //   // Refresh the page to trigger data loading
  //   cy.visit('/home');
  //
  //   // Wait for the API call to complete
  //   // cy.wait('@getStatistics');
  //
  //   // Check that the statistics components are displaying the correct data
  //   cy.get('app-post-statistics').contains('Expected Post Statistics Data');
  //   cy.get('app-user-statistics').contains('Expected User Statistics Data');
  // });


});

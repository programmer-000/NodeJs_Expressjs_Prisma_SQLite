import { CypressEnum } from '../../enums/cypress.enum';

describe('UsersTableTest', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;
  let accessToken: string;

  beforeEach(() => {
    loginAndVisitUsers();
    const token = window.localStorage.getItem('accessToken');
    cy.intercept('GET', '**/users*', (req) => {
      req.headers['Authorization'] = `Bearer ${token}`;
      req.continue();
    }).as('getUsers');
  });

  it('should display a page with a table of users', () => {
    verifyUsersPageIsDisplayed();
  });

  it('should display the users-table', () => {
    cy.get('app-users-table').should('be.visible');
  });

  it('should display the paginator', () => {
    cy.get('mat-paginator').should('be.visible');
  });

  it('should display all columns in the table', () => {
    verifyAllColumnsVisible();
  });

  it('should open add user dialog on clicking add button', () => {
    openDialog('addUser-button');
  });

  it('should open edit user dialog on clicking edit button', () => {
    openDialog('editUser-button');
  });

  it('should open delete confirmation dialog on clicking delete button', () => {
    openDialog('deleteUser-button');
  });

  it('should allow sorting by ID', () => {
    verifyColumnSorting('id-column', 'id');
  });

  it('should allow sorting by Role', () => {
    verifyColumnSorting('role-column', 'role');
  });

  it('should allow sorting by Email', () => {
    verifyColumnSorting('email-column', 'email');
  });

  it('should display correct number of rows based on page size', () => {
    verifyRowNumberBasedOnPageSize(15);
    verifyRowNumberBasedOnPageSize(25);
  });

  it('should navigate to the next and previous pages and display correct data', () => {
    verifyPageNavigation();
  });

  // Helper functions
  const loginAndVisitUsers = () => {
    cy.visit('/auth/login');

    cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
      req.on('response', (res) => {
        accessToken = res.body.accessToken;
      });
    }).as('login');

    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    // cy.wait('@getUsers').its('response.statusCode').should('eq', 200);
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.visit('/users');
  };

  const verifyUsersPageIsDisplayed = () => {
    cy.get('app-users-filter-panel').should('be.visible');
  };

  const verifyAllColumnsVisible = () => {
    const columns = [
      'id-column',
      'avatar-column',
      'role-column',
      'email-column',
      'firstName-column',
      'lastName-column',
      'createdAt-column',
      'status-column',
      'posts-column',
      'location-column',
      'birthAt-column',
      'actions-column'
    ];

    columns.forEach(column => {
      cy.get(`[data-test="${column}"]`).scrollIntoView().should('be.visible');
    });
  };

  const openDialog = (buttonDataTest: string) => {
    cy.get(`button[data-test="${buttonDataTest}"]`).first().click();
    cy.get('mat-dialog-container').should('be.visible');
  };

  const verifyColumnSorting = (columnDataTest, orderByColumn) => {
    cy.intercept('GET', `${Cypress.env('api_server')}/users?orderByColumn=${orderByColumn}*`, (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
    }).as(`getSortedUsersBy${orderByColumn.charAt(0).toUpperCase() + orderByColumn.slice(1)}`);

    cy.get(`[data-test="${columnDataTest}"]`).click();
    cy.wait(`@getSortedUsersBy${orderByColumn.charAt(0).toUpperCase() + orderByColumn.slice(1)}`);
    cy.get(`[data-test="${columnDataTest}"]`).children().should('have.class', 'mat-sort-header-sorted');
  };

  const verifyRowNumberBasedOnPageSize = (pageSize) => {
    cy.get('mat-paginator').find('mat-select').click();
    cy.get('mat-option').contains(pageSize.toString()).click();
    cy.get('tr[mat-row]').should('have.length', pageSize);
    cy.wait('@getUsers');
  };

  const verifyPageNavigation = () => {
    cy.get('.users-table__paginator button[aria-label="Next page"]').click();
    cy.wait('@getUsers');
    cy.get('.mat-mdc-paginator-range-label').contains('6').should('be.visible');

    cy.get('.users-table__paginator button[aria-label="Previous page"]').click();
    cy.wait('@getUsers');
    cy.get('.mat-mdc-paginator-range-label').contains('1').should('be.visible');

    cy.get('.users-table__paginator button[aria-label="Last page"]').click();
    cy.wait('@getUsers');
    cy.get('.users-table__paginator button[aria-label="Last page"]').should('be.disabled');

    cy.get('.users-table__paginator button[aria-label="First page"]').click();
    cy.wait('@getUsers');
    cy.get('.users-table__paginator button[aria-label="First page"]').should('be.disabled');
  };
});
